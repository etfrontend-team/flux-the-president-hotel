import React from 'react'

import { cn } from '@/lib/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type HeadingProps = {
  /** Semantic heading level (h1–h6). */
  level?: HeadingLevel
  /** Visual size, decoupled from semantics. Defaults to match `level`. */
  size?: HeadingLevel
  className?: string
  children: React.ReactNode
}

const sizeMap: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-6xl',
  2: 'text-3xl md:text-5xl',
  3: 'text-2xl md:text-4xl',
  4: 'text-xl md:text-2xl',
  5: 'text-lg md:text-xl',
  6: 'text-base md:text-lg',
}

/**
 * Display heading using the brand display font. `level` controls the semantic
 * tag (for accessibility/SEO); `size` controls the visual scale independently.
 */
export function Heading({ level = 2, size, className, children }: HeadingProps) {
  const Tag = `h${level}` as React.ElementType
  return (
    <Tag
      className={cn(
        'font-display text-ink font-semibold tracking-tight text-balance',
        sizeMap[size ?? level],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
