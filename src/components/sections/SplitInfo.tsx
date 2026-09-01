import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { FadeIn } from '@/components/FadeIn'

type PolicyRow = {
  label: string
  value: string
}

const POLICY_ROWS: PolicyRow[] = [
  { label: 'Policy', value: 'Dogs only (up to 2 per room). Dogs must be well-behaved and vaccinated.' },
  { label: 'Pet fee', value: 'R250 per dog per night. Covers bed, bowls, and treats on arrival.' },
  { label: 'On-site', value: 'R250 per dog per night. Covers bed, bowls, and treats on arrival.' },
]

/** Per Figma (node 242:1480): intro copy beside a bordered policy summary card. */
export function SplitInfo() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="grid grid-cols-2 gap-x-60 max-992:grid-cols-1 max-992:gap-y-80 1024:px-38 px-11">
          <Stack align="start" justify="center" gap={35} tabletGap={35} mobileGap={35}>
            <FadeIn>
              <Stack gap={30} tabletGap={30} mobileGap={30}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">Pets</span>
                <Stack gap={25} tabletGap={25} mobileGap={25}>
                  <Heading level={3} size={3} className="max-w-517 text-wrap">
                    About Pets at The President
                  </Heading>
                  <Prose color="ink-light" className="max-w-517">
                    Your beloved pet will feel at home at The President! Simply inform our reservations team that your
                    furry friend will be travelling with you and we&apos;ll handle the arrangements.
                  </Prose>
                </Stack>
              </Stack>
            </FadeIn>            
            <FadeIn>              
              <Button as="a" href="#" variant="solid" color="brand">
                Book now
              </Button>
            </FadeIn>
          </Stack>

          <Stack
            gap={45}
            tabletGap={40}
            mobileGap={40}
            className="rounded-card border border-brand/10 bg-paper-alt px-45 py-40 max-992:py-50 max-992:px-25 shadow-policy"
          >
            <Stack gap={45} tabletGap={45} mobileGap={45}>
              <FadeIn>
                <Heading level={4} color="brand" uppercase={false} className="capitalize">
                  Pet Policy
                </Heading>
              </FadeIn>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                {POLICY_ROWS.map((row) => (
                  <FadeIn key={row.label}>
                    <Stack direction="row" gap={25} tabletGap={25} mobileGap={25}>
                      <span className="w-90 shrink-0 font-accent text-15 tracking-5 text-brand uppercase">
                        {row.label}
                      </span>
                      <Prose color="ink-light">{row.value}</Prose>
                    </Stack>
                  </FadeIn>
                ))}
              </Stack>
            </Stack>
            <FadeIn>
              <Button as="a" href="#" variant="glass" color="brand">
                View pup info
              </Button>
            </FadeIn>
          </Stack>
        </div>
      </Container>
    </section>
  )
}
