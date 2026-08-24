import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names, resolving conflicts so later classes win
 * (e.g. cn('p-2', 'p-4') → 'p-4'). Use in every primitive to allow callers
 * to override default styling via a `className` prop.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
