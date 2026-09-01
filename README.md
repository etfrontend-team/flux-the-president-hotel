# Payload + Next.js + Cloudflare Workers boilerplate

A [Payload CMS](https://payloadcms.com) + Next.js application deployed to Cloudflare Workers via
[OpenNext](https://opennext.js.org/cloudflare). This repository is the boilerplate that Flux Full
Circle clones to build luxury-travel websites, so it ships with a complete **three-environment
workflow** (local → staging → production) rather than a single-environment setup.

> **In a hurry?** See the [Cheat Sheet](docs/CHEATSHEET.md) for the day-to-day commands and the
> one-time setup checklist. This README is the comprehensive reference.

> **Building a client site on a handed-over clone?** Start with the
> [Build Handbook](docs/BUILD-HANDBOOK.md) — the do's, don'ts and hard constraints for the build team,
> plus the hand-back checklist.

> Deploys run on the **Paid Workers** plan (bundle size limits — see [Known issues](#known-issues)).

---

## Architecture

Three isolated environments, all in the **Flux Full Circle** Cloudflare account. Each environment has
its **own D1 database and its own R2 bucket**, so a developer cannot affect production by working
locally, and schema changes can be tested safely before they reach production.

| | Local | Staging | Production |
|---|---|---|---|
| URL | `localhost:3000` | `staging.<domain>` | `www.<domain>` (+ apex) |
| Worker | `next dev` | `<slug>-staging` | `<slug>` |
| D1 | Miniflare (local) | `<slug>-staging` | `<slug>` |
| R2 | Miniflare (local) | `<slug>-staging` | `<slug>` |
| `APP_ENV` | `local` | `staging` | `production` |

`APP_ENV` is a Wrangler `var` injected at runtime — the only reliable signal that distinguishes
staging from production inside the Worker (`NODE_ENV` is `production` in both). Read it from
[`src/lib/env.ts`](src/lib/env.ts).

**Two directions of flow:**

- **Code & schema flow UP** (`local → staging → main`) through pull requests, CI quality gates and
  Payload migrations. Never edit a deployed database's schema by hand.
- **Content & data flow DOWN.** Production is the source of truth: a scheduled job syncs production
  **down** to staging, and `pnpm db:pull` refreshes a developer's local database — so everyone reviews
  against real content. (**During the initial build the scheduled sync is disabled** — see setup
  step 7 — so staging is the durable content home until go-live; see
  [Content & media](#content--media).)

The sites are gated behind **Cloudflare Access** while in development — an unauthenticated request
302-redirects to `…cloudflareaccess.com`. That is expected, not a deploy problem.

---

## Developer quick start

```bash
pnpm install
cp .env.example .env          # then set PAYLOAD_SECRET (see below)
pnpm wrangler login           # authenticate to the Flux Full Circle account
pnpm db:pull                  # load real data into your local D1 (from production)
pnpm dev                      # http://localhost:3000  → log in with your prod admin credentials
```

- **`PAYLOAD_SECRET`** is required locally — generate your own with `openssl rand -hex 32` and put it
  in `.env`. It only signs local session cookies; it does not need to match any deployed secret.
- **`db:pull` needs the `sqlite3` CLI** (macOS ships it; otherwise `brew install sqlite3` /
  `apt-get install sqlite3`). Miniflare's importer can't load a production dump whose foreign-keyed
  rows are ordered child-before-parent, so the import is done with `sqlite3` (which can disable FK
  enforcement). Stop `pnpm dev` before `db:pull` — the dev server holds the local D1 file.

Your local D1 and R2 are throwaway — build and break freely.

---

## Branching & review flow

```
feature branch ──PR──▶ staging ──▶ review on staging.<domain>
                 │
                 └────PR──▶ main  ──▶ (manual approval) ──▶ www.<domain>
```

- PRs into `staging` and `main` must pass **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)):
  lint, type-check, migration-drift check, and integration tests against a local D1. Credential-free
  by design — it never touches staging or production.
- Merging to **`staging`** auto-deploys staging.
- Merging to **`main`** deploys production **after a manual approval** on the `production` GitHub
  Environment (in-house owns go-live).
- **Live preview + drafts** back the staging review: editors preview unpublished draft content in the
  admin before it is published, and reviewers approve drafts on staging before go-live.
- A **`boilerplate`** branch (a fast-forward-only mirror of upstream) sits outside this
  deploy flow — it never deploys and never takes client commits; it exists only to source upstream
  fixes via cherry-pick. See [Forking a new client repo](#forking-a-new-client-repo).

> The production reviewer gate is **deferred until the boilerplate is signed off** (see setup step 9).
> Until then, avoid pushing directly to `main` — it deploys production.

---

## Schema changes (migrations)

Schema lives in code. After editing a collection or field:

```bash
pnpm migrate:create my_change      # generates src/migrations/<timestamp>_my_change.ts
git add src/migrations && git commit
```

- The CI **migration-drift** gate (`pnpm check:migrations`) fails any PR whose Payload schema isn't
  captured in a committed migration.
- Migrations are applied to the target database automatically during each deploy, **before** the
  build (the build connects to the remote D1, so the schema must exist first).
- Migrations flow up with the code; production may briefly lag staging on migrations, which is why
  `sync:staging` and `db:pull` re-apply migrations after pulling data down ("data down, schema up").

---

## Content & media

| Command | Direction | Purpose |
|---|---|---|
| `pnpm db:pull [--from=staging] [--with-media]` | prod/staging → local | Refresh local D1 with real data (add media with `--with-media`) |
| `pnpm promote:staging` | local → staging | Push locally-authored content (D1) to staging for review (build phase) |
| `pnpm sync:staging` | prod → staging | Refresh staging D1, media **and redirects (KV)** from production (scheduled + manual — **the schedule is disabled during the initial build**, setup step 7) |
| `CONFIRM=promote pnpm promote:production` | staging → prod | One-time go-live content promotion (in-house only) |

**Media.** Each environment has its own R2 bucket; media is served per environment via Payload's
`/api/media/file/**` route, so local uploads can't touch production media. Editors can set a **focal
point** per image; since Sharp can't run on Workers we apply it on the front-end via CSS
`object-position` rather than cropping on upload (see [Dependencies & plugins](#dependencies--plugins)).

Media sync uses [`rclone`](https://rclone.org/) over R2's S3 API (fast, parallel, incremental):

- `sync:staging` and `promote:production` (staging→prod) sync media **remote↔remote**.
- `db:pull --with-media` downloads the remote bucket into the local Miniflare R2 (opt-in — off by
  default to avoid large downloads).
- Local **uploads** can't be pushed up (the local Miniflare R2 isn't S3-addressable) — author media
  where the bucket is remote, or rely on the down-sync.

Media sync runs when `rclone` is installed and the R2 S3 credentials (`R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`) are present; otherwise it is **skipped with a message**. See setup step 8
for the token. A production CDN domain (`media.<domain>`) is a planned enhancement.

**Redirects.** `sync:staging` also mirrors the production redirects KV namespace into staging (a
full replace — keys absent from production are removed from staging), so reviewers see the live
redirect set. This needs no extra credentials beyond the Cloudflare API token the D1 sync already
uses. `db:pull` does not pull redirects — local dev emulates the `KV` binding via Miniflare.

---

## Users & roles

The Users collection carries a required `roles` array with two tiers (see
[`src/access`](src/access/index.ts)):

| Role | Who | Can | Cannot |
|---|---|---|---|
| **Admin** | Flux team | Everything — manage users, all content, redirects, imports/exports, and the only role that may **delete** | — |
| **Editor** | Client team | Create & edit Pages, Media, Forms; read form submissions | Manage users, delete anything, run imports/exports |

- **First user is auto-admin.** The first account created (via the unguarded "create first user"
  screen on a fresh DB) is promoted to `admin` automatically; everyone after defaults to `editor`.
  Assign roles when creating client accounts.
- **Only admins change roles** — the field is admin-only, so an editor can't escalate themselves.
- Roles are stored in the auth JWT, so a role change takes effect on the user's **next login**.
- Public **form submissions stay open** (unauthenticated posts must work); only staff can read them.

Adding or changing a role is a schema change — see [Schema changes](#schema-changes-migrations).

---

## Deploying

**GitHub Actions is the only deployer** — Cloudflare's automatic git builds are disabled so they
don't race the pipeline. You normally never deploy by hand; pushing to `staging`/`main` does it.

The workflows call these scripts, which you can also run locally if needed:

| Script | What it does |
|---|---|
| `pnpm deploy:staging` | `CLOUDFLARE_ENV=staging` → migrate staging D1, build, deploy to the staging worker |
| `pnpm deploy:production` | empty `CLOUDFLARE_ENV` → top-level config → migrate prod D1, build, deploy to the prod worker |

Production stays at the **top level** of `wrangler.jsonc`; only **staging** is a named `env`. (OpenNext
ignores an empty `--env`, so the same scripts target prod when `CLOUDFLARE_ENV` is unset.)

---

## Forking a new client repo

Each client repo is a **GitHub fork** of `fluxfc/payload-boilerplate` (fork manually with "Copy the
main branch only" checked, then clone). A fork inherits the boilerplate's entire commit graph, so the
`setup-cloudflare` skill's preflight gives the client repo a **clean start** automatically — no manual
git before the skill:

- **`main`** is rewritten to a single clean root commit (`Initial commit (forked from
  payload-boilerplate @ <sha>)`), so the client's history is theirs, not the boilerplate's log.
- The full boilerplate history is preserved on a **`boilerplate`** branch — a protected,
  **fast-forward-only mirror of upstream**. Developers never commit to it; it only ever receives
  upstream updates.
- The `upstream` remote (→ `fluxfc/payload-boilerplate`) is kept **fetch-only**, and the GitHub
  fork-network link is retained.

**Pulling boilerplate updates (security/version fixes) into a client repo.** Because `main` is now an
orphan root with no shared ancestor with upstream, sync by **cherry-pick**, not `git merge
upstream/main`:

```bash
git fetch upstream
git push origin upstream/main:boilerplate    # fast-forward the boilerplate mirror (non-FF is rejected)
git log --oneline main..boilerplate          # the new upstream commits available to port
git switch main && git cherry-pick <sha>     # or a range:  git cherry-pick <A>^..<B>
git push origin main
```

> **Never use GitHub's web "Sync fork" button** — it targets `main` and would reset it to upstream's
> history, undoing the clean `main`. Sync only via the commands above.

---

## Cloning for a new client — the three files

All website-specific values live in **three files**. Editing these (plus setting the secrets
below) is the whole reskin — nothing else in app code carries brand identifiers.

| File | Holds |
|---|---|
| [`src/config/site.config.ts`](src/config/site.config.ts) | Slug, domain, brand name, default metadata, email fallbacks, account id, and `indexableHosts` — consumed by app code (`@/config/site.config`) and the ops scripts. `domain` also determines **where the site may be indexed**: every host not in `indexableHosts` is served `X-Robots-Tag: noindex, nofollow`. See [Search-engine indexing](#search-engine-indexing). |
| [`src/app/(frontend)/css/base.css`](src/app/(frontend)/css/base.css) | Visual brand tokens in the `@theme` block (colours, fonts, spacing, radius). |
| [`wrangler.jsonc`](wrangler.jsonc) | Infrastructure: worker/D1/R2/KV names, custom domains, `account_id`, and the resource IDs created during setup below. Keep names in sync with `slug`/`domain` in `site.config.ts`. |

Secrets are **never** in these files — they live in `.env` / GitHub org / Cloudflare secrets
(see [Secrets](#secrets)).

## One-time infrastructure setup

> **Automated — just run the skill.** From a fresh clone, run the **`setup-cloudflare` skill** in
> Claude Code (it calls `pnpm setup:cloudflare` under the hood). It takes the clone end-to-end:
> `pnpm install` → provisions all six resources (prod + staging × D1/KV/R2) → patches `wrangler.jsonc`
> + `site.config.ts` (names, ids, account) → deploys **both** Workers to `*.workers.dev` → sets each
> `PAYLOAD_SECRET` → sets up the `production` Environment. After it finishes a
> developer can build straight away — no further infra, tokens, secrets, environments or CI to set up.
> The repo is named after the live domain (e.g. `acme-lodge.com`), so the skill derives the domain and
> slug from the repo name; the only prompt is the brand display name.
>
> The numbered steps below document **what the skill automates** (and the manual fallback if you ever
> need to run a step by hand). The only genuinely manual items are the two DNS-dependent ones (custom
> routes + apex→www redirect), which wait until the zone/domain is owned.

1. **Create the resources** (the skill runs these via `pnpm setup:cloudflare`, which also patches the
   created ids into `wrangler.jsonc`):
   ```bash
   pnpm wrangler d1 create <slug>
   pnpm wrangler d1 create <slug>-staging
   pnpm wrangler r2 bucket create <slug>
   pnpm wrangler r2 bucket create <slug>-staging
   pnpm wrangler kv namespace create <slug>            # production (title: <slug>)
   pnpm wrangler kv namespace create <slug>-staging    # staging (title: <slug>-staging)
   ```
   > The KV **binding** stays `KV` in both environments (the code reads `env.KV`, exactly like
   > `env.D1` / `env.R2`); only the Cloudflare namespace **title** changes per environment, following
   > the same slug convention as D1/R2 (`<slug>` for production, `<slug>-staging` for staging).
2. **Disable Cloudflare's automatic git builds** for both `<slug>` and `<slug>-staging`
   (Workers & Pages → the Worker → Settings → Builds). Leaving it on races GitHub Actions and can
   deploy unmigrated code.
3. **Confirm GitHub org secrets** grant this repo access: `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_ACCOUNT_ID` (deploys, D1/R2), the `R2_*` pair (media sync), and `RESEND_API_KEY` (the
   shared Flux Resend account — verify the client domain is added in Resend). See [Secrets](#secrets).
4. **First staging deploy creates the rest.** Pushing to the `staging` branch runs `deploy-staging`,
   which **creates the `<slug>-staging` Worker, attaches the `staging.<domain>` custom
   domain** (DNS + certificate, since the zone is Cloudflare-managed) and migrates the staging D1. No
   manual Worker or domain creation needed.
5. **Set the runtime secret on each Worker.** `PAYLOAD_SECRET` lives **only** as an encrypted
   Cloudflare Worker secret — never in GitHub or the repo (the build uses a throwaway placeholder; the
   Worker reads the real value at runtime). Use a **distinct** secret per environment. Set staging
   **after its first deploy creates the Worker**:
   ```bash
   pnpm wrangler secret put PAYLOAD_SECRET                 # production
   pnpm wrangler secret put PAYLOAD_SECRET --env staging   # staging
   ```
   If the site uses forms, also set the per-domain **Turnstile** secret the same way
   (`wrangler secret put TURNSTILE_SECRET_KEY [--env staging]`) and the non-secret
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `NEXT_PUBLIC_SERVER_URL` / `SENTRY_DSN` as Wrangler vars.
6. **Set the production canonical-host redirect (apex → `www`).** Production serves on **both** the
   apex (`<domain>`) and `www` (`www.<domain>`), but `serverURL` is the `www`
   origin. Without canonicalisation, opening the admin on the apex makes it issue **cross-origin**
   requests to `www` that drop the auth cookie — e.g. the import/export results screen fails with a
   browser **"NetworkError"** (the file fetch 403s). Force apex → `www` at the **edge** so the admin
   is always same-origin as `serverURL`:
   - Cloudflare dashboard → the `<domain>` zone → **Rules → Redirect Rules** *(or the older
     **Rules → Page Rules**)* → create a **301** redirect from the apex to `www`, preserving path +
     query. Page Rule form: match `<domain>/*`, setting **Forwarding URL → 301**, destination
     `https://www.<domain>/$1`. (Redirect Rule equivalent: when `http.host eq
     "<domain>"`, dynamic redirect to `concat("https://www.<domain>",
     http.request.uri.path)`, preserve query string.)
   - Verify: `curl -sI https://<domain>/admin` returns
     `location: https://www.<domain>/admin`.
   - This is **per-zone Cloudflare config** — it does not live in the repo, so it must be set for
     **every** cloned site (or the import NetworkError recurs). If a clone is apex-canonical instead,
     flip the direction and set `serverURL` to the apex (`src/lib/serverUrl.ts`).
7. **Pause the nightly staging refresh for the build phase.** `sync-staging.yml` drops every staging
   table and reimports production nightly (02:00 UTC). While the site is being built production is
   empty, so leaving it enabled wipes staging content — including the build team's staging admin
   accounts — every night. The skill disables it; re-enable at launch (step 10):
   ```bash
   gh workflow disable sync-staging.yml
   ```
   This also disables the manual "Run workflow" button; `pnpm sync:staging` locally still works if a
   one-off refresh is needed (e.g. rebuilding a site whose production already holds content). With the
   schedule off, **staging is the durable content home during the build** — content and media are
   authored there and promoted to production at go-live.
8. **Enable media sync.** Create an **Account** R2 API token (R2 → Manage API Tokens → *Create Account
   API token* — Account tokens survive personnel changes, unlike User tokens), permission **Object Read
   & Write**, applied to the buckets (or all buckets for the fleet). One token covers staging, prod and
   local. Add its `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY`:
   - as **Organisation** GitHub secrets (reused by every cloned site), for the `sync-staging` CI job;
   - to your local `.env`, for `db:pull --with-media`.

   Install `rclone` locally (`brew install rclone`); CI installs it automatically.
9. **At sign-off** (deferred until the boilerplate is approved): add **Required reviewers** to the
   `production` GitHub Environment (the manual go-live gate).
10. **At launch, re-enable the nightly staging refresh** (paused in step 7). Once the site is live,
    production becomes the content source of truth and staging should track it again:
    ```bash
    gh workflow enable sync-staging.yml
    gh workflow run sync-staging.yml     # optional: refresh staging immediately
    ```

> **Cloning for a new site:** repeat steps 1, 4, 5, 6, 7 and 10 (per-site D1/R2/**KV**/worker/secrets/
> domains/**canonical-host redirect**, plus pausing and later re-enabling the staging refresh). The
> `CLOUDFLARE_*`, `R2_*` and `RESEND_API_KEY` org secrets carry over automatically — only the per-site
> values (`PAYLOAD_SECRET`, Turnstile keys, public vars) need setting.

---

## Search-engine indexing

The site is indexable **only** on the hosts listed in `indexableHosts`
([`src/config/site.config.ts`](src/config/site.config.ts), derived from `site.domain` — the apex and
`www`). Every other host is served `X-Robots-Tag: noindex, nofollow` on **every** path, including
`/admin` and `/api`:

| Host | Indexable |
|---|---|
| `<domain>`, `www.<domain>` | yes |
| `<slug>.<subdomain>.workers.dev` (production Worker) | no |
| `<slug>-staging.<subdomain>.workers.dev` | no |
| `<version>-<slug>.<subdomain>.workers.dev` (per-version preview URLs) | no |
| `staging.<domain>` | no |
| `localhost` | no |

**Why host-gated and not `APP_ENV`-gated.** The production Worker runs `APP_ENV=production` from its
first deploy while still only reachable on `*.workers.dev`, so `APP_ENV` cannot tell "live on the
client's domain" from "preview URL". Only the request `Host` header can.

**Why in code and not in the Cloudflare dashboard.** `*.workers.dev` is not a zone in the account, so
Transform Rules, Response Header Modification, WAF and Page Rules cannot target it. The dashboard's
only levers are disabling the `workers.dev` route or Preview URLs outright, which would remove
preview access.

Three pieces, all driven off the one list:

| File | Role |
|---|---|
| [`src/config/site.config.ts`](src/config/site.config.ts) | `indexableHosts` — the allow-list, with a commented template for adding a subdomain. |
| [`src/lib/indexing.ts`](src/lib/indexing.ts) | `isIndexableHost()` plus the anchored host regex shared by both layers. |
| [`next.config.ts`](next.config.ts) | `headers()` — emits the header when the `Host` does not match. |
| [`src/app/robots.ts`](src/app/robots.ts) | Host-aware `robots.txt`. Must stay at the `app/` root and stay `force-dynamic`. |

Crawling is deliberately **allowed** on preview hosts (`Allow: /`, no `Sitemap:` line). A crawler must
be able to fetch a page to see the `noindex` and drop the URL; `Disallow: /` would hide the directive
and can leave URL-only listings stuck in the index.

**Adding a public subdomain** takes three edits in one commit: `indexableHosts`, the `routes` in
`wrangler.jsonc` (**and** `env.staging.routes` — named environments do not inherit), and
`getCSRFOrigins()` in `src/lib/serverUrl.ts` if the admin is served there.

**Launch gate.** The rule is fail-safe, so a wrong `site.domain` silently leaves the live site
unindexable. Before announcing go-live:

```bash
curl -sI https://www.<domain>/ | grep -i x-robots-tag   # MUST return nothing
curl -s  https://www.<domain>/robots.txt                # MUST be present and permissive
```

Coupling notes and the OpenNext upgrade gate are in
[docs/UPGRADING.md](docs/UPGRADING.md) → "Cluster 8".

---

## Secrets

The repo commits **zero secret values**. Secrets are tiered by nature: shared values are centralised
once and reused by every cloned site; per-site values are set once during that site's infra setup and
live only in Cloudflare — never in the repo or GitHub.

**Tier 1 — shared across all Flux sites** (GitHub **organisation** secrets; CI injects them per Worker):

| Secret | Used for |
|---|---|
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | Wrangler auth in CI (deploy, D1, migrate) |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | rclone media sync over R2's S3 API (also local `.env`) |
| `RESEND_API_KEY` | Email. **One shared Flux Resend account** with each client domain verified under it; the per-site `DEFAULT_FROM_EMAIL` (non-secret) selects the domain. |

**Tier 2 — intrinsically per-site** (set once during infra setup; live **only** in Cloudflare):

| Value | Stored where | Used for |
|---|---|---|
| `PAYLOAD_SECRET` | Cloudflare **Worker secret** (prod + staging); local `.env` | Signs auth sessions; unique per site. Never in GitHub. |
| `TURNSTILE_SECRET_KEY` | Cloudflare **Worker secret** (per domain) | Server-side Turnstile verification |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Per-site var (**build-time** — inlined into the client bundle) | Turnstile widget |
| `SENTRY_DSN` | Per-site var (non-secret) | Error monitoring; no-op when unset |

> **Forward-looking:** Cloudflare **Secrets Store** (account-level secrets bound into Workers by
> reference) is the most native account-wide mechanism for Tier-1 *runtime* secrets — worth adopting
> once its wrangler binding support is verified. Today we use GitHub org secrets + CI injection.

---

## Troubleshooting & notes

- **`db:pull` fails with `no such table`** → install the `sqlite3` CLI (see quick start). The dump is
  imported with `sqlite3` precisely to avoid Miniflare's foreign-key import limitation.
- **`payload migrate` prompts "you've run Payload in dev mode…"** locally → your local D1 was
  dev-pushed. `db:pull` and `test:int:ci` reset the local D1 first (`pnpm db:reset:local`) so migrate
  runs non-interactively; run that if you hit the prompt manually.
- **Media sync printed "skipped — set R2_ACCESS_KEY_ID…"** → the R2 token (setup step 8) isn't present
  in this environment, or `rclone` isn't installed. Expected until configured.
- **A site URL 302-redirects to `cloudflareaccess.com`** → that's the Cloudflare Access gate, not a
  failure. Authenticate through Access to reach the site.
- **CI migration-drift check failed** → your schema changed without a migration. Run
  `pnpm migrate:create <name>` and commit the generated files.
- **`environment`/`vars.*` "context access might be invalid" warnings** in the workflow YAML are just
  the editor noting a secret/variable isn't defined in the repo yet; they resolve once it exists.

---

## Styling (Tailwind CSS)

The frontend is styled with **Tailwind CSS v4** — chosen for fast bespoke builds, the best
documentation and talent pool for handover, a tiny build-time-only output (strong Core Web Vitals,
no Worker-runtime cost), and the `@tailwindcss/typography` plugin for CMS-driven editorial content.

Tailwind v4 uses **CSS-first config** — there is no `tailwind.config.js`. Setup lives in three places:

| File | Role |
|---|---|
| [`postcss.config.mjs`](postcss.config.mjs) | Registers the `@tailwindcss/postcss` plugin |
| [`src/app/(frontend)/styles.css`](src/app/(frontend)/styles.css) | Imports Tailwind, loads the typography plugin, and imports the `base.css` / `layout.css` / `components.css` partials |
| [`src/components/ui/`](src/components/ui/) | Hand-rolled primitives composed with the `cn()` helper |

**Scoped to the frontend.** Tailwind is imported **only** in the `(frontend)` stylesheet, so it never
reaches the `(payload)` admin route group. The PostCSS plugin only injects Tailwind output (utilities
and the Preflight reset) into stylesheets that import it, so the Payload admin UI is left completely
untouched. **Do not** add `@import "tailwindcss"` to `(payload)/custom.scss`.

**Design tokens — how to reskin per client.** Brand values live in the `@theme` block in
[`css/base.css`](src/app/(frontend)/css/base.css) (colours, fonts, spacing, radii). Each token becomes a
utility automatically — `--color-brand` generates `bg-brand` / `text-brand` / `border-brand`,
`--font-display` generates `font-display`. To re-theme the boilerplate for a new client, change the
token values in one place and the whole frontend updates consistently. Wire real brand fonts via
`next/font` and point the `--font-*` tokens at the generated CSS variables.

**Primitives.** Lightweight, brand-agnostic building blocks in
[`src/components/ui/`](src/components/ui/) — `Container`, `Stack`, `Heading`, `Button`, `Prose` —
exported from a single barrel (`import { Container, Heading } from '@/components/ui'`). Compose pages
from these rather than re-styling from scratch. All accept a `className` prop that overrides defaults
via [`cn()`](src/lib/utils.ts) (clsx + tailwind-merge).

**Rich text.** Wrap Payload Lexical output in `<Prose>` to auto-style headings, lists, links and
images with the typography plugin:

```tsx
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Prose } from '@/components/ui'

<Prose>
  <RichText data={post.content} />
</Prose>
```

**Formatting.** `prettier-plugin-tailwindcss` (configured in [`.prettierrc.json`](.prettierrc.json))
sorts class names automatically on format.

---

## Dependencies & plugins

The boilerplate ships the libraries luxury-travel builds repeatedly need, chosen to respect two
Workers constraints: **no Sharp at runtime** and the **Worker bundle-size limit**. Every Payload
package is pinned to the exact same version as `payload` itself (currently `3.82.1`) — keep them in
lockstep when upgrading.

> **Before bumping any version, read [docs/UPGRADING.md](docs/UPGRADING.md).** The dependencies here are
> tightly coupled (Payload ↔ Next ↔ OpenNext ↔ wrangler ↔ Node, plus the tool clusters); that doc is
> the full coupling map and the pre-merge gate. Never bump a version in isolation.

| Package | Purpose | Where it's wired |
|---|---|---|
| `@payloadcms/plugin-seo` | Meta title/description/OG image per page (`meta` tab) | `payload.config.ts` → `plugins`, targets `pages` |
| `@payloadcms/plugin-redirects` | CMS-managed redirects (SEO-specialist owned) | `payload.config.ts` + KV middleware — see [Redirects](#redirects) |
| `@payloadcms/plugin-form-builder` | Editor-built forms + submissions + email | `payload.config.ts` → `plugins` (adds `forms`, `form-submissions`) |
| `@payloadcms/plugin-import-export` | Bulk CSV/JSON import + export for redirects (admin UI) | `payload.config.ts` → `plugins` (adds `imports`, `exports`) — see [Redirects](#redirects) |
| `@payloadcms/email-resend` | Routes system mail + form notifications through Resend | `payload.config.ts` → `email` (gated on `RESEND_API_KEY`) |
| `@payloadcms/live-preview-react` | Real-time draft preview backing staging review | `admin.livePreview` + [`LivePreviewListener`](src/components/LivePreviewListener.tsx) |
| `@payloadcms/richtext-lexical` | Rich text (already present) | Render with `RichText` inside [`<Prose>`](src/components/ui/Prose.tsx) |
| `embla-carousel-react` (+ `-autoplay`) | Galleries / sliders | [`Carousel`](src/components/Carousel.tsx) (client) |
| `motion` | Animation, code-split via `LazyMotion`/`m` | [`FadeIn`](src/components/FadeIn.tsx) (client) |
| `react-hook-form` + `zod` + `@hookform/resolvers` | Bespoke form validation | [`ContactForm`](src/components/ContactForm.tsx) + shared [schema](src/lib/contactSchema.ts) |
| `resend` + `@react-email/components` | Direct transactional send / branded templates | available for custom email |
| `@marsidev/react-turnstile` | Form spam protection (verified server-side) | `ContactForm` + [`verifyTurnstile`](src/lib/turnstile.ts) |
| `server-only` / `client-only` | Enforce server/client module boundaries | guards secret-touching modules (e.g. `turnstile.ts`) |
| `@sentry/cloudflare` | Production error monitoring | [`instrumentation.ts`](src/instrumentation.ts) — see [Error monitoring](#error-monitoring) |

**Forms — two paths, both available.** The Form Builder plugin (editor-managed forms) is *additive*:
it does not restrict hand-coded forms. Use the plugin's `forms` collection for standard
enquiry/contact forms the marketing team controls; build bespoke forms with react-hook-form + zod
(see `ContactForm`) when you need custom flows, conditional logic or third-party integrations.

**Focal point without Sharp.** Sharp can't run on Workers, so we don't crop/resize on upload —
instead the Media collection stores a focal point and the front-end honours it with CSS
`object-position` via [`focalObjectPosition()`](src/lib/image.ts). Do **not** add `imageSizes` to the
Media collection (generating resized files needs Sharp). For the few **Pro-plan** zones you can
optionally layer Cloudflare Image Resizing (`/cdn-cgi/image/…`), feeding the stored focal coordinates
into its `gravity` parameter for focus-aware `srcset`s.

> Sharp remains a transitive build-time dependency (it always is with Next/Payload); the point is
> that nothing we add invokes it at runtime on Workers.

### Redirects

Redirects are **managed in the CMS** (the `redirects` collection) so the SEO specialist owns them
without a deploy — but they are **served from Cloudflare KV**, not a per-request D1 query:

- The collection's `afterChange`/`afterDelete` hooks rebuild a compact lookup map and write it to KV
  ([`src/lib/redirects.ts`](src/lib/redirects.ts)).
- [`src/middleware.ts`](src/middleware.ts) resolves each request with a single O(1) KV read, and
  **fails open** (a missing binding or error simply continues to the route). This holds up whether a
  site has five redirects or five thousand.

The redirects KV namespace is bound as `KV` in `wrangler.jsonc` (top-level + `staging`) and is created
once per environment during infra setup. Local dev emulates it via Miniflare automatically.

**Redirect status (301/302/…).** Each redirect has a required **Type** field — `301` (permanent,
default), `302`, `303`, `307`, `308` — chosen in the admin. The middleware serves whichever status is
set; `301` is the right default for permanent moves.

**Bulk import/export.** The redirects collection has CSV/JSON **import & export** in the admin (via
`@payloadcms/plugin-import-export`), for one-time migration loads. Notes specific to our Workers setup:

- **Import** parses the CSV and creates redirects through Payload's normal create operation, so the
  `afterChange` KV-sync hook fires and the redirect map updates automatically — imported redirects
  serve immediately, no extra step.
- It runs **synchronously** (`disableJobsQueue: true`) because Workers has no background jobs runner;
  fine for the low hundreds of redirects a site has. Avoid a single multi-thousand-row import (a
  Worker request has a CPU/time budget) — split very large loads into batches.
- **CSV columns:** `from`, `to` (use the group fields, e.g. a custom URL), and `type` (301/302/…).
- **Export is download-only** (`disableSave: true`) — it generates the file for download and never
  writes to R2.
- **Cleanup:** an import stores the uploaded CSV in R2 (the `imports` collection — wired into
  `r2Storage` since Workers has no local disk). After reviewing the import result, **delete the import
  record in the admin** — that removes the R2 file. (We deliberately don't auto-delete: the import
  record holds the result/log you review, and deleting it in a hook would remove that view.)

### Error monitoring

`@sentry/cloudflare` is wired via Next's `onRequestError` hook in
[`src/instrumentation.ts`](src/instrumentation.ts) and is **gated on `SENTRY_DSN`** — a complete no-op
locally and until the DSN is set. This captures server errors. For full Worker-level tracing (request
spans, performance), additionally wrap the OpenNext worker entry with `Sentry.withSentry(...)` per
[Sentry's Cloudflare guide](https://docs.sentry.io/platforms/javascript/guides/cloudflare/) — a
follow-up infra step, not required for error capture.

---

## Project internals

Pre-configured Payload pieces (see the [Payload docs](https://payloadcms.com/docs) to extend):

- **Users** ([src/collections/Users.ts](src/collections/Users.ts)) — auth-enabled collection with
  admin-panel access.
- **Media** ([src/collections/Media.ts](src/collections/Media.ts)) — uploads collection, stored in R2
  via the `@payloadcms/storage-r2` plugin. `crop` is off (needs Sharp); `focalPoint` is **on**
  (coordinates only — applied on the front-end via CSS, see [Dependencies & plugins](#dependencies--plugins)).
- **Pages** ([src/collections/Pages.ts](src/collections/Pages.ts)) — example editorial collection with
  **drafts + autosave** (`versions`), SEO fields, and live preview. The off-shore team extends this
  (blocks, layout fields) per build. Drafts are what live preview renders and staging review approves.
- **Forms & submissions** — added by the Form Builder plugin (`forms`, `form-submissions`).
- **Redirects** — added by the redirects plugin; served via KV middleware (see [Redirects](#redirects)).
- **D1 database** — the Worker has a direct D1 binding (no connection string). You can enable read
  replicas with `readReplicas: 'first-primary'` in the adapter — see the
  [D1 read replicas docs](https://payloadcms.com/docs/database/sqlite#d1-read-replicas).
- **R2 storage** — media is served from R2; a CDN domain can front it later.

> Adding any plugin that introduces collections/fields — or enabling drafts — is a **schema change**.
> Run `pnpm migrate:create <name>` and commit the migration, or CI's migration-drift gate blocks the PR.

### Logger

`payload.config.ts` uses a custom console-based logger (Payload's default `pino-pretty` relies on
Node APIs unavailable on Workers and would throw `fs.write is not implemented`). It routes through
`console.*`, emits JSON for Cloudflare observability, and is only active in production (local uses
`pino-pretty`). Control verbosity with `PAYLOAD_LOG_LEVEL` (`debug`/`info`/`warn`/`error`).

The Media collection sets `skipSafeFetch: true` to use native fetch instead of `undici` for uploads,
reducing "Failed to publish diagnostic channel message" log noise. Workers' isolation provides
built-in SSRF protection, so this is safe.

---

## Known issues

- **GraphQL** — full support is not guaranteed when deployed, pending an
  [upstream Workers fix](https://github.com/cloudflare/workerd/issues/5175).
- **Worker size** — the bundle must stay under the Workers
  [size limit](https://developers.cloudflare.com/workers/platform/limits/#worker-size) (**10 MB
  gzipped** on the Paid plan). Measured baselines: a bare clone is **~3,962 KiB gzipped (~40%)** and a
  complete marketing site **~4,724 KiB (~46%)** — only *server* code counts, so a normal build leaves
  ~5 MB spare. The real risk is a **vendor Node SDK imported server-side** (1–3 MB each): integrate
  third-party services over REST with `fetch`. `deploy-staging.yml` reports the figure on every staging
  deploy and warns above 8,192 KiB. Full detail and the service-binding escape hatch:
  docs/UPGRADING.md → "Worker size budget".

---

Built on the Payload [`with-cloudflare-d1`](https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1)
template. Payload questions: [Discord](https://discord.com/invite/payload) ·
[GitHub discussions](https://github.com/payloadcms/payload/discussions).
