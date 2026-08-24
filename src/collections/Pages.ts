import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'
import { getServerURL } from '../lib/serverUrl'

/**
 * Editorial collection for marketing pages. Acts as the canonical example for:
 *  - drafts + autosave (versions) — what live preview renders and staging review approves
 *  - the SEO plugin (adds a `meta` tab, configured in payload.config.ts)
 *  - the redirects plugin (a redirect's `to.reference` can target a page)
 *
 * Off-shore teams extend this (add blocks, layout fields) per client build.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    // Public can read; drafts are excluded unless explicitly requested with `draft: true`
    // by an authenticated request (e.g. live preview).
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    // Admins and editors author content; only admins may delete (incl. published pages).
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => `${getServerURL()}/${data?.slug ?? ''}`,
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path segment, e.g. "about" → /about. Use "home" for the landing page.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
