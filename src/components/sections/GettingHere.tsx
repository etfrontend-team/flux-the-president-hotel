import React from 'react'

import { Container, Heading, Prose, Stack } from '@/components/ui'

const ROWS = [
  {
    label: 'From the airport',
    description:
      'Approximately 30 minutes by car. Uber and taxi services are readily available. The hotel can arrange private transfers on request.',
  },
  {
    label: 'On arrival',
    description: 'Paid secure parking is available for in-house guests. Street parking is also available along the promenade.',
  },
  {
    label: 'Getting around',
    description:
      "The hotel provides a complimentary shuttle to the V&A Waterfront twice daily. Bicycle hire and e-scooter rentals are available at reception.",
  },
]

/** Per Figma (node 356:1494 desktop, 356:1495 mobile): travel/parking info, divided by rules. */
export function GettingHere() {
  return (
    <section className="general-padding bg-paper-alt/40">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <div className="mb-60">
            <Heading level={4} uppercase={false} className="text-wrap">
              Getting here
            </Heading>
          </div>
          <Stack gap={50} tabletGap={50} mobileGap={50}>
            {ROWS.map((row, index) => (
              <React.Fragment key={row.label}>
                {index > 0 && <div className="w-full border-t border-brand-muted/30" />}
                <Stack gap={32} tabletGap={32} mobileGap={32}>
                  <span className="font-accent text-15 tracking-5 leading-12 text-brand uppercase">{row.label}</span>
                  <Prose color="ink-light">{row.description}</Prose>
                </Stack>
              </React.Fragment>
            ))}
          </Stack>
        </div>
      </Container>
    </section>
  )
}
