/** @format */

import Image from "next/image";

import { FadeIn } from "@/components/FadeIn";
import { Button, Container, Heading, Prose, Stack } from "@/components/ui";

type Voucher = {
  title: string;
  description: string;
  price: string;
  image?: string;
  alt?: string;
};

const VOUCHERS: Voucher[] = [
  {
    title: "Accommodation voucher",
    description:
      "Valid against any room type. Guest selects dates on redemption.",
    price: "From R1 000",
  },
  {
    title: "Dining voucher",
    description: "Redeemable at all President Hotel restaurants and bars.",
    price: "From R250",
  },
  {
    title: "Spa voucher",
    description: "Cove Wellness Spa treatments and packages.",
    price: "From R500",
  },
  {
    title: "Experience voucher",
    description: "Beach picnics, activities, SANCCOB experience, and more.",
    price: "From R1 000",
  },
];

/** Per Figma (node 553:1482 desktop, 553:1483 mobile): a 3-up grid of gift vouchers. */
export function ChooseGift() {
  return (
    <section className="general-padding overflow-hidden">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <FadeIn>
            <Stack
              align="center"
              gap={30}
              tabletGap={30}
              mobileGap={30}
              className="mb-70 max-992:mb-50 text-center">
              <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                Gifts
              </span>
              <Heading level={2} size={3} className="max-w-864 text-center">
                Choose your gift
              </Heading>
            </Stack>
          </FadeIn>

          <div className="grid grid-cols-1 gap-x-40 gap-y-50 992:grid-cols-3 992:gap-y-100">
            {VOUCHERS.map((voucher) => (
              <FadeIn key={voucher.title}>
                <article className="group flex flex-col gap-35">
                  <div className="relative aspect-388/315 w-full overflow-hidden rounded-card">
                    <Image
                      src={voucher.image ?? "/images/placeholder.webp"}
                      alt={
                        voucher.image
                          ? (voucher.alt ?? voucher.title)
                          : `Photo coming soon for ${voucher.title}`
                      }
                      fill
                      sizes="(min-width: 993px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>

                  <Stack gap={30} tabletGap={30} mobileGap={30}>
                    <Stack gap={25} tabletGap={25} mobileGap={25}>
                      <Heading level={4} uppercase={false} className="capitalize">
                        {voucher.title}
                      </Heading>
                      <Prose color="ink-light" className="max-w-318">
                        {voucher.description}
                      </Prose>
                    </Stack>
                    <p className="font-display font-normal text-14 leading-12 tracking-10 text-accent capitalize">
                      {voucher.price}
                    </p>
                    <Button
                      as="a"
                      href="#"
                      variant="link"
                      color="brand"
                      className="text-13">
                      Purchase
                    </Button>
                  </Stack>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <Stack align="center" className="mt-70 max-992:mt-50">
              <Button as="a" href="#" variant="glass" color="brand">
                Load more
              </Button>
            </Stack>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
