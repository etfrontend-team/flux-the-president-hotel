import { Hero } from '@/components/sections/Hero'
import { SplitInfo } from '@/components/sections/SplitInfo'
import { WildlifeShowcase } from '@/components/sections/WildlifeShowcase'
import { SplitContent } from '@/components/sections/SplitContent'
import { LifestyleGallery } from '@/components/sections/LifestyleGallery'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
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
        <SplitContent
            className="max-992:bg-paper-alt/40"
            imagePosition="right"
            eyebrow="SUPPORT"
            heading="Cocktails for a Cause"
            description={[
                "Introducing our cocktail trio in support of SANCCOB penguins. Meet Rocky, Pamela and Sylvester — each inspired by the spirit of conservation and coastal life, with proceeds supporting SANCCOB's ongoing conservation efforts.",
                'Rocky A refreshing blend of apple, mint, passionfruit and club soda. Pamela A smooth blend of rooibos espresso, cinnamon and vanilla. Sylvester Bloedlemon Amber Gin with pineapple lemonade.',
            ]}
            buttonLabel={null}
            image="/images/split-content-cocktails.webp"
            alt="Three cocktails served on a poolside table, garnished with mint, dried citrus and lime"
            imageObjectPosition="50% 66%"
        />
        <SplitContent
            imagePosition="left"
            eyebrow="SUPPORT"
            heading="Plush Penguins"
            description={[
                "In addition, Souvenir, The President Hotel's online store, stocks plush penguins, with a portion of each sale donated directly to SANCCOB in support of their ongoing work protecting vulnerable seabird populations.",
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            ]}
            buttonLabel="Shop Now"
            image="/images/split-content-plush-penguin.webp"
            alt="Plush penguin toys wearing striped hats and name tags"
        />
        <LifestyleGallery />
        <Faq className="max-992:bg-paper-alt/40"/>
        <BookYourStay />
        <Subscribe />
    </>
  )
}