'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { useDayNight } from '@/components/DayNightContext'
import { LogoMark, LogoSticky, MenuIcon } from '@/components/icons'
import { useMegaMenu } from '@/components/MegaMenuContext'
import { Button, Container, Stack } from '@/components/ui'
import { isHeroInView } from '@/lib/utils'

const navLinks: { label: string; href?: string }[] = [
  { label: 'Stay', href: '/stay' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Wellness', href: 'wellness' },
  { label: 'taste', href: '/taste' },
  { label: 'Offers', href: '/offers' },
]

/** Delay before the sticky bar commits to appearing once the user starts scrolling up. */
const STICKY_REVEAL_DELAY_MS = 220

/** Hover-reveal underline — shared with any other tab/link that should match the nav's hover treatment. */
export const underlineClasses =
  "before:absolute before:inset-x-0 before:-bottom-5 before:h-px before:origin-right before:scale-x-0 before:bg-current before:transition-[scale] before:duration-[735ms] before:ease-[cubic-bezier(0.625,0.05,0,1)] before:content-[''] " +
  'hover:before:origin-left hover:before:scale-x-100 hover:before:delay-300'

export function NavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group/link relative inline-block py-4 transition-opacity duration-300 group-hover/navlist:opacity-50 hover:opacity-100! ${underlineClasses}`}
    >
      <span className="block">
        {children}
      </span>
    </Link>
  )
}

export function Header() {
  const { toggle } = useMegaMenu()
  const { mode, toggle: toggleDayNight } = useDayNight()
  const isHomepage = usePathname() === '/'
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let revealTimer: ReturnType<typeof setTimeout> | undefined

    function clearRevealTimer() {
      if (revealTimer) {
        clearTimeout(revealTimer)
        revealTimer = undefined
      }
    }

    function onScroll() {
      const y = window.scrollY
      const scrollingUp = y < lastY
      lastY = y

      if (y <= 0 || isHeroInView() || !scrollingUp) {
        clearRevealTimer()
        setStickyVisible(false)
        return
      }

      if (!revealTimer) {
        revealTimer = setTimeout(() => {
          setStickyVisible(true)
          revealTimer = undefined
        }, STICKY_REVEAL_DELAY_MS)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearRevealTimer()
    }
  }, [])

  return (
    <>
    <Container
      as="header"
      className="w-auto absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-24 max-992:mx-15 mx-25 max-1199:px-25 1199:px-35 py-17"
    >
      <Stack as="nav" direction="row" align="center" gap={25} tabletGap={15} mobileGap={25} className="mt-27 1024:mt-28">
        <button type="button" onClick={toggle} aria-label="Open menu" className="cursor-pointer">
          <MenuIcon className="h-10 w-20 text-paper" />
        </button>
        <Stack
          as="ul"
          direction="row"
          align="center"
          gap={25}
          tabletGap={10}
          mobileGap={25}
          className="group/navlist max-1024:hidden font-body text-14 leading-12 tracking-10 text-paper uppercase"
        >
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <NavLink href={href ?? '#'}>{label}</NavLink>
            </li>
          ))}
        </Stack>
      </Stack>

      <Link
        href="/"
        aria-label="The President Hotel, Cape Town"
        className="block h-auto w-115 mx-auto absolute left-1/2 -translate-x-1/2"
      >
        <LogoMark className="h-auto w-full text-paper" />
      </Link>

      <Stack direction="row" align="center" gap={20} mobileGap={15} className="relative 1024:ml-auto max-w-476 mt-17 1024:mt-13">
        {isHomepage && (
          <>
            <span className="font-body text-14 leading-12 tracking-10 text-paper uppercase sm:inline">
              {mode === 'night' ? 'Night Mode' : 'Day Mode'}
            </span>
            <button
              type="button"
              role="switch"
              onClick={toggleDayNight}
              aria-checked={mode === 'night'}
              aria-label="Toggle day/night mode"
              className="relative h-20 w-35 shrink-0 rounded-full border border-paper bg-smoke/5 backdrop-blur-[1px] block cursor-pointer"
            >
              <span
                className={`absolute top-1/2 size-12 -translate-y-1/2 rounded-full bg-paper transition-[left] duration-300 ease-out ${
                  mode === 'night' ? 'left-19' : 'left-4'
                }`}
              />
            </button>
          </>
        )}
        <Button as="a" href="#" variant="glass" color="paper" className='max-1024:hidden! 1024:text-13! tracking-10!'>
          Book Your Stay
        </Button>
      </Stack>
    </Container>

    <div
      aria-hidden={!stickyVisible}
      className={`fixed inset-x-0 top-0 992:top-0 z-30 h-86 bg-paper/98 shadow-[0.5px_0.5px_0.5px_0px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out ${
        stickyVisible ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
      }`}
    >
      <Container as="nav" className="flex h-full items-center justify-between px-25 992:px-35">
        <Stack direction="row" align="center" gap={25} tabletGap={25} mobileGap={25}>
          <button type="button" onClick={toggle} aria-label="Open menu" className="cursor-pointer">
            <MenuIcon className="h-10 w-20 text-brand" />
          </button>
          <ul className="group/navlist flex items-center gap-25 font-body text-14 leading-12 tracking-10 text-brand uppercase max-1024:hidden">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <NavLink href={href ?? '#'}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </Stack>

        <Link href="/" aria-label="The President Hotel, Cape Town" className="block h-62 w-115 absolute left-1/2 -translate-x-1/2">
          <LogoSticky className="h-full w-full text-brand" />
        </Link>

        <Button variant="solid" color="brand" className="max-1024:hidden!">
          Book Your Stay
        </Button>
      </Container>
    </div>
    </>
  )
}
