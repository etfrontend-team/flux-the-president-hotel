'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { useDayNight } from '@/components/DayNightContext'
import { LogoMark, MenuIcon } from '@/components/icons'
import { useMegaMenu } from '@/components/MegaMenuContext'
import { Button, Container, Stack } from '@/components/ui'

const navLinks = ['Stay', 'Experiences', 'Wellness', 'taste', 'Offers']

const underlineClasses =
  "before:absolute before:inset-x-0 before:bottom-0 before:h-px before:origin-left before:scale-x-0 before:bg-current before:transition-transform before:duration-[735ms] before:ease-[cubic-bezier(0.625,0.05,0,1)] before:content-[''] " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[735ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] after:content-[''] " +
  'hover:before:origin-right hover:before:delay-100 hover:after:origin-left hover:after:scale-x-100 hover:after:delay-100'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`group/link relative inline-block py-4 transition-opacity duration-300 group-hover/navlist:opacity-50 hover:!opacity-100 ${underlineClasses}`}
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

  return (
    <Container
      as="header"
      className="w-auto absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-24 max-992:mx-15 mx-25 max-992:px-25 992:px-35 py-17"
    >
      <Stack as="nav" direction="row" align="center" gap={25} mobileGap={25} className="mt-27 1024:mt-28">
        <button type="button" onClick={toggle} aria-label="Open menu" className="cursor-pointer">
          <MenuIcon className="h-10 w-20 text-paper" />
        </button>
        <Stack
          as="ul"
          direction="row"
          align="center"
          gap={25}
          mobileGap={25}
          className="group/navlist max-1024:hidden font-body text-14 leading-12 tracking-[1.4px] text-paper uppercase"
        >
          {navLinks.map((label) => (
            <li key={label}>
              <NavLink href="#">{label}</NavLink>
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
        <Button as="a" href="#" variant="glass" color="paper" className='max-1024:!hidden'>
          Book Your Stay
        </Button>
      </Stack>
    </Container>
  )
}
