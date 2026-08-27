import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * `text-{n}`/`rounded-{n}` (css/utilities.css `@utility` rules — dynamic px font-size /
 * border-radius from any integer) share their prefix with Tailwind's built-in `text-{color}`
 * and `rounded-{keyword}` groups. Without this, tailwind-merge treats e.g. `text-14 text-brand`
 * as the same conflicting group and silently drops one of the two.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [(value: string) => /^\d+$/.test(value)] }],
      rounded: [{ rounded: [(value: string) => /^\d+$/.test(value)] }],
    },
  },
})

/**
 * Merge Tailwind class names, resolving conflicts so later classes win
 * (e.g. cn('p-2', 'p-4') → 'p-4'). Use in every primitive to allow callers
 * to override default styling via a `className` prop.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * True while any full-viewport hero section (`[data-hero]`) is still on
 * screen. Shared by StickyNav and AnnouncementBar so both hide/reposition
 * consistently while a hero is in view.
 */
export function isHeroInView() {
  const hero = document.querySelector('[data-hero]')
  return hero !== null && hero.getBoundingClientRect().bottom > 0
}

/**
 * True while any full-viewport pinned/fixed-scroll section (`[data-pinned-section]`,
 * e.g. CoreExperience's tabbed scrollytelling block) is currently on screen.
 * Per Figma annotation: "the nav bar and Best Rates Guaranteed banner should
 * not be visible on this component, or any similar to it" — so any future
 * section using the same pinned-scroll pattern just needs this attribute to
 * get the same treatment, without AnnouncementBar knowing about it by name.
 */
export function isPinnedSectionInView() {
  const sections = document.querySelectorAll('[data-pinned-section]')
  for (const section of sections) {
    const rect = section.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return true
  }
  return false
}

/**
 * Scroll distance (px) past which the overlay BookingBar hands off to the
 * compact BookingTab — matches the reference site's own threshold
 * (reschio.com/hotel, measured via its computed `show` class toggle), which
 * fires almost immediately on scroll rather than waiting for the hero to
 * clear the viewport.
 */
export const BOOKING_TAB_SCROLL_THRESHOLD = 80
