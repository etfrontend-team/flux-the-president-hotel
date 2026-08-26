import React from 'react'

import { CalendarIcon, ChevronRightIcon } from '@/components/icons'
import { Button, Stack } from '@/components/ui'

import { GuestStepper } from './GuestStepper'

type BookingBarVariant = 'overlay' | 'flow'

const fieldBase = 'flex h-42 max-992:min-h-42 flex-1 items-center justify-between rounded-card px-20'

/** overlay = glass fields over the hero image (desktop, Figma node 1:2354). flow = plain outlined fields on the paper background below the image (mobile, Figma node 59:444). */
const fieldVariantClasses: Record<BookingBarVariant, string> = {
  overlay: 'border border-paper bg-[rgba(149,148,148,0.15)]',
  flow: 'border border-brand-muted bg-transparent',
}

/**
 * Booking widget. Room type, check-in and check-out are static placeholders —
 * a real date-picker / room-type selector, and the scroll-triggered
 * transition called out in the Figma annotation on node 1:2354, are separate
 * follow-up work.
 */
export function BookingBar({ variant = 'overlay' }: { variant?: BookingBarVariant }) {
  const isFlow = variant === 'flow'
  const fieldClasses = `${fieldBase} ${fieldVariantClasses[variant]}`
  const labelColor = isFlow ? 'text-brand' : 'text-paper'
  const stepperColor = isFlow ? 'brand' : 'paper'

  return (
    <div
      className={
        isFlow
          ? 'relative w-full bg-paper px-25 py-30'
          : 'absolute bottom-0 left-0 w-full pt-58 pb-35 max-992:px-25 px-35'
      }
    >
      {!isFlow && (
        <div className='bg-[linear-gradient(to_top,rgba(149,148,148,1)_0%,rgba(149,148,148,0)_100%)] absolute inset-0 backdrop-blur-[5px] -z-1'></div>
      )}
      <Stack
        as="div"
        direction="row"
        mobileDirection="col"
        align="center"
        gap={12}
        mobileGap={12}
        className="max-992:!items-stretch"
      >
        <button type="button" className={fieldClasses}>
          <span className={`font-body text-12 tracking-[1.2px] uppercase ${isFlow ? 'text-ink' : 'text-paper'}`}>
            Room Type
          </span>
          <ChevronRightIcon className={`h-12 w-7 rotate-90 ${isFlow ? 'text-ink' : 'text-paper'}`} />
        </button>

        {/* Paired on their own row at every width — `992:contents` drops this wrapper from
            the desktop layout so both buttons become flat siblings in the row above. */}
        <div className="flex items-center gap-12 max-992:w-full 992:contents">
          <button type="button" className={fieldClasses}>
            <span className={`font-body text-12 tracking-[0.6px] uppercase ${labelColor}`}>
              Check-in
            </span>
            <CalendarIcon className={`size-24 mt-2 ${labelColor}`} />
          </button>

          <button type="button" className={fieldClasses}>
            <span className={`font-body text-12 tracking-[0.6px] uppercase ${labelColor}`}>
              Check-out
            </span>
            <CalendarIcon className={`size-24 mt-2 ${labelColor}`} />
          </button>
        </div>

        <div className={fieldClasses}>
          <GuestStepper label="Adults (16yrs +)" color={stepperColor} />
        </div>

        <div className={fieldClasses}>
          <GuestStepper label="Children" color={stepperColor} />
        </div>

        <Button
          variant="solid"
          color="brand"
          className="h-42 shrink-0 rounded-card px-20 py-0 font-normal text-12 tracking-[1.2px] uppercase max-992:w-full"
        >
          Check availability
        </Button>
      </Stack>
    </div>
  )
}
