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
            <span className="block">Frequently Asked</span>
            <span className='block'>Questions</span>
          </>
        }
        description="Everything you need to know before, during, and after your stay. Can't find what you're looking for? Our concierge team is always available."
      />
      <AnnouncementBar />
      <Faq />
      <BookYourStay />
      <Subscribe />
    </>
  )
}
