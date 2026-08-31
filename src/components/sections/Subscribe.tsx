'use client'

import Image from 'next/image'
import React from 'react'

import { Button, Container, Heading, Prose } from '@/components/ui'

/**
 * Homepage newsletter signup. Per Figma (node 1:2601) — the section's fill
 * is a background video at 10% opacity, masked by a linear gradient fading
 * to solid paper at the very top and bottom edges, so only a soft band of
 * it shows through the middle. Reuses MegaMenu's `menu-bg-shadow.mp4` —
 * same subtle ambient shadow/light texture, already the real asset for
 * this kind of low-opacity background treatment elsewhere in the project.
 *
 * UI only — the form has no real submission wired up (no newsletter
 * provider specified), matching this session's placeholder-action
 * convention for unspecified backend behavior.
 */
export function Subscribe() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section className="general-padding relative overflow-hidden bg-paper max-992:mt-15 mt-25">
      <video
        src="/images/menu-bg-shadow.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#fffcf9_0%,transparent_15%),linear-gradient(to_top,#fffcf9_0%,transparent_15%)]"
      />

      <Container variant="lg" className="relative">
        <div className="grid grid-cols-1 items-center gap-40 992:grid-cols-[343px_1fr_343px] max-992:px-14">
          <div className="relative hidden aspect-343/383 overflow-hidden rounded-5 992:block">
            <Image
              src="/images/subscribe-left.webp"
              alt="Friends toasting with drinks poolside"
              fill
              sizes="343px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center gap-50">
            <div className="flex flex-col items-center gap-20 text-center">
              <Heading level={3}>Stay in the loop</Heading>
              <Prose color="ink-light" className="max-w-404">
                Get our best rates, latest stories, and stay up to date with what&apos;s on at the hotel.
              </Prose>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-50">
              <div className="flex flex-col gap-15">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="block w-310 rounded-5 border border-brand-muted bg-transparent px-25 py-10 text-13 leading-9 tracking-5 text-ink capitalize placeholder:text-ink/60 placeholder:capitalize focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="block w-310 rounded-5 border border-brand-muted bg-transparent px-25 py-10 text-13 leading-9 tracking-5 text-ink capitalize placeholder:text-ink/60 placeholder:capitalize focus:outline-none"
                />
              </div>
              <Button type="submit" variant="solid" color="brand">
                Subscribe
              </Button>
            </form>
          </div>

          <div className="relative hidden aspect-343/383 overflow-hidden rounded-5 992:block">
            <Image
              src="/images/subscribe-right.webp"
              alt="A guest walking along the rocky shoreline beneath a beach umbrella"
              fill
              sizes="343px"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
