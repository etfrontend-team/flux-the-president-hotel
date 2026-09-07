/** @format */

"use client";

import Image from "next/image";
import { type ReactNode } from "react";

import { useDayNight } from "@/components/DayNightContext";
import { Container, Heading, Prose, Stack } from "@/components/ui";

import { BookingBar } from "./BookingBar";
import { BookingBarGate } from "./BookingBarGate";
import { BookingBarOverlay } from "./BookingBarOverlay";
import { BookingTab } from "./BookingTab";

const DAY_VIDEO_SRC = "/images/pres-hero-video.mp4";
const NIGHT_IMAGE_SRC = "/images/home-hero.webp";

const DAY_HEADING = (
  <>
    <span className="block">Where the Atlantic</span>
    <span className="block">meets the city.</span>
  </>
);
const DAY_DESCRIPTION =
  "A boutique hotel on the edge of the sea — steps from the V&A Waterfront, with views that hold.";

const NIGHT_HEADING = (
  <>
    <span className="block">Where evenings</span>
    <span className="block">linger by the sea.</span>
  </>
);
const NIGHT_DESCRIPTION =
  "Golden hour on The Deck, a glass of something red, and the Atlantic turning to silver below.";

interface HeroProps {
  eyebrow?: string;
  heading?: ReactNode;
  description?: string;
  videoSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function Hero({
  eyebrow = "Cape Town, South Africa",
  heading,
  description,
  videoSrc,
  imageSrc,
  imageAlt = "The President Hotel's sea-facing garden, Cape Town",
}: HeroProps = {}) {
  const { mode } = useDayNight();
  const isNight = mode === "night";

  const resolvedHeading = heading ?? (isNight ? NIGHT_HEADING : DAY_HEADING);
  const resolvedDescription =
    description ?? (isNight ? NIGHT_DESCRIPTION : DAY_DESCRIPTION);
  const resolvedVideoSrc = videoSrc ?? (isNight ? "" : DAY_VIDEO_SRC);
  const resolvedImageSrc = imageSrc ?? (isNight ? NIGHT_IMAGE_SRC : "");

  return (
    <>
      <section
        data-hero
        className="relative isolate overflow-hidden rounded-card max-992:m-15 m-25">
        <div className="relative max-1199:min-h-[calc(100dvh-50px)] 1199:h-[calc(100vh-50px)] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden max-1199:rounded-bl-card max-1199:rounded-br-card">
            {resolvedVideoSrc ?
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={resolvedImageSrc || undefined}
                className="absolute inset-0 size-full object-cover"
                src={resolvedVideoSrc}
              />
            : resolvedImageSrc ?
              <Image
                src={resolvedImageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            : null}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 max-992:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_40%),linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_75%)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_30%),linear-gradient(to_right,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_65%),linear-gradient(to_top,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_25%)]"
            />
          </div>

          <Container className="relative z-10 flex max-1199:min-h-[calc(100dvh-50px)] 1199:h-[calc(100vh-50px)] flex-col p-0 992:p-0">
            <Stack
              align="start"
              gap={30}
              tabletGap={30}
              mobileGap={30}
              className="my-auto text-paper max-992:px-25 px-35">
              <Prose
                as="span"
                font="accent"
                color="paper"
                className="text-16 leading-12 font-normal uppercase">
                {eyebrow}
              </Prose>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                <Heading level={1} color="paper">
                  {resolvedHeading}
                </Heading>
                <Prose color="paper" className="max-w-475">
                  {resolvedDescription}
                </Prose>
              </Stack>
            </Stack>

            {/* Desktop: glass fields overlaid on the image (Figma node 1:2354). */}
            <BookingBarGate>
              <div data-booking-bar="overlay" className="max-1199:hidden">
                <BookingBarOverlay />
              </div>
            </BookingBarGate>
          </Container>
        </div>

        {/* Mobile: plain outlined fields in normal flow below the image (Figma node 59:444). */}
        <BookingBarGate>
          <div data-booking-bar="flow" className="1199:hidden">
            <BookingBar variant="flow" />
          </div>
        </BookingBarGate>
      </section>
      <BookingBarGate>
        <BookingTab />
      </BookingBarGate>
    </>
  );
}
