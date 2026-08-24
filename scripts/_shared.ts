/**
 * Shared helpers for the data-sync / promotion scripts.
 *
 * These wrap `wrangler` (resolved from node_modules/.bin) for D1 export/import, and an optional
 * `rclone` for R2 media copy between REMOTE buckets (S3 API). See README "Three environments".
 *
 * Environment targets:
 *   - local      → Miniflare local D1/R2                  (wrangler --local)
 *   - staging    → <slug>-staging (remote)                (wrangler --remote --env staging)
 *   - production → <slug> (remote, top-level)             (wrangler --remote)
 */
import 'dotenv/config' // load .env so local runs pick up R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { buckets, site } from '../src/config/site.config'

export type Target = 'local' | 'staging' | 'production'

export const repoRoot = process.cwd()
const wranglerBin = path.join(repoRoot, 'node_modules', '.bin', 'wrangler')

/** wrangler args that select the D1 instance for a given environment target. */
export function targetArgs(target: Target): string[] {
  switch (target) {
    case 'local':
      return ['--local']
    case 'staging':
      return ['--remote', '--env', 'staging']
    case 'production':
      return ['--remote']
  }
}

/** Run a command, streaming output. Throws on non-zero exit. */
export function run(cmd: string, args: string[], env: NodeJS.ProcessEnv = process.env): void {
  execFileSync(cmd, args, { stdio: 'inherit', env, cwd: repoRoot })
}

/** Run wrangler, streaming output. */
export function wrangler(args: string[]): void {
  run(wranglerBin, args)
}

/** Run wrangler and capture stdout (used for --json queries). */
export function wranglerCapture(args: string[]): string {
  return execFileSync(wranglerBin, args, { cwd: repoRoot, encoding: 'utf8' })
}

/** Create a throwaway temp directory; caller cleans it up. */
export function tempDir(prefix: string): string {
  return mkdtempSync(path.join(tmpdir(), prefix))
}

/**
 * Export the D1 database for `from` (schema + data) to a .sql file.
 *
 * `wrangler d1 export --remote` snapshots the whole DB through a slower polling API that Cloudflare
 * occasionally times out (even for tiny DBs) — see the "request to Cloudflare's API timed out" error.
 * We retry transient failures. Correctness on retry is guaranteed three ways: (1) each attempt starts
 * from a freshly-deleted output file, so a partial dump from a timed-out attempt can never be reused
 * or appended to; (2) wrangler writes the file and exits 0 only when the export COMPLETES — a timeout
 * exits non-zero (execFileSync throws) and that attempt is discarded; (3) before trusting a "success"
 * we verify the file is non-empty and contains schema (`CREATE TABLE`). Only a fully-written dump is
 * ever returned to the caller, so the subsequent wipe+import always loads complete data.
 */
export function d1Export(from: Target, outFile: string): void {
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    rmSync(outFile, { force: true }) // clean slate — never reuse a previous (possibly partial) dump
    const suffix = attempt > 1 ? ` — attempt ${attempt}/${maxAttempts}` : ''
    console.log(`→ exporting D1 (${from})${suffix}`)
    let failure: string | undefined
    try {
      wrangler(['d1', 'export', 'D1', ...targetArgs(from), '--output', outFile])
      // Clean exit: confirm wrangler actually produced a complete schema+data dump.
      if (!existsSync(outFile) || statSync(outFile).size === 0) {
        failure = 'wrangler exited 0 but produced an empty dump'
      } else if (!readFileSync(outFile, 'utf8').includes('CREATE TABLE')) {
        failure = 'dump is missing schema (no CREATE TABLE) — treating as incomplete'
      }
    } catch (error) {
      failure = error instanceof Error ? error.message.split('\n')[0] : String(error)
    }
    if (!failure) return // complete dump written
    rmSync(outFile, { force: true }) // discard the bad/partial dump
    if (attempt === maxAttempts) {
      throw new Error(`D1 export (${from}) failed after ${maxAttempts} attempts: ${failure}`)
    }
    console.warn(`⚠ export failed (${failure}); retrying in ${attempt * 2}s…`)
    sleepSync(attempt * 2000) // simple linear backoff
  }
}

/** Run a `--json` query against the target D1 and return the first result set. */
function d1Query<T = Record<string, unknown>>(target: Target, sql: string): T[] {
  const json = wranglerCapture(['d1', 'execute', 'D1', ...targetArgs(target), '--json', '--command', sql])
  // wrangler --json shape: [{ results: [...], success, meta }]
  const parsed = JSON.parse(json) as Array<{ results: T[] }>
  return parsed[0]?.results ?? []
}

/** Drop all user tables in the `target` D1 so a full import can recreate them cleanly. */
export function d1DropAllTables(target: Target): void {
  const tables = d1Query<{ name: string }>(
    target,
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%';",
  ).map((r) => r.name)
  if (tables.length === 0) {
    console.log(`  (${target} D1 has no tables to drop)`)
    return
  }
  // Disable FK enforcement so DROP doesn't trigger implicit cascade DELETEs (which fail when a
  // referenced table has already been dropped). With FK off, drop order is irrelevant.
  // `PRAGMA foreign_keys=OFF` is honoured by D1's `d1 execute --file`; `defer_foreign_keys` is NOT
  // a substitute (it defers checks to COMMIT, by which point the tables are gone → "no such table").
  const sql = ['PRAGMA foreign_keys = OFF;', ...tables.map((t) => `DROP TABLE IF EXISTS "${t}";`)].join('\n')
  const dir = tempDir('d1drop-')
  try {
    const dropFile = path.join(dir, 'drop.sql')
    writeFileSync(dropFile, sql)
    console.log(`→ dropping ${tables.length} table(s) in ${target} D1`)
    wrangler(['d1', 'execute', 'D1', ...targetArgs(target), '--file', dropFile, '--yes'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/** Path to the local Miniflare D1 sqlite directory. */
const miniflareD1Dir = path.join(repoRoot, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject')

/**
 * Import a dump into the LOCAL Miniflare D1 via the sqlite3 CLI.
 *
 * `wrangler d1 export` orders some child tables/inserts before their parent (e.g. users_sessions
 * before users) and relies on `PRAGMA defer_foreign_keys`, which only works inside a transaction.
 * Remote D1 runs the file as one transaction so it works there, but Miniflare's `--file` executor
 * runs statements in autocommit AND ignores `PRAGMA foreign_keys=OFF`, so the order fails. The
 * sqlite3 CLI honours foreign_keys=OFF, so we use it to write Miniflare's sqlite file directly.
 */
function d1ImportLocal(file: string): void {
  try {
    execFileSync('sqlite3', ['--version'], { stdio: 'ignore' })
  } catch {
    throw new Error(
      'sqlite3 CLI is required for a local `db:pull` import. macOS ships it; otherwise install it ' +
        '(e.g. `brew install sqlite3` or `apt-get install sqlite3`).',
    )
  }
  // Recreate an empty local D1 so the (deterministically-named) sqlite file exists, then import.
  wrangler(['d1', 'execute', 'D1', '--local', '--command', 'SELECT 1;'])
  const sqliteFile = readdirSync(miniflareD1Dir).find((f) => f.endsWith('.sqlite'))
  if (!sqliteFile) throw new Error(`Local Miniflare D1 file not found under ${miniflareD1Dir}`)
  // Strip sqlite_stat1 inserts (query-planner stats, regenerated by ANALYZE — non-essential).
  const dump = readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.startsWith('INSERT INTO "sqlite_stat1"'))
    .join('\n')
  console.log('→ importing into local Miniflare D1 via sqlite3 (FK off)')
  execFileSync('sqlite3', [path.join(miniflareD1Dir, sqliteFile)], {
    input: `PRAGMA foreign_keys=OFF;\n${dump}`,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
}

/** Import a .sql dump into the `target` D1. */
export function d1Import(target: Target, file: string): void {
  console.log(`→ importing dump into ${target} D1`)
  if (target === 'local') {
    d1ImportLocal(file)
    return
  }
  // Remote D1 runs the file as a single transaction, so the dump's own `PRAGMA defer_foreign_keys`
  // resolves the parent-before-child ordering at COMMIT.
  wrangler(['d1', 'execute', 'D1', ...targetArgs(target), '--file', file, '--yes'])
}

/** List PIDs of `workerd` processes belonging to THIS repo (its binary lives under repoRoot). */
function findRepoWorkerdPids(): number[] {
  try {
    return execFileSync('pgrep', ['-f', `${repoRoot}/node_modules/.*workerd`], { encoding: 'utf8' })
      .split('\n')
      .map((line) => Number(line.trim()))
      .filter((n) => Number.isInteger(n) && n > 0)
  } catch {
    // pgrep exits non-zero when there is no match (or isn't installed) — treat as none.
    return []
  }
}

/** Synchronous sleep (no extra process) — used to give workerd a moment to shut down cleanly. */
function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

/**
 * Stop any leftover Miniflare `workerd` processes belonging to THIS repo before we touch the
 * local D1 files. A Ctrl-C'd `pnpm dev` can leave orphaned workerd (reparented to launchd/init)
 * that keep the local D1 sqlite open; if one survives into a `db:pull` it clobbers the
 * freshly-imported data on its next WAL flush (the DB ends up schema-only → "create first user").
 *
 * We send SIGTERM first and wait, so workerd checkpoints its SQLite WAL on the way out — a hard
 * SIGKILL would leave a dirty WAL that makes the NEXT `next build` crash with
 * `SQLITE_BUSY_RECOVERY` (its parallel workers collide recovering it). SIGKILL is only a fallback
 * for stragglers. No-op when none are running. Uses pgrep/kill, so macOS/Linux only (the dev/sync
 * workflow already assumes a Unix shell + the sqlite3 CLI).
 */
export function killStrayWorkerd(): void {
  const pids = findRepoWorkerdPids()
  if (pids.length === 0) return
  console.log(`→ stopping ${pids.length} stray workerd process(es) holding the local D1`)
  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM') // graceful: lets workerd checkpoint its WAL before exiting
    } catch {
      // already exited between pgrep and here — fine.
    }
  }
  // Wait (up to ~3s) for a clean exit; SIGKILL anything that refuses to go.
  for (let i = 0; i < 15 && findRepoWorkerdPids().length > 0; i++) sleepSync(200)
  for (const pid of findRepoWorkerdPids()) {
    try {
      process.kill(pid, 'SIGKILL')
    } catch {
      // already exited — fine.
    }
  }
}

/** Delete the local Miniflare D1 sqlite files so the next import recreates a clean database. */
export function wipeLocalD1(): void {
  const dir = path.join(repoRoot, '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject')
  if (!existsSync(dir)) return
  for (const f of readdirSync(dir)) rmSync(path.join(dir, f), { force: true })
  console.log('→ wiped local Miniflare D1')
}

/**
 * Build an rclone env that defines a single `R2` S3 remote for the whole account (one R2 API token
 * can read/write every bucket in the account). Returns null (with a warning) — i.e. media sync is
 * skipped — when rclone is unavailable or the R2 S3 credentials are not set.
 *
 * Required env: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (an R2 API token's S3 credentials), and
 * CLOUDFLARE_ACCOUNT_ID (for the S3 endpoint).
 */
function r2RcloneEnv(): NodeJS.ProcessEnv | null {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || site.cloudflareAccountId
  if (!accessKeyId || !secretAccessKey) {
    console.warn('⚠ media sync skipped — set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY (an R2 S3 token) to enable.')
    return null
  }
  try {
    execFileSync('rclone', ['version'], { stdio: 'ignore' })
  } catch {
    console.warn('⚠ rclone not found — skipping media sync. Install rclone to enable it.')
    return null
  }
  return {
    ...process.env,
    RCLONE_CONFIG_R2_TYPE: 's3',
    RCLONE_CONFIG_R2_PROVIDER: 'Cloudflare',
    RCLONE_CONFIG_R2_ACCESS_KEY_ID: accessKeyId,
    RCLONE_CONFIG_R2_SECRET_ACCESS_KEY: secretAccessKey,
    RCLONE_CONFIG_R2_ENDPOINT: `https://${accountId}.r2.cloudflarestorage.com`,
    RCLONE_CONFIG_R2_REGION: 'auto',
    // Bucket-scoped R2 tokens can't HeadBucket/CreateBucket; skip that check.
    RCLONE_CONFIG_R2_NO_CHECK_BUCKET: 'true',
  }
}

/** Recursively list absolute file paths under `dir`. */
function listFilesRecursive(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? listFilesRecursive(full) : [full]
  })
}

/** Copy media objects between two REMOTE R2 buckets (S3-to-S3) — used by the staging down-sync. */
export function rcloneMedia(srcBucket: string, dstBucket: string): void {
  const env = r2RcloneEnv()
  if (!env) return
  console.log(`→ rclone sync R2:${srcBucket} → R2:${dstBucket}`)
  run('rclone', ['sync', `R2:${srcBucket}`, `R2:${dstBucket}`, '--progress'], env)
}

/**
 * KV binding backing CMS-managed redirects. The code-facing binding name is identical in every
 * environment (only the namespace title/id differs — see wrangler.jsonc), so passing `--binding`
 * lets wrangler resolve the correct per-env namespace id from config. No ids to hardcode here.
 */
const KV_BINDING = 'KV'

/** List every key name in the redirects KV namespace for `target` (wrangler paginates internally). */
function kvKeys(target: Target): string[] {
  const json = wranglerCapture(['kv', 'key', 'list', '--binding', KV_BINDING, ...targetArgs(target)])
  return (JSON.parse(json) as Array<{ name: string }>).map((k) => k.name)
}

/**
 * Mirror the redirects KV namespace `from` → `to` (full replace): copy every key/value across, then
 * delete keys in `to` that no longer exist in `from`, so `to` ends up identical to `from`. Used by
 * sync:staging so reviewers see production's live redirects. Needs no extra credentials beyond
 * CLOUDFLARE_API_TOKEN (the D1 sync already requires it).
 *
 * `kv bulk get` is an open-beta wrangler command (pinned wrangler 4.x). Its output shape
 * DIFFERS by mode (verified against the wrangler 4.98.0 bundle):
 *   - remote (what sync:staging uses): `{ "<key>": "<value-string>" }` — the API's
 *     `result.values`, where each value is the raw string.
 *   - local (`--local`):              `{ "<key>": { "value": "<string>", "metadata"?: <json> } }`.
 * We normalise both below. Recheck on every wrangler bump (open beta → shape may change).
 */
export function kvMirror(from: Target, to: Target): void {
  console.log(`→ mirroring redirects KV (${from} → ${to})`)
  const srcKeys = kvKeys(from)
  const dstKeys = kvKeys(to)
  const dir = tempDir('kvmirror-')
  try {
    if (srcKeys.length > 0) {
      // Fetch all source values in one bulk call, then bulk-write them into the destination.
      const keysFile = path.join(dir, 'keys.json')
      writeFileSync(keysFile, JSON.stringify(srcKeys))
      const got = JSON.parse(
        wranglerCapture(['kv', 'bulk', 'get', keysFile, '--binding', KV_BINDING, ...targetArgs(from)]),
      ) as Record<string, string | { value: string; metadata?: unknown }>
      // Normalise both shapes (see doc comment): remote yields a raw string per key,
      // local yields `{ value, metadata? }`. `kv bulk put` wants `{ key, value, metadata? }`.
      const entries = Object.entries(got).map(([key, v]) => {
        if (typeof v === 'string') return { key, value: v }
        return v.metadata == null ? { key, value: v.value } : { key, value: v.value, metadata: v.metadata }
      })
      const putFile = path.join(dir, 'put.json')
      writeFileSync(putFile, JSON.stringify(entries))
      console.log(`  → writing ${entries.length} key(s) to ${to}`)
      wrangler(['kv', 'bulk', 'put', putFile, '--binding', KV_BINDING, ...targetArgs(to)])
    }
    // Delete keys in `to` that are absent from `from` so the mirror has no leftovers.
    const stale = dstKeys.filter((k) => !srcKeys.includes(k))
    if (stale.length > 0) {
      const delFile = path.join(dir, 'delete.json')
      writeFileSync(delFile, JSON.stringify(stale))
      console.log(`  → deleting ${stale.length} stale key(s) from ${to}`)
      wrangler(['kv', 'bulk', 'delete', delFile, '--binding', KV_BINDING, '--force', ...targetArgs(to)])
    }
    console.log(`  ✓ redirects KV mirrored (${srcKeys.length} key(s))`)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

/**
 * Populate the LOCAL Miniflare R2 bucket with media from a remote bucket (used by `db:pull --with-media`).
 *
 * The local Miniflare R2 is not S3-addressable, so rclone can't write to it directly. Instead we
 * download the remote bucket to a temp dir, then put each object into the local bucket via
 * `wrangler r2 object put --local`. `localBucket` is the bucket NAME bound at the top level.
 */
export function pullMediaToLocal(srcBucket: string, localBucket = buckets.production): void {
  const env = r2RcloneEnv()
  if (!env) return
  const dir = tempDir('media-')
  try {
    console.log(`→ downloading media from R2:${srcBucket}`)
    run('rclone', ['sync', `R2:${srcBucket}`, dir, '--progress'], env)
    const files = listFilesRecursive(dir)
    if (files.length === 0) {
      console.log('  (no media objects to load)')
      return
    }
    console.log(`→ loading ${files.length} object(s) into local R2 bucket ${localBucket}`)
    for (const abs of files) {
      const key = path.relative(dir, abs)
      wrangler(['r2', 'object', 'put', `${localBucket}/${key}`, '--local', '--file', abs])
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
