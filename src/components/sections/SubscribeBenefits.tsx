/** @format */

import { FadeIn } from "@/components/FadeIn";
import { Container, Heading, Prose, Stack } from "@/components/ui";

const BENEFITS = [
  { title: "Exclusive rates", description: "Before they go public" },
  { title: "Seasonal stories", description: "Behind the scenes" },
  { title: "What's On", description: "Monthly event listings" },
  { title: "Hotel news", description: "New menus & experiences" },
];

export function SubscribeBenefits() {
  return (
    <section className="py-50 max-992:py-40">
      <Container variant="lg">
        <div className="flex flex-col divide-y divide-brand-muted/30 992:grid 992:grid-cols-4 992:gap-x-20 992:divide-x 992:divide-y-0">
          {BENEFITS.map((benefit, index) => (
            <FadeIn
              key={benefit.title}
              className={`992:py-0 ${
                index === 0
                  ? "pb-30"
                  : index === BENEFITS.length - 1
                    ? "pt-30"
                    : "py-30"
              }`}>
              <Stack
                align="center"
                gap={20}
                tabletGap={20}
                mobileGap={20}
                className="px-20 text-center">
                <Heading level={4} uppercase={false} className="capitalize">
                  {benefit.title}
                </Heading>
                <Prose color="ink-light">{benefit.description}</Prose>
              </Stack>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
