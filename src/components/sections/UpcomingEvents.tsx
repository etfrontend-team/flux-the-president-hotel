import Image from 'next/image'
import Link from 'next/link'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type EventItem = {
  date: string
  title: string
  description: string
  price: string
  image: string
  alt: string
  href: string
  imageObjectPosition?: string
  badge: { day: string; date: string; month: string }
}

const EVENTS: EventItem[] = [
  {
    date: 'Sun 10 May · 10:00',
    title: 'Sunday Brunch',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'R295 per person',
    image: '/images/upcoming-events-brunch.webp',
    alt: 'A brunch plate with poached eggs and smoked salmon on a terrace table',
    href: '#',
    badge: { day: 'MON', date: '26', month: 'May' },
  },
  {
    date: 'Sat 6 Jun · 07:30',
    title: 'SANCCOB Penguin Walk',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'R295 per person',
    image: '/images/upcoming-events-penguin-walk.webp',
    alt: 'Two African penguins standing on coastal rocks',
    href: '#',
    imageObjectPosition: '76% 50%',
    badge: { day: 'MON', date: '26', month: 'May' },
  },
  {
    date: 'Sat 13 Jun · 19:00',
    title: 'Mid-Winter Long Table',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis.',
    price: 'Free for hotel guests',
    image: '/images/upcoming-events-long-table.webp',
    alt: 'A long table spread with shared plates viewed from above',
    href: '#',
    badge: { day: 'MON', date: '26', month: 'May' },
  },
]

/** Per Figma (node 339:1486 desktop, 339:1487 mobile): a 3-up grid of upcoming events. */
export function UpcomingEvents() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <div className="mb-70 max-992:mb-50 flex items-end justify-between gap-40 max-992:flex-col max-992:items-start max-992:gap-35">
            <FadeIn>
              <Stack gap={30} tabletGap={30} mobileGap={30}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                  What&apos;s on
                </span>
                <Heading level={3} className="max-w-517 text-wrap">
                  Upcoming at The President
                </Heading>
              </Stack>
            </FadeIn>
            <FadeIn>
              <Button as="a" href="#" variant="glass" color="brand">
                View all
              </Button>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 gap-x-40 gap-y-50 992:grid-cols-3">
            {EVENTS.map((event) => (
              <FadeIn key={event.title}>
                <article className="group flex flex-col gap-35 max-992:gap-40">
                  <Link href={event.href} className="relative aspect-square w-full overflow-hidden rounded-card max-992:aspect-388/338">
                    <Image
                      src={event.image}
                      alt={event.alt}
                      fill
                      sizes="(min-width: 993px) 33vw, 100vw"
                      style={event.imageObjectPosition ? { objectPosition: event.imageObjectPosition } : undefined}
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute left-0 top-40 flex size-80 flex-col items-center justify-center rounded-tr-5 rounded-br-5 bg-paper-alt/80 px-24 py-14 max-992:size-72 max-992:p-10">
                      <span className="font-body text-13 tracking-5 text-accent uppercase max-992:text-12">
                        {event.badge.day}
                      </span>
                      <span className="font-body text-21 tracking-5 text-accent uppercase max-992:text-18">
                        {event.badge.date}
                      </span>
                      <span className="font-body text-13 tracking-5 text-accent uppercase max-992:text-12">
                        {event.badge.month}
                      </span>
                    </div>
                  </Link>

                  <Stack gap={30} tabletGap={30} mobileGap={30} className="max-992:px-15">
                    <Stack gap={20} tabletGap={20} mobileGap={20}>
                      <span className="font-body text-14 leading-12 tracking-10 text-brand-muted uppercase">
                        {event.date}
                      </span>
                      <Heading level={4} uppercase={false} className="capitalize">
                        {event.title}
                      </Heading>
                      <Prose color="ink-light">{event.description}</Prose>
                    </Stack>
                    <p className="font-display font-normal text-14 leading-12 tracking-10 text-accent capitalize">
                      {event.price}
                    </p>
                    <Button as="a" href={event.href} variant="link" color="brand" className="text-13">
                      View Event
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
