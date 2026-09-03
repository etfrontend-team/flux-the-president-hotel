import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Stack } from '@/components/ui'

export function MediaContact({
  name = 'Courtney Patrick',
  role = 'Brand & Communications Manager',
  email = 'marketing@presidenthotel.co.za',
  buttonHref = '#',
}: {
  name?: string
  role?: string
  email?: string
  buttonHref?: string
}) {
  return (
    <section className="py-40 max-992:py-30">
      <Container variant="lg">
        <FadeIn>
          <Stack
            direction="row"
            mobileDirection="col"
            align="center"
            justify="between"
            gap={93}
            tabletGap={30}
            mobileGap={35}
            className="1024:px-38 px-11"
          >
            <Stack
              direction="row"
              mobileDirection="col"
              align="center"
              justify="between"
              gap={30}
              tabletGap={30}
              mobileGap={25}
              className="992:flex-1 max-992:text-center"
            >
              <Heading level={6} size={4} uppercase={false} className="capitalize">
                Media Contact:
              </Heading>

              <p className="font-body text-15 font-light tracking-5 text-ink">
                <span className="font-medium">{name}</span> | {role}
              </p>

              <p className="font-body text-15 font-light tracking-5 text-ink">
                Email:{' '}
                <a href={`mailto:${email}`} className="underline decoration-from-font underline-offset-2">
                  {email}
                </a>
              </p>
            </Stack>

            <Button as="a" href={buttonHref} variant="solid" color="brand" className=''>
              Media Library
            </Button>
          </Stack>
        </FadeIn>
      </Container>
    </section>
  )
}
