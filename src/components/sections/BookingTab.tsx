'use client'

import { useLenis } from 'lenis/react'
import React from 'react'

import { isHeroMostlyScrolledPast } from '@/lib/utils'

export function BookingTab() {
  const [visible, setVisible] = React.useState(false)
  const wrapperRef = React.useRef<HTMLButtonElement>(null)
  const lenis = useLenis()

  React.useEffect(() => {
    function onScroll() {
      const footer = document.querySelector('[data-footer]')
      const wrapperRect = wrapperRef.current?.getBoundingClientRect()
      const footerOverlaps =
        footer !== null && wrapperRect !== undefined && footer.getBoundingClientRect().top < wrapperRect.bottom

      const bars = document.querySelectorAll<HTMLElement>('[data-booking-bar]')
      const activeBar = Array.from(bars).find((el) => el.offsetParent !== null)

      const pastBookingBar =
        activeBar?.dataset.bookingBar === 'flow'
          ? activeBar.getBoundingClientRect().bottom <= 0
          : isHeroMostlyScrolledPast()

      setVisible(pastBookingBar && !footerOverlaps)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      ref={wrapperRef}
      aria-hidden={!visible}
      aria-label="Check rates"
      onClick={() => {
        const bars = document.querySelectorAll<HTMLElement>('[data-booking-bar]')
        const target = Array.from(bars).find((el) => el.offsetParent !== null)
        if (!target) return

        // The overlay bar is pinned to the bottom of the full-height hero, so
        // scrolling its own top edge into view would scroll past most of the
        // hero — scrolling to the page top is what actually reveals it. The
        // flow bar has no such pinning, so it's scrolled to directly.
        if (target.dataset.bookingBar === 'flow') {
          lenis?.scrollTo(target)
        } else {
          lenis?.scrollTo(0)
        }
      }}
      className={`group cursor-pointer fixed right-0 top-1/2 z-30 flex h-140 w-36 -translate-y-1/2 items-center justify-center rounded-l-card border border-r-0 border-brand-muted bg-paper shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] transition-all duration-400 ease-out hover:bg-brand ${
        visible ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
      }`}
    >
      <span
        className="-rotate-90 whitespace-nowrap font-body text-12 tracking-5 text-brand uppercase cursor-pointer transition-colors duration-400 ease-out group-hover:text-paper"
      >
        Check Rates
      </span>
    </button>
  )
}
