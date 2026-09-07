import { NextResponse } from 'next/server'

import { site } from '@/config/site.config'
import {
  MAX_FILE_BYTES,
  careerApplicationSchema,
  validateApplicationFile,
  type CareerApplicationInput,
} from '@/lib/careerApplicationSchema'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * Career-application endpoint. Accepts `multipart/form-data` (CV, ID copy and
 * qualification document ride along with the fields), validates with the shared
 * zod schema, verifies the Turnstile token, then emails the application to the
 * people inbox with the three documents attached.
 *
 * Why Resend's REST API directly rather than `payload.sendEmail`: the Resend
 * adapter JSON-stringifies the message, so a Buffer attachment serialises as
 * `{"type":"Buffer","data":[…]}` and arrives corrupt. Calling the REST API with
 * `fetch` and base64 content is also the house rule for third-party services
 * (see docs/UPGRADING.md → "Worker size budget") — no vendor SDK.
 *
 * The documents are deliberately NOT written to the `media` collection: that
 * collection is public-read, and ID documents must not be publicly addressable.
 * They exist only in the outbound email.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

const FILE_FIELDS = [
  { key: 'cv', label: 'CV' },
  { key: 'idDocument', label: 'ID document' },
  { key: 'qualification', label: 'Qualification document' },
] as const

type Attachment = { filename: string; content: string }

/**
 * Base64 without Buffer, so this behaves identically under `next dev` (Node) and
 * on workerd. Chunked because `String.fromCharCode(...bytes)` blows the argument
 * limit on anything but tiny files.
 */
function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const FIELD_LABELS: Record<string, string> = {
  position: 'Position',
  title: 'Title',
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email address',
  mobilePhone: 'Mobile phone',
  homePhone: 'Home phone',
  eligibleToWork: 'Eligible to work in South Africa',
  bornInSouthAfrica: 'Born in South Africa',
  naturalisedCitizen: 'Naturalised citizen',
  idNumber: 'ID number',
  gender: 'Gender',
  race: 'Race',
  disabled: 'Disabled',
  highestQualification: 'Highest qualification',
  yearsOfExperience: 'Years of experience',
  currentProvince: 'Current province',
  currentEmployer: 'Current employer',
  currentPosition: 'Current position',
}

function buildHtml(data: CareerApplicationInput): string {
  const rows = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const value = (data as Record<string, unknown>)[key]
      if (value === undefined || value === null || value === '') return ''
      return `<tr><td style="padding:4px 16px 4px 0;color:#54555b">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(String(value))}</strong></td></tr>`
    })
    .filter(Boolean)
    .join('')

  const coverNote = data.coverNote
    ? `<h3 style="margin:24px 0 8px;color:#00313c">Cover note</h3><p style="white-space:pre-wrap;color:#54555b">${escapeHtml(data.coverNote)}</p>`
    : ''

  return [
    `<h2 style="margin:0 0 16px;color:#00313c">Application: ${escapeHtml(data.position)}</h2>`,
    `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${rows}</table>`,
    coverNote,
  ].join('')
}

async function sendEmail(body: Record<string, unknown>): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Mirrors the contact route: mail is best-effort so local dev works unconfigured.
    console.warn('[careers/apply] RESEND_API_KEY unset — application email not sent')
    return
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`)
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData().catch((): null => null)
  if (!form) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const fields: Record<string, unknown> = {}
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') fields[key] = value
  }
  // The checkbox arrives as the string "true"/"false" from the client's FormData build.
  fields.sendCopy = fields.sendCopy === 'true'

  const parsed = careerApplicationSchema.safeParse(fields)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const { turnstileToken, ...data } = parsed.data
  const remoteIp = request.headers.get('cf-connecting-ip') ?? undefined
  if (!(await verifyTurnstile(turnstileToken, remoteIp))) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }

  // Re-check every file server-side — the browser's `accept` attribute is only a hint.
  const attachments: Attachment[] = []
  for (const { key, label } of FILE_FIELDS) {
    const file = form.get(key)
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: `${label} is required` }, { status: 400 })
    }
    const message = validateApplicationFile(file)
    if (message || file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `${label}: ${message ?? 'file too large'}` }, { status: 400 })
    }
    attachments.push({
      filename: `${data.lastName}-${data.firstName}-${label}-${file.name}`.replace(/\s+/g, '-'),
      content: toBase64(new Uint8Array(await file.arrayBuffer())),
    })
  }

  const from = `${site.brandName} <${process.env.DEFAULT_FROM_EMAIL || site.email.defaultFrom}>`
  const inbox =
    process.env.CAREERS_INBOX || process.env.CONTACT_INBOX || process.env.DEFAULT_FROM_EMAIL || site.email.contactInbox
  const html = buildHtml(data)

  try {
    await sendEmail({
      from,
      to: inbox,
      reply_to: data.email,
      subject: `Application: ${data.position} — ${data.firstName} ${data.lastName}`,
      html,
      attachments,
    })

    if (data.sendCopy) {
      // The applicant's copy carries the details only — they already hold the documents.
      await sendEmail({
        from,
        to: data.email,
        subject: `Your application: ${data.position} — ${site.brandName}`,
        html: `<p style="font-family:system-ui,sans-serif;color:#54555b">Thank you for applying. Here is a copy of what you sent us.</p>${html}`,
      }).catch((err: unknown) => console.error('[careers/apply] applicant copy failed', err))
    }
  } catch (err) {
    console.error('[careers/apply] application email failed', err)
    return NextResponse.json({ error: 'Could not send application' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
