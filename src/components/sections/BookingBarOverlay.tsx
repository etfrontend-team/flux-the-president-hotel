'use client'

import React from 'react'

import { isHeroMostlyScrolledPast } from '@/lib/utils'

import { BookingBar } from './BookingBar'

/**
 * Fades out the desktop overlay BookingBar once the hero has scrolled up to
 * where only 10% of it remains visible, handing off to BookingTab — matches
 * the reference site (reschio.com/hotel), which hides its own full bar the
 * same way rather than letting it just scroll out of view naturally.
 */
export function BookingBarOverlay() {
  const [pastThreshold, setPastThreshold] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setPastThreshold(isHeroMostlyScrolledPast())
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden={pastThreshold}
      className={`transition-opacity duration-[400ms] ease-out ${
        pastThreshold ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <BookingBar variant="overlay" />
    </div>
  )
}
