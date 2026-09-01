'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { Container } from '@/components/ui'

type GalleryImage = {
  src: string
  alt: string
}

const IMAGES: GalleryImage[] = [
  { src: '/images/lifestyle-gallery-high-tea.webp', alt: 'A high-tea plate of sandwiches served on the lawn' },
  { src: '/images/lifestyle-gallery-poolside-dog.webp', alt: 'A dog relaxing on a striped lounger beside the pool' },
  { src: '/images/lifestyle-gallery-living-room.webp', alt: 'A dog bed in a sunlit hotel living room' },
  { src: '/images/lifestyle-gallery-high-tea.webp', alt: 'A high-tea plate of sandwiches served on the lawn' },
  { src: '/images/lifestyle-gallery-poolside-dog.webp', alt: 'A dog relaxing on a striped lounger beside the pool' },
]

export function LifestyleGallery() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center', dragFree: true }, [
    AutoScroll({ speed: 0.6, stopOnInteraction: false }),
  ])

  return (
    <section className="py-60 max-992:pt-0 max-992:pb-100">
      <Container>
        <div ref={emblaRef} className="cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="flex gap-15">
            {IMAGES.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="relative max-992:h-349 h-450 flex-[0_0_765px] shrink-0 overflow-hidden rounded-card max-992:flex-[0_0_70.735%]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 993px) 61vw, 71vw"
                  className="pointer-events-none object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
