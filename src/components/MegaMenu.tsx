'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { NavLink } from '@/components/Header'
import {
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LogoMark,
  PinterestIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/icons'
import { useMegaMenu } from '@/components/MegaMenuContext'
import { Button, Container, Stack } from '@/components/ui'

type ImageKey = 'stay' | 'taste' | 'wellness'

const images: Record<ImageKey, { src: string; alt: string }> = {
  stay: { src: '/images/menu-stay.jpg', alt: 'A guest room at The President Hotel' },
  taste: { src: '/images/menu-taste.jpg', alt: 'Dining on the terrace at The President Hotel' },
  wellness: { src: '/images/menu-wellness.jpg', alt: 'The Sea Point coastline near the hotel' },
}

/**
 * All 9 primary menu links — hovering any of these scrolls the right-hand
 * image strip so that item's photo centers in the panel (per Figma
 * annotation on node 1:2716 and the live-site reference at
 * presidenthotel.co.za). Only 3 distinct photos exist so far, so they
 * repeat in a cycle across the 9 links.
 */
const primaryLinks: { label: string; image: ImageKey; href?: string }[] = [
  { label: 'Stay', image: 'stay', href: '/stay' },
  { label: 'Experiences', image: 'taste', href: '/experiences' },
  { label: 'Wellness', image: 'wellness', href: '/wellness' },
  { label: 'taste', image: 'stay', href: '/taste' },
  { label: 'Offers', image: 'taste', href: '/offers' },
  { label: 'About', image: 'wellness', href: '/about' },
  { label: 'Events', image: 'stay', href: '/events' },
  { label: "What's On", image: 'taste', href: '/whatson' },
  { label: 'Location', image: 'wellness', href: '/location' },
]

/** Height/gap of one slot in the hover image strip below — keep in sync with the `h-350`/`gap-30` classes on each slot. */
const IMAGE_SLOT_HEIGHT = 350
const IMAGE_SLOT_GAP = 30

/** Wraps the strip with the last/first items cloned at each end, so there's always a peek image above and below, even at the list's boundaries. */
const filmstripItems = [primaryLinks[primaryLinks.length - 1], ...primaryLinks, primaryLinks[0]]

/** `href: '#'` marks pages that don't exist yet — wire them up as soon as that page is built. */
const utilityLinks: { label: string; href: string }[] = [
  { label: 'Careers', href: '/careers' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Loyalty', href: '/loyalty' },
]

const socialLinks = [
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'TikTok', Icon: TikTokIcon },
  { label: 'LinkedIn', Icon: LinkedInIcon },
  { label: 'YouTube', Icon: YouTubeIcon },
  { label: 'X', Icon: XIcon },
  { label: 'Pinterest', Icon: PinterestIcon },
  { label: 'Instagram', Icon: InstagramIcon },
]

/** Panel reveal duration (ms) — keep in sync with the `duration-500` class on the panel below. */
const REVEAL_MS = 500

/** Gap between each item's turn in the opening cascade (primary links, then utility links, then Contact, then socials). Closing skips the stagger — all items fade out together — so it stays quick. */
const STAGGER_STEP_MS = 30
/** Fade duration (ms) for each content block — keep in sync with the `duration-400` classes below. */
const CONTENT_FADE_MS = 400
/** index within the whole cascade: primary links, then utility links, then the Contact block, then the socials row. */
const utilityStartIndex = primaryLinks.length
const contactIndex = primaryLinks.length + utilityLinks.length
const socialsIndex = contactIndex + 1
/** Mobile-only "Book Your Stay" button (per Figma node 1:3226) — last in the cascade. */
const bookButtonIndex = socialsIndex + 1
/** How long the close sequence waits for content to fade out before collapsing the panel — just the fade duration, since closing has no stagger. */
const CONTENT_CLOSE_MS = CONTENT_FADE_MS

/** Full-screen site menu. Per Figma (node 1:2716): hovering a primary category swaps the right-hand preview image. */
export function MegaMenu() {
  const { isOpen, close } = useMegaMenu()
  const [activeIndex, setActiveIndex] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  const [contentOpen, setContentOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reveals the custom scrollbar thumb only while the panel is actively
  // being wheel-scrolled, hiding it again shortly after scrolling stops.
  function handlePanelScroll() {
    setIsScrolling(true)
    if (scrollHideTimer.current) clearTimeout(scrollHideTimer.current)
    scrollHideTimer.current = setTimeout(() => setIsScrolling(false), 800)
  }

  useEffect(() => {
    return () => {
      if (scrollHideTimer.current) clearTimeout(scrollHideTimer.current)
    }
  }, [])

  // Staggered on the way in (cascadeIndex apart), but all items fade out
  // together on the way out — keeps closing quick instead of waiting on a
  // reverse cascade before the panel can start collapsing.
  function contentDelay(cascadeIndex: number) {
    return contentOpen ? `${cascadeIndex * STAGGER_STEP_MS}ms` : '0ms'
  }

  // Sequences the two-stage animation: opening reveals the panel first, then
  // fades the content in; closing fades the content out first, then collapses
  // the panel — never both at once.
  useEffect(() => {
    if (isOpen) {
      setPanelOpen(true)
      const timer = setTimeout(() => setContentOpen(true), REVEAL_MS)
      return () => clearTimeout(timer)
    }

    setContentOpen(false)
    const timer = setTimeout(() => setPanelOpen(false), CONTENT_CLOSE_MS)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, close])

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-40 bg-paper transition-[clip-path] duration-700 ease-in-out ${
        panelOpen
          ? 'pointer-events-auto [clip-path:inset(0_0%_0_0)]'
          : 'pointer-events-none [clip-path:inset(0_100%_0_0)]'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full opacity-15 bg-[linear-gradient(to_bottom,rgba(255,252,249,1)_0%,rgba(255,252,249,0)_100%),linear-gradient(to_bottom,rgba(255,252,249,0)_0%,rgba(255,252,249,1)_100%)]"
      />
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-15"
        src="/images/menu-bg-shadow.mp4"
      />

      <Container as="nav" aria-label="Site menu" className="relative flex h-full 1024:flex-row p-0 992:p-0">
        <div className="flex flex-wrap items-start justify-between w-full absolute top-42 left-0 shrink-0 px-44 max-425:px-25 z-1 1199:pl-129 1199:pr-60">
          <button
            type="button"
            onClick={close}
            className="flex cursor-pointer items-center gap-9 text-ink max-1024:mt-22 mt-37"
          >
            <CloseIcon className="size-12" />
            <span className="font-body text-15 leading-12 font-light tracking-10 uppercase">
              close
            </span>
          </button>

          <Link
            href="/"
            onClick={close}
            aria-label="The President Hotel, Cape Town"
            className="block relative max-1024:absolute! max-1024:left-1/2 max-1024:top-0 max-1024:-translate-x-1/2 h-137 w-115"
          >
            <LogoMark className="h-full w-full text-brand" />
          </Link>

          <Button
            as="a"
            href="#"
            onClick={close}
            variant="glass"
            color="paper"
            className="max-1024:hidden! mt-13"
          >
            Book Your Stay
          </Button>
        </div>
        <div
          onScroll={handlePanelScroll}
          className={`megamenu-scroll flex w-full flex-col overflow-y-auto mt-249 1024:mt-167 ${
            isScrolling ? 'is-scrolling' : ''
          }`}
        >
          <div className="flex flex-1 flex-col justify-center px-40 max-425:px-25 py-40 max-1024:gap-0 992:px-131">
            <Stack
              gap={33}
              tabletGap={33}
              mobileGap={33}
              className="max-1024:flex-row max-1024:justify-start max-1024:mb-50 mb-47"
            >
              <ul className="group/navlist flex flex-col gap-30 font-body text-18 leading-12 font-normal tracking-10 text-brand uppercase">
                {primaryLinks.map((item, index) => (
                  <li
                    key={item.label}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`transition-[opacity,transform] duration-400 ease-out ${
                      contentOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                    style={{ transitionDelay: contentDelay(index) }}
                  >
                    <NavLink href={item.href ?? '#'} onClick={close}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>

              <ul className="group/navlist flex flex-col gap-25 font-body text-15 leading-12 font-light tracking-10 text-ink capitalize max-1024:mx-auto">
                {utilityLinks.map((link, index) => (
                  <li
                    key={link.label}
                    className={`transition-[opacity,transform] duration-400 ease-out ${
                      contentOpen ? 'translate-y-0 opacity-80' : 'translate-y-20 opacity-0'
                    }`}
                    style={{ transitionDelay: contentDelay(utilityStartIndex + index) }}
                  >
                    <NavLink href={link.href} onClick={close}>{link.label}</NavLink>
                  </li>
                ))}
              </ul>
            </Stack>

            <Stack
              gap={33}
              tabletGap={33}
              mobileGap={33}
              className={`mb-30 transition-[opacity,transform] duration-400 ease-out ${
                contentOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: contentDelay(contactIndex) }}
            >
              <Link
                href="/contactus"
                onClick={close}
                className="font-body text-18 leading-12 font-normal tracking-10 text-brand uppercase hover:opacity-70"
              >
                Contact
              </Link>
              <Stack gap={20} tabletGap={20} mobileGap={20} className="font-body text-13 leading-muted font-light tracking-5 text-ink">
                <Link href="tel:+27214348111" onClick={close} className="hover:opacity-70">
                  +27 21 434 8111
                </Link>
                <Link href="mailto:reservations@thepresident.co.za" onClick={close} className="hover:opacity-70">
                  reservations@thepresident.co.za
                </Link>
                <p className="max-w-213">Sea Point Promenade, Cape Town</p>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              align="center"
              gap={13}
              tabletGap={13}
              mobileGap={13}
              className={`max-1024:mb-50 text-brand transition-[opacity,transform] duration-400 ease-out ${
                contentOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: contentDelay(socialsIndex) }}
            >
              {socialLinks.map(({ label, Icon }) => (
                <Link key={label} href="#" onClick={close} aria-label={label} className="hover:opacity-70">
                  <Icon className="size-13" />
                </Link>
              ))}
            </Stack>

            <Button
              as="a"
              href="#"
              onClick={close}
              variant="solid"
              color="brand"
              className={`w-full 1024:hidden! transition-[opacity,transform] duration-400 ease-out ${
                contentOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: contentDelay(bookButtonIndex) }}
            >
              Book Your Stay
            </Button>
          </div>
        </div>

        <div className="relative hidden h-full w-466 shrink-0 overflow-hidden rounded-l-card 1024:block">
          <Stack
            gap={30}
            tabletGap={30}
            mobileGap={30}
            className="absolute inset-x-0 top-1/2 transition-transform duration-500 ease-out"
            style={{
              transform: `translateY(-${
                (activeIndex + 1) * (IMAGE_SLOT_HEIGHT + IMAGE_SLOT_GAP) + IMAGE_SLOT_HEIGHT / 2
              }px)`,
            }}
          >
            {filmstripItems.map((item, index) => (
              <div key={index} className="relative h-350 w-full shrink-0 rounded-5 overflow-hidden">
                <Image
                  src={images[item.image].src}
                  alt={images[item.image].alt}
                  fill
                  sizes="466px"
                  className="object-cover"
                />
              </div>
            ))}
          </Stack>
        </div>
      </Container>
    </div>
  )
}
