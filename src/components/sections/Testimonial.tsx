'use client'

import Image from 'next/image'
import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { Container, Stack } from '@/components/ui'

const quote =
  'Stayed at this hotel as part of a trip a deal and I cannot fault it one bit. Great area within walking distance to some great shops and the restaurants.'

export function Testimonial() {
  const sectionRef = React.useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 991px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center', '85% start'],
  })

  const translateY = useTransform(scrollYProgress, [0, 0.5, 1], ['15%', '0%', '-15%'])
  const rotateZDesktop = useTransform(scrollYProgress, [0, 0.5, 1], [7, 0, -7])
  const rotateZMobile = useTransform(scrollYProgress, [0, 0.5, 1], [3, 0, -3])
  const rotateZ = isMobile ? rotateZMobile : rotateZDesktop

  // Ruled-line background: the repeat cycle must match the paragraph's actual
  // line-height so each rule sits under a text line — 33px desktop (leading-33)
  // vs 24px mobile (15px * leading-copy's 160%).
  const ruledLineBackground = isMobile
    ? 'repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(129,147,139,0.2) 23px, rgba(129,147,139,0.2) 24px)'
    : 'repeating-linear-gradient(to bottom, transparent 0, transparent 32px, rgba(129,147,139,0.2) 32px, rgba(129,147,139,0.2) 33px)'

  return (
    <section ref={sectionRef} className="max-992:mt-15 mt-25">
      <Container variant="sm">
        <div className="relative overflow-hidden rounded-card bg-mint/50 pl-26 pr-[13%] py-100 992:pl-90 992:pr-[15%] 992:pt-180 992:pb-180">
          <motion.div
            style={{ translateY, rotateZ, willChange: 'transform', transformStyle: 'preserve-3d' }}
            className="relative max-w-888 mx-auto">
            <div
              className="absolute max-992:-bottom-35 max-992:-right-25 max-992:w-301 max-992:aspect-301/220 -bottom-95 -right-95 rotate-[6.69deg] aspect-888/585 w-837 bg-paper overflow-hidden rounded-card shadow-card origin-center"
            >
              <Image src="/images/testimonial-paper-texture.webp" alt="" fill sizes="500px" className="object-cover opacity-10" />
              <div className="absolute max-992:inset-6 inset-16 overflow-hidden rounded-5">
                <Image
                  src="/images/testimonial-back-photo.webp"
                  alt=""
                  fill
                  sizes="500px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div
              className="relative z-10 origin-center shadow-card"
            >
              <Stack
                gap={16}
                tabletGap={16}
                mobileGap={16}
                className="overflow-hidden rounded-card bg-paper shadow-card 992:aspect-888/651 992:flex-row 992:p-16"
              >
                <div className="relative h-260 w-full shrink-0 992:h-full 992:w-380 max-992:hidden">
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

                <Stack
                  justify="between"
                  gap={40}
                  tabletGap={40}
                  mobileGap={12}
                  className="relative flex-1 pt-16 pb-40 px-26 992:pt-13 992:pb-12 992:pr-21 992:pl-17"
                >
                  <div className="flex items-center justify-end">
                    <img src="/images/testimonial-postmark.svg" alt="" className="max-992:w-23 w-68 opacity-15 -mr-16" />
                    <div className="relative flex max-992:h-35 max-992:w-43 h-102 w-78 shrink-0 items-center justify-center">
                      <img
                        src="/images/testimonial-stamp-border.svg"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute max-992:inset-2 inset-8 bg-paper/50 inline-flex items-center justify-center">
                        <Image
                          src="/images/testimonial-stamp-logo.webp"
                          alt=""
                          width={46}
                          height={64}
                          className="mix-blend-multiply opacity-80 max-992:object-contain max-992:h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Stack gap={16} tabletGap={16} mobileGap={16} className="relative max-768:max-w-261">
                    <p
                      className="font-display max-992:text-15 max-992:leading-copy text-21 leading-33 text-brand/80"
                      style={{ backgroundImage: ruledLineBackground }}
                    >
                      &ldquo;{quote}&rdquo;
                    </p>
                    <span className="font-body text-11 tracking-5 text-brand-muted uppercase">- Louise M</span>
                  </Stack>

                  <div className="pointer-events-none relative flex justify-center mix-blend-multiply opacity-15 max-992:hidden">
                    <div className="relative h-204 w-274">
                      <Image
                        src="/images/testimonial-building-watermark.webp"
                        alt=""
                        fill
                        sizes="190px"
                        className="object-cover! object-center"
                      />
                    </div>
                  </div>
                </Stack>
              </Stack>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
