# AGF: Agentic Governance Framework

**A Reference Architecture for Governed Agentic Systems**

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Status: Draft](https://img.shields.io/badge/Status-0.1%20Draft-orange.svg)]()

AGF is a synthesis framework that integrates NIST AI RMF, OWASP, CSA, ISO, EU AI Act, OpenTelemetry, Singapore IMDA, MITRE ATLAS, and academic research into a single coherent reference architecture for organizations building safe, secure, durable, auditable, and observable agentic systems.

We did not invent these patterns. We sorted the pieces and showed how they fit together.

**Documentation site:** [agf.jessepike.dev](https://agf.jessepike.dev)

---

## Quick Start

| If you are... | Start with... |
|--------------|---------------|
| New to AGF | **[Reference Architecture](docs/agf-reference-architecture.md)** — the entry point |
| A CISO or security architect | **[Security Profile](docs/profiles/security-profile.md)** — threat modeling, OWASP mappings, red team scenarios |
| A platform engineer | **[Platform Profile](docs/profiles/platform-profile.md)** — deployment modes, MCP integration, cost model |
| A compliance officer or auditor | **[GRC Profile](docs/profiles/grc-profile.md)** — regulatory mappings, control crosswalks, maturity model |
| An AI engineer | **[AI Engineering Profile](docs/profiles/ai-engineering-profile.md)** — 19 primitives, implementation priority, composition patterns |
| An SRE or detection engineer | **[Observability Profile](docs/profiles/observability-profile.md)** — event architecture, correlation rules, playbooks |

## Core Concepts

**The Rings Model** — Four concentric rings (Execution → Verification → Governance → Learning) plus cross-cutting fabric and environment substrate. A vendor-neutral logical architecture that adapts to any agentic system.

**19 Primitives** — Named patterns for governed agentic systems: separation of producer/verifier, validation loops, governance gates, policy as code, trust ladders, identity & attribution, adversarial robustness, and more. Not invented — named for the agentic context.

**Three-Level Security Model** — Security Fabric (enforcement), Security Governance (policy), Security Intelligence (detection). Unified because agentic threats cross quality, security, and compliance boundaries.

**Three Deployment Modes** — Wrapper (batch pipelines), Middleware/Interrupt (coding agents, MCP), Graph-Embedded (conversational agents). Same logical rings, different physical manifestation.

## Repository Structure

```
docs/
  agf-reference-architecture.md   ← Entry point
  agentic-primitives.md           ← Foundation: 19 primitives, Rings Model
  agentic-observability.md        ← Capability layer: SIEM for agents
  decision-intelligence.md        ← Capability layer: governed decisions
  agentic-governance-framework.md ← Top-level operating model
  shared-vocabulary.md            ← Canonical terminology
  cross-concept-relationship.md   ← How the concept areas relate
  publication-map.md              ← How all artifacts connect
  white-papers/
    trust-ladders.md              ← White Paper No. 1
    rings-model.md                ← White Paper No. 2
  profiles/
    security-profile.md           ← For CISOs, security architects
    platform-profile.md           ← For platform engineers
    grc-profile.md                ← For compliance officers, auditors
    ai-engineering-profile.md     ← For AI engineers
    observability-profile.md      ← For SREs, detection engineers

diagrams/                         ← 21 architecture diagrams (PNG)

agf-docs/                         ← Documentation site (agf.jessepike.dev)
```

## Standards Alignment

| Standard | AGF Coverage |
|----------|-------------|
| **EU AI Act** | Article-level mapping (Art. 6, 9-15, 50) with phased applicability |
| **NIST AI RMF** | AGF as an agentic AI RMF-style profile (GOVERN, MAP, MEASURE, MANAGE) |
| **OWASP ASI Top 10** | All 10 threats mapped to three-level security model |
| **OWASP MCP Top 10** | All 10 MCP threats mapped to primitives |
| **CSA MAESTRO** | 7-layer threat model mapped to primitives |
| **CSA ATF** | Trust Ladders aligned with earned autonomy maturity model |
| **MITRE ATLAS** | Security architecture aligned to adversarial technique taxonomy |
| **NIST 800-53 / ISO 27001** | Control crosswalks in GRC Profile |
| **Singapore IMDA** | 4-dimension mapping to AGF primitives |
| **OpenTelemetry GenAI** | Event architecture as OTel-compatible base + governance extensions |

## Philosophy

- **Humility before authority.** We synthesize, we don't decree. We acknowledge what came before.
- **Rigor before opinion.** Every claim grounded in evidence, existing work, or clearly marked as a proposal.
- **Community > credit.** If this framework helps one organization build a safer agentic system, it has served its purpose.

Read the full philosophy in [intent.md](intent.md).

## Contributing

We welcome challenges, evidence, proposals, and corrections. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, or jump into [Discussions](https://github.com/jessepike/agf/discussions).

## Status

**Version:** 0.1 Draft — All core documents drafted, 5 domain profiles complete, 3 rounds of external review on primitives, 1 round on profiles with errors corrected, 21 architecture diagrams, 2 white papers.

## License

[CC BY 4.0](LICENSE) — free to share and adapt with attribution.

## About

AGF is developed and maintained by [Jesse Pike](https://jessepike.dev).
