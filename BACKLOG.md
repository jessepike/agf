# Backlog — AGF

Prioritized work queue. P0 = blocking. P1 = high value. Active = in progress. Backlogged = tracked but not scheduled.

---

## P0 — Blocking

_(none — all P0 items resolved)_

### ~~LICENSE decision (BLOCKER before external contributors)~~ — RESOLVED 2026-04-23
- Resolution: **CC BY 4.0 retained** for docs; Apache-2.0/MIT for any reference implementations / tooling. Recorded as DECISIONS.md #11 (entry added 2026-04-24 retroactively after operational confirmation 2026-04-23).
- `LICENSE` file is correct as-is. `LICENSE-TODO.md` can be archived (consider moving to `.private/archive/` or deleting).

## P1 — High Priority

### ~~Cluster D — Actionability (G5-F12 + F13)~~ — SHIPPED 2026-04-24

Resolved via two new MDX pages in `agf-docs/content/docs/overview/`:

- **`first-30-days.mdx`** — week-by-week MVC starter workplan, prerequisites + four week sections + exit criteria. Closes G5-F12.
- **`reference-walkthrough.mdx`** — single threaded refund scenario across Rings 0–3 with two GDR YAML examples and a primitive/artifact/event mapping table. Closes G5-F13.
- Both registered in `overview/meta.json` (positions 6–7), cross-linked from `core-concepts.mdx` and `composition-patterns.mdx`. Site builds clean; lint + link-check + cspell pass.
- **Scorecard projection:** Actionability 4 → 7+ pending re-rating (the only remaining stuck dimension; unblocks Differentiation + Public Readiness ceilings).

### ~~Credibility Pass v0.3~~ — SHIPPED 2026-04-24 (G5-F03 + G5-F20 resolved)

Closed via flagship-page audit + Confidence-marker application. G5-F14 batch-apply remains gated on primitive-stability content decision (separate item below).

- **G5-F03 — empirical claim citations:** `composition-patterns` empirical block now wrapped in `<Confidence level="established">` with source attribution + verification date; `relationship-to-frameworks` AICM 5/243 claim now `<Confidence level="established" />` + dated; `trust-ladders` Empirical Evidence section now carries section-level `<Confidence level="established" />` with all four citations carrying publication-date qualifications; `governance-framework` overhead multipliers labeled as design-target estimates with reference points cited; "most organizations" and "typically" claims across rings/composition/relationship now carry proportional `<Confidence level="informed">` or `<Confidence level="open">` markers.
- **G5-F20 — time-sensitive claims:** Agent 365 reference annotated "announced; GA target May 2026 per Microsoft Ignite 2025; verify current status on Microsoft Learn"; AICM v1.0.3 reference annotated with verification date; Trust Ladders empirical citations rewritten to "published Month YYYY" with verification guidance.
- **G5-M01 + G5-M02 → `validated` 2026-04-24** via two-pass convergence (Codex generic-reviewer first pass → `pattern-persists` with concrete child fix; Codex new-adopter persona second pass post-fixes → `pattern-closed`). Multi-reviewer scaling rule satisfied. Children spawned + resolved during the closeout passes: G5-F21 (bare empirical claims on rings-model + what-is-agf — fixed with `<Confidence level="informed" />` markers), G5-F22 (Seven-Layer Stack Layer 0 cell construct pile-up — replaced with substrate-function description + link to construct catalog).

### ~~Content Cohesion Pass v0.3~~ — SHIPPED 2026-04-24 (partial — G5-F18 remains)

Shipped via DECISIONS.md #10 across commits `eaef524`, `23588d9`, `b1366cd`. See `status.md` 2026-04-24 evening handoff for full detail.

- ~~**G5-F09 — Growth model drift**~~ **RESOLVED** — 4 composition patterns canonicalized (MVC / Validation Pipeline / GDF / Full Governed). "Secure Governed System" demoted to hardening-posture modifier. "Phase 1–5" language retired. (`eaef524`)
- ~~**G5-F15 — "Governance" overloaded**~~ **RESOLVED (canon + composition-patterns page)** — Five-sense disambiguation table in `shared-vocabulary.md`; qualifier conventions adopted; composition-patterns page audited for Ring 2 senses. Full audit across remaining 13+ public MDX pages queued into Tier 2 editorial. (`eaef524` + `23588d9`)
- ~~**G5-F16 — Observability taxonomy**~~ **RESOLVED** — Three-layer disambiguation (Primitive #10 emits / Agentic Observability correlates / Profile implements); "Where This Fits" frame block at top of both canonical and site concept docs. (`eaef524`)
- **G5-F18 — Slogan density** — STILL OPEN. Tier 2 editorial pass, pair with MI-F07 residual. See `status.md` Tier 2.
- **MI-F07** — PARTIAL. MD032 bulk auto-fix across 21 canonical docs + 10 flagship MD040 tags shipped (`b1366cd`). Deeper MD040 + MD022/031/024 residual non-blocking.
- **G5-M02 closeout** — gated on F18 completion per Meta-Finding Closeout Protocol.

### ~~Tier 2 Transparency section~~ — SHIPPED 2026-04-25 (commit `aca778c`)

Four new MDX routes under `/docs/transparency/`: changelog, decisions, roadmap, contribute. Site grows 29 → 33 routes. Closes the deferred "Site pages — /changelog + /decisions" item below and extends with /roadmap + /contribute beyond.

### ~~AI Engineering profile rewrite — Phase 1–5 retired~~ — SHIPPED 2026-04-25 (commit `1166b3e`)

Both canonical and site MDX restructured to four canonical Composition Patterns + hardening posture per D10(a). "Secure Governed System" demoted to posture modifier. Application Examples and Implementation Checklists rebuilt around pattern names. Pairs with Cluster D Actionability content shipped 2026-04-24. Diagram regen still queued.

### Site update execution (NEW 2026-04-22)
- Execute changelist at `.private/drafts/site-update-changelist.md` covering v1.0 positioning batch + GDR primitive + macro diagrams + 3 broken-link fixes + homepage card
- Coordinate with Jesse's parallel diagram work before deploy

### ~~Cross-doc integration passes for GDR~~ — SHIPPED 2026-04-25 (commit `a095608` site MDX sync; canonical `157b466`)

`grc.mdx` Evidence table references GDR for #8 / #10 / #11 rows; `observability.mdx` event taxonomy now has `gate_triggered`/`gate_resolved`/`approval_*` carrying `decision_id`. Mirrors canonical `docs/profiles/{grc,observability}-profile.md` integration done in earlier commit. Closes "competing artifact" coherence risk surfaced in external review.

### ~~Composability Interface + Primitive #11 dual-form audit~~ — SHIPPED 2026-04-25 (commit `7245094`)

D17 follow-on closeout. Per-signal dual-form table added to canonical `docs/agentic-primitives.md` Composability Interface section — specifies observability-event vs GDR emission profile for PASS / REVISE-quality / REVISE-context / HALT / GATE / DELEGATE / ERROR / Domain Outcome. Primitive #11 trust transitions now have explicit GDR field requirements (decision/subject/inputs/rationale/authorization/audit) with cross-reference to `trust_level_changed` event carrying `decision_id`. Implementation/clarification commit; refines but does not change D5/D16/D17.

### G5-M03 strategic-meta closeout (4 passes, 11 children, accepted as continuous quality dimension) — 2026-04-25

Four Codex closeout passes with diversified personas (security/GRC, standards-body, practicing-engineer, technical-lead). All 4 returned 7/10 / `pattern-persists`. 11 children spawned across passes 1–4; 9 resolved same-session (F23–F31), 2 deferred to Roadmap as structural items (F32 transition-state catch-22, F33 adoption-proof gap). Codex itself acknowledged M03 is a continuous quality dimension that no single session can close. M03 will close when Roadmap "public-readiness pass" ships AND first adopter case study lands. See `docs/findings-ledger.md` for full pass-by-pass detail blocks.

### Primitive #8 timeout-behavior prose cleanup (NEW 2026-04-22)
- Canonical `docs/agentic-primitives.md` Primitive #8 prose says "default action — which may be HALT or ESCALATE" — conflates Ring Control Signal (HALT) with Gate Resolution (ESCALATE)
- Surfaced by Codex round 2 review while drafting GDR primitive
- Fix: revise to describe the three valid default actions (ESCALATE, REJECT, HALT) per the Default Action on Timeout table now in `docs/governance-decision-record.md`
- Pairs naturally with GDR promotion but kept separate to keep that commit atomic

### Gate-boundary dual-form audit — remaining work (PARTIAL — superseded by D17)
- ~~Audit Primitive #8 (Governance Gates) for gate-boundary dual-form emission~~ **Done in commit `288ddee` — Primitive #8 now requires GDR emission at every gate resolution**
- ~~Specify JSON/YAML schema for gate decision artifact~~ **Done in commit `288ddee` — `docs/schemas/gdr.yaml`**
- ~~Audit Composability Interface (PASS/REVISE/HALT/GATE/DELEGATE/ERROR signals) for dual-form emission per signal type~~ — **DONE 2026-04-25 commit `7245094`** — per-signal table added with observability-event vs GDR emission profile.
- ~~Audit Primitive #11 (Trust Ladders) — trust promotions/demotions are Domain Outcomes that emit GDRs (per D17)~~ — **DONE 2026-04-25 commit `7245094`** — explicit Dual-form emission at trust transitions subsection added.
- MDX summary already covers principle and links to canonical for per-signal detail; no MDX sync needed.

## Active

_(nothing actively in flight — session paused at checkpoint 2026-04-17)_

## Backlogged

### Profile-page phases → patterns alignment (NEW 2026-04-24)

DECISIONS.md #10 (a) retired the "Phase 1–5" vocabulary in favor of 4 composition patterns + hardening posture. Propagated to `overview/composition-patterns.mdx` + `overview/rings-model.mdx` in commit `eaef524`. Still outstanding: `profiles/ai-engineering.mdx` "Implementation Priority" section uses "Phase 1–5" H3 headings + `implementation-phases-roadmap.png` (superseded per DIAGRAM-SPECS entry 2). Do a single rewrite pass when the AI Engineering profile gets its next edit — pair with Cluster D Actionability content work. Regeneration of the diagram (4-pattern progression) is a candidate for the next diagram batch.

### Site pages — deferred from release-infrastructure session (2026-04-23)

- **`/changelog` page on site** — expose `CHANGELOG.md` as an MDX route under `/docs/changelog` or `/changelog`. Route + MDX needed; content is the canonical `CHANGELOG.md`.
- **`/decisions` page on site** — promote `DECISIONS.md` to MDX route. Enables linking to individual decision entries from doc pages.
- **`/roadmap` page on site** — lightweight roadmap page. Content can be extracted from backlog + next-steps in `status.md`.
- **`/contribute` page on site** — contributor guide surface. Expose `CONTRIBUTING.md` as a docs route with onboarding guidance.

### Crosswalk files (`docs/crosswalks/`) — P1 when prioritized

Starter structure deferred from release-infrastructure session. Recommended P1 set:
- `docs/crosswalks/nist-ai-rmf.md` — NIST AI RMF ↔ AGF primitives mapping
- `docs/crosswalks/owasp-agentic.md` — OWASP Agentic Security ↔ AGF controls mapping
- `docs/crosswalks/aicm.md` — AICM 18 domains ↔ AGF primitives
- `docs/crosswalks/eu-ai-act.md` — EU AI Act obligations ↔ AGF primitives (Art. 12, Art. 14 already cited in GDR doc — good starting point)

Each crosswalk: table of standard controls/requirements → AGF primitive → confidence level → implementation guidance stub.

### ~~Rings-model canonical diagram selection~~ — RESOLVED 2026-04-24
- v6 selected as canonical, superseding v1. v2–v5 removed. v6 renamed to `rings-model-governed-agentic-systems.png` and synced to `agf-docs/public/diagrams/`. Generation prompt archived in `diagrams/DIAGRAM-SPECS.md` under "Rings Model — Canonical (2026-04-22)".

### Primitive upgrades (driven by 2026-04-17 extractions)
- Primitive #14 Identity & Attribution — 10-point upgrade spec in `.private/research/extractions-2026-04-17/ms-docs-and-csa-identity.md` §11
- Primitive #15 Resilience → rename "Agent SRE"; add SLOs, error budgets, chaos engineering (Microsoft AGT framing)
- OTAA invariant rollout across existing primitives — each primitive audited against Observable/Traceable/Auditable/Agent-operable; gaps flagged
- Machine-form schemas per primitive (dual-form principle implementation) — JSON/YAML with control mappings, MUST/SHOULD/MAY requirements, evidence schemas, test criteria

### Profile doc upgrades
- `docs/profiles/security-profile.md` — add Microsoft Failure Mode Taxonomy section (28 modes, 2×2, per-mode primitive mapping)
- `docs/profiles/security-profile.md` — add AICM control crosswalk table (18 domains × AGF primitive × security level)
- `docs/profiles/grc-profile.md` — AICM/ISO 42001/NIST AI RMF crosswalks
- New: `docs/profiles/assurance-profile.md` — stub for STAR for AI pathway, ISO 42001 alignment (currently AGF has no assurance posture)

### Publishable content (Campaign 03 candidates)
- **Agentic Compliance Blind Spots** — 10-gap analysis (MS failure modes with no clean AICM control match). Unique publishable assertion. Source: `.private/research/extractions-2026-04-17/aicm-and-ms-failure-modes.md` §14
- AGT × AGF crosswalk appendix (Strategic Rec #3 from 2026-04-15 diff doc)
- ATF × AGF crosswalk appendix (Strategic Rec #4 from 2026-04-15 diff doc)
- ~~Four-layer stack diagram~~ — superseded by seven-layer stack; shipped 2026-04-21 as `diagrams/seven-layer-landscape-stack.png`

### Intent.md review (deferred)
- Review `intent.md` against D12 pillars once positioning is high-confidence
- Expected updates: category stake sentence, OTAA invariant added to design principles, dual-form principle added
- **Sacred file — never auto-edit; surface proposed language and reasoning for Jesse decision**

### Existing backlog items (pre-2026-04-17)
- Review and update component inventory table in brief.md (Work Management status may have changed)
- Consider v0.2 revision based on community/reader feedback from Campaign 03 posts
- Glasswing / agentic-zero-day addendum (per 2026-04-15 diff doc Strategic Rec #5 — needs scoping)

### Future work (noted 2026-04-21, not urgent)
- AGF-to-TOGAF / SABSA / COBIT crosswalks in profile docs — only if organizational demand emerges. "What Sits Above This Stack" section in relationship-to-frameworks.md notes these as future-reference only.
- "Architectural Patterns that Span Layers" subsection in `docs/relationship-to-frameworks.md` to describe harness as a spanning architectural pattern — defer to v0.2 follow-up pass
- AGF-to-ATF maturity crosswalk in `docs/profiles/grc-profile.md` — after D14 maturity rewrite ships

### Community + credibility + adoption (NEW 2026-04-23)

Driven by the governance/lifecycle conversation on 2026-04-23. Added as considerations, not scheduled. Pick up when release infrastructure is proven and external awareness-building begins.

- **CMO-led public peer review program** — CMO identifies and invites 2–3 recognized names from the NIST AI RMF / OWASP Agentic / CSA ATF / AICM communities to conduct attributed reviews of AGF v0.x. Named reviewers + their findings surface on the site. Highest-leverage credibility move.
- **Primitive stability markers** — label each of the 19 primitives as Stable / Experimental / Proposed. Signals to implementers where to lean vs where to expect change. Candidate location: `docs/agentic-primitives.md` and primitive summary tables.
- **Deprecation policy** — document how primitive semantics or vocabulary can change without breaking users. Versioned per primitive, with migration notes. Pairs with SemVer-ish framework versioning in GOVERNANCE.md.
- **Citation format standard** — canonical citation format ("AGF v0.X.X, Primitive #N (Name)"). Add to README + site header + site footer. Makes AGF discoverable and standardizes how external docs reference it.
- **Reference implementations** — working code demonstrating primitives. Tool Gate MVP (for Primitive #8) is the natural starter — partially scoped already. Separate repo or subdir; Apache-2.0 or MIT license (not CC, which is docs-only). Shifts AGF from doc-only to doc+code, much harder to dismiss.
- **Challenge ledger** — public list of open challenges, counter-arguments, unresolved debates (`docs/challenges.md` or similar). Signals intellectual honesty — deliberately visible "we don't have all the answers."

### Tooling refinement — release infrastructure (NEW 2026-04-23, from findings ledger)

Residual tooling items. MI-F03/F04/F05 shipped in commit `3afefb4` (pre-push hook activation surfaced them as release-blockers); validated 2026-04-24. F06 and F07 remain.

- **MI-F06: `preflight.sh` blocks on untracked files** — treats `git status` output uniformly, failing on intentional in-flight workspace files. Fix: distinguish modified-tracked (block) from untracked (warn + continue). Align with conventional pre-commit behavior.
- **MI-F07: markdownlint content hygiene pass** — 108 residual errors after MI-F02 config fix. Breakdown: MD032 blanks-around-lists (45), MD013 long prose (42), MD040 missing code-fence languages (11), MD022/031/024 minor. Editorial pass at next content sweep; pair with G5-F18 (slogan density).

### Queue dependencies (from `.private/change-queue.md`)
- ~~Q1: Governance Decision Record (GDR)~~ **PROMOTED 2026-04-22** as DECISIONS.md #8 + #9 + `docs/governance-decision-record.md` + `docs/schemas/gdr.yaml`. Update `.private/change-queue.md` to reflect.
- Q2: Agent Harness Concept — Needs scoping (older)
- Q3: AGF Tool Governance — domain application (older, reviewed) — **Now unblocked by Q1 promotion.** Tool Gate is the first reference application for the GDR primitive. Ready for promotion when prioritized.
- Q4: Taxonomy Updates — Ready for review (older)
- ~~Q5: Relationship to Frameworks~~ **PROMOTED 2026-04-21** as `docs/relationship-to-frameworks.md` (commit `0e04172`).

### Future / low priority (NEW 2026-04-22)
- ISO 42001 clause verification — confirm Clauses 7.5 + 9.3 against official ISO text (paywalled). High-confidence based on Annex SL but not independently verified during GDR doc Standards section drafting. Soften citations if numbers are wrong.
- RDG → GDR export format specification in `docs/decision-intelligence.md` (P2) — document how the RDG's Final Decision + Approval nodes serialize to a GDR
- GDR retention and integrity policy template (P3) — operationalization helper aligned with EU AI Act Art. 12 retention requirements
- Second Codex review pattern documented — use review-loop pattern (round 1 → revise → round 2 → revise → commit) for high-stakes framework promotions; round 2 caught real defects round 1 missed
