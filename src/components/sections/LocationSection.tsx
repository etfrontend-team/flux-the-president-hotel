'use client'

import Image from 'next/image'

import { Container, Lightbox } from '@/components/ui'

const MAP_IMAGE = {
  src: '/images/location-map.webp',
  alt: "Illustrated map of Sea Point and Cape Town showing walking distances from The President Hotel to nearby attractions along the promenade",
  width: 2000,
  height: 1361,
}

export function LocationSection() {
  return (
    <section className="general-padding">
      <Container>
        <div className="rounded-card bg-mint/50 p-77 max-992:p-25">
          <Lightbox images={[MAP_IMAGE]}>
            {(open) => (
              <button
                type="button"
                onClick={() => open(0)}
                aria-label="Open map in full screen"
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-card bg-paper pt-170 px-15 pb-15 max-992:pt-40 max-992:px-15 max-992:pb-15"
              >
                <div className="relative aspect-1206/567 w-full overflow-hidden rounded-card">
                  <Image
                    src={MAP_IMAGE.src}
                    alt={MAP_IMAGE.alt}
                    fill
                    sizes="(min-width: 993px) 1208px, 100vw"
                    style={{ objectPosition: '50% 93%' }}
                    className="object-cover transition-transform duration-500 ease-in-out scale-106"
                  />
                </div>
              </button>
            )}
          </Lightbox>
        </div>
      </Container>
    </section>
  )
}
