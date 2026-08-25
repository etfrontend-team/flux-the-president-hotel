import Link from 'next/link'
import React from 'react'

import { LogoMark, MenuIcon } from '@/components/icons'
import { Button, Container, Stack } from '@/components/ui'

const navLinks = ['Stay', 'Experiences', 'Wellness', 'taste', 'Offers']

const underlineClasses =
  "before:absolute before:inset-x-0 before:bottom-0 before:h-px before:origin-left before:scale-x-0 before:bg-current before:transition-transform before:duration-[735ms] before:ease-[cubic-bezier(0.625,0.05,0,1)] before:content-[''] " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[735ms] after:ease-[cubic-bezier(0.625,0.05,0,1)] after:content-[''] " +
  'hover:before:origin-right hover:before:delay-100 hover:after:origin-left hover:after:scale-x-100 hover:after:delay-100'

/**
 * Nav link matching reschio.com's hover: a two-sided underline sweep (grows
 * in from the left, exits to the right) plus the label rolling up to a
 * duplicate copy underneath.
 */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className={`group/link relative inline-block pb-4 ${underlineClasses}`}>
      <span className="block h-[1.2em] overflow-hidden">
        <span className="flex flex-col transition-transform duration-300 ease-out group-hover/link:-translate-y-1/2">
          <span className="flex h-[1.2em] items-center">{children}</span>
          <span aria-hidden="true" className="flex h-[1.2em] items-center">
            {children}
          </span>
        </span>
      </span>
    </a>
  )
}

/**
 * Transparent site header, overlaid on the hero image. The day/night toggle
 * is homepage-only per Figma annotation and is currently decorative — no
 * theming logic is wired up yet.
 */
export function Header() {
  return (
    <Container
      as="header"
      className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-24 px-25 py-32 992:px-35 992:py-17"
    >
      <Stack as="nav" direction="row" align="center" gap={25} mobileGap={25} className="flex mt-27 1024:mt-28">
        <MenuIcon className="h-10 w-20 text-paper" />
        <Stack
          as="ul"
          direction="row"
          align="center"
          gap={25}
          mobileGap={25}
          className="max-1024:hidden font-body text-14 leading-12 tracking-[1.4px] text-paper uppercase"
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
        className="block h-auto w-64 1199:w-115 mx-auto"
      >
        <LogoMark className="h-auto w-full text-paper" />
      </Link>

      <Stack direction="row" align="center" gap={20} mobileGap={15} className="1024:ml-auto max-w-476 mt-17 1024:mt-13">
        <span className="font-body text-14 leading-12 tracking-[1.4px] text-paper uppercase sm:inline">
          Day Mode
        </span>
        <button
          type="button"
          role="switch"
          aria-checked="false"
          aria-label="Toggle day/night mode"
          className="relative h-20 w-35 shrink-0 rounded-full border border-paper bg-smoke/5 backdrop-blur-[1px] block"
        >
          <span className="absolute top-1/2 left-4 size-12 -translate-y-1/2 rounded-full bg-paper" />
        </button>
        <Button as="a" href="#" variant="glass" color="paper" className='max-1024:!hidden'>
          Book Your Stay
        </Button>
      </Stack>
    </Container>
  )
}
