'use client'

import Image from 'next/image'

import { Container, Lightbox } from '@/components/ui'

import { BookingBar } from './BookingBar'

type GalleryImage = {
  src: string
  alt: string
  width: number
  height: number
}

const IMAGES: GalleryImage[] = [
  {
    src: '/images/stayhero-bedroom.webp',
    alt: 'A sea-view bedroom with a round table, sofa and a wave photograph above the headboard',
    width: 1800,
    height: 1200,
  },
  {
    src: '/images/stayhero-mirror.webp',
    alt: 'A dressing desk with a mirror and lamp',
    width: 900,
    height: 1200,
  },
  {
    src: '/images/stayhero-kitchen.webp',
    alt: 'An in-room kitchenette with a marble splashback and wine fridge',
    width: 900,
    height: 1200,
  },
  {
    src: '/images/stayhero-lounge.webp',
    alt: 'A lounge chair and coffee table beside a balcony with city views',
    width: 900,
    height: 1200,
  },
]

export function StayHero() {
  return (
    <section data-hero data-hero-theme="light" className="pt-214 992:pb-29 992:pt-219 flex min-h-screen flex-col justify-center">
      <Container>
        <Lightbox images={IMAGES}>
          {(open) => (
            <>
              <div className="hidden items-start gap-14 992:grid 992:grid-cols-[940fr_436fr]">
                <button
                  type="button"
                  onClick={() => open(0)}
                  aria-label={`View image: ${IMAGES[0].alt}`}
                  className="relative aspect-940/574 cursor-pointer overflow-hidden rounded-card"
                >
                  <Image src={IMAGES[0].src} alt={IMAGES[0].alt} fill sizes="65vw" className="object-cover" />
                </button>

                <div className="flex flex-col gap-15">
                  <button
                    type="button"
                    onClick={() => open(1)}
                    aria-label={`View image: ${IMAGES[1].alt}`}
                    className="relative aspect-436/353 cursor-pointer overflow-hidden rounded-card"
                  >
                    <Image src={IMAGES[1].src} alt={IMAGES[1].alt} fill sizes="30vw" className="object-cover" />
                  </button>
                  <div className="flex gap-15">
                    <button
                      type="button"
                      onClick={() => open(2)}
                      aria-label={`View image: ${IMAGES[2].alt}`}
                      className="relative aspect-210/206 flex-1 cursor-pointer overflow-hidden rounded-card"
                    >
                      <Image src={IMAGES[2].src} alt={IMAGES[2].alt} fill sizes="15vw" className="object-cover" />
                    </button>
                    <button
                      type="button"
                      onClick={() => open(3)}
                      aria-label={`View image: ${IMAGES[3].alt}`}
                      className="relative aspect-211/207 flex-1 cursor-pointer overflow-hidden rounded-card"
                    >
                      <Image
                        src={IMAGES[3].src}
                        alt={IMAGES[3].alt}
                        fill
                        sizes="15vw"
                        style={{ objectPosition: '50% 61%' }}
                        className="object-cover"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-15 992:hidden">
                <button
                  type="button"
                  onClick={() => open(0)}
                  aria-label={`View image: ${IMAGES[0].alt}`}
                  className="relative aspect-410/501 cursor-pointer overflow-hidden rounded-card"
                >
                  <Image src={IMAGES[0].src} alt={IMAGES[0].alt} fill sizes="100vw" className="object-cover" />
                </button>
                <div className="flex gap-15">
                  <button
                    type="button"
                    onClick={() => open(2)}
                    aria-label={`View image: ${IMAGES[2].alt}`}
                    className="relative aspect-195/206 flex-1 cursor-pointer overflow-hidden rounded-card"
                  >
                    <Image src={IMAGES[2].src} alt={IMAGES[2].alt} fill sizes="50vw" className="object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => open(3)}
                    aria-label={`View image: ${IMAGES[3].alt}`}
                    className="relative aspect-195/206 flex-1 cursor-pointer overflow-hidden rounded-card"
                  >
                    <Image
                      src={IMAGES[3].src}
                      alt={IMAGES[3].alt}
                      fill
                      sizes="50vw"
                      style={{ objectPosition: '50% 61%' }}
                      className="object-cover"
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </Lightbox>

        <BookingBar variant="stay" />
      </Container>
    </section>
  )
}
