import { AnnouncementBar } from '@/components/sections/AnnouncementBar'
import { Hero } from '@/components/sections/Hero'
import { MediaContact } from '@/components/sections/MediaContact'
import { SplitContent } from '@/components/sections/SplitContent'
import { MediaHubListing } from '@/components/sections/MediaHubListing'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'

export default function MediaHubPage() {
  return (
    <>
        <Hero
            eyebrow="STORIES"
            heading={
            <>
                <span className="block">Media Hub</span>
            </>
            }
            description="Seasonal guides, behind-the-scenes stories, and dispatches from Sea Point — written by the people who know this place best."
        />
        <AnnouncementBar />
        <MediaContact />
        <SplitContent
            imagePosition="left"
            eyebrow="Feature Read"
            heading="The best of Cape Town: a Sea Point local's guide"
            meta="Travel · April 2026"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sea Point is one of Cape Town's most walkable neighbourhoods — a strip of promenade, coffee shops, and ocean air that rewards the curious guest."
            buttonLabel="Read article"
            buttonHref="#"
            image="/images/split-content-mediahub-feature.webp"
            alt="An overhead view of a beach picnic with sandwiches, drinks, and a copy of The President Post"
            imageAspect="wide"
        />
        <MediaHubListing />
        <BookYourStay />
        <Subscribe />
    </>
  )
}