# Cheat Sheet

Quick reference for the three-environment workflow. Full detail in the
[README](../README.md). Build-team do's, don'ts and hard constraints: the
[Build Handbook](BUILD-HANDBOOK.md).

## Environments

| | Local | Staging | Production |
|---|---|---|---|
| URL | `localhost:3000` | `staging.<domain>` | `www.<domain>` |
| D1 + R2 | Miniflare (throwaway) | `*-staging` (own) | prod (own) |

Code/schema flows **up** (PR → gates → deploy). Content/data flows **down** (`sync:staging`, `db:pull`) —
except during the initial build, when the scheduled down-sync is disabled and **staging holds the content**.
Sites sit behind Cloudflare Access — a 302 to `cloudflareaccess.com` is the login gate, not an error.

## Start working

```bash
pnpm install
cp .env.example .env          # set PAYLOAD_SECRET (openssl rand -hex 32)
pnpm wrangler login
pnpm db:pull                  # real prod data → local (needs sqlite3 CLI)
pnpm dev                      # localhost:3000 — log in with prod admin credentials
```

## Daily commands

| Command | Does |
|---|---|
| `pnpm dev` | Run locally |
| `pnpm db:pull [--from=staging] [--with-media]` | Refresh local data (and media) |
| `pnpm migrate:create <name>` | Create a migration after schema edits — **commit it**. Required after adding/enabling any plugin with collections/fields or drafts. |
| `pnpm generate:types` | Regenerate Payload + Cloudflare types after config/binding changes |
| `pnpm lint` · `pnpm exec tsc --noEmit` · `pnpm check:migrations` | The CI gates, locally |
| `pnpm sync:staging` | Refresh staging (D1 + media + redirects/KV) from prod |
| `pnpm exec wrangler deploy --dry-run --env staging` | Worker bundle size after a build — prints `Total Upload / gzip`. Limit **10 MB gzipped**; bare clone ~3,962 KiB, full site ~4,724 KiB. Staging deploys report it automatically. |

## Ship a change

1. Branch → commit → **PR into `staging`** → CI must pass.
2. Merge → auto-deploys staging → review on `staging.<domain>`.
3. **PR into `main`** → CI must pass → merge → **production deploys after manual approval**.

Don't push directly to `main` (it deploys production). Always create a migration for schema changes.

## Styling (Tailwind v4) — see [README §styling](../README.md#styling-tailwind-css)

- **CSS-first config** — no `tailwind.config.js`. Setup: [`postcss.config.mjs`](../postcss.config.mjs) + the `@theme` tokens in [`(frontend)/styles.css`](../src/app/(frontend)/styles.css).
- **Reskin per client:** change the `@theme` token values (colours, fonts, spacing) — each becomes a utility (`--color-brand` → `bg-brand`).
- **Primitives:** `import { Container, Stack, Heading, Button, Prose } from '@/components/ui'` — compose pages from these; override with `className` (merged via `cn()`).
- **Rich text:** wrap Payload Lexical in `<Prose>` for typography styling.
- **Scoped to the frontend** — never import Tailwind into `(payload)/custom.scss`; it would break the admin UI.

## Plugins & libraries — see [README §dependencies](../README.md#dependencies--plugins)

- **Pages** collection has drafts + autosave + live preview + SEO fields — the template editorial collection.
- **Forms:** editor-managed via Form Builder (`forms` collection) **or** hand-coded with react-hook-form + zod (`ContactForm`). Both available.
- **Redirects:** managed in the CMS, served from KV via `middleware.ts` (O(1), fails open). Per-row **Type** = 301/302/303/307/308 (default 301). Bulk **CSV import/export** in the admin (sync mode); imported rows auto-update KV. Delete the import record afterwards to clear its R2 file.
- **Focal point:** stored on Media, applied with CSS `object-position` (no Sharp). Don't add `imageSizes`.
- **Forms spam:** Cloudflare Turnstile, verified server-side. **Animation:** `motion` (code-split). **Carousel:** embla.
- **Third-party services (booking engine, CRM):** integrate over their **REST API with `fetch`** — never install the vendor's Node SDK. Those SDKs are 1–3 MB gzipped (more than a whole site build) and routinely assume Node APIs absent from workerd. No REST path? Escalate — the integration moves to a separate Worker behind a service binding.
- Keep every `@payloadcms/*` package pinned to the same version as `payload`.

## One-time setup (in-house) — see [README §setup](../README.md#one-time-infrastructure-setup-in-house-performed-once)

0. **Reskin = 3 files:** `src/config/site.config.ts` (names/brand/emails) · `src/app/(frontend)/styles.css` `@theme` (colours/fonts) · `wrangler.jsonc` (infra + domains). Nothing else in app code carries brand identifiers.
1. `wrangler d1 create <slug>-staging` + `wrangler r2 bucket create <slug>-staging` + `wrangler kv namespace create <slug>` (prod) and `wrangler kv namespace create <slug>-staging` (staging) → put the ids in `wrangler.jsonc`. KV follows the same slug naming as D1/R2; the binding stays `KV`.
2. Disable Cloudflare auto-builds on both workers.
3. Confirm org secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` / `R2_*` / `RESEND_API_KEY`.
4. Push to `staging` → first deploy creates the staging worker + domain.
5. `wrangler secret put PAYLOAD_SECRET` (prod) and `--env staging` — distinct values, never in GitHub. If using forms, also `TURNSTILE_SECRET_KEY` per env + the public vars.
6. **Canonical host:** in Cloudflare (the zone → **Rules → Redirect Rules**, or **Page Rules**) add a **301** forcing apex → `www` — match `<domain>/*` → `https://www.<domain>/$1` (preserve query). Per-zone config, **required for every clone**, or the admin import screen fails with "NetworkError" (apex is cross-origin to `serverURL`). See [README §setup step 6](../README.md#one-time-infrastructure-setup-in-house-performed-once).
7. **Pause the nightly staging refresh for the build phase:** `gh workflow disable sync-staging.yml`. It drops all staging tables and reimports (empty) production nightly, wiping the build team's staging content and admin accounts. With it off, **staging is the durable content home** until go-live. Re-enable at launch (step 10). `pnpm sync:staging` locally still works for a one-off.
8. Media: create an **Account** R2 API token (Object Read & Write) → add `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` as org secrets + local `.env`; `brew install rclone`.
9. At sign-off: add a **required reviewer** to the production Environment (the manual go-live gate).
10. At launch: `gh workflow enable sync-staging.yml` (re-enables the nightly prod → staging refresh paused in step 7).

## Secrets at a glance — see [README §secrets](../README.md#secrets)

**Shared (GitHub org secrets, reused by every site):** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_*`, `RESEND_API_KEY` (one Flux Resend account; `DEFAULT_FROM_EMAIL` picks the domain).
**Per-site (Cloudflare only, never in GitHub):** `PAYLOAD_SECRET`, `TURNSTILE_SECRET_KEY`; plus public vars `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time), `NEXT_PUBLIC_SERVER_URL`, `SENTRY_DSN`.
**Local:** only `PAYLOAD_SECRET` is required — Resend optional, Turnstile has test keys, Sentry off.

## Gotchas

| Symptom | Fix |
|---|---|
| `db:pull` → `no such table` | Install `sqlite3` (`brew install sqlite3`) |
| `payload migrate` prompts about dev mode | `pnpm db:reset:local` first (db:pull does this) |
| Media sync "skipped — set R2_ACCESS_KEY_ID…" | Add the R2 token + `brew install rclone` (or it stays skipped) |
| Site 302s to `cloudflareaccess.com` | Expected — authenticate through Cloudflare Access |
| CI migration-drift failed | `pnpm migrate:create <name>` and commit |

More detail on any of the above: [README](../README.md).
