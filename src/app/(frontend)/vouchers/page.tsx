/** @format */

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Hero } from "@/components/sections/Hero";
import { BookYourStay } from "@/components/sections/BookYourStay";
import { Subscribe } from "@/components/sections/Subscribe";
import { PhotoMarquee } from "@/components/sections/PhotoMarquee";
import { ChooseGift } from "@/components/sections/ChooseGift";
import { LoyaltyMembers } from "@/components/sections/LoyaltyMembers";

export default function VouchersPage() {
  return (
    <>
      <Hero
        eyebrow="GIFTS"
        heading={
          <>
            <span className="block">Gift Vouchers</span>
          </>
        }
        description="Give the gift of a stay above the Atlantic. Gift vouchers are available in any denomination and can be redeemed against accommodation, dining, spa treatments, and experiences."
      />
      <AnnouncementBar pairedWithMarquee />
      <PhotoMarquee />
      <ChooseGift />
      <LoyaltyMembers className="bg-paper-alt/40" />
      <BookYourStay />
      <Subscribe />
    </>
  );
}
