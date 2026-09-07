'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type Topic = {
  title: string
  description: string
  note?: string
  buttonLabel: string
  buttonHref: string
  image?: string
  alt?: string
  imageObjectPosition?: string
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

const LEFT_TOPICS: Topic[] = [
  {
    title: 'Hearing Impaired',
    description: LOREM,
    buttonLabel: 'Contact Us',
    buttonHref: '/contactus',
    image: '/images/guest-info-hearing.webp',
    alt: 'An accessible bathroom with a wall mirror and a wheelchair-access sign on the door',
  },
  {
    title: 'Guide dog friendly',
    description: LOREM,
    buttonLabel: 'Book Now',
    buttonHref: '#',
    image: '/images/guest-info-guidedog.webp',
    alt: 'A hotel bedside table with a lamp and a striped cushion against a wood-slat headboard',
  },
  {
    title: 'Jewish Guests',
    description: LOREM,
    buttonLabel: 'Book Now',
    buttonHref: '#',
  },
]

const RIGHT_TOPICS: Topic[] = [
  {
    title: 'Accessibility Friendly',
    description: LOREM,
    note: 'Disable bathrooms and areas',
    buttonLabel: 'Contact Us',
    buttonHref: '/contactus',
    image: '/images/guest-info-accessibility.webp',
    alt: 'A wooden dressing desk beneath a mirror, with a table lamp and framed artwork',
    imageObjectPosition: '50% 79%',
  },
  {
    title: 'Muslim Guests',
    description: LOREM,
    note: 'Disable bathrooms and areas',
    buttonLabel: 'Book Now',
    buttonHref: '#',
    image: '/images/guest-info-muslim.webp',
    alt: 'The hotel pool with palm trees and the ocean beyond, "The President" spelled out at the waterline',
  },
  {
    title: 'Neurodiversity',
    description: LOREM,
    note: 'Disable bathrooms and areas',
    buttonLabel: 'learn more',
    buttonHref: '#',
    image: '/images/guest-info-neurodiversity.webp',
    alt: "A children's play tent with a plush toy in a hotel living room",
  },
]

const MOBILE_TOPICS: Topic[] = [
  LEFT_TOPICS[0],
  RIGHT_TOPICS[0],
  LEFT_TOPICS[1],
  RIGHT_TOPICS[1],
  LEFT_TOPICS[2],
  RIGHT_TOPICS[2],
]

function TopicImage({
  topic,
  aspectClassName,
}: {
  topic: Topic
  aspectClassName: string
}) {
  return (
    <div className={`relative w-full overflow-hidden rounded-card ${aspectClassName}`}>
      <Image
        src={topic.image ?? '/images/placeholder.webp'}
        alt={topic.image ? (topic.alt ?? topic.title) : `Photo coming soon for ${topic.title}`}
        fill
        sizes="(min-width: 993px) 40vw, 100vw"
        style={topic.imageObjectPosition ? { objectPosition: topic.imageObjectPosition } : undefined}
        className="object-cover"
      />
    </div>
  )
}

function TopicCopy({ topic }: { topic: Topic }) {
  return (
    <Stack align="start" gap={35} tabletGap={35} mobileGap={35}>
      <Stack align="start" gap={50} tabletGap={50} mobileGap={50}>
        <Heading level={3} className="text-wrap">
          {topic.title}
        </Heading>
        <Prose color="ink-light" className="max-w-531">
          {topic.note ? (
            <>
              {topic.description}
              <br aria-hidden="true" />
              <br aria-hidden="true" />
              {topic.note}
            </>
          ) : (
            topic.description
          )}
        </Prose>
      </Stack>
      <Button as="a" href={topic.buttonHref} variant="glass" color="brand">
        {topic.buttonLabel}
      </Button>
    </Stack>
  )
}

function ParallaxCard({ topic }: { topic: Topic }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <div ref={ref}>
      <FadeIn>
        <m.div style={{ y }}>
          <Stack align="start" gap={50} tabletGap={50} mobileGap={50}>
            <TopicImage topic={topic} aspectClassName="aspect-572/450" />
            <TopicCopy topic={topic} />
          </Stack>
        </m.div>
      </FadeIn>
    </div>
  )
}
export function GuestAccessibility() {
  return (
    <section className="general-padding overflow-hidden">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <div className="hidden gap-x-60 992:flex 992:items-start">
            <div className="flex flex-1 flex-col gap-100">
              {LEFT_TOPICS.map((topic) => (
                <FadeIn key={topic.title}>
                  <Stack align="start" gap={50} tabletGap={50} mobileGap={50}>
                    <TopicCopy topic={topic} />
                    <TopicImage topic={topic} aspectClassName="aspect-572/593" />
                  </Stack>
                </FadeIn>
              ))}
            </div>

            <div className="992:-mt-53 flex flex-1 flex-col gap-100">
              {RIGHT_TOPICS.map((topic) => (
                <ParallaxCard key={topic.title} topic={topic} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-100 992:hidden">
            {MOBILE_TOPICS.map((topic) => (
              <FadeIn key={topic.title}>
                <Stack align="start" gap={50} tabletGap={50} mobileGap={50}>
                  <TopicImage topic={topic} aspectClassName="aspect-square" />
                  <TopicCopy topic={topic} />
                </Stack>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
