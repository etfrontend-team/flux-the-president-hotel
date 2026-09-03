import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { AtTheTable } from '@/components/sections/AtTheTable'
import { AtlanticMeetsCity } from '@/components/sections/AtlanticMeetsCity'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { CoreExperience } from '@/components/sections/CoreExperience'
import { Hero } from '@/components/sections/Hero'
import { MoreThanAView } from '@/components/sections/MoreThanAView'
import { PhotoMarquee } from '@/components/sections/PhotoMarquee'
import { Subscribe } from '@/components/sections/Subscribe'
import { Testimonial } from '@/components/sections/Testimonial'
import { WhereToStay } from '@/components/sections/WhereToStay'
import { WhatsOn } from '@/components/sections/WhatsOn'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementBar pairedWithMarquee />
      <PhotoMarquee />
      <WhereToStay />
      <WhatsOn />
      <CoreExperience />
      <MoreThanAView />
      <AtTheTable/>
      <AtlanticMeetsCity />
      <Testimonial />
      <BookYourStay />
      <Subscribe />
    </>
  )
}
