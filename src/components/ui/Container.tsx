import React from 'react'

import { cn } from '@/lib/utils'

type ContainerVariant = 'sm' | 'lg'

interface ContainerProps {
  as?: React.ElementType
  variant?: ContainerVariant
  className?: string
  children: React.ReactNode
}

const base = 'max-w-full w-full'

const variants: Record<ContainerVariant, string> = {
  sm: '992:px-24 px-19',
  lg: '992:px-60 px-26',
}

/** Full-width wrapper with responsive edge padding (no max-width cap). */
export function Container({
  as: Tag = 'div',
  variant = 'sm',
  className,
  children,
}: ContainerProps) {
  return <Tag className={cn(base, variants[variant], className)}>{children}</Tag>
}
