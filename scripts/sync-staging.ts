/**
 * sync:staging — refresh staging DOWN from production (nightly + on-demand).
 *
 *   pnpm sync:staging
 *
 * Replaces the staging D1 with a fresh production export, syncs the production R2 bucket into the
 * staging bucket (via rclone), and mirrors the production redirects KV namespace into staging, so
 * staging mirrors live content — pages, media, and redirects — for accurate review.
 *
 * Auth: needs production-read + staging-write Cloudflare access (CLOUDFLARE_API_TOKEN +
 * CLOUDFLARE_ACCOUNT_ID). Runs in CI on a nightly schedule (see .github/workflows/sync-staging.yml).
 *
 * Non-atomic: there is a brief window where staging is empty between drop and import. Scheduled
 * off-peak. The payload_migrations ledger is carried from prod, keeping staging's migration history
 * aligned with production.
 */
import { rmSync } from 'node:fs'
import path from 'node:path'
import { d1DropAllTables, d1Export, d1Import, kvMirror, rcloneMedia, tempDir } from './_shared'
import { buckets } from '../src/config/site.config'

const dir = tempDir('sync-staging-')
const dump = path.join(dir, 'prod.sql')
try {
  d1Export('production', dump)
  d1DropAllTables('staging')
  d1Import('staging', dump)
  rcloneMedia(buckets.production, buckets.staging)
  kvMirror('production', 'staging')
  console.log('✓ Staging refreshed from production.')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
