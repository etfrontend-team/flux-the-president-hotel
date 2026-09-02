import Image from 'next/image'
import Link from 'next/link'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

/** Per Figma (node 343:1489): the next upcoming event, highlighted above the general grid. */
export function FeaturedEvent() {
  return (
    <>
      <section className="general-padding">
        <Container variant="lg">
          <div className="flex max-1199:justify-between gap-x-40 1199:gap-x-100 max-992:flex-col max-992:gap-y-50 1024:px-38 px-11">
            <FadeIn>
              <Link
                href="#"
                className="relative block aspect-square w-494 max-992:w-full overflow-hidden rounded-card"
              >
                <Image
                  src="/images/featured-event-jazz.webp"
                  alt="A saxophonist playing beside a guitarist on a city street at night"
                  fill
                  sizes="(min-width: 993px) 494px, 100vw"
                  className="object-cover"
                />
                <div className="absolute left-0 top-40 flex size-80 flex-col items-center justify-center rounded-tr-5 rounded-br-5 bg-paper-alt/80 backdrop-blur-xs px-24 py-14">
                  <span className="font-body text-13 tracking-5 text-accent uppercase">MON</span>
                  <span className="font-body text-21 tracking-5 text-accent uppercase">26</span>
                  <span className="font-body text-13 tracking-5 text-accent uppercase">May</span>
                </div>
              </Link>
            </FadeIn>

            <Stack align="start" justify="center" gap={30} tabletGap={30} mobileGap={30} className="1199:max-w-582">
              <FadeIn>
                <Stack gap={20} tabletGap={20} mobileGap={20}>
                  <span className="font-body text-14 leading-12 tracking-10 text-brand-muted uppercase">
                    Next Thursday · 18:00
                  </span>
                  <Heading level={4} uppercase={false} className="capitalize">
                    Jazz on The Deck
                  </Heading>
                  <Prose color="ink-light">
                    Live acoustic set with Atlantic views. Free for hotel guests. External tickets from R80.
                  </Prose>
                </Stack>
              </FadeIn>
              <FadeIn>
                <Stack direction="wrap" align="center" gap={30} tabletGap={30} mobileGap={15} className="max-425:flex-col max-425:items-start">
                  <Button as="a" href="#" variant="glass" color="brand">
                    Reserve a spot
                  </Button>
                  <span className="font-body text-14 leading-12 tracking-5 font-light text-brand uppercase">
                    Free for in-house guests
                  </span>
                </Stack>
              </FadeIn>
            </Stack>
          </div>
        </Container>
      </section>
      <div className="mx-26 border-t border-brand-muted/30" />
    </>
  )
}
