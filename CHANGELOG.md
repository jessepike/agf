# Changelog

All notable changes to the Agentic Governance Framework are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning policy: see `GOVERNANCE.md`.

This changelog documents **canonical AGF framework evolution**. Site-level infrastructure changes (`agf-docs/`, build config) are excluded unless they affect published content.

---

## [Unreleased]

### Changed

- **Composition Patterns canonicalized at four.** Rings Model "Phase 1–5" growth language retired in favor of the four pattern names; Ring activation reframed as a consequence of pattern selection. The #11/#15/#18 hardening stack (Trust Ladders, Adversarial Robustness, Evaluation & Assurance) is expressed as a **hardening posture** — a modifier applied within Governed Decision Flow, or as a precondition for entering Full Governed — not a fifth named pattern. Earlier drafts referring to "Secure Governed System" as a pattern are retired. Decision: D10 (a).
- **"Governance" qualifier conventions added** to `docs/shared-vocabulary.md` and the site vocabulary. Five-sense disambiguation table + required qualified forms — "AGF" for the framework, "Ring 2 / the Governance ring", "AGF program maturity" (replacing "program-level governance"), "Governance Gates" capitalized, "NIST CSF Govern" prefixed. Bare "governance" reserved for the framework sense or deliberate adjectival use. Decision: D10 (b).
- **Observability three-layer disambiguation added** to `docs/shared-vocabulary.md`, the site vocabulary, and `docs/agentic-observability.md` (both canonical and site) as a "Where This Fits in AGF" frame block. Primitive #10 (emits) → Agentic Observability concept (correlates) → Observability Profile (implements) hierarchy now stated explicitly. Decision: D10 (c).

Closes findings G5-F09, G5-F15, G5-F16 (Cohesion Pass v0.3). Meta-finding G5-M02 requires separate holistic re-read.

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
