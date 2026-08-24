import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { anyone, isAdmin, isAdminOrEditor } from './access'
import { site } from './config/site.config'
import { getCSRFOrigins, getServerURL } from './lib/serverUrl'
import { syncRedirectsAfterChange, syncRedirectsAfterDelete } from './lib/redirects'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => realpath(value).endsWith(path.join('payload', 'bin.js')))
// NODE_ENV distinguishes deployed (production) from local (next dev). It drives the logger and
// remoteBindings below and must stay as-is. To distinguish staging from production at runtime,
// use APP_ENV from './lib/env' (set per environment as a Wrangler var).
const isProduction = process.env.NODE_ENV === 'production'
// `next build` collects page data in ~CPU-count parallel worker processes, each of which spins up
// its own Miniflare. If they share the persisted local state dir (.wrangler/state) they contend on
// its SQLite WAL and the build dies intermittently with `... database is locked: SQLITE_BUSY_RECOVERY`
// ("SENTRY_DO"/"NOSENTRY" in that error is a workerd-internal log tag, not the Sentry SDK). During
// the build we use the wrangler proxy with persistence OFF (in-memory, isolated per worker); remote
// bindings (D1 via wrangler.jsonc `remote: true`) are unaffected. Detected via Next's build phase so
// dev / CLI / tests / deployed runtime keep their persisted local database.
// TODO: revisit if a future @opennextjs/cloudflare / wrangler isolates build-worker Miniflare state
// upstream — at which point this `persist: false` workaround may no longer be needed.
const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build'

// `JSON.stringify` of an Error yields `{}` because `message`/`stack` are non-enumerable, so a
// thrown error logged via `logger.error({ err })` would otherwise reach Cloudflare logs as an
// empty object — hiding the actual failure. This replacer expands any Error (top-level or nested,
// e.g. the `err` field Payload's route handler logs) into its name/message/stack plus any
// enumerable own props (Payload's APIError carries `status`/`data`).
const errorReplacer = (_key: string, value: unknown): unknown => {
  if (value instanceof Error) {
    const out: Record<string, unknown> = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    }
    for (const key of Object.keys(value)) {
      out[key] = (value as unknown as Record<string, unknown>)[key]
    }
    return out
  }
  return value
}

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else if (objOrMsg instanceof Error) {
      fn(JSON.stringify({ level, err: objOrMsg, msg: msg ?? objOrMsg.message }, errorReplacer))
    } else {
      fn(
        JSON.stringify(
          { level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg },
          errorReplacer,
        ),
      )
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use PayloadLogger type when it's exported
} as any

const cloudflare =
  isCLI || !isProduction || isNextBuild
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Live preview backs the in-house staging review: editors see draft changes
    // rendered by the front-end in real time. The front-end must mount
    // <RefreshRouteOnSave /> (see src/components/LivePreviewListener.tsx).
    livePreview: {
      url: ({ data }) => `${getServerURL()}/${(data?.slug as string) ?? ''}`,
      collections: ['pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: getServerURL(),
  // Origins allowed to send the admin auth cookie on mutations. Without the real
  // deployed origin here, Payload's CSRF check strips the cookie on every POST
  // (server actions/mutations run unauthenticated → "Unauthorized"). Derived from
  // APP_ENV + site.domain so it is correct at Worker runtime. See src/lib/serverUrl.ts.
  csrf: getCSRFOrigins(),
  // System mail (password resets) + Form Builder notifications route through Resend.
  // Gated so local dev works without a key (emails are simply not sent).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.DEFAULT_FROM_EMAIL || site.email.defaultFrom,
        defaultFromName: site.brandName,
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // `push: false` — this project is migration-driven (see README "Schema changes"):
  // schema lives in committed migrations and CI gates drift. Payload's dev schema
  // push (drizzle) otherwise runs on connect outside production and collides with an
  // already-migrated DB (e.g. "index ... already exists" in tests / after migrate),
  // so it is disabled everywhere. Change a field → `pnpm migrate:create` + migrate.
  db: sqliteD1Adapter({ binding: cloudflare.env.D1, push: false }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => [doc?.title, site.brandName].filter(Boolean).join(' — '),
      generateURL: ({ doc }) => `${getServerURL()}/${doc?.slug ?? ''}`,
    }),
    redirectsPlugin({
      collections: ['pages'],
      // Expose all supported HTTP redirect statuses as a required `type` select,
      // defaulting to 301 (the common permanent case). src/middleware.ts serves
      // whichever status is chosen.
      redirectTypes: ['301', '302', '303', '307', '308'],
      redirectTypeFieldOverride: {
        defaultValue: '301',
        // Normalise the status to a bare integer-string so it always matches a select
        // option. Bulk CSV imports coerce "301" to a float and store "301.0", which
        // matches no option (renders blank in the list, fails re-save). parseInt fixes
        // both imported and manually-entered values: "301.0" → "301".
        hooks: {
          beforeValidate: [
            ({ value }) => {
              if (value === undefined || value === null || value === '') {
                return value
              }
              const parsed = parseInt(String(value), 10)
              return Number.isNaN(parsed) ? value : String(parsed)
            },
          ],
        },
      },
      // Rebuild the KV lookup map whenever a redirect is created, edited or removed.
      overrides: {
        // Admins and editors manage redirects; only admins may delete. Read stays open to
        // authenticated staff. (KV sync reads via the Local API, which bypasses access anyway.)
        access: {
          read: isAdminOrEditor,
          create: isAdminOrEditor,
          update: isAdminOrEditor,
          delete: isAdmin,
        },
        hooks: {
          afterChange: [syncRedirectsAfterChange],
          afterDelete: [syncRedirectsAfterDelete],
        },
      },
    }),
    formBuilderPlugin({
      // Disable the payment field type (no payment provider in the boilerplate).
      fields: { payment: false },
      // Admins and editors build/manage forms; only admins may delete.
      formOverrides: {
        access: {
          read: isAdminOrEditor,
          create: isAdminOrEditor,
          update: isAdminOrEditor,
          delete: isAdmin,
        },
      },
      // Submissions: `create` MUST stay public — the public front-end posts form submissions
      // unauthenticated, so locking create would 403 every submission. Only staff read them; only
      // admins update/delete.
      formSubmissionOverrides: {
        access: {
          read: isAdminOrEditor,
          create: anyone,
          update: isAdmin,
          delete: isAdmin,
        },
      },
    }),
    // Bulk CSV/JSON import + export in the admin, scoped to redirects (e.g. a one-time
    // migration load). Sync mode (disableJobsQueue) because Workers has no background
    // jobs runner — the import is processed inline in the request, fine for the low
    // hundreds of redirects our sites have. Export is download-only (disableSave) so
    // it never writes a file to R2. Imports create redirects via the normal Payload
    // create op, so the redirects afterChange hook fires and the KV map updates.
    importExportPlugin({
      // Bulk import/export is admin tooling — lock both generated collections to admins. The
      // overrides receive the plugin's default collection and return it with access applied.
      overrideImportCollection: ({ collection }) => ({
        ...collection,
        access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
      }),
      overrideExportCollection: ({ collection }) => ({
        ...collection,
        access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
      }),
      collections: [
        {
          slug: 'redirects',
          import: {
            disableJobsQueue: true,
            // NOTE: do NOT auto-delete the import record after a successful import.
            // The plugin's admin UI navigates to and re-reads the just-created import
            // record to render the results summary; deleting it (even deferred via
            // `waitUntil`) races that refetch and yields "document with ID N could not
            // be found". Clean up spent imports manually instead — selecting an import
            // row and deleting it also removes its R2 file via the storage adapter.
          },
          export: { disableJobsQueue: true, disableSave: true },
        },
      ],
    }),
    // r2Storage MUST be registered after any plugin that adds upload collections.
    // It sets `disableLocalStorage: true` and attaches the R2 adapter by mapping over the
    // collections that exist *when it runs* — so the `imports`/`exports` upload collections
    // added by importExportPlugin above must already be present. Registered earlier, those
    // collections fall back to local-disk writes, which call `fs.mkdir` — unimplemented in
    // workerd (`[unenv] fs.mkdir is not implemented yet!`), so bulk import 500s on deploy
    // while working under `next dev` (real Node). Media works either way (base collection).
    r2Storage({
      bucket: cloudflare.env.R2,
      // `imports`/`exports` are upload collections added by the import-export plugin.
      // Workers has no local disk, so their files must be stored in R2 like media.
      collections: { media: true, imports: true, exports: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
//
// Cache the platform proxy on globalThis for the lifetime of the process. `next dev`
// re-evaluates this config on every recompile; without this cache each evaluation would
// call getPlatformProxy again and spawn a NEW Miniflare `workerd`. The leaked workerd
// accumulate and keep the local D1 sqlite open, which then clobbers a `db:pull` import
// (the DB ends up schema-only → "create first user"). One proxy ⇒ one workerd, which is
// correct for local dev and build. This mirrors @opennextjs/cloudflare's own globalThis
// cache for getCloudflareContext (it likewise never disposes — the proxy lives for the
// process). We keep the custom wrangler proxy (rather than getCloudflareContext) because
// it also serves the CLI, tests and remote-binding deploys; see the `cloudflare` const above.
// `Symbol.for` is looked up inside the function (not a module const) so it is safe to call
// from the top-level `await` above without a temporal-dead-zone error.
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  const platformProxySymbol = Symbol.for(`__${site.slug}_platform_proxy__`)
  const globalCache = globalThis as typeof globalThis & {
    [platformProxySymbol]?: Promise<CloudflareContext>
  }
  if (!globalCache[platformProxySymbol]) {
    globalCache[platformProxySymbol] = import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`)
      .then(({ getPlatformProxy }) =>
        getPlatformProxy({
          environment: process.env.CLOUDFLARE_ENV,
          remoteBindings: isProduction,
          // Isolate each parallel build worker's local state so they don't contend on a shared
          // on-disk SQLite WAL (SQLITE_BUSY_RECOVERY). Build only — see isNextBuild above.
          ...(isNextBuild ? { persist: false } : {}),
        } satisfies GetPlatformProxyOptions),
      )
      // Never cache a failed attempt — clear the slot so the next call can retry.
      .catch((error) => {
        delete globalCache[platformProxySymbol]
        throw error
      })
  }
  return globalCache[platformProxySymbol]!
}
