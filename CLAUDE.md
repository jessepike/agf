# AGF — Agentic Governance Framework

Reference architecture and operating model for organizations governing agentic systems. Synthesizes NIST, OWASP, CSA, ISO, EU AI Act, OpenTelemetry, and academic research into a coherent playbook.

**Version:** v0.2.0 (shipped 2026-04-22)
**License:** CC BY 4.0 (docs); Apache-2.0/MIT for any reference implementations
**Governance:** BDFL (Jesse Pike, sole maintainer). See `GOVERNANCE.md`.
**Published site:** agf.jessepike.dev

---

## Key locations

| Area | Path | Purpose |
|---|---|---|
| Framework docs | `docs/` | 20+ canonical MDs — governance framework, primitives, DI, observability |
| Decision log | `DECISIONS.md` | Architectural decisions (D1–D17+); every substantive change logs here |
| Changelog | `CHANGELOG.md` | Keep-a-Changelog per-release |
| Diagrams | `diagrams/` | 24+ architecture diagrams + `DIAGRAM-SPECS.md` |
| Site source | `agf-docs/` | Next.js + Fumadocs site for agf.jessepike.dev |
| Research archive | `.private/research/` | Source extractions (Microsoft, CSA, etc.) |
| Intent (sacred) | `intent.md` | North star — do not auto-edit; surface proposed changes for Jesse |
| Backlog | `BACKLOG.md` | Prioritized work queue |
| Status | `status.md` | Dated project-state snapshots |
| Lessons | `lessons.md` | Hot buffer of session insights |

## Release + review infrastructure

| Doc | Purpose |
|---|---|
| `docs/tooling-guide.md` | Scripts (`bin/`), pre-push hook, agf-architect agent, release skill — with sanity tests |
| `docs/release-playbook.md` | 5-stage release pipeline philosophy + per-stage detail + rollback |
| `docs/reviews/README.md` | Review ingest format, scoring rubric, confidence gradient |
| `docs/reviews/` | Verbatim reviews (external, internal, peer) — one file per review |
| `docs/findings-ledger.md` | Cross-review findings ledger with F-IDs, state, validation |

## Confidence gradient (dogfood discipline)

AGF's own vocabulary applied to both content claims AND review findings:

- **Established** — clear evidence; multiple sources would agree
- **Informed** — our synthesis; single-source; plausible but unverified at scale
- **Open** — flagged but speculative; needs investigation

Apply to: claims in canonical docs, findings in the ledger, crosswalk assertions. If you can't label it confidently, say so rather than asserting.

## Scoring rubric (reviews + validation)

Eight dimensions, 0–10 each. Baseline: v0.2.0 at 5.1/10 avg (GPT-5.4 review 2026-04-23).

Clarity · Coherence · Defensibility · Differentiation · Actionability · Credibility · Public Readiness · Mechanical Integrity

Full rubric + baseline in `docs/reviews/README.md`.

## Agent routing

| Task | Agent |
|---|---|
| Framework/vocabulary/primitive deep-dive or review | `agf-architect` (launch: `claude-agf-architect`) |
| Cross-framework crosswalk question | `agf-architect` — reads `docs/crosswalks/` when present |
| Release pipeline | `/agf-release` skill (spawns agf-architect as Stage 2 reviewer) |
| Content production (blog, social, Substack) | pike-acm (Campaign 03 + Drafter) — not this repo |
| GTM / positioning / market messaging | CMO portfolio agent |
| Product strategy decisions | CPO portfolio agent |
| Portfolio-wide security | CISO portfolio agent |

## Commit conventions

- Conventional commits: `type(scope): description`
- **F-ID references** in commit body when addressing findings: `Closes G5-F01.` or `Related: G5-F03 (partial).`
- **DECISIONS.md entry** required for: new primitive, vocabulary change, primitive semantic change, novel framing, architectural repositioning
- **CHANGELOG.md entry** required for any release (Added / Changed / Removed / Fixed)
- Never commit `.private/research/` extractions without explicit direction

## Project constraints

- Published reference architecture — content changes are editorial decisions, not code changes
- All factual claims must be substantiable with cited sources OR carry an explicit confidence label
- Time-sensitive claims need dated sources (per G5-F20 pattern)
- `intent.md` is sacred — surface proposed language for Jesse decision, don't auto-edit
- Content production happens via pike-acm (Campaign 03), not directly in this repo

## Release pipeline (high-level)

```
Preflight → Sync+Lint → Build → Tag+Publish → Smoke
```

Details in `docs/release-playbook.md`. Pre-push hook enforces lint + links + build. Invoke full pipeline via `/agf-release`.

## When something new arrives

- **External review** → `docs/reviews/YYYY-MM-DD-<reviewer>.md` (verbatim) + findings extracted to `docs/findings-ledger.md` with `<prefix>-F##` IDs
- **New primitive / decision** → canonical doc in `docs/` + `DECISIONS.md` entry + `CHANGELOG.md` entry + MDX sync to `agf-docs/content/docs/`
- **New diagram** → `diagrams/` + spec in `DIAGRAM-SPECS.md` + `bin/sync-to-site.sh` mirrors to `agf-docs/public/diagrams/`

See `docs/tooling-guide.md` for the operational reference.
