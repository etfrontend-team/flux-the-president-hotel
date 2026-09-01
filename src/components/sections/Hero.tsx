import Image from 'next/image'
import React from 'react'

import { Container, Heading, Prose, Stack } from '@/components/ui'

import { BookingBar } from './BookingBar'
import { BookingBarGate } from './BookingBarGate'
import { BookingBarOverlay } from './BookingBarOverlay'
import { BookingTab } from './BookingTab'

const DEFAULT_IMAGE_SRC = ''
const DEFAULT_VIDEO_SRC = '/images/pres-hero-video.mp4'

interface HeroProps {
  eyebrow?: string
  heading?: React.ReactNode
  description?: string
  videoSrc?: string
  imageSrc?: string
  imageAlt?: string
}

export function Hero({
  eyebrow = 'Cape Town, South Africa',
  heading = (
    <>
      <span className="block">Where the Atlantic</span>
      <span className="block">meets the city.</span>
    </>
  ),
  description = "A boutique hotel on the edge of the sea — steps from the V&A Waterfront, with views that hold.",
  videoSrc = DEFAULT_VIDEO_SRC,
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = "The President Hotel's sea-facing garden, Cape Town",
}: HeroProps = {}) {
  return (
    <>
      <section data-hero className="relative isolate overflow-hidden rounded-card max-992:m-15 m-25">
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 overflow-hidden max-1199:rounded-bl-card max-1199:rounded-br-card">
            {videoSrc ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={imageSrc || undefined}
                className="absolute inset-0 size-full object-cover"
                src={videoSrc}
              />
            ) : imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : null}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 max-992:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_40%),linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_75%)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_30%),linear-gradient(to_right,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_65%),linear-gradient(to_top,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_25%)]"
            />
          </div>

          <Container className="relative z-10 flex min-h-screen flex-col p-0 992:p-0">
            <Stack align="start" gap={30} tabletGap={30} mobileGap={30} className="my-auto text-paper max-992:px-25 px-35">
              <Prose as="span" font="accent" color="paper" className="text-16 leading-12 font-normal uppercase">
                {eyebrow}
              </Prose>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                <Heading
                  level={1}
                  color="paper"
                >
                  {heading}
                </Heading>
                <Prose color="paper" className="max-w-475">
                  {description}
                </Prose>
              </Stack>
            </Stack>

            {/* Desktop: glass fields overlaid on the image (Figma node 1:2354). */}
            <BookingBarGate>
              <div data-booking-bar="overlay" className="max-1199:hidden">
                <BookingBarOverlay />
              </div>
            </BookingBarGate>
          </Container>
        </div>

        {/* Mobile: plain outlined fields in normal flow below the image (Figma node 59:444). */}
        <BookingBarGate>
          <div data-booking-bar="flow" className="1199:hidden">
            <BookingBar variant="flow" />
          </div>
        </BookingBarGate>
      </section>
      <BookingBarGate>
        <BookingTab />
      </BookingBarGate>
    </>
  )
}
