import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'

export default function FaqPage() {
  return (
    <>
      <Hero
        eyebrow="GUEST INFORMATION"
        heading={
          <>
            <span className="block">FAQs</span>
          </>
        }
        description="Answers to the questions we're asked most, from booking to check-out."
      />
      <AnnouncementBar />
      <Faq />
      <BookYourStay />
      <Subscribe />
    </>
  )
}
