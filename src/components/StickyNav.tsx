'use client'

import Link from 'next/link'
import React from 'react'

import { NavLink } from '@/components/Header'
import { LogoMark, MenuIcon } from '@/components/icons'
import { useMegaMenu } from '@/components/MegaMenuContext'
import { Button, Container } from '@/components/ui'

const navLinks = ['Stay', 'Experiences', 'Wellness', 'taste', 'Offers']

/** Delay before the nav commits to appearing once the user starts scrolling up. */
const REVEAL_DELAY_MS = 220

/**
 * Solid nav bar that reveals when scrolling up, past any hero section. Per
 * Figma annotations (node 1:3204): shown with a slight delay after the
 * scroll-up starts, and disabled while a full-viewport hero (data-hero) is
 * still on screen — the transparent overlay Header already covers that case.
 */
export function StickyNav() {
  const [visible, setVisible] = React.useState(false)
  const { toggle } = useMegaMenu()

  React.useEffect(() => {
    let lastY = window.scrollY
    let revealTimer: ReturnType<typeof setTimeout> | undefined

    function clearRevealTimer() {
      if (revealTimer) {
        clearTimeout(revealTimer)
        revealTimer = undefined
      }
    }

    function isWithinHero() {
      const hero = document.querySelector('[data-hero]')
      return hero !== null && hero.getBoundingClientRect().bottom > 0
    }

    function onScroll() {
      const y = window.scrollY
      const scrollingUp = y < lastY
      lastY = y

      if (y <= 0 || isWithinHero() || !scrollingUp) {
        clearRevealTimer()
        setVisible(false)
        return
      }

      if (!revealTimer) {
        revealTimer = setTimeout(() => {
          setVisible(true)
          revealTimer = undefined
        }, REVEAL_DELAY_MS)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearRevealTimer()
    }
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-30 h-86 bg-paper/98 shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
      }`}
    >
      <Container as="nav" className="flex h-full items-center justify-between px-25 992:px-35">
        <div className="flex items-center gap-25">
          <button type="button" onClick={toggle} aria-label="Open menu" className="cursor-pointer">
            <MenuIcon className="h-10 w-20 text-brand" />
          </button>
          <ul className="group/navlist flex items-center gap-25 font-body text-14 leading-12 tracking-[1.4px] text-brand uppercase max-1024:hidden">
            {navLinks.map((label) => (
              <li key={label}>
                <NavLink href="#">{label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/" aria-label="The President Hotel, Cape Town" className="block h-62 w-115">
          <LogoMark className="h-full w-full text-brand" />
        </Link>

        <Button variant="outlined" color="brand" className="!bg-brand !text-paper max-1024:!hidden">
          Book Your Stay
        </Button>
      </Container>
    </div>
  )
}
