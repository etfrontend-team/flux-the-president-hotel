'use client'

import React from 'react'

import { BOOKING_TAB_SCROLL_THRESHOLD } from '@/lib/utils'

export function BookingTab() {
  const [visible, setVisible] = React.useState(false)
  const wrapperRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    function onScroll() {
      const footer = document.querySelector('[data-footer]')
      const wrapperRect = wrapperRef.current?.getBoundingClientRect()
      const footerOverlaps =
        footer !== null && wrapperRect !== undefined && footer.getBoundingClientRect().top < wrapperRect.bottom
      setVisible(window.scrollY > BOOKING_TAB_SCROLL_THRESHOLD && !footerOverlaps)
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
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`group cursor-pointer fixed right-0 top-1/2 z-30 max-1199:hidden flex h-140 w-36 -translate-y-1/2 items-center justify-center rounded-l-card border border-r-0 border-brand-muted bg-paper shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] transition-[transform,background-color] duration-400 ease-out hover:bg-brand ${
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
