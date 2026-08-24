import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Integration tests use the Payload Local API (server-side) and load wrangler/esbuild via the
    // Cloudflare config. esbuild's TextEncoder invariant breaks under jsdom, so run them in node.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Run all int spec files in ONE process sharing ONE module realm. Each file's Payload config
    // spins up a Miniflare `workerd` for the local D1; two workerd (parallel files, or isolated
    // realms that re-evaluate the config) contend on the shared SQLite WAL and crash with
    // `database is locked: SQLITE_BUSY_RECOVERY`. `fileParallelism: false` + `isolate: false` keeps
    // a single realm, so the platform proxy cached on globalThis (see src/payload.config.ts) is
    // reused ⇒ one workerd, no contention. See docs/UPGRADING.md note on SQLITE_BUSY + orphaned workerd.
    fileParallelism: false,
    isolate: false,
  },
})
