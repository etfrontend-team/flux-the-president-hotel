import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type Offer = {
  title: string
  image: string
  alt: string
  imagePosition?: string
  usps: string[]
  description: string
  href: string
}

const OFFERS: Offer[] = [
  {
    title: 'Atlantic Cosy Escape',
    image: '/images/current-offers-atlantic-cosy-escape.webp',
    alt: 'A cosy bedroom with a sea view through floor-to-ceiling windows',
    usps: ['2 night minimum', 'Direct bookings only', 'Subject to availability'],
    description:
      'Stay 3 nights, save 15% on your room rate. Includes a welcome bottle of wine and complimentary late check-out.',
    href: '#',
  },
  {
    title: 'Sunset Serenade Package',
    image: '/images/current-offers-sunset-serenade.webp',
    alt: 'An aerial view of the hotel and coastline at sunset',
    usps: ['2 nights minimum', 'Direct bookings only', 'Valid until 31 Aug 2026'],
    description:
      'Two nights, daily breakfast for two, a private sundowner experience on The Deck, and early check-in subject to availability.',
    href: '#',
  },
  {
    title: 'Wellness Retreat',
    image: '/images/current-offers-wellness-retreat.webp',
    alt: 'A guest receiving a hot stone massage at the spa',
    imagePosition: '50% 62%',
    usps: ['3 nights minimum', 'Direct bookings only', 'Subject to availability'],
    description:
      'Three nights in a Sea View Room with daily spa treatments, access to the Cove Wellness Spa, and a guided morning beach walk.',
    href: '#',
  },
  {
    title: 'Family Escape',
    image: '/images/current-offers-family-escape.webp',
    alt: 'Two children playing on a striped pool float',
    usps: ['2 nights minimum', 'Direct bookings only', 'Subject to availability'],
    description:
      "A self-catering apartment for 4, with daily breakfast, children's activity pack, and a beach picnic experience.",
    href: '#',
  },
]

const DISCLAIMER =
  '*Offers subject to availability and blackout dates. All rates are per room per night. Cannot be combined with other promotions.'

export function CurrentOffers() {
  return (
    <section className="general-padding">
      <Container variant="lg" className="1024:px-91 px-26">
        <Heading level={3} className="mb-50">
          Current Offers
        </Heading>

        <div className="border-t border-brand-muted/30">
          {OFFERS.map((offer) => (
            <FadeIn key={offer.title}>
              <div className="grid grid-cols-[491px_1fr] 1512:grid-cols-2 gap-x-45 border-b border-brand-muted/30 py-50 max-992:grid-cols-1 max-992:gap-y-50">
                <div className="relative aspect-491/305 overflow-hidden rounded-card">
                  <Image
                    src={offer.image}
                    alt={offer.alt}
                    fill
                    sizes="(min-width: 993px) 491px, 100vw"
                    style={offer.imagePosition ? { objectPosition: offer.imagePosition } : undefined}
                    className="object-cover"
                  />
                </div>

                <Stack align="start" justify="center" gap={35} tabletGap={35} mobileGap={35}>
                  <Stack align="start" gap={30} tabletGap={30} mobileGap={30} className="text-brand">
                    <Heading level={4} color="brand" uppercase={false} className="capitalize">
                      {offer.title}
                    </Heading>
                    <Stack direction="wrap" gap={20} tabletGap={20} mobileGap={20} className="font-accent text-15 tracking-5 uppercase">
                      {offer.usps.slice(0, 3).map((usp) => (
                        <span key={usp}>{usp}</span>
                      ))}
                    </Stack>
                  </Stack>
                  <Prose color="ink-light" className="line-clamp-3 max-w-620">
                    {offer.description}
                  </Prose>
                  <Button as="a" href={offer.href} variant="glass" color="brand">
                    Book now
                  </Button>
                </Stack>
              </div>
            </FadeIn>
          ))}
        </div>

        <Prose color="ink-light" className="mt-40 text-14 max-w-full">
          {DISCLAIMER}
        </Prose>
      </Container>
    </section>
  )
}
