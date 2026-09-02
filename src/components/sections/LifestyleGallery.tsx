'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { Container } from '@/components/ui'

type GalleryImage = {
  src: string
  alt: string
  /** Per Figma (node 1:15218): a caption is optional — only some images carry one. */
  caption?: string
}

const IMAGES: GalleryImage[] = [
  { src: '/images/lifestyle-gallery-high-tea.webp', alt: 'A high-tea plate of sandwiches served on the lawn' },
  { src: '/images/lifestyle-gallery-poolside-dog.webp', alt: 'A dog relaxing on a striped lounger beside the pool' },
  { src: '/images/lifestyle-gallery-living-room.webp', alt: 'A dog bed in a sunlit hotel living room' },
  { src: '/images/lifestyle-gallery-high-tea.webp', alt: 'A high-tea plate of sandwiches served on the lawn' },
  { src: '/images/lifestyle-gallery-poolside-dog.webp', alt: 'A dog relaxing on a striped lounger beside the pool' },
]

export function LifestyleGallery({ images = IMAGES }: { images?: GalleryImage[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center', dragFree: true }, [
    AutoScroll({ speed: 0.6, stopOnInteraction: false }),
  ])

  return (
    <section className="general-padding">
      <Container className="embla max-992:px-15!">
        <div ref={emblaRef} className="embla__viewport cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="embla__container flex -ml-15">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="embla__slide relative flex-[0_0_765px] shrink-0 pl-15 max-992:flex-[0_0_70.735%]"
              >
                <div className="relative max-992:h-349 h-450 overflow-hidden rounded-card">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 993px) 61vw, 71vw"
                    className="pointer-events-none object-cover"
                  />
                  {image.caption && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-250 max-992:h-194 overflow-hidden rounded-b-card"
                    >
                      {[
                        { blur: 5, mask: 'linear-gradient(to top, black 0%, black 30%, transparent 90%)' },
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
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_100%)]" />
                    </div>
                  )}
                  {image.caption && (
                    <p className="pointer-events-none absolute left-24 bottom-20 font-accent font-medium text-12 leading-copy tracking-5 text-paper uppercase max-992:left-20 max-992:bottom-16">
                      {image.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
