# 12 — Delta vs AGF Baseline (as of v0.2.0 + unreleased content through May 2026)

**Research date:** 2026-10-28

This file lists what the Oct 2026 research changes about AGF's *current* claims. It is a **delta register, not a roadmap**: it records what is stale, what's validated, and where others now overlap. Decisions about what to do are deliberately left for the future-state discussion.

Line references were checked against `main` at `972eee0`. They may drift once the parallel repo cleanup lands.

---

## A. Stale or incorrect factual claims in canonical docs

| # | Where | AGF says | Now (source file) | Confidence |
|---|---|---|---|---|
| A1 | `docs/profiles/grc-profile.md:86` | EU AI Act high-risk obligations "become applicable 2 August 2026" | Deferred by Reg. (EU) 2026/1744: Annex III **2027-12-02**, Annex I **2028-08-02**. Art. 50 transparency did apply 2026-08-02 (`02`) | Established |
| A2 | `docs/relationship-to-frameworks.md:57,125,134` | CSA AICM **v1.0.3**, **243** controls, 5 of 243 agent-native | AICM **v1.1**, **247** controls (2026-07-14). No new agent controls, so it's ~5 of 247. Recheck control IDs (`05`) | Established |
| A3 | `docs/agentic-primitives.md:1842` | "Linux Foundation's **Agentic AI Interoperability Forum** (AAIF)" houses MCP, A2A, **AGNTCY**, AGENTS.md | Name is **Agentic AI Foundation**. 10 projects. AGNTCY not found on AAIF's project list (`08`) | Established (name); Open (AGNTCY) |
| A4 | `docs/agentic-primitives.md:1818` (OTel table) | "MCP does not yet define standard trace context propagation" | MCP 2026-07-28 documents `traceparent`/`tracestate`/`baggage` in `_meta` (SEP-414) (`08`) | Established |
| A5 | `docs/agentic-primitives.md:433` (#14) | "MCP does not yet enforce identity verification" | Partly superseded: per-request client/server info, RFC 9207 `iss` validation, issuer-bound credentials, CIMD replaces DCR (`08`) | Established |
| A6 | `docs/agentic-observability.md:534`, `docs/agentic-primitives.md:1816` | OTel GenAI semconv **v1.40.0** | Last GenAI cut **v1.42.0** (2026-06-12), moved to a dedicated repo with no release. Still "Development". `invoke_agent` split into client/internal spans (`09`) | Established |
| A7 | `docs/agentic-governance-framework.md:606` | A2A status "Early" | **A2A v1.0.0**, now an AAIF project (`08`) | Established |
| A8 | `docs/agentic-primitives.md:1734`, `grc-profile.md:127`, `shared-vocabulary.md:338` | IMDA MGF for Agentic AI (Jan 2026) | **v1.5, 2026-05-20**: multi-agent and systemic risks, automation-bias guidance, rules-over-prompts (`02`) | Established |
| A9 | NIST references throughout | "CAISI", "COSAiS" | Program names unstable: EO 14434 → "Super Intelligence". NIST pages show **CAISSI** and **COSIS**. Cite document numbers, not programs (`01`) | Established (EO, COSIS); Informed (CAISSI) |
| A10 | `docs/relationship-to-frameworks.md` (Layer 4/5), `docs/agf-primer.md:49` | Microsoft AGT "formally ATF-conformant". ATF has "25 conformance requirements" | AGT v1.0.0 claims a self-assessed ATF mapping of "**15/15** requirements". Later releases don't mention ATF. The 25 vs 15 count needs a source check (`07`) | Informed |
| A11 | `docs/agf-primer.md:49` | AWS, Google "expected to mature" | AWS AgentCore Policy GA (Cedar at gateway, 2026-03-03). Google Model Armor + Cloud API Registry + DeepMind control roadmap (`07`, `10`) | Established |
| A12 | `docs/agentic-primitives.md` (IEEE P2863 "finalizing 2026") | — | No evidence of publication found (`03`) | Open |
| A13 | `docs/agentic-primitives.md:1750` | OWASP MCP Top 10 "living/beta as of March 2026" | Still no v1.0 found. Caveat holds, but categories should be re-read against MCP 2026-07-28 (`04`) | Informed |

## B. AGF claims that gained outside validation

| AGF construct | New validating source(s) | File |
|---|---|---|
| Bounded Agency (#7) and mandatory gates on irreversible actions (#8, #16) | Five Eyes guidance (approval defined in advance by designers, not agents). China's three-tier decision authority. Forrester "least agency" | `01`, `02`, `06` |
| Policy as Code (#9) as deterministic enforcement outside the model | PCAS (48→93%), ABC, C-Trace, AgenticRei. Singapore v1.5 "rules over prompts". AISI root cause ("scope lived in the prompt") | `11`, `02`, `10` |
| Producer-Verifier Separation (#1) | DeepMind "trusted AI supervisors". CSA's "monitor independence". Gartner guardian agents | `06` |
| Middleware/Interrupt deployment mode | Hooks across Claude Code, Cursor, Codex, Copilot. OWASP ACS. AgentCore Gateway. MCP `Mcp-Method`/`Mcp-Name` headers | `07`, `08` |
| Tempo taxonomy (wire / near-realtime / human-speed) | DeepMind R1–R3 (async review for reversible, sync block for high-risk). C-Trace 1.8 µs/event | `06`, `11` |
| Ring 3 "proposes, never enacts" | OpenAI/HF and AISI incidents: score-seeking agents expanding their own reach | `10` |
| GDR as machine-readable audit artifact | AARM signed receipts. AGT Decision BOM. AIUC-1's shift to verifiable evidence. IETF `audit` BOF | `05`, `07`, `06`, `03` |
| Identity & Attribution (#14) | IETF AIMS (WG doc). NCCoE six-standard set. Five Eyes per-agent identity and named owner. AIUC-1 identity/access split | `03`, `08` |
| Multi-agent governance collapse rule | EU draft high-risk guidelines: interacting components assessed as one system. IMDA v1.5 multi-agent risks | `02` |
| Minimum Viable Control / crawl-first | Five Eyes "start with low-risk, expand after controls validated". Forrester's phased rollout | `01`, `06` |

## C. Where others now overlap AGF's distinctive territory

| AGF asset | Overlapping external work | Degree | Notes |
|---|---|---|---|
| Gate Resolution enum (`APPROVE/REJECT/MODIFY/DEFER/ESCALATE`) + GDR | **AARM** (`ALLOW/DENY/MODIFY/STEP-UP/DEFER` + signed receipts, with conformance) | **High (near-isomorphic)** | AARM is action-time only, but conformance-testable and CSA-backed. Neither cites the other |
| Composability signals at the hook boundary | **OWASP ACS** (hook surface), AGT ToolPolicy schema in Agent Spec | Medium | ACS standardizes *where* to intercept. AGF defines *what* signals and records cross |
| "Layer 0 synthesis substrate" | **CSA Agentic Control Plane** (ref arch → ACP → ATF → MAESTRO → AICM → AARM → STAR) | Medium–High within CSA's family | AGF remains the only cross-consortium synthesis found |
| Crosswalks | OWASP GenAI Industry Framework Crosswalk. AICM v1.1 mappings. AIUC-1 ↔ AIVSS. AEGIS mappings | Medium | Crosswalks are commoditizing |
| Trust Ladders | ATF tiers. DeepMind permission-by-verified-behavior. China tiers | Medium (unchanged) | No one else specifies asymmetric demotion or context scoping |
| Rings Model, seven tensions, three deployment modes | None found | Low | Still distinctive |
| Intent drift | AARM intent alignment, AEGIS intent monitoring | — | **Gap in AGF:** no named intent-drift construct |

## D. New topics AGF doesn't cover

- **Agent Skills as a supply-chain surface** (OWASP AST01–AST10, AAIF Agent Skills standard) (`04`, `08`)
- **Hook configuration as attack surface** (CVE-2025-59536, CVE-2026-21852) (`07`)
- **Evaluation-environment containment** for frontier agents, plus the EU GPAI systemic-risk enforcement around it (`02`, `10`)
- **Insurance-linked certification** (AIUC-1) (`06`)
- **China** agent policy framework (`02`)
- **Financial-sector carve-out** of agentic AI from US model-risk guidance (SR 26-2) (`01`)
- **Shadow-agent discovery** as a control (Agent 365 / Defender) (`07`)
- **Cross-organization detection**: victims detecting first (`10`)
- **Path-level policy and obligations** as policy outcomes (`11`)
- **New failure modes:** fail-plausible narratives, entity binding, commitment drift (`11`)

## E. Open questions surfaced (for later discussion, not answered here)

1. Do the AARM and GDR vocabularies converge, crosswalk, or compete?
2. Is Microsoft-as-Layer-5-reference still defensible as vendor-neutral, now that AWS and Google have production equivalents?
3. Does AGF need explicit vocabulary for intent drift, obligations, and guardian agents?
4. How should AGF cite NIST through the "Super Intelligence" renaming?
5. What does the pending JTC 21 logging standard require, and does graph-embedded mode's partial ordering satisfy it?
