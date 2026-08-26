import React from 'react'

import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { PhotoMarquee } from '@/components/sections/PhotoMarquee'
import { WhereToStay } from '@/components/sections/WhereToStay'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementBar />
      <PhotoMarquee />
      <WhereToStay />
    </>
  )
}
