/**
 * reset:local:d1 — delete the local Miniflare D1 so migrations apply to a clean database.
 *
 * Used before the integration-test gate so `payload migrate` runs non-interactively (a dev-mode
 * pushed local DB otherwise prompts before migrating). No-op when no local D1 exists (e.g. fresh CI).
 */
import { wipeLocalD1 } from './_shared'

wipeLocalD1()
