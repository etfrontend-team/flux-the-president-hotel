import { Hero } from '@/components/sections/Hero'
import { SplitInfo } from '@/components/sections/SplitInfo'
import { WildlifeShowcase } from '@/components/sections/WildlifeShowcase'
import { SplitContent } from '@/components/sections/SplitContent'
import { LifestyleGallery } from '@/components/sections/LifestyleGallery'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { DiscoverMore } from '@/components/sections/DiscoverMore'
import { Faq } from '@/components/sections/Faq'

export default function SustainabilityPage() {
  return (
    <>
        <Hero
            eyebrow="EXPERIENCES"
            heading={
            <>
                    <span className="block">SANCCOB Penguin</span>
                    <span className="block">Experience</span>
            </>
            }
            description="A private morning with African penguins — an exclusive conservation experience with our flagship charity partner."
        />
        <SplitInfo divider cardWidth={385} />
        <WildlifeShowcase />
        <SplitContent imagePosition="right" />
        <SplitContent imagePosition="left" />
        <LifestyleGallery />
        <Faq className="max-992:bg-paper-alt/40"/>
        <DiscoverMore/>
        <BookYourStay />
        <Subscribe />
    </>
  )
}