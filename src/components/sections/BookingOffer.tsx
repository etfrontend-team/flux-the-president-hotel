'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type Slide = {
  id: string
  image: string
  alt: string
  imageObjectPosition?: string
}

const SLIDES: Slide[] = [
  {
    id: 'chess-1',
    image: '/images/booking-offer-chess.webp',
    alt: 'A couple playing chess poolside',
  },
  {
    id: 'pool-kids',
    image: '/images/booking-offer-pool-kids.webp',
    alt: 'Two children on a striped pool float in front of the hotel',
    imageObjectPosition: '30% 50%',
  },
  {
    id: 'chess-2',
    image: '/images/booking-offer-chess.webp',
    alt: 'A couple playing chess poolside',
  },
]

export function BookingOffer({
  eyebrow = 'Offers',
  heading = 'Atlantic Cosy Escape',
  description = 'Enjoy crisp ocean air, relaxed seaside surroundings, and a stay designed for comfort. Book an Atlantic Cosy Escape and embrace the warmth of the season. Join us and enjoy up to 25% off.',
  buttonLabel = 'Book this offer',
  buttonHref = '#',
  backgroundImage = '/images/booking-offer-bg.webp',
  mobileBackgroundImage = '/images/booking-offer-bg-mobile.webp',
  backgroundAlt = 'Palm trees framing the ocean at golden hour',
}: {
  eyebrow?: string
  heading?: string
  description?: string
  buttonLabel?: string
  buttonHref?: string
  backgroundImage?: string
  mobileBackgroundImage?: string
  backgroundAlt?: string
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!emblaApi) return

    function onSelect() {
      setCanScrollPrev(emblaApi!.canScrollPrev())
      setCanScrollNext(emblaApi!.canScrollNext())
    }

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  return (
    <section className="general-padding relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          sizes="100vw"
          className="object-cover max-992:hidden"
        />
        <Image
          src={mobileBackgroundImage}
          alt={backgroundAlt}
          fill
          sizes="100vw"
          className="object-cover 992:hidden"
        />
        <div className="absolute inset-0 bg-black/25 max-992:bg-black/35" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_67.5%)] max-992:hidden" />
      </div>

      <Container variant="lg" className='992:pr-0!'>
        <div className="flex items-center justify-between gap-x-60 1199:gap-x-100 max-992:flex-col max-992:items-start max-992:gap-y-50 1024:pl-38 1024:pr-0 px-11">
          <FadeIn className="max-992:w-full">
            <Stack align="start" gap={50} tabletGap={50} mobileGap={50} className="max-992:items-center max-992:text-center">
              <Stack align="start" gap={35} tabletGap={35} mobileGap={35} className="max-992:items-center">
                <Stack align="start" gap={30} tabletGap={30} mobileGap={30} className="max-992:items-center">
                  <span className="font-accent text-16 leading-11 tracking-5 text-white uppercase">{eyebrow}</span>
                  <Heading level={3} color="paper" className="text-white whitespace-nowrap max-992:whitespace-normal max-992:text-wrap">
                    {heading}
                  </Heading>
                </Stack>
                <Prose color="white" className="max-w-505">
                  {description}
                </Prose>
              </Stack>
              <Button as="a" href={buttonHref} variant="glass" color="white">
                {buttonLabel}
              </Button>
            </Stack>
          </FadeIn>

          <FadeIn className="relative max-992:w-full">
            <div ref={emblaRef} className="min-w-0 max-992:w-full 992:w-697 overflow-hidden 992:pr-98">
              <div className="flex gap-x-15 transition-all duration-300 ease-linear">
                {SLIDES.map((slide) => (
                  <div
                    key={slide.id}
                    className="relative aspect-square min-w-0 shrink-0 overflow-hidden rounded-card max-992:flex-[0_0_100%] 992:flex-[0_0_390px]"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      sizes="(min-width: 993px) 390px, 100vw"
                      style={slide.imageObjectPosition ? { objectPosition: slide.imageObjectPosition } : undefined}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Stack direction="row" gap={10} tabletGap={10} mobileGap={10} className="absolute -bottom-64 right-98 max-992:hidden">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label="Previous slide"
                className="group/navbtn relative flex size-34 cursor-pointer items-center justify-center rounded-full bg-paper/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
                />
                <ChevronRightIcon className="relative h-12 w-7 rotate-180 text-brand" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                aria-label="Next slide"
                className="group/navbtn relative flex size-34 cursor-pointer items-center justify-center rounded-full bg-paper/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
                />
                <ChevronRightIcon className="relative h-12 w-7 text-brand" />
              </button>
            </Stack>

            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
              className="group/navbtn absolute left-25 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-paper/80 size-34 max-992:flex disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
              />
              <ChevronRightIcon className="relative h-12 w-7 rotate-180 text-brand" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next slide"
              className="group/navbtn absolute right-25 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-paper/80 size-34 max-992:flex disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
              />
              <ChevronRightIcon className="relative h-12 w-7 text-brand" />
            </button>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
