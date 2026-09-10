'use client'

import Image from 'next/image'
import { useEffect, useState, type FormEvent } from 'react'

import { CloseIcon } from '@/components/icons'
import { Heading } from '@/components/ui'

/**
 * Newsletter sign-up card that eases in at the bottom-right of the Media Hub.
 * Per Figma node 1:11011 ("Media Hub popup", annotated "Pop-up on Media Hub").
 *
 * The design's card fill is two layers (node 1:11012): brand navy at 90% opacity with
 * the hotel line-illustration composited over it at 10%. The illustration is the same
 * asset the footer uses, so it reuses `footer-illustration.webp` rather than shipping a
 * second, flattened copy — but at plain 10% here, not the footer's multiply blend, since
 * the design applies no blend mode.
 *
 * Dismissal is remembered per browser so the card doesn't reappear on every visit;
 * the storage read/write is wrapped because Safari's private mode throws on both.
 *
 * UI only — no newsletter provider is wired up, matching Subscribe's placeholder
 * convention for unspecified backend behaviour.
 */

const STORAGE_KEY = 'president:media-hub-popup-dismissed'

/**
 * A dismissal stops the card coming back for a month, then it asks once more —
 * storing a timestamp rather than a flag, so a stale value can never hide the card
 * permanently (which also makes it far easier to review).
 */
const DISMISS_FOR_MS = 30 * 24 * 60 * 60 * 1000

/** Long enough that the card reads as an invitation rather than an interruption. */
const REVEAL_DELAY_MS = 1600

/** `?popup=1` forces the card open regardless of a stored dismissal, for design review. */
const FORCE_PARAM = 'popup'

/**
 * Figma nodes 1:11018 etc. — the label doubles as the placeholder over a hairline rule.
 * The placeholder keeps the design's ink colour; what the guest types is white, so it
 * reads against the navy card.
 */
const FIELD_CLASSES =
  'w-full border-b border-brand-muted bg-transparent pb-11 font-body text-13 leading-23 tracking-5 text-paper capitalize transition-colors duration-300 placeholder:text-ink placeholder:capitalize focus:border-paper focus:outline-none'

/** Figma node 1:11038 — outlined in white, 14px label at 5% tracking, full card width. */
const SUBMIT_CLASSES =
  'flex w-full cursor-pointer items-center justify-center rounded-5 border border-paper px-25 py-15 font-body text-14 leading-12 tracking-5 text-paper uppercase backdrop-blur-[1px] transition-colors duration-300 hover:bg-paper hover:text-brand'

/** Figma nodes 1:11032 / 1:11035 — 14px circles with a sage outline. */
const RADIO_CLASSES =
  'size-14 shrink-0 cursor-pointer appearance-none rounded-full border border-brand-muted transition-colors duration-300 checked:border-paper checked:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'

const AUDIENCE_OPTIONS = ['Guest', 'Travel Agent'] as const

export function MediaHubPopup() {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get(FORCE_PARAM) === '1'

    if (!forced) {
      let dismissedAt = 0
      try {
        dismissedAt = Number(window.localStorage.getItem(STORAGE_KEY)) || 0
      } catch {
        // Storage blocked — show the card and simply don't remember the dismissal.
      }
      if (Date.now() - dismissedAt < DISMISS_FOR_MS) return
    }

    const timer = setTimeout(() => setVisible(true), REVEAL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // Nothing to do — the card just reappears next visit.
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sent')
  }

  return (
    // Two elements on purpose: the outer one only positions the card and runs the
    // entrance (element opacity + translate), so the card surface carries no opacity
    // of its own — see the `::before` fill layer below.
    <div
      aria-hidden={!visible}
      className={`fixed right-25 bottom-25 z-30 w-[calc(100vw-30px)] max-w-434 transition-[opacity,translate] duration-700 ease-out max-992:right-15 max-992:bottom-15 motion-reduce:transition-none ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-20 opacity-0 motion-reduce:translate-y-0'
      }`}
    >
      {/* The 90% navy fill lives on a `::before` layer rather than on the card itself, so
          nothing on the card inherits it — the pseudo-element sits first in tree order, with
          the illustration and then the content painting over it, matching the design's
          fill stack (navy 90%, illustration 10%). */}
      <aside
        aria-label="Newsletter sign-up"
        className="relative overflow-hidden rounded-card before:absolute before:inset-0 before:bg-brand before:opacity-90 before:content-['']"
      >
        <Image
          src="/images/footer-illustration.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="434px"
          className="pointer-events-none object-cover opacity-10"
        />

        {/* Figma node 1:11040 — 16px cross, 25px in from the top-right corner. */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close newsletter sign-up"
          className="absolute top-24 right-25 z-1 cursor-pointer text-paper transition-opacity duration-300 hover:opacity-70"
        >
          <CloseIcon className="size-16" />
        </button>

        <div className="relative flex flex-col gap-47 px-70 pt-58 pb-66 max-992:gap-35 max-992:px-30 max-992:pt-50 max-992:pb-40">
          {/* `text-wrap` overrides Heading's default `text-balance`: the design breaks the
            line greedily at its 281px width ("…for the / …news and / promotions."), which
            balancing rewrites into a shorter second line. */}
          <Heading level={2} size={4} color="paper" className="max-w-281 text-wrap">
            Sign up for the latest news and promotions.
          </Heading>

          {status === 'sent' ? (
            <p className="font-body text-13 leading-23 tracking-5 text-paper">
              Thank you — you are on the list. Look out for our next dispatch from Sea Point.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-34">
              <input name="firstName" placeholder="First Name" autoComplete="given-name" className={FIELD_CLASSES} />
              <input name="lastName" placeholder="Last Name" autoComplete="family-name" className={FIELD_CLASSES} />
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email Address"
                className={`${FIELD_CLASSES} normal-case`}
              />

              <fieldset className="flex flex-col gap-24">
                <legend className="mb-20 font-body text-14 leading-12 tracking-5 text-paper uppercase">I am:</legend>

                <div className="flex flex-col gap-10">
                  {AUDIENCE_OPTIONS.map((option, index) => (
                    <label key={option} className="flex cursor-pointer items-center gap-9">
                      <input
                        type="radio"
                        name="audience"
                        value={option}
                        defaultChecked={index === 0}
                        className={RADIO_CLASSES}
                      />
                      <span className="font-body text-13 leading-23 tracking-5 text-paper/80 capitalize">{option}</span>
                    </label>
                  ))}
                </div>

                <p className="font-body text-10 leading-muted font-light tracking-5 text-paper/60">
                  *By signing up for this newsletter you are consenting to receiving emails from the The President Hotel
                </p>
              </fieldset>

              <button type="submit" className={SUBMIT_CLASSES}>
                Sign up
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>
  )
}
