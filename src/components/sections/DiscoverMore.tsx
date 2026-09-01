'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { Carousel } from '@/components/Carousel'
import { FadeIn } from '@/components/FadeIn'
import { Container, Heading, Prose } from '@/components/ui'
import { cn } from '@/lib/utils'

type DiscoverCard = {
  title: string
  caption: string
  ctaLabel: string
  image: string
  alt: string
  href: string
}

const DISCOVER_CARDS: DiscoverCard[] = [
  {
    title: 'Stay',
    caption: 'Amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
    ctaLabel: 'Discover Stay',
    image: '/images/discover-more-stay.webp',
    alt: 'The President Hotel viewed from the pool terrace, with Lion’s Head rising behind it',
    href: '#',
  },
  {
    title: 'Dining',
    caption: 'Amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
    ctaLabel: 'Discover Dining',
    image: '/images/discover-more-dining.webp',
    alt: 'A table set for dinner in one of the hotel’s dining rooms',
    href: '#',
  },
]

const EXPANDED_GROW = 755
const COLLAPSED_GROW = 160

const IMAGE_WIDTH = 'w-[calc(82.51cqw-12.38px)]'

const EASE_EXPAND = 'ease-[cubic-bezier(0.215,0.61,0.355,1)]'
const EASE_REVEAL = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const EASE_TINT = 'ease-[cubic-bezier(0.87,0,0.13,1)]'

export function DiscoverMore() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="general-padding bg-paper">
      <Container variant="lg" className='1024:max-w-930 mx-auto'>
        <FadeIn>
          <Heading level={2} size={3} className="text-center">
            Discover More
          </Heading>
        </FadeIn>

        <div className="@container mt-50 flex gap-15 max-767:hidden">
          {DISCOVER_CARDS.map((card, index) => (
            <DiscoverCardPanel
              key={card.title}
              card={card}
              isActive={index === activeIndex}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <DiscoverCarousel />
      </Container>
    </section>
  )
}

/** <768px — the embla-driven card carousel (same pattern as At the Table's VenueCarousel). */
function DiscoverCarousel() {
  return (
    <Carousel
      options={{ loop: false, align: 'start', containScroll: 'trimSnaps' }}
      className="mt-50 767:hidden max-767:overflow-visible"
      trackClassName="gap-20"
      slideClassName="flex-[0_0_70%]"
    >
      {DISCOVER_CARDS.map((card) => (
        <Link key={card.title} href={card.href} className="flex flex-col gap-30">
          <div className="relative aspect-320/326 w-full overflow-hidden rounded-card">
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 767px) 70vw, 320px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-30">
            <div className="flex flex-col gap-24">
              <Heading level={3} size={4} uppercase={false} className="capitalize">
                {card.title}
              </Heading>
              <Prose color="ink-light">{card.caption}</Prose>
            </div>

            <span className="w-fit border-b border-brand-muted/80 pb-10 font-body text-13 tracking-5 text-brand uppercase">
              {card.ctaLabel}
            </span>
          </div>
        </Link>
      ))}
    </Carousel>
  )
}

function DiscoverCardPanel({
  card,
  isActive,
  onActivate,
}: {
  card: DiscoverCard
  isActive: boolean
  onActivate: () => void
}) {
  return (
    <Link
      href={card.href}
      aria-label={card.ctaLabel}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-current={isActive || undefined}
      style={{ '--grow': isActive ? EXPANDED_GROW : COLLAPSED_GROW } as React.CSSProperties}
      className={cn(
        'group relative h-500 min-w-0 shrink-0 basis-0 grow-(--grow) overflow-hidden rounded-card',
        'transition-[flex-grow] duration-1200 motion-reduce:transition-none',
        EASE_EXPAND,
      )}
    >
      <div className={cn('absolute top-0 left-1/2 h-full -translate-x-1/2', IMAGE_WIDTH)}>
        <Image src={card.image} alt={card.alt} fill sizes="755px" className="object-cover" />
      </div>

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-smoke/25 transition-[opacity,backdrop-filter] duration-1100',
          EASE_TINT,
          isActive ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-xs',
        )}
      />

      {/* Figma node 1:713 — darkens toward the *bottom* edge (180deg, unlike At the Table's
          top-anchored copy), since this card's title/caption sit low in the frame. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%),linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))]',
          'transition-opacity delay-330 duration-600 ease-out motion-reduce:transition-none',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="pointer-events-none absolute inset-0 flex w-438 max-w-none flex-col justify-end gap-5 pb-45 pl-30">
        <RevealLine isActive={isActive} delay="delay-330">
          <span className="font-display text-25 leading-display tracking-5 text-paper capitalize">
            {card.title}
          </span>
        </RevealLine>
        <RevealLine isActive={isActive} delay="delay-400">
          <span className="font-body text-15 leading-copy font-light tracking-5 text-paper">
            {card.caption}
          </span>
        </RevealLine>
      </div>
    </Link>
  )
}

/** One line of card copy, rising out of its own clipping box once the card is active. */
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
