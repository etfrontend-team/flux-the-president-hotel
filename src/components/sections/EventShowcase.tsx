import Image from 'next/image'
import Link from 'next/link'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type EventCard = {
  heading: string
  description: string
  image: string
  alt: string
  href: string
  imageObjectPosition?: string
}

const EVENT_CARDS: EventCard[] = [
  {
    heading: 'Weddings',
    description: 'An intimate celebration above the sea. The President accommodates receptions for 20 to 120 guests.',
    image: '/images/event-showcase-weddings.webp',
    alt: 'A glass of white wine being poured on a sunlit terrace',
    href: '#',
  },
  {
    heading: 'Conferences',
    description: 'Full-day and half-day conference packages with AV, catering, and accommodation options.',
    image: '/images/event-showcase-conferences.webp',
    alt: 'A conference room set with rows of chairs facing a screen',
    href: '#',
  },
  {
    heading: 'Celebrations',
    description: 'Birthdays, anniversaries, milestones. We curate the setting — you create the memory.',
    image: '/images/event-showcase-celebrations.webp',
    alt: 'Two glasses of red and white wine being toasted together',
    href: '#',
    imageObjectPosition: '50% 68%',
  },
  {
    heading: 'Kids Parties',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    image: '/images/event-showcase-kids-parties.webp',
    alt: 'Children playing on an inflatable pool float',
    href: '#',
    imageObjectPosition: '50% 100%',
  },
]

export function EventShowcase() {
  return (
    <section className="general-padding bg-paper-alt/40">
      <Container variant="lg">
        <div className="1024:px-41 px-11">
          <Stack align="start" gap={35} tabletGap={35} mobileGap={35}>
            <FadeIn>
              <Stack gap={30} tabletGap={30} mobileGap={30}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">EVENTS</span>
                <Stack gap={25} tabletGap={25} mobileGap={25}>
                  <Heading level={3} className="text-wrap">
                    Every occasion, made exceptional.
                  </Heading>
                  <Prose color="ink-light" className="max-w-650">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. From intimate wedding receptions to
                    corporate conferences with Atlantic views — our events team brings each brief to life with
                    meticulous care.
                  </Prose>
                </Stack>
              </Stack>
            </FadeIn>
            <FadeIn>
              <Stack align="center" direction="row" gap={25} tabletGap={25} mobileGap={25} className="max-410:flex-col">
                <Button as="a" href="#" variant="glass" color="brand">
                  View Brochure
                </Button>
                <Button as="a" href="#" variant="link" color="muted">
                  View Factsheet
                </Button>
              </Stack>
            </FadeIn>
          </Stack>

          <div className="mt-46 flex gap-x-20 overflow-x-auto snap-x snap-mandatory 992:mt-70 992:grid 992:grid-cols-2 992:gap-x-30 992:gap-y-80 992:overflow-visible max-992:-mx-25 max-992:px-25 max-992:pb-10">
            {EVENT_CARDS.map((card) => (
              <FadeIn key={card.heading} className="shrink-0 snap-center max-992:w-[83%] 992:contents">
                <article className="group flex h-full flex-col gap-35">
                  <Link
                    href={card.href}
                    className="relative block max-992:aspect-321/300 aspect-604/350 overflow-hidden rounded-card"
                  >
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 993px) 50vw, 83vw"
                      style={card.imageObjectPosition ? { objectPosition: card.imageObjectPosition } : undefined}
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  </Link>

                  <Stack gap={30} tabletGap={30} mobileGap={30}>
                    <Stack gap={20} tabletGap={20} mobileGap={20}>
                      <Heading level={4} uppercase={false} className="capitalize">
                        {card.heading}
                      </Heading>
                      <Prose color="ink-light">{card.description}</Prose>
                    </Stack>
                    <Button as="a" href={card.href} variant="link" color="brand" className="text-13">
                      View
                    </Button>
                  </Stack>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
