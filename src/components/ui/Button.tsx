import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'link' | 'outlined' | 'glass' | 'solid'
type ButtonColor = 'brand' | 'paper' | 'ink' | 'white' | 'muted'

type ButtonProps = {
  variant?: ButtonVariant
  color?: ButtonColor
  className?: string
} & (
  | ({ as?: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'a' } & React.ComponentProps<typeof Link>)
)

const variants: Record<ButtonVariant, string> = {
  link: 'btn-link',
  outlined: 'btn-outlined',
  glass: 'btn-glass',
  solid: 'btn-solid',
}

const variantColors: Record<ButtonVariant, Record<ButtonColor, string>> = {
  link: {
    brand: 'btn-link-brand',
    paper: 'btn-link-paper',
    white: 'btn-link-white',
    ink: 'btn-link-ink',
    muted: 'btn-link-muted',
  },
  outlined: {
    brand: 'btn-outlined-brand',
    paper: 'btn-outlined-paper',
    white: 'btn-outlined-white',
    ink: 'btn-outlined-ink',
    muted: 'btn-outlined-muted',
  },
  glass: {
    brand: 'btn-glass-brand',
    paper: 'btn-glass-paper',
    white: 'btn-glass-white',
    ink: 'btn-glass-ink',
    muted: 'btn-glass-muted',
  },
  solid: {
    brand: 'btn-solid-brand',
    paper: 'btn-solid-paper',
    white: 'btn-solid-white',
    ink: 'btn-solid-ink',
    muted: 'btn-solid-muted',
  },
}

export function Button({
  variant = 'outlined',
  color = 'brand',
  className,
  as = 'button',
  children,
  ...props
}: ButtonProps) {
  const classes = cn('group', variants[variant], variantColors[variant]?.[color], className)

  const label =
    variant === 'link' ? (
      children
    ) : (
      <span className="h-20 overflow-hidden">
        <span className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
          <span className="flex h-20 items-center">{children}</span>
          <span aria-hidden="true" className="flex h-20 items-center">
            {children}
          </span>
        </span>
      </span>
    )

  if (as === 'a') {
    return (
      <Link className={classes} {...(props as React.ComponentProps<typeof Link>)}>
        {label}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {label}
    </button>
  )
}
