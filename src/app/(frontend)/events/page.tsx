import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { LifestyleGallery } from '@/components/sections/LifestyleGallery'
import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { VenueHighlights } from '@/components/sections/VenueHighlights'
import { EventShowcase } from '@/components/sections/EventShowcase'
import { LocationSection } from '@/components/sections/LocationSection'
import { UpcomingEvents } from '@/components/sections/UpcomingEvents'
import { EventEnquiry } from '@/components/sections/EventEnquiry'

export default function EventsPage() {
  return (
    <>
        <Hero
            eyebrow="EVENTS"
            heading={
                <>
                    <span className="block">Events & Celebrations</span>
                </>
            }
            description="Weddings, conferences, and private celebrations — hosted with the full attention and craft of The President team."
        />
        <AnnouncementBar />
        <VenueHighlights />
        <EventShowcase />
        <LifestyleGallery
            images={[
                { src: '/images/lifestyle-gallery-events-wedding.webp', alt: 'A bride and groom embracing at golden hour, wrapped in a veil' },
                {
                    src: '/images/lifestyle-gallery-events-doors.webp',
                    alt: 'Arched wooden double doors beside a wall-mounted plant shelf',
                    caption: 'The Garden Nook',
                },
                { src: '/images/lifestyle-gallery-events-dining.webp', alt: 'A mussel dish viewed through palm leaves', caption: 'Venue Name' },
                { src: '/images/lifestyle-gallery-events-wedding.webp', alt: 'A bride and groom embracing at golden hour, wrapped in a veil' },
                {
                    src: '/images/lifestyle-gallery-events-doors.webp',
                    alt: 'Arched wooden double doors beside a wall-mounted plant shelf',
                    caption: 'The Garden Nook',
                },
            ]}
        />
        <LocationSection />
        <UpcomingEvents />
        <EventEnquiry />
        <BookYourStay />
        <Subscribe />
    </>
  )
}