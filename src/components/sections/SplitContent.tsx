import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

/** Per Figma (node 251:1481, 298:1481): intro copy beside a full-bleed image. */
export function SplitContent({
  imagePosition = 'right',
  eyebrow = 'SUPPORT',
  heading = 'Pup High Tea & Dining',
  description = 'Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content.',
  buttonLabel = 'View pup menu',
  buttonHref = '#',
  image = '/images/split-content-pup-dining.webp',
  alt = 'A dog sniffing a plate of high-tea sandwiches set on the lawn',
  imageObjectPosition,
}: {
  imagePosition?: 'left' | 'right'
  eyebrow?: string
  heading?: string
  description?: string | string[]
  buttonLabel?: string | null
  buttonHref?: string
  image?: string
  alt?: string
  imageObjectPosition?: string
}) {
  const isImageOnRight = imagePosition === 'right'

  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="flex flex-wrap justify-between gap-x-60 1199:gap-x-100 max-992:gap-y-50 1024:px-38 px-11">
          <Stack
            align="start"
            justify="center"
            gap={35}
            tabletGap={35}
            mobileGap={35}
            className={isImageOnRight ? 'order-1 max-992:order-0' : 'order-2 max-992:order-0'}
          >
            <FadeIn>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                  {eyebrow}
                </span>
                <Heading level={3} className="max-w-517 text-wrap">
                  {heading}
                </Heading>
                <Prose color="ink-light" className="max-w-471">
                  {description}
                </Prose>
              </Stack>
            </FadeIn>
            {buttonLabel && (
              <FadeIn>
                <Button as="a" href={buttonHref} variant="glass" color="brand">
                  {buttonLabel}
                </Button>
              </FadeIn>
            )}
          </Stack>

            <div
              className={
                isImageOnRight
                  ? 'order-2 max-992:order-0 relative w-607 max-640:w-388 aspect-607/560 overflow-hidden rounded-card max-992:aspect-388/326'
                  : 'order-1 max-992:order-0 relative w-607 max-640:w-388 aspect-607/560 overflow-hidden rounded-card max-992:aspect-388/326'
              }
              >
              <FadeIn>
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(min-width: 993px) 607px, 100vw"
                  className="object-cover"
                  style={imageObjectPosition ? { objectPosition: imageObjectPosition } : undefined}
                />
              </FadeIn>
            </div>
        </div>
      </Container>
    </section>
  )
}
