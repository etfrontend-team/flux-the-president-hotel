'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { underlineClasses } from '@/components/Header'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type ExperienceCategory = 'at-the-president' | 'neighbourhood'

type Experience = {
  category: ExperienceCategory
  categoryLabel: string
  title: string
  description: string
  image: string
  alt: string
  imagePosition?: string
}

const DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet consectetur adipiscing.'

const experiences: Experience[] = [
  {
    category: 'at-the-president',
    categoryLabel: 'At The President',
    title: 'Beaches',
    description: DESCRIPTION,
    image: '/images/explore-experiences-beaches.webp',
    alt: 'A guest standing on the rocks beside the sea under a beach umbrella',
    imagePosition: '50% 78%',
  },
  {
    category: 'neighbourhood',
    categoryLabel: 'neighbourhood',
    title: 'Winelands',
    description: DESCRIPTION,
    image: '/images/explore-experiences-winelands-fg.webp',
    alt: 'Rolling vineyards in the Cape Winelands',
  },
  {
    category: 'neighbourhood',
    categoryLabel: 'neighbourhood',
    title: 'Galleries and Museums',
    description: DESCRIPTION,
    image: '/images/explore-experiences-galleries-museums.webp',
    alt: 'A modern gallery building lit up at dusk',
  },
  {
    category: 'neighbourhood',
    categoryLabel: 'neighbourhood',
    title: 'Parks & Nature Reserves',
    description: DESCRIPTION,
    image: '/images/explore-experiences-parks-nature.webp',
    alt: 'An aerial view of a coastal nature reserve',
  },
  {
    category: 'neighbourhood',
    categoryLabel: 'neighbourhood',
    title: 'Extreme',
    description: DESCRIPTION,
    image: '/images/explore-experiences-extreme.webp',
    alt: 'Paragliders soaring above the city and coastline',
  },
  {
    category: 'at-the-president',
    categoryLabel: 'At The President',
    title: 'Family',
    description: DESCRIPTION,
    image: '/images/explore-experiences-family.webp',
    alt: 'A family spending time together',
  },
  {
    category: 'at-the-president',
    categoryLabel: 'At The President',
    title: 'Ocean',
    description: DESCRIPTION,
    image: '/images/explore-experiences-ocean.webp',
    alt: 'A surfer walking into the ocean at sunset',
  },
  {
    category: 'neighbourhood',
    categoryLabel: 'neighbourhood',
    title: 'Outdoor',
    description: DESCRIPTION,
    image: '/images/explore-experiences-outdoor.webp',
    alt: 'A rocky cove with waves breaking against the shore',
  },
  {
    category: 'neighbourhood',
    categoryLabel: 'neighbourhood',
    title: 'Golf',
    description: DESCRIPTION,
    image: '/images/explore-experiences-golf.webp',
    alt: 'A golf course framed by mountains',
  },
]

const filters: { label: string; value: 'all' | ExperienceCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'At The President', value: 'at-the-president' },
  { label: 'neighbourhood', value: 'neighbourhood' },
]

export function ExploreExperiences() {
  const [activeFilter, setActiveFilter] = useState<'all' | ExperienceCategory>('all')

  const visible =
    activeFilter === 'all' ? experiences : experiences.filter((experience) => experience.category === activeFilter)

  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="px-38 max-992:px-11">
          <Stack
            direction="row"
            align="center"
            gap={25}
            tabletGap={25}
            mobileGap={15}
            className="mb-50 max-992:flex-wrap"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'relative inline-block px-1 pb-10 font-body text-14 tracking-10 text-brand uppercase cursor-pointer',
                  underlineClasses,
                  activeFilter === filter.value && 'after:origin-left after:scale-x-100',
                )}
              >
                {filter.label}
              </button>
            ))}
          </Stack>

          <div className="grid grid-cols-1 gap-x-40 gap-y-80 max-1024:gap-y-40 768:grid-cols-2 1024:grid-cols-3">
            {visible.map((experience) => (
              <article key={experience.title} className="group flex flex-col gap-35">
                <Link href="#" className="relative block aspect-388/315 overflow-hidden rounded-card">
                  <Image
                    src={experience.image}
                    alt={experience.alt}
                    fill
                    unoptimized
                    style={experience.imagePosition ? { objectPosition: experience.imagePosition } : undefined}
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </Link>

                <Stack gap={30} tabletGap={30} mobileGap={30}>
                  <Stack gap={20} tabletGap={20} mobileGap={20}>
                    <span className="font-accent text-13 tracking-5 text-accent uppercase">
                      {experience.categoryLabel}
                    </span>
                    <Heading level={4} color="brand" uppercase={false} className="capitalize">
                      {experience.title}
                    </Heading>
                    <Prose color="ink-light">{experience.description}</Prose>
                  </Stack>
                  <Button as="a" href="#" variant="link" color="brand" className="text-13">
                    Discover
                  </Button>
                </Stack>
              </article>
            ))}
          </div>

          <div className="mt-60 flex justify-center">
            <Button as="a" href="#" variant="glass" color="brand">
              Load More
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
