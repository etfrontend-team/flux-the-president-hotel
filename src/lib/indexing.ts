import { indexableHosts } from '../config/site.config'

/**
 * Search-engine indexing is gated on the request HOST, not on `APP_ENV`.
 *
 * `APP_ENV` cannot be used here: the production Worker runs with `APP_ENV=production` from its
 * first deploy, while it is still only reachable on `*.workers.dev` — the custom domain's DNS is
 * not delegated until launch. The `Host` header is the only signal that distinguishes "live on
 * the client's domain" from "preview URL".
 *
 * Zone-level Cloudflare features (Transform Rules, WAF, Page Rules) cannot help: `*.workers.dev`
 * is not a zone in the account, so the directive has to be applied in code.
 *
 * Kept dependency-free (no `next/*`, no `server-only`) because next.config.ts imports it at
 * build time — the same constraint site.config.ts documents.
 */

export const NOINDEX_HEADER = 'X-Robots-Tag'
export const NOINDEX_VALUE = 'noindex, nofollow'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Anchored alternation of every indexable host, for the `missing` host matcher in next.config.ts.
 *
 * The anchors and the non-capturing group are both load-bearing:
 *   - OpenNext tests this with `new RegExp(value).test(host)` — UNANCHORED (@opennextjs/aws,
 *     dist/core/routing/matcher.js → `routeHasMatcher`, case 'host'). Without `^…$` the host
 *     `my-app.com.attacker.example` would match and be treated as indexable.
 *   - Next's own dev server wraps the value as `^${value}$`
 *     (next/dist/shared/lib/router/utils/prepare-destination.js → `matchHas`), yielding
 *     `^^(?:…)$$`. That is harmless: `^` and `$` are zero-width assertions and repeat safely.
 *   - Without `(?:…)` the alternation would bind as `^a|b$` rather than `^(a|b)$`.
 *
 * tests/int/indexing.int.spec.ts guards all three properties — it is the gate that catches an
 * OpenNext upgrade changing the matcher. See docs/UPGRADING.md → "Cluster 8".
 */
export const INDEXABLE_HOST_PATTERN = `^(?:${indexableHosts.map(escapeRegExp).join('|')})$`

/**
 * Runtime predicate for the robots.txt route. Stays in step with INDEXABLE_HOST_PATTERN by
 * construction — both read the same list.
 */
export function isIndexableHost(host: string | null | undefined): boolean {
  if (!host) return false
  // OpenNext passes the Host header through verbatim (port included); Next's dev server strips
  // the port. Normalise so both agree.
  const hostname = host.split(':')[0].toLowerCase()
  return indexableHosts.includes(hostname)
}
