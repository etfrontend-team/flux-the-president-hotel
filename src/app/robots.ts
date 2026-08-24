import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { isIndexableHost } from '@/lib/indexing'

/**
 * Host-aware robots.txt.
 *
 * MUST live at the `src/app/` root, NOT inside the `(frontend)` route group. Next resolves
 * metadata-route conventions (robots.ts, sitemap.ts) only from the root app segment — inside a
 * route group the file is silently ignored and /robots.txt returns 404. Verified empirically.
 *
 * MUST stay dynamic. A statically prerendered robots.txt is emitted into `.open-next/assets/`,
 * where Cloudflare's Assets binding serves it directly WITHOUT invoking the Worker — so it could
 * neither vary by host nor pick up the `X-Robots-Tag` header from next.config.ts. (public/_headers
 * exists precisely because `/_next/static/*` bypasses the Worker the same way.)
 */
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')

  const rules: MetadataRoute.Robots['rules'] = {
    // Crawling is deliberately ALLOWED even on preview hosts. A crawler has to be able to fetch a
    // page to see `X-Robots-Tag: noindex` and drop the URL; `Disallow: /` would hide the directive
    // and can leave URL-only listings stuck in the index indefinitely.
    userAgent: '*',
    allow: '/',
    disallow: ['/admin/', '/api/'],
  }

  if (!isIndexableHost(host)) {
    // Preview host: same permissive rules, but never advertise a sitemap.
    return { rules }
  }

  return {
    rules,
    // No sitemap route exists yet. When one is added, declare it HERE — inside this indexable
    // branch only — as `sitemap: `${getServerURL()}/sitemap.xml`` (getServerURL from @/lib/serverUrl),
    // so preview hosts never advertise the live domain's sitemap.
  }
}
