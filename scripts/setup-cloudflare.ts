/**
 * One-shot Cloudflare bootstrap for a freshly cloned client repo.
 *
 * Provisions the six per-clone Cloudflare resources (production + staging × D1 / KV / R2) with
 * explicit `wrangler … create`, then patches the two source-of-truth config files from the slug
 * you provide:
 *   - wrangler.jsonc          → worker/D1/R2/KV names, the created resource ids, and uncomments the
 *                               `env.staging` block (custom-domain `routes` stay commented).
 *   - src/config/site.config.ts → slug, domain, brandName, meta, email fallbacks.
 *
 * It does NOT touch git, secrets, or deploy — that human-gated flow (feature branch → PRs into the
 * protected `staging`/`main` branches → CI deploy → `wrangler secret put`) is driven by the
 * `setup-cloudflare` Claude skill (.claude/skills/setup-cloudflare/SKILL.md). Provisioning is the
 * deterministic, idempotent part and lives here.
 *
 * Usage:
 *   pnpm setup:cloudflare --slug=<slug> --domain=<domain> --brand="<Brand Name>" \
 *     [--account-id=<id>] [--meta-title="…"] [--meta-description="…"] [--dry-run] [--force]
 *
 *   --account-id  Cloudflare account id to write into wrangler.jsonc + site.config.ts. If omitted it
 *                 is resolved from the CLOUDFLARE_ACCOUNT_ID env var, else from a single account in
 *                 `wrangler whoami` (fails if multiple — pass it explicitly).
 *   --dry-run     Skip every `wrangler` call and file write; print the intended resources and edits.
 *   --force       Proceed even if wrangler.jsonc no longer shows the `my-app` placeholder name
 *                 (i.e. this repo looks already-cloned). Guards against double-running.
 *
 * Idempotent: re-running reuses existing resources (looked up by name/title) instead of erroring,
 * and the file patches are no-ops once the placeholders are gone.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const repoRoot = process.cwd()
const wranglerBin = path.join(repoRoot, 'node_modules', '.bin', 'wrangler')
const wranglerConfigPath = path.join(repoRoot, 'wrangler.jsonc')
const siteConfigPath = path.join(repoRoot, 'src', 'config', 'site.config.ts')

// ── CLI args ──────────────────────────────────────────────────────────────────────────────────

interface Args {
  slug: string
  domain: string
  brand: string
  metaTitle: string
  metaDescription: string
  accountId?: string
  dryRun: boolean
  force: boolean
}

function parseArgs(argv: string[]): Args {
  const get = (name: string): string | undefined => {
    const hit = argv.find((a) => a.startsWith(`--${name}=`))
    return hit?.slice(name.length + 3)
  }
  const has = (name: string): boolean => argv.includes(`--${name}`)

  const slug = (get('slug') ?? '').trim()
  const domain = (get('domain') ?? '').trim()
  const brand = (get('brand') ?? '').trim()

  if (!slug || !domain || !brand) {
    fail(
      'Missing required argument(s). Usage:\n' +
        '  pnpm setup:cloudflare --slug=<slug> --domain=<domain> --brand="<Brand Name>" \\\n' +
        '    [--account-id=<id>] [--meta-title="…"] [--meta-description="…"] [--dry-run] [--force]',
    )
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    fail(`Invalid --slug "${slug}". Use lowercase letters, digits and hyphens only (e.g. acme-lodge).`)
  }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
    fail(`Invalid --domain "${domain}". Expected a bare apex domain, e.g. acme-lodge.com.`)
  }

  return {
    slug,
    domain,
    brand,
    metaTitle: (get('meta-title') ?? brand).trim(),
    metaDescription: (get('meta-description') ?? `${brand} — official website.`).trim(),
    accountId: (get('account-id') ?? '').trim() || undefined,
    dryRun: has('dry-run'),
    force: has('force'),
  }
}

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

// ── wrangler exec helpers ───────────────────────────────────────────────────────────────────────

let DRY_RUN = false
/** In dry-run, patched files are written here for inspection instead of in place. */
let PREVIEW_DIR: string | undefined

/** Where a patched file is written: a temp preview dir in dry-run, else the real path in place. */
function destFor(realPath: string): string {
  return PREVIEW_DIR ? path.join(PREVIEW_DIR, path.basename(realPath)) : realPath
}

/** Run wrangler and capture stdout. Throws on non-zero exit. */
function wranglerCapture(args: string[]): string {
  return execFileSync(wranglerBin, args, { cwd: repoRoot, encoding: 'utf8' })
}

/** Run wrangler, capturing output; return null instead of throwing on failure (e.g. "already exists"). */
function tryWranglerCapture(args: string[]): string | null {
  try {
    return wranglerCapture(args)
  } catch {
    return null
  }
}

/**
 * Resolve the Cloudflare account id, in order: explicit `--account-id` → `CLOUDFLARE_ACCOUNT_ID` env
 * → the single 32-hex account id parsed from `wrangler whoami`. Fails (asking for --account-id) if it
 * can't determine exactly one — the skill resolves multi-account ambiguity before calling this script.
 */
function resolveAccountId(explicit: string | undefined): string {
  if (explicit) return explicit
  const fromEnv = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  if (fromEnv) return fromEnv
  const whoami = tryWranglerCapture(['whoami'])
  if (whoami) {
    const unique = [...new Set([...whoami.matchAll(/\b[0-9a-f]{32}\b/gi)].map((m) => m[0]))]
    if (unique.length === 1) return unique[0]
    if (unique.length > 1) {
      fail(
        'Multiple Cloudflare accounts found via `wrangler whoami`. Pass --account-id=<id> explicitly ' +
          `(one of: ${unique.join(', ')}).`,
      )
    }
  }
  fail('Could not determine the Cloudflare account id. Pass --account-id=<id> or set CLOUDFLARE_ACCOUNT_ID.')
}

// ── resource provisioning (idempotent: look up first, create only if absent) ──────────────────────

/** Ensure a D1 database `name` exists; return its database_id. */
function ensureD1(name: string): string {
  if (DRY_RUN) return `DRYRUN-D1-${name}`
  const existing = findD1Id(name)
  if (existing) {
    console.log(`  • D1 "${name}" already exists (${existing})`)
    return existing
  }
  console.log(`  → creating D1 "${name}"`)
  tryWranglerCapture(['d1', 'create', name])
  const id = findD1Id(name)
  if (!id) fail(`Created D1 "${name}" but could not resolve its database_id from \`wrangler d1 list\`.`)
  return id
}

/** Resolve a D1 database_id by name via `wrangler d1 list --json` (field is `uuid`). */
function findD1Id(name: string): string | undefined {
  const json = tryWranglerCapture(['d1', 'list', '--json'])
  if (!json) return undefined
  const rows = JSON.parse(json) as Array<{ uuid?: string; name?: string }>
  return rows.find((r) => r.name === name)?.uuid
}

/** Ensure a KV namespace with `title` exists; return its id. Title carries any `-staging` suffix. */
function ensureKv(title: string): string {
  if (DRY_RUN) return `DRYRUN-KV-${title}`
  const existing = findKvId(title)
  if (existing) {
    console.log(`  • KV "${title}" already exists (${existing})`)
    return existing
  }
  // NB: pass the slug-suffixed title as the argument and OMIT --env — with `--env staging` wrangler
  // would prefix the title as `staging-<slug>` instead of the intended `<slug>-staging`.
  console.log(`  → creating KV "${title}"`)
  tryWranglerCapture(['kv', 'namespace', 'create', title])
  const id = findKvId(title)
  if (!id) fail(`Created KV "${title}" but could not resolve its id from \`wrangler kv namespace list\`.`)
  return id
}

/** Resolve a KV namespace id by title via `wrangler kv namespace list`. */
function findKvId(title: string): string | undefined {
  const json = tryWranglerCapture(['kv', 'namespace', 'list'])
  if (!json) return undefined
  const rows = JSON.parse(json) as Array<{ id?: string; title?: string }>
  return rows.find((r) => r.title === title)?.id
}

/** Ensure an R2 bucket `name` exists. R2 buckets are referenced by name, so there is no id to return. */
function ensureR2(name: string): void {
  if (DRY_RUN) {
    console.log(`  • (dry-run) would ensure R2 bucket "${name}"`)
    return
  }
  // `r2 bucket create` errors if it already exists; tolerate that (idempotent).
  console.log(`  → ensuring R2 bucket "${name}"`)
  tryWranglerCapture(['r2', 'bucket', 'create', name])
}

// ── config file patching ──────────────────────────────────────────────────────────────────────

interface Ids {
  prodD1: string
  stagingD1: string
  prodKv: string
  stagingKv: string
}

/**
 * Set a resource id immediately after the matching `"binding": "<binding>",` line — replacing any
 * existing id line (placeholder or real) or inserting one if absent. Anchoring on the binding line
 * (rather than a `DATABASE_ID`/`KV_ID` placeholder value) makes this resilient whether the clone
 * still carries the placeholders or has had them stripped (e.g. while trialling auto-provisioning).
 * The binding line's own indentation is reused, so prod (top-level) and staging (nested) both work.
 */
function setIdAfterBinding(text: string, binding: string, idKey: string, idValue: string): string {
  const re = new RegExp(
    `([ \\t]*)"binding":\\s*"${binding}",[ \\t]*\\n` + // binding line (capture its indent)
      `(?:[ \\t]*"${idKey}":\\s*"[^"]*",[ \\t]*\\n)?`, //   optional existing id line (swallowed)
  )
  return text.replace(re, (_m, indent: string) => `${indent}"binding": "${binding}",\n${indent}"${idKey}": "${idValue}",\n`)
}

/**
 * Patch wrangler.jsonc. The staging block is a `/* … *​/` comment in the pristine boilerplate; we
 * isolate it, apply the STAGING ids/names inside it, then uncomment it — while the production
 * (top-level) ids/names are applied to the rest of the file. Processing the two regions separately
 * keeps prod and staging ids from colliding (both blocks use the same binding names). Comments are
 * preserved (targeted string edits, never a JSON parse-and-rewrite). Custom-domain `routes` stay
 * commented.
 */
function patchWranglerConfig(args: Args, ids: Ids, accountId: string): { changed: boolean; summary: string[] } {
  const original = readFileSync(wranglerConfigPath, 'utf8')
  const summary: string[] = []

  // 1. Isolate the commented staging block: `/* Uncomment this to enable staging … */`.
  const stagingBlockRe = /\/\* Uncomment this to enable staging[\s\S]*?\*\//
  const match = original.match(stagingBlockRe)

  let staging = ''
  let outerHead = original
  let outerTail = ''
  if (match) {
    const start = match.index!
    const end = start + match[0].length
    outerHead = original.slice(0, start)
    outerTail = original.slice(end)
    // Strip the opening `/* Uncomment …` line and the trailing ` */` so the inner JSON goes live.
    staging = match[0]
      .replace(/^\/\* Uncomment this to enable staging[^\n]*\n/, '')
      .replace(/\n[ \t]*\*\/\s*$/, '\n')
    // Apply STAGING ids inside the staging block only.
    staging = setIdAfterBinding(staging, 'D1', 'database_id', ids.stagingD1)
    staging = setIdAfterBinding(staging, 'KV', 'id', ids.stagingKv)
    summary.push('uncommented env.staging block; set staging D1/KV ids')
  } else {
    // Block already uncommented (unusual — a partially-configured repo). The prod replacements below
    // only touch the first binding occurrence, so flag that staging ids should be checked by hand.
    summary.push('env.staging block already uncommented — verify its D1/KV ids manually')
  }

  // 2. Apply PRODUCTION (top-level) ids to the outer region only.
  outerHead = setIdAfterBinding(outerHead, 'D1', 'database_id', ids.prodD1)
  outerHead = setIdAfterBinding(outerHead, 'KV', 'id', ids.prodKv)

  // 3. Reassemble, then rename `my-app` → slug everywhere (covers name/database_name/bucket_name in
  //    both regions plus `my-app-staging` → `<slug>-staging`, since it contains `my-app`).
  let next = outerHead + staging + outerTail
  next = next.split('my-app').join(args.slug)
  summary.push(`renamed my-app → ${args.slug} (worker/D1/R2/KV names)`)

  // 4. Pin the top-level account_id immediately after the "name" line — inserting it (the pristine
  //    boilerplate omits account_id so wrangler uses the logged-in account / CLOUDFLARE_ACCOUNT_ID
  //    during provisioning) or replacing an existing one on a re-run. Anchored on the FIRST "name"
  //    line (top-level/production); the staging block inherits account_id, so it must NOT get its own.
  const accountRe = /^([ \t]*)"name":\s*"[^"]*",[ \t]*\n([ \t]*"account_id":\s*"[^"]*",[ \t]*\n)?/m
  next = next.replace(accountRe, (_m, indent: string) => `${indent}"name": "${args.slug}",\n${indent}"account_id": "${accountId}",\n`)
  summary.push('set account_id')

  if (next === original) return { changed: false, summary: ['wrangler.jsonc already configured'] }
  writeFileSync(destFor(wranglerConfigPath), next)
  return { changed: true, summary }
}

/** Patch the brand identifiers in src/config/site.config.ts (plain TS, unique string literals). */
function patchSiteConfig(args: Args, accountId: string): { changed: boolean; summary: string[] } {
  const original = readFileSync(siteConfigPath, 'utf8')
  const replacements: Array<[RegExp, string, string]> = [
    [/slug: '[^']*'/, `slug: '${args.slug}'`, 'slug'],
    [/domain: '[^']*'/, `domain: '${args.domain}'`, 'domain'],
    [/brandName: '[^']*'/, `brandName: '${escapeSingle(args.brand)}'`, 'brandName'],
    [/title: 'Meta Title'/, `title: '${escapeSingle(args.metaTitle)}'`, 'meta.title'],
    [/description: 'Meta Description\.'/, `description: '${escapeSingle(args.metaDescription)}'`, 'meta.description'],
    [/defaultFrom: '[^']*'/, `defaultFrom: 'noreply@${args.domain}'`, 'email.defaultFrom'],
    [/contactInbox: '[^']*'/, `contactInbox: 'hello@${args.domain}'`, 'email.contactInbox'],
    [/cloudflareAccountId: '[^']*'/, `cloudflareAccountId: '${accountId}'`, 'cloudflareAccountId'],
  ]
  let next = original
  const summary: string[] = []
  for (const [re, value, label] of replacements) {
    if (re.test(next)) {
      next = next.replace(re, value)
      summary.push(label)
    }
  }
  if (next === original) return { changed: false, summary: ['site.config.ts already configured'] }
  writeFileSync(destFor(siteConfigPath), next)
  return { changed: true, summary: [`set ${summary.join(', ')}`] }
}

/** Escape single quotes for safe insertion into a single-quoted TS string literal. */
function escapeSingle(value: string): string {
  return value.replace(/'/g, "\\'")
}

// ── guards ────────────────────────────────────────────────────────────────────────────────────

/** Refuse to run on a repo that no longer carries the `my-app` placeholder, unless --force. */
function assertNotAlreadyCloned(force: boolean): void {
  if (force) return
  const wranglerText = readFileSync(wranglerConfigPath, 'utf8')
  if (!wranglerText.includes('"name": "my-app"')) {
    fail(
      'wrangler.jsonc no longer shows the `my-app` placeholder name — this repo looks already ' +
        'cloned. Re-run with --force if you really intend to reconfigure it.',
    )
  }
}

// ── main ────────────────────────────────────────────────────────────────────────────────────────

function main(): void {
  const args = parseArgs(process.argv.slice(2))
  DRY_RUN = args.dryRun

  if (!existsSync(wranglerConfigPath)) fail(`wrangler.jsonc not found at ${wranglerConfigPath}. Run from the repo root.`)
  if (!existsSync(siteConfigPath)) fail(`site.config.ts not found at ${siteConfigPath}. Run from the repo root.`)
  assertNotAlreadyCloned(args.force)

  if (DRY_RUN) PREVIEW_DIR = mkdtempSync(path.join(tmpdir(), 'setup-cloudflare-'))

  const accountId = resolveAccountId(args.accountId)

  console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}Cloudflare bootstrap for "${args.slug}" (${args.domain}) — account ${accountId}\n`)

  console.log('Provisioning resources (production + staging × D1 / KV / R2):')
  const ids: Ids = {
    prodD1: ensureD1(args.slug),
    stagingD1: ensureD1(`${args.slug}-staging`),
    prodKv: ensureKv(args.slug),
    stagingKv: ensureKv(`${args.slug}-staging`),
  }
  ensureR2(args.slug)
  ensureR2(`${args.slug}-staging`)

  console.log('\nPatching config files:')
  const wr = patchWranglerConfig(args, ids, accountId)
  console.log(`  wrangler.jsonc: ${wr.summary.join('; ')}`)
  const sc = patchSiteConfig(args, accountId)
  console.log(`  site.config.ts: ${sc.summary.join('; ')}`)

  // Safety net: no placeholders should remain after patching (checked against the written output,
  // which is the in-place file on a real run or the preview copy in dry-run).
  const checkPath = existsSync(destFor(wranglerConfigPath)) ? destFor(wranglerConfigPath) : wranglerConfigPath
  const after = readFileSync(checkPath, 'utf8')
  const leftovers = ['DATABASE_ID', 'KV_ID', 'my-app'].filter((p) => after.includes(p))
  if (leftovers.length > 0) {
    fail(`wrangler.jsonc still contains placeholder(s) after patching: ${leftovers.join(', ')}. Inspect manually.`)
  }
  if (!DRY_RUN && !/"account_id":\s*"/.test(after)) {
    fail('wrangler.jsonc has no account_id after patching — inspect manually.')
  }
  if (PREVIEW_DIR) console.log(`\n[dry-run] patched previews written to: ${PREVIEW_DIR}`)

  console.log('\nResource ids:')
  console.log(`  production : D1=${ids.prodD1}  KV=${ids.prodKv}`)
  console.log(`  staging    : D1=${ids.stagingD1}  KV=${ids.stagingKv}`)

  console.log(
    '\n✓ Resources provisioned and config patched.' +
      (DRY_RUN ? ' (dry-run — nothing was created or written)' : '') +
      '\n\nThis step only provisioned resources and patched config. The setup-cloudflare skill drives\n' +
      'the rest end-to-end:\n' +
      '  1. Review the wrangler.jsonc + site.config.ts diff.\n' +
      '  2. Commit + push (first run: directly to main, and a staging branch) → CI deploys both Workers.\n' +
      '  3. Set each PAYLOAD_SECRET Worker secret (auto-generated, distinct per environment).\n' +
      '  4. Set up the production Environment.\n' +
      '  5. Custom-domain routes + apex→www redirect stay manual until the zone/domain is owned.\n',
  )
}

main()
