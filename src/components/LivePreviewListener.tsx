'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Mount inside the front-end (e.g. in a page rendered for live preview) so the
 * admin's live-preview iframe refreshes the route whenever an editor saves a draft.
 * Pairs with `admin.livePreview` in payload.config.ts.
 *
 * `serverURL` must match the origin the admin posts messages from. The admin and
 * front-end are served by the same Worker, so the current browser origin is correct
 * in every environment — using `window.location.origin` avoids depending on
 * `NEXT_PUBLIC_SERVER_URL` (a build-time-inlined var that is empty/localhost unless
 * set at build). Resolved in an effect so SSR never touches `window`.
 */
export function LivePreviewListener() {
  const router = useRouter()
  const [serverURL, setServerURL] = useState('')

  useEffect(() => {
    setServerURL(window.location.origin)
  }, [])

  if (!serverURL) {
    return null
  }

  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
}
