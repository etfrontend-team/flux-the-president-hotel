# Build Handbook — for the build team

You are receiving a fully provisioned client repository. Infrastructure, environments, databases,
storage, secrets and CI are already in place: you can clone, install and start building the site
immediately.

This handbook is the short list of what to adhere to and what to avoid. It exists because several
constraints in this stack are not discoverable from the code — they come from the Cloudflare Workers
runtime, the three-environment deploy pipeline, and dependency couplings that have broken deploys
before.

Read this document once in full before your first commit. Then use:

- [Cheat Sheet](CHEATSHEET.md) — day-to-day commands.
- [README](../README.md) — the comprehensive reference.
- [UPGRADING.md](UPGRADING.md) — the dependency coupling map. Mandatory reading before any version
  change.

---

## 1. What has already been done for you

Flux Full Circle has completed all infrastructure ahead of handover. You do **not** need to set up,
request or configure any of it.

| Already provisioned | Detail |
|---|---|
| Cloudflare resources | Production and staging D1 databases, R2 buckets and KV namespaces (six in total) |
| Both Workers | Deployed and live on `*.workers.dev` |
| Runtime secrets | `PAYLOAD_SECRET` set as an encrypted Worker secret per environment, plus a local value in `.env` |
| CI/CD | Four GitHub Actions workflows: quality gates, staging deploy, production deploy, nightly staging refresh |
| Shared credentials | Cloudflare, R2 and Resend credentials inherited from GitHub organisation secrets |
| Per-clone config | `wrangler.jsonc` and `src/config/site.config.ts` patched with the real names, resource IDs and account |

Two items remain outstanding and are **owned by Flux**, not you: the custom-domain routes (currently
commented out in `wrangler.jsonc`) and the apex-to-`www` redirect at the Cloudflare edge. Both depend
on the domain being delegated to Cloudflare and are completed at launch. Until then both environments
run on `*.workers.dev`, which is entirely sufficient for development and review.

---

## 2. The eleven rules that must not be broken

If you remember nothing else from this document, remember these.

1. **Never push or merge to `main`, and never deploy by hand.** Branch from `main`, pull request into
   `staging`. `main` deploys production and is owned by Flux. GitHub Actions is the only deployer.
2. **Never open a pull request against `fluxfc/payload-boilerplate`.** That is the upstream
   boilerplate, not this client's repository. See §3 — this is a confidentiality risk, not just a
   process error.
3. **Every schema change needs a committed migration.** `pnpm migrate:create <name>`, then commit the
   generated files. Continuous integration (CI) blocks any pull request without one.
4. **Never bump a version** — dependency, tool, GitHub Action or runtime. Raise it with Flux instead.
5. **Nothing may invoke Sharp at runtime.** No `imageSizes`, no `crop` on upload collections.
6. **Integrate third-party services over their REST API with `fetch` — do not install vendor Node
   software development kits (SDKs).** This applies to booking engines, customer relationship
   management (CRM) systems, and anything similar. See §8.
7. **Never import Tailwind into the Payload admin stylesheet** (`src/app/(payload)/custom.scss`). It
   would break the admin user interface.
8. **`form-submissions` create access must stay `anyone`.** The public front-end posts submissions
   unauthenticated; locking it returns 403 on every enquiry.
9. **`r2Storage` must stay last in the `plugins` array** in `src/payload.config.ts`.
10. **Do not edit resource IDs, names, bindings or the commented `routes` in `wrangler.jsonc`.** Any
    change to that file needs Flux sign-off.
11. **Never commit a secret value.** Not in the repo, not in a workflow, not in a comment.

---

## 3. Git, branches and the deployment process

This repository is a **GitHub fork** of the Flux boilerplate, with a deliberately unusual history.
Understanding the shape prevents the two mistakes that cause real damage.

**The branches**

| Branch | Purpose | Your relationship to it |
|---|---|---|
| `main` | Source of truth. Deploys production. | Branch **from** it. Never push to it. |
| `staging` | Deploys the staging environment for review. | Pull request **into** it. |
| `boilerplate` | Fast-forward-only mirror of the upstream boilerplate's full history. | Never commit to it. Never force-push it. Leave it alone entirely. |

### The deployment process

```
feature branch ──PR──▶ staging ──▶ auto-deploys ──▶ review on staging
                                                          │
                                       Flux reviews, then PR into main
                                                          │
                                          manual approval ──▶ production
```

**GitHub Actions is the only deployer.** Cloudflare's own automatic git builds are switched off
precisely so they cannot race the pipeline. Merging into `staging` *is* the staging deploy — there is
no separate deploy step for you to run.

Follow these steps for every piece of work.

1. **Branch from `main`.**
   ```bash
   git switch main && git pull
   git switch -c feat/<short-description>
   ```
2. **Build and commit.** Include the migration for any schema change (§7).
3. **Run the quality gates locally** before you push (§6). They are the same four checks CI runs.
4. **Push and open a pull request into `staging`.** Use the command-line interface so the base cannot
   be wrong:
   ```bash
   git push -u origin HEAD
   gh pr create --base staging --fill
   ```
   If you open the pull request in the browser instead, **confirm the base repository is this client's
   repository and the base branch is `staging`** before submitting. See the warning below.
5. **Wait for CI to pass.** Four gates run: lint, type-check, migration-drift and integration tests.
   Fix any failure on the same branch and push again — do not merge a red pull request.
6. **Merge into `staging`** once CI is green. This automatically triggers the staging deploy, which
   applies migrations to the staging database, builds the Worker and deploys it.
7. **Confirm the staging deploy is green**, then verify your work on the staging URL:
   ```bash
   gh run watch                 # follow the running deploy
   gh run list --workflow=deploy-staging.yml --limit 5
   ```
8. **Tell Flux when the work is ready for review.** Flux reviews on staging and owns everything from
   `main` onwards: the pull request into `main`, the production approval, and go-live.
9. **Handle review feedback the same way** — a new branch from `main`, a pull request into `staging`.
   Never patch staging directly.

**Do not deploy manually.** The `pnpm deploy:staging` and `pnpm deploy:production` scripts exist for
Flux's use in recovery situations. Running them from your machine bypasses the quality gates and can
deploy unmigrated or uncommitted code.

**If a staging deploy fails,** read the failing step's log in the Actions tab (`gh run view --log-failed`).
A migration failure means the schema change is not applied — fix it in a new pull request rather than
touching the staging database. If the failure mentions remote preview sessions or error 1031, stop and
raise it with Flux (§18); do not start changing application code.

### Do

- Keep branches focused and short-lived, and always branch from an up-to-date `main`.
- Keep commit messages clear — this repository is the client's permanent record.
- Rebase or merge `main` into a long-running branch before opening the pull request, so CI tests what
  will actually land.

### Do not

- **Do not use GitHub's web "Sync fork" button.** It resets `main` to the upstream boilerplate's
  history and destroys this client's history.
- **Do not create a pull request whose base is `fluxfc/payload-boilerplate`.** GitHub's browser "New
  pull request" page defaults a fork's base to the *parent* repository. If you accept that default,
  you propose this client's code into the shared boilerplate — visible to every other client project.
  **Always confirm the base repository is this client's repository** before you submit.
- Do not push to the `upstream` remote. Its push URL is deliberately disabled; if a push to
  `upstream` errors, that is the guard working as intended.
- Do not run `git merge upstream/main`. `main` is an orphan root with no shared ancestor upstream;
  merging produces a conflict storm. Boilerplate updates are cherry-picked by Flux.
- Do not run the `setup-cloudflare` skill in `.claude/skills/`. Infrastructure is already complete.
  The skill ships with the repository only because it travels with the boilerplate; re-running it is
  never correct on a configured repository.

---

## 4. Getting started locally

```bash
pnpm install
cp .env.example .env          # set PAYLOAD_SECRET: openssl rand -hex 32
pnpm wrangler login           # only if Flux has issued you Cloudflare access
pnpm dev                      # http://localhost:3000
```

Your local D1 database and R2 bucket are Miniflare-emulated and entirely throwaway — build and break
freely. Nothing you do locally can reach staging or production.

On a fresh local database, the Payload admin at `/admin` shows a "create first user" screen. The
first account created is automatically promoted to **admin**; every account after that defaults to
**editor**. Create your own admin account and carry on.

`pnpm db:pull` refreshes your local database from a deployed environment. **Always pass
`--from=staging`.** The command defaults to production, and you should neither hold nor use
production credentials. It needs the `sqlite3` command-line interface (macOS ships it; otherwise
`brew install sqlite3`), and you must stop `pnpm dev` first because the development server holds the
local database file open.

### Your first task: the integration spike

**Before building any pages, integrate the third-party services the brief requires** — the booking
engine, the CRM, and anything else external — and deploy that to staging.

Do this first, even though it feels out of order. These integrations are the only part of a build that
can run into a platform limit (§8), and the cost of discovering a problem is entirely a function of
*when* you discover it. Found in week one, a bad integration route is a different `fetch` call. Found in
the final week, after the site has been designed around it, it is a rework.

The spike is complete when:

- Each integration works end to end on **staging**, not just locally.
- The staging deploy is green and you have **read the bundle-size summary** on it (§8).
- Anything that could only be integrated via a vendor Node SDK has been **raised with Flux** rather
  than installed.

Report the bundle-size figure to Flux when the spike lands. It sets the baseline for the rest of the
build.

---

## 5. Content and data — which direction things flow

This is the most common source of confusion, so be precise about it.

- **Code and schema flow up:** local → `staging` → `main`, through pull requests, CI gates and
  Payload migrations.
- **Content and data flow down:** once the site is live, production is the source of truth and a
  scheduled job refreshes staging **from** production.

**During your build phase, that scheduled refresh is switched off, and staging is the content home.**
Content you author in the staging admin persists. At go-live, Flux promotes staging's content and
media up to production, which is why staging — not your local environment — is where the launch
content should accumulate.

So the division of labour is:

| Environment | What it is for |
|---|---|
| **Local** | Building and iterating on code. Throwaway database and bucket; break it freely. |
| **Staging** | The real content and media, authored in the admin. Also the review surface for Flux. |
| **Production** | Flux only. Populated from staging at go-live. |

### Do

- **Build code locally** — fast iteration, no credentials needed, nothing you do can reach a deployed
  environment.
- **Author the real content and media in the staging admin**, once the build is functional enough to
  hold it.
- Use `pnpm promote:staging` only for **early bulk seeding** of structural content from local, and
  only while staging holds nothing you care about. It exports your local database, **drops every
  staging table**, and imports the local dump — a wholesale replace, not a merge.
- Tell Flux before you run `promote:staging` if anyone has already authored on staging.

### Do not

- Do not run `pnpm sync:staging`. It pulls production down over staging, dropping staging's tables.
- Do not run `pnpm promote:production` under any circumstances. It is a destructive full replace of
  production content, reserved for Flux at go-live.
- Do not hand-edit a deployed database's schema. Schema lives in migrations only.
- Do not upload media locally and expect it on staging (see below).

**The media limitation to design around.** Each environment has its own R2 bucket, and the local
Miniflare bucket is not addressable over the S3 application programming interface (API). Two
consequences:

- `promote:staging` carries the database only. Media **rows** promoted from local arrive on staging,
  but the image **files** do not — so every promoted image fails to load on staging.
- Running `promote:staging` after someone has uploaded media through the staging admin replaces those
  media rows with your local ones, orphaning the uploaded files in the bucket.

**Upload media through the staging admin**, where the bucket is remote. Use local uploads only as
throwaway placeholders while building.

---

## 6. Quality gates — run them before you push

Continuous integration runs exactly these on every pull request into `staging` and `main`. Running
them locally first saves a round trip.

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm check:migrations
pnpm test:int:ci
```

CI is credential-free by design: it runs against a local Miniflare database and can never touch
staging or production.

### Do

- Run `pnpm generate:types` after changing the Payload config or any Cloudflare binding, and commit
  the result.
- Add integration tests for access-control changes. `tests/int/rbac.int.spec.ts` is the pattern to
  follow.
- Fix the cause when the migration drift check fails: run `pnpm migrate:create <name>` and commit.

### Do not

- Do not weaken or skip a gate to get a pull request through. Raise the blockage with Flux.
- Do not remove `fileParallelism: false` or `isolate: false` from `vitest.config.mts`. Integration
  specs each start a Miniflare `workerd` against the local database; running them in parallel crashes
  with `SQLITE_BUSY_RECOVERY`.

---

## 7. Schema and migrations

Schema lives in code and is captured in committed migrations. `push: false` is set on the database
adapter deliberately — Payload's development schema push is disabled everywhere.

**These are all schema changes and all require a migration:**

- Adding or editing any collection or field.
- Adding any Payload plugin that introduces collections or fields.
- Enabling drafts or versions on a collection.
- Changing the `roles` option set on Users.

```bash
pnpm migrate:create my_change
git add src/migrations && git commit
```

Migrations are applied automatically to the target database during each deploy, **before** the build
— the build connects to the remote database, so the schema must already exist.

**If you ever make `roles` required or change the role set,** the migration must backfill the
`users_roles` table for existing users, or they lose all access. `roles` is a `hasMany` select, so it
lives in a separate table, not a column on `users`. See
`src/migrations/20260609_121223_add_user_roles.ts` for the established pattern.

---

## 8. Cloudflare Workers runtime constraints

These are hard platform limits, not preferences. Working against them produces failures that appear
only after deploy — everything works under `pnpm dev`, because that runs on real Node.js.

### No Sharp at runtime

Sharp cannot run on Workers. Media therefore stores a **focal point** (coordinates only) and the
front-end honours it with CSS `object-position` via `focalObjectPosition()` in `src/lib/image.ts`.

- **Do not** add `imageSizes` to any upload collection — generating resized files needs Sharp.
- **Do not** enable `crop` on an upload collection.
- **Do** use `focalObjectPosition()` on full-bleed images with `object-fit: cover`.

### No local disk

Workers has no filesystem. Any upload collection must be wired into R2 storage, which is why
`r2Storage` is registered **after** every plugin that adds upload collections. Registered earlier,
those collections fall back to disk writes, which call `fs.mkdir` — unimplemented in the Workers
runtime. The symptom is a 500 error on deploy while the same code works locally.

### No background jobs — why bulk imports must stay small

Workers has no background jobs runner, so the import/export plugin is configured with
`disableJobsQueue: true`: a CSV import is processed **inline, in the HTTP request that uploads it**.
On the Paid plan a request gets 30 seconds of central processing unit (CPU) time by default
(configurable to a 5-minute maximum), so a large import can simply run out of budget part-way through.

**This codebase amplifies the cost, which is the part that catches people out.** Bulk import creates
each row through Payload's normal create operation, so the `redirects` collection's `afterChange` hook
fires **once per row** — and that hook re-reads *every* redirect and rewrites the whole lookup map to
KV (see `src/lib/redirects.ts`). Importing N rows therefore performs N full-table reads and N writes to
the **same** KV key. Cloudflare limits writes to a single KV key to **1 per second**, so a few hundred
rows is enough to run into throttling as well as the CPU ceiling.

- **Do** split large redirect loads into batches of a couple of hundred rows and import them
  separately.
- **Do not** attempt a single multi-thousand-row import.
- **Do** raise it with Flux before extending `importExportPlugin`'s `collections` array beyond
  `redirects`. Pointing bulk import at a content collection multiplies the same amplification.
- **Do** delete the import record in the admin after reviewing the result — that also removes the
  stored CSV from R2.

### Bundle size

The Worker must stay under **10 MB after gzip compression** (the Paid plan limit; 64 MB before
compression), and must execute its global scope within **1 second** of startup central processing unit
(CPU) time — so heavy module-level work costs as much as heavy dependencies.

**Only server-side code counts toward that limit.** The build emits two things: the Worker
(`.open-next/worker.js` plus its bundled server functions) and static assets (`.open-next/assets`,
served through the `ASSETS` binding). Client-side JavaScript, CSS, fonts and images ship as **assets and
do not count**.

**Measured baselines on this stack**, so you know what normal looks like:

| Build | Worker, gzipped | Share of the 10 MB |
|---|---|---|
| Bare boilerplate, nothing built on it | ~3,962 KiB | ~40% |
| A complete marketing site (318 source files, extra collections, real pages) | ~4,724 KiB | ~46% |

So **a full site build added roughly 760 KiB — about 7% of the budget.** The same two builds went from
109 to 439 static asset files, which is where the visible bulk of a site actually lands. That leaves
roughly 5 MB of headroom for a typical build, which is ample — *provided* the next point holds.

### Third-party integrations — the one thing that can consume the budget

A single vendor Node SDK imported into server code can be 1–3 MB gzipped on its own — more than a whole
site build. So:

**Integrate over the vendor's REST API using `fetch`. Do not install their Node SDK.**

This is not only a size decision. Vendor Node SDKs routinely assume `fs`, native `http` or Node crypto
internals that do not exist in the Workers runtime, so they frequently fail at runtime even when they
fit. A `fetch` call against a documented REST endpoint is both smaller and more reliable here.

- **Booking engines:** most offer an iframe or client-side widget — use it. Otherwise call their REST
  API from a route handler.
- **CRM:** call the REST API. Never `@hubspot/api-client`, `jsforce` or equivalent server-side.
- **Escalate first** if a vendor genuinely offers no REST path. Flux can move that integration into a
  **separate Worker behind a service binding**, which gets its own 10 MB — this needs no change to
  anything you have built, so do not design around the problem or abandon the integration.

### You cannot ship an oversized Worker by accident

Every deploy log prints the figure — wrangler reports `Total Upload: … / gzip: …` — the staging deploy
additionally summarises it and warns above 8,192 KiB, and the upload **hard-fails** above the real
limit. Because staging builds the identical Worker, the staging deploy is your early warning. This is a
further reason to keep branches short and merge to `staging` often (§3): a size problem found the week
you introduced it is a dependency swap; one found in the final week may be a rework.

### Do

- Read the bundle-size summary on your staging deploys, so you know the trend.
- Prefer putting a heavy library in a `'use client'` component, where it ships as an asset.
- Replace a large dependency with a lighter one, or hand-roll the small part you need.
- Raise it with Flux **before** adding a substantial server-side dependency or a new Payload plugin.

### Do not

- Do not install a vendor Node SDK for a service that offers a REST API.
- Do not assume a dynamic `import()` in server code reduces the Worker size. Server chunks are still
  bundled and uploaded; it may help startup CPU, not the total.
- Do not start deleting features if a deploy fails on size. Stop and raise it with Flux (§18) — the
  remedy is usually one dependency, and the decision is ours.

### GraphQL

Full GraphQL support is not guaranteed when deployed, pending an upstream Workers fix. **Do not build
features that depend on the GraphQL API.** Use the Payload Local API server-side and the REST API
from the client.

### Environment detection

`NODE_ENV` is `production` in **both** deployed Workers, so it cannot distinguish staging from
production. Use `APP_ENV` via `src/lib/env.ts`, which is injected as a Wrangler variable per
environment.

### Search-engine indexing is host-gated — leave it alone

The site is indexable **only** on the hosts listed in `indexableHosts` (`src/config/site.config.ts`,
derived from `site.domain`). Every other host — both Workers' `*.workers.dev` hostnames, every
per-version preview URL, `staging.<domain>`, localhost — is served `X-Robots-Tag: noindex, nofollow`
by `next.config.ts` `headers()`, on every path including `/admin` and `/api`. `src/app/robots.ts`
serves the paired `robots.txt`.

Note `APP_ENV` is deliberately **not** used here: the production Worker runs `APP_ENV=production`
from its first deploy while still only reachable on `*.workers.dev`. The request `Host` header is the
only signal that tells "live on the client's domain" apart from "preview URL".

Crawling is deliberately **allowed** on preview hosts (`Allow: /`, no `Sitemap:` line). A crawler has
to be able to fetch a page to see the `noindex` and drop the URL; `Disallow: /` would hide the
directive and can leave URL-only listings stuck in the index. Do not change this to `Disallow: /`.

**If you add a public subdomain,** three edits go in the same commit — but `wrangler.jsonc` is not
yours to edit (§18), so raise it with Flux:

1. `indexableHosts` in `src/config/site.config.ts` (a commented template sits in the file).
2. `routes` in `wrangler.jsonc`, **and** `env.staging.routes` — named environments do not inherit.
3. `getCSRFOrigins()` in `src/lib/serverUrl.ts`, only if the Payload admin is served on that host.

Miss (1) and the host deploys noindexed; miss (2) and it never reaches the Worker at all.

Two things that must not drift: `src/app/robots.ts` stays at the `src/app/` root (inside a route
group Next ignores it and `/robots.txt` 404s) and stays `force-dynamic` (prerendered, it is emitted
into `.open-next/assets/` and served by Cloudflare's Assets binding without invoking the Worker, so
it could neither vary by host nor receive the header). See docs/UPGRADING.md → "Cluster 8".

---

## 9. Versions and dependencies

**Never bump a version in isolation.** Read [UPGRADING.md](UPGRADING.md) first — it is the full
coupling map. This stack has broken twice from version drift, and because the boilerplate is reused
across client projects, a careless bump propagates.

Specific traps:

- **Every `@payloadcms/*` package must be the exact same version as `payload` itself.** Their
  cross-peers pin an exact string; a mismatch is a hard install failure.
- **`next` is deliberately held at `15.4.11`**, below OpenNext's stated peer floor. It installs only
  because `.npmrc` sets `legacy-peer-deps=true`. This is a considered, working hold — the next
  supported version is a coordinated major jump. **Do not "fix" the peer warning, and do not remove
  `legacy-peer-deps`.**
- `eslint-config-next` must always equal the `next` version exactly.
- `embla-carousel-autoplay` must share the major and minor version of `embla-carousel-react`.

### Do

- Propose version changes to Flux with the reason, and let Flux run the coupling gate.
- Add a genuinely new dependency only after checking its bundle-size and Workers-runtime impact — and
  flag it in the pull request.

### Do not

- Do not run `pnpm update`, `pnpm up --latest`, or any bulk upgrade.
- Do not bump a GitHub Action version. The four workflow files must stay in lockstep.
- Do not change `compatibility_date` or `compatibility_flags` in `wrangler.jsonc`.

---

## 10. Configuration and file ownership

### The three configuration files

All site-specific values live in exactly three files. Nothing else in application code should ever
carry a brand identifier, domain or colour value.

| File | What belongs there | Your remit |
|---|---|---|
| `src/config/site.config.ts` | Slug, domain, brand name, default metadata, email fallbacks | Refine `brandName` and the `meta` defaults; leave `slug`, `domain` and `cloudflareAccountId` alone |
| `src/app/(frontend)/styles.css` `@theme` | Colours, fonts, spacing, radii | **Yours** — this is the reskin |
| `wrangler.jsonc` | Worker, database, bucket and namespace names, resource IDs, bindings, domains | **Flux-owned** — do not edit without sign-off |

`brandName` is auto-derived from the repository name during setup and is cosmetic. If the styled form
differs (for example "The Grand Hôtel & Spa"), correct it in `site.config.ts`. The `meta.title` and
`meta.description` values are generic placeholders — replace them with real copy.

If you genuinely need a new Cloudflare binding, raise it with Flux. Note for context: **named
environments do not inherit top-level bindings**, so any binding must be declared twice in
`wrangler.jsonc` — at the top level and inside `env.staging`.

### File ownership — what is yours, what is not

Use this as the quick answer to "am I allowed to change this?"

**Yours to build in**

| Path | Notes |
|---|---|
| `src/app/(frontend)/**` | The whole front-end. Replace the placeholder home page. |
| `src/components/**` | Extend the primitives, add your own components. |
| `src/collections/**` | Extend `Pages`, add collections. Preserve the access patterns (§12) and migrate every change. |
| `src/lib/**` | Add helpers. Leave `env.ts`, `serverUrl.ts` and `redirects.ts` alone — they encode environment and KV behaviour. |
| `src/app/(frontend)/styles.css` | The `@theme` block is your reskin. |
| `src/migrations/**` | **Additive only.** Commit new generated migrations; never edit or delete an existing one. |
| `tests/**` | Add coverage for what you build. |
| `public/**` | Static assets. |

**Read these, do not edit them**

| Path | Why you need it |
|---|---|
| `docs/BUILD-HANDBOOK.md` | This document. |
| `docs/CHEATSHEET.md` | Day-to-day commands. |
| `README.md` | The comprehensive reference. |
| `docs/UPGRADING.md` | Mandatory before proposing any version change (§9). If you discover a new constraint, tell Flux to record it — do not add it yourself. |

**Do not touch — Flux-owned**

| Path | Why |
|---|---|
| `wrangler.jsonc` | Infrastructure: names, resource IDs, bindings, domains, compatibility settings. |
| `.github/workflows/**` | The deploy pipeline and quality gates. All four files are version-coupled. |
| `.claude/skills/**` | Includes `setup-cloudflare`, which must never be run on a configured repository. You may add your **own** skills or commands; do not modify or run the existing one. |
| `package.json` (dependencies, engines, scripts) | Version changes are Flux-owned (§9). |
| `pnpm-lock.yaml` | Only ever as the byproduct of an approved dependency change. |
| `.npmrc` | Holds the deliberate `legacy-peer-deps` setting. |
| `next.config.ts`, `open-next.config.ts` | Workers build configuration. |
| `vitest.config.mts` | Contains the required `fileParallelism` / `isolate` flags (§6). |
| `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` | Toolchain configuration. |
| `.env.example` | The template. Your own `.env` is yours and is never committed. |

**Shared, with constraints**

| Path | Constraint |
|---|---|
| `src/payload.config.ts` | You will edit this to register collections. **`r2Storage` must stay last in `plugins`**, plugin access overrides must be preserved (§12), and any resulting schema change needs a migration. |
| `src/config/site.config.ts` | Refine `brandName` and the `meta` defaults. Leave `slug`, `domain` and `cloudflareAccountId` untouched. |
| `CLAUDE.md` | Guidance loaded automatically by Claude Code. Do not alter the existing constraints. You may **append** client-specific build conventions in their own clearly-marked section if that helps your team; tell Flux when you do. |

Anything not listed: ask before changing it.

---

## 11. Styling and components


Tailwind CSS v4 with CSS-first configuration. There is no `tailwind.config.js`.

### Do

- Put brand values in the `@theme` block in `src/app/(frontend)/styles.css`. Each token becomes a
  utility automatically: `--color-brand` yields `bg-brand`, `text-brand`, `border-brand`;
  `--font-display` yields `font-display`.
- Wire real brand fonts via `next/font` and point the `--font-*` tokens at the generated CSS
  variables.
- Compose pages from the primitives in `src/components/ui/` — `Container`, `Stack`, `Heading`,
  `Button`, `Prose` — imported from the barrel: `import { Container, Heading } from '@/components/ui'`.
- Override primitive styling with the `className` prop; conflicts resolve correctly via `cn()`.
- Wrap Payload Lexical rich text in `<Prose>` so headings, lists and links pick up typography styling.
- Let `prettier-plugin-tailwindcss` sort class names on format.
- Use `tracking-5` / `tracking-10` for letter-spacing (`--tracking-5: 5%`, `--tracking-10: 10%` in the
  `@theme` block). Every letter-spacing value in the Figma file is exactly 5% or 10% of that element's
  own font-size — check `text-N` on the same node and pick the token: `text-12` + 0.6px → `tracking-5`
  (0.6 / 12 = 5%), `text-12` + 1.2px → `tracking-10` (1.2 / 12 = 10%).

### Do not

- Do not add `@import "tailwindcss"` to `src/app/(payload)/custom.scss`. Tailwind is scoped to the
  front-end precisely so its reset never reaches the admin user interface.
- Do not hard-code brand colours or fonts in components. Use the tokens.
- Do not re-style from scratch what a primitive already covers.
- Do not write letter-spacing as an arbitrary value (`tracking-[1.2px]`). Convert it to `tracking-5` or
  `tracking-10` — see above.

---

## 12. Access control and roles

Two tiers, defined in `src/access/index.ts` and wired into every collection.

| Role | Who | Can | Cannot |
|---|---|---|---|
| **Admin** | Flux team | Everything, including user management; the only role that may delete | — |
| **Editor** | Client team | Create and edit Pages, Media and Forms; read form submissions | Manage users, delete anything, run imports or exports |

Constraints to preserve when you extend collections:

- **`form-submissions` create must stay `anyone`.** Public submissions are unauthenticated.
- Media `read` must stay public — images render on the public site.
- Plugin access is applied through override keys (`formOverrides`, `formSubmissionOverrides`,
  redirects `overrides.access`, `overrideImportCollection`, `overrideExportCollection`). If you touch
  those, re-verify access still applies — a wrong key silently falls back to open defaults.
- Only admins may set `roles`; the field-level guard prevents an editor escalating themselves. Keep it.
- `roles` rides in the authentication token (`saveToJWT`), so a role change takes effect on the user's
  **next login**. This is expected behaviour, not a bug.

Apply the same pattern to any new collection: explicit `access` on all four operations, `delete`
restricted to admin.

---

## 13. Secrets

The repository commits zero secret values, and it must stay that way.

- **Locally:** only `PAYLOAD_SECRET` is required. Generate your own with `openssl rand -hex 32`. It
  signs local session cookies only and does not need to match any deployed value.
- **Optional locally:** Resend (emails are otherwise written to the console), Turnstile (use
  Cloudflare's official test keys, which always pass), Sentry (a complete no-op when unset). All are
  documented in `.env.example`.
- **Deployed secrets are already set** by Flux and live only in Cloudflare and GitHub organisation
  secrets. You never need to see or manage them.

### Do not

- Do not commit `.env` (it is gitignored — keep it that way).
- Do not add a secret to a workflow file, a comment, or a pull request description.
- Do not add a new `NEXT_PUBLIC_*` variable expecting it to be a secret. Those are inlined into the
  client bundle at build time and are public by definition.
- Do not import `src/lib/turnstile.ts` from client code. Its `server-only` guard will fail the build
  — correctly, because it touches the Turnstile secret.

---

## 14. Existing features to build on rather than rebuild

Several things are already wired. Use them.

| Need | Use this | Notes |
|---|---|---|
| Editorial pages | `Pages` collection | Drafts, autosave, versions, SEO tab and live preview already configured. Extend it with blocks and layout fields. |
| Per-page metadata | SEO plugin | Adds a `meta` tab; title and canonical URL generation already wired |
| Editor-managed forms | Form Builder plugin (`forms`) | For standard enquiry forms the marketing team controls |
| Bespoke forms | react-hook-form + zod | Follow `src/components/ContactForm.tsx` and its server route |
| Spam protection | Turnstile | Client widget plus server-side verification in `src/lib/turnstile.ts` |
| Redirects | `redirects` collection | Managed in the admin, served from KV via `src/middleware.ts` with a single O(1) read. Per-row status: 301 (default), 302, 303, 307, 308. Bulk CSV import and export available. |
| Galleries and sliders | `embla-carousel-react` | See `src/components/Carousel.tsx` |
| Animation | `motion` | Code-split via `LazyMotion`; see `src/components/FadeIn.tsx` |
| Live preview | `LivePreviewListener` | Mount it in pages rendered for preview so the admin iframe refreshes on save |
| Transactional email | Resend, via Payload | Gated on the API key, so local development works unconfigured |
| Error monitoring | `@sentry/cloudflare` | Gated on `SENTRY_DSN`; a no-op until Flux sets it |

**Redirect import housekeeping:** after reviewing a bulk import result, delete the import record in
the admin. That removes the stored file from R2. It is deliberately not automatic, because the record
holds the result log you review.

---

## 15. Scaffolding to remove

The following ships as demonstration material and should not survive into the delivered site:

- `src/app/(frontend)/page.tsx` — the Payload welcome page. Replace it with the real home page. Note
  it currently loads an image from `raw.githubusercontent.com`; no delivered page should load assets
  from an external host.
- `src/app/my-route/route.ts` — an example custom route.
- `src/config/site.config.ts` — the placeholder `meta.title` and `meta.description`.
- `src/components/ContactForm.tsx` and its route — keep as a pattern if you need a bespoke form;
  remove if the site uses Form Builder forms only.

---

## 16. Things that look broken but are not

Check this list before raising an issue.

| What you see | What it actually is |
|---|---|
| A site URL redirects to `cloudflareaccess.com` | The Cloudflare Access gate protecting pre-launch sites. Authenticate through it. Ask Flux for access if you cannot. |
| The site runs on `*.workers.dev`, not the client domain | Expected until the domain is delegated to Cloudflare. Flux completes this at launch. |
| Every response on `*.workers.dev` and `staging.<domain>` carries `X-Robots-Tag: noindex, nofollow` | Deliberate, and it must stay. Indexing is allowed only on the hosts listed in `indexableHosts` (`src/config/site.config.ts`); everything else is noindexed at all times. Do not "fix" it. See §8. |
| Peer dependency warnings on install about `next` | The deliberate Next.js hold. See §9. Do not act on it. |
| "Media sync skipped — set `R2_ACCESS_KEY_ID`…" | Expected without the R2 token and `rclone`. Media sync is optional. |
| `db:pull` fails with `no such table` | The `sqlite3` command-line interface is missing. `brew install sqlite3`. |
| `payload migrate` prompts about development mode | Your local database was development-pushed. Run `pnpm db:reset:local` first. |
| CI migration drift check failed | Your schema changed without a migration. Run `pnpm migrate:create <name>` and commit. |
| `environment` or `vars.*` "context access might be invalid" warnings in workflow files | Editor noise; they resolve once the value exists. |
| A push to the `upstream` remote is rejected | The intended guard. Never push upstream. |

---

## 17. Delivering the build

When the site is complete, deliver by merging into `staging` and confirming the staging deploy is
green. Flux then reviews and owns everything from `main` to production.

Before you hand back, confirm all of the following:

- [ ] All work is merged to `staging` and the staging deploy is green.
- [ ] `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm check:migrations` and `pnpm test:int:ci` all pass.
- [ ] Every schema change has a committed migration; the drift check is clean.
- [ ] All scaffolding from §15 is removed.
- [ ] Brand tokens are complete in the `@theme` block; no hard-coded brand colours or fonts remain in
      components.
- [ ] `site.config.ts` carries the correct `brandName` and real default metadata.
- [ ] No file outside the three configuration files carries a brand identifier, domain or colour value.
- [ ] `wrangler.jsonc` is unchanged from handover, or every change is documented and agreed.
- [ ] No secret values appear anywhere in the repository or its history.
- [ ] No `imageSizes` or `crop` on any upload collection; `r2Storage` is still last in `plugins`.
- [ ] No vendor Node SDKs installed for services that offer a REST API (§8); the staging bundle-size
      summary is below the warning threshold.
- [ ] `form-submissions` create access is still `anyone`; a real submission succeeds on staging.
- [ ] No dependency, tool, Action or runtime version has changed without agreement.
- [ ] The site renders correctly on staging and the admin loads and authenticates.
- [ ] Redirects, forms and media all function on staging.
- [ ] Live preview works for draft content.
- [ ] Staging still returns `X-Robots-Tag: noindex, nofollow` and `indexableHosts` lists only hosts
      that should be publicly indexed:
      `curl -sI https://<worker>-staging.<subdomain>.workers.dev/ | grep -i x-robots-tag`

Flux completes the launch: the custom-domain routes, the apex-to-`www` redirect, the go-live content
promotion, and the approved production deploy.

**Flux launch gate — indexing.** The noindex rule is fail-safe, so a wrong `site.domain` silently
leaves the live site unindexable. After DNS delegation and uncommenting the `routes`, and before
announcing go-live:

```bash
curl -sI https://www.<domain>/ | grep -i x-robots-tag   # MUST return nothing
curl -s  https://www.<domain>/robots.txt                # MUST be present and permissive
```

If the header is still there, the deployed host is not in `indexableHosts`. Confirm with Google
Search Console URL Inspection once live.

---

## 18. When to escalate rather than proceed

Come to Flux — do not resolve these yourself:

- Any version change, or any peer-dependency error you are tempted to work around.
- Any change to `wrangler.jsonc`, including a new binding.
- Anything requiring a new Cloudflare resource, secret, or account-level setting.
- Anything requiring production access or production data.
- Any change to the four GitHub Actions workflows or to CI gates.
- A deploy failure you cannot explain, particularly one mentioning remote preview sessions or error
  1031 — check `wrangler` and OpenNext peer alignment before touching application code, and tell Flux.
- Any constraint in this handbook that appears to block a requirement in the brief. There is usually a
  supported route; ask before working around it.

If you discover a new constraint or coupling during the build, tell Flux so it can be recorded in
[UPGRADING.md](UPGRADING.md) and inherited by the next project.