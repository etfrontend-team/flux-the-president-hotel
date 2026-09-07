import Image from 'next/image'
import React from 'react'

import { Container, Heading, Prose } from '@/components/ui'

type PageHeroProps = {
  /** Small label above the title (Figma node 1:12155). */
  eyebrow: string
  title: React.ReactNode
  image: string
  alt: string
}

/**
 * Interior-page hero — full-bleed photo in a rounded, inset card with the page title over it
 * (Figma "gallery/" node 1:12137).
 *
 * Height follows the Figma annotation on the homepage hero (node 1:2298): "All hero sections
 * across the website should be full viewport height", so this uses min-h-screen rather than the
 * mockup's literal 866px frame, and centres the copy instead of pinning it to a pixel offset.
 */
export function PageHero({ eyebrow, title, image, alt }: PageHeroProps) {
  return (
    <section className="relative isolate m-25 overflow-hidden rounded-card max-992:m-15">
      <div className="relative min-h-screen overflow-hidden">
        <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />

        {/* Figma's two hero gradients: 25% black bled in from the left edge, 20% black across the
            top quarter — both purely for title legibility. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_100%),linear-gradient(to_bottom,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_27%)]"
        />

        <Container variant="lg" className="relative z-10 flex min-h-screen flex-col p-0 992:p-0">
          <div className="my-auto flex flex-col items-start gap-30 px-35 text-paper max-992:px-25">
            <Prose as="span" font="accent" color="paper" className="text-16 font-normal uppercase">
              {eyebrow}
            </Prose>
            <Heading level={1} color="paper">
              {title}
            </Heading>
          </div>
        </Container>
      </div>
    </section>
  )
}
