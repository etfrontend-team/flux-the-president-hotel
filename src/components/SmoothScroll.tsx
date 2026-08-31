'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'motion/react'

import { useMegaMenu } from '@/components/MegaMenuContext'

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * Lenis is fully unmounted (not just paused) while the mega menu is open,
 * rather than manually destroying/reconstructing the instance by hand —
 * `<ReactLenis>`'s own effect already handles proper teardown/setup on
 * mount/unmount. This also fixes MegaMenu's own scrollable panel: Lenis
 * otherwise intercepts wheel events globally (including over that nested
 * panel), so its native `onScroll` (driving `.is-scrolling`) never fired.
 * The RAF loop below stays registered throughout — `lenisRef.current` is
 * simply `null` (a no-op) whenever Lenis isn't mounted.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null)
  const { isOpen } = useMegaMenu()

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  if (isOpen) return <>{children}</>

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  )
}
