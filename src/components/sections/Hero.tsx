import Image from 'next/image'
import React from 'react'

import { Container, Heading, Prose } from '@/components/ui'

import { BookingBar } from './BookingBar'

/** Leave a src empty ('') to skip that media — the video plays only when its URL is set, and falls back to the image otherwise. */
const HERO_IMAGE_SRC = ''
const HERO_VIDEO_SRC = '/images/pres-hero-video.mp4'

/**
 * Homepage hero. Per Figma annotation (node 1:2298): "All hero sections
 * across the website should be full viewport height" — so this uses
 * min-h-screen rather than the mockup's literal 866px frame height, and the
 * heading/booking-bar vertical rhythm is reproduced via flex layout instead
 * of the mockup's absolute pixel offsets.
 */
export function Hero() {
  return (
    <section data-hero className="relative isolate overflow-hidden rounded-card max-992:m-15 m-25">
      {/* Image/video is confined to this block (not the whole section) so it never
          stretches to cover the mobile booking bar sitting below it in normal flow. */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_VIDEO_SRC ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_IMAGE_SRC || undefined}
              className="absolute inset-0 size-full object-cover"
              src={HERO_VIDEO_SRC}
            />
          ) : HERO_IMAGE_SRC ? (
            <Image
              src={HERO_IMAGE_SRC}
              alt="The President Hotel's sea-facing garden, Cape Town"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}

          {/* Darkens the top, left and bottom edges for text legibility — 3 stacked linear gradients per Figma (50%/35%/40% black). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_30%),linear-gradient(to_right,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_65%),linear-gradient(to_top,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_25%)]"
          />
        </div>

        <Container className="relative z-10 flex min-h-screen flex-col p-0 992:p-0">
          <div className="my-auto flex flex-col items-start gap-30 text-paper max-992:px-25 px-35">
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

          {/* Desktop: glass fields overlaid on the image (Figma node 1:2354). */}
          <div className="max-992:hidden">
            <BookingBar variant="overlay" />
          </div>
        </Container>
      </div>

      {/* Mobile: plain outlined fields in normal flow below the image (Figma node 59:444). */}
      <div className="992:hidden">
        <BookingBar variant="flow" />
      </div>
    </section>
  )
}
