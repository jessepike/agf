---
updated: 2026-04-21-pm
stage: operate (v1.0 positioning landed; downstream implementation work queued)
---

# Status — AGF

**Updated:** 2026-04-21 (PM)
**Stage:** Operate — v1.0 positioning landed in public repo; macro positioning visuals Campaign-03-ready; downstream implementation work queued

## Current State

Agentic Governance Framework v0.1 published. Documentation site live at agf.jessepike.dev. Core framework docs complete. 24 architecture diagrams generated (3 new macro positioning visuals added 2026-04-21 PM). `DECISIONS.md` active.

**2026-04-17 — Major positioning work landed in workshop (not yet public):**
- Six-pillar positioning (D12): Category "Agentic Governance" + four verbs (Synthesize/Unify/Prescribe/Operationalize) + OTAA invariant + dual-form principle + tempo taxonomy + NIST CSF parallel
- Seven-layer stack with AGF as architectural substrate at Layer 0 (D13)
- Source extractions from Microsoft (AGT, CAF, Failure Mode Taxonomy, Responsible AI Report, Copilot Studio Gov WP) and CSA (ATF, AICM, MAESTRO, Agentic IAM, Identity Gaps, Securing Autonomous Agents) in `.private/research/extractions-2026-04-17/`

**2026-04-21 PM — Macro positioning visuals generated (CPO session):**

Three high-altitude diagrams produced via diagram-forge (gpt-image-2, quality medium, $0.369 total):

- `diagrams/seven-layer-landscape-stack.png` — AGF as encapsulating container around L1 OWASP → L5 MS AGT stack with Risk Quantification as orthogonal sidebar. Supports DECISIONS #4.
- `diagrams/four-verbs-invariants.png` — Four-verb causal flow (Synthesize → Unify → Prescribe → Operationalize) with shared navy header "EVERY AGF PRIMITIVE MUST:" + BE (OTAA) and PRODUCE (dual-form) peer bands. Supports DECISIONS #3 pillars #2/3/4 and #5.
- `diagrams/reference-architecture-macro.png` — Four concentric rings (Ring 0 center → Ring 3 outermost) with cross-cutting radial sectors (Agentic Observability + Decision Intelligence), 19-primitive legend, NIST CSF Parallel callout. Supports DECISIONS #3 pillar #6.

Canonical prompts saved to `diagrams/DIAGRAM-SPECS.md` for reproducibility.

**2026-04-21 AM — Positioning refinement + promotion complete:**

Workshop session refined positioning, then promoted to public repo in 4 atomic commits:
- `4244707` — `docs(decisions): promote D12-D15 positioning decisions to public DECISIONS.md`
- `bd1b665` — `docs(maturity): rename L1 Awareness to Non-existent; absorb inventory content into L2 Foundation`
- `a2adb27` — `docs(vocabulary): add positioning pillars, harness, maturity, and framework-synthesis terminology`
- `0e04172` — `feat(framework): add relationship-to-frameworks as AGF's canonical position in the governance landscape`

Public artifacts now live:
- `DECISIONS.md` — #3–#7 (positioning pillars, seven-layer stack, gate-boundary dual-form, maturity model, harness definition)
- `docs/relationship-to-frameworks.md` — NEW canonical doc with seven-layer stack, role-based entry points, TOGAF/SABSA context, Trust Ladders↔ATF relationship
- `docs/agentic-governance-framework.md` — maturity model rewritten (L1 Non-existent)
- `docs/shared-vocabulary.md` — 5 new sections (positioning, harness, maturity, identity & credentialing, governance program); standards abbreviations expanded
- `docs/agf-reference-architecture.md` — cross-link added
- `docs/publication-map.md` — Relationship to Frameworks registered
- MDX synced: `agf-docs/content/docs/reference/relationship-to-frameworks.mdx` (new), `governance-framework.mdx` (maturity), `resources/vocabulary.mdx` (vocab)
- `.private/change-queue.md` — Q5 moved to Completed

## Next Steps

1. **Gate-boundary dual-form audit** (per DECISIONS.md #5) — Primitive #8, Composability Interface, Primitive #11. Specify JSON/YAML schema for gate decision artifacts.
2. **Primitive #14 Identity & Attribution upgrade** — 10-point spec ready in `.private/research/extractions-2026-04-17/ms-docs-and-csa-identity.md` §11
3. **Primitive #15 rename to "Agent SRE"** + SLO/error-budget/chaos additions
4. **Publishable content:** "Agentic Compliance Blind Spots" analysis (10-gap assertion, source in extraction reports)
5. **Profile doc upgrades:** security-profile MS Failure Mode Taxonomy section + AICM crosswalk; GRC-profile AGF↔ATF maturity crosswalk
6. **Intent.md review** — produce DIFF PROPOSAL (not edit) against new pillars (DECISIONS.md #3)
7. **Content production** via pike-acm (Campaign 03: AGF series C3-003+) — positioning now stable enough to resume; three macro visuals ready to anchor content
8. **Publishable content candidate:** "Agentic Compliance Blind Spots" 10-gap analysis (source: `.private/research/extractions-2026-04-17/aicm-and-ms-failure-modes.md` §14)

## Blockers / Open Questions

None blocking. Positioning foundation is public and stable.

## Detail

Full session log at `.private/status.md` (2026-04-17 entry).
