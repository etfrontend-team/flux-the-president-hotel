import React from 'react'

import { CalendarIcon, ChevronRightIcon } from '@/components/icons'
import { Button, Stack } from '@/components/ui'

import { GuestStepper } from './GuestStepper'

type BookingBarVariant = 'overlay' | 'flow'

const fieldBase = 'flex h-42 max-1199:min-h-42 flex-1 items-center justify-between rounded-card px-10 1366:px-20'

const fieldVariantClasses: Record<BookingBarVariant, string> = {
  overlay: 'border border-paper bg-[rgba(149,148,148,0.15)]',
  flow: 'border border-brand-muted bg-transparent',
}

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
          : 'absolute bottom-0 left-0 w-full pt-58 pb-35 max-1366:px-25 1366:px-35'
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
        className="max-1199:!items-stretch"
      >
        <button type="button" className={fieldClasses}>
          <span className={`font-body text-12 tracking-10 uppercase ${isFlow ? 'text-ink' : 'text-paper'}`}>
            Room Type
          </span>
          <ChevronRightIcon className={`h-12 w-7 rotate-90 ${isFlow ? 'text-ink' : 'text-paper'}`} />
        </button>

        {/* Paired on their own row at every width — `1199:contents` drops this wrapper from
            the desktop layout so both buttons become flat siblings in the row above. */}
        <div className="flex items-center gap-12 max-1199:w-full 1199:contents">
          <button type="button" className={fieldClasses}>
            <span className={`font-body text-12 tracking-5 uppercase ${labelColor}`}>
              Check-in
            </span>
            <CalendarIcon className={`size-24 mt-2 ${labelColor}`} />
          </button>

          <button type="button" className={fieldClasses}>
            <span className={`font-body text-12 tracking-5 uppercase ${labelColor}`}>
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
          className="h-42 shrink-0 rounded-card px-20 py-0 font-normal text-12 tracking-10 uppercase max-1199:w-full"
        >
          Check availability
        </Button>
      </Stack>
    </div>
  )
}
