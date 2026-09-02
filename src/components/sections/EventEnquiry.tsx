'use client'

import React from 'react'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Stack } from '@/components/ui'

const inputClasses =
  'block h-40 w-full rounded-5 border border-brand-muted bg-transparent px-25 py-15 text-13 leading-12 tracking-5 text-ink capitalize backdrop-blur-[1px] placeholder:text-ink/60 placeholder:capitalize focus:outline-none'

/**
 * Per Figma (node 1:15599 desktop, 340:1488 mobile). UI only — no real
 * submission wired up (no CMS/backend specified), matching Subscribe's
 * placeholder-action convention.
 */
export function EventEnquiry() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section className="general-padding bg-paper-alt/40">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <Stack align="center" gap={40} tabletGap={40} mobileGap={40} className="mx-auto max-w-704 text-center">
            <FadeIn>
              <Stack align="center" gap={30} tabletGap={30} mobileGap={30}>
                <span className="font-accent text-16 leading-11 tracking-10 text-accent uppercase">
                  Send an enquiry
                </span>
                <Heading level={4} className="max-w-704 text-wrap">
                  Tell us about your event and our team will be in touch within 24 hours.
                </Heading>
              </Stack>
            </FadeIn>

            <FadeIn className="w-full max-w-635">
              <form onSubmit={handleSubmit} className="flex w-full flex-col items-center max-992:gap-40 gap-50">
                <div className="grid w-full grid-cols-1 gap-15 992:grid-cols-2">
                  <input type="text" name="firstName" placeholder="Your name" className={inputClasses} />
                  <input type="text" name="lastName" placeholder="surname" className={inputClasses} />
                  <input type="email" name="email" placeholder="Email address" className={inputClasses} />
                  <input type="text" name="eventType" placeholder="Event type" className={inputClasses} />
                  <input type="text" name="preferredDate" placeholder="Preferred date" className={inputClasses} />
                  <input type="text" name="guestCount" placeholder="Approximate guest count" className={inputClasses} />
                  <textarea
                    name="message"
                    placeholder="Message / brief (optional)"
                    className="block h-116 w-full resize-none rounded-5 border border-brand-muted bg-transparent px-25 py-15 text-13 leading-12 tracking-5 text-ink capitalize backdrop-blur-[1px] placeholder:text-ink/60 placeholder:capitalize focus:outline-none max-992:h-116 992:col-span-2 992:h-95"
                  />
                </div>
                <Button type="submit" variant="solid" color="brand" className="px-20!">
                  Enquire
                </Button>
              </form>
            </FadeIn>
          </Stack>
        </div>
      </Container>
    </section>
  )
}
