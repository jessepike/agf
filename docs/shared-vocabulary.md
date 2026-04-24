# AGF Shared Vocabulary

**Last updated:** 2026-04-24

This document defines the canonical terms used across all AGF documents — the reference architecture, primitives catalog, domain profiles, capability layer docs, and white papers. When terminology conflicts between documents, this vocabulary is authoritative.

---

## Positioning Terms

These define AGF's position in the broader governance landscape. Introduced in DECISIONS.md #3 (AGF Positioning Pillars) and #4 (Seven-Layer Stack).

| Term | Definition |
|------|-----------|
| **Agentic Governance** | AGF's category. The governance of systems with agency, autonomy, memory, tool use, and inter-agent collaboration. Narrower than AI governance; distinct from responsible AI (upstream) and ML governance (training-time). |
| **Four verbs** | What AGF does, in causal order: **Synthesizes** (pulls from NIST, OWASP, CSA, ISO, Microsoft, EU AI Act, academic research), **Unifies** (places synthesis on a shared architectural substrate), **Prescribes** (converts synthesis into actionable implementation pathways per primitive), **Operationalizes** (emits machine-readable artifacts so agents consume governance programmatically). |
| **OTAA invariant** | Every AGF primitive MUST be **Observable** (runtime state externally visible), **Traceable** (every action links to principal, authorization basis, delegation chain), **Auditable** (evidence meets regulator/auditor requirements), **Agent-operable** (machine-readable form exists alongside human-readable form). A primitive that fails any OTAA property is not shipped. |
| **Agent-operable** | A property of governance artifacts: a machine-readable form exists that agents can parse, interpret, and act on programmatically, alongside the human-readable form. Part of the OTAA invariant. |
| **Dual-form principle** | "Machine-consumable, human-decidable." Every AGF primitive exists in two forms simultaneously — human (markdown prose, diagrams, rationale) and machine (JSON/YAML schema with control mappings, MUST/SHOULD/MAY requirements, evidence schemas, test criteria). Same truth, two audiences. Load-bearing at gate boundaries — every gate decision emits both forms. |
| **Tempo taxonomy** | Three governance speeds: **Wire-speed enforcement** (<1 ms, deterministic policy/identity/tool allowlists/sandbox boundaries — R0/R1), **Near-realtime supervision** (sec–min, behavioral anomaly, trust scoring, revocation — R1/R2), **Human-speed governance** (hours–weeks, promotion reviews, post-mortems, policy revision — R2/R3). Governance infrastructure must support all three and hand off cleanly. |
| **Wire-speed** | Sub-millisecond governance enforcement. The tempo at which R0/R1 controls operate — identity verification, tool allowlists, policy evaluation, sandbox boundaries. Deterministic, not LLM-evaluative. |
| **Seven-layer stack** | AGF's model of how governance artifacts compose. Layer 0 = AGF substrate (Rings + Primitives + deployment modes + security model + tensions + OTAA). Layer 1 = OWASP Agentic Top 10. Layer 2 = CSA MAESTRO + Microsoft Failure Mode Taxonomy. Layer 3 = control catalogs (AICM, ISO 42001/27001, NIST 800-53, EU AI Act, BSI AIC4). Layer 4 = CSA ATF. Layer 5 = runtime references (Microsoft AGT + CAF + Agent 365). Layer 6 (orthogonal) = risk quantification (FAIR, FAIR-CAM, ISO 31000, NIST AI RMF Measure). |
| **NIST CSF parallel** | "AGF's Rings are to agentic governance what NIST CSF Functions are to cybersecurity" — a simple human-comprehensible top layer that unfolds into progressively detailed, machine-actionable primitives. |
| **Architectural substrate** | AGF's position at Layer 0 of the seven-layer stack. The shared vocabulary and architectural model onto which all other governance layers project. |

---

## Harness Terms

Introduced in DECISIONS.md #7. The agent harness is the governance envelope around an AI agent.

| Term | Definition |
|------|-----------|
| **Harness** | The governance envelope around an AI agent — declarative source artifacts (intent, constraints, capabilities, policy, evaluation criteria) plus the runtime enforcement adapters that translate them into deterministic controls at call time. Captures "everything that governs the agent except the model itself." Exists in two inseparable forms: source (versioned, reviewable, portable) and runtime (SDK-specific adapter hooks). Industry formula: `Agent = Model + Harness`. |
| **Tier 0 — Provider Harness** | Model-level safety from the foundation vendor. Precondition, not a security layer AGF controls. |
| **Tier 1 — Agent Harness** | Per-agent governance envelope. Declarative source plus runtime adapter hooks enforcing tool allowlists, path restrictions, budget limits, output schemas, and audit logging. Maps to AGF Security Fabric. |
| **Tier 2 — Orchestration Harness** | Cross-agent ACL enforcement, inheritance validation (child ⊆ parent), inter-agent communication. Maps to AGF Security Governance. |
| **Source → Build → Runtime** | The canonical harness workflow. Source artifacts (YAML + Markdown) → `harness build` generates runtime configuration → SDK adapters enforce at call time. Analogous to Terraform (`.tf` → `plan` → `apply`). |
| **Hard constraint** | A harness-declared constraint that is mechanically enforced at runtime and never relaxes. Fits AGF's mandatory-gate category. |
| **Adaptive constraint** | A harness-declared constraint that is mechanically enforced but whose enforcement intensity is trust-dependent. Fits AGF's adaptive-gate category; interacts with Trust Ladders (Primitive #11). |
| **Behavioral rule** | A harness-declared instruction embedded in agent prose (agent.md). Not mechanically enforceable — can be skipped under friction. Not citable as a security control. |
| **Governance Decision Record (GDR)** | A standard audit artifact capturing a governed decision: inputs, context, decision, conditions, approver, expiry. Produced by tool authorization, trust level changes, governance gate outcomes, constraint overrides, and escalation resolutions. |

**Harness is not to be confused with:**

- **Wrapper** — one of AGF's three deployment modes; a specific runtime interception pattern. A Tier 1 harness may be implemented *via* the wrapper deployment mode, but harness is broader than any single deployment mode.
- **Hypervisor** — AGT-specific runtime isolation kernel implementing CPU-style privilege rings (Root / Trusted / Standard / Sandbox). Hypervisors are a runtime mechanism harnesses can target; harnesses specify policy, hypervisors enforce execution isolation.
- **Test harness** (classical software engineering) — a test execution framework (stubs, drivers, input data, expected results). Agent harnesses include test harnesses as a component (eval suites, policy test harnesses) but are substantially broader.

---

## Maturity Terms

Introduced in DECISIONS.md #6.

| Term | Definition |
|------|-----------|
| **L1: Non-existent** | Agents deployed but no formal governance process exists. No inventory, no classification, no governance artifacts. Most organizations with agents in production today. |
| **L2: Foundation** | Agent inventory maintained; agents classified by risk tier; Ring 0 + Ring 1 operational for high-risk agents; event capture; policy rules for critical domains. |
| **L3: Governed** | Full R0 + R1 + R2 operational; Agentic Observability at correlation level; Trust Ladders calibrating; audit packages producible on demand. |
| **L4: Adaptive** | Ring 3 (Learning) operational; self-improving cycles; predictive quality and security monitoring; governance overhead decreasing as the system matures. |
| **L5: Optimized** | Full framework across all agent types; continuous assurance; governance as competitive advantage; cross-organizational intelligence. |
| **Program maturity (AGF L1–L5)** | An organization's AGF governance posture across the full framework. Complementary to ATF's per-deployment tiers. |
| **Deployment autonomy tier (ATF Intern/Junior/Senior/Principal)** | CSA Agentic Trust Framework's per-deployment autonomy-posture scale with explicit promotion gates (Performance, Security Validation, Business Value, Incident Record, Governance Sign-off). Complementary to AGF's program-level maturity. |

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

## Gate Vocabulary

AGF's gate-related vocabularies form a four-part vocabulary of distinct, scoped enums. They are NOT alternative spellings of one concept. See `DECISIONS.md` #8 (Gate Vocabulary Disambiguation).

| Term | Definition |
|------|-----------|
| **Gate Boundary** | Where a Gate Resolution or Domain Outcome occurs. Dual-form (DECISIONS.md #5) and GDR emission (#9) are required at every gate boundary. |
| **Ring Control Signal** | The Composability Interface enum: `PASS / REVISE / HALT / GATE / DELEGATE / ERROR`. How primitives in adjacent rings signal each other. Defined in `docs/agentic-primitives.md` Composability Interface section. Emits observability events (see Primitive #10), not GDRs. |
| **Gate Resolution** | The Primitive #8 (Governance Gates) enum: `APPROVE / REJECT / MODIFY / DEFER / ESCALATE`. The authorizer's response when a gate fires. Also the return value of the `GATE` Ring Control Signal. Emits a GDR. |
| **Domain Outcome** | Domain-specific gate decision enums. Each domain application defines its own outcome vocabulary that maps onto Gate Resolutions. Tool Gate's `Authorized / Conditionally Authorized / Denied` is the first reference application. Emits a GDR. |
| **Governance Decision Record (GDR)** | AGF's canonical audit artifact at gate boundaries. A single record format that serializes any Gate Resolution or Domain Outcome into an auditable record. See `docs/governance-decision-record.md`. |

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

## Governance: Five Distinct Senses

The word "governance" carries at least five distinct senses across AGF material. Qualifiers are required whenever any sense other than #1 is meant. Bare "governance" as a noun is reserved for sense #1 (the framework) or deliberate adjectival use ("governance posture") covering multiple senses at once. See DECISIONS.md #10.

| Sense | Canonical qualified form | Example |
|-------|-------------------------|---------|
| 1. The framework | **AGF** (never "governance" alone) | "AGF synthesizes NIST, OWASP, CSA…" |
| 2. Ring 2 | **the Governance ring** or **Ring 2** | "Ring 2 (Governance) evaluates policy before release." |
| 3. Program maturity (AGF L1–L5) | **AGF program maturity** (retires "program-level governance") | "The organization's AGF program maturity is L2 Foundation." |
| 4. Primitive #8 gates | **Governance Gates** (capitalized) | "Governance Gates fire when a release requires authorization." |
| 5. NIST CSF Govern function | **NIST CSF Govern** (always prefixed) | "AGF's Ring 2 aligns to NIST CSF Govern at program scope." |

Editorial rule: when "governance" appears as a standalone noun, identify which sense is meant and replace with the qualified form unless sense #1 is clearly intended or the adjectival use is deliberate.

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

## Observability: Three Distinct Layers

"Observability" appears in three places in AGF. The three are not synonyms — they compose. See DECISIONS.md #10.

| Layer | Canonical name | Role |
|-------|---------------|------|
| Emission | **Primitive #10 — Event-Driven Observability** | Fabric primitive. Every ring emits structured events through a canonical envelope. The mechanism. |
| Concept | **Agentic Observability** | Unified correlation layer. One event stream, three detection perspectives (quality, security, governance). Consumes Primitive #10's events. |
| Profile | **Observability Profile** | Role-based implementation guide for observability engineers and SREs. Applies both layers above. |

Rule: Primitive #10 emits. Agentic Observability correlates. The Profile implements. On first appearance in any doc, use the fully qualified name; later references may drop qualifiers only when the sense is unambiguous from local context.

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

Four progressive governance architectures built from primitives. Canonical count: **four**. See DECISIONS.md #10 (a). Prior "Phase 1–5" language on the Rings Model page and any fifth-pattern references ("Secure Governed System") are retired — use the pattern names. Ring activation is a consequence of pattern selection, not a parallel axis.

| Pattern | Definition | Primitives |
|---------|-----------|-----------|
| **Minimum Viable Control** | The absolute floor for any consequential agent. Scope, identity, audit trail, visibility. Ring 0 + Fabric (minimal). | #7, #14, #6, #10, #19 (minimal) |
| **Validation Pipeline** | Verified outputs before release. Adds Ring 1. | MVC + #1, #2, #5, #13 |
| **Governed Decision Flow** | Policy-evaluated, human-gateable decisions with side-effect management. Adds Ring 2. Mandatory gates always fire; adaptive gates relax as trust builds. | Validation Pipeline + #8, #9, #16, #17 |
| **Full Governed Agentic System** | All rings active, zero trust at every boundary, Ring 3 self-improvement proposing within governance boundaries, environment optimization loop. The complete architecture. | All 19 primitives |

### Hardening posture (modifier, not a named pattern)

Between Governed Decision Flow and Full Governed Agentic System sits a real architectural distinction: a system can be production-hardened with defense-in-depth, pre-deployment assurance, and trust calibration **before** Ring 3 learning is enabled. That hardening posture is:

- **Adversarial Robustness (#15)** — defense in depth, assume breach
- **Evaluation & Assurance (#18)** — pre-deployment validation, the gate before the gate
- **Trust Ladders (#11)** — earned autonomy, not granted by default

This is a **posture applied within Governed Decision Flow** — or as a precondition for entering Full Governed — not a fifth named pattern. The distinction is substantive; naming it as a peer of MVC/Validation Pipeline/GDF/Full Governed was redundant (it's "Full Governed minus Ring 3 learning") and worsened naming density without adding architectural distinction. Express as posture language in prose: "a production-hardened Governed Decision Flow applying #11/#15/#18"; never as a named step in the progression.

Most regulated enterprise deployments live in this posture on top of GDF, whether or not they ever enable Ring 3.

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
| **AGT** | Microsoft Agent Governance Toolkit (MIT-licensed runtime reference) |
| **AICM** | CSA AI Controls Matrix (control catalog) |
| **ASI** | OWASP Agentic Security Issues (Top 10 for Agentic Applications) |
| **ATF** | CSA Agentic Trust Framework |
| **BSI AIC4** | Germany's AI cloud service compliance criteria catalogue |
| **CAF** | Azure Cloud Adoption Framework for AI Agents |
| **EU AI Act** | Regulation (EU) 2024/1689 — Artificial Intelligence Act |
| **FAIR** | Factor Analysis of Information Risk (Jack Jones, 2005) |
| **FAIR-CAM** | FAIR Controls Analytics Model — quantifies control effectiveness |
| **IMDA MGF** | Singapore IMDA Model AI Governance Framework for Agentic AI (Jan 2026) |
| **IR 8596** | NIST Cybersecurity Framework Profile for AI (Cyber AI Profile) |
| **MAESTRO** | CSA Multi-Agent Environment Security Threat and Risk Operations (7-layer threat model) |
| **MCP** | Model Context Protocol — de facto standard for agent-tool integration |
| **A2A** | Agent-to-Agent Protocol — inter-agent communication standard |
| **MITRE ATLAS** | Adversarial Threat Landscape for AI Systems — AI adversarial threat taxonomy |
| **NCCoE** | NIST National Cybersecurity Center of Excellence |
| **NGAC** | Next-Generation Access Control |
| **OTAA** | Observable / Traceable / Auditable / Agent-operable — AGF's primitive quality invariant |
| **OTel** | OpenTelemetry |
| **RDG** | Risk Decision Graph |
| **SPIFFE/SPIRE** | Secure Production Identity Framework for Everyone / SPIFFE Runtime Environment |

---

## Identity & Credentialing Terms

Terms drawn from CSA Agentic IAM and related identity papers. Used across Primitive #14 (Identity & Attribution) and the security profile.

| Term | Definition |
|------|-----------|
| **Agent ID** | An authenticated, inspectable identity assigned to a specific agent instance or deployment. Used for attribution, authorization, audit, and revocation. |
| **NHI** | Non-Human Identity. The identity category covering agents, workloads, service accounts, and automation — distinct from human user identity. |
| **DID** | Decentralized Identifier. W3C-standard identifier format for verifiable identity independent of any centralized registry. Common forms: `did:web`, `did:key`, `did:plc`. |
| **VC** | Verifiable Credential. W3C-standard format for issuer-signed claims about a subject. Used to assert capabilities, roles, or attributes about an agent. |
| **ZKP** | Zero-Knowledge Proof. Cryptographic proof that a statement is true without revealing the underlying data. Applied to privacy-preserving credential validation. |
| **ANS** | Agent Naming Service. Proposed registry pattern analogous to DNS for naming and resolving agent identities across organizational boundaries. |
| **JIT / Ephemeral Credentials** | Just-In-Time credentials issued at the moment of need with short TTLs and narrow scope. Reduces blast radius compared to long-lived credentials. |
| **PBAC** | Policy-Based Access Control. Authorization model where access decisions evaluate against expressive policy rules at runtime, rather than static role-permission mappings. |
| **Behavioral Attestation** | Continuous verification that an agent's runtime behavior matches its declared profile. Deviation triggers re-authentication, demotion, or quarantine. |
| **Authenticated Delegation** | A pattern where an agent acts on behalf of a user (or another agent) with the delegation chain cryptographically verifiable. OAuth 2.1 extensions (e.g., `requested_actor` / `actor_token`) are one implementation. |
| **Confused Deputy (agentic)** | An attack pattern where a more-privileged agent is tricked into performing an action on behalf of a less-privileged caller. Classical confused-deputy extended to agent-to-agent scenarios. |
| **Agent Registry** | Centralized or federated catalog of agents in an environment, with metadata (owner, capabilities, trust level, lifecycle state). Foundation for discovery, governance, and revocation. |
| **XPIA** | Cross-Prompt Injection Attack. Injection via untrusted content (retrieved documents, tool output) rather than direct user input. Agentic-specific attack class. |
| **Agent Hijacking** | An attack pattern where an adversary takes control of an agent's decision-making loop via prompt manipulation, memory poisoning, or tool-output tampering. |

---

## Governance Program Terms

| Term | Definition |
|------|-----------|
| **Frontier Governance** | The governance posture required for frontier-capability AI systems — systems at the capability edge where established evaluation methods may not yet apply. Typically implies enhanced Ring 3 (Learning), continuous red-teaming, and accelerated evidence collection. |
| **AI CoE** | AI Center of Excellence. An organizational pattern where AI governance, platform, and engineering expertise is centralized as a cross-functional unit supporting distributed teams. Often the institutional owner of an organization's AGF implementation. |

---

*This vocabulary is canonical for all AGF documents. When terminology conflicts between documents, update the conflicting document to match this vocabulary.*
