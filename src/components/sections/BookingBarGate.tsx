'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
const BOOKING_BAR_ROUTES = ['/', '/stay']

function isBookingBarRoute(pathname: string) {
  return BOOKING_BAR_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * The hero's booking bar (BookingBarOverlay, the mobile BookingBar, and
 * BookingTab) should only appear on the home and stay pages — not on any
 * other page Hero might end up rendered on later. Gates by route here
 * rather than inside BookingBar itself, since BookingBar is a generic,
 * reusable field-set that other pages may legitimately embed on their own.
 */
export function BookingBarGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (!isBookingBarRoute(pathname)) return null
  return <>{children}</>
}
