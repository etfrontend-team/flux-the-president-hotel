'use client'

import React from 'react'

import { MinusIcon, PlusIcon } from '@/components/icons'

type GuestStepperProps = {
  label: string
  /** Text/icon color — 'paper' for the glass overlay bar (desktop), 'brand' for the plain outlined bar (mobile). */
  color?: 'paper' | 'brand'
}

/** Increment/decrement counter for the booking bar's Adults/Children fields. */
export function GuestStepper({ label, color = 'paper' }: GuestStepperProps) {
  const [count, setCount] = React.useState(0)
  const colorClass = color === 'paper' ? 'text-paper' : 'text-brand'

  return (
    <div className="flex h-full w-full items-center justify-between">
      <span className={`font-body text-12 tracking-[0.6px] uppercase ${colorClass}`}>{label}</span>
      <div className="flex items-center gap-10">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => setCount((n) => Math.max(0, n - 1))}
          className={colorClass}
        >
          <MinusIcon className="h-px w-7" />
        </button>
        <span className={`font-body text-12 tracking-[0.6px] uppercase ${colorClass}`}>
          {count}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => setCount((n) => n + 1)}
          className={colorClass}
        >
          <PlusIcon className="size-7" />
        </button>
      </div>
    </div>
  )
}
