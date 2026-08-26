import React from 'react'

import { Button, Container, Heading, Prose } from '@/components/ui'

import { WhereToStayCarousel } from './WhereToStayCarousel'

/**
 * Per Figma: desktop node 1:2312, mobile node 1:3475 — homepage section
 * right below the photo marquee.
 */
export function WhereToStay() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="1199:px-38 w-full flex flex-col items-center gap-50">
          <div className="flex max-w-864 flex-col items-center text-center">
            <span className="font-accent text-16 tracking-5 text-accent uppercase mb-30">Where to stay</span>
            <div className="flex flex-col items-center gap-35 mb-35">
              <Heading
                level={3}
                className="1024:!leading-23"
              >
                Your room above the Atlantic.
              </Heading>
              <Prose color="ink-light" className="max-w-679">
                Choose from sea-view rooms, self-catering apartments, and full suites — the sounds of the
                ocean below.
              </Prose>
            </div>
            <Button as="a" href="#" variant="glass" color="brand">
              Explore all stays
            </Button>
          </div>

          <WhereToStayCarousel />
        </div>
      </Container>
    </section>
  )
}
