'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile } from '@marsidev/react-turnstile'

import { contactSchema, type ContactInput } from '@/lib/contactSchema'
import { Button, Stack } from '@/components/ui'

/**
 * Example enquiry form: react-hook-form + zod validation + Cloudflare Turnstile,
 * posting to the server route which verifies the token before sending the email.
 *
 * This is the hand-coded pattern for bespoke forms. For editor-managed forms, use the
 * Form Builder plugin's `forms` collection and its submission endpoint instead.
 */
export function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [token, setToken] = useState<string>()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values: ContactInput) {
    setStatus('sending')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, turnstileToken: token }),
    })
    if (res.ok) {
      setStatus('sent')
      reset()
    } else {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p className="text-brand">Thank you — we will be in touch shortly.</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={16}>
        <label>
          <span className="mb-4 block text-sm font-medium">Name</span>
          <input className="w-full rounded-card border border-brand/30 px-12 py-8" {...register('name')} />
          {errors.name && <span className="text-sm text-red-700">{errors.name.message}</span>}
        </label>

        <label>
          <span className="mb-4 block text-sm font-medium">Email</span>
          <input
            type="email"
            className="w-full rounded-card border border-brand/30 px-12 py-8"
            {...register('email')}
          />
          {errors.email && <span className="text-sm text-red-700">{errors.email.message}</span>}
        </label>

        <label>
          <span className="mb-4 block text-sm font-medium">Message</span>
          <textarea
            rows={5}
            className="w-full rounded-card border border-brand/30 px-12 py-8"
            {...register('message')}
          />
          {errors.message && <span className="text-sm text-red-700">{errors.message.message}</span>}
        </label>

        {siteKey && <Turnstile siteKey={siteKey} onSuccess={setToken} />}

        <Button type="submit" disabled={isSubmitting}>
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </Button>

        {status === 'error' && (
          <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
        )}
      </Stack>
    </form>
  )
}
