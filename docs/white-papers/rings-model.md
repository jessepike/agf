# The Rings Model: A Concentric Architecture for Governed Agentic Systems

**AGF White Paper Series — No. 2**
**Version:** 0.1 Draft
**Date:** 2026-03-18
**Authors:** Jesse Pike

---

## Abstract

Most agentic systems in production today have no structural governance. The agent produces output, and either a human reviews it or nobody does. There's no verification layer, no policy evaluation, no audit trail, and no mechanism for the system to improve over time. When something goes wrong — and it will — there's no way to answer "why did the system do that?" and no containment to limit the damage.

The Rings Model is a vendor-neutral logical architecture that organizes governance into four concentric rings — Execution, Verification, Governance, and Learning — plus a cross-cutting fabric and an environment substrate. It is not a single deployment topology. It is a logical architecture that manifests differently depending on the system type: sequential rings wrapping a batch pipeline, interrupt-driven governance at tool-call boundaries in a coding agent, or concurrent verification alongside a streaming conversational agent.

This paper describes the architecture, explains why it's structured the way it is, shows how it adapts to different system types, and provides the composition patterns that let organizations start simple and grow governance as stakes increase.

---

## The Problem

Agentic systems are fundamentally different from traditional software. Traditional software does what it's told. Agents reason, select tools, take actions, delegate to other agents, and modify their own behavior over time. Every one of these capabilities is simultaneously valuable and dangerous.

The governance gap is real:

- **No verification layer.** The agent that produces an output is the only thing that evaluates it. This is the equivalent of letting a single person write and approve their own expense reports.
- **No policy evaluation.** There's no point in the execution flow where organizational policy is systematically evaluated. Governance happens informally — in code reviews, in prompts, in hope.
- **No audit trail.** When a regulator asks "how did this agent reach this decision?", most organizations cannot answer.
- **No containment.** When an agent misbehaves, there's no structural mechanism to limit the blast radius. A compromised agent has access to everything its configuration permits.
- **No improvement mechanism.** The system doesn't learn from its own governance outcomes. Every execution is independent. The same mistakes repeat.

These are not feature requests. They are structural requirements for any system making consequential autonomous decisions. The Rings Model provides the architecture.

---

## The Architecture

### Four Rings, One Fabric, One Substrate

```text
┌───────────────────────────────────────────────────────────┐
│  Ring 3 — Learning                                        │
│  Self-improvement, memory, trust calibration              │
│                                                           │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Ring 2 — Governance                              │    │
│  │  Policy gates, provenance, authorization          │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐    │    │
│  │  │  Ring 1 — Verification                    │    │    │
│  │  │  Validation loops, critique, review       │    │    │
│  │  │                                           │    │    │
│  │  │  ┌───────────────────────────────────┐    │    │    │
│  │  │  │  Ring 0 — Execution               │    │    │    │
│  │  │  │  The agent does its work           │    │    │    │
│  │  │  └───────────────────────────────────┘    │    │    │
│  │  └───────────────────────────────────────────┘    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                           │
│  ════════════════════════════════════════════════════════  │
│  Fabric: Events · Structured Output · Identity · Recovery │
├───────────────────────────────────────────────────────────┤
│  Environment Substrate (#19)                              │
│  Context · Instructions · Capabilities · Workspace        │
└───────────────────────────────────────────────────────────┘
```

### Ring 0 — Execution

The core agent performs its domain task. It generates text, writes code, makes a recommendation, extracts data from a document, or executes an action. Ring 0 is where the work happens.

Without governance, Ring 0 is all there is. An agent that generates and releases output with no verification, no policy check, and no audit trail is a Ring-0-only system. Most deployed agentic systems today are Ring-0-only.

### Ring 1 — Verification

A separate process evaluates Ring 0's output against quality criteria. The fundamental principle: **the agent that creates output must not be the sole agent that validates it.**

Ring 1 can loop — sending output back to Ring 0 for revision until it converges on acceptable quality. This is the validation loop: produce → verify → revise → verify again, until quality thresholds are met or the iteration budget is exhausted.

Ring 1 can also challenge — a dedicated adversarial critique role whose mandate is to find flaws, not confirm quality. The challenger is structurally forbidden from concluding "this looks good."

**What Ring 1 answers:** Is this output correct? Is it complete? Does it meet quality standards?

### Ring 2 — Governance

Policy evaluation and authorization. Ring 2 determines whether a verified output should be released, using explicit governance rules (Policy as Code), human-reviewable gates, and organizational policy.

Ring 2 can pause execution indefinitely for human review. It is the decision authority. A human reviewer at a governance gate sees structured evidence — the output, the provenance chain, the policy evaluation — and decides: approve, reject, modify, defer, or escalate.

Ring 2 enforces two classes of gates:

- **Adaptive gates** relax as the system proves reliability through Trust Ladders. Routine quality reviews can decrease as trust grows.
- **Mandatory gates** never relax. Irreversible actions, regulatory requirements, and legally mandated reviews always fire, regardless of trust level.

**What Ring 2 answers:** Should this output be released? Does it comply with policy? Who authorized it?

### Ring 3 — Learning

The system improves over time. Ring 3 observes execution patterns across all rings, calibrates trust levels, tunes verification thresholds, and proposes configuration changes.

Critically: **Ring 3 proposes. It does not autonomously enact.** All Ring 3 proposals pass through Ring 2 governance and Evaluation & Assurance testing before deployment. The system can suggest governance changes; it cannot make them.

This is the invariant that makes self-improvement safe: the box can get smarter inside, but it cannot grow itself.

**What Ring 3 answers:** How can the system get better? What should change?

### The Fabric

Cross-cutting infrastructure that makes the rings composable:

- **Structured Output Persistence** — rings communicate through schema-conformant artifacts with metadata, not raw text
- **Event-Driven Observability** — every ring emits structured events, creating the shared nervous system
- **Identity & Attribution** — every action carries authenticated identity context through every ring
- **Provenance Chains** — every output carries its full decision history
- **Error Handling & Recovery** — checkpointing at ring boundaries, graceful degradation, compensation for committed side effects
- **Security Fabric** — input sanitization, output scanning, containment, identity verification at every boundary

### The Environment Substrate

Every agent — in every ring — operates within a governed environment: context, instructions, tools, workspace, memory. Agent Environment Governance (#19) ensures this substrate is composed by policy, scoped by least privilege, and continuously optimized.

---

## Why Concentric Rings?

The ring structure is not arbitrary. Each ring adds a fundamentally different type of assurance:

| Ring | Assurance Type | What It Catches |
|------|---------------|----------------|
| Ring 0 alone | None | Nothing — the agent self-certifies |
| + Ring 1 | Quality assurance | Errors, hallucinations, incomplete outputs |
| + Ring 2 | Policy assurance | Unauthorized actions, policy violations, unreviewed decisions |
| + Ring 3 | Improvement assurance | Recurring failures, calibration drift, stale configurations |

Each layer is independently valuable. You don't need Ring 3 to benefit from Ring 1. You can add rings incrementally as stakes increase.

The rings are also independently activatable. A low-stakes task might run Ring 0 + minimal Ring 1. A high-stakes regulatory decision activates all four rings with mandatory gates. This is **proportional governance** — you pay for what the stakes require.

---

## The Rings Are Logical, Not Physical

This is the key architectural insight. The concentric ring diagram above depicts one deployment mode — **wrapper mode**, where rings sequentially wrap execution. But the rings are a *logical* architecture. How they manifest physically depends on the system type.

### Wrapper Mode

The rings literally wrap execution. Ring 0 produces → Ring 1 verifies → Ring 2 governs → output releases. Sequential, clean audit trail.

**Best for:** Batch pipelines, document processing, regulatory assessments. Systems where latency is acceptable and audit clarity is paramount.

**Example:** An AI risk assessment pipeline. A document goes in. Extraction agents (Ring 0) extract data. Verification agents (Ring 1) check extraction against source documents. Policy agents (Ring 2) evaluate against governance rules. A human reviewer approves or rejects at a governance gate. The assessment is released.

### Middleware / Interrupt Mode

Ring logic fires at specific decision points within an execution graph — tool calls, data access, state mutations. The agent executes continuously; the rings intercept at defined boundaries.

**Best for:** Coding agents, ops automation, multi-step task agents. Systems where the agent takes many actions, and governance fires selectively on consequential ones.

**Example:** A coding agent (Claude Code, Cursor). The agent writes code continuously. When it calls a tool that executes a shell command (a consequential action), Ring 1 verification checks the command, and Ring 2 governance may gate it for human approval if it's destructive. The Model Context Protocol (MCP) is the canonical implementation — each tool call is a natural interrupt point.

### Graph-Embedded Mode

Verification, governance, and security run concurrently with execution as peer nodes in the orchestration graph. Speculative execution with a release gate that blocks output until all signals pass.

**Best for:** Conversational agents, voice assistants, real-time systems. Systems where latency must be minimal and the user expects immediate response.

**Example:** A customer-facing chatbot. The agent generates a response (Ring 0). Simultaneously, quality verification (Ring 1) and safety checks (Security Fabric) run in parallel. A release gate holds the response until all checks pass. The user perceives near-instant response because verification runs alongside generation, not after it.

### Hybrid Is Normal

Systems commonly combine modes. A coding agent operates in middleware mode overall, but within a single user-facing response, the generation pipeline uses graph-embedded mode for parallel output verification.

---

## The Signal Protocol

Rings communicate through a standard composability interface — six signals that form the contract between rings:

- **PASS** — output accepted, move forward
- **REVISE(quality)** — Ring 1 says "not good enough, try again"
- **REVISE(context)** — Ring 2 says "the world changed, re-execute with updated context"
- **HALT** — something is fundamentally wrong, stop execution
- **GATE** — pause for human authorization (returns: approve, reject, modify, defer, escalate)
- **DELEGATE** — hand off to another agent/pipeline with depth tracking
- **ERROR** — something broke; recovery options: retry, degrade, or halt

This standard contract is what makes rings attachable to any pipeline. If your system can produce structured output, carry identity context, emit events, and accept these signals — you can attach governance rings.

---

## Starting Simple, Growing Governed

Organizations don't implement all four rings at once. They start with what the stakes require and grow:

**Phase 1 — Minimum Viable Control:** Bounded agency, identity, provenance, observability. Not even Ring 1 yet — just: the agent can't exceed its scope, actions are attributable, there's an audit trail.

**Phase 2 — Verification (Ring 0 + Ring 1):** Add separate verification of outputs. Quality assurance becomes structural, not manual.

**Phase 3 — Governance (+ Ring 2):** Add policy evaluation, human gates, transaction control. Decisions are now policy-evaluated and human-authorized.

**Phase 4 — Security & Assurance:** Add adversarial robustness, pre-deployment testing, trust calibration. The system is production-hardened.

**Phase 5 — Learning (+ Ring 3):** Add self-improvement, memory, environment optimization. The system gets better over time while maintaining governance.

Each phase is independently valuable. Phase 1 alone — knowing what your agents are doing, within what scope, with an audit trail — is more governance than most organizations have today.

---

## The Cost of Governance — and the Cost of Not Having It

Every ring adds cost. The Rings Model is designed for proportional activation:

- **Low-stakes task** → Ring 0 + minimal Ring 1. Near-zero overhead.
- **Medium-stakes task** → Ring 0 + Ring 1 + adaptive Ring 2 gates. 1.5–3× Ring 0 alone.
- **High-stakes decision** → All four rings, mandatory gates. 3–5× Ring 0 alone.
- **Critical-stakes system** → All rings + enhanced monitoring + continuous red-teaming. 5×+ Ring 0 alone. For autonomous systems with irreversible real-world impact.

[Trust Ladders](trust-ladders.md) are the primary cost optimization: the system starts expensive and gets cheaper as trust is earned. This is the right economic trajectory.

But the real cost comparison is not "governance vs. no governance." It is "the cost of governance vs. the cost of an ungoverned failure." For regulated contexts, ungoverned failure means audit failure, regulatory penalty, reputational damage, and legal liability. For any context, it means fixing bad outputs that weren't caught, investigating incidents without audit trails, and explaining decisions that have no provenance.

The rings are not overhead. They are infrastructure. The question is not whether you can afford them. It's whether you can afford not to have them.

---

## The Honest Constraints

The Rings Model is built on an honest assessment of oversight's limitations.

Research demonstrates that oversight efficacy degrades as the capability gap between overseer and system increases (Engels et al., NeurIPS 2025). As agentic systems grow more capable, human overseers face a widening gap. The design position: **build the architecture so that governance works *with* oversight, not *only because of* oversight.**

Governance Gates provide human decision points where they matter most. The rings, verification layers, and automated policy enforcement provide structural guarantees that function whether or not the human overseer catches every issue.

This is not a failure of trust in human judgment. It is an acknowledgment that human attention is finite, and the architecture must not depend on infinite attention to be safe.

---

## Where This Came From

The Rings Model is not a novel invention. It is a composition of established patterns:

- **Separation of duties** (decades of security engineering) → Ring 1 exists because the producer should not be the sole validator
- **Policy enforcement points** (zero trust architecture, NIST SP 800-207) → Ring 2 is the PDP, Security Fabric is the PEP
- **Continuous improvement loops** (Deming, lean manufacturing, SRE) → Ring 3 is the improvement engine
- **Defense in depth** (security engineering) → multiple independent layers, each adding different assurance
- **Proportional controls** (risk management) → activation intensity matches stakes

The contribution is not the individual patterns. It is the composition: pulling them together into a vendor-neutral, composable, adaptable architecture for the agentic context, with a standard signal protocol that makes governance attachable to any system.

We named it. We didn't invent it.

---

*The Rings Model is the central architecture of the Agentic Governance Framework (AGF). For the complete framework including all 19 primitives, domain-specific profiles, and implementation guidance, see [AGF: A Reference Architecture for Governed Agentic Systems](../agf-reference-architecture.md).*

*AGF is developed and maintained by Jesse Pike.*
