# AGF Findings Ledger

Cross-review ledger of findings extracted from every review of AGF. Format, rubric, and lifecycle documented in `docs/reviews/README.md`.

**Last updated:** 2026-04-23
**Open findings:** 23 (all pending triage)
**Reviews ingested:** 1 — `docs/reviews/2026-04-23-gpt-5-4.md`

---

## State legend

- **open** — ingested, not yet triaged
- **accepted** — triaged and accepted; work queued or in flight
- **deferred** — triaged and deferred; archived with reason
- **rejected** — triaged and rejected; archived with reason
- **resolved** — work shipped, awaiting validation
- **validated** — reviewer confirmed fix addresses finding
- **regressed** — previously validated, now failing

## Severity × Confidence grid

| | Established confidence | Informed confidence | Open confidence |
|---|---|---|---|
| **Critical** | fix immediately | investigate + fix | investigate urgently |
| **High** | fix soon | verify then fix | investigate |
| **Medium** | batch with other work | verify + batch | archive until verified |
| **Low** | easy win when convenient | verify if easy | archive |

See `docs/reviews/README.md` for full rubric + gradient definitions.

---

## Summary table

| F-ID | Summary | Severity | Confidence | Dimension | State |
|---|---|---|---|---|---|
| G5-F01 | Homepage CTA "Start with your role" misroutes to AI Engineering; should go to `/docs` | High | Established | Clarity | open |
| G5-F02 | Missing one-sentence definition of AGF at top of homepage and What-is-AGF | High | Established | Clarity | open |
| G5-F03 | No inline citations for numeric/empirical claims; breaks "evidence grounded" promise | High | Established | Credibility | open |
| G5-F04 | Homepage claims "confidence levels throughout" — not visibly delivered on pages | High | Established | Credibility | open |
| G5-F05 | "Operationalize at machine speed" overclaims; artifacts still planned | High | Established | Credibility | open |
| G5-F06 | "No framework has the Belief Layer" novelty claim unsupported | High | Established | Defensibility | open |
| G5-F07 | OTAA appears in public layer summary without definition at first use | High | Established | Clarity | open |
| G5-F08 | No "Core Concepts in Order" orientation page | High | Informed | Clarity | open |
| G5-F09 | Growth model drift: 4 composition patterns vs 5 implementation phases | High | Established | Coherence | open |
| G5-F10 | "See full primitive catalog" link points to AI Engineering, not primitives ref | High | Established | Mechanical | open |
| G5-F11 | No "What AGF is / is not" box on homepage | High | Informed | Clarity | open |
| G5-F12 | No 30-day implementation starter path for Minimum Viable Control | Medium | Informed | Actionability | open |
| G5-F13 | No end-to-end reference architecture walkthrough | Medium | Informed | Actionability | open |
| G5-F14 | No visible status badges (conceptual/specified/implemented) | Medium | Informed | Credibility | open |
| G5-F15 | "Governance" overloaded — framework, Ring 2, program maturity, gates, functions | Medium | Established | Coherence | open |
| G5-F16 | Observability taxonomy unclear — Primitive #10 vs concept vs Profile | Medium | Established | Coherence | open |
| G5-F17 | No attribution table showing which primitives come from which sources | Medium | Informed | Defensibility | open |
| G5-F18 | Slogan density too high; too many named constructs per page | Medium | Informed | Clarity | open |
| G5-F19 | `/docs/reference/observability-concept` slug mismatches page title | Low | Informed | Mechanical | open |
| G5-F20 | Time-sensitive claims (e.g., "Agent 365 planned May 2026") need dated sources | Low | Established | Credibility | open |
| G5-M01 | (Meta) Promises rigor/evidence/confidence without showing enough | High | Established | Credibility | open |
| G5-M02 | (Meta) Names too many things before proving why they matter | High | Established | Coherence | open |
| G5-M03 | (Meta) Public readiness premature — framework good, artifact uneven | High | Informed | Public Readiness | open |

---

## Finding details

### G5-F01

> Homepage CTA "Start with your role" misroutes to AI Engineering; should go to `/docs`

- **Severity:** High
- **Confidence:** Established — reviewer cited specific route
- **Dimension:** Clarity (UX routing)
- **Source:** `docs/reviews/2026-04-23-gpt-5-4.md` Section 10 Fix #1, Section 4 evidence
- **State:** open
- **Proposed action:** Change `href` in `agf-docs/app/page.tsx:155` from `/docs/profiles/ai-engineering` to `/docs` or a dedicated role-chooser route

### G5-F02

> Missing one-sentence definition of AGF at top of homepage and What-is-AGF

- **Severity:** High
- **Confidence:** Established — reviewer noted homepage hero + What-is-AGF both lack a hard definition
- **Dimension:** Clarity
- **Source:** Section 10 Fix #2
- **State:** open
- **Proposed action:** Draft canonical one-line definition; place at top of homepage and `/docs/overview/what-is-agf`; every other page conforms

### G5-F03

> No inline citations for numeric/empirical claims; breaks "evidence grounded" promise

- **Severity:** High
- **Confidence:** Established — specifically cites Trust Ladders + Composition Patterns
- **Dimension:** Credibility
- **Source:** Section 3, Section 5, Section 10 Fix #3
- **State:** open
- **Related:** G5-M01 (umbrella)
- **Proposed action:** Audit pages with numeric/empirical/comparative claims; add footnote citations

### G5-F04

> Homepage claims "confidence levels throughout" — not visibly delivered on pages

- **Severity:** High
- **Confidence:** Established — reviewer verified on inspected pages
- **Dimension:** Credibility
- **Source:** Section 3, Section 10 Fix #4
- **State:** open
- **Related:** G5-M01
- **Proposed action:** Either remove the claim OR add visible confidence markers on major claims (AGF vocabulary: Established / Informed / Open). Dogfood.

### G5-F05

> "Operationalize at machine speed" overclaims; artifacts still planned

- **Severity:** High
- **Confidence:** Established — reviewer quoted the v0.2 planned admission
- **Dimension:** Credibility
- **Source:** Section 3, Section 10 Fix #5
- **State:** open
- **Related:** G5-M01
- **Proposed action:** Rewrite as future-state language; mark as architectural commitment not current reality

### G5-F06

> "No framework has the Belief Layer" novelty claim unsupported

- **Severity:** High
- **Confidence:** Established — reviewer flagged as specific overreach
- **Dimension:** Defensibility
- **Source:** Section 3, Section 7, Section 10 Fix #6
- **State:** open
- **Proposed action:** Replace with bounded claim + comparison note; OR add a "Comparison to Adjacent Work" subsection that actually defends the novelty

### G5-F07

> OTAA appears in public layer summary without definition at first use

- **Severity:** High
- **Confidence:** Established — reviewer verified on inspected pages
- **Dimension:** Clarity
- **Source:** Section 4, Section 10 Fix #7
- **State:** open
- **Note:** Lesson already captured 2026-04-21 that OTAA needs spelling out (LoRaWAN collision). This is the public-surface fix to match that lesson.
- **Proposed action:** Expand OTAA → "Observable · Traceable · Auditable · Agent-operable" at first use on every public page; OR remove OTAA from summary entirely

### G5-F08

> No "Core Concepts in Order" orientation page

- **Severity:** High
- **Confidence:** Informed — this is a design recommendation, not a defect
- **Dimension:** Clarity / Coherence
- **Source:** Section 10 Fix #8
- **State:** open
- **Proposed action:** New `/docs/overview/core-concepts` page with ordered progression: AGF definition → Rings → Primitives → Deployment modes → Trust → Observability → Maturity

### G5-F09

> Growth model drift: 4 composition patterns vs 5 implementation phases

- **Severity:** High
- **Confidence:** Established — reviewer cited both pages
- **Dimension:** Coherence
- **Source:** Section 4, Section 10 Fix #9
- **State:** open
- **Proposed action:** Pick one canonical model; reconcile Composition Patterns (4) with Rings Model growth phases (5); align messaging across all pages

### G5-F10

> "See full primitive catalog" link points to AI Engineering, not primitives ref

- **Severity:** High
- **Confidence:** Established — specific broken-intent link
- **Dimension:** Mechanical Integrity (misrouted link)
- **Source:** Section 4, Section 10 Fix #10
- **State:** open
- **Proposed action:** Fix link in `/docs/overview/what-is-agf` to point to `/docs/reference/primitives`

### G5-F11

> No "What AGF is / is not" box on homepage

- **Severity:** High
- **Confidence:** Informed — design recommendation
- **Dimension:** Clarity
- **Source:** Section 10 Fix #11
- **State:** open
- **Proposed action:** Add a homepage section with explicit is/is-not list (already exists as prose in `/docs/reference/relationship-to-frameworks` — surface it up)

### G5-F12

> No 30-day implementation starter path for Minimum Viable Control

- **Severity:** Medium
- **Confidence:** Informed — design recommendation
- **Dimension:** Actionability
- **Source:** Section 8, Section 10 Fix #12
- **State:** open
- **Proposed action:** New page `/docs/overview/first-30-days` or similar; concrete checkpoints, outputs, checklist for MVC deployment

### G5-F13

> No end-to-end reference architecture walkthrough

- **Severity:** Medium
- **Confidence:** Informed
- **Dimension:** Actionability / Differentiation
- **Source:** Section 10 Fix #13
- **State:** open
- **Proposed action:** One example: agent → verifier → gate → event stream → evidence artifact → trust adjustment. Threaded narrative, not disconnected diagrams. Could pair with Tool Gate MVP as reference implementation.

### G5-F14

> No visible status badges (conceptual/specified/implemented)

- **Severity:** Medium
- **Confidence:** Informed
- **Dimension:** Credibility / Public Readiness
- **Source:** Section 10 Fix #14
- **State:** open
- **Proposed action:** Badge system on primitive and concept pages — `Conceptual` / `Specified` / `Implemented`. Useful also for the primitive stability markers already in backlog (Community+credibility+adoption section).

### G5-F15

> "Governance" overloaded — framework, Ring 2, program maturity, gates, functions

- **Severity:** Medium
- **Confidence:** Established
- **Dimension:** Coherence
- **Source:** Section 4, Section 10 Fix #15
- **State:** open
- **Related:** G5-M02
- **Proposed action:** Disambiguate in `shared-vocabulary.md`; audit public pages for which sense of "governance" is meant; consider qualifiers ("the framework" / "Ring 2 / Governance ring" / "program-level governance")

### G5-F16

> Observability taxonomy unclear — Primitive #10 vs concept vs Profile

- **Severity:** Medium
- **Confidence:** Established
- **Dimension:** Coherence
- **Source:** Section 4, Section 10 Fix #16
- **State:** open
- **Proposed action:** Clarify three-layer relationship (Primitive-level / concept-level / Profile-level); add disambiguation to shared-vocabulary and to the observability-concept page

### G5-F17

> No attribution table showing which primitives come from which sources

- **Severity:** Medium
- **Confidence:** Informed
- **Dimension:** Defensibility
- **Source:** Section 10 Fix #17
- **State:** open
- **Proposed action:** New table on `/docs/reference/primitives` or a dedicated attribution doc — each primitive → originating community (NIST / OWASP / CSA / academic / novel AGF framing)

### G5-F18

> Slogan density too high; too many named constructs per page

- **Severity:** Medium
- **Confidence:** Informed
- **Dimension:** Clarity
- **Source:** Section 10 Fix #18
- **Related:** G5-M02
- **State:** open
- **Proposed action:** Editorial pass across public pages; reduce named-concept introduction rate; defer named constructs to canonical sections

### G5-F19

> `/docs/reference/observability-concept` slug mismatches page title

- **Severity:** Low
- **Confidence:** Informed
- **Dimension:** Mechanical Integrity / Clarity
- **Source:** Section 10 Fix #19
- **State:** open
- **Proposed action:** Rename slug to `agentic-observability` (title match); add redirect if Fumadocs supports; update all inbound links

### G5-F20

> Time-sensitive claims (e.g., "Agent 365 planned May 2026") need dated sources

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Credibility
- **Source:** Section 5, Section 10 Fix #20
- **State:** open
- **Proposed action:** Audit for time-sensitive ecosystem claims; add `(as of YYYY-MM-DD, source: X)` inline annotations

---

## Meta-findings (thematic)

### G5-M01

> Promises rigor/evidence/confidence without showing enough

- **Severity:** High
- **Confidence:** Established
- **Dimension:** Credibility / Defensibility
- **Source:** Sections 1, 3, 5, 9 (red-team critique 2)
- **State:** open
- **Umbrella for:** G5-F03, G5-F04, G5-F05, G5-F14
- **Note:** This is the pattern behind multiple line-item fixes. Even if all 4 line-items land, we should check this pattern holistically — resolving each individually doesn't guarantee the meta is resolved.

### G5-M02

> Names too many things before proving why they matter

- **Severity:** High
- **Confidence:** Established
- **Dimension:** Coherence / Clarity
- **Source:** Sections 1, 4, 7, 9 (red-team critique 3)
- **State:** open
- **Umbrella for:** G5-F15, G5-F16, G5-F18 (partial)
- **Note:** Structural pattern — addressing each overloaded term individually doesn't cure the pattern of introducing new named constructs faster than we prove their value. Editorial posture shift required.

### G5-M03

> Public readiness premature — framework good, artifact uneven

- **Severity:** High
- **Confidence:** Informed (reviewer's overall framing)
- **Dimension:** Public Readiness
- **Source:** Section 1 executive verdict
- **State:** open
- **Note:** Strategic signal, not a single fix. Resolution comes from hitting dimension targets across the scorecard — not from any single action.

---

## Trajectory tracking

Baseline established 2026-04-23. Re-score on next external or internal review.

| Review date | Reviewer | Clarity | Coherence | Defensibility | Differentiation | Actionability | Credibility | Public Readiness | Mechanical | Avg |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-23 | GPT-5.4 | 5 | 6 | 5 | 6 | 4 | 5 | 5 | — | 5.1 |

Target progression TBD on triage.
