# AGF Estate Map

**Last verified:** 2026-10-28

This page shows how the AGF source, GitHub, Vercel, the public site, and the local folders fit together. This repository is the single home for AGF. If anything below stops being true, fix this page in the same commit.

## The publishing chain

```
~/code/clients/risk/AGF  (this repo, local working copy)
        │  git push
        ▼
github.com/jessepike/agf  (PUBLIC, default branch main)
        │  Vercel Git integration, every push to main
        ▼
Vercel project "agf"  (team: pikeholdings, framework: Next.js, Node 24)
        │  builds agf-docs/ (Next.js + Fumadocs)
        ▼
https://agf.jessepike.dev  (production custom domain)
        │  after deploy
        ▼
.github/workflows/smoke.yml  (smoke test against agf.jessepike.dev)
```

- Production domains on the Vercel project are `agf.jessepike.dev` (custom, verified) and `agf-tau.vercel.app` (the Vercel default). Preview deployments are behind Vercel SSO. The custom domain is public.
- Every push to `main` is a production deploy. There is no staging step.
- The local pre-push hook (`.githooks/pre-push`, enabled with `git config core.hooksPath .githooks`) runs lint, link, and build checks before a push.
- `llms.txt` at the site root carries nearly the full doc set for machine readers.

## How content moves inside the repo

| Source of truth | Published copy | How it gets there |
|---|---|---|
| `docs/*.md`, `docs/profiles/*.md`, `docs/white-papers/*.md` | `agf-docs/content/docs/**.mdx` | `agf-docs/scripts/sync-content.sh`, then hand edits for MDX components |
| `diagrams/*.png` | `agf-docs/public/diagrams/` | `bin/sync-to-site.sh` |
| `CHANGELOG.md`, `DECISIONS.md`, `GOVERNANCE.md` | `agf-docs/content/docs/transparency/` | manual sync |

Only what is under `agf-docs/` is published. Everything else in the repo is public on GitHub but not on the site.

## What is in the repo

| Path | Tracked | What it is |
|---|---|---|
| `docs/` | yes | Canonical framework docs, profiles, white papers, reviews, findings ledger, GDR schema |
| `docs/baseline/` | yes | Dated current-state baselines |
| `docs/archive/` | yes | Retired context files kept for history |
| `docs/operations/` | yes | This map and other operating notes |
| `research/` | yes | Dated public research passes (for example `research/2026-10/`) |
| `diagrams/` | yes | Diagram sources and specs |
| `agf-docs/` | yes | The site (Next.js + Fumadocs) |
| `bin/`, `.githooks/`, `.github/` | yes | Release and check tooling |
| `docs/inbox/` | no (gitignored) | External PDFs and upstream repo clones used as research input (about 110 MB) |
| `data/` | no (gitignored) | Local knowledge-base and memory caches |
| `.private/` | no (gitignored) | Private drafts, strategy, internal reviews, imported commercial material, raw research media. **Lives only on this Mac.** |

## Related material outside this repo

| Location | What it is | Status |
|---|---|---|
| `github.com/jessepike/agf-applied` (private), local `~/code/clients/risk/agf-applied` | A catalog that classifies real systems against AGF layers | Dormant since 2026-05-22 |
| `~/code/_shared/pike-agents/plugins/agf-architect` | The `agf-architect` agent definition and commands | Active, owned by Forge |
| `~/code/_shared/agent-exec/agf-architect/inbox` | Handoffs addressed to agf-architect | Holds 4 unprocessed items from July–August 2026 |
| `~/code/_shared/context-registry/agf` | Short context bundle (state, goals, stance, glossary) for other agents | Last reviewed 2026-05-03, stale |
| `~/code/sandbox/agf-harness-test-research` | April 2026 harness and terminology research sandbox | Dormant |
| `~/code/clients/pike/jessepike.dev` | Jesse's personal site, which links to AGF as a flagship | Separate repo and deployment |

Commercial and client material that relates to AGF is indexed privately in `.private/estate-index.md`. It is not described here because this repository is public.
