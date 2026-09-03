'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type EventItem = {
  date: string
  tag: string
  title: string
  description: string
  image: string
  alt: string
  badge: { day: string; date: string; month: string }
}

/**
 * Per Figma (node 1:2648): only the first event's expanded copy (description +
 * "View Event" link) and image were specified — events 2 and 3 only ever
 * appeared in their collapsed date+title form in the design. Every row now
 * reveals the same description+link block on hover, so events 2 and 3 need
 * placeholder copy too (same lorem-ipsum voice the design itself uses for
 * event 1) — not real content. Same for their images: reusing two
 * already-sourced hotel photos as stand-ins so the hover image-swap is
 * actually visible.
 */
const events: EventItem[] = [
  {
    date: 'Monday 26 May',
    tag: 'Event Tag',
    title: 'Ullamcorper quam pellentesque',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/whats-on-1.webp',
    alt: 'A plate of pasta and a glass of white wine on a terrace table',
    badge: { day: 'MON', date: '26', month: 'MAY' },
  },
  {
    date: 'Saturday 03 June',
    tag: 'Event Tag',
    title: 'Ullamcorper quam pellentesque',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/marquee-3.webp',
    alt: 'The dining terrace at The President Hotel',
    badge: { day: 'SAT', date: '03', month: 'JUN' },
  },
  {
    date: 'Monday 06 July',
    tag: 'Event Tag',
    title: 'Ullamcorper quam pellentesque',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/marquee-8.webp',
    alt: 'A guest reading poolside with a drink',
    badge: { day: 'MON', date: '06', month: 'JUL' },
  },
]

/** Homepage section right below WhereToStay. Per Figma (node 1:2648). */
export function WhatsOn() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const activeIndex = hoveredIndex ?? 0

  return (
    <section className="general-padding !pt-0">
      <Container variant="lg" className="max-992:px-26">
        <div className="border-t border-brand-muted/30 mb-140 max-1024:mb-80" />

        <div className="grid grid-cols-1 992:gap-50 992:grid-cols-2 992:items-start 1199:px-38">
          <div className="order-1 flex flex-col items-center text-center 992:order-2 992:col-start-2 992:row-start-1 992:items-start 992:text-left">
            <div className="flex flex-col items-center 1024:px-25 max-992:mb-50 mb-40 992:items-start">
              <Stack align="center" gap={30} tabletGap={30} mobileGap={30} className="mb-35 992:items-start">
                <span className="font-accent text-16 tracking-5 text-accent uppercase">At the president</span>
                <Heading level={3}>What&apos;s On</Heading>
              </Stack>

              <Button as="a" href="#" variant="glass" color="brand" className="self-start max-992:mx-auto">
                View all
              </Button>
            </div>
          </div>

          <div className="relative order-2 overflow-hidden rounded-card max-992:aspect-388/338 992:order-1 992:col-start-1 992:row-start-1 992:row-span-2 992:h-full">
            {events.map((event, index) => (
              <Image
                key={event.date}
                src={event.image}
                alt={event.alt}
                fill
                sizes="(min-width: 992px) 50vw, 100vw"
                className={cn(
                  'object-cover transition-opacity duration-500 ease-out',
                  activeIndex === index ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}

            <div className="absolute left-0 top-40 rounded-tr-5 rounded-br-5 bg-paper-alt/80 max-768:size-72 max-768:p-10 size-80 px-24 py-14">
              {events.map((event, index) => (
                <div
                  key={event.date}
                  className={cn(
                    'absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ease-out',
                    activeIndex === index ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <span className="font-body max-768:text-12 text-13 tracking-5 text-accent uppercase">{event.badge.day}</span>
                  <span className="font-body max-768:text-18 text-21 tracking-5 text-accent uppercase">{event.badge.date}</span>
                  <span className="font-body max-768:text-12 text-13 tracking-5 text-accent uppercase">{event.badge.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-3 flex flex-col border-b border-brand-muted/30 992:col-start-2 992:row-start-2">
            {events.map((event, index) => (
              <div
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                key={event.date}
                className="max-992:first-of-type:border-t-0 border-t border-brand-muted/30 py-8"
              >
                <div
                  className={cn(
                    'flex flex-col px-25 max-992:px-15 pt-32 pb-12 transition-colors duration-300 ease-out',
                    hoveredIndex === index && 'bg-paper-alt/40',
                  )}
                >
                  <p className="font-body text-14 tracking-10 text-brand-muted uppercase mb-25">
                    {event.date} | {event.tag}
                  </p>
                  <Heading level={4} color="brand" uppercase={false} className="capitalize mb-20 block">
                    {event.title}
                  </Heading>

                  <div
                    className={cn(
                      'overflow-hidden transition-[max-height,padding-bottom] duration-300 ease-out',
                      activeIndex === index ? 'max-h-110 pb-20' : 'max-h-0',
                    )}
                  >
                    <Stack gap={30} tabletGap={30} mobileGap={30}>
                      <div className="h-42">
                        <Prose color="ink" className="line-clamp-2">
                          {event.description}
                        </Prose>
                      </div>
                      <Button as="a" href="#" variant="link" color="brand" className="self-start">
                        View Event
                      </Button>
                    </Stack>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
