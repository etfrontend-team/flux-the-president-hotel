# Project instructions for Claude Code

This file is loaded automatically at the start of every Claude Code session and is committed to the
repo, so it travels with every clone of this boilerplate. Keep it **lean** — it costs context on
every session. Put detail in the referenced docs; here, only signpost what must not be broken.

## Building a client site on a handed-over clone?

Read **[docs/BUILD-HANDBOOK.md](docs/BUILD-HANDBOOK.md)** — the do's, don'ts, file ownership and hard
constraints for the build team, plus the deployment process and hand-back checklist. It expands on
everything signposted below.

## Before changing ANY version (dependency, tool, GitHub Action, runtime)

**Never bump a version in isolation. Read [docs/UPGRADING.md](docs/UPGRADING.md) first** — it is the full
dependency coupling map and the pre-merge gate. The stack is tightly coupled
(Payload ↔ Next ↔ OpenNext ↔ wrangler ↔ Node, plus the tool clusters), and isolated bumps have
broken deploys before. Bump coupled packages together and run the gate in docs/UPGRADING.md before merge.

## Other conventions to respect (read the linked section before the task)

- **Schema is migration-driven.** Any new collection/field, or enabling drafts, is a schema change:
  run `pnpm migrate:create <name>` and commit the migration, or CI's drift gate blocks the PR.
  See README → "Schema changes (migrations)".
- **Cloning/renaming touches exactly three files:** `wrangler.jsonc` (infra: names, domains,
  resource IDs, bindings), `src/config/site.config.ts` (slug, domain, brand, emails),
  `src/app/(frontend)/styles.css` `@theme` (visual tokens). Keep names/domains in sync across them.
  See docs/UPGRADING.md → "Cluster 8" and README → "Cloning for a new client".
- **Deploy / branch flow:** `main` is the source of truth — branch from `main` and PR into `staging`
  (which auto-deploys staging for review); `staging` → `main` is in-house only, and the production
  deploy is a gated manual approval. GitHub Actions is the only deployer — never deploy by hand.
  See README → "Branching & review flow" and "Deploying".
- **Workers runtime constraints:** no Sharp at runtime (focal point via CSS, not image resizing); the
  Worker bundle must stay under **10 MB gzipped** (a bare clone is already ~40% of it — only *server*
  code counts); no background jobs runner, so bulk imports run inline in the request and must be
  batched. See README → "Dependencies & plugins".
- **Third-party integrations:** call the vendor's **REST API with `fetch`** — never install their Node
  SDK (1–3 MB gzipped each, and they assume Node APIs workerd lacks). See docs/UPGRADING.md → "Worker size
  budget".

When you discover a new coupling or constraint, record it in docs/UPGRADING.md so the next clone inherits
it — this file and that doc are how knowledge travels with the boilerplate (local Claude memory does
not).
