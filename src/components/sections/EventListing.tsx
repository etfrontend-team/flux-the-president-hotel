'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Category = 'dining' | 'music' | 'experiences' | 'families'

type EventItem = {
  date: string
  title: string
  description: string
  price: string
  image: string
  alt: string
  href: string
  imageObjectPosition?: string
  badge: { day: string; date: string; month: string }
  category: Category
}

type Filter = 'all' | 'this-week' | 'this-month' | Category

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'This Week', value: 'this-week' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Dining', value: 'dining' },
  { label: 'Music', value: 'music' },
  { label: 'Experiences', value: 'experiences' },
  { label: 'Families', value: 'families' },
]

/** Per Figma annotation on node 1:11653: event copy is capped to 3 lines on every Events/What's On card. */
const EVENTS: EventItem[] = [
  {
    date: 'Sun 10 May · 10:00',
    title: 'Sunday Brunch',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'R295 per person',
    image: '/images/upcoming-events-brunch.webp',
    alt: 'A brunch plate with poached eggs and smoked salmon on a terrace table',
    href: '#',
    badge: { day: 'SUN', date: '12', month: 'May' },
    category: 'dining',
  },
  {
    date: 'Sat 6 Jun · 07:30',
    title: 'SANCCOB Penguin Walk',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'R295 per person',
    image: '/images/upcoming-events-penguin-walk.webp',
    alt: 'Two African penguins standing on coastal rocks',
    href: '#',
    imageObjectPosition: '76% 50%',
    badge: { day: 'SAT', date: '06', month: 'Jun' },
    category: 'experiences',
  },
  {
    date: 'Sat 13 Jun · 19:00',
    title: 'Mid-Winter Long Table',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'Free for hotel guests',
    image: '/images/upcoming-events-long-table.webp',
    alt: 'A long table spread with shared plates viewed from above',
    href: '#',
    badge: { day: 'MON', date: '26', month: 'May' },
    category: 'dining',
  },
  {
    date: 'Fri 19 Jun · 18:00',
    title: 'Live Acoustic Session',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'R295 per person',
    image: '/images/whatson-listing-guitarist.webp',
    alt: 'A musician playing acoustic guitar',
    href: '#',
    imageObjectPosition: '34% 50%',
    badge: { day: 'Fri', date: '19', month: 'Jun' },
    category: 'music',
  },
  {
    date: 'Sun 28 Jun · 11:00',
    title: 'Winter Pool Day',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'R295 per person',
    image: '/images/whatson-listing-pool-couple.webp',
    alt: 'A couple by the pool, one wearing a wide-brimmed sun hat',
    href: '#',
    badge: { day: 'Sun', date: '28', month: 'Jun' },
    category: 'families',
  },
  {
    date: 'Monday 26 May | Event Tag',
    title: 'Ullamcorper quam pellentesque',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'Free for hotel guests',
    image: '/images/whatson-listing-sailboat-sunset.webp',
    alt: 'A sailboat on the water at sunset, palm trees in the foreground',
    href: '#',
    imageObjectPosition: '100% 90%',
    badge: { day: 'MON', date: '26', month: 'May' },
    category: 'experiences',
  },
]

/** Per Figma (node 343:1490): filterable grid of all events, below the featured one. */
export function EventListing() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const visibleEvents =
    activeFilter === 'all' || activeFilter === 'this-week' || activeFilter === 'this-month'
      ? EVENTS
      : EVENTS.filter((event) => event.category === activeFilter)

  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <FadeIn>
            <Stack direction="row" gap={25} tabletGap={25} mobileGap={25} className="mb-60 max-992:hidden">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    'relative shrink-0 cursor-pointer border-b border-solid pb-10 font-body text-14 tracking-5 text-brand uppercase backdrop-blur-[1px]',
                    activeFilter === filter.value ? 'border-brand-muted/80' : 'border-transparent',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </Stack>

            {/* Mobile (per Figma node 343:1491): the tab row collapses into a single dropdown. */}
            <div className="relative mb-40 h-60 w-full rounded-card border border-brand-muted/40 shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] 992:hidden">
              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value as Filter)}
                aria-label="Filter events"
                className="size-full appearance-none bg-transparent px-20 pr-40 font-body text-14 tracking-5 text-brand uppercase focus:outline-none"
              >
                {FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronRightIcon className="pointer-events-none absolute right-20 top-1/2 h-12 w-7 -translate-y-1/2 rotate-90 text-brand" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-x-40 gap-y-50 992:grid-cols-3">
            {visibleEvents.map((event) => (
              <FadeIn key={event.title}>
                <article className="group flex flex-col gap-35 max-992:gap-40">
                  <Link href={event.href} className="relative max-992:aspect-388/338 aspect-square w-full overflow-hidden rounded-card">
                    <Image
                      src={event.image}
                      alt={event.alt}
                      fill
                      sizes="(min-width: 993px) 33vw, 100vw"
                      style={event.imageObjectPosition ? { objectPosition: event.imageObjectPosition } : undefined}
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute left-0 top-40 flex size-80 flex-col items-center justify-center rounded-tr-5 rounded-br-5 bg-paper-alt/80 backdrop-blur-xs px-24 py-14 max-992:size-72 max-992:p-10">
                      <span className="font-body text-13 tracking-5 text-accent uppercase max-992:text-12">
                        {event.badge.day}
                      </span>
                      <span className="font-body text-21 tracking-5 text-accent uppercase max-992:text-18">
                        {event.badge.date}
                      </span>
                      <span className="font-body text-13 tracking-5 text-accent uppercase max-992:text-12">
                        {event.badge.month}
                      </span>
                    </div>
                  </Link>

                  <Stack gap={30} tabletGap={30} mobileGap={30}>
                    <Stack gap={20} tabletGap={20} mobileGap={20}>
                      <span className="font-body text-14 leading-12 tracking-10 text-brand-muted uppercase">
                        {event.date}
                      </span>
                      <Heading level={4} uppercase={false} className="capitalize">
                        {event.title}
                      </Heading>
                      <Prose color="ink-light" className="line-clamp-3">
                        {event.description}
                      </Prose>
                    </Stack>
                    <p className="font-display font-normal text-14 leading-12 tracking-10 text-accent capitalize">
                      {event.price}
                    </p>
                    <Button as="a" href={event.href} variant="link" color="brand" className="text-13">
                      View Event
                    </Button>
                  </Stack>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-80 max-992:mt-50 flex justify-center">
            <Button as="button" type="button" variant="glass" color="brand">
              Load More
            </Button>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
