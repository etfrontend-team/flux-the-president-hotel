'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Animal = {
  name: string
  description: string
  image: string
  alt: string
  imagePosition?: string
  gradientOverlay?: boolean
}

const ANIMALS: Animal[] = [
  {
    name: 'Pamela',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/images/wildlife-showcase-pamela.webp',
    alt: 'An African penguin standing on the sand at Boulders Beach',
    gradientOverlay: true,
  },
  {
    name: 'Sylvester',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/images/wildlife-showcase-sylvester.webp',
    alt: 'An African penguin in profile against the ocean',
    imagePosition: '90% 50%',
    gradientOverlay: true,
  },
  {
    name: 'Rocky',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/images/wildlife-showcase-rocky.webp',
    alt: 'A rockhopper penguin with distinctive yellow head feathers',
    gradientOverlay: true,
  },
]

export function WildlifeShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' }, [Autoplay({ delay: 4500 })])
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
    <section className="general-padding">
      <Container variant="lg">
        <div className="px-11 1024:px-38">
          <Stack align="center" gap={35} tabletGap={35} mobileGap={35} className="mx-auto max-992:mb-50 mb-70 max-w-864 text-center">
            <FadeIn>
              <Heading level={3}>Our Penguins</Heading>
            </FadeIn>
            <FadeIn>
              <Prose color="ink-light" className="mx-auto max-w-656">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. From intimate wedding receptions to corporate
                conferences with Atlantic views — our events team brings each brief to life with meticulous care.
              </Prose>
            </FadeIn>
          </Stack>

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-20 992:grid 992:grid-cols-3 992:gap-x-40">
              {ANIMALS.map((animal, index) => {
                const isLastSlide = index === ANIMALS.length - 1

                return (
                  <FadeIn key={animal.name} className="min-w-0 flex-[0_0_100%]">
                    <div className="relative aspect-388/500 overflow-hidden rounded-card shadow-image">
                      <Image
                        src={animal.image}
                        alt={animal.alt}
                        fill
                        sizes="(min-width: 993px) 33vw, 100vw"
                        style={animal.imagePosition ? { objectPosition: animal.imagePosition } : undefined}
                        className="object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0">
                        <div className="pointer-events-none absolute inset-0">
                        {[
                          { blur: 5, mask: 'linear-gradient(to top, black 0%, black 25%, transparent 90%)' },
                          { blur: 0.5, mask: 'linear-gradient(to top, black 0%, black 20%, transparent 100%)' },
                        ].map(({ blur, mask }) => (
                          <div
                            key={blur}
                            className="absolute inset-0"
                            style={{
                              backdropFilter: `blur(${blur}px)`,
                              WebkitBackdropFilter: `blur(${blur}px)`,
                              maskImage: mask,
                              WebkitMaskImage: mask,
                            }}
                          />
                        ))}
                        <div
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-0',
                            animal.gradientOverlay ? 'bg-linear-to-b from-transparent to-black/25' : 'bg-black/0',
                          )}
                        />
                      </div>
                        <Stack align="start" gap={20} tabletGap={15} mobileGap={15} className="max-992:pl-25 max-992:pr-116 px-30 pt-52 max-992:py-35 pb-40 text-paper relative">
                          <Heading level={4} color="white" uppercase={false} className="capitalize">
                            {animal.name}
                          </Heading>
                          <Prose color="white" className="text-14 leading-copy! max-w-330">
                            {animal.description}
                          </Prose>
                        </Stack>
                      </div>

                      <button
                        type="button"
                        onClick={() => (isLastSlide ? emblaApi?.scrollTo(0) : emblaApi?.scrollNext())}
                        aria-label={isLastSlide ? 'Go to first penguin' : 'Next penguin'}
                        className="group/navbtn absolute right-30 bottom-35 z-10 flex size-34 cursor-pointer items-center justify-center rounded-full bg-paper/80 992:hidden"
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
                  </FadeIn>
                )
              })}
            </div>
          </div>

          <Stack direction="row" align="center" justify="center" gap={15} tabletGap={15} mobileGap={15} className="mt-25 992:hidden">
            {ANIMALS.map((animal, index) => (
              <button
                key={animal.name}
                type="button"
                aria-label={`Go to ${animal.name}`}
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
