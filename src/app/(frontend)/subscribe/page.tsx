/** @format */

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Hero } from "@/components/sections/Hero";
import { BookYourStay } from "@/components/sections/BookYourStay";
import { Subscribe } from "@/components/sections/Subscribe";
import { SubscribeBenefits } from "@/components/sections/SubscribeBenefits";
import { SubscribeByInterest } from "@/components/sections/SubscribeByInterest";
import { PhotoMarquee } from "@/components/sections/PhotoMarquee";

export default function SubscribePage() {
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
      <SubscribeBenefits />
      <SubscribeByInterest />
      <BookYourStay />
      <Subscribe />
    </>
  );
}
