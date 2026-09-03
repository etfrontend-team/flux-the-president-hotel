import { Hero } from '@/components/sections/Hero'
import { SplitContent } from '@/components/sections/SplitContent'
import { MemberBenefits } from '@/components/sections/MemberBenefits'

export default function LoyaltyPage() {
  return (
    <>
        <Hero
            eyebrow="PRESIDENT CLUB"
            heading={
            <>
                <span className="block">Loyalty Programme</span>
            </>
            }
            description="The more you stay, the more you unlock. President Club rewards direct bookers with exclusive rates, priority upgrades, and access to member-only experiences."
        />
        <SplitContent
            imagePosition="left"
            eyebrow={null}
            heading="Not only is signing up free, but you get plenty of extra exclusive benefits too."
            description="*As a Presidential VIP you will enjoy:"
            list={[
                '10% off your bill*',
                'Special rewards and discounts after every 5 visits or on your birthday',
                'Enjoy exclusive monthly special offers and promotions',
                "It's as easy as Eat. Drink. Earn..",
            ]}
            note="*T's & C's apply. Vouchers will be valid for 1 year. Only to be redeemed on food and beverage items at the President Hotel. Not valid for use with any other special offers"
            buttonLabel="Download App"
            image="/images/split-content-loyalty-vip.webp"
            alt="A woman in a wide-brimmed sun hat sipping a cocktail poolside"
            imageAspect="square"
        />
        <MemberBenefits />
    </>
  )
}