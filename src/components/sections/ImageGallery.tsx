'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { Button, Container, Stack } from '../ui'

type Category = 'stay' | 'dining' | 'facilities' | 'experiences' | 'views'
type Filter = 'all' | Category

type GalleryImage = {
  src: string
  alt: string
  category: Category
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Stay', value: 'stay' },
  { label: 'Dining', value: 'dining' },
  { label: 'Facilities', value: 'facilities' },
  { label: 'Experiences', value: 'experiences' },
  { label: 'Views', value: 'views' },
]

const CATEGORIES: Category[] = ['stay', 'dining', 'facilities', 'experiences', 'views']

// TODO: replace with images coming from a single collection/array (CMS or API).
const PLACEHOLDER_IMAGE = '/images/lifestyle-gallery-poolside-dog.webp'

const images: GalleryImage[] = Array.from({ length: 24 }, (_, i) => ({
  src: PLACEHOLDER_IMAGE,
  alt: `Gallery image ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
}))

const BATCH_SIZE = 10
const CELL_AREAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const

// Position + aspect ratio for each of the 10 slots in one gallery-grid batch (see docs/... for the visual map).
const CELL_CLASSES: Record<(typeof CELL_AREAS)[number], string> = {
  a: 'col-start-1 col-end-5 row-start-1 row-end-3 aspect-[818/552]',
  b: 'col-start-5 col-end-7 row-start-1 row-end-2 aspect-[409/270]',
  c: 'col-start-5 col-end-7 row-start-2 row-end-3 aspect-[409/270]',
  d: 'col-start-1 col-end-3 row-start-3 row-end-4 aspect-[405/386]',
  e: 'col-start-3 col-end-5 row-start-3 row-end-4 aspect-[405/386]',
  f: 'col-start-5 col-end-7 row-start-3 row-end-4 aspect-[405/386]',
  g: 'col-start-1 col-end-3 row-start-4 row-end-5 aspect-[405/270]',
  h: 'col-start-1 col-end-3 row-start-5 row-end-6 aspect-[405/270]',
  i: 'col-start-3 col-end-7 row-start-4 row-end-6 aspect-[824/553]',
  j: 'col-start-1 col-end-7 row-start-6 row-end-7 aspect-[1244/553]',
}

export function ImageGallery() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)

  const filteredImages =
    activeFilter === 'all' ? images : images.filter((img) => img.category === activeFilter)

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter)
    setVisibleCount(BATCH_SIZE)
  }

  const visibleImages = filteredImages.slice(0, visibleCount)
  const hasMore = visibleCount < filteredImages.length
  const groupCount = Math.ceil(visibleImages.length / BATCH_SIZE)

  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="px-11 992:px-38">
          <FadeIn>
            <Stack direction="row" gap={25} tabletGap={25} mobileGap={25} className="mb-60 max-992:hidden">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleFilterChange(filter.value)}
                  className={cn(
                    'relative shrink-0 cursor-pointer border-b border-solid pb-10 font-body text-14 tracking-5 text-brand uppercase backdrop-blur-[1px]',
                    activeFilter === filter.value ? 'border-brand-muted/80' : 'border-transparent',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </Stack>

            {/* Mobile: the tab row collapses into a single dropdown. */}
            <div className="relative mb-40 h-60 w-full rounded-card border border-brand-muted/40 shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] 992:hidden">
              <select
                value={activeFilter}
                onChange={(event) => handleFilterChange(event.target.value as Filter)}
                aria-label="Filter gallery"
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

          <LazyMotion features={domAnimation} strict>
            <div className="flex flex-col gap-15">
              {Array.from({ length: groupCount }, (_, g) => {
                const group = visibleImages.slice(g * BATCH_SIZE, g * BATCH_SIZE + BATCH_SIZE)
                return (
                  <div key={g} className="grid grid-cols-6 gap-15">
                    {group.map((img, i) => (
                      <m.div
                        key={`${activeFilter}-${g * BATCH_SIZE + i}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className={cn('relative overflow-hidden rounded-[5px]', CELL_CLASSES[CELL_AREAS[i]])}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="(min-width: 992px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </m.div>
                    ))}
                  </div>
                )
              })}
            </div>
          </LazyMotion>

          {hasMore && (
            <div className="flex justify-center items-center mt-50 992:mt-60">
              <Button onClick={() => setVisibleCount((v) => v + BATCH_SIZE)}>Load More</Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
