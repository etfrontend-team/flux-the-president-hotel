import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { SplitInfo } from '@/components/sections/SplitInfo'
import { RoomShowcase } from '@/components/sections/RoomShowcase'
import { SplitContent } from '@/components/sections/SplitContent'
import { LifestyleGallery } from '@/components/sections/LifestyleGallery'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { DiscoverMore } from '@/components/sections/DiscoverMore'
import { Faq } from '@/components/sections/Faq'

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
        <SplitInfo />
        <RoomShowcase />
        <SplitContent />
        <LifestyleGallery />
        <Faq />
        <DiscoverMore/>
        <BookYourStay />
        <Subscribe />
    </>
  )
}