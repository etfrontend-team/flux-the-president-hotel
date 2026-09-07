import { z } from 'zod'

/**
 * Shared career-application schema. Imported by both the client form
 * (src/components/sections/CareerApplyForm.tsx) and the server route
 * (src/app/(frontend)/api/careers/apply/route.ts) so validation is identical
 * on both sides — same split as contactSchema.
 *
 * Every field arrives as a string because the form posts `multipart/form-data`
 * (it carries file uploads), so the route rebuilds a plain object from
 * FormData before parsing. Booleans are coerced by the route.
 */

/** Per Figma (node 1:13491): "Accepted: .doc .jpg .pdf .rtf .txt — max 5000KB". */
export const ACCEPTED_FILE_EXTENSIONS = ['.doc', '.jpg', '.pdf', '.rtf', '.txt'] as const
export const MAX_FILE_BYTES = 5000 * 1024

/** `accept` attribute for the file inputs — extensions plus their usual mime types. */
export const FILE_ACCEPT_ATTRIBUTE =
  '.doc,.jpg,.jpeg,.pdf,.rtf,.txt,application/msword,image/jpeg,application/pdf,application/rtf,text/plain'

export const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'] as const
export const YES_NO_OPTIONS = ['Yes', 'No'] as const
export const GENDER_OPTIONS = ['Female', 'Male', 'Other', 'Prefer not to say'] as const
/** Employment Equity reporting categories, as used on South African EE returns. */
export const RACE_OPTIONS = ['African', 'Coloured', 'Indian', 'White', 'Other', 'Prefer not to say'] as const
export const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '6–10 years',
  'More than 10 years',
] as const
export const PROVINCE_OPTIONS = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
] as const

const optionalText = z.string().trim().max(200).optional().or(z.literal(''))

export const careerApplicationSchema = z.object({
  /** The role being applied for, carried through from the listing via `?position=`. */
  position: z.string().trim().min(1).max(200),

  coverNote: z.string().trim().max(5000).optional().or(z.literal('')),

  // Personal details — Figma node 1:13345
  title: optionalText,
  firstName: z.string().trim().min(1, 'Please enter your first name').max(100),
  lastName: z.string().trim().min(1, 'Please enter your last name').max(100),
  email: z.email('Please enter a valid email address'),
  mobilePhone: optionalText,
  homePhone: optionalText,

  // Eligibility and employment — Figma node 1:13389
  eligibleToWork: z.enum(YES_NO_OPTIONS, 'Please select an option'),
  bornInSouthAfrica: optionalText,
  naturalisedCitizen: optionalText,
  idNumber: z.string().trim().min(1, 'Please enter your ID number').max(50),
  gender: z.enum(GENDER_OPTIONS, 'Please select an option'),
  race: z.enum(RACE_OPTIONS, 'Please select an option'),
  disabled: z.enum(YES_NO_OPTIONS, 'Please select an option'),
  highestQualification: z.string().trim().min(1, 'Please enter your highest qualification').max(200),
  yearsOfExperience: z.enum(EXPERIENCE_OPTIONS, 'Please select an option'),
  currentProvince: z.enum(PROVINCE_OPTIONS, 'Please select an option'),
  currentEmployer: z.string().trim().min(1, 'Please enter your current employer').max(200),
  currentPosition: z.string().trim().min(1, 'Please enter your current position').max(200),

  /** Figma node 1:13504 — "I wish to receive a copy of this application". */
  sendCopy: z.boolean().optional(),

  // Set by the Turnstile widget; verified server-side.
  turnstileToken: z.string().optional(),
})

export type CareerApplicationInput = z.infer<typeof careerApplicationSchema>

/**
 * Validates one uploaded file against the accepted extensions and size cap.
 * Returns an error message, or `null` when the file is fine. Used by the client
 * before submitting and again by the route — never trust the browser's `accept`.
 */
export function validateApplicationFile(file: File): string | null {
  const name = file.name.toLowerCase()
  const allowed = ACCEPTED_FILE_EXTENSIONS.some((extension) => name.endsWith(extension))
  if (!allowed) {
    return `Accepted formats: ${ACCEPTED_FILE_EXTENSIONS.join(' ')}`
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'That file is larger than 5000KB'
  }
  return null
}
