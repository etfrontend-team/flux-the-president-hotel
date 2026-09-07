'use client'

import Image from 'next/image'
import React, { useMemo, useState } from 'react'

import { Button, Container, Lightbox } from '@/components/ui'
import { cn } from '@/lib/utils'

/** Filter labels, in Figma's order (node 1:12158). `All` is the resting state. */
const CATEGORIES = ['All', 'Stay', 'Dining', 'Facilities', 'Experiences', 'Views'] as const
type Category = (typeof CATEGORIES)[number]

type GalleryImage = {
  src: string
  alt: string
  width: number
  height: number
  category: Exclude<Category, 'All'>
}

/** Placeholder set — the ten photos placed in the mockup, in its order. A Payload collection
    replaces this once the gallery is CMS-driven; the layout below is count-driven, not hard-coded. */
const IMAGES: GalleryImage[] = [
  {
    src: '/images/gallery-01.jpg',
    alt: 'The President Hotel from the air, with Lion’s Head rising behind it',
    width: 1600,
    height: 1066,
    category: 'Views',
  },
  {
    src: '/images/gallery-02.jpg',
    alt: 'A table laid for lunch on the pool deck, under the palms',
    width: 1066,
    height: 1600,
    category: 'Facilities',
  },
  {
    src: '/images/gallery-03.jpg',
    alt: 'The café counter beneath a fringed parasol',
    width: 1066,
    height: 1600,
    category: 'Dining',
  },
  {
    src: '/images/gallery-04.jpg',
    alt: 'A suite sitting room with framed artwork above the sofa',
    width: 1066,
    height: 1600,
    category: 'Stay',
  },
  {
    src: '/images/gallery-05.jpg',
    alt: 'A place setting of stoneware and linen on a wooden table',
    width: 1066,
    height: 1600,
    category: 'Dining',
  },
  {
    src: '/images/gallery-06.jpg',
    alt: 'A suite lounge opening through to the bedroom',
    width: 1066,
    height: 1600,
    category: 'Stay',
  },
  {
    src: '/images/gallery-07.jpg',
    alt: 'Guests with cold drinks and olives beside the pool',
    width: 1066,
    height: 1600,
    category: 'Experiences',
  },
  {
    src: '/images/gallery-08.jpg',
    alt: 'A plated fish dish on a celadon plate, with a glass of white wine',
    width: 1066,
    height: 1600,
    category: 'Dining',
  },
  {
    src: '/images/gallery-09.jpg',
    alt: 'A bowl of roasted vegetables beside a glass of white wine',
    width: 1066,
    height: 1600,
    category: 'Dining',
  },
  {
    src: '/images/gallery-10.jpg',
    alt: 'A guest room bed, with the dressing area and bathroom beyond',
    width: 2000,
    height: 1333,
    category: 'Stay',
  },
]

/** The mockup's mosaic repeats every ten tiles, so that is also the "Load More" page size. */
const PAGE_SIZE = 10

/**
 * Placement for each of the ten slots in the mosaic (Figma nodes 1:12298 – 1:12307). Rows are
 * explicit so a partly-filled block still lands where the design puts it; the two tiles that span
 * two rows take their height from the row pair (`h-full`) rather than an aspect ratio, and every
 * other tile carries the mockup's own ratio so the whole block scales with the container.
 *
 * Below 768px the grid is a single column (no mobile frame yet) — the `767:` variants add the
 * mosaic back from the tablet width up.
 */
const SLOTS = [
  'aspect-405/386 767:aspect-auto 767:col-start-1 767:row-start-1 767:col-span-2 767:row-span-2 767:h-full',
  'aspect-405/386 767:aspect-409/270 767:col-start-3 767:row-start-1',
  'aspect-405/386 767:aspect-409/267 767:col-start-3 767:row-start-2',
  'aspect-405/386 767:col-start-1 767:row-start-3',
  'aspect-405/386 767:aspect-398/386 767:col-start-2 767:row-start-3',
  'aspect-405/386 767:aspect-409/386 767:col-start-3 767:row-start-3',
  'aspect-405/386 767:aspect-405/270 767:col-start-1 767:row-start-4',
  'aspect-405/386 767:aspect-405/270 767:col-start-1 767:row-start-5',
  'aspect-405/386 767:aspect-auto 767:col-start-2 767:row-start-4 767:col-span-2 767:row-span-2 767:h-full',
  'aspect-405/386 767:aspect-1244/553 767:col-start-1 767:row-start-6 767:col-span-3',
]

/** Widths a tile can occupy at the 1240px content width, for the responsive image hint. */
const TILE_SIZES = '(max-width: 767px) 100vw, (max-width: 1440px) 33vw, 824px'

/**
 * The gallery mosaic (Figma node 1:12133): category filters, the ten-tile mosaic, and Load More.
 * Clicking a tile opens the shared Lightbox at that image. Client component — filtering, paging
 * and the viewer are all interactive.
 */
export function GalleryGrid() {
  const [category, setCategory] = useState<Category>('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(
    () => (category === 'All' ? IMAGES : IMAGES.filter((image) => image.category === category)),
    [category],
  )

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visible.length < filtered.length

  function selectCategory(next: Category) {
    setCategory(next)
    setVisibleCount(PAGE_SIZE)
  }

  /** Whole blocks of ten get the mosaic; a trailing part-block falls back to even thirds, so the
      mosaic is never left with holes where its spanning tiles should be. */
  const blocks: GalleryImage[][] = []
  for (let index = 0; index < visible.length; index += PAGE_SIZE) {
    blocks.push(visible.slice(index, index + PAGE_SIZE))
  }

  return (
    <section className="pt-100 pb-160 max-992:pt-60 max-992:pb-100">
      <Container variant="lg">
        <div
          role="tablist"
          aria-label="Filter the gallery"
          className="flex gap-25 max-767:-mr-24 max-767:overflow-x-auto"
        >
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={item === category}
              onClick={() => selectCategory(item)}
              className={cn(
                'shrink-0 cursor-pointer border-b pb-10 font-body text-14 tracking-5 text-brand uppercase transition-colors duration-300',
                item === category ? 'border-brand-muted/80' : 'border-transparent',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <Lightbox images={visible} className="mt-70 flex flex-col gap-15 max-992:mt-40">
          {(open) =>
            blocks.map((block, blockIndex) => (
              <div
                key={blockIndex}
                className="grid grid-cols-1 gap-15 767:grid-cols-3"
              >
                {block.map((image, index) => {
                  const flatIndex = blockIndex * PAGE_SIZE + index
                  return (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => open(flatIndex)}
                      aria-label={`View image: ${image.alt}`}
                      className={cn(
                        'group relative cursor-pointer overflow-hidden rounded-card',
                        block.length === PAGE_SIZE ? SLOTS[index] : 'aspect-405/386',
                      )}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={TILE_SIZES}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </button>
                  )
                })}
              </div>
            ))
          }
        </Lightbox>

        {hasMore && (
          <div className="mt-60 flex justify-center">
            <Button variant="glass" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
              Load More
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}
