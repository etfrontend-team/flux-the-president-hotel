import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { FindUs } from '@/components/sections/FindUs'
import { NearbyDestinations } from '@/components/sections/NearbyDestinations'
import { GettingHere } from '@/components/sections/GettingHere'

export default function LocationPage() {
  return (
    <>
        <Hero
            eyebrow="LOCATION"
            heading={
                <>
                    <span className="block">Find Us</span>
                </>
            }
            description="Bantry Bay, Cape Town, Cape Town. On the Atlantic seaboard — five minutes from the V&A Waterfront, ten minutes from the city centre, and right at the edge of the sea."
          />
        <AnnouncementBar />
        <FindUs eyebrow="Location" />
        <NearbyDestinations />
        <GettingHere />
        <BookYourStay />
        <Subscribe />
    </>
  )
}