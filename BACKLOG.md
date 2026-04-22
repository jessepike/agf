# Backlog — AGF

Prioritized work queue. P0 = blocking. P1 = high value. Active = in progress. Backlogged = tracked but not scheduled.

---

## P0 — Blocking

_(none — all work below is unblocked except where Jesse review is pending)_

## P1 — High Priority

### Gate-boundary dual-form audit (per DECISIONS.md #5)
- Audit Primitive #8 (Governance Gates) in `docs/agentic-primitives.md` for gate-boundary dual-form emission requirements; specify JSON/YAML schema for gate decision artifact
- Audit Composability Interface (PASS/REVISE/HALT/GATE/ERROR signals) for dual-form emission per signal type
- Audit Primitive #11 (Trust Ladders) — trust promotions/demotions are gate decisions; same invariant applies
- Sync MDX versions after canonical changes land

## Active

_(nothing actively in flight — session paused at checkpoint 2026-04-17)_

## Backlogged

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
- Q1: Governance Decision Record (GDR) — Ready for review (older)
- Q2: Agent Harness Concept — Needs scoping (older)
- Q3: AGF Tool Governance — domain application (older, reviewed)
- Q4: Taxonomy Updates — Ready for review (older)
- Q5: Relationship to Frameworks — Ready for review (this session, 2026-04-17)
