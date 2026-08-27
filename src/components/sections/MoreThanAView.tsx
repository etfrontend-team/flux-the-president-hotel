import Image from 'next/image'
import React from 'react'

import { Button, Container, Heading, Prose } from '@/components/ui'

type Experience = {
  key: string
  heading: React.ReactNode
  description: string
  image: string
  alt: string
}

const experiences: Experience[] = [
  {
    key: 'penguins',
    heading: (
      <>
        <span className="uppercase">sanccob </span>
        <span>penguins</span>
      </>
    ),
    description: 'A morning with African penguins — private conservation tour.',
    image: '/images/discover-penguins.webp',
    alt: 'A penguin resting among rocks at Boulders Beach',
  },
  {
    key: 'picnic',
    heading: 'bespoke beach picnic',
    description: 'A private picnic on the shore, curated just for you.',
    image: '/images/discover-picnic.webp',
    alt: 'A beach picnic spread laid out on striped fabric',
  },
  {
    key: 'activities',
    heading: 'hotel activities',
    description: 'Yoga at sunrise. Paddleboard at dusk. A day to explore.',
    image: '/images/discover-activities.webp',
    alt: 'Guests relaxing at the hotel poolside',
  },
]

const introBlock = (
  <>
    <div className="flex flex-col items-start gap-30">
      <span className="font-accent text-16 tracking-5 text-accent uppercase">Your Cape Town</span>
      <Heading level={3} className="max-992:max-w-360 992:max-w-542">
        More than a view. A city to discover.
      </Heading>
    </div>
    <Prose color="ink-light" className="max-992:max-w-full 992:max-w-529">
      From sunrise penguin walks at Boulders Beach to sundowner picnics on the shoreline — The President unlocks Cape
      Town for you.
    </Prose>
    <Button as="a" href="/experiences/" variant="glass" color="brand" className='max-992:mb-5'>
      Explore experiences
    </Button>
  </>
)

export function MoreThanAView() {
  return (
    <section className="general-padding bg-paper-alt/40">
      <Container variant="lg">
        <div className="flex flex-col items-start gap-35 992:hidden">
          {introBlock}

          <div className="flex w-full flex-col gap-50">
            {experiences.map((experience) => (
              <div key={experience.key} className="flex w-full flex-col gap-30">
                <div className="relative h-230 w-full overflow-hidden rounded-card">
                  <Image src={experience.image} alt={experience.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <div className="flex flex-col items-start gap-10">
                  <Heading level={4} uppercase={false} className="capitalize">
                    {experience.heading}
                  </Heading>
                  <Prose color="ink-light">{experience.description}</Prose>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-992:hidden 1024:px-38">
          <div className="grid grid-cols-2 gap-50">
            <div className="flex flex-col gap-45">
              <div className="relative aspect-607/337 overflow-hidden rounded-card">
                <Image
                  src="/images/discover-cape-town-hero.webp"
                  alt="Palm trees against the hotel facade at golden hour"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col items-start gap-35">{introBlock}</div>
            </div>

            <div className="flex flex-col gap-30">
              {experiences.map((experience) => (
                <div key={experience.key} className="flex items-center gap-30">
                  <div className="relative size-195 shrink-0 overflow-hidden rounded-card">
                    <Image src={experience.image} alt={experience.alt} fill sizes="195px" className="object-cover" />
                  </div>
                  <div className="flex flex-col items-start gap-10">
                    <Heading level={4} uppercase={false} className="capitalize">
                      {experience.heading}
                    </Heading>
                    <Prose color="ink-light" className="max-w-398">
                      {experience.description}
                    </Prose>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
