'use client'

import Image from 'next/image'
import React from 'react'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading } from '@/components/ui'

type ShowcaseCard = {
  title: string
  meta: string
  description: string
  ctaLabel: string
  image: string
  /** Set only where the mobile mockup pairs the card with a different crop than the desktop one. */
  mobileImage?: string
  alt: string
  mobileAlt?: string
  href: string
}

/** Per Figma (desktop node 201:1495, mobile node 212:1497): three full-bleed room-type
 * cards, each a photo with a dark gradient scrim and a frosted caption strip along the
 * bottom holding the title, meta line, description and a "View …" button. */
const CARDS: ShowcaseCard[] = [
  {
    title: 'Rooms',
    meta: '2 adults  |  31sqm',
    description: 'Comfortable sea-view rooms — queen or twin.',
    ctaLabel: 'View rooms',
    image: '/images/stay-showcase-rooms.webp',
    mobileImage: '/images/stay-showcase-rooms-mob.webp',
    alt: 'A sea-view room with a wave photograph above the headboard',
    href: '#',
  },
  {
    title: 'Suites',
    meta: '2 adults  |  31sqm',
    description: 'Comfortable sea-view rooms — queen or twin.',
    ctaLabel: 'View Suites',
    image: '/images/stay-showcase-suites.webp',
    mobileImage: '/images/stay-showcase-suites-mob.webp',
    alt: 'A suite bedroom with a built-in wooden wardrobe',
    href: '#',
  },
  {
    title: 'Apartments',
    meta: '2 adults  |  31sqm',
    description: 'Admire the famous Lion’s Head',
    ctaLabel: 'View Apartments',
    image: '/images/stay-showcase-apartments.webp',
    mobileImage: '/images/stay-showcase-apartments-mob.webp',
    alt: 'An apartment living area with a dining table and a city view',
    href: '#',
  },
]

export function StayShowcase() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 991px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section className="general-padding bg-paper">
      <Container variant="lg" className="flex flex-col gap-40 max-992:gap-30">
        {CARDS.map((card, index) => (
          <FadeIn key={card.title} delay={index * 0.3} className='1024:px-38'>
            <div className="relative isolate overflow-hidden rounded-card aspect-1244/600 max-992:aspect-410/534">
              <Image
                src={isMobile ? (card.mobileImage ?? card.image) : card.image}
                alt={isMobile ? (card.mobileAlt ?? card.alt) : card.alt}
                fill
                sizes="(min-width: 992px) 1244px, 100vw"
                className="object-cover"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)] bg-black/10"
              />

              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-225 max-992:h-242 overflow-hidden">
                {[
                  { blur: 1, mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, transparent 40%)' },
                  { blur: 1, mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, transparent 60%)' },
                  { blur: 1, mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, transparent 80%)' },
                  { blur: 1, mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, transparent 100%)' },
                ].map(({ blur, mask }, i) => (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      backdropFilter: `blur(${blur}px)`,
                      WebkitBackdropFilter: `blur(${blur}px)`,
                      maskImage: mask,
                      WebkitMaskImage: mask,
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_100%)]" />
              </div>

              <div className="relative flex h-full max-w-440 flex-col items-start justify-end gap-30 px-30 pb-40 max-992:px-25 max-992:pb-30">
                <div className="flex flex-col gap-15">
                  <Heading level={3} color="paper" uppercase={false}>
                    {card.title}
                  </Heading>
                  <div className="flex flex-col gap-5">
                    <p className="font-accent font-medium text-12 leading-copy tracking-5 text-paper uppercase">
                      {card.meta}
                    </p>
                    <p className="font-body font-light text-14 leading-copy tracking-5 text-paper">
                      {card.description}
                    </p>
                  </div>
                </div>
                <Button as="a" href={card.href} variant="glass" color="paper">
                  {card.ctaLabel}
                </Button>
              </div>
            </div>
          </FadeIn>
        ))}
      </Container>
    </section>
  )
}
