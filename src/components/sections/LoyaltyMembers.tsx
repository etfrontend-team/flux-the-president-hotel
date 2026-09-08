/** @format */

import Image from "next/image";

import { FadeIn } from "@/components/FadeIn";
import { Button, Container, Heading, Prose, Stack } from "@/components/ui";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "10% off your bill*",
  "Special rewards and discounts after every 5 visits or on your birthday",
  "Enjoy exclusive monthly special offers and promotions",
  "It's as easy as Eat. Drink. Earn..",
];

/** Per Figma (node 553:1484): the Loyalty Members promo on the vouchers page. */
export function LoyaltyMembers({ className }: { className?: string }) {
  return (
    <section className={cn("general-padding", className)}>
      <Container variant="lg">
        <div className="flex flex-wrap gap-x-71 gap-y-50 max-992:flex-col 1024:px-38 px-11">
          <div className="relative aspect-square min-w-0 overflow-hidden rounded-card max-992:w-full 992:max-w-494 992:flex-1">
            <FadeIn>
              <Image
                src="/images/split-content-loyalty-vip.webp"
                alt="A woman in a wide-brimmed sun hat sipping a cocktail poolside"
                fill
                sizes="(min-width: 993px) 494px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(45,7,0,0.2)_6.83%,rgba(102,102,102,0)_21.49%)]"
              />
            </FadeIn>
          </div>

          <Stack
            align="start"
            justify="center"
            gap={35}
            tabletGap={35}
            mobileGap={35}
            className="992:flex-1">
            <FadeIn>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                  Loyalty members
                </span>
                <Heading level={3} className="992:max-w-565 text-wrap">
                  Not only is signing up free, but you get plenty of extra
                  exclusive benefits too.
                </Heading>
                <Prose
                  color="ink"
                  className="max-992:max-w-full max-w-517 font-normal">
                  *As a Presidential VIP you will enjoy:
                </Prose>
                <Prose
                  color="ink-light"
                  className="max-992:max-w-full max-w-517">
                  <ul>
                    {BENEFITS.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </Prose>
                <Prose
                  color="ink-light"
                  className="max-992:max-w-full max-w-517 text-11">
                  *T&apos;s &amp; C&apos;s apply. Vouchers will be valid for 1
                  year. Only to be redeemed on food and beverage items at the
                  President Hotel. Not valid for use with any other special
                  offers
                </Prose>
              </Stack>
            </FadeIn>
            <FadeIn>
              <Button as="a" href="/loyalty" variant="glass" color="brand">
                Learn more
              </Button>
            </FadeIn>
          </Stack>
        </div>
      </Container>
    </section>
  );
}
