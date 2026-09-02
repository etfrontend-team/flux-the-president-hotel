import React from 'react'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type Highlight = {
  heading: string
  description: string
}

const HIGHLIGHTS: Highlight[] = [
  { heading: '3 Spaces', description: 'Flexible indoor & outdoor' },
  { heading: '120 Guests', description: 'Max. full-venue capacity' },
  { heading: 'In-house Catering', description: 'All dietary requirements' },
]

/** Per Figma (node 330:1481): a divided stat row with a CTA, e.g. below an events hero. */
export function VenueHighlights() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="flex items-center justify-between gap-40 1199:gap-60 1024:px-38 px-11 max-992:flex-col max-992:gap-30">
          {HIGHLIGHTS.map((item, index) => (
            <React.Fragment key={item.heading}>
              {index > 0 && (
                <div aria-hidden="true" className="max-992:h-px max-992:w-full h-74 w-px shrink-0 bg-brand-muted/30" />
              )}
              <FadeIn>
                <Stack align="center" gap={20} tabletGap={20} mobileGap={20} className="shrink-0 text-center whitespace-nowrap">
                  <Heading level={4} uppercase={false} className="capitalize">
                    {item.heading}
                  </Heading>
                  <Prose color="ink-light">{item.description}</Prose>
                </Stack>
              </FadeIn>
            </React.Fragment>
          ))}

          <div aria-hidden="true" className="max-992:h-px max-992:w-full h-74 w-px shrink-0 bg-brand-muted/30" />

          <FadeIn className="max-992:mt-10">
            <Button as="a" href="/events/request-a-quote" variant="solid" color="brand" className="max-992:w-full">
              Request a quote
            </Button>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
