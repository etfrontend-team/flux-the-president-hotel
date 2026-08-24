/**
 * Single source of truth for app-code brand identifiers.
 *
 * This is ONE of three files to edit when cloning the boilerplate for a new client:
 *   1. src/config/site.config.ts   ← this file (app + scripts: names, brand, emails)
 *   2. src/app/(frontend)/styles.css → @theme block (visual tokens: colours, fonts)
 *   3. wrangler.jsonc                → infrastructure (worker/db/bucket names, domains, IDs)
 *
 * Keep it dependency-free (plain constants) so both the Next.js app (imported via the
 * `@/` alias) and the tsx ops scripts (imported relatively from ../src) can consume it.
 *
 * NOTE: secrets never live here — they stay in .env / GitHub org / Cloudflare secrets.
 * The email values below are FALLBACKS only; runtime still prefers the env vars.
 */
export const site = {
  /** Lowercase, no spaces. Base for the worker / D1 / R2 names. Mirror in wrangler.jsonc. */
  slug: 'presidenthotel',
  /** Primary domain (apex). Mirror the routes in wrangler.jsonc. */
  domain: 'presidenthotel.co.za',
  /** Display name — used as the SEO title suffix and the outbound email from-name. */
  brandName: 'President Hotel',
  /** Default document metadata (Next.js metadata API). */
  meta: {
    title: 'President Hotel',
    description: 'President Hotel — official website.',
  },
  /** Email fallbacks — used only when the corresponding env var is unset. */
  email: {
    /** Fallback when DEFAULT_FROM_EMAIL is unset. */
    defaultFrom: 'noreply@presidenthotel.co.za',
    /** Fallback contact inbox when CONTACT_INBOX (and DEFAULT_FROM_EMAIL) are unset. */
    contactInbox: 'hello@presidenthotel.co.za',
  },
  /** Cloudflare account — fallback when the CLOUDFLARE_ACCOUNT_ID env var is unset. Patched by `pnpm setup:cloudflare`. */
  cloudflareAccountId: 'b25596487473fbd5533239ebfa37636e',
} as const

/**
 * R2 bucket names derived from the slug, so ops scripts never re-hardcode them.
 * Kept in sync with the bucket_name values in wrangler.jsonc.
 */
export const buckets = {
  production: site.slug,
  staging: `${site.slug}-staging`,
} as const

/**
 * The ONLY hosts on which this site may be indexed by search engines.
 *
 * Fail-safe by design: every other host — both Workers' `*.workers.dev` hostnames, every
 * per-version preview URL, `staging.<domain>`, localhost — is served
 * `X-Robots-Tag: noindex, nofollow`. See src/lib/indexing.ts.
 *
 * Production serves both the apex and `www` (the apex → www 301 is set at the Cloudflare edge
 * at launch), so both are listed. When you add a new PUBLIC subdomain, add it here in the SAME
 * commit as its `routes` entry in wrangler.jsonc — otherwise it deploys noindexed. Do NOT add
 * hosts that must stay out of the index (staging, cms, preview).
 */
export const indexableHosts: readonly string[] = [
  site.domain,
  `www.${site.domain}`,

  // ── Adding a public subdomain (or an additional domain) ──────────────────────────────
  // Uncomment and adapt. Three things must land in the SAME commit, or the host either
  // never reaches the Worker or reaches it noindexed:
  //   1. this list                     → allows indexing on that host
  //   2. wrangler.jsonc `routes`       → routes the host to the Worker (custom_domain: true)
  //      and its `env.staging.routes`  → named environments do NOT inherit routes
  //   3. getCSRFOrigins() in src/lib/serverUrl.ts → only if the Payload admin is served there
  //
  // A subdomain of the primary domain — derive it, so it follows a `site.domain` rename:
  // `shop.${site.domain}`,
  //
  // A separate domain the same Worker also serves — write it in full, lowercase, no
  // protocol, no path, no port, no wildcards (each host is matched exactly):
  // 'my-app.co.za',
  // 'www.my-app.co.za',
  //
  // Do NOT list hosts that must stay out of the index — `staging.${site.domain}`,
  // `cms.${site.domain}`, preview hosts, or anything on `*.workers.dev`. Omitting a host
  // is what keeps it noindexed; there is no deny list to maintain.
]
