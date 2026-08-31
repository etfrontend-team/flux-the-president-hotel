import React from 'react'

import { cn } from '@/lib/utils'

type ContainerVariant = 'sm' | 'lg'

interface ContainerProps {
  as?: React.ElementType
  variant?: ContainerVariant
  className?: string
  children: React.ReactNode
  [key: `aria-${string}`]: unknown
  [key: `data-${string}`]: unknown
  id?: string
  role?: string
}

const base = 'max-w-full w-full'

const variants: Record<ContainerVariant, string> = {
  sm: '992:px-26 px-15',
  lg: '992:px-60 px-26',
}

/**
 * Full-width wrapper with responsive edge padding (no max-width cap).
 * Forwards `aria-*`/`data-*`/`id`/`role` to the underlying element (e.g.
 * `as="nav" aria-label="..."`) — those aren't in the destructured list
 * below, so without this explicit pass-through they'd be silently dropped.
 */
export function Container({
  as: Tag = 'div',
  variant = 'sm',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Tag>
  )
}
