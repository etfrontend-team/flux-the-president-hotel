/**
 * check:migrations — fail if the Payload schema has drifted from the committed migrations.
 *
 *   pnpm check:migrations
 *
 * Runs `payload migrate:create` (which does NOT connect to a database — no Cloudflare credentials
 * needed) to generate a throwaway migration, then inspects its contents: if it contains any SQL
 * statements the committed migrations are out of date → fail. The throwaway files are always
 * removed afterwards. (We detect emptiness by content because the d1-sqlite adapter does not honour
 * `--skip-empty` — it writes an empty `// Migration code` template even when there is no drift.)
 *
 * Used as a CI gate (.github/workflows/ci.yml).
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const migrationsDir = path.join(repoRoot, 'src', 'migrations')
const payloadBin = path.join(repoRoot, 'node_modules', '.bin', 'payload')
const NAME = '__drift_check'

const gitStatus = (): string =>
  execFileSync('git', ['status', '--porcelain', 'src/migrations'], { cwd: repoRoot, encoding: 'utf8' }).trim()

// Refuse to run with pre-existing uncommitted migration changes, so cleanup can't clobber real work.
if (gitStatus()) {
  console.error('src/migrations has uncommitted changes — commit or stash them before the drift check.')
  process.exit(1)
}

console.log('→ generating a throwaway migration to detect schema drift…')
execFileSync(payloadBin, ['migrate:create', NAME, '--force-accept-warning'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: { ...process.env, PAYLOAD_SECRET: 'ignore', CLOUDFLARE_ENV: '' },
})

// The generated migration is the .ts file whose name contains the drift marker.
const generated = readdirSync(migrationsDir).filter((f) => f.includes(NAME) && f.endsWith('.ts'))
const hasDrift = generated.some((f) => readFileSync(path.join(migrationsDir, f), 'utf8').includes('db.run('))

// Always clean up: remove generated files and restore index.ts.
for (const f of readdirSync(migrationsDir).filter((f) => f.includes(NAME))) {
  rmSync(path.join(migrationsDir, f), { force: true })
}
execFileSync('git', ['checkout', '--', 'src/migrations/index.ts'], { cwd: repoRoot })

if (hasDrift) {
  console.error(
    '\n✗ Migration drift detected — the Payload schema differs from committed migrations.\n' +
      '  Run `pnpm migrate:create <name>` locally and commit the generated files.',
  )
  process.exit(1)
}

console.log('✓ No migration drift.')
