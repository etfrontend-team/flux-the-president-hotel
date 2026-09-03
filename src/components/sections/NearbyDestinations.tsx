'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Container, Heading, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Destination = {
  title: string
  caption: string
  image: string
  alt: string
  imageObjectPosition?: string
}

const DESTINATIONS: Destination[] = [
  {
    title: 'V&A Waterfront',
    caption: '5 min · Shopping, dining, aquarium',
    image: '/images/nearby-vanda-waterfront.webp',
    alt: 'Boats moored at the V&A Waterfront at dusk, with Table Mountain behind',
  },
  {
    title: 'Camps Bay Beach',
    caption: '8 min · Iconic white sand beach',
    image: '/images/nearby-camps-bay.webp',
    alt: 'Camps Bay beach and suburb beneath the Twelve Apostles mountain range',
    imageObjectPosition: '50% 34%',
  },
  {
    title: 'Table Mountain',
    caption: '15 min · Cable car & hiking access',
    image: '/images/nearby-table-mountain.webp',
    alt: 'Table Mountain at sunset, viewed from a rocky beach',
  },
  {
    title: 'V&A Waterfront',
    caption: '5 min · Shopping, dining, aquarium',
    image: '/images/nearby-vanda-waterfront.webp',
    alt: 'Boats moored at the V&A Waterfront at dusk, with Table Mountain behind',
  },
]

export function NearbyDestinations() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
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
    <section className="general-padding overflow-hidden">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <div className="mb-60 flex max-992:flex-wrap items-end justify-between gap-40 max-992:mb-40 w-full">
            <FadeIn>
              <Stack gap={30} tabletGap={30} mobileGap={30}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                  Your Neighbourhood
                </span>
                <Heading level={3} className="text-wrap leading-23">
                  Sea Point &amp; surrounds
                </Heading>
              </Stack>
            </FadeIn>
            <FadeIn className="max-992:hidden">
              <Stack direction="row" align="center" gap={10} tabletGap={10} mobileGap={10}>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  aria-label="Previous destination"
                  className="flex size-34 cursor-pointer items-center justify-center"
                >
                  <ChevronRightIcon className="h-12 w-7 rotate-180 text-brand" />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  aria-label="Next destination"
                  className="flex size-34 cursor-pointer items-center justify-center"
                >
                  <ChevronRightIcon className="h-12 w-7 text-brand" />
                </button>
              </Stack>
            </FadeIn>
          </div>

          <div ref={emblaRef} className="embla__viewport 992:overflow-hidden">
            <div className="embla__container flex -ml-20 992:-ml-40">
              {DESTINATIONS.map((destination, index) => (
                <div key={`${destination.title}-${index}`} className="embla__slide min-w-0 shrink-0 pl-20 992:pl-40 flex-[0_0_83.335%] 992:flex-[0_0_33.333%]">
                  <article className="flex flex-col gap-35 max-992:gap-25">
                    <div className="relative max-992:aspect-320/315 aspect-388/315 w-full overflow-hidden rounded-card">
                      <Image
                        src={destination.image}
                        alt={destination.alt}
                        fill
                        sizes="(min-width: 993px) 38vw, 83vw"
                        style={
                          destination.imageObjectPosition
                            ? { objectPosition: destination.imageObjectPosition }
                            : undefined
                        }
                        className="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(45,7,0,0.2)_0%,rgba(102,102,102,0)_21%),linear-gradient(to_top,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_27%)]"
                      />
                    </div>
                    <Stack gap={20} tabletGap={20} mobileGap={20}>
                      <Heading level={6} uppercase={false} color="brand" className="capitalize leading-12">
                        {destination.title}
                      </Heading>
                      <p className="font-body font-light text-14 leading-10 tracking-5 text-ink">
                        {destination.caption}
                      </p>
                    </Stack>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile-only dot pager — desktop uses the arrow buttons above instead. */}
          <Stack direction="row" align="center" justify="center" gap={15} tabletGap={15} mobileGap={15} className="mt-30 992:hidden">
            {DESTINATIONS.map((destination, index) => (
              <button
                key={`${destination.title}-${index}`}
                type="button"
                aria-label={`Go to ${destination.title}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'size-6 cursor-pointer rounded-full bg-ink transition-opacity duration-300 ease-out',
                  index === selectedIndex ? 'opacity-80' : 'opacity-40',
                )}
              />
            ))}
          </Stack>
        </div>
      </Container>
    </section>
  )
}
