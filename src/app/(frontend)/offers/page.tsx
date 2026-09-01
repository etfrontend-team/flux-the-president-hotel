import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { PhotoMarquee } from '@/components/sections/PhotoMarquee'
import { CurrentOffers } from '@/components/sections/CurrentOffers'

export default function OffersPage() {
  return (
    <>
        <Hero
            eyebrow="SPECIAL OFFERS"
            heading={
            <>
                <span className="block">Offers & Packages</span>
            </>
            }
            description="Handpicked stays, curated experiences, and direct-booking exclusives. No intermediaries, no markups — just the best we offer, for those who book direct."
        />
        <AnnouncementBar pairedWithMarquee />
        <PhotoMarquee />
        <CurrentOffers />
        <BookYourStay />
        <Subscribe />
    </>
  )
}