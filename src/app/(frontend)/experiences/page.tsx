import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { ExploreExperiences } from '@/components/sections/ExploreExperiences'
import { Hero } from '@/components/sections/Hero'
import { Testimonial } from '@/components/sections/Testimonial'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { DiscoverMore } from '@/components/sections/DiscoverMore'

export default function ExperiencesPage() {
  return (
    <>
      <Hero
        eyebrow="your cape town"
        heading={
          <>
            <span className="block">Experience</span>
          </>
        }
        description="A boutique hotel on the edge of the sea — steps from the V&A Waterfront, with views that hold."
      />
      <AnnouncementBar />
      <ExploreExperiences />
      <Testimonial />
      <DiscoverMore/>
      <BookYourStay />
      <Subscribe />
    </>
  )
}