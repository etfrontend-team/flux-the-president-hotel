'use client'

import Image from 'next/image'
import React from 'react'

type LightboxImage = {
  src: string
  alt: string
  width: number
  height: number
}

type LightboxProps = {
  images: LightboxImage[]
  className?: string
  /** Render thumbnails; call `open(index)` on click to launch the viewer at that image. */
  children: (open: (index: number) => void) => React.ReactNode
}

/**
 * Full-screen image viewer. Renders thumbnails via the render-prop `children`
 * and opens a modal with prev/next navigation (arrow keys or on-screen
 * controls) and Escape/backdrop-click to close.
 */
export function Lightbox({ images, className, children }: LightboxProps) {
  const [index, setIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (index === null) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIndex(null)
      if (event.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % images.length))
      if (event.key === 'ArrowLeft')
        setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [index, images.length])

  const active = index === null ? null : images[index]

  return (
    <div className={className}>
      {children(setIndex)}

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-24"
          role="dialog"
          aria-modal="true"
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-24 right-24 text-2xl text-paper/80 hover:text-paper"
            onClick={() => setIndex(null)}
          >
            ✕
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-24 text-3xl text-paper/80 hover:text-paper"
              onClick={(event) => {
                event.stopPropagation()
                setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
              }}
            >
              ‹
            </button>
          )}

          <Image
            src={active.src}
            alt={active.alt}
            width={active.width}
            height={active.height}
            sizes="90vw"
            className="max-h-[85vh] w-auto max-w-[90vw] rounded-card object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-24 text-3xl text-paper/80 hover:text-paper"
              onClick={(event) => {
                event.stopPropagation()
                setIndex((i) => (i === null ? i : (i + 1) % images.length))
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  )
}
