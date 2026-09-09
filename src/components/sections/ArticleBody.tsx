/** @format */

"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { ChevronRightIcon } from "@/components/icons";
import { FadeIn } from "@/components/FadeIn";
import { Container, Heading, Prose } from "@/components/ui";

const CATEGORY = "Travel";
const TITLE = "The best of Cape Town: a Sea Point local's guide";
const META = "By The President Team · 12 April 2026 · 6 min read";

const NUTSHELL = [
  "[Concise takeaway #1 — direct, factual statement]",
  "[Concise takeaway #2 — direct, factual statement]",
  "[Concise takeaway #3 — direct, factual statement]",
  "[Concise takeaway #4 — direct, factual statement]",
];

const OPENING_PARAGRAPHS = [
  "[Opening paragraph — 2 to 3 sentences. Hook the reader with a relatable problem, surprising stat, or bold statement. Signal clearly what this post covers and who it's for. Include the primary keyword naturally within the first 100 words.]",
  "[Second paragraph — briefly outline what the reader will learn. Be specific. Avoid vague promises.]",
];

const SECTION_PARAGRAPHS = [
  "[100-200 words per H2 section] Lorem ipsum eu est vitae dignissim non suspendisse proin a non rhoncus sagittis elementum neque condimentum sed vehicula sit donec justo sed aliquam et lectus mattis sem cras risus ullamcorper mollis sit senectus amet mattis nunc dictum a facilisi pellentesque gravida faucibus accumsan nibh vestibulum id ullamcorper mauris venenatis metus placerat volutpat feugiat egestas in semper aliquam urna duis dolor elementum feugiat etiam vitae lorem morbi diam pharetra convallis semper nulla diam bibendum tellus aliquam placerat eleifend est dui egestas risus vulputate lacus praesent fermentum dui tellus eget consequat suspendisse consequat urna risus adipiscing penatibus ipsum vestibulum ut nunc habitasse eget ullamcorper eget congue odio nulla et enim in lorem purus aliquam sapien rhoncus in lacus aliquam bibendum volutpat risus non accumsan faucibus sollicitudin in.",
  "Feugiat tincidunt leo ac in nisl enim magna sagittis vel nullam viverra ac ornare porttitor eu enim sit diam sagittis dictumst dictum facilisis vehicula et urna dui donec neque cras laoreet mauris diam netus scelerisque quis sit semper eu id consectetur nulla urna laoreet quis dictum porttitor iaculis ullamcorper id auctor commodo quis purus facilisis quisque ornare duis commodo at arcu enim adipiscing duis urna in est libero dis semper libero amet maecenas elit aliquam.",
];

const OPTIONAL_H2 = '[Optional H2: e.g. "Why [Topic] Matters in [Year]"]';

function SectionText({ h2 = true }: { h2?: boolean }) {
  return (
    <div className="flex flex-col gap-35">
      {h2 && (
        <p className="font-body text-16 leading-display tracking-10 text-brand/80 uppercase">
          {OPTIONAL_H2}
        </p>
      )}
      <Prose color="ink-light" className="max-w-none">
        {SECTION_PARAGRAPHS}
      </Prose>
    </div>
  );
}

function AsymmetricGallery({
  images,
}: {
  images: { src: string; alt: string; objectPosition?: string }[];
}) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    [AutoScroll({ speed: 0.6, stopOnInteraction: false })],
  );

  return (
    <div className="embla relative">
      <div
        ref={emblaRef}
        className="embla__viewport cursor-grab overflow-hidden active:cursor-grabbing">
        <div className="embla__container flex -ml-15 transition-all duration-300 ease-linear">
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="embla__slide relative flex-[0_0_765px] shrink-0 pl-15 max-992:flex-[0_0_70.735%]">
              <div className="relative h-450 overflow-hidden rounded-card max-992:h-349">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 993px) 61vw, 71vw"
                  style={
                    image.objectPosition ?
                      { objectPosition: image.objectPosition }
                    : undefined
                  }
                  className="pointer-events-none object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EqualGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  function goToPrev() {
    emblaApi?.scrollPrev();
  }

  function goToNext() {
    emblaApi?.scrollNext();
  }

  return (
    <>
      <div className="hidden grid-cols-1 gap-15 992:grid 992:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.src}
            className="relative aspect-388/455 overflow-hidden rounded-card">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="embla relative max-992:block 992:hidden">
        <div
          ref={emblaRef}
          className="embla__viewport cursor-grab overflow-hidden active:cursor-grabbing">
          <div className="embla__container flex -ml-15">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="embla__slide relative flex-[0_0_100%] shrink-0 pl-15">
                <div className="relative aspect-388/455 overflow-hidden rounded-card">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    className="pointer-events-none object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous image"
          className="group/navbtn absolute left-25 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-paper/80 size-34">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
          />
          <ChevronRightIcon className="relative h-7 w-12 rotate-90 text-brand" />
        </button>
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next image"
          className="group/navbtn absolute right-25 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-paper/80 size-34">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-brand/20 opacity-0 transition-opacity duration-300 ease-out group-hover/navbtn:opacity-100"
          />
          <ChevronRightIcon className="relative h-7 w-12 -rotate-90 text-brand" />
        </button>
      </div>
    </>
  );
}

export function ArticleBody() {
  return (
    <section className="general-padding pb-0">
      <Container>
        <FadeIn className="px-38 max-992:px-0">
          <div className="flex flex-col gap-35">
            <span className="font-accent text-16 tracking-5 text-brand uppercase">
              {CATEGORY}
            </span>
            <div className="h-px w-full bg-brand-muted/30" />
            <div className="flex flex-col gap-35 max-992:gap-25">
              <Heading level={1} size={3} className="max-w-764 text-wrap">
                {TITLE}
              </Heading>
              <Prose color="ink-light" className="max-w-467">
                {META}
              </Prose>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="px-38 max-992:px-0">
          <div className="relative mt-50 aspect-1243/588 w-full overflow-hidden rounded-card 992:mt-70">
            <Image
              src="/images/article-body-hero.webp"
              alt="A guest sipping a cocktail on a sunlit terrace"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </FadeIn>

        <div className="mt-70 flex max-w-517 flex-col gap-100 992:mt-100">
          <FadeIn className="px-38 max-992:px-0">
            <div className="flex flex-col gap-35">
              <p className="font-body text-14 leading-12 tracking-10 text-brand/80 uppercase">
                In a nutshell:
              </p>
              <Prose color="ink-light" className="max-w-none">
                {NUTSHELL.map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </Prose>
            </div>
          </FadeIn>
        </div>

        <div className="mt-70 flex flex-col gap-100 992:mt-100">
          <FadeIn className="px-38 max-992:px-0">
            <div className="flex flex-col gap-35">
              <Heading level={2} size={3} className="max-w-517 text-wrap">
                Introduction
              </Heading>
              <p className="font-body text-16 leading-display tracking-10 text-brand/80 uppercase">
                {OPTIONAL_H2}
              </p>
              <Prose color="ink-light" className="max-w-none">
                {OPENING_PARAGRAPHS}
              </Prose>
            </div>
          </FadeIn>

          <FadeIn className="px-38 max-992:px-0">
            <div className="flex flex-col gap-35">
              <Heading level={2} size={3} className="max-w-517 text-wrap">
                Body Content
              </Heading>
              <Prose color="ink-light" className="max-w-none">
                {SECTION_PARAGRAPHS}
              </Prose>
            </div>
          </FadeIn>

          <FadeIn className="px-38 max-992:px-0">
            <SectionText />
          </FadeIn>

          <FadeIn>
            <AsymmetricGallery
              images={[
                {
                  src: "/images/article-body-gallery-a-center.webp",
                  alt: "A guest sunbathing poolside with palm trees and the Atlantic beyond",
                  objectPosition: "50% 85%",
                },
                {
                  src: "/images/article-body-gallery-a-left.webp",
                  alt: "A plated tomato dish with an edible flower at a hotel restaurant table",
                },
                {
                  src: "/images/article-body-gallery-a-right.webp",
                  alt: "An aerial view of poolside loungers shaded by white umbrellas",
                },
              ]}
            />
          </FadeIn>

          <FadeIn className="px-38 max-992:px-0">
            <SectionText />
          </FadeIn>

          <FadeIn className="px-38 max-992:px-0">
            <EqualGallery
              images={[
                {
                  src: "/images/split-content-mediahub-feature.webp",
                  alt: "An overhead view of a beach picnic with sandwiches, drinks, and a copy of The President Post",
                },
                {
                  src: "/images/article-body-gallery-b-2.webp",
                  alt: "Two guests looking out at a palm tree against a clear sky",
                },
                {
                  src: "/images/article-body-gallery-b-3.webp",
                  alt: "A hotel server presenting a plated fish dish on the terrace",
                },
              ]}
            />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
