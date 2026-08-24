import { z } from 'zod'

/**
 * Shared contact-enquiry schema. Imported by both the client form
 * (src/components/ContactForm.tsx) and the server route
 * (src/app/(frontend)/api/contact/route.ts) so validation is identical on both sides.
 */
export const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.email('Please enter a valid email address'),
  message: z.string().min(10, 'Please add a little more detail'),
  // Set by the Turnstile widget; verified server-side.
  turnstileToken: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
