import Image from 'next/image'
import Link from 'next/link'

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/icons'
import { Container, Heading, Stack } from '@/components/ui'

type ContactRow = {
  label: string
  value: string | string[]
}

const DEFAULT_ROWS: ContactRow[] = [
  { label: 'Address', value: 'Sea Point Promenade, Sea Point, Cape Town, 8005' },
  { label: 'Phone', value: '+27 21 434 9111' },
  { label: 'Email', value: 'reservations@thepresident.co.za' },
  { label: 'Check-in', value: '14:00 · Check-out: 11:00' },
  { label: 'Parking', value: 'Street parking + secure paid' },
]

const socialLinks = [
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'TikTok', Icon: TikTokIcon },
  { label: 'LinkedIn', Icon: LinkedInIcon },
  { label: 'YouTube', Icon: YouTubeIcon },
  { label: 'X', Icon: XIcon },
  { label: 'Pinterest', Icon: PinterestIcon },
  { label: 'Instagram', Icon: InstagramIcon },
]

/** Per Figma (node 348:1480 desktop, 1:19183 mobile, 358:1496 contact-page variant): contact details beside an image. */
export function FindUs({
  eyebrow,
  heading = 'Contact us',
  rows = DEFAULT_ROWS,
  showFollowUs = false,
  image = '/images/find-us-map.webp',
  imageAlt = 'A map showing The President Hotel and nearby landmarks along Sea Point Promenade',
  imageObjectPosition = '13% 17%',
  showDivider = true,
}: {
  eyebrow?: string
  heading?: string
  rows?: ContactRow[]
  showFollowUs?: boolean
  image?: string
  imageAlt?: string
  imageObjectPosition?: string
  showDivider?: boolean
}) {
  return (
    <>
      <section className="general-padding">
        <Container variant="lg">
          <div className="flex max-1512:justify-between 1512:justify-center gap-x-60 1199:gap-x-100 max-992:flex-col max-992:gap-y-50 1024:px-38 px-11">
            <Stack align="start" justify="center" gap={50} tabletGap={35} mobileGap={35} className="max-w-517">
              <Stack gap={30} tabletGap={30} mobileGap={30}>
                {eyebrow && (
                  <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">{eyebrow}</span>
                )}
                <Heading level={3} className="text-wrap">
                  {heading}
                </Heading>
              </Stack>

              <Stack gap={25} tabletGap={35} mobileGap={25} className="w-full">
                {rows.map((row) => (
                  <Stack key={row.label} direction="row" align="start" gap={30} tabletGap={30} mobileGap={30}>
                    <span className="w-85 mt-3 shrink-0 whitespace-nowrap font-accent text-15 tracking-5 text-brand uppercase">
                      {row.label}
                    </span>
                    {Array.isArray(row.value) ? (
                      <Stack gap={5} tabletGap={5} mobileGap={5}>
                        {row.value.map((line) => (
                          <span
                            key={line}
                            className="font-body font-light text-15 leading-copy tracking-5 text-ink-light opacity-80"
                          >
                            {line}
                          </span>
                        ))}
                      </Stack>
                    ) : (
                      <span className="font-body font-light text-15 leading-copy tracking-5 text-ink-light opacity-80">
                        {row.value}
                      </span>
                    )}
                  </Stack>
                ))}

                {showFollowUs && (
                  <Stack direction="row" align="center" gap={30} tabletGap={30} mobileGap={30}>
                    <span className="w-85 shrink-0 whitespace-nowrap font-accent text-15 tracking-5 text-brand uppercase">
                      Follow us
                    </span>
                    <Stack direction="row" align="center" gap={13} tabletGap={13} mobileGap={13}>
                      {socialLinks.map(({ label, Icon }) => (
                        <Link key={label} href="#" aria-label={label} className="text-ink duration-300 ease-in-out opacity-100 hover:opacity-80">
                          <Icon className="size-13" />
                        </Link>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <div className="relative aspect-607/550 w-607 max-992:aspect-388/351 max-992:w-full overflow-hidden rounded-card">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 993px) 607px, 100vw"
                style={{ objectPosition: imageObjectPosition }}
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>
      {showDivider && <div className="mx-26 border-t border-brand-muted/30" />}
    </>
  )
}
