/** @format */

import { Hero } from "@/components/sections/Hero";
import { LoyaltyMembers } from "@/components/sections/LoyaltyMembers";
import { MemberBenefits } from "@/components/sections/MemberBenefits";

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
      <LoyaltyMembers />
      <MemberBenefits />
    </>
  );
}
