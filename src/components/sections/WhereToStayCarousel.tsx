'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import { ChevronRightIcon } from '@/components/icons'
import { Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type StayCard = {
  label: string
  image: string
  alt: string
  meta: string
  description: string
}

/**
 * Suites/Apartments only appear in their resting state in Figma (node
 * 1:2312) — the hover-revealed meta/description copy was only specified for
 * Rooms. Their `meta`/`description` below are placeholders in the same
 * voice, not values pulled from the design.
 */
const stayCards: StayCard[] = [
  {
    label: 'Rooms',
    image: '/images/stay-rooms.webp',
    alt: 'A sea-view room with a queen bed and city views through the window',
    meta: '2 Adults  |  31sqm',
    description: 'Comfortable sea-view rooms — queen or twin.',
  },
  {
    label: 'Suites',
    image: '/images/stay-suites.webp',
    alt: 'A suite living area with an armchair and framed artwork',
    meta: '2 Adults  |  45sqm',
    description: 'Spacious suites with a separate living area.',
  },
  {
    label: 'Apartments',
    image: '/images/stay-apartments.webp',
    alt: 'A self-catering apartment with a dining table and separate bedroom',
    meta: '4 Adults  |  60sqm',
    description: 'Self-catering apartments with a full kitchen.',
  },
]

/**
 * One component drives both breakpoints (Figma node 1:2312 desktop, 1:3475
 * mobile): below 1025px it's an Embla carousel — each card a full-width
 * slide with a dot nav and a tap-affordance chevron (there's no hover to
 * reveal the meta/description, so it's shown by default instead). From
 * 1025px it switches to a plain CSS grid (not Embla) with the hover-reveal
 * behavior it already had — a real grid rather than a 33%-flex-basis slide,
 * so it can't overflow/clip the last card the way percentage math plus gaps
 * and container padding could.
 */
export function WhereToStayCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!emblaApi) return

    function onSelect() {
      setSelectedIndex(emblaApi!.selectedScrollSnap())
    }

    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-20 1024:grid 1024:grid-cols-3 1024:gap-40">
          {stayCards.map((card, index) => {
            const isLastSlide = index === stayCards.length - 1

            return (
              <div
                key={card.label}
                className="group relative h-505 min-w-0 flex-[0_0_100%] overflow-hidden rounded-card shadow-image"
              >
                <Link href="#" className="absolute inset-0 block">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1025px) 33vw, 100vw"
                    className="object-cover"
                  />

                  {/* Top vignette — keeps the label legible, present in every state. */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(45,7,0,0.35)_0%,rgba(0,0,0,0)_22%)]" />

                  {/* Bottom darken + vignette behind the meta/description: shown by default
                      below 1025 (no hover to reveal it there), hover-only from 1025 up. */}
                  <div className="pointer-events-none absolute inset-0 will-change-[opacity] bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15)),linear-gradient(to_bottom,rgba(0,0,0,0)_65%,rgba(0,0,0,0.45)_100%)] opacity-100 transition-opacity duration-400 ease-out 1024:opacity-0 1024:group-hover:opacity-100" />

                  <Heading
                    level={4}
                    color="white"
                    uppercase={false}
                    className="absolute left-1/2 top-35 -translate-x-1/2 capitalize"
                  >
                    {card.label}
                  </Heading>

                  <Stack
                    gap={15}
                    tabletGap={15}
                    mobileGap={15}
                    className="absolute inset-x-0 bottom-0 max-1023:pr-116 p-30 1024:translate-y-10 1024:opacity-0 1024:transition-[opacity,translate] 1024:duration-400 1024:ease-out 1024:will-change-[translate,opacity] 1024:group-hover:translate-y-0 1024:group-hover:opacity-100"
                  >
                    <Prose as="p" font="accent" color="white" className="text-12 leading-copy font-normal uppercase">
                      {card.meta}
                    </Prose>
                    <Prose as="p" color="white" className="text-14 leading-copy!">
                      {card.description}
                    </Prose>
                  </Stack>
                </Link>

                {/* Shown below 1025 — desktop relies on the hover reveal instead.
                    Per Figma (node 1:5843): its own hover/active state, independent of the
                    card's group-hover.
                    A sibling of the Link (not nested inside it) so clicking it drives the
                    carousel instead of also triggering the card's own navigation. On the last
                    slide it wraps back to the first, and the chevron flips to signal that. */}
                <button
                  type="button"
                  onClick={() => (isLastSlide ? emblaApi?.scrollTo(0) : emblaApi?.scrollNext())}
                  aria-label={isLastSlide ? 'Go to first room' : 'Next room'}
                  className="group/navbtn cursor-pointer absolute right-30 bottom-30 z-10 flex size-34 items-center justify-center rounded-full bg-paper/80 1024:hidden"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
                  />
                  <ChevronRightIcon
                    className={cn('relative h-12 w-7 text-brand', isLastSlide && 'rotate-180 mr-3 mb-2')}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Shown below 1025 — desktop shows all three slides at once. */}
      <Stack direction="row" align="center" justify="center" gap={15} tabletGap={15} mobileGap={15} className="mt-25 1024:hidden">
        {stayCards.map((card, index) => (
          <button
            key={card.label}
            type="button"
            aria-label={`Go to ${card.label}`}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'cursor-pointer size-6 rounded-full bg-ink transition-opacity duration-300 ease-out',
              index === selectedIndex ? 'opacity-80' : 'opacity-40',
            )}
          />
        ))}
      </Stack>
    </div>
  )
}
