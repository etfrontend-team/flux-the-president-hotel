import Image from 'next/image'

import { FadeIn } from '@/components/FadeIn'
import { Button, Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type ImageAspect = 'default' | 'square' | 'wide'

const imageAspectClasses: Record<ImageAspect, string> = {
  default: '992:max-w-607 992:flex-1 aspect-607/560 max-992:aspect-388/326',
  square: '992:max-w-494 992:flex-1 aspect-square',
  wide: '992:max-w-607 992:flex-1 aspect-607/494 max-992:aspect-388/326',
}

const imageSizes: Record<ImageAspect, string> = {
  default: '(min-width: 993px) 607px, 100vw',
  square: '(min-width: 993px) 494px, 100vw',
  wide: '(min-width: 993px) 607px, 100vw',
}

export function SplitContent({
  imagePosition = 'right',
  eyebrow = 'SUPPORT',
  heading = 'Pup High Tea & Dining',
  meta,
  description = 'Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content.',
  list,
  note,
  buttonLabel = 'View pup menu',
  buttonHref = '#',
  image = '/images/split-content-pup-dining.webp',
  alt = 'A dog sniffing a plate of high-tea sandwiches set on the lawn',
  imageObjectPosition,
  imageAspect = 'default',
  className,
}: {
  imagePosition?: 'left' | 'right'
  eyebrow?: string | null
  heading?: string
  meta?: string
  description?: string | string[]
  list?: string[]
  note?: string
  buttonLabel?: string | null
  buttonHref?: string
  image?: string
  alt?: string
  imageObjectPosition?: string
  imageAspect?: ImageAspect
  className?: string
}) {
  const isImageOnRight = imagePosition === 'right'

  return (
    <section className={cn('general-padding', className)}>
      <Container variant="lg">
        <div className="flex flex-wrap max-992:flex-col max-1199:justify-between gap-x-60 1199:gap-x-100 max-992:gap-y-50 1024:px-38 px-11">
          <Stack
            align="start"
            justify="center"
            gap={35}
            tabletGap={35}
            mobileGap={35}
            className={isImageOnRight ? 'order-1 max-992:order-0' : 'order-2 max-992:order-0'}
          >
            <FadeIn>
              <Stack gap={25} tabletGap={25} mobileGap={25}>
                {eyebrow && (
                  <span className="font-accent text-16 leading-11 tracking-5 text-accent uppercase">
                    {eyebrow}
                  </span>
                )}
                <Heading level={3} className="992:max-w-565 text-wrap">
                  {heading}
                </Heading>
                {meta && (
                  <span className="font-body text-14 leading-12 tracking-10 text-brand-muted uppercase">{meta}</span>
                )}
                <Prose color="ink-light" className="max-992:max-w-full max-w-517">
                  {description}
                </Prose>
                {list && list.length > 0 && (
                  <Prose color="ink-light" className="max-992:max-w-full max-w-517">
                    <ul>
                      {list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Prose>
                )}
                {note && (
                  <Prose color="ink-light" className="max-992:max-w-full max-w-517 text-11">
                    {note}
                  </Prose>
                )}
              </Stack>
            </FadeIn>
            {buttonLabel && (
              <FadeIn>
                <Button as="a" href={buttonHref} variant="glass" color="brand">
                  {buttonLabel}
                </Button>
              </FadeIn>
            )}
          </Stack>

          <div
            className={cn(
              'relative min-w-0 max-992:w-full max-992:flex-none overflow-hidden rounded-card',
              isImageOnRight ? 'order-2 max-992:order-0' : 'order-1 max-992:order-0',
              imageAspectClasses[imageAspect],
            )}
            >
            <FadeIn>
              <Image
                src={image}
                alt={alt}
                fill
                sizes={imageSizes[imageAspect]}
                className="object-cover"
                style={imageObjectPosition ? { objectPosition: imageObjectPosition } : undefined}
              />
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}
