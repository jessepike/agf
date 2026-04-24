# AGF Tooling Guide

**Audience:** Jesse Pike (sole maintainer). Quickstart + reference for the release infrastructure and AGF domain agent.
**Last updated:** 2026-04-23
**Applies to:** v0.2.0+

---

## What exists

Three capability groups, built 2026-04-23 to move AGF toward transparent, repeatable, gated releases.

### 1. AGF repo release scripts (this repo)

Location: `bin/` and `.githooks/` in this repo.

| Script | Purpose |
|---|---|
| `bin/preflight.sh` | Repo cleanliness, branch, `pnpm`/`node`, `agf-docs/node_modules` presence |
| `bin/drift-report.mjs` | Diff canonical `docs/*.md` against their MDX renders in `agf-docs/content/docs/` |
| `bin/sync-to-site.sh` | Mirror `diagrams/*.png` → `agf-docs/public/diagrams/` with `MANIFEST.json` |
| `bin/lint-mdx.sh` | markdownlint + cspell + parse-landmine grep across MDX |
| `bin/check-links.mjs` | Resolve every internal `/docs/...` and asset ref against the actual route tree |
| `bin/smoke-deployed.mjs` | Post-deploy HTTP checks against agf.jessepike.dev |
| `.githooks/pre-push` | Pre-push gate: preflight → lint → links → `pnpm build` |

One-time setup:

```sh
git -C /Users/jessepike/code/clients/risk/AGF config core.hooksPath .githooks
```

Bypass with `git push --no-verify` only in emergencies — document the bypass in the commit body.

### 2. `agf-release` skill (dev system)

Location: `~/code/tools/ai-dev/skills/agf-release/SKILL.md` (outside this repo).

Orchestrates the 5-stage pipeline codified in `docs/release-playbook.md` (Preflight → Sync+Lint → Build → Tag+Publish → Smoke). Spawns `agf-architect` as the Stage 2 architect reviewer. Invokes the `bin/` scripts above — does not reimplement their logic.

Invoke: `/agf-release` (full pipeline), `/agf-release --stage N` (single stage), `/agf-release --dry-run` (runs through Stage 4 without deploying).

Registered in `~/code/_shared/capabilities-registry/capabilities/skills/agf-release/`.

### 3. `agf-architect` agent (dev system)

Location: `~/code/_shared/pike-agents/plugins/agf-architect/` (outside this repo).

Dedicated AGF domain expert. Two modes:

- **Thought partner (default, 80%):** Socratic discussion on primitives, vocabulary, decisions, crosswalks. Can draft new primitives/decisions/vocabulary entries on request (marked as proposal, not canonical).
- **Release reviewer (20%):** Stage 2 architect review in `agf-release` skill runs.

Grounding: reads canonical AGF docs at invocation (this repo's `docs/`). Crosswalk answers grounded in `docs/crosswalks/*` where present; best-effort with explicit confidence levels where not.

Launch standalone: `claude-agf-architect` (shell launcher installed in `~/.zshrc`).

Slash commands (available inside a `claude-agf-architect` session):

| Command | Purpose |
|---|---|
| `/agf-think <topic>` | Thought-partner discussion — free-form |
| `/agf-review <path-or-diff>` | Structured review against AGF principles |
| `/agf-crosswalk <framework>` | Crosswalk query (e.g., `/agf-crosswalk nist-ai-rmf`) |
| `/agf-primitive <number-or-question>` | Deep primitive query |
| `/agf-surveil` | Upstream framework surveillance (via WebSearch) |
| `/agf-release` | Runs the release pipeline |

Registered in `~/code/_shared/capabilities-registry/capabilities/agents/agf-architect/`.

---

## Verify your setup (sanity tests)

Run these once after install, and whenever something feels off.

### Test 1 — Pre-push hook is wired

```sh
cd /Users/jessepike/code/clients/risk/AGF
git config core.hooksPath
# expected: .githooks
```

### Test 2 — Preflight script runs clean

```sh
cd /Users/jessepike/code/clients/risk/AGF
bin/preflight.sh
# expected: exit 0 on clean tree; clear error messages otherwise
```

### Test 3 — Drift report renders

```sh
bin/drift-report.mjs
# expected: JSON + human summary listing canonical↔MDX pairs with drift metrics
```

### Test 4 — Link check

```sh
bin/check-links.mjs
# expected: exit 0 if all internal /docs/... and asset refs resolve;
#           non-zero with file:line list if anything is broken
```

### Test 5 — MDX lint

```sh
bin/lint-mdx.sh
# first run installs markdownlint-cli2 + cspell as dev deps in agf-docs/
# and creates cspell.json + .markdownlint-cli2.jsonc on first run
```

### Test 6 — agf-architect agent launches

In a fresh terminal:

```sh
claude-agf-architect
```

Then inside the session:

```text
/agf-primitive 8
```

Expected: agent reads `docs/agentic-primitives.md`, returns a deep answer about Primitive #8 (Governance Gates) grounded in the canonical text, with confidence labels where appropriate.

### Test 7 — Thought-partner mode

Same session:

```text
/agf-think does the GDR doc conflate HALT and ESCALATE anywhere?
```

Expected: Socratic engagement — agent reads the doc, pushes back or confirms, surfaces any conflicts with the gate vocabulary disambiguation (D16/D17).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Pre-push hook doesn't fire | `core.hooksPath` not set | Run the one-time setup above |
| `bin/lint-mdx.sh` fails with "command not found" | Dev deps not yet installed | It auto-installs on first run; re-run after |
| `bin/check-links.mjs` flags link as broken but it resolves in browser | Dynamic route vs static | Open a backlog item; tighten resolver in the script |
| `claude-agf-architect` not found | Shell hasn't re-sourced `.zshrc` | Open a fresh terminal or `source ~/.zshrc` |
| Slash commands not available in session | Plugin manifest missing or path wrong | Check `~/code/_shared/pike-agents/plugins/agf-architect/.claude-plugin/plugin.json` exists |
| Drift report empty | Canonical → MDX mapping heuristic missed a pair | Edit the mapping table in `bin/drift-report.mjs` |

---

## Where everything is captured

For future orientation, the release of this infrastructure itself is recorded in:

- This file (`docs/tooling-guide.md`) — the operational reference
- `docs/release-playbook.md` — the release process philosophy and per-stage detail
- `status.md` — dated project-state snapshot
- `lessons.md` — hot-buffer of session insights
- `CHANGELOG.md` — framework release log (v0.2.0 entry)
- `~/code/_shared/pike-agents/CHANGELOG.md` — agent/skill build log (2026-04-22–23 entry)
- Git log: commit `c39f412` (scripts + governance scaffolding) + Forge commits for agent/skill
- Capabilities registry entries for `agf-architect` and `agf-release`

Three-level rule for remembering: check this guide first → follow pointers to the authoritative docs → fall back to git log.
