'use client'

import Link from 'next/link'
import React from 'react'

import { Stack, Button } from '@/components/ui'
import { isPinnedSectionInView } from '@/lib/utils'

/**
 * Promo strip placed directly after Hero on every page. `position: sticky`
 * does two jobs at once: the real content sits in normal flow right there
 * (not an empty spacer standing in for it), and once scrolled far enough
 * that its native position would leave the top of the viewport, it sticks
 * there natively — no JS needed to detect that. On top of that, a
 * translate-based show/hide driven by scroll direction (same mechanism as
 * StickyNav, inverted): hidden while scrolling up, visible while scrolling
 * down — but only once actually stuck. A sticky element behaves like a
 * normal block until it engages, so applying the hide transform beforehand
 * would shift it out of its own in-flow position and overlap the Hero above
 * it; `isStuck` (detected via the same sentinel + IntersectionObserver
 * technique used elsewhere in this file's history) gates that off.
 *
 * Forced hidden while a pinned/fixed-scroll section (e.g. CoreExperience) is
 * on screen, regardless of scroll direction — per its Figma annotation, this
 * bar shouldn't show over that component or any similar to it. This force-hide
 * is independent of `isStuck`: those sections all sit well below the fold, so
 * by the time one is in view this bar is already stuck, but gating on both
 * would leave a real gap for a fast jump (scrollbar drag, Page Down) that
 * outruns the sentinel's IntersectionObserver.
 */
export function AnnouncementBar() {
  const [visible, setVisible] = React.useState(false)
  const [isStuck, setIsStuck] = React.useState(false)
  const [forceHidden, setForceHidden] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const scrollingDown = y > lastY
      lastY = y

      if (isPinnedSectionInView()) {
        setForceHidden(true)
        return
      }

      setForceHidden(false)
      setVisible(scrollingDown)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => setIsStuck(entry.boundingClientRect.top < 0), {
      threshold: 0,
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const hidden = forceHidden || (isStuck && !visible)

  return (
    <>
      <div ref={sentinelRef} className="h-1 bg-paper-alt" />
      <div
        aria-hidden={hidden}
        className={`sticky top-0 z-20 transition-transform duration-300 ease-out ${
          hidden ? '-translate-y-full pointer-events-none' : 'translate-y-0 pointer-events-auto'
        }`}
      >
        <Stack
          as="div"
          direction="row"
          mobileDirection="col"
          align="center"
          justify="center"
          gap={12}
          mobileGap={10}
          className="bg-paper-alt max-992:py-20 py-12"
        >
          <span className="font-accent text-15 tracking-5 text-brand uppercase">Best rate guarantee</span>
          <span className="font-light text-[14.5px] tracking-5 text-ink capitalize opacity-95">
            Book direct for the best possible pricing
          </span>
          <Button
            as="a"
            href="#"
            variant="link"
            color="brand"
            className="font-body !text-13 tracking-5 uppercase !leading-9 py-6"
          >
            Book Now
          </Button>
        </Stack>
      </div>
    </>
  )
}
