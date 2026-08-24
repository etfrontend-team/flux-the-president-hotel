/**
 * promote:staging — push locally-authored content UP to staging for review (build phase).
 *
 *   pnpm promote:staging
 *
 * Copies the LOCAL D1 into the staging D1 (full replace). Intended for the initial build, when
 * staging starts empty; safe to re-run (staging tables are dropped and recreated from the local dump).
 *
 * Auth: a STAGING-scoped Cloudflare token is sufficient — off-shore need NO production credentials.
 * Set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID to a token limited to the staging D1/R2.
 *
 * Media: remote↔remote only. The local Miniflare R2 bucket cannot be rclone-synced, so media
 * uploaded purely locally is not promoted here (v1 limitation — see README). rcloneMedia is wired
 * for environments where a local R2 S3 remote is configured; otherwise it is skipped with a warning.
 */
import { rmSync } from 'node:fs'
import path from 'node:path'
import { d1DropAllTables, d1Export, d1Import, tempDir } from './_shared'

const dir = tempDir('promote-staging-')
const dump = path.join(dir, 'local.sql')
try {
  d1Export('local', dump)
  d1DropAllTables('staging')
  d1Import('staging', dump)
  // Media is NOT pushed here: the local Miniflare R2 is not S3-addressable, so it can't be rclone'd
  // to the staging bucket. Upload media via the staging admin, or author it where the bucket is
  // remote. (Down-sync — prod→staging/local — is fully automated; see sync:staging / db:pull.)
  console.log('✓ Promoted local content (D1) to staging. Media not included — see note in this script.')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
