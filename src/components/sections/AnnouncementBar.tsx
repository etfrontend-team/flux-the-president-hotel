'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

import { Stack, Button } from '@/components/ui'

export function AnnouncementBar() {
  const isHomepage = usePathname() === '/'

  return (
    <>
      {isHomepage && <div aria-hidden="true" className="max-992:h-40 h-53 bg-paper-alt" />}
      <div className="sticky top-0 z-20">
        <Stack
          as="div"
          direction="row"
          mobileDirection="col"
          align="center"
          justify="center"
          gap={12}
          mobileGap={10}
          className="bg-paper-alt max-992:py-20 py-12"
        >
          <span className="font-accent text-15 tracking-5 text-brand uppercase">
            Best rate guarantee
          </span>
          <span className="font-light text-[14.5px] tracking-5 text-ink capitalize opacity-95">
            Book direct for the best possible pricing
          </span>
          <Button as="a" href="#" variant="link" color="brand" className="font-body !text-13 tracking-5 uppercase !leading-9 py-6">
            Book Now
          </Button>
        </Stack>
      </div>
    </>
  )
}
