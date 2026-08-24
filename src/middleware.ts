import { NextResponse, type NextRequest } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

import { REDIRECTS_KV_KEY, type RedirectMap } from './lib/redirects'

/**
 * Serve CMS-managed redirects from a single KV read (no per-request D1 query).
 * The map is written by the redirects collection hooks (see src/lib/redirects.ts).
 * Fails open: any error or a missing binding simply continues to the route.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  try {
    const { env } = await getCloudflareContext({ async: true })
    const kv = env.KV
    if (!kv) return NextResponse.next()

    const map = await kv.get<RedirectMap>(REDIRECTS_KV_KEY, 'json')
    const entry = map?.[pathname]
    if (entry) {
      const destination = entry.to.startsWith('http')
        ? entry.to
        : new URL(entry.to, request.url).toString()
      return NextResponse.redirect(destination, entry.status)
    }
  } catch {
    // No Cloudflare context / KV unavailable — continue without redirecting.
  }

  return NextResponse.next()
}

export const config = {
  // Skip Payload admin/API, Next internals and static assets.
  matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico).*)'],
}
