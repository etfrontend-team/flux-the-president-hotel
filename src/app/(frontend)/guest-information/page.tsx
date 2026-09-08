/** @format */

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Hero } from "@/components/sections/Hero";
import { GuestAccessibility } from "@/components/sections/GuestAccessibility";
import { BookYourStay } from "@/components/sections/BookYourStay";
import { Subscribe } from "@/components/sections/Subscribe";
import { BookingOffer } from "@/components/sections/BookingOffer";
import { Faq } from "@/components/sections/Faq";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";

export default function StayPage() {
  return (
    <>
      <Hero
        eyebrow="GUEST INFORMATION"
        heading={
          <>
            <span className="block">Guest Information</span>
          </>
        }
        description="Everything you need to know before, during, and after your stay. For detailed answers, visit our FAQ page."
      />
      <AnnouncementBar />
      <GuestAccessibility />
      <Faq className="bg-paper-alt/40" />
      <BookingOffer />
      <UpcomingEvents />
      <BookYourStay />
      <Subscribe />
    </>
  );
}
