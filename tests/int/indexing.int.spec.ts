import { describe, it, expect } from 'vitest'

import { indexableHosts, site } from '@/config/site.config'
import { INDEXABLE_HOST_PATTERN, isIndexableHost } from '@/lib/indexing'

/**
 * Guards the host allow-list that keeps every non-live host out of the search index.
 *
 * The regex assertions matter more than they look: OpenNext tests the `missing` host value with
 * `new RegExp(value).test(host)` — unanchored — so this spec deliberately compiles the pattern
 * WITHOUT adding anchors, mirroring OpenNext exactly. If an OpenNext upgrade changes
 * `routeHasMatcher`, or someone drops the `^…$` / `(?:…)` from INDEXABLE_HOST_PATTERN, these fail.
 */
describe('indexing host allow-list', () => {
  const workersDev = `${site.slug}.flux.workers.dev`
  const workersDevStaging = `${site.slug}-staging.flux.workers.dev`
  const workersDevPreview = `ab12cd-${site.slug}.flux.workers.dev`

  describe('isIndexableHost', () => {
    it('allows the apex and www hosts', () => {
      expect(isIndexableHost(site.domain)).toBe(true)
      expect(isIndexableHost(`www.${site.domain}`)).toBe(true)
    })

    it('normalises case and strips the port', () => {
      expect(isIndexableHost(`WWW.${site.domain.toUpperCase()}`)).toBe(true)
      expect(isIndexableHost(`${site.domain}:443`)).toBe(true)
    })

    it('rejects every workers.dev host, including per-version preview URLs', () => {
      expect(isIndexableHost(workersDev)).toBe(false)
      expect(isIndexableHost(workersDevStaging)).toBe(false)
      expect(isIndexableHost(workersDevPreview)).toBe(false)
    })

    it('rejects the staging subdomain and localhost', () => {
      expect(isIndexableHost(`staging.${site.domain}`)).toBe(false)
      expect(isIndexableHost('localhost:3000')).toBe(false)
    })

    it('rejects an absent or empty Host header', () => {
      expect(isIndexableHost(null)).toBe(false)
      expect(isIndexableHost(undefined)).toBe(false)
      expect(isIndexableHost('')).toBe(false)
    })

    it('rejects hosts that merely contain an indexable host', () => {
      expect(isIndexableHost(`${site.domain}.attacker.example`)).toBe(false)
      expect(isIndexableHost(`not${site.domain}`)).toBe(false)
    })
  })

  describe('INDEXABLE_HOST_PATTERN', () => {
    // Compiled the way OpenNext compiles it: no added anchors.
    const openNextMatcher = new RegExp(INDEXABLE_HOST_PATTERN)
    // Compiled the way Next's own dev server compiles it: wrapped in ^…$.
    const nextDevMatcher = new RegExp(`^${INDEXABLE_HOST_PATTERN}$`)

    it('matches every indexable host under both matchers', () => {
      for (const host of indexableHosts) {
        expect(openNextMatcher.test(host)).toBe(true)
        expect(nextDevMatcher.test(host)).toBe(true)
      }
    })

    it('is anchored, so it does not match a host that merely contains an indexable host', () => {
      for (const matcher of [openNextMatcher, nextDevMatcher]) {
        expect(matcher.test(`${site.domain}.attacker.example`)).toBe(false)
        expect(matcher.test(`not${site.domain}`)).toBe(false)
        expect(matcher.test(`prefix-www.${site.domain}`)).toBe(false)
      }
    })

    it('does not match preview or local hosts', () => {
      for (const matcher of [openNextMatcher, nextDevMatcher]) {
        expect(matcher.test(workersDev)).toBe(false)
        expect(matcher.test(workersDevStaging)).toBe(false)
        expect(matcher.test(workersDevPreview)).toBe(false)
        expect(matcher.test(`staging.${site.domain}`)).toBe(false)
        expect(matcher.test('localhost')).toBe(false)
      }
    })

    it('escapes dots so they cannot act as wildcards', () => {
      // `my-app.com` must not match `my-appXcom`.
      const wildcarded = site.domain.replace(/\./g, 'X')
      for (const matcher of [openNextMatcher, nextDevMatcher]) {
        expect(matcher.test(wildcarded)).toBe(false)
      }
    })
  })
})
