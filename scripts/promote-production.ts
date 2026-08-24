/**
 * promote:production — one-time go-live content promotion to PRODUCTION (in-house only).
 *
 *   CONFIRM=promote pnpm promote:production --from=staging   # default source: staging
 *   CONFIRM=promote pnpm promote:production --from=local
 *
 * Copies content from the chosen source into the production D1 and R2. This is a DESTRUCTIVE full
 * replace of production content — only run at initial go-live, before the client owns prod content.
 * After launch, production is the source of truth: do NOT run this (it would clobber live content).
 *
 * Guarded by CONFIRM=promote to prevent accidental execution. Requires production Cloudflare creds.
 */
import { rmSync } from 'node:fs'
import path from 'node:path'
import { d1DropAllTables, d1Export, d1Import, rcloneMedia, tempDir, type Target } from './_shared'
import { buckets } from '../src/config/site.config'

if (process.env.CONFIRM !== 'promote') {
  console.error('Refusing to run: set CONFIRM=promote to confirm a PRODUCTION content promotion.')
  process.exit(1)
}

const fromArg = process.argv.find((a) => a.startsWith('--from='))?.split('=')[1]
const from: Target = fromArg === 'local' ? 'local' : 'staging'

const dir = tempDir('promote-prod-')
const dump = path.join(dir, `${from}.sql`)
try {
  d1Export(from, dump)
  d1DropAllTables('production')
  d1Import('production', dump)
  if (from === 'staging') {
    // staging → prod is remote→remote, so media can be synced via the S3 API.
    rcloneMedia(buckets.staging, buckets.production)
  } else {
    // local → prod: the local Miniflare R2 is not S3-addressable; upload media via the prod admin
    // or promote from staging instead.
    console.log('→ media not pushed (local source). Upload via the prod admin or promote from staging.')
  }
  console.log(`✓ Promoted ${from} content to PRODUCTION.`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
