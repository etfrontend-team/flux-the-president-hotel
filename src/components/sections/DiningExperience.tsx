'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

export const underlineClasses =
  "before:absolute before:inset-x-0 before:-bottom-5 before:h-px before:origin-left before:scale-x-0 before:bg-current before:transition-[scale] before:duration-[735ms] before:ease-[cubic-bezier(0.625,0.05,0,1)] before:content-[''] " +
  "after:absolute after:inset-x-0 after:-bottom-5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-[scale] after:duration-[735ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] after:content-[''] " +
  'hover:before:origin-right hover:before:delay-100 hover:after:origin-left hover:after:scale-x-100 hover:after:delay-100'

type DiningCard = {
  navLabel: string
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  image: string
  imagePosition: string
  alt: string
  href: string
}

const DINING_CARDS: DiningCard[] = [
  {
    navLabel: 'Restaurant & Terrace',
    eyebrow: 'taste Seasonality',
    title: 'Restaurant & Terrace',
    description:
      "With indoor and outdoor seating options, our buffet breakfast is quite the spread, with the freshest, locally sourced ingredients. Our à la carte lunch and dinner menu changes seasonally and boasts a wide variety of options catering for all palates.",
    ctaLabel: 'Discover restaurant',
    image: '/images/dining-experience-restaurant-terrace.webp',
    imagePosition: '50% 61%',
    alt: 'Palm trees framing the pool terrace at sunset, with the ocean beyond',
    href: '#',
  },
  {
    navLabel: 'The Base Pizza',
    eyebrow: 'OOZING ITALIAN flavours',
    title: 'The Base Pizza',
    description:
      'The Base serves up artisanal wood-fired pizzas on thin, crispy base, oozing with fresh mozzarella and filled to the brim with gourmet toppings. Pizzas are made to be enjoyed while taking in the views or can be boxed up as a take-away.',
    ctaLabel: 'Discover The Base',
    image: '/images/dining-experience-the-base-pizza.webp',
    imagePosition: '55% 60%',
    alt: 'A wood-fired pizza fresh from the oven',
    href: '#',
  },
  {
    navLabel: 'Botany Cafe',
    eyebrow: 'flavour and goodness.',
    title: 'Botany Café',
    description:
      'Pop in for a snack, lunch date or coffee catch up. Made with only the freshest seasonal ingredients, our healthy sandwiches, seasonal salads, and delicious desserts burst with flavour and goodness.',
    ctaLabel: 'Discover Botany Café',
    image: '/images/dining-experience-botany-cafe.webp',
    imagePosition: '50% 55%',
    alt: 'A spread of fresh salads and light bites at Botany Café',
    href: '#',
  },
  {
    navLabel: 'The Senate',
    eyebrow: 'great meeting spoT',
    title: 'The Senate Bar',
    description:
      'A favourite among sports fanatics, The Senate comes alive when we screen matches on the big-screen TV. It’s also a great meeting spot for a casual coffee and chat on comfy couches.',
    ctaLabel: 'Discover The Senate',
    image: '/images/dining-experience-the-senate.webp',
    imagePosition: '50% 58%',
    alt: 'Cocktails being poured into a row of glasses at The Senate Bar',
    href: '#',
  },
  {
    navLabel: 'The Deck',
    eyebrow: 'ocean views',
    title: 'The Deck Bar',
    description:
      'The Deck Bar is the place to be in Cape Town for sundowners, with its ocean views, mouthwatering menu, ice-cold drinks and lively vibe. Sit back and unwind while our mixologist whips up your favourite cocktail – best served over sunset.',
    ctaLabel: 'Discover The Deck',
    image: '/images/dining-experience-the-deck.webp',
    imagePosition: '50% 75%',
    alt: 'Cocktails on a table at The Deck Bar overlooking the ocean',
    href: '#',
  },
  {
    navLabel: 'Poolside Dining',
    eyebrow: 'mouthwatering menu',
    title: 'Poolside Dining',
    description:
      'Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza.',
    ctaLabel: 'Discover Poolside Dining',
    image: '/images/dining-experience-poolside-dining.webp',
    imagePosition: '50% 56%',
    alt: 'A dish served poolside',
    href: '#',
  },
]

export function DiningExperience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = cardRefs.current.findIndex((el) => el === entry.target)
          if (index !== -1) setActiveIndex(index)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )

    for (const el of cardRefs.current) {
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="general-padding bg-paper">
      <Container variant="lg" className="grid grid-cols-[269px_1fr] gap-x-30 max-992:block">
        {/* Figma node 68:440 — sticky 74px from the top (not flush), so it rests just below the
            sticky AnnouncementBar rather than under it. */}
        <div className="max-992:hidden">
          <Stack gap={25} tabletGap={25} mobileGap={25} className="sticky top-74 rounded-card border border-brand/10 bg-paper-alt/40 px-35 py-40">
            {DINING_CARDS.map((card, index) => (
              <button
                key={card.navLabel}
                type="button"
                onClick={() =>
                  cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className={cn(
                  'cursor-pointer relative inline-block w-fit text-left font-body text-14 tracking-5 text-brand uppercase transition-opacity duration-300',
                  underlineClasses,
                  index === activeIndex
                    ? 'opacity-100 after:origin-left after:scale-x-100'
                    : 'opacity-50 hover:opacity-80',
                )}
              >
                {card.navLabel}
              </button>
            ))}
          </Stack>
        </div>

        {/* Mobile/tablet: sticky rail collapses into a dropdown (Figma nodes 1:4463, 1:5822). */}
        <div className="relative mb-40 992:hidden">
          <button
            type="button"
            onClick={() => setIsNavOpen((open) => !open)}
            aria-expanded={isNavOpen}
            className="flex w-full cursor-pointer items-center justify-between rounded-card border border-brand-muted/40 bg-paper px-25 py-20 font-body text-14 tracking-[0.7px] text-brand uppercase shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] backdrop-blur-[1px]"
          >
            {DINING_CARDS[activeIndex].navLabel}
            <ChevronRightIcon
              className={cn('h-12 w-7 transition-transform duration-300', isNavOpen ? '-rotate-90' : 'rotate-90')}
            />
          </button>

          {isNavOpen && (
            <Stack
              gap={20}
              tabletGap={20}
              mobileGap={20}
              className="absolute inset-x-0 top-full z-10 mt-5 rounded-card border border-brand-muted/40 bg-paper px-25 py-20 shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] backdrop-blur-[1px]"
            >
              {DINING_CARDS.map((card, index) => (
                <button
                  key={card.navLabel}
                  type="button"
                  onClick={() => {
                    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    setIsNavOpen(false)
                  }}
                  className={cn(
                    'cursor-pointer text-left font-body text-14 tracking-[0.7px] uppercase',
                    index === activeIndex ? 'text-brand' : 'text-brand/50',
                  )}
                >
                  {card.navLabel}
                </button>
              ))}
            </Stack>
          )}
        </div>

        <Stack gap={80} tabletGap={80} mobileGap={50}>
          {DINING_CARDS.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.3}>
              <div
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className="scroll-mt-100 flex flex-col gap-35"
              >
                <div className="relative aspect-945/486 w-full overflow-hidden rounded-card max-992:aspect-410/320">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 993px) 945px, 100vw"
                    style={{ objectPosition: card.imagePosition }}
                    className="object-cover"
                  />
                </div>

                <Stack gap={30} tabletGap={30} mobileGap={30} className="max-w-650">
                  <p className="font-accent text-13 tracking-5 text-accent uppercase">{card.eyebrow}</p>
                  <Stack gap={25} tabletGap={25} mobileGap={25}>
                    <Heading level={3} size={3}>
                      {card.title}
                    </Heading>
                    <Prose className="opacity-80 max-w-full">{card.description}</Prose>
                  </Stack>
                </Stack>

                <Button as="a" href={card.href} variant="glass" color="brand" className="w-fit">
                  {card.ctaLabel}
                </Button>
              </div>
            </FadeIn>
          ))}
        </Stack>
      </Container>
    </section>
  )
}
