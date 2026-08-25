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
