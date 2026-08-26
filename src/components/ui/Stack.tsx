import React from 'react'

import { cn } from '@/lib/utils'

type StackDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse' | 'wrap'

interface StackProps {
  as?: React.ElementType
  /** Layout direction. Defaults to vertical. */
  direction?: StackDirection
  /** Mobile direction (≤992). Defaults to `direction`. */
  mobileDirection?: StackDirection
  /** Desktop gap in px. Defaults to 32. */
  gap?: number
  /** Tablet gap in px (1025–1199). Defaults to `gap`. */
  tabletGap?: number
  /** Mobile gap in px (≤992). Defaults to 24. */
  mobileGap?: number
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between'
  className?: string
  children: React.ReactNode
}

const directionMap: Record<StackDirection, string> = {
  col: 'flex-col',
  row: 'flex-row',
  wrap: 'flex-wrap',
  'col-reverse': 'flex-col-reverse',
  'row-reverse': 'flex-row-reverse',
}

const mobileDirectionMap: Record<StackDirection, string> = {
  col: 'max-992:flex-col max-1199:flex-col',
  row: 'max-992:flex-row max-1199:flex-row',
  wrap: 'max-992:flex-wrap max-1199:flex-wrap',
  'col-reverse': 'max-992:flex-col-reverse max-1199:flex-col-reverse',
  'row-reverse': 'max-992:flex-row-reverse max-1199:flex-row-reverse',
}

const alignMap: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifyMap: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

/**
 * Flexbox layout primitive for spacing items consistently. Prefer this over
 * ad-hoc margins so spacing stays driven by the design scale.
 */
export function Stack({
  as: Tag = 'div',
  direction = 'col',
  mobileDirection,
  gap = 32,
  tabletGap,
  mobileGap = 24,
  align,
  justify,
  className,
  children,
}: StackProps) {
  return (
    <Tag
      style={
        {
          '--gap': `${gap}px`,
          '--gap-tablet': `${tabletGap ?? gap}px`,
          '--gap-mobile': `${mobileGap}px`,
        } as React.CSSProperties
      }
      className={cn(
        'flex stack-gap',
        directionMap[direction],
        mobileDirection && mobileDirectionMap[mobileDirection],
        align && alignMap[align],
        justify && justifyMap[justify],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
