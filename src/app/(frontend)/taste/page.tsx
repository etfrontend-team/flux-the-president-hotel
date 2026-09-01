import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { DiningExperience } from '@/components/sections/DiningExperience'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'

export default function TastePage() {
  return (
    <>
      <Hero
        eyebrow="taste"
        heading={
          <>
            <span className="block">Food & Drink</span>
          </>
        }
        description="The President Hotel has a host of dining options available. Whether you’re in the mood for a romantic dinner, casual coffee, quick lunch or hearty breakfast, our restaurants and café can cater for your needs."
      />
      <AnnouncementBar />
      <DiningExperience />
      <BookYourStay />
      <Subscribe />
    </>
  )
}