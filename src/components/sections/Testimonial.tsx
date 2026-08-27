'use client'

import Image from 'next/image'
import React from 'react'

import { Container } from '@/components/ui'

const quote =
  'Stayed at this hotel as part of a trip a deal and I cannot fault it one bit. Great area within walking distance to some great shops and the restaurants.'


export function Testimonial() {
  const frontCardRef = React.useRef<HTMLDivElement>(null)
  const backCardRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    function applyRotation(node: HTMLDivElement | null) {
      if (!node) return
      const rect = node.getBoundingClientRect()
      const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2
      const progress = Math.max(-1, Math.min(1, distanceFromCenter / window.innerHeight))
      node.style.rotate = `${progress * 15}deg`
      node.style.transform = `skewX(${progress * 4}deg)`
    }

    function update() {
      applyRotation(frontCardRef.current)
      applyRotation(backCardRef.current)
      frame = 0
    }

    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="pt-25">
      <Container variant="sm">
        <div className="relative overflow-hidden rounded-card bg-mint/50 p-40 992:px-90 992:py-180">
          <div className="relative mx-auto max-w-888 992:mx-auto">
            <div ref={backCardRef} className="absolute -bottom-45 -right-45 hidden aspect-888/585 w-837 bg-paper overflow-hidden rounded-card shadow-card 992:block will-change-transform origin-center">
              <Image src="/images/testimonial-paper-texture.webp" alt="" fill sizes="500px" className="object-cover opacity-10" />
              <div className="absolute inset-16 overflow-hidden rounded-5">
                <Image
                  src="/images/testimonial-back-photo.webp"
                  alt=""
                  fill
                  sizes="500px"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div ref={frontCardRef} className="relative z-10 will-change-transform origin-center shadow-card">
              <div className="flex flex-col overflow-hidden rounded-card bg-paper shadow-card 992:aspect-888/651 992:flex-row p-16 gap-16">
                <div className="relative h-260 w-full shrink-0 992:h-full 992:w-380">
                  <div className="absolute inset-0 overflow-hidden rounded-5">
                    <Image
                      src="/images/testimonial-front-photo.webp"
                      alt="A beach picnic beside a striped umbrella on the rocks"
                      fill
                      sizes="(min-width: 992px) 400px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="hidden w-px self-stretch bg-brand-muted/40 992:block" />

                <div className="relative flex flex-1 flex-col justify-between gap-40 p-30 992:pt-13 992:pb-12 992:pr-21 992:pl-17">
                  <div className="flex items-center justify-end">
                    <img src="/images/testimonial-postmark.svg" alt="" className="w-68 opacity-15 -mr-16" />
                    <div className="relative flex h-102 w-78 shrink-0 items-center justify-center">
                      <img
                        src="/images/testimonial-stamp-border.svg"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-8 bg-paper/50 inline-flex items-center justify-center">
                        <Image
                          src="/images/testimonial-stamp-logo.webp"
                          alt=""
                          width={46}
                          height={64}
                          className="mix-blend-multiply opacity-80"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative flex flex-col gap-16"
                  >
                    <p
                      className="font-display text-21 leading-33 text-brand/80"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(to bottom, transparent 0, transparent 32px, rgba(129,147,139,0.2) 32px, rgba(129,147,139,0.2) 33px)',
                      }}
                    >
                      &ldquo;{quote}&rdquo;
                    </p>
                    <span className="font-body text-11 tracking-5 text-brand-muted uppercase">- Louise M</span>
                  </div>

                  <div className="pointer-events-none relative flex justify-center mix-blend-multiply opacity-15">
                    <div className="relative h-204 w-274">
                      <Image
                        src="/images/testimonial-building-watermark.webp"
                        alt=""
                        fill
                        sizes="190px"
                        className="!object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
