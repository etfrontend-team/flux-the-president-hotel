import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { FindUs } from '@/components/sections/FindUs'
import { LocationSection } from '@/components/sections/LocationSection'

export default function ContactUsPage() {
  return (
    <>
        <Hero
            eyebrow="GET IN TOUCH"
            heading={
                <>
                    <span className="block">Contact Us</span>
                </>
            }
            description="Our team is here whenever you need us — whether you are planning a stay, celebrating a milestone, or simply have a question."
          />
        <AnnouncementBar />
        <FindUs
            heading="Direct contact"
            rows={[
                { label: 'Address', value: '4 Alexander Road, Bantry Bay' },
                { label: 'Phone', value: '+27 21 434 9111' },
                { label: 'Email', value: 'hello@presidenthotel.co.za' },
                { label: 'Hours', value: ['Reception: 24/7', 'Reservations: 08:00–20:00'] },
            ]}
            showFollowUs
            image="/images/contact-hotel-exterior.webp"
            imageAlt="Aerial view of The President Hotel's pool deck with Lion's Head behind"
            imageObjectPosition="50% 30%"
            showDivider={false}
        />
        <LocationSection />
        <BookYourStay />
        <Subscribe />
    </>
  )
}