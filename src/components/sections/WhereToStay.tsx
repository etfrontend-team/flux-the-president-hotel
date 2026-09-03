import { Button, Container, Heading, Prose, Stack } from '@/components/ui'

import { WhereToStayCarousel } from './WhereToStayCarousel'

/**
 * Per Figma: desktop node 1:2312, mobile node 1:3475 — homepage section
 * right below the photo marquee.
 */
export function WhereToStay() {
  return (
    <section className="general-padding">
      <Container variant="lg" className="max-992:px-26">
        <Stack align="center" gap={50} tabletGap={50} mobileGap={50} className="1199:px-38 w-full">
          <div className="flex max-w-864 flex-col items-center text-center">
            <span className="font-accent text-16 tracking-5 text-accent uppercase mb-30">Where to stay</span>
            <Stack align="center" gap={35} tabletGap={35} mobileGap={35} className="mb-35">
              <Heading
                level={3}
                className=""
              >
                Your room above the Atlantic.
              </Heading>
              <Prose color="ink-light" className="max-w-679">
                Choose from sea-view rooms, self-catering apartments, and full suites — the sounds of the
                ocean below.
              </Prose>
            </Stack>
            <Button as="a" href="#" variant="glass" color="brand">
              Explore all stays
            </Button>
          </div>

          <WhereToStayCarousel />
        </Stack>
      </Container>
    </section>
  )
}
