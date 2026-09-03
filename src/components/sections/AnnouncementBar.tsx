'use client'

import { useEffect, useRef, useState } from 'react'

import { Stack, Button } from '@/components/ui'
import { isPinnedSectionInView } from '@/lib/utils'


export function AnnouncementBar({ pairedWithMarquee = false }: { pairedWithMarquee?: boolean }) {
  const [visible, setVisible] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const [forceHidden, setForceHidden] = useState(false)
  const [marqueePassed, setMarqueePassed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(([entry]) => setIsStuck(entry.boundingClientRect.top < 0), {
      threshold: 0,
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!pairedWithMarquee) return
    const marqueeEl = barRef.current?.nextElementSibling
    if (!marqueeEl) return

    const observer = new IntersectionObserver(([entry]) => setMarqueePassed(entry.boundingClientRect.bottom < 0), {
      threshold: 0,
    })
    observer.observe(marqueeEl)
    return () => observer.disconnect()
  }, [pairedWithMarquee])

  const hidden = forceHidden || (isStuck && pairedWithMarquee && !marqueePassed) || (isStuck && !visible)

  return (
    <>
      {pairedWithMarquee ? (
        <div ref={sentinelRef} className="max-992:h-40 h-53 bg-accent/10" />
      ) : (
        <div ref={sentinelRef} className="h-1 bg-paper-alt" />
      )}

      <div
        ref={barRef}
        aria-hidden={hidden}
        className={`relative top-0 z-20 transition-all duration-300 ease-out ${
          hidden ? 'translate-y-0 pointer-events-none' : 'sticky translate-y-0 pointer-events-auto'
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
