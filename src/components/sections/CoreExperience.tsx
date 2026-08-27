'use client'

import Image from 'next/image'
import React from 'react'

import { Button, Heading, Prose } from '@/components/ui'
import { cn, isVideoSrc } from '@/lib/utils'

type ExperienceTab = {
  key: string
  label: string
  eyebrow: string
  heading: [string, string]
  description: string
  media: string
  /** Overrides `media` below the `max-992` breakpoint. Falls back to `media` when unset. */
  mobileMedia?: string
  alt: string
  buttonLabel: string
  href: string
}

const tabs: ExperienceTab[] = [
  {
    key: 'wellness',
    label: 'Wellness',
    eyebrow: 'Wellness',
    heading: ['Cove wellness spa —', 'your quiet sanctuary'],
    description:
      'Hot stone rituals, salt rooms and a hammam cut from a single block of marble. Treatments are drawn from the season and the shoreline.',
    media: '/images/core-experience-wellness.webp',
    alt: 'A guest receiving a hot stone massage at the spa',
    buttonLabel: 'Discover Wellness',
    href: '/wellness-and-spa/',
  },
  {
    key: 'pets',
    label: 'Pets',
    eyebrow: 'Pets',
    heading: ['Every guest arrives —', 'four legs included'],
    description: 'Linen beds turned down at the foot of yours, a garden walk at first light, and a kitchen that plates for them too.',
    media: '/images/PRESIDENTHOTEL-POOLSIDE-20260513-TOMPARKINSON-17.mp4',
    alt: 'A dog relaxing poolside',
    buttonLabel: 'Our Pet Policy',
    href: '/pets/',
  },
  {
    key: 'events',
    label: 'Events',
    eyebrow: 'Events',
    heading: ['Long tables,', 'longer evenings'],
    description: 'Private dining beneath the olive terrace, seated for twelve or ninety. Menus written the week you arrive.',
    media: '/images/core-experience-events.webp',
    alt: 'A table set for dining on the terrace',
    buttonLabel: 'Plan an Occasion',
    href: '/events/',
  },
]

/**
 * Fixed-scroll tabbed showcase (Figma node 1:2688). The wrapper reserves
 * `tabs.length * 100vh` of scroll space in normal flow; the actual visual
 * (image, nav, copy) is `position: sticky` inside it, so it stays pinned to
 * the viewport for that whole scroll range while `activeIndex`/`tabProgress`
 * — derived from how far through that range the user has scrolled — drive
 * which tab is shown and how full its progress line is. `data-pinned-section`
 * is what tells AnnouncementBar (and any future nav) to hide while this is
 * on screen, per the Figma annotation.
 */
export function CoreExperience() {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [tabProgress, setTabProgress] = React.useState(0)
  const [isMobileViewport, setIsMobileViewport] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia('(width < 992px)')
    setIsMobileViewport(query.matches)

    function onChange(event: MediaQueryListEvent) {
      setIsMobileViewport(event.matches)
    }

    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  React.useEffect(() => {
    function onScroll() {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const scrollableHeight = wrapper.offsetHeight - window.innerHeight
      if (scrollableHeight <= 0) return

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY
      const scrolled = window.scrollY - wrapperTop
      const fraction = Math.min(1, Math.max(0, scrolled / scrollableHeight))
      const scaled = fraction * tabs.length
      const index = Math.min(tabs.length - 1, Math.floor(scaled))

      setActiveIndex(index)
      setTabProgress(scaled - index)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  function goToTab(index: number) {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const scrollableHeight = wrapper.offsetHeight - window.innerHeight
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: wrapperTop + (index / tabs.length) * scrollableHeight + 1, behavior: 'smooth' })
  }

  const active = tabs[activeIndex]

  return (
    <div ref={wrapperRef} style={{ height: `${tabs.length * 100}vh` }} className="relative">
      <div data-pinned-section className="sticky top-0 h-screen w-full overflow-hidden">
        {tabs.map((tab, index) => {
          const src = isMobileViewport && tab.mobileMedia ? tab.mobileMedia : tab.media
          const revealClassName = cn(
            'object-cover transition-[clip-path] duration-800 ease-out',
            index <= activeIndex ? '[clip-path:inset(0_0_0_0%)]' : '[clip-path:inset(0_0_0_100%)]',
          )

          if (isVideoSrc(src)) {
            return (
              <video
                key={`${tab.key}-${src}`}
                src={src}
                autoPlay
                loop
                muted
                playsInline
                style={{ zIndex: index }}
                className={cn('absolute inset-0 h-full w-full', revealClassName)}
              />
            )
          }

          return (
            <Image
              key={tab.key}
              src={src}
              alt={tab.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{ zIndex: index }}
              className={revealClassName}
            />
          )
        })}

        {/* Persistent gradient — same across every tab, per Figma. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%),linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2))] max-992:bg-[linear-gradient(0deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_40%),linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.2))]"
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 max-992:h-180 h-100">
          {[
            { blur: 10, mask: 'linear-gradient(to bottom, black 0%, black 25%, transparent 40%)' },
            { blur: 7, mask: 'linear-gradient(to bottom, black 0%, black 45%, transparent 60%)' },
            { blur: 4, mask: 'linear-gradient(to bottom, black 0%, black 65%, transparent 80%)' },
            { blur: 2, mask: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)' },
          ].map(({ blur, mask }) => (
            <div
              key={blur}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_100%)]" />
        </div>

        <div className="absolute inset-x-0 top-45 max-992:top-90 z-20 flex max-992:gap-20 gap-30 px-60 max-1024:px-25">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex
            const isPast = index < activeIndex
            const fillPercent = isPast ? 100 : isActive ? tabProgress * 100 : 0

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => goToTab(index)}
                className="flex flex-1 cursor-pointer flex-col items-start gap-25 text-left"
              >
                <span
                  className={cn(
                    'font-accent text-16 tracking-5 uppercase text-paper transition-opacity duration-300 ease-out max-992:hidden',
                    isActive || isPast ? 'opacity-100' : 'opacity-40',
                  )}
                >
                  {tab.label}
                </span>
                <div className="relative h-px w-full bg-paper/40">
                  <div className="absolute inset-y-0 left-0 bg-paper/80" style={{ width: `${fillPercent}%` }} />
                </div>
              </button>
            )
          })}
        </div>

        <div
          key={activeIndex}
          className="absolute bottom-60 left-60 z-20 flex max-w-530 flex-col items-start gap-35 max-1024:left-25 max-1024:right-25 max-1024:max-w-full"
        >
          <div className="flex flex-col items-start gap-30">
            <span
              className="core-experience-line font-accent text-16 uppercase leading-display tracking-5 text-paper"
              style={{ animationDelay: '0ms' }}
            >
              {active.eyebrow}
            </span>
            <div className="flex flex-col">
              {active.heading.map((line, index) => (
                <Heading
                  key={line}
                  level={3}
                  color="paper"
                  uppercase={false}
                  className="core-experience-line"
                  style={{ animationDelay: `${80 + index * 60}ms` }}
                >
                  {line}
                </Heading>
              ))}
            </div>
          </div>
          <Prose
            color="ink-light"
            className="core-experience-line max-w-529 text-paper!"
            style={{ animationDelay: '220ms' }}
          >
            {active.description}
          </Prose>
          <Button
            as="a"
            href={active.href}
            variant="glass"
            color="paper"
            className="core-experience-line"
            style={{ animationDelay: '300ms' }}
          >
            {active.buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
