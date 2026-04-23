# AGF Governance

**Status:** Active — BDFL model, v0.x  
**Owner:** Jesse Pike  
**Last updated:** 2026-04-22

---

## Model

AGF operates under a **BDFL (Benevolent Dictator For Life)** model for v0.x.

Jesse Pike holds sole editorial authority over:
- Framework vocabulary and primitive semantics
- DECISIONS.md entries
- Versioning and release gating
- Contribution acceptance

This is not arrogance — it is scope control. Governance frameworks need a stable opinionated core before a committee can make meaningful contributions. BDFL → Core Maintainers → Community Working Group as the project matures (see Evolution section below).

---

## Decision Process

All substantive decisions are logged in `DECISIONS.md` as the **public canonical decision record**.

**How proposals enter:**
1. File a GitHub issue with your crosswalk, primitive gap, or vocabulary proposal.
2. If non-trivial, open a PR with a concrete draft — discussion happens in the PR.
3. Jesse reviews, decides, and writes the DECISIONS.md entry if accepted.
4. High-stakes decisions get a Codex external review round before commit (see recent entries for pattern).

**Jesse has final call on all framework content.** No appeal process — that's what BDFL means.

---

## Contribution Expectations

| Contribution type | Preferred channel |
|---|---|
| Crosswalk (NIST, OWASP, ISO 42001, EU AI Act) | GitHub issue with draft table |
| New primitive proposal | GitHub issue — describe the gap, not just the name |
| Vocabulary addition/refinement | PR against `docs/shared-vocabulary.md` |
| Clarification / typo / broken link | PR directly |
| Substantive framework change | Issue first; PR only after Jesse signals interest |

**Confidence levels are mandatory on substantive claims:**
- `Established pattern` — documented, multiple real-world implementations visible
- `Informed proposal` — reasoned from evidence; implementation experience may vary
- `Open question` — surface-level; needs validation before committing to framework

Contributions that omit confidence labels on substantive assertions will be asked to add them before merge.

---

## Versioning Policy

AGF uses **SemVer-ish** versioning. The framework is primarily prose + schemas, so interpretations below are adapted:

| Increment | Trigger |
|---|---|
| **Major** (1.x.x) | Vocabulary or primitive semantics break backward compatibility; requires migration guide |
| **Minor** (0.x.0) | New primitive, new concept doc, new profile, new crosswalk section |
| **Patch** (0.x.y) | Clarifications, tone fixes, cross-reference updates, schema non-breaking additions |

**v1.0 is earned, not scheduled.** Prerequisites:
- External review by practitioners outside Jesse's network
- At least two verified crosswalks (NIST AI RMF + one other)
- Outside contributors engaged (not just Jesse + his agents)
- AGF primitives stress-tested against real agentic system designs

**Current:** v0.2.0 — framework is usable and stable enough to build on, but evolving.

---

## Evolution

Governance model expected to evolve at these transitions:

1. **v0.x (now):** BDFL. Solo or invited-collaborator contributions.
2. **~v0.4–v0.5:** Add **Core Maintainers** (2–3 practitioners with demonstrated crosswalk/domain expertise). Merge rights delegated to them for profile docs and crosswalks.
3. **~v1.0+:** Consider **Community Working Group** for major vocabulary decisions. Jesse retains veto.

This document updated at each governance transition.

---

## References

- `DECISIONS.md` — all framework decisions, numbered
- `CHANGELOG.md` — version history
- `docs/release-playbook.md` — release process
- `CONTRIBUTING.md` — contributor how-to
