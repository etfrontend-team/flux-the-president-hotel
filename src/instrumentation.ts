/**
 * Server error capture via Sentry.
 *
 * Gated on `SENTRY_DSN`: a no-op locally / when unset. Uses Next's `onRequestError`
 * hook (supported by OpenNext) to forward server errors to `@sentry/cloudflare`.
 * Wrapped in try/catch so monitoring can never break a request.
 *
 * For full Worker-level tracing (request spans, performance), additionally wrap the
 * OpenNext worker entry with `Sentry.withSentry(...)` — see README "Error monitoring".
 */
export async function register(): Promise<void> {
  // The Cloudflare SDK binds its client per-request (via withSentry); nothing to init here.
}

export async function onRequestError(error: unknown): Promise<void> {
  if (!process.env.SENTRY_DSN) return
  try {
    const Sentry = await import('@sentry/cloudflare')
    Sentry.captureException(error)
  } catch {
    // Sentry unavailable or no active client — ignore.
  }
}
