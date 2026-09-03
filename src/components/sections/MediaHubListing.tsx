'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Category = 'travel' | 'dining' | 'experiences' | 'sustainability' | 'news' | 'hotel'
type Filter = 'all' | Exclude<Category, 'hotel'>

type Post = {
  meta: string
  title: string
  description: string
  image: string
  alt: string
  href: string
  imageObjectPosition?: string
  category: Category
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Travel', value: 'travel' },
  { label: 'Dining', value: 'dining' },
  { label: 'Experiences', value: 'experiences' },
  { label: 'Sustainability', value: 'sustainability' },
  { label: 'News', value: 'news' },
]

/** Per Figma annotations on node 395:1513: title and excerpt are each capped to 2 lines on every card. */
const POSTS: Post[] = [
  {
    meta: 'Travel · March 2026',
    title: 'Cape Town in winter: why the cold season is the best season',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/mediahub-listing-winter.webp',
    alt: 'A woman lying on a lounger under palm trees, seen from above',
    href: '#',
    imageObjectPosition: '50% 87%',
    category: 'travel',
  },
  {
    meta: 'Experiences · Feb 2026',
    title: 'A day with the penguins: our SANCCOB experience guide',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/mediahub-listing-penguins.webp',
    alt: 'Three African penguins walking along the beach',
    href: '#',
    category: 'experiences',
  },
  {
    meta: 'Sustainability · Jan 2026',
    title: "Why we switched to local: The President's kitchen sourcing story",
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/mediahub-listing-oysters.webp',
    alt: 'A plate of oysters with lemon wedges and dipping sauce',
    href: '#',
    imageObjectPosition: '50% 33%',
    category: 'sustainability',
  },
  {
    meta: 'Dining · Dec 2025',
    title: 'The Deck at sunset: five cocktails worth the view',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/mediahub-listing-sunset-deck.webp',
    alt: 'A sunset view over the ocean with palm trees and a sailboat',
    href: '#',
    category: 'dining',
  },
  {
    meta: 'Travel · Nov 2025',
    title: 'Your complete guide to Sea Point Promenade',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/mediahub-listing-promenade.webp',
    alt: 'A woman standing on coastal rocks holding a flowing scarf',
    href: '#',
    imageObjectPosition: '50% 77%',
    category: 'travel',
  },
  {
    meta: 'Hotel · Oct 2025',
    title: 'Behind the room: how we design for comfort',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/mediahub-listing-room-design.webp',
    alt: 'A hotel suite living area with a dining table and a view through to the bedroom',
    href: '#',
    category: 'hotel',
  },
]

/** Per Figma (node 395:1513): filterable grid of Media Hub articles. */
export function MediaHubListing() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const visiblePosts = activeFilter === 'all' ? POSTS : POSTS.filter((post) => post.category === activeFilter)

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

            <div className="relative mb-40 h-60 w-full rounded-card border border-brand-muted/40 shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] 992:hidden">
              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value as Filter)}
                aria-label="Filter articles"
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
            {visiblePosts.map((post) => (
              <FadeIn key={post.title}>
                <article className="group flex flex-col gap-35">
                  <Link href={post.href} className="relative aspect-388/315 w-full overflow-hidden rounded-card">
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      sizes="(min-width: 993px) 33vw, 100vw"
                      style={post.imageObjectPosition ? { objectPosition: post.imageObjectPosition } : undefined}
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  </Link>

                  <Stack gap={30} tabletGap={30} mobileGap={30}>
                    <Stack gap={25} tabletGap={25} mobileGap={25}>
                      <span className="font-body text-14 leading-12 tracking-10 text-brand-muted uppercase">
                        {post.meta}
                      </span>
                      <Heading level={6} uppercase={false} className="line-clamp-2 capitalize">
                        {post.title}
                      </Heading>
                      <Prose color="ink-light" className="line-clamp-2 text-14">
                        {post.description}
                      </Prose>
                    </Stack>
                    <Button as="a" href={post.href} variant="link" color="muted" className="text-13">
                      Read More
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
