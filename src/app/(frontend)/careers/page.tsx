import { Hero } from '@/components/sections/Hero'
import { CareerListing } from '@/components/sections/CareerListing'
import { Subscribe } from '@/components/sections/Subscribe'

export default function CareersPage() {
  return (
    <>
        <Hero
            eyebrow="JOIN OUR TEAM"
            heading={
            <>
                <span className="block">Careers</span>
            </>
            }
            description="We are always looking for talented people who believe in genuine hospitality. View our current openings below or send a speculative application to our team."
        />
        <CareerListing />
        <Subscribe />
    </>
  )
}