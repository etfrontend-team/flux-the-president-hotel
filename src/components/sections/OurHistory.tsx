'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { ChevronRightIcon } from '@/components/icons'
import { Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Era = {
  year: string
  description: string
  image?: string
  alt?: string
  imageObjectPosition?: string
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

/** Per Figma (node 363:1499 desktop, 363:1501 mobile): only 1766 has real copy/photo so far — the rest are still placeholders in the design itself. */
const TIMELINE: Era[] = [
  {
    year: '1766',
    description: 'The first substantial building here was the Society House, built in 1766, where the President Hotel now stands.',
    image: '/images/history-1766.webp',
    alt: 'Archival black-and-white photo of the Society House, a double-storey colonial building beneath a mountain',
    imageObjectPosition: '16% 50%',
  },
  { year: '1808', description: LOREM },
  { year: '1810', description: LOREM },
  { year: '1817', description: LOREM },
  { year: '1818', description: LOREM },
  { year: '1850', description: LOREM },
  { year: '1880', description: LOREM },
  { year: '1887', description: LOREM },
  { year: '1967', description: LOREM },
  { year: '1998', description: LOREM },
]

/**
 * Per Figma annotation: navigate via the prev/next arrows, by clicking an
 * image, or by clicking a year in the bottom row — each just scrolls the
 * same Embla carousel to that slide (2 slides visible per view, so the
 * "current + next" pair reads the same as the design).
 */
export function OurHistory() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
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
    <section className="general-padding overflow-hidden bg-paper-alt/40">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <div className="mb-80 flex items-center max-992:mb-50">
            <FadeIn className="shrink-0">
              <Heading level={3} className="text-wrap">
                Our History
              </Heading>
            </FadeIn>
            <div aria-hidden="true" className="flex-1" />
            <FadeIn>
              <Stack direction="row" align="center" gap={20} tabletGap={20} mobileGap={20}>
                <Stack direction="row" align="center" gap={10} tabletGap={10} mobileGap={10} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    aria-label="Previous era"
                    className="flex size-34 cursor-pointer items-center justify-center"
                  >
                    <ChevronRightIcon className="h-12 w-7 rotate-180 text-brand" />
                  </button>
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    aria-label="Next era"
                    className="flex size-34 cursor-pointer items-center justify-center"
                  >
                    <ChevronRightIcon className="h-12 w-7 text-brand" />
                  </button>
                </Stack>
              </Stack>
            </FadeIn>
          </div>
        </div>
      </Container>
      <div className="mb-80 flex items-center gap-60 1199:gap-139 max-992:mb-50 max-992:block 1024:pl-98 pl-26">
        <FadeIn className="max-992:hidden w-372 shrink-0">
          <Stack gap={15} tabletGap={15} mobileGap={15}>
            <span className="font-display text-35 leading-tight tracking-10 text-[#d1dcd2] uppercase">
              {TIMELINE[selectedIndex].year}
            </span>
            <Prose color="ink-light">{TIMELINE[selectedIndex].description}</Prose>
          </Stack>
        </FadeIn>

        <div ref={emblaRef} className="embla__viewport min-w-0 flex-1 overflow-hidden">
          <div className="embla__container flex -ml-20 992:-ml-30">
            {TIMELINE.map((era, index) => (
              <FadeIn key={era.year} className="embla__slide pl-20 992:pl-30 min-w-0 shrink-0 flex-[0_0_calc((100%--57%)/2)] 1024:w-521 1024:flex-none">
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to ${era.year}`}
                  className="flex w-full cursor-pointer flex-col items-start gap-35 text-left"
                >
                  <div className="relative aspect-491/397 w-full overflow-hidden rounded-card max-992:aspect-320/260">
                    <Image
                      src={era.image ?? '/images/placeholder.webp'}
                      alt={era.image ? (era.alt ?? era.year) : `Photo coming soon for ${era.year}`}
                      fill
                      sizes="(min-width: 993px) 394px, 45vw"
                      style={era.imageObjectPosition ? { objectPosition: era.imageObjectPosition } : undefined}
                      className="object-cover"
                    />
                  </div>
                  {/* Mobile-only per-image caption — desktop shows the shared panel on the left instead. */}
                  <Stack gap={15} tabletGap={15} mobileGap={15} className="992:hidden">
                    <span className="font-display text-30 leading-tight tracking-10 text-[#d1dcd2] uppercase">
                      {era.year}
                    </span>
                    <Prose color="ink-light">{era.description}</Prose>
                  </Stack>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <FadeIn className='1024:px-60 px-26 max-992:hidden'>
        <div className="border-b border-brand-muted/30 pb-30">
          <Stack direction="row" gap={40} tabletGap={40} mobileGap={40} className="w-max min-w-full justify-around">
            {TIMELINE.map((era, index) => (
              <button
                key={era.year}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to ${era.year}`}
                className={cn(
                  'shrink-0 cursor-pointer whitespace-nowrap font-display text-18 tracking-5 capitalize transition-opacity duration-300',
                  index === selectedIndex ? 'text-brand opacity-100' : 'text-brand opacity-40',
                )}
              >
                {era.year}
              </button>
            ))}
          </Stack>
        </div>
      </FadeIn>
    </section>
  )
}
