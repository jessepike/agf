# AGF Shared Vocabulary

**Last updated:** 2026-03-18

This document defines the canonical terms used across all AGF documents — the reference architecture, primitives catalog, domain profiles, capability layer docs, and white papers. When terminology conflicts between documents, this vocabulary is authoritative.

---

## Architecture Terms

### Rings Model
The central logical architecture of AGF. Four concentric rings plus cross-cutting fabric and an environment substrate. Rings are a *logical* architecture — how they manifest physically depends on the deployment mode.

| Term | Definition |
|------|-----------|
| **Ring 0 — Execution** | The core agent performs its domain task. Where the work happens. Time horizon: ms–minutes. |
| **Ring 1 — Verification** | A separate process evaluates Ring 0's output against quality criteria. The fundamental principle: the agent that creates output must not be the sole agent that validates it. Time horizon: seconds–minutes. |
| **Ring 2 — Governance** | Policy evaluation and authorization. Determines whether a verified output should be released. Can pause execution indefinitely for human review. The decision authority. Time horizon: minutes–hours. |
| **Ring 3 — Learning** | The system improves over time. Observes patterns, calibrates trust, tunes thresholds, proposes configuration changes. **Proposes — does not autonomously enact.** Time horizon: days/weeks (slow path) + real-time (sentinels). |
| **Fabric** | Cross-cutting infrastructure that makes rings composable: structured output persistence, event-driven observability, error handling, identity verification, provenance chains, and security enforcement. Active at every ring boundary. |
| **Environment Substrate** | The governed operating environment beneath all rings: context, instructions, tools, workspace, memory. Governed by Primitive #19 (Agent Environment Governance). |

### Deployment Modes
How the logical rings manifest physically. Three modes:

| Term | Definition |
|------|-----------|
| **Wrapper Mode** | Rings literally wrap execution. Sequential: Ring 0 produces → Ring 1 verifies → Ring 2 governs → output releases. Highest audit clarity, highest latency. Best for: batch pipelines, document processing, regulatory workflows. |
| **Middleware / Interrupt Mode** | Ring logic fires at specific decision points within an execution graph — tool calls, data access, state mutations. The agent executes continuously; rings intercept at defined boundaries. MCP is the canonical implementation. Best for: coding agents, ops automation, multi-step task agents. |
| **Graph-Embedded Mode** | Verification, governance, and security run concurrently with execution. Speculative execution with a release gate. Lowest latency, most complex audit trail. Best for: conversational agents, voice assistants, real-time systems. |
| **Hybrid Deployment** | Combining modes. Common pattern: middleware mode overall with graph-embedded subsections within a single response. |

### Composability Interface
The standard contract between rings:

| Term | Definition |
|------|-----------|
| **PASS(output, annotations)** | Ring accepts the output. Passes it forward with optional annotations. |
| **REVISE(output, findings, reason)** | Ring sends output back for revision. **REVISE(quality)** = Ring 1 says "not good enough." **REVISE(context)** = Ring 2 says "world changed, re-execute." |
| **HALT(reason)** | Stop execution. Escalate. Something is fundamentally wrong. |
| **GATE(evidence, req)** | Pause for human authorization. Returns: APPROVE, REJECT, MODIFY, DEFER, or ESCALATE. |
| **DELEGATE(target, context, scope, depth)** | Ring 2 delegates to another agent/pipeline. Depth counter prevents infinite delegation (max recommended: 3). |
| **ERROR(reason, partial_state, recovery)** | Something broke. Recovery options: retry, degrade, halt. |
| **Execution Budget** | Resource limits per pipeline execution: max_iterations, max_cost, max_wall_clock. Budget exhaustion triggers HALT. |

---

## The 19 Primitives

Three categories. All are first-class; the distinction is temporal and structural, not hierarchical.

### Runtime Primitives (#1–#17)
Operate within or across the ring pipeline during agent execution.

| # | Name | Ring | One-Line Definition |
|---|------|------|-------------------|
| 1 | Separation of Producer & Verifier | 0+1 | The agent that creates output must not be the sole agent that validates it |
| 2 | Validation Loops with Convergence Gates | 1 | Iterative verification until quality thresholds met or budget exhausted |
| 3 | Self-Improving Cycles | 3 | System learns from execution history to get better over time — without retraining |
| 4 | Adversarial Critique | 1 | Dedicated challenger whose mandate is to find flaws, not confirm quality |
| 5 | Structured Output Persistence | Fabric | Every ring produces and consumes schema-conformant structured artifacts — the data contract |
| 6 | Provenance Chains | Fabric | Every output carries its full decision history — immutable, append-only, tamper-evident |
| 7 | Bounded Agency | 2 | Agents operate within explicit, enforced boundaries — tools, data, scope, authority |
| 8 | Governance Gates | 2 | Explicit decision points where execution pauses for authorization |
| 9 | Policy as Code | 2 | Governance rules as versioned, executable, testable objects |
| 10 | Event-Driven Observability | Fabric | Every ring emits structured events — the shared nervous system |
| 11 | Trust Ladders | 2+3 | Trust earned through demonstrated performance, not granted by default |
| 12 | Memory-Augmented Reasoning | 0+3 | Agents reason with persistent memory, not just immediate context |
| 13 | Error Handling & Recovery | Fabric | Graceful degradation, checkpointing, compensation |
| 14 | Identity & Attribution | Fabric | Every agent has authenticated, inspectable identity on every action |
| 15 | Adversarial Robustness | Security | Assume breach. Defense in depth. Verify explicitly. |
| 16 | Transaction & Side-Effect Control | 0+2 | Pre-commit/commit/post-commit for irreversible actions |
| 17 | Data Governance & Confidentiality | 2+Fabric | Classification, consent, PII, lineage, retention at every data flow |

### Lifecycle Primitive (#18)
Operates outside the runtime pipeline.

| # | Name | Scope | One-Line Definition |
|---|------|-------|-------------------|
| 18 | Evaluation & Assurance | Pre-deployment | The gate before the gate — validates configurations before production |

### Substrate Primitive (#19)
Governs the operating environment beneath all rings.

| # | Name | Scope | One-Line Definition |
|---|------|-------|-------------------|
| 19 | Agent Environment Governance | All rings | Governed composition of context, instructions, tools, workspace, and memory |

---

## Security Terms

### Three-Level Security Model
Security is a pervasive architectural concern, not a ring or layer.

| Term | Definition |
|------|-----------|
| **Level 1: Security Fabric** | Enforcement layer. Always active, synchronous, wire-speed. Input sanitization, output scanning, runtime containment, identity verification, configuration attestation. Does NOT make semantic judgments. |
| **Level 2: Security Governance** | Policy evaluation layer. Lives in Ring 2. Access control, data classification, irreversible-action authorization, supply chain trust, semantic security evaluation. Makes the decisions that Fabric enforces. |
| **Level 3: Security Intelligence** | Detection layer. SIEM pattern for agents. Behavioral anomaly detection, cross-pipeline correlation, memory introspection, human-agent interaction analysis. Dual-speed: fast-path sentinels (sub-second) + slow-path analysis (hours–days). |
| **Security Response Bus** | Pre-authorized fast-path from Intelligence directly to Fabric, bypassing normal Governance deliberation for defined threat classes. Governance defines the classes; Intelligence triggers; Fabric contains. Not a governance bypass — governance pre-authorizes. |

### Zero Trust
The architectural assumption that runs through everything.

| Term | Definition |
|------|-----------|
| **Zero Trust Posture** | No ring trusts another ring's output by default. Trust is earned through demonstrated performance (Trust Ladders), not assumed by origin. |
| **Identity Context** | Composite identity that travels with every action: agent identity, model identity, delegation chain, execution identity, data identity, human identity. |

---

## Governance Terms

| Term | Definition |
|------|-----------|
| **Adaptive Gate** | A governance gate whose activation frequency adjusts based on trust level. Relaxes as trust grows. Used for routine quality checks, optional reviews. |
| **Mandatory Gate** | A governance gate that always fires regardless of trust level. Used for regulatory requirements, irreversible actions, legal compliance. Trust Ladders cannot affect mandatory gates. |
| **Policy** | Governance rules that require human authorization to change: access control, mandatory gates, compliance constraints, data classification rules. Ring 3 cannot change policy — only recommend changes. |
| **Configuration** | Tunable parameters that Ring 3 can adjust within governance boundaries: quality thresholds, verification intensity, trust levels, iteration budgets, context priorities. |
| **Trust Level** | An agent's current earned autonomy. Determines which adaptive controls fire. Calibrated empirically from execution data. Builds slowly, degrades fast. |
| **Trust Promotion** | Increase in trust level based on sustained positive performance across multiple signals. May require governance sign-off for critical systems. |
| **Trust Demotion** | Decrease in trust level triggered by anomaly, failure, or configuration change. Immediate (not periodic). |
| **Sentinel** | Fast-path anomaly detector. Fires in near-real-time on known patterns. Triggers immediate trust demotion, quarantine, or Response Bus containment. |

---

## Risk Classification

| Term | Definition |
|------|-----------|
| **Tier 1: Low** | Minimal consequence of error. Ring 0 + minimal Ring 1. Internal productivity tools, personal agents. |
| **Tier 2: Medium** | Business impact, some irreversible actions. Ring 0 + Ring 1 + adaptive Ring 2 gates. Customer-facing agents, workflow automation. |
| **Tier 3: High** | Regulatory violation, significant harm. All four rings, mandatory gates. Regulated decisions, financial transactions, healthcare. EU AI Act high-risk → minimum Tier 3. |
| **Tier 4: Critical** | Irreversible harm, legal liability, public impact. All rings + enhanced monitoring + continuous red-teaming. Autonomous systems with irreversible real-world impact. |

---

## Agent Environment Terms

| Term | Definition |
|------|-----------|
| **5-Layer Environment Stack** | The governed operating substrate: L1 (Identity & Policy) → L2 (Instruction Architecture) → L3 (Capability Set) → L4 (Retrieved Context) → L5 (Session State). Composed bottom-up. |
| **Trust Boundary** | The line between L2 (human-authored, version-controlled, trusted) and L3 (dynamic, runtime-composed, untrusted). Security Fabric enforces this boundary. |
| **Environment Optimization Loop** | Governed self-improving cycle: Observe → Identify gaps → Propose improvements → Validate (Ring 2 + #18) → Deploy with rollback. The loop proposes; governance decides. |
| **Optimizable** | Environment aspects Ring 3 can propose changes to: context priorities, tool descriptions, session policy, instruction formatting. |
| **Inviolable** | Environment aspects Ring 3 cannot change: governance policy, authorization boundaries, security constraints, identity substrate. Requires human authorization. |

---

## Observability Terms

| Term | Definition |
|------|-----------|
| **Event Envelope** | The standard schema for every material agent action: event_id, timestamp, identity context, action context, governance context, quality context, correlation context. The atomic unit of observability. |
| **Three Detection Domains** | Quality detection (is the system producing correct outputs?), security detection (is the system under adversarial pressure?), governance detection (is the system operating within policy?). Fed from one unified event stream. |
| **Correlation Engine** | Consumes the event stream and applies versioned rules across the three detection domains. Detects patterns that individual events don't reveal. |
| **Dual-Speed Detection** | Fast path (sentinels): sub-second, known-pattern response. Slow path (analysis): hours–days, behavioral drift, trend detection. |
| **Forensic Package** | Investigation artifact: event timeline, provenance walkback, identity trace, behavioral comparison, impact assessment. Itself a governed artifact. |

---

## Decision Intelligence Terms

| Term | Definition |
|------|-----------|
| **Risk Decision Graph (RDG)** | Case-bound reasoning substrate. Contains: entities, claims, evidence, beliefs, policy tests, scenarios, decision options, final decision, approval. Not a generic knowledge graph — case-bound first. |
| **Claim** | An assertion about a fact. "This system processes PII." Produced by agents, grounded in evidence. |
| **Belief** | The governed stance toward a claim. States: unknown → under_review → plausible → provisionally_accepted → accepted. Also: contested, insufficient_evidence, rejected, stale, superseded. |
| **Revision Cascade** | When new evidence arrives: linked claims updated → beliefs re-evaluated → policy tests re-run → decision options re-evaluated → review trigger if thresholds crossed. Ring 2 issues REVISE(context) back to Ring 0. |
| **Challenger Agent** | Ring 1 agent with structural mandate to find flaws. Produces counterclaims, gaps, contradictions. Cannot be silently bypassed — invocation is an auditable event. |
| **Decision Memo** | Human-readable export of the full decision: case summary, entities, claims, evidence, beliefs, policy tests, decision options, final decision, conditions, approvers. Derived from provenance chain. |

---

## Composition Patterns

Progressive governance architectures built from primitives:

| Pattern | Definition | Primitives |
|---------|-----------|-----------|
| **Minimum Viable Control** | The absolute floor for any consequential agent. Scope, identity, audit trail, visibility. | #7, #14, #6, #10, #19 (minimal) |
| **Validation Pipeline** | Verified outputs before release. Ring 0 + Ring 1. | MVC + #1, #2, #5, #13 |
| **Governed Decision Flow** | Policy-evaluated, human-gateable decisions. Ring 0 + Ring 1 + Ring 2. | Validation Pipeline + #8, #9, #16, #17 |
| **Secure Governed System** | Defense in depth, pre-deployment validation. All rings + zero trust. | GDF + #15, #18, #11 |
| **Full Governed Agentic System** | Everything. All rings, all primitives, zero trust, environment optimization. | All 19 primitives |

---

## Confidence Levels

Used throughout the framework to mark certainty:

| Level | Definition | Examples |
|-------|-----------|----------|
| **Established pattern** | Proven across multiple domains. Strong evidence. We are connecting existing patterns to the agentic context. | Separation of duties, least privilege, audit trails, zero trust |
| **Informed proposal** | Based on our synthesis, not yet battle-tested at scale in agentic systems. We believe these are right but welcome challenge. | Rings Model, three-level security architecture, Security Response Bus |
| **Open question** | We genuinely don't have great answers yet. | Semantic goal-state attestation, cross-system trust federation, optimal oversight patterns |

---

## Standards Abbreviations

| Abbreviation | Full Name |
|-------------|-----------|
| **AGF** | Agentic Governance Framework |
| **ASI** | OWASP Agentic Security Issues (Top 10 for Agentic Applications) |
| **ATF** | CSA Agentic Trust Framework |
| **EU AI Act** | Regulation (EU) 2024/1689 — Artificial Intelligence Act |
| **IMDA MGF** | Singapore IMDA Model AI Governance Framework for Agentic AI (Jan 2026) |
| **IR 8596** | NIST Cybersecurity Framework Profile for AI (Cyber AI Profile) |
| **MAESTRO** | CSA Multi-Agent Environment Security Threat and Risk Operations (7-layer threat model) |
| **MCP** | Model Context Protocol — de facto standard for agent-tool integration |
| **A2A** | Agent-to-Agent Protocol — inter-agent communication standard |
| **MITRE ATLAS** | Adversarial Threat Landscape for AI Systems — AI adversarial threat taxonomy |
| **NCCoE** | NIST National Cybersecurity Center of Excellence |
| **NGAC** | Next-Generation Access Control |
| **OTel** | OpenTelemetry |
| **RDG** | Risk Decision Graph |
| **SPIFFE/SPIRE** | Secure Production Identity Framework for Everyone / SPIFFE Runtime Environment |

---

*This vocabulary is canonical for all AGF documents. When terminology conflicts between documents, update the conflicting document to match this vocabulary.*
