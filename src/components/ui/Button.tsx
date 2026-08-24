import React from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  variant?: ButtonVariant
  className?: string
} & (
  | ({ as?: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'a' } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
)

const base =
  'inline-flex items-center justify-center rounded-card px-5 py-2.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-paper hover:bg-brand-muted',
  secondary: 'border border-brand text-brand hover:bg-brand hover:text-paper',
  ghost: 'text-brand hover:bg-brand/10',
}

/**
 * Brand button. Renders a <button> by default, or an <a> when `as="a"` is set
 * (use for links styled as buttons). Variants are driven by the brand tokens.
 */
export function Button({ variant = 'primary', className, as = 'button', ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className)

  if (as === 'a') {
    return <a className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} />
  )
}
