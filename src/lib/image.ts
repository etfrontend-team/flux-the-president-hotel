/**
 * Focal point without sharp.
 *
 * Workers can't run sharp, so we don't crop/resize on upload — instead the Media
 * collection stores a focal point (`focalX`/`focalY`, 0–100) and we honour it on the
 * front-end with CSS `object-position`. Use on a full-bleed <img>/<Image> with
 * `object-fit: cover` so the subject stays in frame across aspect ratios.
 *
 *   <Image src={media.url} fill className="object-cover"
 *          style={{ objectPosition: focalObjectPosition(media) }} />
 */
type FocalSource = { focalX?: number | null; focalY?: number | null }

export function focalObjectPosition(media: FocalSource | null | undefined): string {
  const x = media?.focalX
  const y = media?.focalY
  if (typeof x !== 'number' || typeof y !== 'number') return 'center'
  return `${clamp(x)}% ${clamp(y)}%`
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value))
}
