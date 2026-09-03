import Image from 'next/image'
import { type ReactNode } from 'react'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type Experience = {
  key: string
  heading: ReactNode
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
    <Stack align="start" gap={30} tabletGap={30} mobileGap={30}>
      <span className="font-accent text-16 tracking-5 text-accent uppercase">Your Cape Town</span>
      <Heading level={3} className="max-992:max-w-360 992:max-w-542 text-wrap">
        More than a view. A city to discover.
      </Heading>
    </Stack>
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
      <Container variant="lg" className="max-992:px-26">
        <Stack align="start" gap={35} tabletGap={35} mobileGap={35} className="992:hidden">
          {introBlock}

          <Stack gap={50} tabletGap={50} mobileGap={50} className="w-full">
            {experiences.map((experience) => (
              <Stack key={experience.key} gap={30} tabletGap={30} mobileGap={30} className="w-full">
                <div className="relative h-230 w-full overflow-hidden rounded-card">
                  <Image src={experience.image} alt={experience.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <Stack align="start" gap={10} tabletGap={10} mobileGap={10}>
                  <Heading level={4} uppercase={false} className="capitalize">
                    {experience.heading}
                  </Heading>
                  <Prose color="ink-light">{experience.description}</Prose>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <div className="max-992:hidden 1024:pl-38 1024:pr-22">
          <div className="grid grid-cols-2 1024:grid-cols-[minmax(607px,_1fr)_minmax(623px,_1fr)] gap-30">
            <Stack gap={45} tabletGap={45} mobileGap={45}>
              <div className="relative aspect-607/337 overflow-hidden rounded-card">
                <Image
                  src="/images/discover-cape-town-hero.webp"
                  alt="Palm trees against the hotel facade at golden hour"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>

              <Stack align="start" gap={35} tabletGap={35} mobileGap={35}>{introBlock}</Stack>
            </Stack>

            <Stack gap={30} tabletGap={30} mobileGap={30}>
              {experiences.map((experience) => (
                <Stack key={experience.key} direction="row" align="center" gap={30} tabletGap={30} mobileGap={30}>
                  <div className="relative size-195 shrink-0 overflow-hidden rounded-card">
                    <Image src={experience.image} alt={experience.alt} fill sizes="195px" className="object-cover" />
                  </div>
                  <Stack align="start" gap={20} tabletGap={20} mobileGap={20}>
                    <Heading level={4} uppercase={false} className="capitalize">
                      {experience.heading}
                    </Heading>
                    <Prose color="ink-light" className="max-w-398">
                      {experience.description}
                    </Prose>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </div>
        </div>
      </Container>
    </section>
  )
}
