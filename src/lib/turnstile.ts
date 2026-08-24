import 'server-only'

/**
 * Verify a Cloudflare Turnstile token server-side. Import only from server code —
 * the `server-only` guard hard-fails the build if this is pulled into a client bundle,
 * keeping TURNSTILE_SECRET_KEY out of the browser.
 *
 * Returns `true` when verification is disabled (no secret configured), so local dev
 * and previews work without Turnstile set up.
 */
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string | undefined, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // not configured → skip (local/dev)
  if (!token) return false

  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (remoteIp) body.append('remoteip', remoteIp)

  try {
    const res = await fetch(SITEVERIFY_URL, { method: 'POST', body })
    const data = (await res.json()) as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}
