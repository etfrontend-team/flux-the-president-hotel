import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

/** Per Figma (node 251:1481): intro copy beside a full-bleed image. */
export function SplitContent({ imagePosition = 'right' }: { imagePosition?: 'left' | 'right' }) {
  const isImageOnRight = imagePosition === 'right'

  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="grid grid-cols-2 gap-x-60 max-992:grid-cols-1 max-992:gap-y-50 1024:px-38 px-11">
          <Stack
            align="start"
            justify="center"
            gap={35}
            tabletGap={35}
            mobileGap={35}
            className={isImageOnRight ? 'order-1 max-992:order-none' : 'order-2 max-992:order-none'}
          >
            <FadeIn>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                <Heading level={3} className="max-w-517 text-wrap">
                  Pup High Tea &amp; Dining
                </Heading>
                <Prose color="ink-light" className="max-w-471">
                  Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite
                  perfect nostrud nisi intricate Content.
                </Prose>
              </Stack>
            </FadeIn>
            <FadeIn>
              <Button as="a" href="#" variant="glass" color="brand">
                View pup menu
              </Button>
            </FadeIn>
          </Stack>

          <FadeIn>
            <div
              className={
                isImageOnRight
                  ? 'order-2 max-992:order-none relative aspect-607/550 overflow-hidden rounded-card max-992:aspect-388/326'
                  : 'order-1 max-992:order-none relative aspect-607/550 overflow-hidden rounded-card max-992:aspect-388/326'
              }
            >
              <Image
                src="/images/split-content-pup-dining.webp"
                alt="A dog sniffing a plate of high-tea sandwiches set on the lawn"
                fill
                sizes="(min-width: 993px) 607px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
