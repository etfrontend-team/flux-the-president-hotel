import Image from 'next/image'

import { Button, Container, Heading, Prose } from '@/components/ui'
import { isVideoSrc } from '@/lib/utils'

/**
 * Figma's own fill for this frame (node 1:2495) has no exportable image src
 * either (same situation as AtlanticMeetsCity) — this points at a still
 * capture of that frame as a placeholder. Point this at a video file if one
 * exists later; `isVideoSrc` below picks it up automatically.
 */
const media = '/images/PRESIDENTHOTEL-PICNIC-20260513-TOMPARKINSON-27.mp4'

/** Homepage section. Per Figma (node 1:2495). */
export function BookYourStay() {
  return (
    <section className='max-992:mt-15 mt-25'>
      <Container variant="sm">
        <div className="relative max-992:aspect-410/526 992:aspect-1390/626 overflow-hidden rounded-card after:content-[''] after:inset-0 after:absolute after:bg-black/20">
          {isVideoSrc(media) ? (
            <video
              src={media}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={media}
              alt="A couple relaxing on the beach beside a picnic spread"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 z-1 flex flex-col items-center justify-center px-36 text-center">
            <Heading level={2} color="paper" className='mb-20'>
              Book Your Stay
            </Heading>
            <Prose color="paper" className="max-w-483 text-paper/80 mb-40">
              Direct bookings receive our best available rate, complimentary early check-in on request, and no
              booking fees.
            </Prose>
            <Button as="a" href="#" variant="outlined" color="paper">
              Book Now
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
