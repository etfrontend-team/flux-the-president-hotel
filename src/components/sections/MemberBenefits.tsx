import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Container, Heading, Prose, Stack } from '@/components/ui'

type Benefit = {
  heading: string
  description: string
  image: string
  alt: string
  imageObjectPosition?: string
}

const BENEFITS: Benefit[] = [
  {
    heading: 'Exclusive member rates',
    description: 'Up to 20% off best available rate on direct bookings.',
    image: '/images/member-benefits-rates.webp',
    alt: 'A hotel bed with a wood-slat headboard and a bedside table',
  },
  {
    heading: 'Priority upgrades',
    description: 'Subject to availability, members are first in line for room upgrades.',
    image: '/images/member-benefits-upgrades.webp',
    alt: 'A hotel suite living area with a dining table and a view through to the bedroom',
  },
  {
    heading: 'Late check-out',
    description: 'Member late check-out until 13:00 at no additional charge.',
    image: '/images/member-benefits-checkout.webp',
    alt: 'A server placing a coffee and dessert plate on a terrace table',
    imageObjectPosition: '50% 68%',
  },
  {
    heading: 'Early access to offers',
    description: 'Members receive offers before they go public.',
    image: '/images/member-benefits-offers.webp',
    alt: 'A backgammon board and poolside coasters on a table in dappled shade',
  },
  {
    heading: 'Birthday treat',
    description: 'Up to 20% off best available rate on direct bookings.',
    image: '/images/member-benefits-birthday.webp',
    alt: 'An overhead view of dessert plates and a latte on a wooden table',
  },
  {
    heading: 'Concierge priority',
    description: 'Dedicated concierge response within 2 hours for member requests.',
    image: '/images/member-benefits-concierge.webp',
    alt: 'Lion’s Head mountain at golden hour, seen from Camps Bay beach',
  },
]

/**
 * Per Figma (node 384:1509 desktop, 384:1510 mobile): a bordered "Member
 * benefits" grid. Desktop shows an image beside each heading/description,
 * two columns; mobile drops the images entirely and centers a single
 * stacked column of text.
 */
export function MemberBenefits() {
  return (
    <section className="general-padding bg-paper-alt/40">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <FadeIn>
            <Heading level={3} className="mb-40 text-wrap max-992:mb-30 max-992:text-center">
              Member benefits
            </Heading>
          </FadeIn>

          <div className="border-t border-brand-muted/30 pt-40 max-992:pt-50" />

          <div className="grid grid-cols-2 gap-y-35 max-992:grid-cols-1 max-992:gap-y-40">
            {BENEFITS.map((benefit) => (
              <FadeIn key={benefit.heading}>
                <Stack direction="row" mobileDirection="col" align="center" gap={35} tabletGap={35} mobileGap={0}>
                  <div className="relative size-129 shrink-0 overflow-hidden rounded-card max-992:hidden">
                    <Image
                      src={benefit.image}
                      alt={benefit.alt}
                      fill
                      sizes="129px"
                      style={benefit.imageObjectPosition ? { objectPosition: benefit.imageObjectPosition } : undefined}
                      className="object-cover"
                    />
                  </div>
                  <Stack gap={20} tabletGap={20} mobileGap={20} className="max-992:items-center max-992:text-center">
                    <Heading level={4} uppercase={false} className="capitalize">
                      {benefit.heading}
                    </Heading>
                    <Prose color="ink-light">{benefit.description}</Prose>
                  </Stack>
                </Stack>
              </FadeIn>
            ))}
          </div>

          <div className="mt-40 border-t border-brand-muted/30 max-992:mt-40" />
        </div>
      </Container>
    </section>
  )
}
