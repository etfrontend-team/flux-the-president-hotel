import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'link' | 'outlined' | 'glass' | 'solid'
type ButtonColor = 'brand' | 'paper' | 'ink' | 'white'

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
  },
  outlined: {
    brand: 'btn-outlined-brand',
    paper: 'btn-outlined-paper',
    white: 'btn-outlined-white',
    ink: 'btn-outlined-ink',
  },
  glass: {
    brand: 'btn-glass-brand',
    paper: 'btn-glass-paper',
    white: 'btn-glass-white',
    ink: 'btn-glass-ink',
  },
  solid: {
    brand: 'btn-solid-brand',
    paper: 'btn-solid-paper',
    white: 'btn-solid-white',
    ink: 'btn-solid-ink',
  },
}

/**
 * Brand button. Renders a <button> by default, or a Link when `as="a"` is set
 * (use for links styled as buttons). `variant` picks the shape (outlined
 * border vs. plain underline link), `color` picks which brand token drives
 * it. Shape/colour classes live in component.css (border-image assets for
 * the outlined border are per-colour SVGs in /public).
 *
 * `glass` and `solid` are exact mirrors of each other — `glass` starts as a
 * blurred outline (muted border) and crossfades to a solid fill on hover;
 * `solid` starts filled and crossfades to that same blurred outline.
 *
 * The label rolls on hover: two stacked copies slide up by half their
 * combined height, revealing the second — independent of the background
 * crossfade already handled by the variant classes above. Skipped for
 * `variant="link"`, which already has its own underline hover effect.
 */
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
