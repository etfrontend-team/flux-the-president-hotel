import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { site } from '@/config/site.config'
import { contactSchema } from '@/lib/contactSchema'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * Bespoke enquiry endpoint: validates with the shared zod schema, verifies the
 * Turnstile token (server-only), then sends an email via Payload's Resend adapter.
 * Email is best-effort so the request still succeeds when mail isn't configured locally.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const json: unknown = await request.json().catch((): null => null)
  const parsed = contactSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const { turnstileToken, ...data } = parsed.data
  const remoteIp = request.headers.get('cf-connecting-ip') ?? undefined
  const verified = await verifyTurnstile(turnstileToken, remoteIp)
  if (!verified) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }

  const payload = await getPayload({ config: await config })
  await payload
    .sendEmail({
      to: process.env.CONTACT_INBOX || process.env.DEFAULT_FROM_EMAIL || site.email.contactInbox,
      subject: `New enquiry from ${data.name}`,
      html: `<p><strong>${data.name}</strong> (${data.email})</p><p>${data.message}</p>`,
    })
    .catch((err) => payload.logger.error({ err }, 'Contact email failed'))

  return NextResponse.json({ ok: true })
}
