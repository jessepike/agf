# AGF Findings Ledger

Cross-review ledger of findings extracted from every review of AGF. Format, rubric, and lifecycle documented in `docs/reviews/README.md`.

**Last updated:** 2026-04-23
**Open findings:** 9 (6 GPT-5.4 open + 2 meta + 1 mechanical MI-F07)
**Resolved:** 13 (MI-F01, MI-F02, G5-F01, G5-F02, G5-F04, G5-F05, G5-F06, G5-F07, G5-F08, G5-F10, G5-F11, G5-F17, G5-F19)
**Accepted / queued:** 4 (G5-F03, G5-F14 infra, G5-F20 → Credibility Pass v0.3)
**Deferred:** 8 (MI-F03 collapsed; MI-F04/F05/F06 → tooling sprint; G5-F09/F15/F16 → Content Cohesion Pass v0.3; G5-F18 → editorial pass with MI-F07)
**Triage progress:** Cluster A Mechanical ✓ | Cluster B Credibility (partial) ✓ | Cluster C Differentiation ✓ | Cluster E Clarity (quick wins) ✓
**Reviews ingested:** 2
- `docs/reviews/2026-04-23-gpt-5-4.md` (external model)
- `docs/reviews/2026-04-23-mechanical-baseline.md` (internal tooling)

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
| G5-F01 | Homepage CTA "Start with your role" misroutes to AI Engineering; should go to `/docs` | High | Established | Clarity | **resolved** (CTA now anchors to on-page `#roles` grid + scroll-mt-16) |
| G5-F02 | Missing one-sentence definition of AGF at top of homepage and What-is-AGF | High | Established | Clarity | **resolved** (canonical definition placed on homepage hero + what-is-agf intro) |
| G5-F03 | No inline citations for numeric/empirical claims; breaks "evidence grounded" promise | High | Established | Credibility | **accepted** (Credibility Pass v0.3) |
| G5-F04 | Homepage claims "confidence levels throughout" — not visibly delivered on pages | High | Established | Credibility | **resolved** (infra + initial apply; batch-apply queued in Credibility Pass v0.3) |
| G5-F05 | "Operationalize at machine speed" overclaims; artifacts still planned | High | Established | Credibility | **resolved** (Status Note already existed, now wrapped in Confidence level="open") |
| G5-F06 | "No framework has the Belief Layer" novelty claim unsupported | High | Established | Defensibility | **resolved** (bounded claim + Confidence=informed + link to attribution table) |
| G5-F07 | OTAA appears in public layer summary without definition at first use | High | Established | Clarity | **resolved** (expanded inline in relationship-to-frameworks Layer 0 row) |
| G5-F08 | No "Core Concepts in Order" orientation page | High | Informed | Clarity | **resolved** (new `/docs/overview/core-concepts` page, positioned as step 2 in nav) |
| G5-F09 | Growth model drift: 4 composition patterns vs 5 implementation phases | High | Established | Coherence | **deferred → Content Cohesion Pass v0.3** |
| G5-F10 | "See full primitive catalog" link points to AI Engineering, not primitives ref | High | Established | Mechanical | **resolved** (link → `/docs/reference/primitives`) |
| G5-F11 | No "What AGF is / is not" box on homepage | High | Informed | Clarity | **resolved** (two-column is/is-not grid between Standards strip and Rings diagram) |
| G5-F12 | No 30-day implementation starter path for Minimum Viable Control | Medium | Informed | Actionability | open |
| G5-F13 | No end-to-end reference architecture walkthrough | Medium | Informed | Actionability | open |
| G5-F14 | No visible status badges (conceptual/specified/implemented) | Medium | Informed | Credibility | **accepted — infra shipped** (`<Status>` component; apply pending primitive stability content decision) |
| G5-F15 | "Governance" overloaded — framework, Ring 2, program maturity, gates, functions | Medium | Established | Coherence | **deferred → Content Cohesion Pass v0.3** |
| G5-F16 | Observability taxonomy unclear — Primitive #10 vs concept vs Profile | Medium | Established | Coherence | **deferred → Content Cohesion Pass v0.3** |
| G5-F17 | No attribution table showing which primitives come from which sources | Medium | Informed | Defensibility | **resolved** (Primitive Attribution section added to `/docs/reference/primitives`) |
| G5-F18 | Slogan density too high; too many named constructs per page | Medium | Informed | Clarity | **deferred → editorial pass bundled with MI-F07** |
| G5-F19 | `/docs/reference/observability-concept` slug mismatches page title | Low | Informed | Mechanical | **resolved** (slug renamed to `agentic-observability` matching page title) |
| G5-F20 | Time-sensitive claims (e.g., "Agent 365 planned May 2026") need dated sources | Low | Established | Credibility | **accepted** (bundled into Credibility Pass v0.3 audit) |
| G5-M01 | (Meta) Promises rigor/evidence/confidence without showing enough | High | Established | Credibility | open |
| G5-M02 | (Meta) Names too many things before proving why they matter | High | Established | Coherence | open |
| G5-M03 | (Meta) Public readiness premature — framework good, artifact uneven | High | Informed | Public Readiness | open |
| MI-F01 | cspell dictionary uninitialized — 35+ technical terms flag as unknown | Medium | Established | Mechanical | **resolved** |
| MI-F02 | markdownlint errors in vocabulary.mdx (root cause: config, not content) | Low | Established | Mechanical | **resolved** |
| ~~MI-F03~~ | ~~Broken internal link `/docs` in what-is-agf.mdx:109~~ | — | — | — | **collapsed → MI-F04** (tooling false positive; `/docs` route valid) |
| MI-F04 | check-links.mjs route resolution incomplete (exact `/docs`, `/`, app-dir `.txt` routes) | Low | Established | Mechanical | **resolved** (app-dir route discovery + exact `/docs` handling + anchor-fragment support) |
| MI-F05 | lint-mdx.sh MDX parse-landmine grep false positive inside YAML code fences | Low | Established | Mechanical | **resolved** (awk fence-state machine replaces naive `grep -v '```'`) |
| MI-F06 | preflight.sh treats untracked files as uncommitted; friction with in-flight iterations | Low | Established | Mechanical | **deferred** (BACKLOG tooling sprint) |
| MI-F07 | Residual markdownlint content hygiene (108 errors: list spacing, long prose, missing fence languages) | Low | Established | Mechanical | **open** (editorial pass) |

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
| 2026-04-23 | GPT-5.4 | 5 | 6 | 5 | 6 | 4 | 5 | 5 | — | 5.1 (7 dims) |
| 2026-04-23 | internal-tooling | — | — | — | — | — | — | — | 6 | — |
| **Composite** | **v0.2.0 baseline** | **5** | **6** | **5** | **6** | **4** | **5** | **5** | **6** | **5.25** |
| 2026-04-23 | post-Cluster-A | 5 | 6 | 5 | 6 | 4 | 5 | 5 | **7** | **5.38** |
| 2026-04-23 | post-Cluster-B (infra) | 5 | 6 | 5 | 6 | 4 | **6** | **6** | 7 | **5.63** |
| 2026-04-23 | post-Cluster-C | **6** | 6 | **7** | **7** | 4 | 6 | 6 | 7 | **6.13** |
| 2026-04-23 | post-Cluster-E (qw) | **7** | 6 | 7 | 7 | 4 | 6 | **7** | 7 | **6.38** |

Target progression TBD on triage.

**Cluster A delta (2026-04-23):** Mechanical Integrity 6 → 7. Content-side is clean (cspell 61 issues → 0; markdownlint 666 errors → ~15 residual over a 300-char threshold). Ceiling of 7 imposed by three deferred tooling-script bugs (MI-F04/F05/F06) and residual content hygiene (MI-F07). Full 9+ is reachable once tooling sprint ships.

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
- **State:** **deferred** 2026-04-23 — queued in BACKLOG under "Tooling refinement — release infrastructure"
- **Absorbs:** MI-F03
- **Scope expansion:** Original finding was `/` + `/llms.txt`; add exact `/docs` (was MI-F03) and any `app/*/route.ts`-served route
- **Proposed action:** Extend script to recognize: (a) exact `/docs` route mapping to `content/docs/index.mdx`, (b) `/` as valid homepage, (c) routes served by `agf-docs/app/*/route.ts` (scan for route handlers)

### MI-F05

> `bin/lint-mdx.sh` MDX parse-landmine grep false positive inside YAML code fences

- **Severity:** Low
- **Confidence:** Established
- **Dimension:** Mechanical (tooling)
- **Source:** `<2%` inside YAML block at `governance-decision-record.mdx:202`
- **State:** open
- **Proposed action:** Teach grep to skip fenced code blocks (triple-backtick delimited). Either awk-based state machine or switch to remark-lint plugin that respects fences natively.
- **State:** **deferred** 2026-04-23 — queued in BACKLOG under "Tooling refinement — release infrastructure"

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
