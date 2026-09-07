'use client'

import { useState } from 'react'

import { FadeIn } from '@/components/FadeIn'
import { MinusIcon, PlusIcon } from '@/components/icons'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

const AMENITIES_COL_1 = ['Private Balcony', 'Aircon', 'Cleaning', 'Queen or twin']
const AMENITIES_COL_2 = ['Shower & Bath', 'Semi-catering Kitchenette', 'Private TV', '24-hour Room Service']

const INCLUDES = ['Smart TV', 'Butler service', 'Swedish underfloor heating', 'Wifi', 'Private shrine room']
const EXCLUDES: string[] = []

function AmenityList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-24">
      {items.map((item) => (
        <li key={item} className="ms-21 list-disc text-14 tracking-10 text-brand-muted capitalize">
          {item}
        </li>
      ))}
    </ul>
  )
}

function AccordionSection({
  label,
  items,
  defaultOpen,
}: {
  label: string
  items: string[]
  defaultOpen: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-brand-muted/30 py-40">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-20 text-left"
      >
        <Heading level={4} uppercase={false} className="capitalize">
          {label}
        </Heading>
        {isOpen ? <MinusIcon className="h-7 w-7 shrink-0 text-brand" /> : <PlusIcon className="h-7 w-7 shrink-0 text-brand" />}
      </button>

      <div className={cn('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="pt-30">
            <AmenityList items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function StayDetails({
  title = 'Rooms',
  perfectFor = 'Perfect for: Travel persona name',
  occupancy = '2 adults + 1 infant* | 31sqm/334ft',
  description = "Experience exquisite views of Lion's Head - part of Table Mountain National Park - in our Classic Mountain Rooms; equipped with an open-plan kitchenette, seating area, desk, bathroom and separate toilet. All Classic Mountain Rooms vary with décor, views, furnishings and layout.",
  priceFrom = 'From R2 300',
  roomsAdults = 'X Rooms, X Adults',
  childrenFree = 'Children: 0-2 years stay free',
  childrenDiscount = '3 - 11 years pay 50% of sharing rate',
  priceNote = 'Per person per night',
  buttonLabel = 'Book this room',
  buttonHref = '#',
}: {
  title?: string
  perfectFor?: string
  occupancy?: string
  description?: string
  priceFrom?: string
  roomsAdults?: string
  childrenFree?: string
  childrenDiscount?: string
  priceNote?: string
  buttonLabel?: string
  buttonHref?: string
}) {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="flex items-start justify-between gap-x-97 max-992:flex-col max-992:gap-y-50 1024:px-38 px-11">
          <div className="min-w-0 max-992:w-full 992:max-w-582 992:flex-1">
            <FadeIn className='px-15'>
              <Stack align="start" gap={35} tabletGap={35} mobileGap={35}>
                <Heading level={3} className="text-wrap">
                  {title}
                </Heading>
                <span className="text-14 tracking-10 text-brand/80 uppercase">{perfectFor}</span>
                <span className="text-14 tracking-10 text-brand-muted uppercase">{occupancy}</span>
                <Prose color="ink-light" className="max-w-578">
                  {description}
                </Prose>
              </Stack>
            </FadeIn>

            <div className="mt-70 max-992:mt-50 992:hidden">
              <DetailsCard
                priceFrom={priceFrom}
                roomsAdults={roomsAdults}
                childrenFree={childrenFree}
                childrenDiscount={childrenDiscount}
                priceNote={priceNote}
                buttonLabel={buttonLabel}
                buttonHref={buttonHref}
              />
            </div>

            <FadeIn>
              <div className="mt-70 max-992:mt-50 border-t border-brand-muted/30 py-40">
                <Heading level={4} uppercase={false} className="mb-40 capitalize">
                  Amenities
                </Heading>

                <div className="flex gap-96 max-992:hidden">
                  <AmenityList items={AMENITIES_COL_1} />
                  <div aria-hidden="true" className="w-px bg-brand-muted/30" />
                  <AmenityList items={AMENITIES_COL_2} />
                </div>
                <div className="992:hidden">
                  <AmenityList items={[...AMENITIES_COL_1, ...AMENITIES_COL_2]} />
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <AccordionSection label="Includes" items={INCLUDES} defaultOpen />
            </FadeIn>
            <FadeIn>
              <AccordionSection label="Excludes" items={EXCLUDES} defaultOpen={false} />
            </FadeIn>
          </div>

          <div className="max-992:hidden 992:sticky 992:top-74 992:w-525 992:shrink-0">
            <FadeIn>
              <DetailsCard
                priceFrom={priceFrom}
                roomsAdults={roomsAdults}
                childrenFree={childrenFree}
                childrenDiscount={childrenDiscount}
                priceNote={priceNote}
                buttonLabel={buttonLabel}
                buttonHref={buttonHref}
              />
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}

function DetailsCard({
  priceFrom,
  roomsAdults,
  childrenFree,
  childrenDiscount,
  priceNote,
  buttonLabel,
  buttonHref,
}: {
  priceFrom: string
  roomsAdults: string
  childrenFree: string
  childrenDiscount: string
  priceNote: string
  buttonLabel: string
  buttonHref: string
}) {
  return (
    <Stack
      align="start"
      gap={35}
      tabletGap={35}
      mobileGap={35}
      className="rounded-card border border-brand/10 bg-paper-alt/40 px-45 py-40 shadow-policy max-992:px-25"
    >
      <Heading level={4} uppercase={false} className="capitalize">
        Details
      </Heading>

      <Stack align="start" gap={25} tabletGap={25} mobileGap={25}>
        <span className="text-14 tracking-10 text-brand/80 uppercase">{roomsAdults}</span>
        <Stack align="start" gap={5} tabletGap={5} mobileGap={5}>
          <span className="text-14 tracking-10 text-brand-muted capitalize">{childrenFree}</span>
          <span className="text-14 tracking-10 text-brand-muted capitalize">{childrenDiscount}</span>
        </Stack>
      </Stack>

      <Stack align="start" gap={10} tabletGap={10} mobileGap={10}>
        <p className="font-display font-light text-24 992:text-30 tracking-5 text-brand capitalize">{priceFrom}</p>
        <span className="text-14 tracking-10 text-brand-muted capitalize">{priceNote}</span>
      </Stack>

      <Button as="a" href={buttonHref} variant="solid" color="brand" className="w-full">
        {buttonLabel}
      </Button>
    </Stack>
  )
}
