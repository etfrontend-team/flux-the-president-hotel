import React from 'react'

import { cn } from '@/lib/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingColor = 'brand' | 'paper' | 'ink'

interface HeadingProps {
  /** Semantic heading level (h1–h6). */
  level?: HeadingLevel
  /** Visual size, decoupled from semantics. Defaults to match `level`. */
  size?: HeadingLevel
  color?: HeadingColor
  uppercase?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

const colorMap: Record<HeadingColor, string> = {
  brand: 'text-brand',
  paper: 'text-paper',
  ink: 'text-ink',
}

const sizeMap: Record<HeadingLevel, string> = {
  1: 'text-40 992:text-55 leading-display',
  2: 'text-40 leading-display 992:text-45',
  3: 'text-30 leading-display 992:text-35',
  4: 'text-24 leading-display 992:text-25',
  5: 'text-15 leading-copy 992:text-20',
  6: 'text-18 leading-28',
}

/**
 * Display heading using the brand display font. `level` controls the
 * semantic tag (for accessibility/SEO); `size` controls the visual scale
 * independently.
 */
export function Heading({
  level = 2,
  size,
  color = 'brand',
  uppercase = true,
  className,
  style,
  children,
}: HeadingProps) {
  const Tag = `h${level}` as React.ElementType
  return (
    <Tag
      style={style}
      className={cn(
        'font-display font-light tracking-5 text-balance',
        sizeMap[size ?? level],
        colorMap[color],
        uppercase && 'uppercase',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
