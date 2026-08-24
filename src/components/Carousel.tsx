'use client'

import { type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import { cn } from '@/lib/utils'

type CarouselProps = {
  children: ReactNode[]
  autoplay?: boolean
  className?: string
}

/**
 * Headless embla carousel. Each child becomes a full-width slide; styling is left
 * to the caller. Pass `autoplay` for hero galleries. Client component.
 */
export function Carousel({ children, autoplay = false, className }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' },
    autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : [],
  )

  return (
    <div className={cn('overflow-hidden', className)} ref={emblaRef}>
      <div className="flex">
        {children.map((child, index) => (
          <div className="min-w-0 flex-[0_0_100%]" key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
