import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { MoreThanAView } from '@/components/sections/MoreThanAView'
import { Testimonial } from '@/components/sections/Testimonial'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'

export default function StayPage() {
  return (
    <>
      <Hero
        eyebrow="3 Stay Types"
        heading={
          <>
            <span className="block">Stay at The</span>
            <span className="block">President</span>
          </>
        }
        description="A boutique hotel on the edge of the sea — steps from the V&A Waterfront, with views that hold."
      />
      <AnnouncementBar />
      <MoreThanAView />
      <Testimonial />
      <BookYourStay />
      <Subscribe />
    </>
  )
}
