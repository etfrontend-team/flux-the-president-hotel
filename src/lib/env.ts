/**
 * Runtime environment signal.
 *
 * `APP_ENV` is set per environment as a Wrangler `var` (see wrangler.jsonc):
 *   - local      → `.env` / `.dev.vars`
 *   - staging    → env.staging.vars.APP_ENV
 *   - production → top-level vars.APP_ENV
 *
 * Unlike NODE_ENV (which is `production` in BOTH deployed Workers) and CLOUDFLARE_ENV
 * (a build/deploy-time shell var, not guaranteed at runtime), `APP_ENV` is injected into
 * `process.env` at request time and reliably distinguishes staging from production inside
 * the Worker. If unset it falls back to `local` (the safe default for tooling/tests).
 */
export type AppEnv = 'local' | 'staging' | 'production'

export const APP_ENV: AppEnv = (process.env.APP_ENV as AppEnv) ?? 'local'

export const isProductionEnv = APP_ENV === 'production'
export const isStagingEnv = APP_ENV === 'staging'
export const isLocalEnv = APP_ENV === 'local'
