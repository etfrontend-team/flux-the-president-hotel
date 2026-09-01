import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { DiningExperience } from '@/components/sections/DiningExperience'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'

export default function PetsPage() {
  return (
    <>
      <Hero
        eyebrow="GUEST INFORMATION"
        heading={
          <>
            <span className="block">Pets</span>
          </>
        }
        description="We welcome well-behaved dogs. Your four-legged companion is as welcome at The President as you are."
      />
      <AnnouncementBar />
      <DiningExperience />
      <BookYourStay />
      <Subscribe />
    </>
  )
}