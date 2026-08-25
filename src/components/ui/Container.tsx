import React from 'react'

import { cn } from '@/lib/utils'

type ContainerVariant = 'sm' | 'md' | 'lg' | 'xl'

interface ContainerProps {
  as?: React.ElementType
  variant?: ContainerVariant
  className?: string
  children: React.ReactNode
}

const base = 'max-w-full w-full'

const variants: Record<ContainerVariant, string> = {
  sm: '992:px-24 px-19',
  md: '1199:px-76 992:px-40 px-24',
  lg: '1199:px-100 992:px-76 px-24',
  xl: '1199:px-124 992:px-76 px-24',
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
