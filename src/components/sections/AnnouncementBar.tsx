import React from 'react'

import { Stack } from '@/components/ui'

/** Promo strip on the homepage, directly below the hero. */
export function AnnouncementBar() {
  return (
    <Stack direction="row" align="center" justify="center" gap={16} className="bg-paper-alt py-12">
      <span className="font-accent text-15 tracking-[0.75px] text-brand uppercase">
        Best rate guarantee
      </span>
      <span className="font-light text-[14.5px] tracking-[0.725px] text-ink capitalize opacity-95">
        Book direct for the best possible pricing
      </span>
      <a
        href="#"
        className="border-b border-brand-muted text-13 tracking-[0.65px] text-brand uppercase"
      >
        Book Now
      </a>
    </Stack>
  )
}
