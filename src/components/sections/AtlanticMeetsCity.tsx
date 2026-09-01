import Image from 'next/image'

import { Button, Container, Heading, Stack } from '@/components/ui'
import { isVideoSrc } from '@/lib/utils'

/**
 * Figma's own fill for this frame (node 1:2421, "Full Video with Image") is
 * a video, which its API can't export as a static asset — so this points at
 * a still capture of that same frame as a placeholder. Point this at a video
 * file once one exists; `isVideoSrc` below picks it up automatically, same
 * as CoreExperience's tab media.
 */
const media = '/images/atlantic-meets-city.mp4'

/** Homepage section right below MoreThanAView. Per Figma (node 1:2421). */
export function AtlanticMeetsCity() {
  return (
    <section className="">
      <Container variant="sm">
        <div className="relative max-992:aspect-440/742 992:aspect-1390/843 overflow-hidden rounded-card after:content-[''] after:inset-0 after:absolute after:bg-black/40">
          {isVideoSrc(media) ? (
            <video
              src={media}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={media}
              alt="Aerial view of Lion's Head and Cape Town's Atlantic coastline"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}

          <Stack
            align="center"
            justify="center"
            gap={25}
            tabletGap={25}
            mobileGap={25}
            className="absolute inset-0 px-25 text-center z-1"
          >
            <Heading level={2} color="white" className="992:whitespace-nowrap">
              Where the <br /> Atlantic meets the city.
            </Heading>
            <Button as="a" href="/location/" variant="outlined" color="white">
              View location
            </Button>
          </Stack>
        </div>
      </Container>
    </section>
  )
}
