/** @format */

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Hero } from "@/components/sections/Hero";
import { BookYourStay } from "@/components/sections/BookYourStay";
import { Subscribe } from "@/components/sections/Subscribe";
import { PhotoMarquee } from "@/components/sections/PhotoMarquee";
import { SplitContent } from "@/components/sections/SplitContent";
import { SustainabilityGallery } from "@/components/sections/SustainabilityGallery";
import { MemberBenefits } from "@/components/sections/MemberBenefits";

export default function VouchersPage() {
  return (
    <>
      <Hero
        eyebrow="SUSTAINABILITY"
        heading={
          <>
            <span className="block">Our Commitment to</span>
            <span className="block">the Environment</span>
          </>
        }
        description="We believe a great hotel should take care of more than its guests. Green Key certified. SANCCOB partner. A hotel working to do better."
      />
      <AnnouncementBar pairedWithMarquee />
      <PhotoMarquee />
      <SplitContent
        imagePosition="left"
        eyebrow="SUSTAINABILITY"
        heading="Green Key Certification"
        description={[
          <span key="lead" className="font-medium text-ink">
            Green Key Certified since 2019
          </span>,
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Green Key is the leading standard for excellence in the field of environmental responsibility and sustainable operation within the tourism industry.",
        ]}
        buttonLabel={null}
        image="/images/placeholder.webp"
        alt="Three cocktails served on a poolside table, garnished with mint, dried citrus and lime"
      />
      <MemberBenefits />
      <SustainabilityGallery />
      <BookYourStay />
      <Subscribe />
    </>
  );
}
