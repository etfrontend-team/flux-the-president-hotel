'use client'

import { type ReactNode } from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Scroll-triggered fade/rise, the house animation primitive.
 *
 * Uses LazyMotion + the lightweight `m` component so only the DOM animation
 * features are bundled — keeping the Worker bundle small. Client component.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
