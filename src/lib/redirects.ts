import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * KV-cached redirects.
 *
 * The redirects plugin stores edits in the `redirects` collection (managed by the
 * SEO specialist in the admin). On every change we rebuild a compact lookup map and
 * write it to Cloudflare KV under a single key. `src/middleware.ts` then resolves each
 * request with one O(1) KV read — no per-request D1 query.
 */
export const REDIRECTS_KV_KEY = 'redirects:map'

export type RedirectEntry = { to: string; status: number }
export type RedirectMap = Record<string, RedirectEntry>

/** Resolve a redirect doc's `to` group into an absolute-or-relative destination path. */
async function resolveDestination(
  to: unknown,
  payload: Payload,
): Promise<string | null> {
  if (!to || typeof to !== 'object') return null
  const group = to as { url?: string; reference?: { relationTo: string; value: unknown } }

  if (group.url) return group.url

  const ref = group.reference
  if (!ref?.value) return null

  // Already-populated doc, or an id we resolve.
  const doc =
    typeof ref.value === 'object'
      ? (ref.value as { slug?: string })
      : ((await payload
          .findByID({ collection: ref.relationTo as 'pages', id: ref.value as string })
          .catch((): null => null)) as { slug?: string } | null)

  if (!doc?.slug) return null
  return doc.slug === 'home' ? '/' : `/${doc.slug}`
}

/** Read every redirect, build the lookup map, and write it to KV. */
export async function syncRedirectsToKV(payload: Payload): Promise<void> {
  let kv: KVNamespace | undefined
  try {
    const { env } = await getCloudflareContext({ async: true })
    kv = env.KV
  } catch {
    // No Cloudflare context (e.g. CLI migrate) — nothing to sync.
    return
  }
  if (!kv) return

  const { docs } = await payload.find({
    collection: 'redirects',
    limit: 0, // all
    depth: 1,
    pagination: false,
  })

  const map: RedirectMap = {}
  for (const doc of docs as Array<{ from?: string; to?: unknown; type?: string }>) {
    if (!doc.from) continue
    const to = await resolveDestination(doc.to, payload)
    if (!to) continue
    const from = doc.from.startsWith('/') ? doc.from : `/${doc.from}`
    // `type` is the redirect status chosen in the admin (301/302/303/307/308); default 301.
    const status = Number(doc.type) || 301
    map[from] = { to, status }
  }

  await kv.put(REDIRECTS_KV_KEY, JSON.stringify(map))
}

export const syncRedirectsAfterChange: CollectionAfterChangeHook = async ({ req }) => {
  await syncRedirectsToKV(req.payload)
}

export const syncRedirectsAfterDelete: CollectionAfterDeleteHook = async ({ req }) => {
  await syncRedirectsToKV(req.payload)
}
