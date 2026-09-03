import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Container, Heading, Prose, Stack } from '@/components/ui'

type Value = {
  heading: string
  description: string
  image: string
  alt: string
  imageObjectPosition?: string
  overlayOpacity?: number
  extraBlur?: boolean
}

const VALUES: Value[] = [
  {
    heading: 'Independent hospitality',
    description: 'We are not a chain. Every decision is made here, for our guests.',
    image: '/images/brand-values-hospitality.webp',
    alt: 'A warm, wood-panelled hotel bedroom with a made-up bed and en-suite bathroom beyond',
    imageObjectPosition: '50% 100%',
  },
  {
    heading: 'Community',
    description: 'Sea Point is our home. We support local suppliers, local causes, and local people.',
    image: '/images/brand-values-community.webp',
    alt: 'Three smiling hotel bar staff posing in front of the bar shelves',
    imageObjectPosition: '91% 71%',
    overlayOpacity: 0.55,
  },
  {
    heading: 'Sustainability',
    description: 'Green Key certified since 2019. Our kitchen, building, and team operate with the environment in mind.',
    image: '/images/brand-values-sustainability.webp',
    alt: 'A potted trailing houseplant seen from above on a marble surface',
    imageObjectPosition: '50% 53%',
    extraBlur: true,
  },
  {
    heading: 'Craft',
    description: 'From the kitchen to the concierge — we care about the detail.',
    image: '/images/brand-values-craft.webp',
    alt: "A chef's floured hands shaping a round of dough in the kitchen",
    imageObjectPosition: '50% 60%',
    extraBlur: true,
  },
]

/**
 * Per Figma (node 370:1502 desktop, 370:1503 mobile): the "What we stand for"
 * intro sticks in place (992:sticky) beside the stacked value cards as the
 * page scrolls past them. Desktop overlays each card's caption on the image
 * itself (gradient + extra blur for the lighter photos); mobile shows the
 * caption below the image instead, with no overlay.
 */
export function BrandValues() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="flex items-start gap-60 1199:gap-100 max-992:flex-col max-992:gap-50 1024:px-38 px-11">
          {/* Sticky positioning lives on a plain wrapper, not the FadeIn's own element — Motion's whileInView leaves an inline `transform` even at rest, which breaks `position: sticky` on the element it's set on. */}
          <div className="max-992:w-full 992:sticky 992:top-138 992:max-w-460 992:shrink-0">
            <FadeIn>
              <Stack gap={35} tabletGap={35} mobileGap={35}>
                <Heading level={3} className="text-wrap leading-23!">
                  What we stand for
                </Heading>
                <Prose color="ink-light" className="max-w-502">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </Prose>
              </Stack>
            </FadeIn>
          </div>

          <Stack gap={15} tabletGap={15} mobileGap={50} className="min-w-0 max-992:w-full 992:max-w-615 992:flex-1">
            {VALUES.map((value) => (
              <FadeIn key={value.heading}>
                <Stack gap={34} tabletGap={34} mobileGap={34}>
                  <div className="relative aspect-615/392 w-full overflow-hidden rounded-card max-992:aspect-387/247">
                    <Image
                      src={value.image}
                      alt={value.alt}
                      fill
                      sizes="(min-width: 993px) 615px, 100vw"
                      style={value.imageObjectPosition ? { objectPosition: value.imageObjectPosition } : undefined}
                      className="object-cover"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 max-992:hidden"
                      style={{
                        background: `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,${value.overlayOpacity ?? 0.4}) 100%)`,
                      }}
                    />

                    {value.extraBlur && (
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] overflow-hidden rounded-b-card max-992:hidden">
                        {[
                          { blur: 2, mask: 'linear-gradient(to top, black 0%, black 20%, transparent 90%)' },
                          { blur: 0.5, mask: 'linear-gradient(to top, black 0%, black 10%, transparent 100%)' },
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
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_100%)]" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 max-992:hidden">
                      <Stack align="start" gap={20} tabletGap={20} mobileGap={20} className="w-full px-40 py-40">
                        <Heading level={4} color="white" uppercase={false} className="capitalize leading-16">
                          {value.heading}
                        </Heading>
                        <Prose color="white" className="max-w-368 text-14 leading-copy">
                          {value.description}
                        </Prose>
                      </Stack>
                    </div>
                  </div>

                  <Stack gap={20} tabletGap={20} mobileGap={20} className="992:hidden">
                    <Heading level={4} uppercase={false} className="capitalize">
                      {value.heading}
                    </Heading>
                    <Prose color="ink-light">{value.description}</Prose>
                  </Stack>
                </Stack>
              </FadeIn>
            ))}
          </Stack>
        </div>
      </Container>
    </section>
  )
}
