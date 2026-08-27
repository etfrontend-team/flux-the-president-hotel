import React from 'react'

import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { CoreExperience } from '@/components/sections/CoreExperience'
import { Hero } from '@/components/sections/Hero'
import { MoreThanAView } from '@/components/sections/MoreThanAView'
import { PhotoMarquee } from '@/components/sections/PhotoMarquee'
import { WhereToStay } from '@/components/sections/WhereToStay'
import { WhatsOn } from '@/components/sections/WhatsOn'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementBar />
      <PhotoMarquee />
      <WhereToStay />
      <WhatsOn />
      <CoreExperience />
      <MoreThanAView />
    </>
  )
}
