import Image from 'next/image'
import React from 'react'

import { Heading } from '@/components/ui'

/**
 * Inset banner heading the career-application page. Per Figma: desktop node
 * 477:1484 ("Postion Banner"), mobile node 1:20936.
 *
 * Unlike the site's full-bleed `Hero`, this one is a fixed-ratio card that sits
 * *below* the header rather than under it — which is why the page's header runs
 * in its dark variant (see LIGHT_HEADER_ROUTES in Header.tsx). The top padding
 * reserves the space the absolutely-positioned header occupies: 219px on
 * desktop, 214px on mobile, both measured off the frames.
 */

const DEFAULT_IMAGE = '/images/apply-for-position.webp'

interface PositionBannerProps {
  eyebrow?: string
  title: string
  imageSrc?: string
  imageAlt?: string
}

export function PositionBanner({
  eyebrow = 'Apply for position',
  title,
  imageSrc = DEFAULT_IMAGE,
  imageAlt = 'Sunset over the Atlantic from The President Hotel',
}: PositionBannerProps) {
  return (
    // `data-hero` is the shared hook Header's sticky bar and AnnouncementBar read (see
    // isHeroInView in lib/utils); `data-hero-theme="light"` is what flips the header to its
    // dark-on-paper treatment, the same pair StayHero uses.
    <section data-hero data-hero-theme="light" className="max-992:pt-214 pt-219">
      <div className="relative isolate overflow-hidden rounded-card max-992:mx-15 max-992:aspect-410/727 mx-25 992:aspect-1390/673">
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />

        {/* Figma node 1:13289 — 50% black at the left edge, clear by the right. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]"
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-30 max-992:px-25 max-992:pb-60 px-35 pb-50">
          <span className="font-accent text-16 leading-12 tracking-5 text-paper uppercase">{eyebrow}</span>
          <Heading level={1} color="paper" className="max-w-374 992:max-w-721">
            {title}
          </Heading>
        </div>
      </div>
    </section>
  )
}
