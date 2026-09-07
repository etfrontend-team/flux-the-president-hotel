import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { StayHero } from '@/components/sections/StayHero'
import { StayDetails } from '@/components/sections/StayDetails'
import { Faq } from '@/components/sections/Faq'
import { DiscoverMore } from '@/components/sections/DiscoverMore'
import { Subscribe } from '@/components/sections/Subscribe'
import { BookingOffer } from '@/components/sections/BookingOffer'

export default function RoomsPage() {
  return (
    <>
      <StayHero />
      <AnnouncementBar />
      <StayDetails />
      <Faq className="max-992:bg-paper-alt/40" />
      <BookingOffer />
      <DiscoverMore/>
      <Subscribe />
    </>
  )
}
