# Changelog

All notable changes to the Agentic Governance Framework are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning policy: see `GOVERNANCE.md`.

This changelog documents **canonical AGF framework evolution**. Site-level infrastructure changes (`agf-docs/`, build config) are excluded unless they affect published content.

---

## [Unreleased]

### Added

- **First 30 Days workplan** — week-by-week starter at `agf-docs/content/docs/overview/first-30-days.mdx` for teams adopting the Minimum Viable Control composition pattern. Prerequisites + four week sections (Inventory & Scope → Identity & Attribution → Provenance & Observability → Scoped Environment) + exit criteria into Validation Pipeline and Governed Decision Flow. Closes G5-F12.
- **Reference Walkthrough** — single threaded customer-refund scenario at `agf-docs/content/docs/overview/reference-walkthrough.mdx` traced across Rings 0–3 with two complete GDR YAML examples and a primitive/artifact/event mapping table. Closes G5-F13.
- **Transparency section** — public surfaces at `agf-docs/content/docs/transparency/`: changelog, decisions, roadmap, contribute. Site grows 29 → 33 routes.
- **Confidence markers across flagship pages** — empirical claims now carry `<Confidence level="established|informed|open" />` proportional to the evidence base. Time-sensitive references (Agent 365, AICM v1.0.3, Trust Ladders citations) carry verification dates so readers can confirm currency. Closes G5-F03 + G5-F20. Path A (2026-04-25) extended this to four previously-unmarked flagship pages — closes G5-F32.
- **AI Engineering profile rewrite** — restructured around the four canonical Composition Patterns instead of the retired "Phase 1–5" sequence. Pairs with the new First 30 Days and Reference Walkthrough pages for an AI engineer's reading path.
- **GDR cross-doc integration** — `gate_triggered`/`gate_resolved`/`approval_*` events now carry `decision_id`; #11 promotion/demotion noted as Domain Outcomes emitting GDRs. Mirrored from canonical `docs/profiles/{grc,observability}-profile.md` to site MDX.
- **Per-signal dual-form table** — Composability Interface specification now includes a per-signal emission table (which Ring Control Signals emit observability events vs Governance Decision Records); Trust Ladder promotions/demotions have an explicit GDR emission spec. D17 follow-on closeout.
- **AGF Primer** — agent-context primer at `docs/agf-primer.md` (~1100 words, public, CC BY 4.0). Six pillars + core constructs + seven-layer stack + audience entry table + operational tail for agents.
- **Composition Patterns diagram regenerated** — `composition-patterns.png` now renders true four-pattern progression (MVC → Validation Pipeline → GDF → Full Governed) with hardening-posture modifier band overlapping Patterns 3–4. `implementation-phases-roadmap.png` retired as superseded.

### Changed

- **Composition Patterns canonicalized at four.** Rings Model "Phase 1–5" growth language retired in favor of the four pattern names; Ring activation reframed as a consequence of pattern selection. The #11/#15/#18 hardening stack (Trust Ladders, Adversarial Robustness, Evaluation & Assurance) is expressed as a **hardening posture** — a modifier applied within Governed Decision Flow, or as a precondition for entering Full Governed — not a fifth named pattern. Earlier drafts referring to "Secure Governed System" as a pattern are retired. Decision: D10 (a).
- **"Governance" qualifier conventions added** to `docs/shared-vocabulary.md` and the site vocabulary. Five-sense disambiguation table + required qualified forms — "AGF" for the framework, "Ring 2 / the Governance ring", "AGF program maturity" (replacing "program-level governance"), "Governance Gates" capitalized, "NIST CSF Govern" prefixed. Bare "governance" reserved for the framework sense or deliberate adjectival use. Decision: D10 (b).
- **Observability three-layer disambiguation added** to `docs/shared-vocabulary.md`, the site vocabulary, and `docs/agentic-observability.md` (both canonical and site) as a "Where This Fits in AGF" frame block. Primitive #10 (emits) → Agentic Observability concept (correlates) → Observability Profile (implements) hierarchy now stated explicitly. Decision: D10 (c).
- **Microsoft Agent 365** references updated from "GA target May 2026" to "GA May 1, 2026" with primary-source link, after Microsoft confirmed GA on the announced date.
- **License canonized** — D11 added retroactively to `DECISIONS.md`: CC BY 4.0 retained for docs (adoption-first); Apache-2.0/MIT for any reference implementations or tooling.

### Fixed

- **G5-M01 + G5-M02 → validated** via two-pass closeout convergence (Codex generic-reviewer + new-adopter persona) — Cluster D (Actionability) + Credibility Pass v0.3 + Cohesion Pass v0.3 produced the shifts that closed both metas.
- **Roadmap freshness** — "Now (in flight)" reframed around remaining work after Path A shipped; "Recently shipped" section captures public-readiness pass + AI Engineering alignment + Transparency surfaces + GDR.

Closes findings G5-F03, G5-F09, G5-F12, G5-F13, G5-F15, G5-F16, G5-F20, G5-F32. M03 staged at 7/10 floor pending F33 (first adopter case study) — structural, cannot be manufactured editorially.

---

## [0.2.0] — 2026-04-22

### Added

- **Governance Decision Record (GDR)** as canonical audit artifact — new Primitive #8 cross-reference, `docs/governance-decision-record.md` (~440 lines), `docs/schemas/gdr.yaml` (JSON Schema draft-2020-12). Five-state lifecycle (`pending / resolved / expired / superseded / aborted`), Lifecycle Invariants table, Default Action on Timeout table, Sensitive Content Handling subsection. Decisions: D16 + D17.
- **Relationship to Frameworks** — new canonical doc positioning AGF in the broader governance landscape. Seven-layer stack, role-based entry points, TOGAF/SABSA/COBIT context, Trust Ladders ↔ ATF relationship. `docs/relationship-to-frameworks.md`. Decision: D12 application.
- **Macro positioning diagrams** — three new high-altitude visuals:
  - `diagrams/seven-layer-landscape-stack.png` — AGF as architectural substrate (Layer 0) below L1 OWASP → L5 MS AGT. Supports D13.
  - `diagrams/four-verbs-invariants.png` — Four-verb causal flow (Synthesize → Unify → Prescribe → Operationalize) with OTAA/dual-form invariant bands. Supports D12 pillars.
  - `diagrams/reference-architecture-macro.png` — Four concentric rings, 19-primitive legend, NIST CSF Parallel callout. Supports D12 pillar #6.
- **Gate Vocabulary section** in `docs/shared-vocabulary.md` — disambiguates Gate Resolution (Pass/Revise/Reject/Halt/Delegate/Error), Ring Control Signals, and Gate Boundary outputs. Decision: D16.
- **Five new vocabulary sections** in `docs/shared-vocabulary.md` — positioning pillars, harness terminology, maturity model terms, identity & credentialing, governance program constructs.
- **DECISIONS.md entries D12–D17** — positioning pillars, seven-layer stack, gate-boundary dual-form principle, maturity model, harness definition, gate vocabulary disambiguation, GDR as canonical audit artifact.
- **16-diagram refresh** — all architecture diagrams regenerated with upgraded generation model (gpt-image-2, 2026-04-21). Canonical prompts preserved in `diagrams/DIAGRAM-SPECS.md`.
- **Agent harness architecture diagrams** — `agent-harness-components-v2.png`, `agent-harness-enforcement-v2.png`, `agent-harness-two-file-format.png` added to diagram set.

### Changed

- **L1 Maturity Level renamed** — "Awareness" → "Non-existent"; inventory content absorbed into L2 Foundation for cleaner maturity ladder. Decision: D14.
- **Primitive #8 (Governance Gates)** — GDR emission requirement added to gate resolution spec; Composability Interface cross-reference updated; gate vocabulary annotations aligned with D16.
- **`docs/agf-reference-architecture.md`** — cross-link added to new relationship-to-frameworks doc.
- **`docs/publication-map.md`** — Relationship to Frameworks and GDR registered.
- **Gate boundary language** in `docs/relationship-to-frameworks.md` aligned with D16/D17 disambiguation (D12.4a wording fix propagated).

### Fixed

- Gate boundary dual-form language inconsistency across `docs/relationship-to-frameworks.md` — conflation of Ring Control Signals with Gate Resolutions corrected per D16.

---

## [0.1.0] — 2026-03-19

Initial public release of the Agentic Governance Framework.

### Added

- **Rings Model** — four-ring governance architecture (Ring 0: Trusted Core → Ring 3: External Systems). Core framework construct. `docs/agentic-governance-framework.md`.
- **19 Primitives** — complete primitive set from P01 (Trust Establishment) through P19 (Agent Environment Governance). Each primitive: intent, rationale, inputs/outputs, machine-form stub. `docs/agentic-primitives.md`.
- **Shared Vocabulary** — canonical AGF terminology, acronym expansions, confidence-level labels. `docs/shared-vocabulary.md`.
- **Reference Architecture** — component inventory, deployment modes, composition patterns. `docs/agf-reference-architecture.md`.
- **Decision Intelligence concept doc** — RDG (Reasoning Decision Graph), Belief Layer, evidence weighting, pipeline integration. `docs/decision-intelligence.md`.
- **Agentic Observability concept doc** — observability event taxonomy, OTAA invariant definition, ring-level telemetry requirements. `docs/agentic-observability.md`.
- **Cross-Concept Relationship Model** — `docs/cross-concept-relationship.md`.
- **Five domain profiles** — Security (`docs/profiles/security-profile.md`), GRC (`docs/profiles/grc-profile.md`), Platform (`docs/profiles/platform-profile.md`), Compliance (`docs/profiles/compliance-profile.md`), AI Engineering (`docs/profiles/ai-engineering-profile.md`). Each profile: primitive applicability map, maturity baseline, decision tree.
- **White papers** — Rings Model and Trust Ladders white papers for external audiences.
- **Original diagram set** — 18 architecture diagrams covering rings model, deployment modes, composition patterns, multi-agent coordination, observability event flow, governance latency tradeoff, implementation roadmap. Generated via Diagram Forge.
- **Documentation site** — `agf.jessepike.dev` launched. Next.js + Fumadocs. 18 MDX content pages across four sections (Overview, Profiles, Reference, Resources). `/llms.txt` agent-accessible endpoint.
- **Community infrastructure** — `CONTRIBUTING.md`, `DECISIONS.md` (D01–D11 initial decision set), `README.md`, `LICENSE` (CC BY 4.0), `.github/` templates.
- **Publication map** — `docs/publication-map.md` tracking all canonical docs and site routes.

---

[Unreleased]: https://github.com/jessepike/AGF/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/jessepike/AGF/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/jessepike/AGF/releases/tag/v0.1.0
