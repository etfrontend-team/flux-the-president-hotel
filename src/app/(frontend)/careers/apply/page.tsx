import { CareerApplyForm } from '@/components/sections/CareerApplyForm'
import { PositionBanner } from '@/components/sections/PositionBanner'
import { Subscribe } from '@/components/sections/Subscribe'
import { site } from '@/config/site.config'

/**
 * Career application page. Per Figma (node 1:13284, "careers/apply").
 *
 * The role is carried in a `?position=` query string so one page serves every
 * listing on /careers — the design's "Executive Sous Chef" is just the example
 * role in the frame, not a fixed heading.
 */

const FALLBACK_POSITION = 'Executive Sous Chef'

function readPosition(value: string | string[] | undefined): string {
  const first = Array.isArray(value) ? value[0] : value
  return first?.trim() || FALLBACK_POSITION
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ position?: string | string[] }>
}) {
  const position = readPosition((await searchParams).position)
  return {
    title: `Apply — ${position} — ${site.brandName}`,
    description: `Apply for the ${position} role at ${site.brandName}, Cape Town.`,
  }
}

export default async function CareersApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ position?: string | string[] }>
}) {
  const position = readPosition((await searchParams).position)

  return (
    <>
      <PositionBanner title={position} />
      <CareerApplyForm position={position} />
      <Subscribe />
    </>
  )
}
