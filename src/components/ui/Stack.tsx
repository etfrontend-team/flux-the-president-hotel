import React from 'react'

import { cn } from '@/lib/utils'

type StackProps = {
  as?: React.ElementType
  /** Layout direction. Defaults to vertical. */
  direction?: 'row' | 'col'
  /** Gap between items, mapped to Tailwind's spacing scale (e.g. 4 → gap-4). */
  gap?: 2 | 4 | 6 | 8 | 12
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between'
  className?: string
  children: React.ReactNode
}

const gapMap: Record<NonNullable<StackProps['gap']>, string> = {
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
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
  gap = 4,
  align,
  justify,
  className,
  children,
}: StackProps) {
  return (
    <Tag
      className={cn(
        'flex',
        direction === 'col' ? 'flex-col' : 'flex-row',
        gapMap[gap],
        align && alignMap[align],
        justify && justifyMap[justify],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
