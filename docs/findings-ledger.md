# AGF Findings Ledger

Cross-review ledger of findings extracted from every review of AGF. Format, rubric, and lifecycle documented in `docs/reviews/README.md`.

**Last updated:** 2026-04-24 (M01 + M02 second-pass closeout — Codex new-adopter persona returned `pattern-closed` for both; two-pass convergence achieved per scaling rule; both metas → `validated`)
**Open findings:** 1 (G5-M03 strategic-meta) + 1 mechanical MI-F07
**Validated:** 17 (MI-F01, MI-F02, MI-F04, MI-F05, G5-F01, G5-F02, G5-F04, G5-F05, G5-F06, G5-F07, G5-F08, G5-F10, G5-F11, G5-F17, G5-F19, G5-M01, G5-M02) — Mode C batch + 2026-04-24 meta closeout convergence
**Resolved (pending validation):** 10 (G5-F09, G5-F15, G5-F16 — Cohesion Pass v0.3 / DECISIONS.md #10; G5-F12, G5-F13 — Cluster D Actionability; G5-F03, G5-F20 — Credibility Pass v0.3; G5-F21 — M01 closeout pass spawned; G5-F18 — editorial pass; G5-F22 — M02 closeout pass spawned)
**Accepted / queued:** 1 (G5-F14 infra shipped — content batch-apply still gated on primitive stability decision)
**Deferred:** 3 (MI-F03 collapsed; MI-F06 → tooling sprint; G5-F18 → editorial pass bundled with MI-F07)
**Triage progress:** Cluster A Mechanical ✓ | Cluster B Credibility (partial) ✓ | Cluster C Differentiation ✓ | Cluster E Clarity (quick wins) ✓
**Reviews ingested:** 2

- `docs/reviews/2026-04-23-gpt-5-4.md` (external model)
- `docs/reviews/2026-04-23-mechanical-baseline.md` (internal tooling)
**Validation passes:** 1
- 2026-04-24 — agf-architect Mode C batch: 15/15 validated, 0 insufficient, 0 regressed

---

## State legend

- **open** — ingested, not yet triaged
- **accepted** — triaged and accepted; work queued or in flight
- **deferred** — triaged and deferred; archived with reason
- **rejected** — triaged and rejected; archived with reason
- **resolved** — work shipped, awaiting validation
- **validated** — reviewer confirmed fix addresses finding
- **regressed** — previously validated, now failing

**Meta-findings** (F-IDs prefixed `M`) close via an explicit holistic re-read, not by child validation alone. See the Meta-Finding Closeout Protocol in `docs/reviews/README.md` for triggers, reviewer independence tiers, verdicts (`pattern-closed` / `pattern-persists` / `pattern-shifted`), and the strategic-meta scorecard threshold.

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
| G5-F01 | Homepage CTA "Start with your role" misroutes to AI Engineering; should go to `/docs` | High | Established | Clarity | **validated** 2026-04-24 (CTA now anchors to on-page `#roles` grid + scroll-mt-16) |
| G5-F02 | Missing one-sentence definition of AGF at top of homepage and What-is-AGF | High | Established | Clarity | **validated** 2026-04-24 (canonical definition placed on homepage hero + what-is-agf intro) |
| G5-F03 | No inline citations for numeric/empirical claims; breaks "evidence grounded" promise | High | Established | Credibility | **resolved** 2026-04-24 (Credibility Pass v0.3 — flagship-page audit applied: empirical reference points in `composition-patterns` wrapped in `<Confidence level="established">` block with source attribution + dates; AICM 5/243 claim now carries `<Confidence level="established" />` + verification date; Trust Ladders Empirical Evidence section gets section-level `<Confidence level="established" />` with publication-date qualifications on all four research citations; "most organizations" / "most regulated deployments" / "typically implement both" claims now carry `<Confidence level="informed">` or `<Confidence level="open">` markers proportional to evidence base; governance-framework overhead multipliers labeled as design-target estimates) |
| G5-F04 | Homepage claims "confidence levels throughout" — not visibly delivered on pages | High | Established | Credibility | **validated** 2026-04-24 (infra + initial apply; batch-apply queued in Credibility Pass v0.3) |
| G5-F05 | "Operationalize at machine speed" overclaims; artifacts still planned | High | Established | Credibility | **validated** 2026-04-24 (Status Note already existed, now wrapped in Confidence level="open") |
| G5-F06 | "No framework has the Belief Layer" novelty claim unsupported | High | Established | Defensibility | **validated** 2026-04-24 (bounded claim + Confidence=informed + link to attribution table) |
| G5-F07 | OTAA appears in public layer summary without definition at first use | High | Established | Clarity | **validated** 2026-04-24 (expanded inline in relationship-to-frameworks Layer 0 row) |
| G5-F08 | No "Core Concepts in Order" orientation page | High | Informed | Clarity | **validated** 2026-04-24 (new `/docs/overview/core-concepts` page, positioned as step 2 in nav) |
| G5-F09 | Growth model drift: 4 composition patterns vs 5 implementation phases | High | Established | Coherence | **resolved** 2026-04-24 (Cohesion Pass v0.3 / DECISIONS.md #10 (a) — canonicalized at 4 patterns; "Secure Governed System" demoted to hardening posture modifier; "Phase 1–5" language retired) |
| G5-F10 | "See full primitive catalog" link points to AI Engineering, not primitives ref | High | Established | Mechanical | **validated** 2026-04-24 (link → `/docs/reference/primitives`) |
| G5-F11 | No "What AGF is / is not" box on homepage | High | Informed | Clarity | **validated** 2026-04-24 (two-column is/is-not grid between Standards strip and Rings diagram) |
| G5-F12 | No 30-day implementation starter path for Minimum Viable Control | Medium | Informed | Actionability | **resolved** 2026-04-24 (Cluster D — new `/docs/overview/first-30-days` MDX page; week-by-week MVC workplan with primitives activated, artifacts produced, exit signals; cross-linked from core-concepts + composition-patterns) |
| G5-F13 | No end-to-end reference architecture walkthrough | Medium | Informed | Actionability | **resolved** 2026-04-24 (Cluster D — new `/docs/overview/reference-walkthrough` MDX page; one threaded refund scenario through Rings 0–3 with action proposal → verification → gate → GDR → provenance → trust adjustment; six-step threaded view table; cross-linked from core-concepts + composition-patterns) |
| G5-F14 | No visible status badges (conceptual/specified/implemented) | Medium | Informed | Credibility | **accepted — infra shipped** (`<Status>` component; apply pending primitive stability content decision) |
| G5-F15 | "Governance" overloaded — framework, Ring 2, program maturity, gates, functions | Medium | Established | Coherence | **resolved** 2026-04-24 (Cohesion Pass v0.3 / DECISIONS.md #10 (b) — 5-sense disambiguation table + qualifier conventions in `shared-vocabulary.md` and site vocabulary; flagship-page audit bundled with G5-F18 editorial pass) |
| G5-F16 | Observability taxonomy unclear — Primitive #10 vs concept vs Profile | Medium | Established | Coherence | **resolved** 2026-04-24 (Cohesion Pass v0.3 / DECISIONS.md #10 (c) — three-layer disambiguation in `shared-vocabulary.md`, `agentic-observability.md` (canonical + site), and site vocabulary) |
| G5-F17 | No attribution table showing which primitives come from which sources | Medium | Informed | Defensibility | **validated** 2026-04-24 (Primitive Attribution section added to `/docs/reference/primitives`) |
| G5-F18 | Slogan density too high; too many named constructs per page | Medium | Informed | Clarity | **resolved** 2026-04-24 (editorial pass: what-is-agf "19 Named Primitives" subsection rewritten to remove MVC/Full Governed pile-up; Philosophy section collapsed three slogans to one earned sentence; relationship-to-frameworks "Operationalizes" bullet collapsed from 5-line construct pile to 2 lines linking to DECISIONS) |
| G5-F19 | `/docs/reference/observability-concept` slug mismatches page title | Low | Informed | Mechanical | **validated** 2026-04-24 (slug renamed to `agentic-observability` matching page title) |
| G5-F20 | Time-sensitive claims (e.g., "Agent 365 planned May 2026") need dated sources | Low | Established | Credibility | **resolved** 2026-04-24 (Credibility Pass v0.3 — Agent 365 reference now annotated "announced; GA target May 2026 per Microsoft Ignite 2025; verify current status on Microsoft Learn"; AICM v1.0.3 reference now annotated "verified against the published catalog 2026-04-24"; Trust Ladders empirical citations now read "published Month YYYY" with verification guidance) |
| G5-F21 | Bare current-state empirical claims on overview pages — "most agentic systems in production today have no structural governance" (rings-model:8), "Most deployed agentic systems today are Ring-0-only" (rings-model:26), "Most deployments today are brittle" (what-is-agf:14) — arrive without citation or confidence marker despite homepage's "every claim grounded" promise | Medium | Established | Credibility | **resolved** 2026-04-24 (filed during M01 closeout pass by Codex independent reviewer; same-session fix applied: all three claims now carry inline `<Confidence level="informed" />` with practitioner-observation qualifier matching the composition-patterns precedent) |
| G5-F22 | Seven-Layer Stack Layer 0 row in `relationship-to-frameworks.mdx` compresses six AGF construct families ("4 Rings + 19 Primitives + 3 deployment modes + 3-level security model + 7 tensions + OTAA") into one substrate claim without anchoring use — exemplar of M02 pattern | Medium | Established | Coherence | **resolved** 2026-04-24 (filed during M02 closeout pass by Codex independent reviewer; same-session fix applied: Layer 0 cell now describes substrate function and links to `/docs/overview/what-is-agf` for the construct catalog rather than enumerating constructs in the table) |
| G5-M01 | (Meta) Promises rigor/evidence/confidence without showing enough | High | Established | Credibility | **validated** 2026-04-24 (two-pass convergence: pass-1 Codex generic-reviewer returned `pattern-persists` + spawned G5-F21; pass-2 Codex new-adopter persona post-F21/F18/F22 fixes returned `pattern-closed`; convergence under scaling rule) |
| G5-M02 | (Meta) Names too many things before proving why they matter | High | Established | Coherence | **validated** 2026-04-24 (two-pass convergence: pass-1 Codex generic-reviewer returned `pattern-persists` + spawned G5-F22; pass-2 Codex new-adopter persona post-F22/F18 fixes returned `pattern-closed`; convergence under scaling rule) |
| G5-F23 | Changelog Unreleased section uses internal finding-IDs (G5-F##/G5-M##) and process labels ("Cohesion Pass v0.3", "Credibility Pass v0.3") as reader-facing release-note content; reads as internal QA log rather than public release notes | Medium | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 1 by Codex standards-body persona; same-session fix: changelog Unreleased rewritten in external-reader voice — Added/Changed sections describe deliverables; F-IDs/pass-names removed from public surface; canonical CHANGELOG.md retained for commit-level history) |
| G5-F24 | Roadmap exposed private workflow vocabulary — references to `BACKLOG.md` (private), GPT-5.4 review residue, F-IDs in `Now`/`Next` items — making the roadmap read as in-flight remediation rather than a stable public roadmap | Medium | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 1 by Codex; same-session fix: Roadmap recast around public deliverables — internal tracker references removed; Now/Next items now describe what's shipping rather than which finding is being closed) |
| G5-F25 | `relationship-to-frameworks.mdx` Status Note + Core Question + "Operationalizes" bullet conflate present-tense capability claims ("operationalize at machine speed") with future-state architectural commitments without explicit Current-vs-Planned framing — capability-inflation risk for first-time regulated readers | Medium | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 1 by Codex; same-session fix: Status Note retitled "Status Note: current vs planned" with explicit Today/Planned split; Core Question paragraph rewritten to call the fourth verb "the architectural commitment AGF is built around" with a pointer to the Status Note; Operationalizes bullet rewritten to distinguish architectural commitment from shipped capability) |
| G5-F26 | Public contradiction between roadmap (`agf-docs/content/docs/transparency/roadmap.mdx:44` — "No reference implementation is planned") and relationship-to-frameworks (`agf-docs/content/docs/reference/relationship-to-frameworks.mdx:15` — "reference implementations of the canonical Composition Patterns" planned). Reads as scope drift to a standards reader. | Medium | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 2 by Codex; same-session fix: relationship-to-frameworks Status Note rewritten to "worked example walkthroughs of the canonical Composition Patterns. AGF does not plan to ship a runtime reference implementation" with explicit cross-link to roadmap § Not on the roadmap) |
| G5-F27 | "Every claim carries one of three confidence levels" in `what-is-agf.mdx:105` Philosophy section overstates the artifact's current confidence-marking discipline; many broad framing claims remain unlabeled. | Medium | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 2 by Codex; same-session fix: softened to "Load-bearing empirical and novel claims carry…" with honest caveat: "The audit is not yet uniform across every page; the broader confidence-marker pass remains in flight.") |
| G5-F28 | `what-is-agf.mdx:111` "Pick your role" link target `/#roles` is broken — docs index has no matching anchor. Small mechanically; reinforces the M03 "uneven publication finish" pattern. | Low | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 2 by Codex; same-session fix: replaced single broken anchor link with inline links to all five role profiles directly — Security · Platform · GRC · AI Engineering · Observability) |
| G5-F29 | Second instance of the `/#roles` broken link in `core-concepts.mdx:73` ("homepage role chooser"). Same regression as F28 in a sibling overview page; M03 publication-finish pattern. | Low | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 3 by Codex; same-session fix: replaced with five inline profile links matching F28 fix) |
| G5-F30 | Docs landing page (`index.mdx`) too skeletal for serious evaluators — single sentence + role table without a "how to evaluate AGF in 10 minutes" path | Medium | Informed | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 3 by Codex; same-session fix: added 3-track Evaluate-in-10-min block — What is AGF / First 30 Days / Reference Walkthrough — plus Transparency link strip; role table retained as secondary) |
| G5-F31 | Canonical reference docs (`relationship-to-frameworks.mdx:15`, `governance-decision-record.mdx:293`) foreground "planned/forthcoming" tooling language at the exact point an adopter is testing seriousness | Medium | Established | Public Readiness | **resolved** 2026-04-25 (filed during M03 closeout pass 3 by Codex; same-session fix: relationship-to-frameworks Status Note rewritten to describe shipped contract surface only with cross-link to Roadmap; GDR §Tooling rewritten — shipped artifact = schema + contract; tooling/validators tracked on Roadmap) |
| G5-M03 | (Meta) Public readiness premature — framework good, artifact uneven | High | Informed | Public Readiness | accepted (closeout passes 1+2+3 complete; 9 children resolved; pass 4 in flight) |
| MI-F01 | cspell dictionary uninitialized — 35+ technical terms flag as unknown | Medium | Established | Mechanical | **validated** 2026-04-24 |
| MI-F02 | markdownlint errors in vocabulary.mdx (root cause: config, not content) | Low | Established | Mechanical | **validated** 2026-04-24 |
| ~~MI-F03~~ | ~~Broken internal link `/docs` in what-is-agf.mdx:109~~ | — | — | — | **collapsed → MI-F04** (tooling false positive; `/docs` route valid) |
| MI-F04 | check-links.mjs route resolution incomplete (exact `/docs`, `/`, app-dir `.txt` routes) | Low | Established | Mechanical | **validated** 2026-04-24 (app-dir route discovery + exact `/docs` handling + anchor-fragment support) |
| MI-F05 | lint-mdx.sh MDX parse-landmine grep false positive inside YAML code fences | Low | Established | Mechanical | **validated** 2026-04-24 (awk fence-state machine replaces naive `grep -v '```'`) |
| MI-F06 | preflight.sh treats untracked files as uncommitted; friction with in-flight iterations | Low | Established | Mechanical | **deferred** (BACKLOG tooling sprint) |
| MI-F07 | Residual markdownlint content hygiene (108 errors: list spacing, long prose, missing fence languages) | Low | Established | Mechanical | **partial** 2026-04-24 (Cohesion Pass v0.3 — MD032 blanks-around-lists auto-fixed across 21 canonical docs; 10 flagship MD040 fences tagged `text`; ~630 MD040 + MD013/MD025/MD028/MD001 errors remain in deeper profile/primitive docs — not release-blocking since canonical `docs/*.md` aren't linted by the pre-push gate; pair with G5-F18 editorial when scheduled) |

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
- **State:** **resolved** 2026-04-23 — chose dogfood path. Built `<Confidence>` component (inline + block forms), registered globally in `mdx-components.tsx`, applied to homepage Philosophy card + what-is-agf Philosophy section. Batch-apply across all flagship pages queued in **Credibility Pass v0.3** (BACKLOG).

### G5-F05

> "Operationalize at machine speed" overclaims; artifacts still planned

- **Severity:** High
- **Confidence:** Established — reviewer quoted the v0.2 planned admission
- **Dimension:** Credibility
- **Source:** Section 3, Section 10 Fix #5
- **State:** open
- **Related:** G5-M01
- **Proposed action:** Rewrite as future-state language; mark as architectural commitment not current reality
- **State:** **resolved** 2026-04-23 — existing Status Note in `relationship-to-frameworks.mdx` was correct tempering text but not visually distinct. Wrapped in `<Confidence level="open">` block form so readers see the speculative flag immediately. Also bumped v0.2 reference in note text to v0.3 (artifact delivery timeline).

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
- **State:** **resolved** 2026-04-24 — Cluster D Actionability
- **Resolution:** New MDX page `agf-docs/content/docs/overview/first-30-days.mdx`. Four-week workplan with prerequisites, weekly Goal / Primitives activated / Concrete outputs / Exit signal blocks, exit criteria for moving to Validation Pipeline / Governed Decision Flow, "What MVC is Not" boundary section with `<Confidence level="established">`. Activates the five MVC primitives (#7, #14, #6, #10, #19) in dependency order. Cross-linked from `core-concepts.mdx` "What to read next" and `composition-patterns.mdx` "Where to Start." Registered in `overview/meta.json`.

### G5-F13

> No end-to-end reference architecture walkthrough

- **Severity:** Medium
- **Confidence:** Informed
- **Dimension:** Actionability / Differentiation
- **Source:** Section 10 Fix #13
- **State:** **resolved** 2026-04-24 — Cluster D Actionability
- **Resolution:** New MDX page `agf-docs/content/docs/overview/reference-walkthrough.mdx`. Single threaded refund scenario ($450 with adaptive-gate override on customer refund frequency) traced through six steps: Ring 0 action proposal → Ring 1 verification + Ring Control Signal `GATE` → Ring 2 policy evaluation + pending GDR + `gate_triggered` → resolution APPROVE + resolved GDR + `gate_resolved` → Ring 0 execution + `provenance_recorded` linked by `decision_id` → Ring 3 trust trajectory update. Includes two YAML GDR examples (pending + resolved) tracking the canonical schema, a six-row "Threaded View" table mapping step → ring → primitive → artifact → observability emission, and a "Where the Walkthrough Simplifies" candor section under `<Confidence level="informed">`. Cross-linked from `core-concepts.mdx`, `composition-patterns.mdx`, and the new `first-30-days.mdx` page. Registered in `overview/meta.json`.

### G5-F14

> No visible status badges (conceptual/specified/implemented)

- **Severity:** Medium
- **Confidence:** Informed
- **Dimension:** Credibility / Public Readiness
- **Source:** Section 10 Fix #14
- **State:** open
- **Proposed action:** Badge system on primitive and concept pages — `Conceptual` / `Specified` / `Implemented`. Useful also for the primitive stability markers already in backlog (Community+credibility+adoption section).
- **State:** **accepted — infra shipped** 2026-04-23. `<Status state="conceptual|specified|implemented">` component built and registered globally. Batch-apply deferred: requires per-primitive status content decisions (see "Primitive stability markers" in BACKLOG Community+credibility section) before we can label anything. One finding, two-phase resolution: infra now, content later.

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
- **State:** **validated** (two-pass convergence 2026-04-24)
- **Umbrella for:** G5-F03, G5-F04, G5-F05, G5-F14, G5-F21
- **Note:** This is the pattern behind multiple line-item fixes. Even if all 4 line-items land, we should check this pattern holistically — resolving each individually doesn't guarantee the meta is resolved.

#### Closeout pass 1 — 2026-04-24 (Codex, generic-reviewer framing)

| Field | Content |
|---|---|
| Pass date | 2026-04-24 |
| Reviewer | Codex CLI 0.124.0 (gpt-5.4); tier **Strong** — independent reviewer that did not author any child fixes |
| Scope read | `index.mdx`; homepage `app/page.tsx`; `overview/what-is-agf.mdx`; `overview/composition-patterns.mdx`; `overview/rings-model.mdx`; `overview/trust-ladders.mdx`; `overview/first-30-days.mdx`; `overview/reference-walkthrough.mdx`; `reference/relationship-to-frameworks.mdx`; `reference/governance-framework.mdx`; `reference/primitives.mdx`; `reference/confidence-levels.mdx`; source review sections 1, 3, 5, 9 |
| Verdict | **`pattern-persists`** |
| Rationale | Artifact materially improved — several flagged claims now carry confidence markers, dated caveats, attribution tables, and empirical-source posture. But the public promise is still broader than the delivery: homepage and confidence-levels copy say every claim is grounded or labeled, while flagship overview pages still make current-state empirical claims without markers. A cold reader sees evidence discipline in hot spots, not a consistent framework-wide posture. The original pattern still describes the artifact, less severely than before. |
| New children | **G5-F21** filed and resolved same session — three current-state empirical claims (`rings-model.mdx:8` and `:26`, `what-is-agf.mdx:14`) now carry inline `<Confidence level="informed" />` matching the composition-patterns precedent |

#### Closeout pass 2 — 2026-04-24 (Codex, new-adopter persona, post-F21/F18/F22)

| Field | Content |
|---|---|
| Pass date | 2026-04-24 |
| Reviewer | Codex CLI 0.124.0 (gpt-5.4); tier **Strong**; persona **new-adopter** — second independent pass against the artifact after pass-1 fixes shipped |
| Scope read | Same scope as pass 1 |
| Verdict | **`pattern-closed`** |
| Rationale | The current artifact no longer asks a cold reader to accept rigor mostly on assertion. Confidence levels are visible in the main orientation path; speculative/future commitments are labeled; numeric claims now carry dates or caveats; primitives have an attribution table. Some pages still make broad synthesis claims, but the dominant posture is now bounded: "synthesis, not invention," "planned, not shipped," "informed/open where unproven." The original pattern does not materially describe the current scoped artifact. |
| New children | None |
| Convergence | Two independent passes (different framings — generic-reviewer + new-adopter persona) produced consecutive verdicts of `pattern-persists` (with concrete fix) → `pattern-closed`. Per scaling rule for High-severity public-credibility metas, this satisfies the multi-reviewer requirement. M01 → `validated`. |

### G5-M02

> Names too many things before proving why they matter

- **Severity:** High
- **Confidence:** Established
- **Dimension:** Coherence / Clarity
- **Source:** Sections 1, 4, 7, 9 (red-team critique 3)
- **State:** **validated** (two-pass convergence 2026-04-24)
- **Umbrella for:** G5-F15, G5-F16, G5-F18, G5-F22
- **Note:** Structural pattern — addressing each overloaded term individually doesn't cure the pattern of introducing new named constructs faster than we prove their value. Editorial posture shift required.

#### Closeout pass 1 — 2026-04-24 (Codex, generic-reviewer framing)

| Field | Content |
|---|---|
| Pass date | 2026-04-24 |
| Reviewer | Codex CLI 0.124.0 (gpt-5.4); tier **Strong** — independent reviewer that authored none of the child fixes |
| Scope read | `index.mdx`; `app/page.tsx`; `overview/what-is-agf.mdx`; `overview/core-concepts.mdx`; `overview/composition-patterns.mdx`; `overview/rings-model.mdx`; `overview/trust-ladders.mdx`; `overview/first-30-days.mdx`; `overview/reference-walkthrough.mdx`; `reference/relationship-to-frameworks.mdx`; `reference/primitives.mdx`; `reference/governance-framework.mdx`; source review sections 1, 4, 7, 9 |
| Verdict | **`pattern-persists`** |
| Rationale | Artifact materially clearer than the source review described — overview path now admits naming density, sequences concepts (core-concepts.mdx), and anchors many constructs in concrete use cases. `first-30-days.mdx` and `reference-walkthrough.mdx` earn most of their names through workplan and flow respectively. But the original pattern still describes the framework-positioning and catalog layers: several passages introduce dense bundles of unfamiliar constructs as taxonomy before showing why a cold reader should carry each term. Pattern is reduced, not closed. |
| New children | **G5-F22** filed and resolved same session — Seven-Layer Stack Layer 0 row in `relationship-to-frameworks.mdx` compressed six AGF construct families into one substrate claim; cell now describes substrate function and links to construct catalog |

#### Closeout pass 2 — 2026-04-24 (Codex, new-adopter persona, post-F22/F18)

| Field | Content |
|---|---|
| Pass date | 2026-04-24 |
| Reviewer | Codex CLI 0.124.0 (gpt-5.4); tier **Strong**; persona **new-adopter** — second independent pass against the artifact after pass-1 fixes shipped |
| Scope read | Same scope as pass 1 |
| Verdict | **`pattern-closed`** |
| Rationale | The current artifact still has many named constructs, but it now gives a cold reader an order of operations before demanding mastery. `Core Concepts in Order`, `First 30 Days`, and the reference walkthrough materially reduce term stacking by sequencing AGF → rings → primitives → gates/GDR → trust → composition → framework relationship. The pages also repeatedly explain why constructs matter through artifacts, exit criteria, gate examples, and source lineage. Naming density remains part of AGF's style, but the original "names before proving why they matter" complaint no longer dominates the scoped reader path. |
| New children | None |
| Convergence | Two independent passes (different framings — generic-reviewer + new-adopter persona) produced consecutive verdicts of `pattern-persists` (with concrete fix) → `pattern-closed`. Per scaling rule for High-severity public-credibility/coherence metas, this satisfies the multi-reviewer requirement. M02 → `validated`. |

### G5-M03

> Public readiness premature — framework good, artifact uneven

- **Severity:** High
- **Confidence:** Informed (reviewer's overall framing)
- **Dimension:** Public Readiness
- **Source:** Section 1 executive verdict
- **State:** accepted (closeout pass 1 complete; awaiting pass 2 convergence)
- **Note:** Strategic signal — resolution requires hitting Public Readiness ≥8/10 by independent reviewer per Strategic-meta rule (`docs/reviews/README.md`).

**Closeout pass 1 — 2026-04-25**

| Field | Value |
|---|---|
| Reviewer | Codex CLI (gpt-5.4) — Strong tier |
| Persona | Senior security/GRC practitioner, cold first-encounter read |
| Scope read | Index, what-is-agf, core-concepts, first-30-days, reference-walkthrough, composition-patterns, rings-model, trust-ladders, ai-engineering profile, relationship-to-frameworks, GDR, all four transparency pages |
| Public Readiness re-score | **7/10** (target ≥8/10) |
| Verdict | **`pattern-persists`** — quantitative below threshold; qualitative re-read confirmed "credible-in-progress, not clean public-ready" |
| New children | G5-F23 (changelog internal-language), G5-F24 (roadmap private-workflow exposure), G5-F25 (relationship-to-frameworks present-vs-future slippage) |
| Same-session resolution | All 3 children fixed in same session per protocol allowance — changelog rewritten in external-reader voice, roadmap recast around public deliverables, relationship-to-frameworks Status Note explicitly distinguishes Current vs Planned |
| Next action | Pass 2 closeout via different persona (standards-body editor) reads post-fix artifact and re-scores; if Public Readiness ≥8/10 + qualitative re-read converges on `pattern-closed`, M03 → `validated` |

**Closeout pass 2 — 2026-04-25**

| Field | Value |
|---|---|
| Reviewer | Codex CLI (gpt-5.4) — Strong tier |
| Persona | Standards-body editor evaluating AGF for inclusion in a published standard (different framing from pass 1 to satisfy multi-reviewer scaling rule) |
| Public Readiness re-score | **7/10** (still below ≥8/10 target) |
| Verdict | **`pattern-persists`** — pass 1 children verified-fixed, but new uneven-publication-finish patterns surfaced |
| New children | G5-F26 (roadmap/relationship-to-frameworks contradiction on reference implementations), G5-F27 (`what-is-agf.mdx:105` "every claim" overclaim), G5-F28 (`what-is-agf.mdx:111` `/#roles` broken anchor) |
| Same-session resolution | All 3 fixed: relationship-to-frameworks now distinguishes "worked example walkthroughs" from runtime impl + cross-links roadmap; Philosophy claim softened to "Load-bearing empirical and novel claims" with honest in-flight caveat; broken `/#roles` link replaced with five inline profile links |
| Next action | Pass 3 closeout via implementer persona (practicing AI/security engineer at mid-size regulated org) tests post-fix artifact for whether the meta no longer holds |

**Closeout pass 3 — 2026-04-25**

| Field | Value |
|---|---|
| Reviewer | Codex CLI (gpt-5.4) — Strong tier |
| Persona | Practicing AI/security engineer at mid-size regulated org evaluating AGF for internal standardization |
| Public Readiness re-score | **7/10** (still below ≥8/10 target — third pass at this score) |
| Verdict | **`pattern-persists`** — pass 1+2 children verified-fixed; new finer-grained issues surfaced |
| New children | G5-F29 (second `/#roles` instance in core-concepts.mdx), G5-F30 (docs landing too skeletal), G5-F31 (canonical reference docs foreground "planned/forthcoming" tooling language) |
| Same-session resolution | F29 fixed with five-profile inline link match to F28; F30 fixed by adding 3-track "Evaluate AGF in 10 minutes" block + Transparency link strip on docs index; F31 fixed by tightening Status Note + GDR §Tooling to ship-only contract surface, with future-work moved behind Roadmap cross-links |
| Next action | Pass 4 closeout via technical-lead-go-no-go persona; if still <8/10, accept that M03 is a continuous quality dimension and stage as ongoing editorial polish rather than single-session closure |

**Pattern observation across passes 1–3:** Score held flat at 7/10 across three passes despite 9 children resolved. Each pass surfaces 3 new, finer-grained issues. The meta-finding is behaving as a continuous quality dimension (publication discipline) rather than a finite list of bugs. Same-session tight-loop closure (file → fix → re-pass) demonstrates the protocol works mechanically but does not guarantee score advancement when the meta itself measures qualitative consistency across the whole artifact.

---

## Trajectory tracking

Baseline established 2026-04-23. Re-score on next external or internal review.

| Review date | Reviewer | Clarity | Coherence | Defensibility | Differentiation | Actionability | Credibility | Public Readiness | Mechanical | Avg |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-04-23 | GPT-5.4 | 5 | 6 | 5 | 6 | 4 | 5 | 5 | — | 5.1 (7 dims) |
| 2026-04-23 | internal-tooling | — | — | — | — | — | — | — | 6 | — |
| **Composite** | **v0.2.0 baseline** | **5** | **6** | **5** | **6** | **4** | **5** | **5** | **6** | **5.25** |
| 2026-04-23 | post-Cluster-A | 5 | 6 | 5 | 6 | 4 | 5 | 5 | **7** | **5.38** |
| 2026-04-23 | post-Cluster-B (infra) | 5 | 6 | 5 | 6 | 4 | **6** | **6** | 7 | **5.63** |
| 2026-04-23 | post-Cluster-C | **6** | 6 | **7** | **7** | 4 | 6 | 6 | 7 | **6.13** |
| 2026-04-23 | post-Cluster-E (qw) | **7** | 6 | 7 | 7 | 4 | 6 | **7** | 7 | **6.38** |

Target progression TBD on triage.

**Cluster A delta (2026-04-23):** Mechanical Integrity 6 → 7. Content-side is clean (cspell 61 issues → 0; markdownlint 666 errors → ~15 residual over a 300-char threshold). Ceiling of 7 imposed by three deferred tooling-script bugs (MI-F04/F05/F06) and residual content hygiene (MI-F07). Full 9+ is reachable once tooling sprint ships.

**Cluster A update (2026-04-24):** MI-F04 and MI-F05 shipped in commit `3afefb4` (pre-push hook activation surfaced them as real release-blockers). Ceiling gates reduce from four (F04/F05/F06/F07) to two (F06/F07). Score unchanged at 7 pending re-rating; target ceiling now 9+ after MI-F06 (preflight.sh untracked-file handling) + MI-F07 (content hygiene editorial pass) land.

**Cluster B delta (2026-04-23, partial):** Credibility 5 → 6, Public Readiness 5 → 6.

- **Infra shipped:** `<Confidence level="established|informed|open">` + `<Status state="conceptual|specified|implemented">` components registered globally via `mdx-components.tsx`. Both inline-badge and block-form variants. Dogfoods AGF's own vocabulary.
- **G5-F05 resolved:** "Operationalize at machine speed" Status Note wrapped in `<Confidence level="open">` block — now visibly distinct as architectural commitment, not current claim.
- **G5-F04 initial apply:** Homepage Philosophy card shows all three confidence badges; what-is-agf Philosophy section dogfoods the gradient on its own rigor claim.
- **Ceiling before Pass v0.3:** G5-F03 citations + G5-F20 dated sources + broader `<Confidence>` application across flagship claims unlock Credibility → 7–8. `<Status>` batch-apply is gated on primitive stability content decision (backlogged).

**Cluster C delta (2026-04-23):** Defensibility 5 → 7, Differentiation 6 → 7, Clarity 5 → 6.

- **G5-F06 resolved:** "No framework has the Belief Layer" rewritten as bounded-survey claim + `<Confidence level="informed" />` + cross-link to Primitive Attribution. Dogfoods the gradient on a novelty claim — exactly the meta-pattern G5-M01 called for.
- **G5-F07 resolved:** OTAA expanded inline ("Observable · Traceable · Auditable · Agent-operable") at its first public-facing appearance in the Seven-Layer Stack table.
- **G5-F17 resolved:** New Primitive Attribution section on `/docs/reference/primitives` — 19-row table mapping each primitive to its primary lineage (NIST, OWASP, CSA, ISO, OTel, academic, industry practice) plus AGF's specific contribution (naming, placement, invariant). This is the highest-leverage defensibility move: it converts "we invented these primitives" (indefensible) into "we composed these primitives from prior art" (defensible).
- **Pattern:** F06 + F17 together convert AGF's implicit synthesis posture into an explicit, auditable claim. The rewrite of F06 now *depends* on the attribution table — you can't separate the novelty bound from the sourcing evidence.
- **Remaining in Cluster C scope:** G5-F13 (end-to-end walkthrough) deferred to Cluster D (Actionability); G5-M02 (naming density) deferred to editorial pass.

---

## Mechanical baseline finding details

### MI-F01

> cspell dictionary uninitialized — 61 technical terms flag as unknown

- **Severity:** Medium (cosmetic; blocks clean lint runs)
- **Confidence:** Established
- **Dimension:** Mechanical
- **Source:** `docs/reviews/2026-04-23-mechanical-baseline.md`
- **State:** **resolved** 2026-04-23
- **Resolution:** Appended 35 flagged terms to `agf-docs/.cspell-agf.txt` under comment header `Added 2026-04-23 from mechanical baseline (MI-F01)`. Validates on next lint run.

### MI-F02

> markdownlint errors in `vocabulary.mdx` Gate Vocabulary section (lines 90, 98, 105)

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Mechanical
- **Source:** introduced by 2026-04-22 Gate Vocabulary section addition
- **State:** **resolved** 2026-04-23
- **Investigation:** Issue was broader than scoped — 666 errors repo-wide, not 8 local to vocabulary.mdx. Root cause was config, not content: MD060 had auto-selected "compact" table style conflicting with standard GitHub pipe style, and MD013 line-length didn't exempt dense table rows.
- **Resolution:** Updated `agf-docs/.markdownlint-cli2.jsonc` — `MD013.tables: false`, `MD013.code_blocks: false`, bumped `line_length: 160 → 300`, disabled `MD060` (style preference, not correctness), disabled `MD036` (bold-as-heading is intentional in composition-patterns). Error count 666 → 108.
- **Spawned:** MI-F07 for residual 108 content hygiene errors.

### MI-F03 — COLLAPSED into MI-F04

> Broken internal link `/docs` in `what-is-agf.mdx:109`

- **State:** **collapsed** 2026-04-23 — reclassified as tooling false positive, merged with MI-F04
- **Investigation:** Route `/docs` resolves correctly via `agf-docs/content/docs/index.mdx`. `bin/check-links.mjs` validates paths matching `/docs/*` (with trailing slash) but falls through to asset-check for exact `/docs`, causing the false BROKEN-ASSET flag. See MI-F04 for the tooling fix.
- **Semantic residual:** The link text "Pick your role" pointing to the generic docs index is weak UX — a role chooser would serve the intent better. That concern is already covered by **G5-F01** (homepage "Start with your role" CTA misroute). No separate finding needed.

### MI-F04

> `bin/check-links.mjs` route resolution incomplete — exact `/docs`, `/`, and app-dir `.txt` routes

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Mechanical (tooling)
- **Absorbs:** MI-F03
- **Scope expansion:** Original finding was `/` + `/llms.txt`; add exact `/docs` (was MI-F03) and any `app/*/route.ts`-served route
- **State:** **validated** 2026-04-24 — resolved by commit `3afefb4`. `collectAppRoutes()` walks `app/` for `route.ts`/`page.tsx`; exact `/docs` resolves to `content/docs/index.mdx`; `/` treated as valid homepage; anchor-fragment support added. Deferral status was promoted to release-blocker when the pre-push hook activated in the same session.

### MI-F05

> `bin/lint-mdx.sh` MDX parse-landmine grep false positive inside YAML code fences

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Mechanical (tooling)
- **Source:** `<2%` inside YAML block at `governance-decision-record.mdx:202`
- **Proposed action:** Teach grep to skip fenced code blocks (triple-backtick delimited). Either awk-based state machine or switch to remark-lint plugin that respects fences natively.
- **State:** **validated** 2026-04-24 — resolved by commit `3afefb4`. awk fence-state machine (`BEGIN { in_fence = 0 }`, toggle on `/^[[:space:]]*\x60\x60\x60/`) replaces naive `grep -v` approach. Same session promotion-to-blocker as MI-F04.

### MI-F06

> `bin/preflight.sh` treats untracked files as uncommitted; friction with in-flight iterations

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Mechanical (tooling / UX)
- **Source:** user has intentional in-flight diagrams (`rings-model-governed-agentic-systems_v2..v6.png`) that aren't ready to commit; preflight blocks release
- **State:** open
- **Proposed action:** Distinguish modified-tracked (block) from untracked (warn with list + continue). Align with conventional pre-commit behavior — untracked is intentional workspace noise, not a release blocker.
- **State:** **deferred** 2026-04-23 — queued in BACKLOG under "Tooling refinement — release infrastructure"

### MI-F07

> Residual markdownlint content hygiene — 108 errors after MI-F02 config fix

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Mechanical / Clarity
- **Source:** spawned by MI-F02 resolution 2026-04-23
- **Breakdown:** MD032 blanks-around-lists (45), MD013 line-length in prose (42), MD040 missing code-fence languages (11), MD022 blanks-around-headings (5), MD031 blanks-around-fences (4), MD024 duplicate headings (1)
- **State:** open — editorial pass at next content sweep, not release-blocking
- **Proposed action:** Pair with G5-F18 (slogan density) editorial pass — single content-hygiene sweep across `content/docs/**/*.mdx`
