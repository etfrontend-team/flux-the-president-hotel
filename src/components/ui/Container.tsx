import React from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

/**
 * Centres content with a max width and responsive horizontal padding.
 * The standard outer wrapper for page sections.
 */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full max-w-6xl px-6 md:px-8', className)}>{children}</Tag>
}
