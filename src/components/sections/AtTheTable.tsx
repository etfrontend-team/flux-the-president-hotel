'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { Carousel } from '@/components/Carousel'
import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Venue = {
  title: string
  caption: string
  ctaLabel: string
  image: string
  mobileImage?: string
  alt: string
  mobileAlt?: string
  href: string
}

const VENUES: Venue[] = [
  {
    title: 'Restaurant & Terrace',
    caption: "Seasonal menus at the water's edge.",
    ctaLabel: 'Discover restaurant',
    image: '/images/dining-restaurant-terrace.jpg',
    mobileImage: '/images/dining-restaurant-terrace-mobile.jpg',
    alt: 'A table set on the sea-facing terrace at The President Hotel',
    mobileAlt: "The hotel's palm-lined pool terrace at sunset",
    href: '#',
  },
  {
    title: 'Botany Café',
    caption: 'All-day light bites & cold-press coffee.',
    ctaLabel: 'Discover Botany Café',
    image: '/images/dining-botany-cafe.jpg',
    alt: 'Shared plates and sparkling wine on a table at Botany Café',
    href: '#',
  },
  {
    title: 'The Senate',
    caption: 'Cocktails poured slow, long after sundown.',
    ctaLabel: 'Discover The Senate',
    image: '/images/dining-the-senate.jpg',
    alt: 'A bartender mixing a cocktail at The Senate',
    href: '#',
  },
  {
    title: 'The Deck',
    caption: 'Wood-fired plates beside the pool.',
    ctaLabel: 'Discover The Deck',
    image: '/images/dining-the-deck.jpg',
    alt: 'A wood-fired oven glowing on The Deck',
    href: '#',
  },
]

const EXPANDED_GROW = 720
const COLLAPSED_GROW = 160

const IMAGE_WIDTH = 'w-[calc(60cqw-27px)]'

const EASE_EXPAND = 'ease-[cubic-bezier(0.215,0.61,0.355,1)]'
const EASE_REVEAL = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const EASE_TINT = 'ease-[cubic-bezier(0.87,0,0.13,1)]'

export function AtTheTable() {
  return (
    <section className="general-padding bg-paper overflow-hidden">
      <Container variant="lg" className="max-992:px-26">
        <div className='992:px-38'>
          <FadeIn>
            <Stack
              direction="row"
              justify="between"
              align="end"
              gap={30}
              mobileGap={35}
              className="max-767:flex-col max-767:items-start!"
            >
              <Stack gap={30} mobileGap={30}>
                <Prose as="span" font="accent" className="text-accent text-16 font-normal uppercase">
                  At the Table
                </Prose>
                <Heading level={2} size={3}>
                  Where the day tastes best.
                </Heading>
              </Stack>

              <Button as="a" href="#" variant="glass">
                View all
              </Button>
            </Stack>
          </FadeIn>
          <ExpandingPanels />
          <VenueCarousel />
        </div>
      </Container>
    </section>
  )
}

function ExpandingPanels() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div
      className={cn(
        '@container mt-63 flex gap-15',
        'max-767:hidden',
      )}
    >
      {VENUES.map((venue, index) => (
        <VenuePanel
          key={venue.title}
          venue={venue}
          isActive={index === activeIndex}
          onActivate={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
}

function VenuePanel({
  venue,
  isActive,
  onActivate,
}: {
  venue: Venue
  isActive: boolean
  onActivate: () => void
}) {
  return (
    <Link
      href={venue.href}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-current={isActive || undefined}
      style={{ '--grow': isActive ? EXPANDED_GROW : COLLAPSED_GROW } as React.CSSProperties}
      className={cn(
        'group relative h-660 min-w-0 shrink-0 basis-0 grow-(--grow) overflow-hidden rounded-card',
        'transition-[flex-grow] duration-1200 motion-reduce:transition-none',
        EASE_EXPAND,
      )}
    >
      <div className={cn('absolute top-0 left-1/2 h-full -translate-x-1/2', IMAGE_WIDTH)}>
        <Image
          src={venue.image}
          alt={venue.alt}
          fill
          sizes="720px"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-smoke/25 transition-[opacity,backdrop-filter] duration-1100',
          EASE_TINT,
          isActive ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-xs',
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0)_57%,rgba(0,0,0,0.45)_100%),linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))]',
          'transition-opacity delay-330 duration-600 ease-out motion-reduce:transition-none',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />

      <Stack gap={5} tabletGap={5} mobileGap={5} className="pointer-events-none absolute inset-0 w-630 max-w-none p-45 pt-50">
        <RevealLine isActive={isActive} delay="delay-330">
          <span className="font-display text-25 leading-display tracking-5 text-paper capitalize">
            {venue.title}
          </span>
        </RevealLine>
        <RevealLine isActive={isActive} delay="delay-400">
          <span className="font-body text-15 leading-copy font-light tracking-5 text-paper">
            {venue.caption}
          </span>
        </RevealLine>
      </Stack>
    </Link>
  )
}

function RevealLine({
  isActive,
  delay,
  children,
}: {
  isActive: boolean
  delay: string
  children: React.ReactNode
}) {
  return (
    <span className="block overflow-hidden">
      <span
        className={cn(
          'block transition-[transform,opacity] duration-1200 motion-reduce:transition-none',
          EASE_REVEAL,
          isActive ? `translate-y-0 opacity-100 ${delay}` : 'translate-y-[110%] opacity-0',
        )}
      >
        {children}
      </span>
    </span>
  )
}

function VenueCarousel() {
  return (
    <Carousel
      options={{ loop: false, align: 'start', containScroll: 'trimSnaps' }}
      className="mt-50 767:hidden max-767:overflow-visible"
      trackClassName="gap-20"
      slideClassName="flex-[0_0_70%]"
    >
      {VENUES.map((venue) => (
        <Link
          key={venue.title}
          href={venue.href}
          className="flex flex-col gap-30"
        >
          <div className="relative aspect-320/326 w-full overflow-hidden rounded-card">
            <Image
              src={venue.mobileImage ?? venue.image}
              alt={venue.mobileAlt ?? venue.alt}
              fill
              sizes="(max-width: 767px) 70vw, 320px"
              className="object-cover"
            />
          </div>

          <Stack gap={30} tabletGap={30} mobileGap={30}>
            <Stack gap={24} tabletGap={24} mobileGap={24}>
              <Heading level={3} size={4} uppercase={false} className="capitalize">
                {venue.title}
              </Heading>
              <Prose color="ink-light">{venue.caption}</Prose>
            </Stack>

            <span className="w-fit border-b border-brand-muted/80 pb-10 font-body text-13 tracking-5 text-brand uppercase">
              {venue.ctaLabel}
            </span>
          </Stack>
        </Link>
      ))}
    </Carousel>
  )
}
