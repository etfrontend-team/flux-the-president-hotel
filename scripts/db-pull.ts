/**
 * db:pull — refresh the LOCAL Miniflare D1 with real data from a remote environment.
 *
 *   pnpm db:pull                  # D1 from production (default)
 *   pnpm db:pull --from=staging   # D1 from staging
 *   pnpm db:pull --with-media     # also download media into the local R2 bucket
 *
 * Requires Cloudflare auth (wrangler login, or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID) for
 * the Flux Full Circle account, and the sqlite3 CLI (see README). Stop `pnpm dev` first — it holds
 * the local D1 sqlite file.
 *
 * --with-media is opt-in (off by default) to avoid large downloads, and additionally needs rclone +
 * R2 S3 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY); without them media is skipped.
 *
 * After importing, migrations are applied to the local D1 so its schema matches the branch even if
 * production lags on migrations ("data down, schema up").
 */
import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import path from 'node:path'
import {
  d1Export,
  d1Import,
  killStrayWorkerd,
  pullMediaToLocal,
  repoRoot,
  tempDir,
  wipeLocalD1,
  type Target,
} from './_shared'
import { buckets } from '../src/config/site.config'

const fromArg = process.argv.find((a) => a.startsWith('--from='))?.split('=')[1]
const from: Target = fromArg === 'staging' ? 'staging' : 'production'
const withMedia = process.argv.includes('--with-media')

const dir = tempDir('d1pull-')
const dump = path.join(dir, 'dump.sql')
try {
  d1Export(from, dump)
  // Guard: a running/orphaned `pnpm dev` workerd holds the local D1 open and would clobber the
  // import on its next flush. Stop them before we wipe + import. (Stopping `pnpm dev` first is
  // still good practice — this just makes the pull safe when a stray workerd lingers.)
  killStrayWorkerd()
  wipeLocalD1()
  d1Import('local', dump)
  if (withMedia) pullMediaToLocal(from === 'staging' ? buckets.staging : buckets.production)
  // Reconcile the local schema with the branch's migrations (production may lag).
  console.log('→ applying migrations to local D1')
  execFileSync(path.join(repoRoot, 'node_modules', '.bin', 'payload'), ['migrate'], {
    stdio: 'inherit',
    env: { ...process.env, PAYLOAD_SECRET: 'ignore' },
  })
  console.log(`✓ Local D1 refreshed from ${from}${withMedia ? ' (with media)' : ''}.`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
