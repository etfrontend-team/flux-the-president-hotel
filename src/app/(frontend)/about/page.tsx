import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { PhotoMarquee } from '@/components/sections/PhotoMarquee'
import { VenueHighlights } from '@/components/sections/VenueHighlights'
import { SplitContent } from '@/components/sections/SplitContent'
import { TeamSection } from '@/components/sections/TeamSection'
import { OurHistory } from '@/components/sections/OurHistory'
import { BrandValues } from '@/components/sections/BrandValues'
import { SustainabilityGallery } from '@/components/sections/SustainabilityGallery'

export default function AboutPage() {
  return (
    <>
        <Hero
            eyebrow="OUR STORY"
            heading={
            <>
                <span className="block">About The President</span>
            </>
            }
            description="A Cape Town original. Independent, family-run, and shaped by more than forty years of hospitality on the Atlantic seaboard."
        />
        <AnnouncementBar pairedWithMarquee />
        <PhotoMarquee />
        <VenueHighlights
            highlights={[
                { heading: '30+', description: 'Years in Sea Point' },
                { heading: 'Luxury Family Hotel', description: 'Winner in Southern Africa' },
                { heading: 'Green Key', description: 'Certified sustainable' },
            ]}
            buttonLabel={null}
          />
        <TeamSection />
        <SplitContent
            imagePosition="right"
            eyebrow="THE PRESIDENT HOTEL"
            heading="thirty years above the sea."
            description={[
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            ]}
            buttonLabel={null}
            image="/images/discover-more-stay.webp"
            alt="thirty years above the sea"
        />
        <OurHistory />
        <BrandValues />
        <SustainabilityGallery />
        <BookYourStay />
        <Subscribe />
    </>
  )
}