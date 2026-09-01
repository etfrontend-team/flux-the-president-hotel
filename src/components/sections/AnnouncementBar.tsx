'use client'

import Link from 'next/link'
import React from 'react'

import { Stack, Button } from '@/components/ui'
import { isPinnedSectionInView } from '@/lib/utils'


export function AnnouncementBar({ pairedWithMarquee = false }: { pairedWithMarquee?: boolean }) {
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
      {pairedWithMarquee ? (
        <div ref={sentinelRef} className="max-992:h-40 h-53 bg-accent/10" />
      ) : (
        <div ref={sentinelRef} className="h-1 bg-paper-alt" />
      )}

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
          gap={15}
          mobileGap={10}
          className={`max-992:py-20 pt-11 pb-13 transition-colors duration-300 ${
            pairedWithMarquee && !isStuck ? 'bg-paper-alt' : 'bg-paper-alt'
          }`}
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
            className="font-body max-992:text-12 text-13 tracking-5 uppercase leading-12 py-6"
          >
            Book Now
          </Button>
        </Stack>
      </div>
    </>
  )
}
