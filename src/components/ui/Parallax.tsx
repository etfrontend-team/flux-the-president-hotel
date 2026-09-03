'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ParallaxProps = {
  /** How far the content drifts relative to scroll, as a fraction of scroll
   * distance (e.g. 0.3 = moves at 30% of scroll speed). Defaults to 0.3. */
  speed?: number
  className?: string
  children: ReactNode
}

/**
 * Wraps content (typically a background image) in a subtle vertical parallax
 * effect as the section scrolls through the viewport. Disabled automatically
 * when the user prefers reduced motion.
 */
export function Parallax({ speed = 0.3, className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    function update() {
      if (!node) return
      const rect = node.getBoundingClientRect()
      const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2
      node.style.transform = `translate3d(0, ${distanceFromCenter * speed * -1}px, 0)`
      frame = 0
    }

    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [speed])

  return (
    <div className="overflow-hidden">
      <div ref={ref} className={cn('will-change-transform', className)}>
        {children}
      </div>
    </div>
  )
}
