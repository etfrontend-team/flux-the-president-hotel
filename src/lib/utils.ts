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
 * screen. Shared by Header's sticky reveal bar and AnnouncementBar so both
 * hide/reposition consistently while a hero is in view.
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

const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|mov|m4v)$/i

/**
 * A section's `media` field may point to either a still image or a
 * background video — detected by file extension. Shared by CoreExperience
 * and any other section with the same video-or-image background pattern.
 */
export function isVideoSrc(src: string) {
  return VIDEO_EXTENSION_PATTERN.test(src)
}

/**
 * True once the hero (`[data-hero]`) has scrolled up until only the given
 * fraction of its own height (default 10%) remains visible above the fold.
 * Shared by BookingBarOverlay (fades out at this point) and BookingTab
 * (hands off at the same point on desktop) so they switch in sync.
 */
export function isHeroMostlyScrolledPast(visibleFraction = 0.5) {
  const hero = document.querySelector('[data-hero]')
  if (!hero) return false
  const rect = hero.getBoundingClientRect()
  return rect.bottom <= rect.height * visibleFraction
}
