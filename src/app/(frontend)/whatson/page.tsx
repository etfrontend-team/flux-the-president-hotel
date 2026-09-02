import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { FeaturedEvent } from '@/components/sections/FeaturedEvent'
import { EventListing } from '@/components/sections/EventListing'

export default function EventsPage() {
  return (
    <>
        <Hero
            eyebrow="EVENTS"
            heading={
                <>
                    <span className="block">What's On</span>
                </>
            }
            description="From live music and pop-up dinners to film screenings and seasonal markets — there's always something happening at The President."
        />
        <FeaturedEvent />
        <EventListing />
        <BookYourStay />
        <Subscribe />
    </>
  )
}