'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Container, Heading, Prose, Stack } from '@/components/ui'

type Member = {
  name: string
  role: string
  image?: string
  alt?: string
  imageObjectPosition?: string
}

/** Per Figma (node 361:1498 desktop, 1:19406 mobile): only the GM has a real photo/name so far — the other 3 roles are still placeholders in the design itself. */
const TEAM: Member[] = [
  {
    name: 'Nikki Vardan',
    role: 'General Manager',
    image: '/images/team-nikki-vardan.webp',
    alt: 'Nikki Vardan, General Manager, seated poolside',
    imageObjectPosition: '100% 50%',
  },
  { name: 'Name Surname', role: 'Head Chef' },
  { name: 'Name Surname', role: 'Spa Director' },
  { name: 'Name Surname', role: 'Concierge Lead' },
]

export function TeamSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ])

  return (
    <section className="general-padding bg-paper-alt/40 overflow-hidden">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <FadeIn>
            <Stack gap={30} tabletGap={30} mobileGap={30} className="mb-70 max-992:mb-50">
              <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">The team</span>
              <Heading level={3} className="text-wrap 992:leading-23">
                The people behind every stay
              </Heading>
            </Stack>
          </FadeIn>

          <div ref={emblaRef} className="embla__viewport 992:overflow-hidden">
            <div className="embla__container flex max-992:-ml-20 992:grid 992:grid-cols-4 992:gap-x-30">
              {TEAM.map((member, index) => (
                <FadeIn key={`${member.name}-${index}`} className="embla__slide max-992:pl-20 min-w-0 shrink-0 flex-[0_0_83%] 992:flex-none">
                  <Stack gap={35} tabletGap={35} mobileGap={35}>
                    <div className="relative aspect-square w-full overflow-hidden rounded-card">
                      <Image
                        src={member.image ?? '/images/placeholder.webp'}
                        alt={member.image ? (member.alt ?? member.name) : `Photo coming soon for ${member.role}`}
                        fill
                        sizes="(min-width: 993px) 25vw, 83vw"
                        style={member.imageObjectPosition ? { objectPosition: member.imageObjectPosition } : undefined}
                        className="object-cover"
                      />
                    </div>
                    <Stack gap={20} tabletGap={20} mobileGap={20}>
                      <Heading level={6} uppercase={false} color="brand" className="capitalize leading-12">
                        {member.name}
                      </Heading>
                      <Prose as="p" color="ink" className="text-14">
                        {member.role}
                      </Prose>
                    </Stack>
                  </Stack>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
