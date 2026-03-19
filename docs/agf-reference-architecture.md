# AGF: A Reference Architecture for Governed Agentic Systems

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Status:** Living document — entry point for the AGF reference architecture
**Terminology:** [Shared Vocabulary](shared-vocabulary.md)

---

## Contents

1. [Why This Exists](#why-this-exists)
2. [Core Concepts](#core-concepts)
3. [How It Fits Together](#how-it-fits-together)
4. [Who Uses What](#who-uses-what)
5. [Standards & Regulatory Alignment](#standards--regulatory-alignment)
6. [Prior Art & Positioning](#prior-art--positioning)
7. [Where to Go Next](#where-to-go-next)

---

## Why This Exists

Agentic systems are proliferating faster than the architectural patterns to govern them.

Organizations are deploying autonomous agents — coding assistants, ops automation, customer-facing chatbots, decision-support systems, multi-agent workflows — at an extraordinary pace. Most deployments today are brittle. They work in demos but fail under scrutiny because they lack the structural primitives that make automated action trustworthy, auditable, and improvable.

The governance landscape is fragmented. NIST provides risk management frameworks. OWASP provides threat taxonomies. The Cloud Security Alliance provides trust frameworks. ISO provides management systems. OpenTelemetry provides observability standards. The EU AI Act provides regulatory requirements. Singapore published the world's first government agentic governance framework. Model providers ship their own governance features. Enterprise platforms build their own control planes. Security vendors build point solutions.

**Every one of these institutions is doing critical work. These are the dots.** The puzzle pieces are on the table.

The Agentic Governance Framework (AGF) connects those dots. We synthesize the best thinking from standards bodies, government frameworks, security organizations, academic researchers, and industry practitioners into a single coherent reference architecture that shows organizations how to build agentic systems that are safe, secure, reliable, auditable, and observable.

We are not claiming to have invented new governance concepts. The patterns in this framework — separation of duties, least privilege, audit trails, zero trust, policy as code — are battle-tested across distributed systems, security engineering, compliance, and control theory. They have governed critical infrastructure for decades. **The contribution is the composition:** pulling these patterns together, naming them for the agentic context, showing where they conflict, and proposing how to resolve those conflicts.

This is a living framework, not a monument. Where our understanding evolves — because new research emerges, new technologies shift the landscape, or community feedback challenges our assumptions — we will update this work. We lead with humility, lead with rigor, and serve the community.

### A Declared Architectural Constraint

This framework is built on an honest assessment of oversight's limitations.

Research demonstrates that oversight efficacy degrades as the capability gap between overseer and system increases (Engels et al., "Scaling Laws For Scalable Oversight," NeurIPS 2025). As agentic systems grow more capable, overseers — whether human or AI — face a widening gap. AGF does not pretend that oversight alone solves the governance problem. It is why we invest in structural guarantees — verification layers, automated policy enforcement, containment mechanisms — that function whether or not the overseer catches every issue.

The design position: build the architecture so that governance works *with* oversight, not *only because of* oversight.

---

## Core Concepts

AGF is built on four foundational ideas: the Rings Model, the 19 Primitives, the Three-Level Security Model, and three Deployment Modes. Together, they form a composable architecture that adapts to any agentic system — from a personal coding assistant to a fleet of enterprise agents making consequential decisions.

### The Rings Model

The Rings Model is AGF's central architectural contribution. It is a vendor-neutral logical architecture that organizes governance into four concentric rings plus a cross-cutting fabric and an environment substrate:

```
┌───────────────────────────────────────────────────────────┐
│  Ring 3 — Learning                                        │
│  Self-improvement, memory, trust calibration              │
│  Time horizon: days/weeks (slow) + real-time (sentinels)  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Ring 2 — Governance                              │    │
│  │  Policy gates, provenance, authorization          │    │
│  │  Time horizon: minutes/hours                      │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐    │    │
│  │  │  Ring 1 — Verification                    │    │    │
│  │  │  Validation loops, critique, review       │    │    │
│  │  │  Time horizon: seconds/minutes            │    │    │
│  │  │                                           │    │    │
│  │  │  ┌───────────────────────────────────┐    │    │    │
│  │  │  │  Ring 0 — Core Execution          │    │    │    │
│  │  │  │  Agent domain logic, output       │    │    │    │
│  │  │  │  Time horizon: ms/minutes         │    │    │    │
│  │  │  └───────────────────────────────────┘    │    │    │
│  │  │         ↕ REVISE(quality)                 │    │    │
│  │  └───────────────────────────────────────────┘    │    │
│  │         ↕ REVISE(context) ↓ PASS ↓ HALT ↓ GATE   │    │
│  └───────────────────────────────────────────────────┘    │
│                                                           │
│  ════════════════════════════════════════════════════════  │
│  Fabric: Events + Structured Output + Error Recovery      │
│  Security Fabric: Identity + Containment + Attestation    │
├───────────────────────────────────────────────────────────┤
│  Environment Substrate (#19)                              │
│  Context + Instructions + Capabilities + Workspace        │
└───────────────────────────────────────────────────────────┘
```

**Ring 0 — Execution.** The core agent performs its domain task: generates text, writes code, makes a recommendation, executes an action. Ring 0 is where the work happens. Without governance, this is all there is.

**Ring 1 — Verification.** A separate process evaluates Ring 0's output against quality criteria. The fundamental principle: *the agent that creates output must not be the sole agent that validates it.* Verification can loop — sending output back to Ring 0 for revision until it converges. This is the first structural guarantee.

**Ring 2 — Governance.** Policy evaluation and authorization. Ring 2 determines whether a verified output should be released, using explicit governance rules (Policy as Code), human-reviewable gates, and organizational policy. Ring 2 can pause execution indefinitely for human review. It is the decision authority.

**Ring 3 — Learning.** The system improves over time. Ring 3 observes execution patterns, calibrates trust levels, tunes verification thresholds, and proposes configuration changes. Critically, Ring 3 proposes — it does not autonomously enact changes. All Ring 3 proposals pass through Ring 2 governance and Evaluation & Assurance (#18) before deployment. The system can suggest governance changes; it cannot make them.

**The Fabric.** Cross-cutting infrastructure that makes the rings composable: structured output persistence (data contracts between rings), event-driven observability (the shared nervous system), error handling and recovery (safety net), and identity verification at every ring boundary (zero trust posture).

**The Environment Substrate (#19).** Every agent — in every ring — operates within an environment: context, instructions, tools, workspace, memory. Agent Environment Governance ensures this operating substrate is composed by policy, scoped by least privilege, and continuously optimized through a governed learning loop. Context is simultaneously the primary optimization target and the primary attack surface.

**The key insight:** The ring diagram above depicts one deployment mode (wrapper). The rings are a *logical* architecture. How they manifest physically depends on the system type — see [Deployment Modes](#deployment-modes) below.

### The 19 Primitives

AGF defines 19 named patterns for governed agentic systems, organized into three categories:

**Runtime Primitives (#1–#17)** — operate within or across the ring pipeline during agent execution:

| # | Primitive | Ring | One-Line Description |
|---|-----------|------|---------------------|
| 1 | Separation of Producer & Verifier | 0+1 | The agent that creates output must not be the sole agent that validates it |
| 2 | Validation Loops with Convergence Gates | 1 | Iterative verification until quality thresholds are met or budget is exhausted |
| 3 | Self-Improving Cycles | 3 | The system gets better by learning from its own execution |
| 4 | Adversarial Critique | 1 | Dedicated challenger that actively tries to find flaws |
| 5 | Structured Output Persistence | Fabric | Every ring produces and consumes structured artifacts — the data contract |
| 6 | Provenance Chains | Fabric | Every output carries its full decision history |
| 7 | Bounded Agency | 2 | Agents operate within explicit, enforced boundaries |
| 8 | Governance Gates | 2 | Explicit decision points where execution pauses for authorization |
| 9 | Policy as Code | 2 | Governance rules as versioned, executable, testable objects |
| 10 | Event-Driven Observability | Fabric | Every ring emits structured events — the shared nervous system |
| 11 | Trust Ladders | 2+3 | Trust is earned through demonstrated performance, not granted by default |
| 12 | Memory-Augmented Reasoning | 0+3 | Agents reason with persistent memory, not just immediate context |
| 13 | Error Handling & Recovery | Fabric | Graceful degradation, checkpointing, compensation |
| 14 | Identity & Attribution | Fabric | Every agent has authenticated, inspectable identity |
| 15 | Adversarial Robustness | Security | Assume breach. Defense in depth. Verify explicitly. |
| 16 | Transaction & Side-Effect Control | 0+2 | Pre-commit/commit/post-commit for irreversible actions |
| 17 | Data Governance & Confidentiality | 2+Fabric | Classification, consent, PII, lineage, retention at every data flow |

**Lifecycle Primitive (#18)** — operates outside the runtime pipeline:

| # | Primitive | Scope | One-Line Description |
|---|-----------|-------|---------------------|
| 18 | Evaluation & Assurance | Pre-deployment | The gate before the gate — validates configurations before they reach production |

**Substrate Primitive (#19)** — governs the operating environment beneath all rings:

| # | Primitive | Scope | One-Line Description |
|---|-----------|-------|---------------------|
| 19 | Agent Environment Governance | All rings | Governed composition of context, instructions, tools, workspace, and memory |

These primitives are not new inventions — they are named, not coined. Every pattern is established across multiple domains. The contribution is pulling them together into a composable architecture for the agentic context.

### The Three-Level Security Model

Security in governed agentic systems is not a ring, not a layer, and not a feature. It is a **pervasive architectural concern** that operates simultaneously at every level:

**Level 1: Security Fabric — Enforcement.** Always active, synchronous, wire-speed. Input sanitization, output scanning, runtime containment, identity verification at every ring boundary, configuration integrity attestation. The fabric does not make semantic judgments — it enforces mechanical constraints.

**Level 2: Security Governance — Policy Evaluation.** Access control policy, data classification, irreversible-action authorization, supply chain trust, semantic security evaluation. Security policy lives in Ring 2, evaluated by Policy as Code (#9), enforced through Governance Gates (#8).

**Level 3: Security Intelligence — Detection.** Behavioral anomaly detection, cross-pipeline correlation, memory introspection, human-agent interaction analysis. Dual-speed: fast-path sentinels (sub-second) for known patterns, slow-path analysis (hours-days) for behavioral drift.

**The Security Response Bus** connects Intelligence to Fabric with a pre-authorized fast-path, bypassing normal governance deliberation for defined threat classes. When Intelligence detects a known attack pattern, it triggers containment directly — because multi-agent attacks cascade in seconds, and full governance deliberation takes minutes.

### Deployment Modes

The Rings Model is a logical architecture. How the rings manifest physically depends on the system type:

**Wrapper Mode.** The rings literally wrap execution. Ring 0 produces → Ring 1 verifies → Ring 2 governs → output releases. Sequential, clean audit trail, highest governance clarity. Best for: batch pipelines, document processing, regulatory workflows. Example: AI risk assessment pipeline.

**Middleware / Interrupt Mode.** Ring logic fires at specific decision points within an execution graph — tool calls, data access, state mutations. The agent executes continuously; the rings intercept at defined boundaries. Best for: coding agents, ops automation, multi-step task agents. The Model Context Protocol (MCP) is the canonical implementation — each tool call is a natural interrupt point. Example: Claude Code, Cursor, Devin-style coding agents.

**Graph-Embedded Mode.** Verification, governance, and security run concurrently with execution. Speculative execution with a release gate that blocks output until all signals pass. Lowest latency, most complex audit trail. Best for: conversational agents, voice assistants, real-time systems. Example: ChatGPT-style conversational agents.

**Hybrid deployment** is common. A coding agent operates in middleware mode overall, but within a single response, the generation pipeline uses graph-embedded mode for parallel output verification.

The Mode Selection Matrix (in the Platform Profile) provides a 10-row decision tool for choosing the right mode based on system characteristics: output type, latency tolerance, governance intensity, regulatory requirements, side-effect profile, protocol integration, rollback needs, observability maturity, and concurrent load.

---

## How It Fits Together

### Composition Patterns

The primitives compose into progressively more governed architectures:

**Minimum Viable Control** — The floor for any consequential agent system:
- Bounded Agency (#7) + Identity (#14) + Provenance (#6) + Observability (#10) + Environment Governance (#19, minimal)
- What it gives you: agents that can't exceed their scope, actions that are attributable, an audit trail, and scoped operating environments

**Validation Pipeline** (Ring 0 + Ring 1):
- Minimum Viable Control + Separation of Producer/Verifier (#1) + Validation Loops (#2) + Structured Output (#5)
- What it gives you: verified outputs before release

**Governed Decision Flow** (Ring 0 + Ring 1 + Ring 2):
- Validation Pipeline + Governance Gates (#8) + Policy as Code (#9) + Transaction Control (#16)
- What it gives you: policy-evaluated, human-gateable decisions with side-effect management

**Full Governed Agentic System** (All rings, all primitives, zero trust):
- Every ring active, every primitive engaged, zero trust at every boundary, environment optimization loop improving the substrate continuously
- What it gives you: the complete governance architecture for high-stakes, regulated, enterprise-grade agentic systems

Organizations start with Minimum Viable Control and grow toward Full Governed as stakes, scale, and regulatory requirements demand it. This is not a binary choice — it is a maturity continuum.

### The Self-Improving Loop

AGF is designed to get better over time:

1. **Ring 3 observes** execution patterns across all rings
2. **Ring 3 proposes** improvements — better prompts, tighter thresholds, calibrated trust levels, optimized environment configurations
3. **Ring 2 validates** — governance evaluates whether the proposed change stays within policy
4. **Evaluation & Assurance (#18) tests** — regression suites verify the change doesn't degrade known-good behaviors
5. **The change deploys** — with staged rollout and monitoring

This loop applies to both pipeline performance (Ring 3 improves how agents produce outputs) and the agent operating environment (Ring 3 improves context composition, instruction architecture, and tool provisioning through Agent Environment Governance #19).

**The invariant:** The system can suggest governance changes. It cannot enact them autonomously. The self-improving loop proposes; governance decides.

### Cost of Governance

Every ring adds cost. AGF is designed for proportional activation:

- **Low-stakes task** → Ring 0 + minimal Ring 1. Near-zero overhead.
- **Medium-stakes task** → Ring 0 + Ring 1 + adaptive Ring 2 gates. 1.5–3× Ring 0 alone.
- **High-stakes decision** → All four rings, mandatory gates, full verification. 3–5× Ring 0 alone.
- **Critical-stakes system** → All rings + enhanced Security Intelligence monitoring + continuous evaluation and red-teaming. 5×+ Ring 0 alone. For autonomous systems with irreversible real-world impact.

**Trust Ladders are the primary cost optimization mechanism.** As trust builds through demonstrated performance, verification intensity decreases and governance gates relax. The system starts expensive and gets cheaper — the right economic trajectory.

Empirical reference points from the literature: policy evaluation overhead at 0.43s total across 7,000+ decisions (~0.06ms per decision, Microsoft AGT); AI gateway routing at 11μs per request at 5K RPS (Bifrost); self-improvement loops at approximately 50× the tokens of single execution (Reflexion-style learning). Governance overhead is measurable and manageable at production scale.

### Key Tensions

AGF names seven tensions between primitives and provides architectural resolutions for each. Three are central:

**Governance vs. Latency.** More governance = more safety but more latency. Resolution: deployment mode selection. Wrapper mode accepts latency for governance clarity; graph-embedded mode minimizes latency at the cost of audit complexity. The Mode Selection Matrix is the decision tool.

**Self-Improvement vs. Reproducibility.** Ring 3 makes the system better, but changes make it harder to reproduce. Resolution: Ring 3 changes go through versioned configuration management. Every configuration state is traceable and reproducible. The system improves forward; it doesn't drift.

**Environment Optimization vs. Governance Integrity.** The environment optimization loop makes agents more effective, but the environment IS the control surface. Resolution: separate the optimizable (context priorities, tool descriptions, session policy) from the inviolable (governance policy, authorization boundaries, security constraints). The optimization loop can improve the agent's experience within governance boundaries; it cannot move the boundaries.

---

## Who Uses What

AGF serves five distinct professional audiences. Each has a dedicated domain profile with the depth they need:

### Security & Threat Modeling

**For:** CISOs, security architects, AppSec teams, red teams, SOC analysts
**Key question:** *How do I defend against threats to my agentic systems?*

This profile provides: the three-level security model in full detail, OWASP ASI threat-by-threat analysis with assigned responsibilities (which security level and which primitive owns each threat), OWASP MCP Top 10 mapping, MCP-specific security patterns, red team scenarios, incident response playbook structure, and the Security Response Bus architecture.

**Start here if:** You are responsible for the security posture of systems that include autonomous agents.

### Platform & Infrastructure

**For:** Platform engineers, infrastructure architects, DevOps/MLOps teams
**Key question:** *How do I build and deploy governed agent infrastructure?*

This profile provides: ring deployment modes in full detail, the Mode Selection Matrix as a decision tool, Agent Environment Architecture (5-layer stack and composition patterns), the Composability Interface (the standard contract between rings), MCP integration patterns, cost of governance with empirical benchmarks, and multi-agent coordination patterns.

**Start here if:** You are building the infrastructure that agents run on.

### Governance, Risk & Compliance

**For:** Compliance officers, risk managers, auditors, legal/privacy teams, DPOs
**Key question:** *How do I prove to a regulator that my agentic systems are governed?*

This profile provides: EU AI Act article-by-article mapping, NIST AI RMF function mapping, Singapore IMDA alignment, CSA MAESTRO layer mapping, control crosswalks (AGF → NIST 800-53 → ISO 27001), evidence generation guide (what audit artifacts each primitive produces), governance maturity model, and risk classification decision tree.

**Start here if:** You need to demonstrate compliance for agentic systems.

### AI Engineering

**For:** AI engineers, ML engineers, prompt engineers, agent developers
**Key question:** *Which primitives do I implement first, and how?*

This profile provides: all 19 primitives in full detail (the pattern catalog), composition patterns with implementation priority, primitive interaction tensions with resolutions, Trust Ladders mechanics, the Environment Optimization Loop, prior art mapping (what to read, what tools to use), and worked examples.

**Start here if:** You are building agents and want to make them governed.

### Observability & Operations

**For:** SREs, SOC analysts, detection engineers, platform reliability engineers
**Key question:** *How do I see what my agents are doing and respond when they misbehave?*

This profile provides: the SIEM-for-agents architectural concept, canonical event architecture (envelope, taxonomy, identity context), correlation engine (quality/security/governance rules), detection patterns and behavioral baselines, operational playbooks (incident response, forensic investigation, containment), and the observability maturity model.

**Start here if:** You are running agentic systems in production and need to monitor, detect, and respond.

### For Business Owners and Executives

You don't need a full profile — you need the answer to three questions:

1. **Are my agentic systems governed?** The composition patterns (above) tell you what level of governance you have. Minimum Viable Control is the floor. Full Governed is the ceiling. Where you sit depends on your risk and regulatory posture.
2. **Can I trust the agents in my domain?** Trust Ladders (#11) provide a calibrated trust model. Agents earn autonomy through demonstrated performance. You can see their trust level, review their decisions, and override when needed.
3. **Can I prove it to a regulator?** The GRC Profile provides the evidence trail. Every primitive produces audit artifacts. The framework maps to EU AI Act, NIST AI RMF, and Singapore IMDA requirements.

---

## Standards & Regulatory Alignment

AGF is a synthesis framework. It integrates, not replaces, established standards:

### Regulatory Frameworks

| Standard | How AGF Maps |
|----------|-------------|
| **EU AI Act** | Art. 6 (risk classification → ring activation), Art. 9 (risk management → three-level security), Art. 12 (record-keeping → Event-Driven Observability #10), Art. 14 (human oversight → Governance Gates #8), Art. 15 (robustness → Adversarial Robustness #15), Art. 50 (transparency → Identity #14) |
| **NIST AI RMF** | GOVERN → Ring 2, MAP → risk classification + ring activation, MEASURE → Evaluation #18 + Ring 1, MANAGE → Trust Ladders #11 + Bounded Agency #7. AGF primitives are "agentic specializations of" NIST functions — runtime mechanisms within broader organizational functions |
| **Singapore IMDA MGF for Agentic AI** | Four dimensions mapped: Risk Bounding → Bounded Agency #7, Accountability → Governance Gates #8, Technical Controls → Evaluation #18, End-User Responsibility → Identity #14. IMDA explicitly includes operational environments as a governance dimension, validating Agent Environment Governance #19 |

### Security Frameworks

| Standard | How AGF Maps |
|----------|-------------|
| **OWASP Top 10 for Agentic Applications** | All 10 ASI threats mapped to the three-level security model with single-owner responsibility per threat |
| **OWASP MCP Top 10** | All 10 MCP threats mapped to specific primitives and security architecture components |
| **CSA MAESTRO** | 7-layer threat model mapped to AGF primitives layer by layer |
| **CSA Agentic Trust Framework** | Trust Ladders #11 aligns with ATF's earned autonomy maturity model |
| **NIST SP 800-207 (Zero Trust)** | Security Fabric = PEP, Security Governance = PDP, Security Intelligence = continuous diagnostics |
| **NIST IR 8596 (Cyber AI Profile)** | Three focus areas mapped to security architecture |
| **NIST NCCoE Agent Identity** | SPIFFE/SPIRE, OAuth 2.1, NGAC integrated into Identity #14 |

### Industry Standards

| Standard | How AGF Maps |
|----------|-------------|
| **ISO/IEC 42001** | Policy as Code #9 and continuous audit map to operational planning; AGF addresses the runtime gap ISO 42001 leaves open |
| **IEEE P2863** | Organizational governance practice that AGF's runtime architecture implements |
| **OpenTelemetry GenAI** | Event architecture builds on OTel conventions with governance-specific extensions |

Full regulatory mappings with article-level detail are in the **GRC Profile**.

---

## Prior Art & Positioning

### What We Build On

AGF stands on the shoulders of extraordinary work:

- **NIST** — AI RMF, Zero Trust Architecture, Cyber AI Profile, NCCoE Agent Identity, CAISI initiative
- **OWASP** — Top 10 for Agentic Applications, MCP Top 10, Secure MCP Development Guide
- **CSA** — Agentic Trust Framework, MAESTRO threat modeling
- **Singapore** — IMDA Model AI Governance Framework for Agentic AI, GovTech ARC Framework
- **Academic research** — DeepMind delegation framework, Anthropic agent autonomy data, SAGA cryptographic access control, AgentSpec policy enforcement, AgentGuard probabilistic verification, MAST multi-agent failure study, AGENTSAFE governance phases, Agent Contracts resource budgets, Layered Governance Architecture
- **Industry** — Anthropic context engineering, AgentOS, LangChain, Microsoft Multi-Agent Reference Architecture, NVIDIA OpenShell, prompt governance literature

### What We Contribute

1. **The Rings Model** — a vendor-neutral logical architecture for runtime governance with a standard composability interface and three deployment modes
2. **Agent Environment Governance (#19)** — the first unified governance primitive for the complete agent operating environment (context + instructions + tools + workspace + memory), building on prompt governance literature, IMDA's operational environment framing, and context engineering research
3. **The tensions and their resolutions** — naming where primitives conflict and providing architectural invariants to resolve them
4. **The three-level security model** — unifying quality monitoring, security detection, and compliance monitoring because agentic threats traverse all three domains
5. **Composition over invention** — connecting existing standards into a single coherent architecture rather than creating a competing standard

### Confidence Levels

Not everything carries the same certainty:

- **Established pattern** — Proven across multiple domains. Strong evidence. We are connecting existing patterns to the agentic context. *Examples: separation of duties, least privilege, audit trails, zero trust.*
- **Informed proposal** — Based on our synthesis of the literature, not yet battle-tested at scale in agentic systems. We believe these are right but welcome challenge. *Examples: the Rings Model, the three-level security architecture, the Security Response Bus.*
- **Open question** — We genuinely don't have great answers yet. *Examples: semantic goal-state attestation, cross-system trust federation, optimal human oversight patterns as the capability gap widens.*

---

## Where to Go Next

### Domain Profiles

| If you are... | Start with... |
|--------------|---------------|
| A CISO or security architect | **[Security Profile](../profiles/security-profile.md)** — Threat modeling, OWASP mappings, MITRE ATLAS alignment, red team scenarios, incident response playbooks |
| A platform or infrastructure engineer | **[Platform Profile](../profiles/platform-profile.md)** — Deployment modes, Mode Selection Matrix, environment architecture, MCP integration, cost of governance |
| A compliance officer or auditor | **[GRC Profile](../profiles/grc-profile.md)** — Regulatory mappings, control crosswalks, maturity model, risk classification, evidence guides |
| An AI engineer building agents | **[AI Engineering Profile](../profiles/ai-engineering-profile.md)** — Full primitive catalog, 5-phase implementation priority, composition patterns, tensions |
| An SRE or detection engineer | **[Observability Profile](../profiles/observability-profile.md)** — Event architecture, correlation rules, playbooks, zero trust monitoring |
| An executive or business owner | **This document** — plus the [GRC Profile](../profiles/grc-profile.md) for regulatory evidence |

### Deep-Dive Topics

These explore specific aspects of the framework in depth:

- **[Agentic Primitives](agentic-primitives.md)** — The full 19-primitive catalog with complete patterns, tensions, deployment modes, security architecture, and prior art mapping
- **[Agentic Observability](agentic-observability.md)** — The SIEM pattern for agents: event architecture, correlation engine, playbooks, maturity model
- **[Decision Intelligence](decision-intelligence.md)** — Governed decision flows: Risk Decision Graph, Belief Layer, revision cascade, multi-agent decision pipeline
- **Trust Ladders** — How agentic systems earn autonomy through demonstrated performance (white paper forthcoming)
- **The Rings Model** — Concentric architecture for governed agentic systems (architecture post forthcoming)

### Community & Contribution

This framework is a starting place — a reference that organizations can adopt, adapt, challenge, and build upon. We welcome:

- **Challenge** — Where are we wrong? What are we overclaiming? What did we miss?
- **Evidence** — Real-world implementation experiences that confirm or refute the patterns
- **Extension** — New primitives, new deployment patterns, new regulatory mappings
- **Critique** — Adversarial review from any perspective

Our hope is that this work serves the community: that it gives practitioners a better foundation for building governed agentic systems, and that it connects enough dots for the industry to see further and build further than any of us could alone.

---

*AGF is developed and maintained by Keating Pike. For the complete framework including all domain profiles and the full primitive catalog, visit [link].*
