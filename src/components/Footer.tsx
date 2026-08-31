import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/icons'
import { Container } from '@/components/ui'
import { cn } from '@/lib/utils'

/** Per Figma (node 1:5681): each column's default resting opacity is 80%, dims
 * to 50% when a sibling in the same list is hovered, and the hovered item
 * itself snaps to 100% — same group-hover mechanic as the header/mega menu NavLink. */
const navColumns: { title: string; links: string[] }[] = [
  { title: 'Stay', links: ['Rooms', 'Apartments', 'Suites', 'Pets', 'Offers'] },
  {
    title: 'Dine',
    links: ['The Base', 'Restaurant & Terrace', 'Botany Café', 'The Senate', 'The Deck', 'Poolside'],
  },
  { title: 'Discover', links: ['Experiences', 'Wellness & Spa', 'Events', "What's On", 'Location'] },
  { title: 'The Hotel', links: ['About Us', 'Careers', 'Sustainability', 'FAQs', 'Gallery', 'Loyalty'] },
]

const partnerLogos = [
  { src: '/images/logo-preferred-pride.webp', alt: 'Preferred Pride', className: 'h-30 w-auto 992:h-49' },
  { src: '/images/logo-preferred-hotels.svg', alt: 'Preferred Hotels & Resorts', className: 'h-21 w-auto 992:h-34' },
  { src: '/images/logo-i-prefer.svg', alt: 'I Prefer Hotel Rewards', className: 'h-20 w-auto 992:h-33' },
  { src: '/images/logo-green-key.png', alt: 'Green Key certified', className: 'h-25 w-auto 992:h-42' },
  { src: '/images/logo-stay-green.webp', alt: 'Stay Green at The President', className: 'h-35 w-auto 992:h-59' },
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

/** Thin divider matching Figma's "Line 28" — 30%-opacity paper stroke, capped to the content width. */
function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-paper/30', className)} />
}

/**
 * Site footer. Per Figma (node 1:5681): a rounded brand-navy card holding the
 * logo, nav columns and partner badges, with the copyright line sitting
 * outside it on the page's plain paper background.
 */
export function Footer() {
  return (
    <footer data-footer className="relative">
      <div className="relative overflow-hidden rounded-card bg-brand max-992:m-15 max-992:mb-0 m-25 mb-0">
        <Image
          src="/images/footer-illustration.webp"
          alt=""
          aria-hidden="true"
          fill
          className="pointer-events-none object-cover opacity-10 mix-blend-multiply"
        />

        <Container
          className="relative flex flex-col items-center max-992:px-25 max-992:py-50 pt-54 pb-40 992:px-35"
        >
          {/* Cropped to just the emblem — same box Figma clips against the full lockup. */}
          <div className="relative h-83 w-153 overflow-hidden">
            <Image
              src="/images/logo-mark-white.webp"
              alt="The President Hotel, Cape Town"
              width={235}
              height={304}
              className="absolute left-[-26.54%] top-[-74.65%] h-[363.55%] w-[153.09%] max-w-none"
            />
          </div>

          <Divider className="max-992:my-50 mt-52 mb-50" />

          <div className="flex flex-col items-center justify-around gap-50 w-full 992:flex-row 992:items-start 992:gap-y-0">
            {navColumns.map((column) => (
              <div
                key={column.title}
                className="group/navlist flex flex-col items-center gap-25 text-15 leading-12 tracking-10 text-paper 992:items-start 992:gap-20"
              >
                <p className="w-full text-center font-normal uppercase 992:w-auto 992:text-left">
                  {column.title}
                </p>
                <ul className="flex flex-wrap justify-center gap-x-16 gap-y-18 text-14 tracking-10 font-light capitalize 992:flex-col 992:flex-nowrap 992:justify-start 992:items-start 992:gap-15 992:text-15 992:tracking-10">
                  {column.links.map((label) => (
                    <li key={label} className="whitespace-nowrap">
                      <Link
                        href="#"
                        className="opacity-80 transition-opacity duration-300 group-hover/navlist:opacity-50 hover:!opacity-100"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col items-center gap-25 text-15 leading-12 tracking-10 text-paper 992:items-start 992:gap-20">
              <p className="w-full text-center font-normal uppercase 992:w-auto 992:text-left">Contact</p>
              <div className="flex flex-col items-center gap-18 text-14 leading-copy font-light tracking-5 text-white 992:items-start 992:gap-15">
                <div className="flex items-center gap-15 992:flex-col 992:items-start">
                  <Link href="tel:+27214348111" className="whitespace-nowrap opacity-80 hover:opacity-100">
                    +27 21 434 8111
                  </Link>
                  <Link
                    href="mailto:hello@presidenthotel.co.za"
                    className="whitespace-nowrap opacity-80 hover:opacity-100"
                  >
                    hello@presidenthotel.co.za
                  </Link>
                </div>
                <p className="text-center opacity-80 992:max-w-165 992:text-left">
                  Sea Point Promenade, Cape Town
                </p>
              </div>
            </div>
          </div>

          <Divider className="max-992:mt-50 max-992:mb-30 mt-70 mb-40" />

          <div className="flex w-full max-w-content flex-col items-center gap-30 992:flex-row 992:flex-wrap 992:justify-around 992:gap-y-20 992:gap-x-30">
            <div className="order-3 flex items-center gap-35 text-12 leading-12 tracking-10 text-paper font-light capitalize 992:order-0">
              <Link href="/privacy-policy" className="hover:opacity-70">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:opacity-70">
                Terms &amp; Conditions
              </Link>
            </div>

            <div className="order-1 flex flex-wrap items-center justify-center gap-x-25 1199:gap-x-40 gap-y-15 992:order-0">
              {partnerLogos.map(({ src, alt, className }) => (
                <img key={src} src={src} alt={alt} className={className} />
              ))}
            </div>

            <div className="order-2 flex items-center gap-16 992:order-0">
              {socialLinks.map(({ label, Icon }) => (
                <Link key={label} href="#" aria-label={label} className="text-paper hover:opacity-70">
                  <Icon className="size-16" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <p className="max-992:pt-15 py-25 text-center text-12 leading-12 tracking-10 text-brand font-normal capitalize">
        © 2026 The President Hotel. All rights reserved.
      </p>
    </footer>
  )
}
