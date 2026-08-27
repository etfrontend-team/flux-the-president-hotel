'use client'

import { type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import { cn } from '@/lib/utils'

type CarouselProps = {
  children: ReactNode[]
  autoplay?: boolean
  /** Embla options, merged over the defaults (`loop`, `align: 'start'`). Typed off the hook so the
      core `embla-carousel` package stays a transitive dependency. */
  options?: Parameters<typeof useEmblaCarousel>[0]
  /** Classes for the viewport (the element that clips the track). */
  className?: string
  /** Classes for the track — use this for the gutter between slides. */
  trackClassName?: string
  /** Per-slide classes. Defaults to one full-width slide; override for peeking slides. */
  slideClassName?: string
}

/**
 * Headless embla carousel. Each child becomes a slide; styling is left to the caller.
 * Pass `autoplay` for hero galleries. Client component.
 *
 * Embla handles pointer/touch dragging and — via its default `watchFocus` — scrolls a slide
 * into view when something inside it receives keyboard focus.
 */
export function Carousel({
  children,
  autoplay = false,
  options,
  className,
  trackClassName,
  slideClassName = 'flex-[0_0_100%]',
}: CarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', ...options },
    autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : [],
  )

  return (
    <div className={cn('overflow-hidden', className)} ref={emblaRef}>
      <div className={cn('flex', trackClassName)}>
        {children.map((child, index) => (
          <div className={cn('min-w-0', slideClassName)} key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
