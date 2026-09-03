import Image from 'next/image'
import { Stack } from '@/components/ui'

type MarqueeSlide = { src: string | null; video?: string | null; alt: string }

const photos: MarqueeSlide[] = [
  { src: '/images/marquee-8.webp', video: null, alt: 'A guest reading poolside with a drink' },
  { src: null, video: '/images/pres-hero-video.mp4', alt: 'Palm-lined sea view at golden hour' },
  { src: '/images/marquee-2.webp', video: null, alt: 'A guest standing on the rocks at sunset' },
  { src: '/images/marquee-3.webp', video: null, alt: 'The dining terrace at The President Hotel' },
  { src: '/images/marquee-4.webp', video: null, alt: "The hotel's palm-fringed exterior" },
  { src: '/images/marquee-5.webp', video: null, alt: 'Poolside loungers beneath the palms' },
  { src: '/images/marquee-6.webp', video: null, alt: 'Aerial view of the hotel beneath Lion’s Head' },
  { src: '/images/marquee-7.webp', video: null, alt: 'A dog relaxing poolside' },
  { src: '/images/marquee-8.webp', video: null, alt: 'A guest reading poolside with a drink' },
  { src: '/images/marquee-1.webp', video: null, alt: 'Palm-lined sea view at golden hour' },
]

export function PhotoMarquee() {
  return (
    <div className="overflow-hidden bg-accent/10 max-992:pb-40 max-992:pt-14 pt-30 pb-60">
      <Stack direction="row" align="center" gap={40} tabletGap={40} mobileGap={20} className="marquee-track w-max">
        {[...photos, ...photos].map((photo, index) => (
          <div
            key={index}
            aria-hidden={index >= photos.length}
            className="relative h-94 w-131 shrink-0 overflow-hidden rounded-5 bg-placeholder 992:h-117 992:w-164"
          >
            {photo.video ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={photo.src || undefined}
                className="absolute inset-0 size-full object-cover"
                src={photo.video}
              />
            ) : (
              photo.src && (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 992px) 164px, 132px"
                  className="object-cover"
                />
              )
            )}
          </div>
        ))}
      </Stack>
    </div>
  )
}
