import { APP_ENV } from './env'
import { site } from '../config/site.config'

/**
 * Absolute origin of the site for the current environment. Used for Payload's
 * `serverURL` (which seeds the CSRF allow-list), live-preview URLs and SEO
 * canonical/OG tags.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SERVER_URL` (explicit override, e.g. a preview/branch URL).
 *   2. Derived from the runtime `APP_ENV` + the centralised `site.domain`.
 *   3. `http://localhost:3000` for local development.
 *
 * We derive from `APP_ENV` (a runtime Wrangler var) rather than relying on
 * `NEXT_PUBLIC_SERVER_URL` alone, because `NEXT_PUBLIC_*` vars are inlined at
 * build time — an unset build-time value bakes in `localhost`, and a localhost
 * `serverURL` makes Payload's CSRF check reject the admin auth cookie on every
 * POST (see getCSRFOrigins).
 */
export function getServerURL(): string {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }
  if (APP_ENV === 'production') {
    return `https://www.${site.domain}`
  }
  if (APP_ENV === 'staging') {
    return `https://staging.${site.domain}`
  }
  return 'http://localhost:3000'
}

/**
 * Origins permitted to send the admin auth cookie on mutating requests
 * (Payload `config.csrf`). Must include every host the admin is reached on,
 * otherwise Payload's CSRF protection strips the cookie and the request runs
 * unauthenticated — manifesting as "Unauthorized" on server actions/mutations.
 *
 * Production serves both the apex and `www` custom domains, so allow both.
 */
export function getCSRFOrigins(): string[] {
  const origins = new Set<string>([getServerURL()])
  if (APP_ENV === 'production') {
    origins.add(`https://${site.domain}`)
    origins.add(`https://www.${site.domain}`)
  } else if (APP_ENV === 'staging') {
    origins.add(`https://staging.${site.domain}`)
  } else {
    origins.add('http://localhost:3000')
  }
  return [...origins]
}
