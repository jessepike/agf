# Backlog — AGF

Prioritized work queue. P0 = blocking. P1 = high value. Active = in progress. Backlogged = tracked but not scheduled.

---

## P0 — Blocking

### LICENSE decision (BLOCKER before external contributors)
- Current `LICENSE` file has CC BY 4.0 language — confirm this is intentional.
- See `LICENSE-TODO.md` for options (CC-BY-4.0, CC-BY-SA-4.0, Apache-2.0) with pros/cons.
- Decision required before onboarding any external contributor or accepting PRs from outside Jesse's network.
- Jesse's call — do not decide unilaterally.

## P1 — High Priority

### Site update execution (NEW 2026-04-22)
- Execute changelist at `.private/drafts/site-update-changelist.md` covering v1.0 positioning batch + GDR primitive + macro diagrams + 3 broken-link fixes + homepage card
- Coordinate with Jesse's parallel diagram work before deploy

### Cross-doc integration passes for GDR (NEW 2026-04-22)
- Update `docs/profiles/grc-profile.md` Evidence Artifacts table to reference GDR as the format for #8 (human decision records, override logs) and #11 (promotion/demotion records)
- Add GDR `decision_id` reference to observability event payloads in `docs/profiles/observability-profile.md` (`gate_triggered`, `gate_resolved`, `approval_granted`, etc.)
- Closes the "competing artifact" coherence risk surfaced in external review

### Primitive #8 timeout-behavior prose cleanup (NEW 2026-04-22)
- Canonical `docs/agentic-primitives.md` Primitive #8 prose says "default action — which may be HALT or ESCALATE" — conflates Ring Control Signal (HALT) with Gate Resolution (ESCALATE)
- Surfaced by Codex round 2 review while drafting GDR primitive
- Fix: revise to describe the three valid default actions (ESCALATE, REJECT, HALT) per the Default Action on Timeout table now in `docs/governance-decision-record.md`
- Pairs naturally with GDR promotion but kept separate to keep that commit atomic

### Gate-boundary dual-form audit — remaining work (PARTIAL — superseded by D17)
- ~~Audit Primitive #8 (Governance Gates) for gate-boundary dual-form emission~~ **Done in commit `288ddee` — Primitive #8 now requires GDR emission at every gate resolution**
- ~~Specify JSON/YAML schema for gate decision artifact~~ **Done in commit `288ddee` — `docs/schemas/gdr.yaml`**
- Audit Composability Interface (PASS/REVISE/HALT/GATE/DELEGATE/ERROR signals) for dual-form emission per signal type — STILL OPEN. Resolution per D16: Ring Control Signals emit observability events (not GDRs); GATE returns a Gate Resolution which emits a GDR. Audit confirms coherence and adds explicit dual-form annotations to Composability Interface spec.
- Audit Primitive #11 (Trust Ladders) — trust promotions/demotions are Domain Outcomes that emit GDRs (per D17). Audit verifies all promotion/demotion paths emit GDRs and adds explicit annotations.
- Sync MDX versions after canonical changes land

## Active

_(nothing actively in flight — session paused at checkpoint 2026-04-17)_

## Backlogged

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

### Rings-model canonical diagram selection
- Five untracked v2–v6 iterations of `rings-model-governed-agentic-systems.png` in `diagrams/`.
- Jesse to select canonical version and archive others, or formally supersede v1 with selected iteration.
- Do NOT auto-select — this is a Jesse decision.

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
