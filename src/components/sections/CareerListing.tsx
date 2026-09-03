import { Fragment } from 'react'
import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type Job = {
  title: string
  href?: string
}

type CategoryGroup = {
  category: string
  jobs: Job[]
}

const GROUPS: CategoryGroup[] = [
  {
    category: 'Guest Experience',
    jobs: [
      { title: 'Senior Guest Experience Host' },
      { title: 'Senior Guest Experience Host' },
    ],
  },
  {
    category: 'Food & Beverage',
    jobs: [{ title: 'Head Chef' }, { title: 'Sous Chef' }, { title: 'Front-of-House Manager' }],
  },
]

export function CareerListing() {
  return (
    <section className="general-padding">
      <Container variant="lg">
        <div className="1024:px-38 px-11">
          <FadeIn>
            <Stack align="center" gap={30} tabletGap={30} mobileGap={30} className="mb-100 text-center max-992:mb-60">
              <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">Join our team</span>
              <Stack align="center" gap={35} tabletGap={35} mobileGap={35}>
                <Heading level={3} className="max-w-864 text-wrap">
                  Working at The President
                </Heading>
                <Prose color="ink-light" className="max-w-810">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
                </Prose>
              </Stack>
            </Stack>
          </FadeIn>

          {GROUPS.map((group, groupIndex) => (
            <FadeIn key={group.category}>
              <div className={cn(groupIndex > 0 && 'mt-155 max-992:mt-100')}>
                <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                  {group.category}
                </span>
                <div className="mt-55 border-t border-brand-muted/30 max-992:mt-30" />

                {group.jobs.map((job, jobIndex) => (
                  <Fragment key={`${group.category}-${job.title}-${jobIndex}`}>
                    <Stack
                      direction="row"
                      mobileDirection="col"
                      align="center"
                      justify="between"
                      gap={20}
                      tabletGap={20}
                      mobileGap={20}
                      className="h-124 max-992:h-auto max-992:items-start max-992:py-25 transition-colors duration-300 hover:bg-paper-alt/30"
                    >
                      <Heading level={4} uppercase={false} className="capitalize">
                        {job.title}
                      </Heading>
                      <Button as="a" href={job.href ?? '#'} variant="glass" color="brand">
                        Apply now
                      </Button>
                    </Stack>
                    <div className="border-t border-brand-muted/30" />
                  </Fragment>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
