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
  /** Label for the mobile card's "Discover …" link (Figma node 1:3574). */
  ctaLabel: string
  image: string
  /** Set only where the mobile mockup pairs the venue with a different photo than the desktop one. */
  mobileImage?: string
  alt: string
  mobileAlt?: string
  href: string
}

/** Botany Café and Restaurant & Terrace take their copy from Figma (desktop node 1:2419/1:2410,
    mobile node 1:3571/1:3572); the other two are named from the footer's DINE column, with
    placeholder captions until the CMS lands. */
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

/** Panel widths from Figma (node 1:2409 vs. 1:2411): 720px expanded, 160px collapsed, 15px gutters
    — expressed as flex-grow ratios against a `basis-0` row so the section stays fluid. */
const EXPANDED_GROW = 720
const COLLAPSED_GROW = 160

/**
 * Width of the image layer inside every panel — always the *expanded* panel width, whatever the
 * panel currently measures, so the photo never rescales as the panel opens or closes (see
 * VenuePanel). Derived from the row's own width via container query units: the row distributes
 * `rowWidth − gaps` by the grow ratios above, so the expanded share is
 * `(100cqw − 3 × 15px) × 720 / 1200` → `60cqw − 27px`. Revisit both terms if the panel count,
 * the gap or the ratios change.
 */
const IMAGE_WIDTH = 'w-[calc(60cqw-27px)]'

/** GSAP easings from the reference implementation, as their CSS equivalents. */
const EASE_EXPAND = 'ease-[cubic-bezier(0.215,0.61,0.355,1)]' // power3.out — panel width
const EASE_REVEAL = 'ease-[cubic-bezier(0.16,1,0.3,1)]' // expo.out — text rising into place
const EASE_TINT = 'ease-[cubic-bezier(0.87,0,0.13,1)]' // expo.inOut — glass crossfade

/**
 * "At the Table" — the dining section, which Figma designs as two different things:
 *
 * - ≥768px (node 1:2401): a row of panels. The hovered panel grows to the 720px Figma width while
 *   its siblings collapse to 160px behind glass. The Figma annotation on node 1:2409 ("As the user
 *   hovers, image expands") points at produx.design, and the client's reference recording shows the
 *   photo holding still under the opening panel — so the image is a fixed-size, centre-anchored
 *   layer and the panel is only a mask. The active panel is sticky: it stays open on mouse-out
 *   until another panel takes over, as on the reference.
 * - <768px (node 1:3555): no hover, so no expansion — a snap-scrolling carousel showing one card and half of the next, with
 *   the title, caption and "Discover …" link set below each image on the paper background.
 *
 * Not ported from the reference: its per-word stagger and its scroll-scrubbed image parallax.
 */
export function AtTheTable() {
  return (
    <section className="general-padding bg-paper">
      <Container variant="lg">
        <FadeIn>
          {/* Desktop puts the button opposite the heading; mobile (node 1:3556) stacks it 35px below. */}
          {/* Stack's own mobile direction switches at 992px; this section's breakpoint is 768px
              (Figma has a desktop and a mobile frame, nothing between), so the switch is local. */}
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
      </Container>
    </section>
  )
}

/** ≥768px — the hover-expanded panel row (Figma node 1:2401). */
function ExpandingPanels() {
  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <div
      className={cn(
        // `@container` so each panel can size its image layer off the row width — see IMAGE_WIDTH.
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
      {/* The image layer is held at the expanded panel width and centred, so the panel opening is a
          mask sliding off a stationary photo — the client's reference recording shows the image
          neither scaling nor drifting, only its centre crop widening. */}
      <div className={cn('absolute top-0 left-1/2 h-full -translate-x-1/2', IMAGE_WIDTH)}>
        <Image
          src={venue.image}
          alt={venue.alt}
          fill
          sizes="720px"
          className="object-cover"
        />
      </div>

      {/* Figma node 1:2413 — collapsed panels sit behind glass: a flat rgba(149,148,148,0.25) fill
          plus Figma's "Frost" (its Refraction/Dispersion have no CSS equivalent). The glass lifts
          off the panel as it expands. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-smoke/25 transition-[opacity,backdrop-filter] duration-1100',
          EASE_TINT,
          isActive ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-xs',
        )}
      />

      {/* Figma node 1:2409 — 45% black at the top edge, over a flat 10% black, for caption legibility. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0)_57%,rgba(0,0,0,0.45)_100%),linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))]',
          'transition-opacity delay-330 duration-600 ease-out motion-reduce:transition-none',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Fixed-width so the copy never reflows while the panel animates — it is simply clipped
          by the collapsing frame, as on the reference. */}
      <div className="pointer-events-none absolute inset-0 flex w-630 max-w-none flex-col gap-5 p-45 pt-50">
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
      </div>
    </Link>
  )
}

/** One line of panel copy, rising out of its own clipping box once the panel is active. */
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

/** <768px — the embla-driven card carousel (Figma node 1:3564): image, then copy on the paper background. */
function VenueCarousel() {
  return (
    <Carousel
      options={{ loop: false, align: 'start', containScroll: 'trimSnaps' }}
      /* -mr-24 cancels Container's mobile right padding so the strip runs to the screen edge —
         the half-visible card is cut off by the viewport, not by a gutter. */
      className="mt-50 -mr-24 767:hidden"
      trackClassName="gap-20"
      /* Sized off the viewport rather than pinned to the mockup's literal 320px: the whole card
         takes 70% of the track and the next one shows through the remaining 30% (less the 20px
         gutter), matching the split in the mobile frame. */
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

          <div className="flex flex-col gap-30">
            <div className="flex flex-col gap-24">
              <Heading level={3} size={4} uppercase={false} className="capitalize">
                {venue.title}
              </Heading>
              <Prose color="ink-light">{venue.caption}</Prose>
            </div>

            {/* Not a Button: Figma node 1:3573 is a static bottom rule in the body font, not the
                brand button's animated underline. */}
            <span className="w-fit border-b border-brand-muted/80 pb-10 font-body text-13 tracking-5 text-brand uppercase">
              {venue.ctaLabel}
            </span>
          </div>
        </Link>
      ))}
    </Carousel>
  )
}
