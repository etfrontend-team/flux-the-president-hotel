import Image from 'next/image'
import React from 'react'

import { Container, Heading, Prose } from '@/components/ui'

import { BookingBar } from './BookingBar'

/**
 * Homepage hero. Per Figma annotation (node 1:2298): "All hero sections
 * across the website should be full viewport height" — so this uses
 * min-h-screen rather than the mockup's literal 866px frame height, and the
 * heading/booking-bar vertical rhythm is reproduced via flex layout instead
 * of the mockup's absolute pixel offsets.
 */
export function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden rounded-card">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/home-hero.jpg"
          alt="The President Hotel's sea-facing garden, Cape Town"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Container className="relative z-10 flex min-h-screen flex-col gap-40 px-24 py-32 992:px-60 992:py-40">
        <div className="my-auto flex flex-col items-start gap-30 text-paper">
          <Prose as="span" font="accent" color="paper" className="text-16 font-normal uppercase">
            Cape Town, South Africa
          </Prose>
          <div className="flex flex-col gap-35">
            <Heading
              level={1}
              color="paper"
            >
              Where the Atlantic
              <br />
              meets the city.
            </Heading>
            <Prose color="paper" className="max-w-469 !leading-copy">
              A boutique hotel on the edge of the sea — steps from the V&amp;A Waterfront, with
              views that hold.
            </Prose>
          </div>
        </div>

        <BookingBar />
      </Container>
    </section>
  )
}
