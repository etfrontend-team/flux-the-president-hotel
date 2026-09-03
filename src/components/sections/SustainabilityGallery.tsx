import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type GalleryImage = {
  src: string
  alt: string
  imageObjectPosition?: string
  hideOnMobile?: boolean
}

const IMAGES: GalleryImage[] = [
  {
    src: '/images/sustainability-gallery-solar.webp',
    alt: 'Rooftop solar panels on the hotel building',
    hideOnMobile: true,
  },
  {
    src: '/images/sustainability-gallery-penguin.webp',
    alt: 'An African penguin standing on the beach at Boulders, with more penguins in the background',
    imageObjectPosition: '50% 10%',
  },
  {
    src: '/images/sustainability-gallery-glass.webp',
    alt: 'A colourful glass-bead curtain feature in the hotel lounge',
    hideOnMobile: true,
  },
]

export function SustainabilityGallery() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <Stack gap={70} tabletGap={70} mobileGap={50} className="1024:pl-38 1024:pr-59 px-11">
          <FadeIn>
            <Stack align="start" gap={30} tabletGap={30} mobileGap={30}>
              <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">Sustainability</span>
              <Stack gap={35} tabletGap={35} mobileGap={35}>
                <Heading level={3} className="text-wrap leading-23!">
                  Green Key certified. SANCCOB partner.
                </Heading>
                <Prose color="ink-light" className="max-w-705">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. We hold a Green Key certification and partner with SANCCOB, the African penguin conservation charity.
                </Prose>
              </Stack>
              <Button as="a" href="/sustainability" variant="glass" color="brand">
                Our sustainability story
              </Button>
            </Stack>
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-3 gap-15 max-992:grid-cols-1">
              {IMAGES.map((image) => (
                <div
                  key={image.src}
                  className={cn(
                    'relative aspect-399/323 w-full overflow-hidden rounded-card',
                    image.hideOnMobile && 'max-992:hidden',
                    !image.hideOnMobile && 'max-992:aspect-389/323',
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 993px) 33vw, 100vw"
                    style={image.imageObjectPosition ? { objectPosition: image.imageObjectPosition } : undefined}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </Stack>
      </Container>
    </section>
  )
}
