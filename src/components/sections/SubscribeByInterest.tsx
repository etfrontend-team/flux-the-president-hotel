/** @format */

"use client";

import Image from "next/image";
import { type FormEvent } from "react";

import { FadeIn } from "@/components/FadeIn";
import { Button, Container, Heading, Stack } from "@/components/ui";

type Topic = {
  eyebrow: string;
  heading: string;
  image: string;
  alt: string;
};

const TOPICS: Topic[] = [
  {
    eyebrow: "Dining",
    heading: "Sign up for the latest news and promotions on dining",
    image: "/images/subscribe-topic-dining.webp",
    alt: "A grilled seafood dish with asparagus and lemon, seen through a glass of white wine",
  },
  {
    eyebrow: "Stay",
    heading: "Sign up for the latest news and promotions on stay",
    image: "/images/subscribe-topic-stay.webp",
    alt: "A hotel bedroom with a made-up bed and a sea-facing balcony view over Sea Point",
  },
];

const inputClassName =
  "block h-40 w-full 992:max-w-260 rounded-5 border border-brand-muted bg-transparent px-25 py-15 text-13 leading-12 tracking-5 text-ink capitalize placeholder:text-ink/60 placeholder:capitalize focus:outline-none";

function TopicSignupForm({ topic }: { topic: Topic }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-25 992:items-start">
      <Stack gap={15} tabletGap={15} mobileGap={15} className="w-full">
        <input
          type="text"
          name="firstName"
          placeholder="Your name"
          className={inputClassName}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          className={inputClassName}
        />
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          className={inputClassName}
        />
      </Stack>

      <fieldset className="flex items-center gap-25">
        <legend className="sr-only">Guest type</legend>
        {["Guest", "Travel Professional"].map((label, index) => (
          <label
            key={label}
            className="flex cursor-pointer items-center gap-8 font-body text-11 tracking-5 text-ink/80 capitalize">
            <input
              type="radio"
              name={`guestType-${topic.eyebrow}`}
              value={label}
              defaultChecked={index === 0}
              className="size-14 appearance-none rounded-full border border-brand-muted checked:border-4 checked:border-brand"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <p className="w-full text-11 leading-copy font-light tracking-5 text-ink/60 text-center 992:max-w-310 992:text-left">
        *By signing up for this newsletter you are consenting to receiving
        emails from the The President Hotel
      </p>

      <Button type="submit" variant="solid" color="brand" className="w-full px-20! 992:w-fit">
        Subscribe
      </Button>
    </form>
  );
}

/** Per Figma (node 570:1489): per-topic newsletter signup rows on the subscribe page. */
export function SubscribeByInterest() {
  return (
    <section className="general-padding bg-paper-alt/40">
      <Container variant="lg">
        <Stack
          gap={100}
          tabletGap={80}
          mobileGap={70}
          className="1024:px-38 px-11">
          {TOPICS.map((topic) => (
            <FadeIn key={topic.eyebrow}>
              <div className="flex flex-wrap items-center gap-x-60 gap-y-40 max-992:flex-col">
                <div className="relative aspect-622/494 min-w-0 overflow-hidden rounded-card max-992:w-full 992:max-w-622 992:flex-1">
                  <Image
                    src={topic.image}
                    alt={topic.alt}
                    fill
                    sizes="(min-width: 993px) 622px, 100vw"
                    className="object-cover"
                  />
                </div>

                <Stack
                  align="center"
                  gap={25}
                  tabletGap={25}
                  mobileGap={25}
                  className="992:max-w-450 992:flex-1 992:items-start">
                  <span className="w-full text-center font-accent text-16 leading-11 tracking-5 text-accent uppercase 992:text-left">
                    {topic.eyebrow}
                  </span>
                  <Heading level={4} className="w-full text-center text-wrap 992:text-left">
                    {topic.heading}
                  </Heading>
                  <TopicSignupForm topic={topic} />
                </Stack>
              </div>
            </FadeIn>
          ))}
        </Stack>
      </Container>
    </section>
  );
}
