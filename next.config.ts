import { withPayload } from '@payloadcms/next/withPayload'

import { INDEXABLE_HOST_PATTERN, NOINDEX_HEADER, NOINDEX_VALUE } from './src/lib/indexing'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep every non-live host out of the search index. `*.workers.dev` (both Workers plus every
  // per-version preview URL) and `staging.<domain>` are reachable long before — and after — the
  // custom domain goes live, so the directive is host-gated rather than APP_ENV-gated.
  // See src/lib/indexing.ts for why, and src/app/robots.ts for the paired robots.txt.
  async headers() {
    return [
      {
        // Every path, including /admin and /api — which src/middleware.ts's matcher excludes.
        source: '/:path*',
        // Applied only when the Host does NOT match an indexable host. A missing Host header
        // fails the match, so the header IS applied — the fail-safe direction.
        missing: [{ type: 'host' as const, value: INDEXABLE_HOST_PATTERN }],
        headers: [{ key: NOINDEX_HEADER, value: NOINDEX_VALUE }],
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      // Static, code-owned brand assets (logo, hero imagery) — not CMS content.
      {
        pathname: '/images/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
