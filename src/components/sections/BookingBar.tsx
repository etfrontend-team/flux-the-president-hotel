import React from 'react'

import { CalendarIcon, ChevronRightIcon } from '@/components/icons'
import { Button } from '@/components/ui'

import { GuestStepper } from './GuestStepper'

const fieldClasses =
  'flex h-42 flex-1 items-center justify-between rounded-card border border-paper bg-[rgba(149,148,148,0.15)] px-20'

/**
 * Booking widget overlaid near the bottom of the hero. Room type, check-in
 * and check-out are static placeholders — a real date-picker / room-type
 * selector, and the scroll-triggered transition called out in the Figma
 * annotation on node 1:2354, are separate follow-up work.
 */
export function BookingBar() {
  return (
    <div className="rounded-t-none rounded-b-card bg-paper/10 p-15 backdrop-blur-[2.5px]">
      <div className="flex flex-col gap-12 md:flex-row">
        <button type="button" className={fieldClasses}>
          <span className="font-body text-12 tracking-[1.2px] text-paper uppercase">
            Room Type
          </span>
          <ChevronRightIcon className="h-12 w-7 rotate-90 text-paper" />
        </button>

        <button type="button" className={fieldClasses}>
          <span className="font-body text-12 tracking-[0.6px] text-paper uppercase">
            Check-in
          </span>
          <CalendarIcon className="size-24 text-paper" />
        </button>

        <button type="button" className={fieldClasses}>
          <span className="font-body text-12 tracking-[0.6px] text-paper uppercase">
            Check-out
          </span>
          <CalendarIcon className="size-24 text-paper" />
        </button>

        <div className={fieldClasses}>
          <GuestStepper label="Adults (16yrs +)" />
        </div>

        <div className={fieldClasses}>
          <GuestStepper label="Children" />
        </div>

        <Button
          variant="outlined"
          color="brand"
          className="h-42 shrink-0 rounded-card px-20 py-0 font-normal text-12 tracking-[1.2px] uppercase md:w-177"
        >
          Check availability
        </Button>
      </div>
    </div>
  )
}
