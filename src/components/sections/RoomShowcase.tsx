'use client'

import Image from 'next/image'
import React from 'react'

import { ChevronRightIcon } from '@/components/icons'
import { Button, Container, Heading, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type RoomSlide = {
  image: string
  alt: string
}

/** Only one "Rooms" photo/caption was specified in Figma — reusing the other two
 * already-sourced room-type photos as slide filler, same as WhatsOn's stand-in
 * images, so the crossfade is actually visible. */
const SLIDES: RoomSlide[] = [
  {
    image: '/images/stay-showcase-rooms.webp',
    alt: 'A sea-view room with a queen bed and city views through the window',
  },
  {
    image: '/images/stay-showcase-suites.webp',
    alt: 'A suite bedroom with a built-in wooden wardrobe',
  },
  {
    image: '/images/stay-showcase-apartments.webp',
    alt: 'An apartment living area with a dining table and a city view',
  },
]

/** How long each slide holds before crossfading to the next. */
const SLIDE_INTERVAL_MS = 5000

/**
 * Per Figma (node 1:944): "Pup Stays" heading over a single full-bleed card.
 * The annotation on the image points to modern-carousel-slider.framer.website
 * as the reference for the crossfade — a long, gentle fade between images
 * rather than a snap cut, so the transition duration here is deliberately
 * slow (1.5s) with a long hold (5s) between slides.
 */
export function RoomShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  function goToPrev() {
    setActiveIndex((index) => (index - 1 + SLIDES.length) % SLIDES.length)
  }

  function goToNext() {
    setActiveIndex((index) => (index + 1) % SLIDES.length)
  }

  return (
    <section className="general-padding">
      <Container variant="lg" className="max-992:px-26">
        <Heading level={3} className="mb-40">
          Pup Stays
        </Heading>

        <div className="relative aspect-1244/600 w-full overflow-hidden rounded-card max-992:aspect-410/534">
          {SLIDES.map((slide, index) => (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 993px) 1244px, 100vw"
              className={cn(
                'object-cover transition-opacity duration-1500 ease-in-out',
                activeIndex === index ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(45,7,0,0.2)_0%,rgba(0,0,0,0)_20%),linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),linear-gradient(to_top,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_27%)]"
          />

          <Stack direction="row" gap={10} tabletGap={10} mobileGap={10} className="absolute right-30 bottom-30 z-10">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous room"
              className="group/navbtn relative cursor-pointer flex size-34 items-center justify-center rounded-full bg-paper/80"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
              />
              <ChevronRightIcon className="relative h-12 w-7 rotate-180 text-brand" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next room"
              className="group/navbtn relative cursor-pointer flex size-34 items-center justify-center rounded-full bg-paper/80"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
              />
              <ChevronRightIcon className="relative h-12 w-7 text-brand" />
            </button>
          </Stack>

          <div className="absolute inset-x-0 bottom-0 backdrop-blur-[2.5px]">
            <Stack
              align="start"
              gap={30}
              tabletGap={30}
              mobileGap={30}
              className="max-w-400 w-full px-40 py-40 max-992:max-w-none max-992:px-25 max-992:py-30"
            >
              <Stack align="start" gap={20} tabletGap={20} mobileGap={20}>
                <Heading level={4} color="paper" uppercase={false} className="capitalize">
                  Rooms
                </Heading>
                <Stack align="start" gap={15} tabletGap={15} mobileGap={15}>
                  <p className="font-accent font-medium text-12 leading-copy tracking-5 text-paper uppercase">
                    2 adults | 31sqm
                  </p>
                  <p className="font-body font-light text-14 leading-copy tracking-5 text-paper">
                    Comfortable sea-view rooms — queen or twin.
                  </p>
                </Stack>
              </Stack>
              <Button as="a" href="#" variant="glass" color="paper">
                View rooms
              </Button>
            </Stack>
          </div>
        </div>
      </Container>
    </section>
  )
}
