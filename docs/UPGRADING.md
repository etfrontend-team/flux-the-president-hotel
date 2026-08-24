# Upgrading & the dependency coupling map

This boilerplate has tight, non-obvious version couplings. It has broken twice from version drift:

- a `wrangler` pin lagging OpenNext's peer range turned a Cloudflare-side hiccup into a hard deploy
  failure (remote-binding preview session / error 1031); and
- a `wrangler` bump silently changed the **open-beta** `kv bulk get` output shape and broke the
  nightly staging KV mirror.

**The rule: never bump a version in isolation.** Before changing any dependency, tool, GitHub
Action, or runtime version, walk the coupling map below, confirm the whole graph still agrees, then
run the full gate. Because this is a boilerplate reused across client clones, a careless bump
propagates to every clone.

> If a thing has a version, it is on this map. Verify against the **current** `package.json` /
> `wrangler.jsonc` / workflows before acting — pinned numbers here are a snapshot and will age.

---

## TL;DR — the gate before any merge

1. Read the changelog/release notes across the range you are crossing (majors especially).
2. Check peer ranges of every coupled package: `pnpm info <pkg> peerDependencies` and
   `pnpm why <pkg>`.
3. Bump coupled packages **together**, in one change (see clusters below).
4. Run locally and in CI:
   - `pnpm install --frozen-lockfile` (then commit the updated `pnpm-lock.yaml`)
   - `pnpm run lint`
   - `pnpm exec tsc --noEmit`
   - `pnpm run check:migrations`
   - `pnpm run test:int:ci`
   - a real **staging** deploy (`deploy-staging.yml` via merge to `staging`)
   - if `wrangler` or KV touched: dispatch `sync-staging.yml` and confirm the **KV** mirror step
     succeeds (the remote `kv bulk get` shape is the trap — local mode hides it)
5. Only then merge to `main`. `main` is the source of truth; production deploy is a gated manual
   approval.

---

## The single tightest knot: Next.js

`next` is squeezed between three packages with **narrow, only-partly-overlapping** ranges. This is
the first thing to check on any Next bump.

| Constraint source | Accepts `next` |
|---|---|
| `@payloadcms/next` / `@payloadcms/ui` (3.82.1) | `>=15.2.9 <15.3.0` ∥ `>=15.3.9 <15.4.0` ∥ `>=15.4.11 <15.5.0` ∥ `>=16.2.2 <17.0.0` |
| `@opennextjs/cloudflare` (1.19.11) | `>=15.5.18 <16` ∥ `>=16.2.6` |
| `eslint-config-next` (devDep) | must equal the `next` version exactly |

**Intersection of Payload ∩ OpenNext = `>=16.2.6 <17` only.**

Current state: `next` is pinned at **`15.4.11`**, which satisfies Payload but is **below OpenNext's
`15.5.18` floor**. It installs/builds only because `.npmrc` sets `legacy-peer-deps=true`, so the
OpenNext peer violation is a warning, not an error. This is a **deliberate, working** hold — the
next supported Next is a coordinated jump to **16.2.6+** (a major), which must move `next`,
`eslint-config-next`, and be re-validated against both Payload and OpenNext at once. Do not bump
`next` to a 15.5+/16.0–16.2.5 version: it would leave the Payload range without entering OpenNext's,
breaking both peers.

See also: the deferred Next 16 upgrade note in project memory.

---

## Cluster 1 — Payload (lockstep family)

Every `@payloadcms/*` package **and** `payload` itself must be the **exact same version**
(currently `3.82.1`). Their cross-peers pin `payload` to an exact string, so a mismatch is a hard
install failure. Bump them all together, never one at a time.

| Package | Notes |
|---|---|
| `payload` | engine: node `^18.20.2 \|\| >=20.9.0`; peer `graphql ^16.8.1` |
| `@payloadcms/next` | peers: `payload` (exact), `next` (the narrow range above), `graphql ^16.8.1` |
| `@payloadcms/ui` | peers: `payload` (exact), `next` (same range), `react`/`react-dom` `^19.0.1 \|\| ^19.1.2 \|\| ^19.2.1` |
| `@payloadcms/richtext-lexical` | peers: `payload`, `@payloadcms/next`, `react`/`react-dom` (same), **`@faceless-ui/modal 3.0.0`** and **`@faceless-ui/scroll-info 2.0.0`** (exact) |
| `@payloadcms/db-d1-sqlite` | peer: `payload` (exact). The D1 adapter; local emulation comes from `wrangler`/Miniflare, not a direct dep |
| `@payloadcms/storage-r2` | media + import files; **plugin registration order matters** — must load *after* `import-export` (else `fs.mkdir` 500 on Workers) |
| `@payloadcms/plugin-seo` | per-page meta/OG |
| `@payloadcms/plugin-redirects` | CMS redirects → see Cluster 2 (KV) |
| `@payloadcms/plugin-form-builder` | adds `forms` / `form-submissions` collections (schema → migration) |
| `@payloadcms/plugin-import-export` | adds `imports` / `exports`; the import preview re-reads the created record (do not auto-delete it) |
| `@payloadcms/email-resend` | pairs with `resend` (Cluster 6) |
| `@payloadcms/live-preview-react` | `RefreshRouteOnSave` in `LivePreviewListener`; serverURL must match the request origin |

> Adding any Payload plugin that introduces collections/fields, or enabling drafts, is a **schema
> change** — run `pnpm migrate:create` and commit the migration or CI's drift gate blocks the PR.

**Access control (roles & permissions).** RBAC lives in [`src/access`](../src/access/index.ts) and is
wired into every collection (Users, Pages, Media) and the plugin collections (redirects, forms,
form-submissions, imports/exports) via their override hooks in `payload.config.ts`. Constraints to
preserve when touching auth, the plugins, or the Users schema:
- **`form-submissions.create` MUST stay `anyone`** — the public front-end posts submissions
  unauthenticated; locking create 403s every submission.
- **Plugin access is applied via overrides** (`formOverrides`/`formSubmissionOverrides`,
  redirects `overrides.access`, import-export `overrideImport/ExportCollection`). A plugin bump can
  rename these keys — re-check after any Cluster 1 bump, or the collections silently fall back to
  open defaults.
- **`roles` is `saveToJWT`** — a role change only applies on the user's next login / token refresh;
  users logged in across a deploy must re-login to pick up `roles`.
- **`roles` is a `hasMany` select** → a separate `users_roles` table, not a column on `users`.
  Changing the role set is a schema change (migrate); any migration that makes roles required must
  **backfill `users_roles`** for existing users or they lose all access (see
  `src/migrations/*_add_user_roles.ts`).
- The **first user is auto-promoted to `admin`** by a `beforeChange` hook on Users; everyone else
  defaults to `editor`. Test fixtures that seed a user must set `roles` (see `tests/helpers/seedUser.ts`).

---

## Cluster 2 — Cloudflare runtime & deploy (the fragile one)

| Thing | Current | Couples to / why |
|---|---|---|
| `@opennextjs/cloudflare` | `^1.11.0` (resolved 1.19.11) | Adapter that builds the Worker. Peers: `next` (see knot above), `wrangler ^4.86.0`. Bumping it can move both the Next floor and the wrangler floor. |
| `wrangler` | `^4.98.0` | Must stay **within OpenNext's `wrangler` peer** (`^4.86.0`) — don't lag, don't jump majors alone. Provides: Miniflare (local D1/KV/R2 emulation), `getPlatformProxy({ remoteBindings })` for remote-D1 access during migrate/build, and the **open-beta** KV CLI. |
| `wrangler` ↔ open-beta CLI | — | `kv bulk get` output shape differs by mode — remote: `{ key: "value" }`; local: `{ key: { value, metadata } }`. `scripts/_shared.ts` `kvMirror` normalises both. Re-verify on every wrangler bump (test the REMOTE shape). |
| `compatibility_date` | `2025-08-15` | The workerd behaviour pin. Coupled to the wrangler/workerd version — only advance it deliberately and re-test, especially `nodejs_compat`. |
| `compatibility_flags` | `nodejs_compat`, `global_fetch_strictly_public` | Behaviour can shift with `compatibility_date`/workerd. |
| `next.config.ts` `serverExternalPackages` | `jose`, `pg-cloudflare` | workerd-incompatible packages externalised — revisit if Next/OpenNext change bundling. |
| `pnpm.onlyBuiltDependencies` | `sharp`, `esbuild`, `unrs-resolver` | pnpm build-script allowlist; a dep that adds a new native build step may need adding here. |

Symptom-to-cause: "Could not create remote preview session" / error 1031 on deploy → suspect a
Cloudflare-side edge-preview change first, then check wrangler ↔ OpenNext peer alignment **before**
touching app code.

**Platform ceilings the app must live inside** (Paid plan; verify against
[Workers limits](https://developers.cloudflare.com/workers/platform/limits/) — these move):

| Limit | Value | Consequence here |
|---|---|---|
| Worker size | **10 MB gzipped** (64 MB uncompressed) | See the measured budget below; audit any new **server-side** dependency |
| Startup CPU | **1 s** to execute global scope | Module-level work costs as much as bundle weight (error 10021) |
| CPU per request | **30 s** default, configurable to **5 min** | The bound on inline bulk imports (below) |
| Request wall-clock | no limit while the client stays connected | Slow is survivable; CPU-heavy is not |

### Worker size budget — measured baselines

Measured 2026-07-30 via `wrangler deploy --dry-run` against two real deployed builds on this stack
(Payload 3.82.1 / Next 15.4.11 / OpenNext 1.19.11):

| Build measured | Uncompressed | **gzipped** | Share of 10 MB |
|---|---|---|---|
| A clone with **nothing built on it** (bare boilerplate) | 17,711 KiB | **3,962 KiB** | ~40% |
| A **complete marketing site** (318 src files, extra collections, real pages) | 21,910 KiB | **4,724 KiB** | ~46% |

**A full site build cost ~760 KiB gzipped (~7% of the budget)** — because only *server* code counts.
Across those same two builds the static asset count went 109 → 439 files, and
[assets do not count toward Worker size](https://developers.cloudflare.com/workers/static-assets/).
So the foundation is ~40% and a normal build leaves ~5 MB spare.

**What actually threatens the budget: vendor Node SDKs imported server-side** (e.g. a CRM or booking
provider's official client) at 1–3 MB gzipped each — more than an entire site build. Integrate
third-party services over their **REST API with `fetch`** instead. This is also the correct Workers
choice independently of size: such SDKs routinely assume `fs`/native `http`/Node crypto internals absent
from workerd and fail at runtime even when they fit.

Escape hatch if a vendor offers no REST path: move that integration into a **separate Worker behind a
service binding** — it gets its own 10 MB and requires no change to the app's architecture.

`deploy-staging.yml` reports the figure on every staging deploy and warns above **8,192 KiB**. To measure
by hand from a configured clone:

```bash
pnpm exec opennextjs-cloudflare build --env=staging   # or omit --env for production
pnpm exec wrangler deploy --dry-run --env staging     # prints: Total Upload: … / gzip: …
```

> Re-measure and update this table after any Cluster 1/2/5 bump — Payload, Next and OpenNext are the
> dominant contributors, so a major bump moves the 40% baseline.

**Bulk-import write amplification (redirects → KV).** `importExportPlugin` runs with
`disableJobsQueue: true` (no Workers jobs runner), so an import is processed inline in the upload
request, and it creates rows through the normal Payload create op — firing the redirects
`afterChange` hook **per row**. That hook (`src/lib/redirects.ts` `syncRedirectsToKV`) re-reads *every*
redirect (`limit: 0`) and rewrites the whole map to the **single** KV key `redirects:map`. So an N-row
import does N full-table reads and N writes to one key, and
[KV caps writes to the same key at **1 per second**](https://developers.cloudflare.com/kv/platform/limits/).
Batch large loads (low hundreds per import); do not widen `importExportPlugin`'s `collections` beyond
`redirects` without reworking the hook to debounce or to run once after the import completes.

---

## Cluster 3 — Node & package manager (must agree everywhere)

| Thing | Current | Must match |
|---|---|---|
| `engines.node` | `>=24.15.0` | local Node, CI `setup-node` `node-version: 24`, `@types/node` major, and stay ≥ Payload's `>=20.9.0` floor |
| `@types/node` | `24.12.3` | the Node major in use (24) |
| `engines.pnpm` | `^9 \|\| ^10` | CI `pnpm/action-setup` `version: 10` |
| `.npmrc` | `legacy-peer-deps=true` | the reason the Next/OpenNext peer violation installs — do not remove without resolving the Next knot first |
| `.yarnrc` | `--install.ignore-engines true` | legacy guard; pnpm is the supported manager |

> There is no `packageManager` field. Consider adding one (`"packageManager": "pnpm@10.x"`) for
> fully deterministic CI — but only in step with the `engines.pnpm` range and the action version.

---

## Cluster 4 — GitHub Actions (keep all four workflows in sync)

`ci.yml`, `deploy-staging.yml`, `deploy-production.yml`, `sync-staging.yml` currently all use:

| Action | Pin |
|---|---|
| `actions/checkout` | `@v6` |
| `pnpm/action-setup` | `@v6` (`version: 10`) |
| `actions/setup-node` | `@v6` (`node-version: 24`) |

Bump them **together across all four files** — a split version set causes confusing
env-specific CI failures. `sync-staging.yml` additionally apt-installs `rclone` (R2 media mirror)
and runs on a `cron` schedule from `main`.

---

## Cluster 5 — React & types

| Package | Current | Coupling |
|---|---|---|
| `react` / `react-dom` | `19.2.1` | Payload UI/lexical peer accepts only `^19.0.1 \|\| ^19.1.2 \|\| ^19.2.1` — not "any 19" |
| `@types/react` | `19.2.14` | track the React 19 minor |
| `@types/react-dom` | `19.2.3` | track the React-DOM 19 minor |
| `@testing-library/react` | `16.3.0` | RTL 16 is the React-19-compatible line |

---

## Cluster 6 — Feature libraries (bump each pair/triple together)

| Group | Packages | Coupling |
|---|---|---|
| Forms | `react-hook-form ^7.77.0`, `@hookform/resolvers ^5.4.0`, `zod ^4.4.3` | the resolvers major must support the installed `zod` major (v5 ↔ zod 4); RHF + resolvers track together |
| Email | `resend ^6.12.4`, `@react-email/components ^1.0.12`, `@payloadcms/email-resend` | adapter is Payload-pinned (Cluster 1); `resend` + react-email move together |
| Carousel | `embla-carousel-react ^8.6.0`, `embla-carousel-autoplay ^8.6.0` | the plugin **must share the same major/minor** as the core |
| Animation | `motion ^12.40.0` | code-split via `LazyMotion`/`m` in `FadeIn` |
| Turnstile | `@marsidev/react-turnstile ^1.5.2` | client widget + server verify in `lib/turnstile.ts` |
| Monitoring | `@sentry/cloudflare ^10.56.0` | wired via Next `onRequestError` in `instrumentation.ts`; coupled to the Workers runtime |
| GraphQL | `graphql ^16.8.1` | direct dep **and** a Payload peer — keep within `^16.8.1` |
| Module guards | `server-only`, `client-only` | enforce server/client boundaries |

---

## Cluster 7 — Build & lint toolchain

| Group | Packages | Coupling |
|---|---|---|
| TypeScript | `typescript 5.7.3` | consumed by the Next TS plugin and `typescript-eslint` (via `eslint-config-next`); `tsconfig` uses `moduleResolution: bundler`, `target ES2022` |
| ESLint | `eslint ^9.16.0`, `eslint-config-next 15.4.11`, `@eslint/eslintrc ^3.2.0` | **`eslint-config-next` must equal the `next` version**; it pins the `typescript-eslint` stack; flat config uses `FlatCompat` from `@eslint/eslintrc` |
| Tailwind v4 | `tailwindcss ^4.3.0`, `@tailwindcss/postcss ^4.3.0`, `@tailwindcss/typography ^0.5.19`, `prettier-plugin-tailwindcss ^0.8.0` | the PostCSS plugin must share Tailwind's major (v4); the prettier plugin must support v4; wired via `postcss.config.mjs` |
| Unit tests | `vitest 4.1.6`, `@vitejs/plugin-react 4.5.2`, `vite-tsconfig-paths 6.0.5`, `jsdom 28` | Vitest 4 bundles Vite; tests run in the `node` environment (esbuild's TextEncoder breaks under jsdom). **Int specs run non-parallel in one realm** (`fileParallelism: false` + `isolate: false` in `vitest.config.mts`): each spec's Payload config starts a Miniflare `workerd` on the local D1, and two concurrent/duplicated workerd crash with `database is locked: SQLITE_BUSY_RECOVERY` — same root cause as the build-time `persist: false` workaround. Keep these flags when bumping Vitest (the `poolOptions` shape changed in v4). |
| E2E | `@playwright/test 1.59.1` | runner pinned exact; browser binaries (`playwright install`) track the runner version; uses the `chromium` channel |
| Prettier | `prettier ^3.4.2`, `prettier-plugin-tailwindcss ^0.8.0` | plugin must match the Prettier and Tailwind majors |
| Misc tooling | `cross-env 10.1.0`, `dotenv 16.4.7`, `tsx 4.21.0` | run scripts (`scripts/*.ts`) and migrations execute under `tsx`/Node |

---

## Cluster 8 — Per-clone configuration (not versions, but coupled)

Three files must stay consistent when cloning or renaming (the "three-file centralisation"):

- `wrangler.jsonc` — worker/db/bucket names, domains, resource IDs, `account_id`, bindings
  (`D1`, `KV`, `R2`, `ASSETS`), plus the `env.staging` block (named environments **do not**
  inherit top-level bindings — D1/KV/R2/observability must be repeated there).
- `src/config/site.config.ts` — `slug` / `domain` / brand text / emails, plus `indexableHosts` (keep
  in sync with the names and domains in `wrangler.jsonc`; see "Search-engine indexing" below).
- `src/app/(frontend)/styles.css` `@theme` — visual tokens (colours, fonts).

Binding names (`D1`, `KV`, `R2`, `ASSETS`) are code-facing and identical across
environments — only the underlying resource id/title changes per environment. The KV namespace
title follows the same slug convention as D1/R2 (`<slug>` / `<slug>-staging`).

### Search-engine indexing is host-gated (fourth coupled surface)

`site.domain` also decides **where the site may be indexed**. A fourth chain hangs off it:

`src/config/site.config.ts` (`indexableHosts`) → `src/lib/indexing.ts` → `next.config.ts`
`headers()` → `src/app/robots.ts`, and it must agree with the `routes` in `wrangler.jsonc`.

Every host **not** in `indexableHosts` is served `X-Robots-Tag: noindex, nofollow` — both Workers'
`*.workers.dev` hostnames, every per-version preview URL, `staging.<domain>` and localhost. This is
host-gated, **not** `APP_ENV`-gated, because the production Worker runs `APP_ENV=production` from its
first deploy while still only reachable on `*.workers.dev`. Zone-level Cloudflare features
(Transform Rules, WAF, Page Rules) cannot substitute: `*.workers.dev` is not a zone in the account.

Constraints that bite:

- **Adding a public host means three edits in one commit**: `indexableHosts`, the `routes` in
  `wrangler.jsonc` (**and** `env.staging.routes` — named environments do not inherit routes), and
  `getCSRFOrigins()` in `src/lib/serverUrl.ts` if the admin is served there. Miss the first and the
  host deploys noindexed; miss the second and it never reaches the Worker at all.
- **The design is fail-safe, so launch needs an explicit check.** A wrong `site.domain` silently
  leaves the live site noindexed. `curl -sI https://www.<domain>/ | grep -i x-robots-tag` must return
  nothing before go-live — see docs/BUILD-HANDBOOK.md.
- **`robots.ts` must stay at the `src/app/` root and stay `force-dynamic`.** Inside a route group Next
  ignores the metadata-route convention and `/robots.txt` 404s. Statically prerendered, it is emitted
  into `.open-next/assets/`, where Cloudflare's Assets binding serves it without invoking the Worker —
  so it could neither vary by host nor receive the header.
- **Upgrade gate for `@opennextjs/cloudflare` / `@opennextjs/aws`** (see Cluster 2): OpenNext matches
  the `missing` host value **unanchored** (`new RegExp(value).test(host)` in
  `dist/core/routing/matcher.js` → `routeHasMatcher`), whereas Next's own dev server anchors it as
  `^${value}$`. `INDEXABLE_HOST_PATTERN` therefore carries its own `^(?:…)$`, which is correct under
  both. `tests/int/indexing.int.spec.ts` compiles the pattern **both** ways and is the gate — if an
  OpenNext bump changes that matcher, it fails there rather than silently making
  `<domain>.attacker.example` indexable.
- Static assets under `public/` and `/_next/static/*` bypass the Worker (that is why
  `public/_headers` exists), so they carry no `X-Robots-Tag`. Irrelevant for JS/CSS/images; a PDF
  dropped in `public/` would stay indexable on preview hosts. `_headers` cannot match on host, so it
  cannot fix this without also noindexing the asset on the live domain.

---

## Cluster 9 — Fork topology & upstream sync (process, not versions)

Each client repo is a **GitHub fork** of `fluxfc/payload-boilerplate`. The `setup-cloudflare` skill
preflight (step 7) rewrites the fork's `main` to a single clean root commit and preserves the full
history on a **`boilerplate`** branch — a protected, **fast-forward-only mirror of upstream**. The
`upstream` remote is kept fetch-only (push = `DISABLE`); the fork-network link is retained.

Coupling to respect when pulling boilerplate updates into a clone:

- `main` is an **orphan root** (no shared ancestor with upstream), so updates flow
  **upstream → `boilerplate` (fast-forward) → `main` (cherry-pick)** — never `git merge upstream/main`
  (unrelated histories ⇒ conflict storm). Cherry-pick discrete fixes; a range for several.
- The `boilerplate` branch must stay a pure mirror: only fast-forwards from `upstream/main` land on it
  (it stays linear and is never force-pushed), and **no client commits** ever go to
  it. If it ever diverges, the FF mirror push breaks.
- **Never use GitHub's web "Sync fork" button** — it resets `main` to upstream and undoes the clean
  `main`. Sync only via the cherry-pick flow (documented in README → "Forking a new client repo" and
  the skill's Notes).

This is why bumping a dependency in the boilerplate doesn't auto-reach clones: a maintainer must
cherry-pick the bump (and its lockfile/migration companions per the clusters above) into each clone.

---

## Cluster 10 — Autonomous setup-cloudflare (skill-frontmatter hook, not versions)

The `setup-cloudflare` skill runs with **no per-command approvals**. The mechanism is a single
`PreToolUse` hook declared in the **frontmatter of
[`.claude/skills/setup-cloudflare/SKILL.md`](../.claude/skills/setup-cloudflare/SKILL.md)** — nothing
in `.claude/settings.json` (which stays personal/gitignored, as before):

```yaml
hooks:
  PreToolUse:
    - matcher: Bash
      hooks:
        - type: command
          command: |
            printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow",...}}'
```

Why this shape (the couplings to respect):

- **Lifecycle = scope.** Skill-frontmatter hooks are active **only while the skill is in context** and
  Claude Code tears them down automatically when it finishes. So Bash is auto-approved for the run and
  for nothing else — there is **no sentinel, no TTL, no arm/disarm step, no SessionStart cleanup, and
  no `.claude/settings.json` entry** to keep in sync. Don't reintroduce any of those; the lifecycle
  already does the scoping.
- **It travels with the skill.** Because the hook lives in the committed SKILL.md, every clone/fork
  inherits it automatically. `.claude/settings.json` is **not** committed (gitignored), which keeps
  per-developer permission-grant churn out of the repo — the whole reason the hook lives here and not
  there.
- **No `jq` dependency.** The command is a plain `printf` of the allow JSON. If you edit it, keep it
  valid JSON and keep `permissionDecision: "allow"`.
- **`Bash` matcher only**, by design — it never auto-approves Edit/Write or MCP tools. The
  provisioning script patches files itself, so the skill needs no file-write auto-approval.
- **First run on a fresh clone prompts once** to trust the repo's `.claude/` content — expected,
  one-time; that single trust covers the frontmatter hook.
- The skill still gates step 2 on the **dry-run exit code** (success → provision for real; non-zero →
  stop and report). That is independent of the hook.

> If a long run is compacted out of context, the frontmatter hook deactivates with the skill and
> approvals revert to normal mid-run — re-invoke the skill to continue. This fails safe (auto-approval
> can never outlive the skill), so it needs no extra handling.

---

## When something does break

1. Identify which cluster the changed version sits in.
2. Re-read that cluster's coupling column and the changelog across the crossed range.
3. Check whether a peer floor moved (`pnpm info <pkg> peerDependencies`).
4. Prefer fixing the alignment (bump the coupled packages together) over loosening a constraint;
   never paper over a peer break by widening `legacy-peer-deps` usage.
5. Record any newly discovered coupling here so the next person inherits it.
