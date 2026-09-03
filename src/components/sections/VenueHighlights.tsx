import React from 'react'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

type Highlight = {
  heading: string
  description: string
}

const DEFAULT_HIGHLIGHTS: Highlight[] = [
  { heading: '3 Spaces', description: 'Flexible indoor & outdoor' },
  { heading: '120 Guests', description: 'Max. full-venue capacity' },
  { heading: 'In-house Catering', description: 'All dietary requirements' },
]

/** Per Figma (node 330:1481 events variant, 360:1497 about variant): a divided stat row with an optional CTA. */
export function VenueHighlights({
  highlights = DEFAULT_HIGHLIGHTS,
  buttonLabel = 'Request a quote',
  buttonHref = '/events/request-a-quote',
}: {
  highlights?: Highlight[]
  buttonLabel?: string | null
  buttonHref?: string
}) {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="flex items-center justify-between gap-40 1199:gap-60 992:px-38 px-11 max-992:flex-col max-992:gap-30">
          {highlights.map((item, index) => (
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

          {buttonLabel && (
            <>
              <div aria-hidden="true" className="max-992:h-px max-992:w-full h-74 w-px shrink-0 bg-brand-muted/30" />

              <FadeIn className="max-992:mt-10">
                <Button as="a" href={buttonHref} variant="solid" color="brand" className="max-992:w-full">
                  {buttonLabel}
                </Button>
              </FadeIn>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
