# AGF — Agentic Governance Framework (Codex mirror)

Mirror of `CLAUDE.md` — Codex reads this file. Keep content synchronized with CLAUDE.md.

---

Reference architecture and operating model for organizations governing agentic systems. Synthesizes NIST, OWASP, CSA, ISO, EU AI Act, OpenTelemetry, and academic research into a coherent playbook.

**Version:** v0.2.0 (shipped 2026-04-22)
**License:** CC BY 4.0 (docs); Apache-2.0/MIT for reference implementations
**Governance:** BDFL (Jesse Pike, sole maintainer). See `GOVERNANCE.md`.
**Published site:** agf.jessepike.dev

## Key locations

| Area | Path |
|---|---|
| Framework docs | `docs/` |
| Decision log | `DECISIONS.md` |
| Changelog | `CHANGELOG.md` |
| Diagrams | `diagrams/` |
| Site source | `agf-docs/` |
| Backlog / status / lessons | `BACKLOG.md` / `status.md` / `lessons.md` |
| Tooling guide | `docs/tooling-guide.md` |
| Release playbook | `docs/release-playbook.md` |
| Reviews (verbatim) | `docs/reviews/` |
| Findings ledger | `docs/findings-ledger.md` |
| Intent (sacred — read-only for agents) | `intent.md` |

## Confidence gradient (applied to content and findings)

- **Established** — clear evidence, multiple sources agree
- **Informed** — single-source synthesis, plausible
- **Open** — speculative, needs investigation

## Scoring rubric

8 dimensions, 0–10 each. Baseline v0.2.0 at 5.1/10 avg. Dimensions:
Clarity, Coherence, Defensibility, Differentiation, Actionability, Credibility, Public Readiness, Mechanical Integrity.

Full spec: `docs/reviews/README.md`.

## Commit conventions

- Conventional commits format
- F-ID refs in body when addressing findings: `Closes G5-F01.`
- DECISIONS.md entry for: new primitive, vocab change, semantic change, novel framing, architectural repositioning
- CHANGELOG.md entry for any release
- Do not commit `.private/research/` without explicit direction

## Constraints

- Content changes = editorial decisions, not code
- Factual claims need sources OR confidence labels
- Time-sensitive claims need dated sources
- `intent.md` is sacred — do not auto-edit
- Content production happens via pike-acm, not this repo

## Release pipeline

`Preflight → Sync+Lint → Build → Tag+Publish → Smoke`. Details: `docs/release-playbook.md`. Pre-push hook enforces lint + links + build.
