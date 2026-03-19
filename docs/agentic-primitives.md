# Agentic Primitives

**Status:** Living concept document
**Last updated:** 2026-03-18

---

## Contents

1. [Core Thesis](#core-thesis) — Synthesis framework positioning
2. [The Primitives](#the-primitives) — 19 patterns for governed agentic systems
3. [Agent Environment Architecture](#agent-environment-architecture) — Environment stack, composition patterns, optimization loop, recursive governance
4. [Security Architecture](#security-architecture) — Three-level security model, zero trust, threat mappings
5. [The Rings Model](#the-rings-model) — Logical architecture (Execution → Verification → Governance → Learning)
6. [Ring Deployment Modes](#ring-deployment-modes) — Wrapper, middleware, graph-embedded with selection matrix
7. [Multi-Agent Coordination](#multi-agent-coordination) — Composition patterns, governance collapse rule, cross-system trust
8. [Composability Interface](#composability-interface) — Standard contract, execution budgets, human interface requirements
9. [Primitive Interaction Tensions](#primitive-interaction-tensions) — 7 tensions with resolutions
10. [Cost of Governance](#cost-of-governance) — Economic model, real cost drivers, minimum viable ring stack
11. [How the Primitives Compose](#how-the-primitives-compose) — Higher-order patterns
12. [Prior Art Mapping](#prior-art-mapping) — Standards, government frameworks, security frameworks, academic research, protocols, evaluation
13. [Open Questions](#open-questions)

---

## Core Thesis

Agentic systems are proliferating faster than the architectural patterns to govern them. Most deployments today are brittle — they work in demos but fail under scrutiny because they lack the structural primitives that make automated action trustworthy, auditable, and improvable.

### This Is a Synthesis Framework

The primitives in this document are not new inventions. They are named, not coined. Every pattern here — separation of duties, least privilege, audit trails, convergence-gated feedback loops, zero trust, policy as code — is battle-tested in distributed systems, security engineering, compliance, and control theory. These patterns have governed critical infrastructure for decades.

The individual primitives are not the contribution. **The contribution is the composition:**

1. **Naming the patterns for the agentic context.** The landscape has the pieces — NIST provides risk management frameworks, OWASP provides threat taxonomies, CSA provides trust frameworks, ISO provides management systems, OTel provides observability standards. Nobody has pulled them together into a single composable architecture that shows how they connect for agentic systems specifically.

2. **The Rings Model.** A vendor-neutral logical architecture (Execution → Verification → Governance → Learning) with a standard composability interface and three deployment modes. CSA has trust frameworks. OWASP has threat taxonomies. NIST has risk functions. Nobody has a composable runtime governance architecture that adapts its physical topology to the system type.

3. **The tensions and their resolutions.** Every other framework presents its recommendations as harmonious. We name where the primitives conflict (self-improvement vs. reproducibility, trust vs. gates, validation vs. cost) and show how to resolve those conflicts with architectural invariants.

4. **The three-level security model.** The landscape separates security monitoring (SIEM), quality monitoring (LLM observability), and compliance monitoring (GRC) into different tools. We show why agentic systems require a unified security architecture — because a quality degradation pattern might be a security attack, and separating detection domains loses critical correlation signal.

### What This Framework Is

A synthesis framework that combines enduring control concerns with current implementation patterns. It integrates the best thinking from NIST, OWASP, CSA, ISO, OTel, EU AI Act, Singapore IMDA, Anthropic, DeepMind, and the academic research community into a coherent reference architecture.

The dots have already been laid down. NIST has done extraordinary work on risk management. OWASP has built the definitive threat taxonomy. CSA has created the trust framework. ISO has defined the management system. OTel is standardizing observability. Singapore has published the first government agentic governance framework. DeepMind and Anthropic have produced the empirical research. Berkeley, Stanford, and dozens of academic labs have formalized the theory.

**We are trying to connect the dots.** We believe the community is well-served by someone pulling all of this together, showing how the pieces relate, filling the gaps between them, and proposing a coherent architecture that practitioners can actually follow. That's the service this framework provides.

### What This Framework Is Not

- **Not a novel invention of new security or governance concepts.** The primitives existed before we named them. The composition is the work.
- **Not a replacement for standards.** We integrate NIST, OWASP, CSA, ISO, and others — we don't compete with them. We depend on them. See [Prior Art Mapping](#prior-art-mapping) for explicit acknowledgments.
- **Not a finished product.** Some parts of this framework reflect high confidence based on strong empirical evidence and established practice. Other parts are proposals — our best current thinking informed by the literature, but genuinely uncertain. We mark confidence levels where they matter and we invite challenge on every claim.
- **Not an implementation specification.** This document defines what should be true, not how to build it. Implementations will vary by system type, technology stack, and organizational context.

### Confidence Levels

Not everything in this framework carries the same certainty. We use three levels:

- **Established pattern** — Proven in practice across multiple domains. Strong empirical evidence. We are connecting existing patterns to the agentic context. Examples: separation of duties, least privilege, audit trails, zero trust.
- **Informed proposal** — Based on our synthesis of the literature and emerging practice, but not yet battle-tested at scale in agentic systems. We believe these are right but welcome challenge. Examples: the Rings Model, the three-level security architecture, the Security Response Bus.
- **Open question** — Areas where we genuinely don't have great answers yet. We're sharing our current thinking because even partial answers serve the community better than silence. Examples: semantic goal-state attestation, cross-system trust federation, the durability of Self-Improving Cycles (#3) as a standalone primitive.

### The Argument

The number of agentic systems being deployed without these patterns is staggering. Skipping governance primitives for agentic systems is the same mistake enterprises made in early cloud adoption (no IAM, no encryption, no audit trails) and early DevOps (no pipeline gates, no rollback, no observability). The patterns eventually became non-negotiable. They will here too.

**A declared architectural constraint:** Oversight is necessary but insufficient — and it degrades as the capability gap widens. Engels et al. ("Scaling Laws For Scalable Oversight," NeurIPS 2025 spotlight) demonstrate that when a weaker overseer monitors a stronger system across adversarial tasks, success rates range from **9.4% to 51.7%** depending on the task type, with most tasks at the low end. Their study examines AI-to-AI oversight (weaker LLMs overseeing stronger LLMs), not human oversight directly, and the authors explicitly note their games are "simplified" proxies. But the general principle is critical for this framework: **oversight efficacy degrades as the capability gap between overseer and system increases.** As agentic systems grow more capable, human overseers face this same scaling challenge — and the gap will only widen. This framework does not pretend that oversight alone solves the governance problem. It is why we invest in structural guarantees — rings, verification layers, automated policy enforcement, containment mechanisms — that do not depend on overseer attention to function. Governance Gates (#8) provide human decision points where they matter most; the rest of the architecture ensures that the system is safe even when the overseer misses something. This is the honest design position: build the architecture so that governance works *with* oversight, not *only because of* oversight.

We got this far by reading everything we could find, synthesizing the best thinking from across the landscape, and proposing how it fits together. The community can take this further — by challenging what we got wrong, strengthening what we got right, and filling the gaps we've identified but couldn't resolve alone.

The primitives endure. The implementations change. Naming the tensions between primitives — and their resolutions — is what separates a taxonomy from an architecture.

---

## The Primitives

**Taxonomy note:** Primitives #1–#17 are **runtime primitives** — they operate within or across the ring processing pipeline during agent execution. Primitive #18 (Evaluation & Assurance) is a **lifecycle primitive** — it operates outside the runtime pipeline as the CI/CD gate for the ring architecture. Primitive #19 (Agent Environment Governance) is a **substrate primitive** — it governs the operating environment that all agents (across all rings) depend on. All three categories are first-class primitives because all are necessary for governed agentic systems; the distinction is temporal and structural, not hierarchical.

### 1. Separation of Producer and Verifier

The agent that creates output must not be the sole agent that validates it. This is the most fundamental **structural** guarantee in any system producing consequential output.

**The pattern:**
- Producer agent generates output
- Verifier agent(s) evaluate output against defined quality criteria
- Synthesis agent reconciles or accepts

**Why it endures:** This is separation of duties — the same principle that prevents a single person from writing and approving a check. It doesn't matter if the model improves 100x. You still don't let the same actor produce and certify.

**Variations:**
- Self-audit (same model, different prompt/role — weakest form)
- Cross-model verification (different model evaluates — stronger)
- Multi-agent panel (multiple independent evaluators — strongest)

**Distinction from Adversarial Critique (#4):** Separation of Producer/Verifier is a **structural pattern** — different actors for different roles. It answers "is this output correct?" Adversarial Critique (#4) is an **intentional mandate** — the challenger's job is to find what's wrong, not confirm what's right. A verifier can conclude "this looks good." A challenger is structurally forbidden from that conclusion. They are related but not redundant: you can have verification without adversarial critique (a verifier that confirms), but adversarial critique always implies producer/verifier separation.

---

### 2. Validation Loops with Convergence Gates

Multi-pass review cycles where output is iteratively improved until it meets a quality threshold — or escalates when iteration limits are reached without convergence.

**The pattern:**
```
Output produced
  -> Evaluate against quality criteria
  -> Score / threshold check
  -> If passes: accept, exit loop
  -> If fails + iterations remaining: feed findings back, re-produce
  -> If fails + iteration limit reached: escalate to human / higher authority
```

**Key design decisions:**
- **Convergence criteria:** What does "good enough" mean? Explicit, measurable thresholds — not vibes.
- **Early exit:** The first iteration that passes the threshold wins. Don't over-optimize.
- **Iteration budget:** Hard cap on loops (e.g., 10). Unbounded iteration is a cost and latency trap.
- **Diminishing returns detection:** If score plateaus across iterations, exit early rather than burn cycles.

**Why it endures:** Any system that produces variable-quality output needs a feedback loop with a stop condition. This is true for LLMs, for human workflows, for manufacturing quality control. The pattern is universal.

---

### 3. Self-Improving Cycles

Systems that learn from their own execution history, incorporating new knowledge from memory, knowledge bases, and observed patterns to get better over time — without retraining.

**The pattern:**
```
Agent executes task
  -> Execution data logged (inputs, outputs, scores, human feedback)
  -> Periodic review cycle triggers
  -> Reviewer agent analyzes recent execution data
  -> Pulls current memory / KB for new learnings
  -> Identifies patterns: "extraction accuracy drops on PDF tables"
  -> Generates improvement recommendations
  -> Recommendations applied (prompt updates, config changes, new rules)
  -> Next execution benefits from accumulated learning
```

**Key design decisions:**
- **What feeds the loop:** Execution logs, human overrides, quality scores, KB updates, memory entries
- **Cycle frequency:** Not every run. Periodic batches — daily, weekly, or threshold-triggered.
- **What changes:** Prompts, configurations, rules, thresholds — NOT model weights. Runtime-tunable parameters only.
- **Guardrails:** Changes are versioned. Rollback is always possible. Regression detection on quality metrics.

**Why it endures:** The gap between "model capability" and "system performance" is always filled by runtime adaptation. Better models shrink the gap but never eliminate it. Domain-specific learning at the system level will always be needed.

**Honest limitation:** This is the most likely primitive to be subsumed. As foundation models improve, the gap that runtime adaptation fills may narrow — better prompting, longer context windows, and in-context learning may absorb what currently requires system-level improvement cycles. Three independent external reviews ranked #3 as the least durable primitive. The pattern endures as long as the capability-performance gap persists, but that gap may shrink. If it does, #3 collapses into routine configuration management rather than a distinct governance primitive. We include it because the gap is real today and will remain real for any system where domain-specific knowledge exceeds what's in the model's training data — but we acknowledge the trajectory.

**Relationship to Memory-Augmented Reasoning (#12):** Self-improving cycles are the *mechanism* — the closed-loop process that analyzes execution data and generates improvements. Memory-augmented reasoning is the *infrastructure* — the persistent knowledge layer that makes accumulated learning available at execution time. One is the engine, the other is the fuel system. Both live in Ring 3 but serve different roles.

---

### 4. Adversarial Critique

A dedicated role whose sole purpose is to find weaknesses — contradictions, missing evidence, unstated assumptions, edge cases, logical gaps. The challenger exists to stress-test, not to confirm.

**The pattern:**
- Challenger agent receives the same inputs + the producer's output
- Mandate: find what's wrong, what's missing, what's assumed without evidence
- Outputs structured challenges: counterclaims, gaps, contradiction flags
- Challenges are visible in the provenance chain — not silently absorbed

**Key design decisions:**
- **Structural mandate:** The challenger is not asked "is this good?" — it's asked "what's wrong with this?" The framing matters.
- **Independence:** The challenger should not share context/state that would bias it toward agreement.
- **Visibility:** Challenge results are first-class artifacts, not internal logs. Reviewers see what was challenged and how.
- **Proportionality:** Not everything needs adversarial review. Reserve it for material decisions and high-stakes outputs. This is a trust-ladder-influenced decision — higher trust contexts may invoke the challenger less frequently.

**Why it endures:** Confirmation bias is a property of any reasoning system — human or machine. The structural fix is the same in both cases: assign someone the explicit job of disagreeing.

**Distinction from Separation of Producer/Verifier (#1):** See #1 for the structural vs. intentional distinction. Adversarial Critique is a specific, stronger form of verification where the mandate is exclusively to challenge, never to confirm.

---

### 5. Structured Output Persistence

Agents produce typed, versioned, stored artifacts — not prose. Every output is a data structure with a schema, not a text blob that has to be parsed later.

**The pattern:**
- Define output contracts before building agents
- Agent output is validated against schema at runtime
- Invalid output is a failure, not a "close enough"
- Every artifact has: version, creator, timestamp, schema version, lineage

**Why it endures:** The moment you need to compose agent outputs, compare across runs, build analytics, or replay decisions — you need structure. Prose is a dead end for any system that needs to reason about its own outputs.

**Design principle:** Schema-first, not schema-after. The output contract defines what the agent must produce. The agent is built to meet the contract. The specific validation mechanism (Zod, JSON Schema, Pydantic, native model structured output) will evolve — the principle of enforced, typed contracts will not.

---

### 6. Provenance Chains

Every consequential output traces back through an unbroken chain: source evidence -> reasoning -> intermediate outputs -> final output -> review -> decision. No gaps. No "trust me."

**The pattern:**
- Every node in the chain records: who created it (see Identity & Attribution, #14), when, from what inputs, using what method, with what confidence
- The chain is immutable and append-only — corrections create new entries, they don't overwrite
- Any output can be "walked back" to its originating evidence
- The chain is the audit artifact — it IS the proof, not a summary of the proof

**Why it endures:** Accountability is not optional for consequential systems. Regulators, auditors, boards, and customers will all ask "how did you get this answer?" The only durable answer is a chain they can follow.

**Design principle:** If you can't trace it, you can't trust it. If you can't trust it, you can't govern it.

---

### 7. Bounded Agency

Every agent has explicit, declared scopes, capabilities, and constraints. No agent has unbounded authority. The boundaries are part of the agent's definition, not just its prompt.

**The pattern:**
- Agent definition includes: what it CAN do, what it CANNOT do, what it MUST escalate
- Tool access is scoped — agents only have the tools they need
- Output authority is scoped — agents recommend within their domain, they don't decide outside it
- Boundary violations are detectable and logged
- Boundaries are distinct from identity (see #14) — bounded agency defines the *box*, identity defines *who's in it*

**Why it endures:** Unbounded autonomy is the failure mode of every agentic system that goes wrong. The fix is structural: define the box, enforce the box, detect when something tries to leave the box.

---

### 8. Governance Gates

Checkpoints before consequential actions. The system pauses, presents evidence, and requests authorization before proceeding with material decisions.

**The pattern:**
- Define which actions are "material" — not everything needs a gate
- Gate = pause + present evidence + request decision
- Gate action is recorded: who/what authorized, when, what they decided, why
- Override is allowed but must be justified and logged
- Gate thresholds can adapt (see Trust Ladders, #11)

**Gate resolution:** When a gate fires, the authorizer returns one of:
- **APPROVE** — proceed, with attestation recorded
- **REJECT** — halt, with justification recorded
- **MODIFY** — authorizer changes the output, creating a new artifact version that re-enters Ring 1 for verification
- **DEFER** — keep paused, return later
- **ESCALATE** — route to higher authority

**Two gate classes:**
- **Adaptive gates** — trust-dependent. Can relax as the system demonstrates reliability. Controlled by Trust Ladders (#11).
- **Mandatory gates** — always active regardless of trust level. Legally required, regulatorily mandated, or organizationally non-negotiable.

**Why it endures:** The enduring pattern is not "human in the loop" specifically — it is **"checkpoint before consequential action."** Today, most checkpoints require human authorization. As regulatory frameworks and algorithmic accountability mature, some checkpoints may be satisfied by automated authorization with sufficient audit trail. The primitive endures because *some form of checkpoint* will always be needed before irreversible, consequential actions. What evolves is who or what can satisfy the checkpoint — human, algorithmic, or hybrid.

---

### 9. Policy as Code

Governance rules are explicit, versioned, executable objects — not hidden in prompts, not dependent on human memory, not buried in committee meeting notes.

**The pattern:**
- Rules are declared as structured objects (not natural language in prompts)
- Each rule has: ID, version, conditions, thresholds, actions, effective date
- Rules are evaluated programmatically against case data
- Decisions reference the specific policy version that was applied
- "What if" analysis: replay past decisions under new/proposed policies

**Why it endures:** The alternative — governance rules embedded in prompts or human judgment — is invisible, unversioned, and unreproducible. Every audit, every regulatory inquiry, every "why did we decide that?" question requires explicit, inspectable rules.

**Scope and limits:** Policy-as-code works well for quantifiable rules (thresholds, limits, required approvals, data classification constraints). It is less suited for qualitative judgment ("use reasonable care," "consider reputational risk"). The realistic scope is: encode what can be encoded, and make explicit which governance decisions still require human judgment. Claiming all policy can be code is overreach. Claiming none can be is abdication.

---

### 10. Event-Driven Observability

Every material action emits a structured event. The event stream is the foundation for real-time monitoring, retrospective audit, pattern detection, and system learning.

**The pattern:**
- Common event envelope: event_id, timestamp, actor (see Identity, #14), action, target, state_change, context
- Events are emitted at agent boundaries, tool calls, gate decisions, human actions
- Events are immutable and append-only
- The event stream feeds: dashboards, alerts, audit trails, analytics, learning loops

**Why it endures:** You cannot govern what you cannot see. Observability is not a feature — it's a prerequisite for every other primitive. Without events, there are no provenance chains, no validation evidence, no trust ladders, no self-improvement signal.

**Relationship to Agentic Observability concept:** This primitive is the atomic unit. The Agentic Observability platform is what you build when you make event-driven observability a product.

---

### 11. Trust Ladders

Systems earn autonomy through demonstrated reliability. Verification intensity is high early, decreases as the system proves itself, and re-escalates when anomalies are detected.

**The pattern:**
```
Low trust (new system, new context):
  -> Full verification, all layers, human gates active

Medium trust (N successful runs, consistent quality):
  -> Reduced verification, human gates on exceptions only

High trust (proven reliability on this task profile):
  -> Minimal verification, human oversight by exception

Anomaly detected at any level:
  -> Trust level drops, verification re-escalates
```

**Two operating speeds:**
- **Slow path (Ring 3):** Systematic trust adjustment based on patterns across many executions. Periodic review cycles. This is how trust climbs.
- **Fast path (sentinels):** Trip wires that fire in near-real-time when specific anomaly patterns occur. Three consecutive failures, sudden quality score drop, cost spike. This is how trust degrades — immediately, not at the next weekly review.

**Key design decisions:**
- **Trust is earned, not configured.** Based on empirical data from execution history.
- **Trust is contextual.** A system trusted for one task/document type starts at low trust for a new type.
- **Trust degrades faster than it builds.** Earning trust takes many successful runs. Losing it takes one anomaly. This asymmetry is by design.
- **Trust affects adaptive gates only.** Mandatory gates (see #8) are immune to trust level changes.

**Why it endures:** The tension between efficiency (less human oversight) and safety (more human oversight) never goes away. Trust ladders are the mechanism that resolves it dynamically rather than statically.

**Empirical calibration (Mar 2026):**
Anthropic's agent autonomy research (published analysis of millions of API interactions) provides the first real-world trust evolution data:
- New users auto-approve 20% of agent sessions
- By 750 sessions, auto-approval reaches 40%
- Behavioral shift: experienced users move from pre-approval gating to active monitoring (interrupting 9% of turns vs. 5% for beginners)
- The deployment gap: models can handle 5-hour tasks, but 99.9th percentile session runs only 42 minutes — trust, not capability, is the bottleneck

This confirms trust ladders are an empirical pattern, not just a design principle. The 20% → 40% curve over 750 sessions is a baseline calibration for any trust ladder implementation.

**Academic framework (Feb 2026):**
DeepMind's "Intelligent AI Delegation" paper (Tomašev, Franklin, Osindero — arXiv 2602.11865) proposes an adaptive delegation framework with six components that map to trust ladder mechanics:
1. Task allocation (which agent handles what)
2. Authority transfer (what autonomy is granted)
3. Accountability mechanisms (who is responsible for outcomes)
4. Role specifications (bounded agency — what's in/out of scope)
5. Intent clarity (what the delegator actually wants)
6. Trust-building protocols (how trust is earned and maintained)

The paper argues delegation must be *adaptive* — trust builds or degrades based on observed outcomes, not static configuration. This matches the trust ladder pattern exactly and provides the interface contract for implementation.

---

### 12. Memory-Augmented Reasoning

Agents pull from persistent memory and knowledge bases to incorporate recent learnings, decisions, and context — not just their training data and current prompt.

**The pattern:**
- Before execution: agent queries relevant memory/KB for recent context
- During execution: agent can reference prior decisions, patterns, learnings
- After execution: significant findings are written back to memory/KB
- The memory layer is shared across agents and sessions — it's organizational knowledge, not session state

**Key design decisions:**
- **What goes to memory vs. KB vs. nowhere:** Not everything is worth persisting. Routing rules matter.
- **Freshness:** Recent entries weighted higher. Stale entries decay or are reviewed.
- **Relevance filtering:** Agents get relevant context, not everything. Semantic search, topic filtering, recency.

**Why it endures:** Stateless agents are useful but limited. Any system that needs to improve over time, maintain organizational context, or avoid repeating mistakes needs persistent memory. The models will get better context windows, but organizational memory is a different problem than context length.

---

### 13. Error Handling & Recovery

Agentic systems are distributed, non-deterministic systems. Failure is not exceptional — it is expected. Every governed agentic system needs explicit patterns for detecting, handling, and recovering from failures without losing state or producing silent corruption.

**The pattern:**
- **Retry with backoff** for transient failures (model timeout, API rate limit, provider outage)
- **Checkpointing** at stage/ring boundaries — save state so recovery resumes from last good checkpoint, not from scratch
- **Graceful degradation** — if an optional component fails (e.g., cross-model verification unavailable), continue with reduced confidence and flag the degradation explicitly
- **Compensation** — if an agent took a side effect (wrote to a DB, called an external API, sent a notification) before failing, undo it or mark it as provisional
- **Circuit breaker** — if a dependency fails N times in a window, stop calling it and route to fallback path

**Key design decisions:**
- **Failure classification matters.** A model timeout (transient) requires a different response than schema validation failure (deterministic) or a semantically nonsensical output (quality). Each class has its own recovery path.
- **Partial completion is real.** A six-stage pipeline that fails at stage 4 has three stages of valid work. Checkpointing preserves that work. Re-execution from scratch is waste.
- **Silent failure is worse than loud failure.** A system that produces a plausible-looking but incorrect output (hallucinated with confidence) is more dangerous than one that crashes. Error handling must include detection of outputs that are structurally valid but semantically wrong — which connects to Validation Loops (#2) and Adversarial Critique (#4).

**Why it endures:** Every distributed system needs a failure model. Agentic systems add non-determinism (model outputs vary), external dependency fragility (API providers have outages), and the possibility of confident-but-wrong outputs. These failure modes don't disappear with better models — they shift shape. The recovery patterns are constant even as the specific failure modes evolve.

---

### 14. Identity & Attribution

Every agent in a system has an authenticated, inspectable identity. Identity answers "who did this" with structural guarantees — not just "which prompt was used" but which specific agent instance, under what authority, operating on whose behalf.

**The pattern:**
- **Agent identity:** agent_id, version, configuration hash — uniquely identifies the specific agent configuration that produced an output
- **Model provenance:** which model, which version, which provider — required for regulatory contexts where "which AI system" is a compliance question
- **Delegation chain:** who authorized this agent to act, under what authority, with what scope — connects to Bounded Agency (#7)
- **Tenant scoping:** whose data is this agent operating on — required for multi-tenant systems and data isolation

**Implementation protocols (per NIST NCCoE Agent Identity Concept Paper, Feb 2026):**
- **Cryptographic workload identity:** SPIFFE/SPIRE provides the identity substrate — each agent instance receives a SPIFFE Verifiable Identity Document (SVID) that cryptographically proves its identity without relying on network location or static secrets. SVIDs are short-lived and automatically rotated, eliminating the static credential problem that plagues 53% of community MCP servers (Astrix analysis). The SPIFFE trust domain maps naturally to our organizational trust boundaries in Cross-System Trust.
- **Authentication protocols:** OAuth 2.1 for user-delegated agent authority (which human authorized this agent to act on their behalf). OIDC for federated identity across organizational boundaries. JWT tokens for per-interaction authorization that carries through the delegation chain.
- **Attribute-based access control:** NGAC (Next-Generation Access Control) for fine-grained, policy-driven authorization that evaluates dynamically at runtime — replacing static role-based models that cannot express the context-dependent permissions agentic systems require. NGAC decisions map to our Ring 2 policy evaluation: the access control decision is a governance decision, and NGAC provides the formal algebra for expressing it.
- **Protocol-level identity in A2A/MCP:** A2A uses JWT/OIDC for inter-agent authentication. MCP does not yet enforce identity verification at the protocol level — a gap that our Security Fabric compensates for by requiring identity verification at every MCP tool invocation boundary regardless of protocol support.

**Why it endures:** Bounded Agency (#7) defines what an agent *can* do. Identity defines *who is doing it*. Provenance Chains (#6) record *what happened*. These three are distinct questions that all require answers in any accountable system. In multi-tenant, cross-organization, and regulated environments, "which agent did this" is a compliance question, not a debugging question. As agentic systems interact across organizational boundaries (agent-to-agent communication, marketplace models, federated systems), authenticated identity becomes a prerequisite for trust. The NIST NCCoE framing of agents as *actors* (not applications) confirms that agent identity must be first-class — agents need their own identity lifecycle, not borrowed human credentials.

**Relationship to other primitives:**
- Bounded Agency (#7) defines the box. Identity says who's in the box.
- Provenance Chains (#6) record what happened. Identity says who did it.
- Event-Driven Observability (#10) emits events. Identity provides the actor field.
- Trust Ladders (#11) calibrate autonomy. Identity provides the subject whose trust is being calibrated.

---

### 15. Adversarial Robustness

Agentic systems must be designed under the assumption that they will face adversarial inputs, compromised components, and intentional manipulation — not just honest failures. Security is not a feature added after the system works. It is a posture that informs how every primitive is implemented.

**The pattern:**
- **Input defense:** Every input to Ring 0 is treated as potentially adversarial. Prompt injection detection, input sanitization, context boundary enforcement.
- **Ring integrity:** Each ring verifies independently. Ring 1 does not trust Ring 0's output because Ring 0 produced it. Ring 2 does not trust Ring 1's PASS because Ring 1 said so. No ring trusts any other ring by default.
- **Containment:** If an agent is compromised, the blast radius is limited by Bounded Agency (#7). Compromised agents cannot escalate their own permissions. Lateral movement between pipelines requires authenticated identity (#14).
- **Trust manipulation defense:** Trust Ladders (#11) must detect patterns where an agent performs well on low-stakes tasks to earn trust, then exploits that trust on high-stakes tasks. Anomaly detection on the trust trajectory, not just the current trust level.
- **Memory and learning integrity:** Ring 3's Self-Improving Cycles (#3) must validate that execution data has not been poisoned before incorporating it. Memory writes are gated. Poisoned learning data that passes Ring 1 verification can corrupt the entire agent fleet if Ring 3 ingests it blindly.
- **Supply chain trust:** Models, tools, connectors, and plugins are dependencies with their own trust profiles. Model version changes, tool updates, and connector modifications must be verified — not silently absorbed.

**Key design decisions:**
- **Assume breach, not perfection.** The system is designed to limit damage when (not if) a component is compromised, an input is adversarial, or a dependency is malicious.
- **Defense in depth.** No single ring is the security boundary. Security is enforced at every ring and in the fabric between them. This is the zero trust principle applied to the ring architecture.
- **Detection and response, not just prevention.** Prevention fails. The Agentic Observability layer (the SIM concept) provides the detection, correlation, and response capabilities — consuming the event stream, running security-specific correlation rules, and triggering response playbooks.

**Why it endures:** Adversarial pressure increases with the value of the systems being attacked. As agentic systems handle more consequential decisions, the incentive to manipulate them grows. Better models don't eliminate adversarial risk — they make the attacks more sophisticated. The security posture (assume breach, defense in depth, verify explicitly) is the same posture that has governed critical infrastructure for decades. It endures because the threat model endures.

**Relationship to Security Architecture:** This primitive is the implementation of security principles within the agentic context. The three-level security model (Security Fabric, Security Governance, Security Intelligence) and the Security Response Bus provide the architectural home for these concerns. See [Security Architecture](#security-architecture).

---

### 16. Transaction & Side-Effect Control

Consequential agentic systems produce side effects — database writes, API calls, notifications, financial transactions, file modifications. These side effects require explicit lifecycle management that goes beyond error handling.

**The pattern:**
- **Side-effect classification:** Every action is classified as read-only, reversible, or irreversible. The classification determines the governance requirements (adaptive vs. mandatory gates) and the recovery options.
- **Pre-commit / commit / post-commit states:** Side effects are not fire-and-forget. They move through explicit lifecycle states. Pre-commit actions are provisional. Committed actions are recorded in the provenance chain. Post-commit validation confirms the action took effect as intended.
- **Idempotency:** Re-execution of the same action with the same inputs must produce the same result. Every action carries an idempotency key. Duplicate execution is detected and prevented.
- **Compensation:** When a committed side effect must be undone (context changed, policy invalidated, error discovered downstream), the system executes a defined compensation action — not a generic "undo." Compensation is itself a governed action, recorded in the provenance chain.
- **Stale-approval invalidation:** If context changes materially after an approval is granted but before the action is executed, the approval expires. No blind execution on stale authorization.
- **Partial-execution state:** When a multi-step action partially completes before failure, the system knows which steps succeeded, which are pending, and which need compensation. This state is recoverable from checkpoints.

**Key design decisions:**
- **Error handling is not transaction control.** Error Handling (#13) covers what happens when things *fail*. Transaction control covers what happens when things *partially succeed* — which is often more dangerous because the system is in an inconsistent state.
- **Irreversible actions get mandatory gates.** Any action classified as irreversible must pass through a mandatory Governance Gate (#8) regardless of trust level. You can earn the right to skip a quality spot-check, but you cannot earn the right to skip approval before an irreversible action.
- **The provenance chain records the full transaction lifecycle.** Not just "action taken" but "action proposed → approved → committed → confirmed" or "action proposed → approved → committed → context changed → compensation executed."

**Why it endures:** Side effects are where agentic systems interact with the real world. Every system that modifies external state needs transaction semantics — this is true for databases, for distributed systems, and for agentic workflows. The stakes increase as agents gain authority to take more consequential actions. The pattern endures because the problem endures: partial execution, stale authorization, and irreversible actions are permanent challenges.

---

### 17. Data Governance & Confidentiality

Agentic systems consume, transform, store, and transmit data — often across organizational boundaries, memory stores, and execution contexts. Data governance defines what data enters the system, how it flows, where it persists, and what protections apply at every stage.

This is not a security primitive (see Adversarial Robustness #15 for adversarial threats to data). This is a **data lifecycle primitive** — the rules that govern how data is handled regardless of whether an adversary is present.

**The pattern:**

- **Data classification at ingestion.** Every data input is classified before it enters Ring 0. Classification categories (public, internal, confidential, restricted, regulated) determine handling rules for the entire downstream pipeline. Classification is not optional metadata — it is a required field in the structured output schema.
- **PII detection and handling.** Personally identifiable information is detected at ingestion boundaries and tagged. Tagged PII triggers handling rules: redaction before storage in certain memory tiers, masking in observability events, consent-gated access, deletion rights enforcement. PII handling rules are policy (Ring 2) enforced by the Security Fabric at every ring boundary.
- **Consent and purpose binding.** Data collected under a stated purpose cannot be repurposed without consent. When an agent ingests user data for task A, that data is not automatically available for task B, memory consolidation, or Ring 3 learning — unless the consent scope permits it. Purpose binding travels with the data through the identity context.
- **Data lineage.** Every transformation of data is recorded in the provenance chain. The system can answer: where did this data originate, what transformations were applied, who authorized each transformation, and where has it been sent. Lineage is the data dimension of Provenance Chains (#6).
- **Memory privacy.** Memory-Augmented Reasoning (#12) stores observations, learnings, and context. Memory writes are gated: what enters persistent memory, what classification level it carries, how long it persists, and who can retrieve it. Memory is not a dumping ground — it is a governed data store.
- **Retention and deletion.** Data has a lifecycle. Retention policies define how long different data classifications persist. Deletion rights (GDPR Article 17, CCPA) require the ability to identify and purge specific data across all stores — execution logs, memory, provenance chains, Ring 3 learning datasets. Deletion is a governed action recorded in the provenance chain.
- **Cross-boundary data controls.** When data crosses organizational boundaries (agent-to-agent communication across tenants, API calls to external services, federated pipelines), classification-appropriate controls apply. Restricted data does not leave the organizational boundary without explicit governance gate authorization. The Security Fabric enforces boundary controls; Security Governance defines the policy.

**Key design decisions:**

- **Classification is a first-class schema field, not an annotation.** If the structured output schema does not include a classification field, the system cannot enforce data handling rules. This is a design-time requirement, not a runtime afterthought.
- **Memory governance is not optional.** Every write to persistent memory passes through a data governance check. What enters memory affects what the agent "knows" in future sessions — ungoverned memory writes are ungoverned learning (see Tension: Memory vs. Noise).
- **Deletion must be provable.** Regulatory deletion rights require not just deleting data, but proving it was deleted across all stores. The provenance chain records deletion events. Completeness of deletion is auditable.

**Why it endures:** Data governance is not an AI problem — it is a universal data management concern that every regulated industry has faced. GDPR, CCPA, HIPAA, and industry-specific regulations impose data handling requirements that do not disappear because the processor is an AI agent. As agentic systems handle more sensitive data and cross more organizational boundaries, the data governance requirements intensify. The patterns (classification, consent, lineage, retention, deletion) have governed enterprise data management for decades. They endure because the regulatory and ethical obligations endure.

**Relationship to other primitives:**
- Provenance Chains (#6) provides the lineage substrate. Data governance defines what lineage must capture.
- Memory-Augmented Reasoning (#12) is the primary data store this primitive governs.
- Policy as Code (#9) encodes the data handling rules. Data governance defines what policies are needed.
- Identity & Attribution (#14) provides the consent binding and purpose tracking through the identity context.
- Security Architecture — Data governance maps to the CSA ATF "Data Governance" domain, with policy in Security Governance and enforcement in Security Fabric.

**Aligns with:** CSA Agentic Trust Framework (Data Governance domain), EU AI Act Articles 10-12 (data governance for high-risk AI), GDPR Articles 5, 13-17, 25 (data protection principles, rights), ISO 42001 (AI management system data requirements).

---

### 18. Evaluation & Assurance

Governed agentic systems must be tested before deployment, not just monitored after. Evaluation & Assurance is the design-time counterpart to runtime verification — it determines whether a system should be deployed, not whether a specific output is correct.

This is not a runtime primitive. It is a **pre-deployment and continuous assurance primitive** that operates outside the ring processing pipeline. It gates whether the pipeline runs at all, and validates that configuration changes maintain system properties.

**The pattern:**

- **Pre-deployment evaluation.** Before a governed pipeline enters production (or before a configuration change is applied), an evaluation suite runs against it. The evaluation tests: does Ring 1 verification catch known-bad outputs? Do Ring 2 policies correctly gate known-dangerous actions? Does the Security Fabric detect known attack patterns? Do Trust Ladders correctly escalate for the right situations? Evaluation is a simulation run against the full ring stack, not a test of individual components.
- **Regression testing.** Every configuration change (prompt update, threshold adjustment, policy modification, trust level change) triggers a regression suite. The regression suite verifies that the change does not degrade known-good behaviors. Ring 3 (Learning) produces configuration changes — Evaluation & Assurance validates them before they go live.
- **Adversarial testing / red-teaming.** Deliberate adversarial inputs are run against the full pipeline to test its robustness. This is not Adversarial Critique (#4), which challenges individual outputs at runtime. This is pre-deployment adversarial testing of the system's defenses — prompt injection attempts, goal hijack scenarios, privilege escalation probes, memory poisoning sequences. The red team attacks the pipeline; the evaluation framework scores how well the pipeline detects and contains the attacks.
- **Policy test harnesses.** Policy as Code (#9) defines rules that govern agent behavior. Policy test harnesses verify that policies behave as intended: given this context, does the policy produce the expected PASS/HALT/GATE decision? Policy changes that produce unexpected decisions in the test harness do not deploy.
- **Simulation environments.** Evaluation requires a simulation environment that mirrors production but does not produce real side effects. Tool calls are mocked or sandboxed. External API calls are intercepted. Database writes go to test stores. The simulation environment must be realistic enough that evaluation results predict production behavior — but isolated enough that evaluation failures cause no harm.
- **Approval criteria for configuration changes.** Not all changes are equal. A prompt tweak to improve formatting is low-risk. A policy change that expands an agent's tool access is high-risk. Evaluation & Assurance defines risk tiers for configuration changes and maps them to approval requirements — low-risk changes pass with automated evaluation only, high-risk changes require human review of evaluation results, critical changes require both evaluation and staged rollout with monitoring.
- **Continuous assurance.** Evaluation is not a one-time gate. Production systems are continuously re-evaluated against evolving evaluation suites. When the threat landscape changes (new OWASP threats, new attack patterns), the evaluation suite is updated and the production system is re-validated. When evaluation criteria change, the system's assurance level may change — triggering re-review.

**Key design decisions:**

- **Evaluation gates deployment, not execution.** This primitive operates outside the ring pipeline. It determines whether a pipeline configuration should be deployed. Once deployed, runtime verification (Ring 1) and governance (Ring 2) handle individual outputs. Evaluation & Assurance is the gate before the gate.
- **Ring 3 changes are the most critical evaluation target.** Ring 3 (Learning) produces configuration changes — prompt updates, threshold adjustments, trust level modifications. These changes affect how every subsequent execution is governed. A Ring 3 change that weakens Ring 1 verification is a governance regression. Evaluation & Assurance catches it before it deploys.
- **Red-teaming must be ongoing, not periodic.** The threat landscape evolves. An evaluation suite that tested for 2025 attack patterns but not 2026 patterns gives false assurance. Red-team scenarios must be updated as the threat landscape evolves — informed by OWASP updates, MITRE ATLAS additions, Security Intelligence findings from production, and external vulnerability disclosures.

**Why it endures:** Every safety-critical industry requires pre-deployment assurance. Aviation has type certification. Medical devices have clinical trials. Financial systems have stress tests. Software has CI/CD pipelines with automated testing. The principle that systems must demonstrate safety and correctness before deployment is not new — it is the fundamental assurance pattern. For agentic systems, the assurance challenge is harder (non-deterministic outputs, adversarial environments, evolving configurations) but the principle is the same. No governed system should enter production without passing its evaluation suite. No configuration change should deploy without regression validation.

**Relationship to other primitives:**
- Adversarial Critique (#4) is a runtime pattern. Evaluation & Assurance is a design-time/pre-deployment pattern. They are complementary, not redundant.
- Self-Improving Cycles (#3) produces changes. Evaluation & Assurance validates them before deployment.
- Policy as Code (#9) defines rules. Policy test harnesses verify the rules behave as intended.
- Adversarial Robustness (#15) is the security posture. Red-teaming tests whether the posture holds.

**Aligns with:** NIST AI RMF Measure function (evaluate AI systems), EU AI Act Articles 9-10 (testing and validation for high-risk AI), AgentSpec runtime constraint testing (ICSE 2026), UK AI Safety Institute Inspect AI framework (100+ pre-built evaluations), METR model evaluation methodology.

---

### 19. Agent Environment Governance

Every agent operates within a substrate — context, instructions, tools, workspace, memory — that defines what the agent IS before it acts. The environment is not incidental to agent behavior. **It is the primary control surface.** An agent's context is its reality: control what an agent sees, and you control what it thinks. Optimize what an agent has access to, and you optimize what it can do.

The framework's other primitives govern agent behavior — what agents produce, how their outputs are verified, how decisions are gated, how actions are bounded. This primitive governs the **operating environment** that all agents depend on: the composition of their context, the architecture of their instructions, the provisioning of their capabilities, the boundaries of their workspace, and the lifecycle of their memory.

This is not a performance optimization concern. It is a governance concern. Context composition determines what an agent considers, prioritizes, and ignores. Instruction architecture determines what an agent values and how it reasons. Tool provisioning determines what an agent can do. Workspace scoping determines what an agent can reach. These are governance decisions with governance consequences — and in governed systems, they must be governed explicitly.

**The pattern:**

- **Context composition governance.** What information enters an agent's context window, in what priority order, and with what lifecycle. Context is a finite, precious resource (Anthropic's "finite attention budget") — every token that enters displaces another. Composition policy defines: what is always present (system instructions, identity context, active policy), what is loaded on demand (task-specific knowledge, retrieved documents, tool descriptions), and what is explicitly excluded (irrelevant history, out-of-scope data, information above the agent's clearance level). The governing principle: **the smallest set of high-signal tokens that maximize the likelihood of the desired outcome.** Context composition is not an optimization problem alone — it is a governance problem, because the composition determines what the agent considers and what it is blind to.

- **Instruction architecture.** The agent's "DNA" — system prompts, rules files, persona definitions, behavioral constraints — treated as a versioned, tested, governed artifact. Instruction changes are configuration changes with behavioral consequences. A prompt tweak that shifts an agent's reasoning style, a rules update that changes priority ordering, a persona modification that alters tone — these are not cosmetic changes. They change what the agent IS. Instruction architecture requires: version control (every instruction state is traceable), testing against Evaluation & Assurance (#18) before deployment, rollback capability when instructions degrade performance, and structured decomposition (labeled sections — background, instructions, tool guidance, output format — following Anthropic's "right altitude principle").

- **Capability provisioning.** Which tools, skills, and resources are available to an agent — not just permission to use them (that's Bounded Agency #7), but the governed process of discovery, selection, scoping, and lifecycle management. An agent with 50 tools available performs worse than one with 5 well-chosen tools — tool bloat degrades reasoning quality. Provisioning governance defines: what tools are in the agent's active set (static provisioning), how the agent discovers additional tools when needed (dynamic discovery via vector search or semantic matching), how tool descriptions are curated for the agent's context (tool descriptions ARE context — and are subject to context composition governance), and how tool access changes over time (tool rotation, deprecation, upgrade paths). For MCP-based systems, this includes MCP server authorization, tool schema verification, and dynamic tool discovery governance (see Middleware/Interrupt deployment mode).

- **Workspace scoping.** Least-privilege applied to the agent's information and execution space — what files, repositories, APIs, databases, and services the agent can see and touch. Workspace scoping is the spatial equivalent of Bounded Agency (#7): where Bounded Agency limits what an agent CAN DO, workspace scoping limits what an agent CAN REACH. The scoping decision is a governance decision: too narrow and the agent can't complete its task (requesting access, burning time and tokens on context recovery); too broad and the agent has unnecessary attack surface and cognitive load. Scoping policy should be task-proportional and subject to Trust Ladders (#11) — as trust builds, workspace boundaries can expand.

- **Session state management.** What an agent remembers within and across sessions — the lifecycle of short-term context, working memory, and persistent knowledge. Session state is not just Memory-Augmented Reasoning (#12) — it includes the entire ephemeral state that shapes the agent's current behavior: conversation history, tool results, intermediate work products, decision context, and handoff state. Session state governance defines: what persists across sessions (structured handoffs, learned conventions, calibrated trust levels), what is discarded (raw tool outputs, redundant conversation turns, expired context), what is compacted (summarized history that preserves decisions while discarding detail), and what is never written (sensitive data, personally identifiable information — governed by Data Governance #17).

- **Environment optimization loop.** The self-improving cycle that makes the agent's operating substrate better over time — Ring 3 (Learning) applied not to pipeline outputs, but to the environment itself. The optimization loop observes agent execution, measures environment effectiveness (context hit rate, tool selection accuracy, token efficiency, instruction adherence, task completion quality), identifies gaps (missing context that caused errors, wrong tools that wasted cycles, stale instructions that led to outdated patterns), proposes environment changes (updated instructions, revised tool sets, adjusted context priorities), validates changes through Evaluation & Assurance (#18), and deploys improvements. This is the mechanism by which an agent's operating environment gets better — more relevant, more efficient, more aligned — with every execution cycle. The optimization loop is itself governed: proposed changes are subject to the same ring architecture (Ring 1 verifies the change won't degrade, Ring 2 evaluates whether the change is within policy, #18 regression-tests before deployment).

**Key design decisions:**

- **Context composition is a governance decision, not just an engineering decision.** What an agent sees determines what it thinks. In governed systems, composition policy must be explicit, auditable, and subject to review — not left to implicit framework defaults or developer intuition. Composition policy is a Ring 2 artifact.

- **The environment optimization loop must be governed, not autonomous.** An unconstrained self-improving loop on the agent's own environment is a safety risk — the agent could optimize its own instructions to bypass governance constraints, expand its own tool access beyond authorized scope, or modify its own context composition to exclude governance-relevant information. The optimization loop proposes changes; governance validates them. Ring 3 suggests; Ring 2 approves; #18 tests.

- **Every ring's agents are subject to environment governance.** Ring 1 verification agents have their own context, tools, and instructions that must be composed, scoped, and optimized. Ring 2 governance agents have their own operating environment. Security Intelligence agents have their own substrate. The governance agent that manages other agents' environments has its own environment that must be governed. This creates a recursive pattern that terminates at a known trust anchor — typically human-authored configuration that is signed, versioned, and manually reviewed. The recursion is finite and auditable.

- **Environment composition is an attack surface.** If context is the primary control surface, then context manipulation is the primary attack vector. Tool poisoning (OWASP MCP03), prompt injection via contextual payloads (MCP06), and context injection (MCP10) all operate by manipulating what enters the agent's environment. Environment governance is therefore a security concern as much as a performance concern — and the Security Fabric must treat environment composition inputs (tool descriptions, retrieved documents, instruction files) as potentially adversarial content subject to input sanitization.

**Why it endures:** Every computing system has an operating environment that must be configured, secured, and maintained. Server configuration management (Ansible, Puppet, Chef), container orchestration (Kubernetes), and infrastructure-as-code (Terraform) are all expressions of the same principle: the runtime environment is a governed, versioned artifact — not an ad-hoc collection of implicit defaults. Agentic systems are no different. The agent's context window is its operating environment.

**Partial precursors exist and should be acknowledged.** The "prompt governance" literature (Douglas Jackson, "The Hidden Infrastructure of Prompt Governance," Dec 2025; CIO.com five-pillar prompt governance framework aligned with NIST AI RMF) treats instructions as governed artifacts requiring versioning, auditing, and lifecycle management — overlapping significantly with our instruction architecture component. IMDA Singapore's MGF for Agentic AI (Jan 2026) explicitly includes "operational environments" as something to be bounded and governed. NVIDIA OpenShell (Mar 2026) externalizes policy from the agent process with structured policy artifacts and audit trails — governance applied to the runtime sandbox. Microsoft Agent 365 provides organizational fleet governance. AGENTSAFE (Khan et al., Dec 2025) proposes a design-time/runtime/audit three-phase governance model that is the closest precedent to our substrate/runtime/lifecycle taxonomy. Anthropic calls it "context engineering," the AgentOS paper (arXiv, Feb 2026) proposes a full operating system metaphor, and LangChain calls context a "compiled view over a richer stateful system."

**What this primitive adds is the unification.** No existing work treats the *complete, composed* agent operating environment — context composition, instruction architecture, capability provisioning, workspace scoping, and session state management — as a *single* governed, versioned, auditable primitive. Individual components are governed elsewhere: prompts (prompt governance literature), actions (AgentSpec, OWASP), identity/access (SAGA, NIST NCCoE), runtime infrastructure (OpenShell), tools (MCP governance). The specific framing of the *composed environment itself* as the unit of governance — with a self-improving optimization loop subject to the same ring architecture that governs agent behavior — is where this primitive's contribution lies.

**Relationship to other primitives:**
- Bounded Agency (#7) limits what an agent CAN DO. Environment Governance limits what an agent CAN SEE and REACH — and ensures what it sees is optimal, not just permitted.
- Memory-Augmented Reasoning (#12) covers persistent memory. Environment Governance covers the full operating substrate: context composition, instructions, tools, workspace, session state — with memory as one component.
- Policy as Code (#9) defines governance rules. Environment Governance treats the environment configuration ITSELF as a policy artifact — who composed this context, under what policy, and is that composition auditable?
- Self-Improving Cycles (#3) improves pipeline performance. The environment optimization loop improves the agent's own substrate — the most direct lever for practical performance gains.
- Evaluation & Assurance (#18) validates changes before deployment. Environment changes — instruction updates, tool set modifications, context priority adjustments — are subject to #18 testing before they reach production agents.
- Adversarial Robustness (#15) defends against external threats. Environment governance recognizes that the environment itself IS the attack surface — context injection, tool poisoning, and instruction manipulation are environment-layer attacks.
- Identity & Attribution (#14) answers "who did this." Environment governance answers "in what environment" — and the environment state (which instructions, which tools, which context) is part of the provenance record for every agent action.

**Aligns with:** Prompt governance literature (Douglas Jackson, Dec 2025; CIO.com five-pillar framework — instruction lifecycle as governed artifact), AGENTSAFE design-time/runtime/audit three-phase governance (Khan et al., Dec 2025 — closest taxonomic precedent), Agent Contracts resource budgets and conservation laws (Ye & Tan, Jan 2026 — 90% token reduction with contracted execution, validates capability provisioning governance), Anthropic context engineering principles (finite attention budget, JIT retrieval, compaction, right altitude principle), AgentOS semantic memory management and cognitive drift detection (arXiv, Feb 2026), LangChain context-as-compiled-view architecture, Microsoft Multi-Agent Reference Architecture orchestration context patterns, Microsoft MCP Governance four-layer framework (Feb 2026 — discovery/metadata, identity/credentials, content/data, infrastructure), NVIDIA OpenShell secure runtime environment (kernel-level isolation, per-binary/endpoint policy, audit trails), Google ADK tiered context architecture, Layered Governance Architecture (LGA, Mar 2026 — execution sandboxing, intent verification, zero-trust inter-agent auth, immutable audit with benchmarked outcomes), NIST SP 800-207 zero trust (least-privilege applied to information access), IMDA Agentic AI Governance Framework Dimension 1 (risk bounding via tool access restriction, sandboxed environments, operational environment governance).

---

## Agent Environment Architecture

> *This section expands on Agent Environment Governance (#19) with architectural detail on how environment governance manifests across the ring architecture and how the environment optimization loop operates.*

### The Environment Stack

Every agent's operating environment can be decomposed into five layers. Each layer has its own composition policy, lifecycle, and governance requirements:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Session State                                  │
│  (conversation history, tool results, working memory,    │
│   handoff context — ephemeral, session-scoped)           │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Retrieved Context                              │
│  (task-specific knowledge, documents, search results —   │
│   dynamic, loaded JIT per task)                          │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Capability Set                                 │
│  (active tools, skills, MCP servers, API access —        │
│   provisioned per role, subject to trust level)          │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Instruction Architecture                       │
│  (system prompts, rules, personas, behavioral            │
│   constraints — versioned, tested, slow-changing)        │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Identity & Policy Substrate                    │
│  (agent identity, ring assignment, governance policy,    │
│   trust level, workspace boundaries — foundational)      │
└─────────────────────────────────────────────────────────┘
```

**Composition flow:** Layers compose bottom-up. Layer 1 (identity and policy) determines what Layers 2-5 can contain. Policy substrate sets the boundaries; instructions operate within those boundaries; capabilities are provisioned within instruction scope; retrieved context and session state fill the remaining context budget.

**Governance intensity:** Layers 1-2 are slow-changing and high-governance (changes require #18 validation and Ring 2 approval). Layer 3 changes at role/task boundaries (governed by provisioning policy). Layers 4-5 change per-interaction (governed by composition policy but not individually approved).

**Context budget allocation:** The total context window is finite. Composition policy allocates budget across layers — typically: Layer 1 (5-10%), Layer 2 (10-20%), Layer 3 (10-15% for tool descriptions), Layer 4 (30-40%), Layer 5 (20-30%). These are starting points, not fixed allocations — the optimization loop adjusts ratios based on measured effectiveness.

### Environment Composition Patterns

Three patterns for composing the environment, aligned with the ring deployment modes:

**Static composition** (aligns with Wrapper mode): The full environment is composed before execution begins. All context, tools, and instructions are loaded upfront. Changes require a full recomposition. Best for batch pipelines and assessment workflows where the task scope is known in advance.

**JIT composition** (aligns with Middleware mode): The environment starts with Layers 1-3 (identity, instructions, tools) and loads Layers 4-5 dynamically as the agent executes. The agent uses tools to retrieve context as needed — maintaining lightweight identifiers (file paths, queries, URLs) rather than pre-loading all potentially relevant information. This is Anthropic's recommended pattern: progressive disclosure through exploration. Best for coding agents, task agents, and multi-step workflows.

**Streaming composition** (aligns with Graph-Embedded mode): The environment is continuously updated as execution proceeds. Context enters and exits the window based on relevance scoring. Tool availability may change mid-execution based on task evolution. Session state is continuously compacted to maintain headroom. This requires the most sophisticated composition engine and the highest context management overhead. Best for conversational agents, real-time systems, and long-running sessions.

### The Environment Optimization Loop

The self-improving cycle for the agent's operating substrate:

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  1. OBSERVE — Measure environment effectiveness           │
│     • Context hit rate (did the context contain           │
│       what the agent needed?)                             │
│     • Tool selection accuracy (did the agent use          │
│       the right tools?)                                   │
│     • Token efficiency (how much context was              │
│       actually used vs. loaded?)                          │
│     • Instruction adherence (did the agent follow         │
│       its instructions?)                                  │
│     • Task completion quality (did the environment        │
│       enable a good outcome?)                             │
│                                                           │
│  2. IDENTIFY — Find environment gaps                      │
│     • Missing context that caused errors or               │
│       hallucinations                                      │
│     • Unused tools that wasted context budget             │
│     • Stale instructions that led to outdated patterns    │
│     • Workspace boundaries that were too narrow           │
│       (access requests) or too broad (unused access)      │
│     • Session state that was lost at compaction           │
│       and later needed                                    │
│                                                           │
│  3. PROPOSE — Generate environment improvements           │
│     • Updated instructions (clearer, more precise)        │
│     • Revised tool sets (add missing, remove unused)      │
│     • Adjusted context priorities (promote what           │
│       was needed, demote what wasn't)                     │
│     • Modified workspace boundaries (right-size)          │
│     • Improved compaction policy (preserve more           │
│       of what matters)                                    │
│                                                           │
│  4. VALIDATE — Test changes before deployment             │
│     • Evaluation & Assurance (#18) regression tests       │
│     • Ring 1 verification: does the new environment       │
│       produce equal or better outcomes?                   │
│     • Ring 2 governance: does the change stay within      │
│       policy boundaries?                                  │
│     • Security review: does the change expand             │
│       attack surface?                                     │
│                                                           │
│  5. DEPLOY — Apply validated improvements                 │
│     • Staged rollout (canary → wider deployment)          │
│     • Monitoring for regressions                          │
│     • Rollback capability if quality degrades             │
│                                                           │
│  ────────────────── cycle repeats ──────────────────────  │
└──────────────────────────────────────────────────────────┘
```

**Governance constraint:** The optimization loop PROPOSES changes. It does not autonomously apply them. This is critical — an unconstrained optimization loop on the agent's own environment could:
- Optimize instructions to bypass governance constraints ("I work better without policy checks")
- Expand tool access beyond authorized scope ("I need this tool I'm not supposed to have")
- Modify context composition to exclude governance-relevant information ("This audit context is low-signal")
- Adjust trust levels in its own favor ("I've been performing well, promote me")

Each of these is a governance violation disguised as optimization. The validation step (step 4) exists to catch them. Ring 2 evaluates whether the proposed change stays within policy. Evaluation & Assurance tests whether the change maintains system properties. Human review gates high-risk environment changes (instruction rewrites, tool access expansion, workspace boundary changes).

**Termination condition:** The optimization loop operates within an improvement budget — analogous to Validation Loops' (#2) iteration budgets. If N consecutive proposals are rejected by Ring 2 validation (recommended starting threshold: 3), the loop pauses and surfaces the constraint conflict for human review rather than cycling indefinitely. The conflict signal ("the optimization loop wants X, but governance policy prevents X") is itself valuable — it identifies where environment policy may need human reconsideration, or where the optimization loop's objective function is misaligned with governance intent.

### Context as Attack Surface

The agent's environment is simultaneously the primary optimization target AND the primary attack surface. This dual nature is unique to Agent Environment Governance and creates a tension that the Security Architecture must address:

| Attack Vector | Environment Layer Targeted | Defense |
|--------------|---------------------------|---------|
| **Prompt injection** | L2 (Instructions) — attempting to override system instructions | Security Fabric input sanitization + instruction integrity verification |
| **Tool poisoning** (OWASP MCP03) | L3 (Capability Set) — malicious tool descriptions injected into context | Supply chain trust policy + tool schema verification |
| **Context injection** (OWASP MCP10) | L4 (Retrieved Context) — sensitive or manipulative content in retrieved documents | Data Governance (#17) classification + Fabric content scanning |
| **Memory poisoning** (OWASP ASI06) | L5 (Session State) — slow corruption of session memory | Intelligence memory introspection + compaction-time integrity checks |
| **Environment drift** | All layers — gradual, undetected shift in environment composition | Environment optimization loop observation + baseline comparison |

The key insight: **defense-in-depth at the environment layer means treating every environment input as untrusted.** Tool descriptions are untrusted content (they enter the context window and influence agent reasoning). Retrieved documents are untrusted content. Session state from prior interactions is untrusted content (it may have been influenced by adversarial inputs). Only Layers 1-2 (identity/policy substrate and instruction architecture) are trusted — because they are human-authored, version-controlled, and validated through #18.

### The Recursive Governance Problem

If an agent manages other agents' environments, who manages THAT agent's environment? This is the same recursive trust problem that appears in Security Architecture (Known Limitation #5: intelligence integrity).

The resolution follows the same pattern:

1. **The recursion is finite.** In practice, you have 2-3 levels: agents → environment manager → human-authored root configuration. The root configuration is the trust anchor — signed, version-controlled, manually reviewed.
2. **Each level is governed by the level above.** An environment manager agent operates within an environment composed by its own environment manager (or directly by human configuration). The governance guarantees apply at each level.
3. **The root environment is static and human-controlled.** The outermost environment (the environment manager's own instructions, tools, and workspace) is not self-optimizing. It is manually authored and changes through the same human-reviewed process as any critical configuration. This is the "bootstrap" environment — it must be correct by construction, not by optimization.
4. **Monitoring is external.** Ring 3 and Security Intelligence observe environment manager behavior from outside the managed environment, providing independent verification that the manager is operating within its authorized scope.

> *This section references the Rings Model (Ring 0-3) and Fabric concepts defined in the next section. Readers unfamiliar with the ring architecture may wish to read [The Rings Model](#the-rings-model) first, then return here.*

Security in governed agentic systems is not a ring, not a layer, and not a feature. It is a **pervasive architectural concern** that operates simultaneously at every level of the system. This is the consensus of the major frameworks: NIST SP 800-207 treats zero trust as a posture, CSA's Agentic Trust Framework governs across five cross-cutting domains, and OWASP's Top 10 for Agentic Applications maps threats across the entire agent lifecycle — model layer, tool ecosystem, memory architecture, and inter-agent communication.

The key architectural insight: **security is the strongest argument FOR the rings model.** Because security is pervasive — operating at every boundary, within policy evaluation, and across behavioral detection — a composable ring architecture with zero trust overlay handles it better than a monolithic control plane or a single security layer.

### The Three-Level Security Model

Security operates at three distinct levels with different temporal characteristics, enforcement mechanisms, and failure modes:

#### Level 1: Security Fabric — Enforcement at Every Boundary

The fabric is the embedded security substrate within every ring and at every ring boundary. It is always active, synchronous, and operates at wire speed.

**What it does:**
- **Input sanitization** — every input to any ring is treated as potentially adversarial. Prompt injection detection, context boundary enforcement, payload validation.
- **Output scanning** — every output is inspected before crossing a ring boundary. Known pattern detection, classification markers, integrity assertions.
- **Runtime containment** — sandboxing, resource limits, execution isolation. If an agent is compromised, the blast radius is bounded by the fabric.
- **Ring integrity verification** — each ring verifies that it has not been tampered with and that its configuration matches its authorized state.
- **Identity enforcement** — per-interaction cryptographic identity verification at every ring boundary (aligned with SAGA's per-interaction access control pattern). No ring trusts the output of another ring based on origin alone.
- **Objective attestation (two tiers):**
  - **Configuration integrity attestation (implementable now):** At each ring boundary, the agent's control-plane configuration (system instructions, tool allowlists, policy versions, model identifiers) is verified against a signed manifest created at deployment. Divergence from the signed manifest triggers containment. This is analogous to TPM/TEE platform attestation applied to agent configuration state.
  - **Semantic goal-state attestation (research horizon):** Cryptographic verification that an agent's behavioral objectives have not been manipulated — proving not just that the configuration is intact, but that the agent is pursuing its authorized goals. This requires formalizing "goal state" in a way that can be cryptographically verified, which is beyond current technology for LLM-based agents. Recent research (Mind the GAP, Feb 2026) demonstrates that text-level safety behavior does not reliably transfer to tool-call behavior, meaning goal integrity cannot be inferred from a single surface. This tier is a roadmap item, not a current capability.
  - Together, these address goal hijack (OWASP ASI01). Configuration attestation catches tampering with the control plane. Behavioral drift detection via Security Intelligence catches semantic goal manipulation over time. Full semantic goal attestation remains a research frontier.

**Temporal characteristic:** Per-interaction. Microseconds to milliseconds. Must not introduce latency that degrades the system's functional performance.

**What it is NOT:** The fabric does not make semantic judgments. It detects syntactically identifiable threats and enforces mechanical constraints. A carefully worded adversarial prompt that is syntactically clean passes the fabric — and must be caught by Governance or Intelligence (see below).

**Aligns with:** NIST SP 800-207 (zero trust enforcement points), SAGA cryptographic access control (NDSS 2026), CSA ATF identity and segmentation domains.

#### Level 2: Security Governance — Policy Evaluation for Security Decisions

Security policy is policy. It lives in Ring 2, evaluated by Policy as Code (#9), enforced through Governance Gates (#8). Security governance makes the decisions that the fabric enforces.

**What it does:**
- **Access control policy** — who (which agents, which models, which humans) can do what (which tools, which data, which actions) under what conditions (trust level, risk classification, context).
- **Data classification and handling** — PII rules, consent scope, data residency, retention policy, redaction requirements. What data enters persistent stores. What data crosses organizational boundaries.
- **Irreversible-action authorization** — any action classified as irreversible by Transaction & Side-Effect Control (#16) must pass through a mandatory governance gate regardless of trust level. Security governance defines which actions are irreversible.
- **Supply chain trust policy** — which models, tools, connectors, and plugins are authorized. Version pinning, integrity verification requirements, trusted source lists. Policy defines the trust posture; fabric enforces it at runtime. For MCP-based systems, this includes: server identity verification, tool schema integrity checks (detecting tool poisoning and rug-pull attacks — OWASP MCP03), authorized server registries, and dynamic tool discovery governance. The OWASP MCP Top 10 identifies that 53% of community MCP servers use insecure static API keys (Astrix analysis, 2025); supply chain policy must enforce short-lived, scoped credentials (OWASP MCP01) and reject servers that cannot prove identity.
- **Semantic security evaluation** — when the fabric flags content for semantic review (syntactically clean but potentially adversarial), governance evaluates it against security policy. This is the defined interface between fabric (fast, syntactic) and governance (slower, semantic). Accept the performance cost — semantic threats require semantic evaluation.

**Temporal characteristic:** Per-decision. Milliseconds to minutes. Policy evaluation is fast. Governance gates for high-stakes security decisions may pause for human review.

**Aligns with:** AgentSpec policy-as-code runtime constraints (ICSE 2026, 90%+ prevention rates), CSA ATF segmentation and data governance domains, EU AI Act Articles 9-15 for high-risk systems.

#### Level 3: Security Intelligence — Detection, Correlation, and Response

Security intelligence is the SIEM pattern applied to agentic systems. It lives in the observability layer, consuming the event stream from all rings, running security-specific correlation rules, and triggering response playbooks.

**What it does:**
- **Behavioral anomaly detection** — baseline agent behavior and detect divergence. Trust manipulation patterns (performing well on low-stakes tasks to earn trust, then exploiting it on high-stakes tasks). Behavioral drift over time.
- **Cross-pipeline correlation** — detect attack patterns that span multiple agents or pipelines. Lateral movement, coordinated behavior changes, cascading failures. A quality degradation pattern in one pipeline that correlates with a privilege escalation in another — that's a security event, not a quality event.
- **Memory and state introspection** — Intelligence has **read access to agent internal state** — memory stores, context windows, embedding stores, tool registries, loaded plugin manifests. This is not just observability over actions (the SIEM pattern) — it is introspection into agent internals (the EDR pattern). This distinction matters: slow memory poisoning (OWASP ASI06) is invisible to behavioral telemetry but detectable through memory-state drift analysis.
- **Human-agent interaction analysis** — approval cadence patterns, framing analysis, fatigue indicators. Detect when an agent is structuring its requests to exploit human cognitive biases (OWASP ASI09). This extends Intelligence beyond agent-behavior monitoring into interaction-quality monitoring.
- **Response playbooks** — defined response actions for detected threat patterns. Quarantine, trust degradation, blast radius containment, human escalation, forensic evidence preservation.

**Temporal characteristic:** Dual-speed.
- **Fast path (sentinels):** Near-real-time anomaly-triggered responses. Sub-second detection of known patterns.
- **Slow path (analysis):** Hours to days. Pattern analysis across many executions. Behavioral drift. Memory evolution tracking.

**Aligns with:** SentinelAgent (He et al., May 2025) — dynamic execution graph analysis for anomaly detection via OTel-based trace modeling, 92% accuracy at harmful behavior identification, maps to our fast-path sentinel design. AgentGuard (Koohestani et al., ASE 2025) — probabilistic runtime verification using online-learned MDP models, maps to our slow-path behavioral analysis. Pro2Guard (late 2025) — proactive probabilistic enforcement using discrete-time Markov chains, represents the evolution from reactive detection to anticipatory prevention. The three tools represent a spectrum: **deterministic enforcement (AgentSpec → Fabric/Policy as Code) → probabilistic verification (AgentGuard → Intelligence behavioral analysis) → proactive prediction (Pro2Guard → Intelligence anticipatory detection)**. CSA ATF behavior and incident response domains, MITRE ATLAS technique catalog.

### The Security Response Bus

The three security levels must coordinate, and **coordination latency is itself an attack surface.** A multi-agent lateral movement attack (OWASP ASI07 → ASI03 → ASI08) can cascade across three agents in under 3 seconds. If Intelligence detects at T+1s, requests Governance authorization at T+2s, and Governance triggers Fabric containment at T+3s — the attack has already completed.

**The Security Response Bus** is a pre-authorized fast-path from Intelligence directly to Fabric enforcement points, bypassing normal Governance deliberation for defined threat classes:

**How it works:**
1. **Governance pre-authorizes response classes.** "If Intelligence detects lateral movement pattern X, Fabric may immediately isolate the affected agents." These authorizations are versioned policy, recorded in the provenance chain, and auditable.
2. **Intelligence triggers pre-authorized responses.** When a detection matches a pre-authorized threat class, Intelligence sends a containment signal directly to Fabric — no Governance round-trip.
3. **Fabric executes containment.** Circuit breakers fire, agents are isolated, blast radius is bounded.
4. **Governance is notified post-facto.** The response is recorded, the evidence is preserved, and Governance can validate or escalate.

**The principle:** Pre-authorized response for time-critical threats. Full governance deliberation for everything else. The pre-authorization is the governance — it happens before the attack, not during it.

**What this is NOT:** A bypass of governance. Governance defines the response classes and pre-authorizes them. Intelligence cannot trigger containment for threat patterns that Governance has not pre-authorized. The fast-path is constrained, not unbounded.

### Zero Trust as Security Posture

Zero trust is the **security philosophy** that informs how every primitive is implemented and how every ring operates. It is not a feature — it is the architectural assumption that runs through everything.

#### Core Principles Applied to Agentic Systems

| Zero Trust Principle | Agentic Application |
|---------------------|-------------------|
| **Never trust, always verify** | No ring trusts another ring's output by default. Ring 1 independently verifies Ring 0. Ring 2 independently evaluates policy. Trust is earned through Trust Ladders (#11), not assumed. |
| **Least privilege** | Bounded Agency (#7). Agents have only the tools, data access, and authority they need for their declared scope. Nothing more. |
| **Assume breach** | Adversarial Robustness (#15). The system is designed to limit damage when a component is compromised, not to prevent all compromise. |
| **Verify explicitly** | Identity & Attribution (#14). Every action carries authenticated identity — agent, model, delegation chain, tenant, data scope. No implicit trust based on network location or system membership. |
| **Microsegmentation** | Ring isolation. Tenant scoping. Cross-pipeline interactions require mutual authentication. An agent's compromise does not propagate laterally without breaching identity boundaries. |

#### Identity as the Control Plane

In traditional zero trust, identity is the control plane — every request is authenticated and authorized regardless of network location. For agentic systems, identity is richer:

- **Agent identity** — which specific agent instance, configuration version, configuration hash
- **Model identity** — which model, which version, which provider, which fine-tune
- **Delegation chain** — who authorized this agent to act, under what authority, with what scope boundaries
- **Execution identity** — which run, which context, which inputs, which checkpoint
- **Data identity** — whose data is being processed, what classification level, what consent scope
- **Human identity** — who is the human in the governance loop, what authority do they hold

These bind together into an **identity context** that travels with every action through every ring. When a Governance Gate fires, the authorizer sees the full identity context. When Intelligence detects an anomaly, it knows exactly which agent, model, delegation chain, and data scope are involved.

### Mapping to the Agentic Threat Landscape

The three-level model addresses the OWASP Top 10 for Agentic Applications (2026) and CSA Agentic Trust Framework domains as follows:

#### OWASP Threat Mapping

**Responsibility assignment:** Each threat maps to exactly one **owning** security level (accountable for detection/prevention) and one **owning** primitive (provides the primary mechanism). Supporting levels and primitives provide defense-in-depth but do not own the response.

| Threat | Owner (Level) | Owner (Primitive) | Supporting | How It's Addressed |
|--------|--------------|-------------------|------------|-------------------|
| **ASI01 — Goal Hijack** | **Fabric** | **Adversarial Robustness (#15)** | Intelligence (drift detection), Environment Governance (#19 — context manipulation is a hijack vector) | Fabric verifies control-plane configuration against signed manifest at ring boundaries. Intelligence detects behavioral divergence over time. #19's instruction integrity verification catches environment-layer goal manipulation. Full semantic goal-state attestation is research-horizon (see Security Fabric). |
| **ASI02 — Tool Misuse** | **Governance** | **Bounded Agency (#7)** | Fabric (containment), Intelligence (anomaly) | Governance defines permitted tool parameters and action scopes via policy. Fabric enforces at runtime. Intelligence detects anomalous tool-use patterns. |
| **ASI03 — Identity & Privilege Abuse** | **Fabric** | **Identity & Attribution (#14)** | Governance (access policy), Intelligence (lateral movement) | Fabric cryptographically verifies identity at every ring boundary. Governance evaluates authorization. Intelligence detects privilege escalation. |
| **ASI04 — Supply Chain** | **Governance** | **Adversarial Robustness (#15)** | Fabric (integrity checks), Intelligence (behavioral drift), Environment Governance (#19 — capability provisioning governance) | Governance defines approved sources, version pins, trust tiers. Fabric verifies integrity hashes at load time. Intelligence detects behavioral changes post-load. #19's capability provisioning governance controls which tools/servers enter the agent's environment. |
| **ASI05 — Remote Code Execution** | **Fabric** | **Adversarial Robustness (#15)** | — | Fabric is the primary defense — execution isolation, input sanitization, environment hardening. |
| **ASI06 — Memory Poisoning** | **Intelligence** | **Memory-Augmented Reasoning (#12)** | Fabric (per-input sanitization), Environment Governance (#19 — session state management) | Slow poisoning via individually-benign inputs is invisible to per-boundary checks. Intelligence's memory-state introspection is the primary detection mechanism. #12's memory architecture defines what is protected; #19's session state management governs the memory lifecycle (what persists, what's compacted, what's discarded); Intelligence monitors for corruption. |
| **ASI07 — Inter-Agent Comms** | **Fabric** | **Identity & Attribution (#14)** | Intelligence (spoofing detection) | Fabric enforces mutual authentication and message signing. Identity context carries through all inter-agent exchanges. Intelligence detects spoofing and anomalous communication patterns. |
| **ASI08 — Cascading Failures** | **Intelligence** | **Error Handling & Recovery (#13)** | Fabric (circuit breakers via Response Bus) | Intelligence detects amplification loops across agents. #13's error propagation boundaries and Recovery Bus provide containment. Pre-authorized response triggers Fabric circuit breakers directly. |
| **ASI09 — Human-Agent Trust Exploitation** | **Intelligence** | **Trust Ladders (#11)** | Governance (approval constraints) | Intelligence monitors approval cadence, framing patterns, fatigue indicators. #11's trust calibration detects anomalous trust escalation. Governance enforces cooling-off periods and rate limits. |
| **ASI10 — Rogue Agents** | **Intelligence** | **Bounded Agency (#7)** | All three levels + Response Bus | Intelligence detects misalignment via behavioral baselines. #7 defines the operating envelope. Governance sets parameters. Fabric enforces kill switches. Response Bus ensures sub-second containment.  |

**Boundary clarification — #15 vs. #17 vs. Security Fabric vs. Ring 2:** Adversarial Robustness (#15) owns the *external threat surface* — attacks originating outside the system (injection, supply chain, code execution). Data Governance (#17) owns the *internal data lifecycle* — classification, consent, PII, retention, data lineage within the system boundary. The Security Fabric is the *enforcement mechanism* — it executes the protections that #15 and #17 define. Ring 2 (Security Governance) is the *policy authority* — it decides what #15 and #17 require; Fabric enforces those decisions at wire speed. In short: #15 = what to defend against, #17 = what to protect, Governance = who decides, Fabric = who enforces.

#### CSA Trust Framework Domain Mapping

| Domain | Primary Level | Supporting Levels |
|--------|--------------|-------------------|
| **Identity** | Fabric (cryptographic verification at every boundary) | Governance (identity policy), Intelligence (identity anomaly detection) |
| **Behavior** | Intelligence (behavioral baselines, anomaly detection) | Fabric (event emission for analysis), Governance (behavioral boundary policy) |
| **Data Governance** | Governance (classification policy, PII rules, consent) | Fabric (input validation, output scanning), Intelligence (data leakage pattern detection) |
| **Segmentation** | Governance (resource boundary policy, least privilege) | Fabric (runtime enforcement), Intelligence (boundary violation detection) |
| **Incident Response** | Intelligence (detection, playbooks) + Fabric (containment execution) via Security Response Bus | Governance (pre-authorization of response classes, post-incident review) |

### Known Limitations and Open Questions

The three-level model has been pressure-tested against the OWASP and CSA taxonomies. The following are known areas where the model requires continued iteration:

1. **Fabric/Governance boundary for semantic threats.** Syntactic threats → Fabric. Policy decisions → Governance. Semantic threats (adversarial prompts that are syntactically clean but semantically manipulative) require Governance-level evaluation invoked synchronously from the Fabric layer. The interface is defined, but the performance implications of synchronous semantic evaluation at wire speed need empirical testing.

2. **Intelligence introspection scope.** Intelligence needs read access to agent internal state for memory poisoning detection. How deep does introspection go? Full memory contents? Embedding store similarity distributions? Context window snapshots? The right scope likely varies by threat model and system classification.

3. **Pre-authorized response completeness.** The Security Response Bus requires Governance to pre-authorize response classes before an attack occurs. Novel attack patterns not matching any pre-authorized class fall back to full Governance deliberation — which may be too slow. The pre-authorization library must evolve as the threat landscape evolves.

4. **Human cognitive vulnerability scope.** ASI09 (Human-Agent Trust Exploitation) targets human cognition, which is outside the system boundary. Intelligence can detect interaction patterns, but the effectiveness of approval-fatigue detection and framing analysis against sophisticated manipulation is an open research question. Engels et al. (NeurIPS 2025) demonstrate that oversight efficacy degrades as the capability gap widens — success rates ranging from 9.4% to 51.7% across adversarial tasks in AI-to-AI oversight. The principle extends to human oversight: as agent capabilities increase, the gap between human overseer and agent system widens, making approval-level oversight increasingly fragile.

5. **Intelligence integrity — compromised Intelligence + Response Bus = denial-of-service.** Security Intelligence is the most powerful detection layer, but it is also a single point of trust. A compromised Intelligence layer that gains access to the Security Response Bus can trigger false containment — halting legitimate agent operations as a denial-of-service attack. Mitigations: (a) Response Bus activation requires cryptographic proof from Intelligence, not just a signal; (b) pre-authorized response classes limit the blast radius of a compromised Intelligence layer — it can only trigger responses that Governance has pre-approved, not arbitrary containment; (c) Governance retains a dead-man's-switch: if Intelligence triggers containment above a threshold rate, Governance automatically reviews and can override; (d) Intelligence itself should be subject to Ring 1 verification — its behavioral baselines are monitored by an independent verification layer. This is a recursive trust problem that cannot be fully eliminated — at some level, a component must be trusted. The mitigation strategy is defense-in-depth applied to the security infrastructure itself.

---

## The Rings Model

The primitives organize into concentric rings around a core agent task. Each ring wraps the inner rings, adding a layer of assurance. The rings define **where** each primitive operates and **when** it fires.

### Ring 0 — Core Execution

The producer. The agent doing the actual work — taking input, applying domain logic, producing structured output. This is the thing you're building when you build an agent.

**Primitives active:** Structured Output Persistence (#5), Bounded Agency (#7), Identity & Attribution (#14), Error Handling & Recovery (#13), Transaction & Side-Effect Control (#16 — side-effect classification and idempotency at the action level)

Identity and Error Handling appear here *and* in the cross-cutting fabric because they operate at two scales. At Ring 0, they are per-task concerns: this specific agent has this specific identity, and this specific execution handles its own transient failures (retry, checkpoint). At the fabric level, they are cross-ring concerns: identity propagates through the provenance chain across all rings, and recovery patterns (graceful degradation, compensation) coordinate across ring boundaries.

**Time horizon:** Per-task. Milliseconds to minutes.

**What it produces:** A structured artifact conforming to a declared schema. Not prose. Not "here's what I think." A typed, versioned data structure.

### Ring 1 — Verification

Wraps Ring 0. Evaluates the output before it goes anywhere. The question Ring 1 answers: **"Is this output correct?"**

**Primitives active:** Separation of Producer/Verifier (#1), Validation Loops with Convergence Gates (#2), Adversarial Critique (#4), Error Handling & Recovery (#13)

**Time horizon:** Per-output. Seconds to minutes.

**Behavior:**
- Receives structured output from Ring 0
- Runs verification layers (self-audit, cross-model, deterministic checks)
- If output passes quality threshold: forward to Ring 2
- If output fails + iterations remain: REVISE(quality) — send findings back to Ring 0 for re-production
- If output fails + iteration limit reached: escalate
- If verification layer fails: apply error handling — graceful degradation for optional layers, halt for mandatory layers

**Key property:** Ring 1 can loop back to Ring 0 multiple times. The validation loop with convergence gate is the control flow mechanism. Early exit on threshold pass. Hard cap on iterations. Diminishing returns detection.

### Ring 2 — Governance

Wraps Ring 1. Applies policy, enforces gates, records provenance. The question Ring 2 answers: **"Is this output authorized?"**

Correct (Ring 1) and authorized (Ring 2) are different questions. An output can be factually accurate but violate policy. An output can pass all quality checks but require human approval before action.

**Primitives active:** Governance Gates (#8), Policy as Code (#9), Provenance Chains (#6), Identity & Attribution (#14), Transaction & Side-Effect Control (#16 — irreversible-action gates, stale-approval invalidation), Data Governance & Confidentiality (#17 — data classification policy, PII handling, consent enforcement, cross-boundary controls)

**Time horizon:** Per-decision. Minutes to hours — gates may pause for human review.

**Behavior:**
- Receives verified output from Ring 1
- Evaluates against policy rules (versioned, executable)
- If policy passes + no gate required: record provenance, forward
- If policy passes + gate required: GATE — pause, present evidence, request authorization
- If policy fails: HALT — flag, escalate
- If context has changed during execution (policy updated, new evidence arrived): REVISE(context) — send back to Ring 0 with updated context for re-execution
- All actions recorded in immutable provenance chain

**Key property:** Ring 2 issues two types of revision. REVISE(quality) is Ring 1's domain — "this isn't good enough." REVISE(context) is Ring 2's domain — "the world changed, re-execute with current context." The distinction matters because context revision is not a quality failure — it's a governance response to changed circumstances.

### Ring 3 — Learning

Wraps everything. Observes all rings over time. The question Ring 3 answers: **"Is this system getting better?"**

Ring 3 does not act on individual outputs. It acts on **patterns across outputs** to improve the whole system.

**Primitives active:** Self-Improving Cycles (#3), Memory-Augmented Reasoning (#12), Trust Ladders (#11)

**Time horizon:** Dual-speed.
- **Slow path:** Per-pattern. Days to weeks — systematic improvement across many executions.
- **Fast path (sentinels):** Near-real-time — anomaly-triggered trust degradation. When trip wires fire (consecutive failures, quality score cliff, cost spike), trust drops immediately and verification re-escalates. The slow path later ratifies or adjusts.

**Behavior:**
- Ingests execution data from all rings (inputs, outputs, scores, human feedback, overrides, gate decisions)
- Periodically analyzes patterns: quality trends, failure modes, override clusters, cost drift
- Pulls from memory/KB for new learnings and organizational context
- Generates improvement recommendations: prompt updates, threshold adjustments, new validation rules, trust level changes
- Recommendations are versioned and applied as new configurations (atomic git commits)
- Regression detection: if quality drops after a change, rollback
- Sentinel monitoring: continuous anomaly detection with immediate trust adjustment

**Key property:** Ring 3 changes are configuration changes, not structural changes. They modify prompts, thresholds, rules, and trust levels — runtime-tunable parameters. Ring 3 cannot expand the boundaries defined by Bounded Agency (#7) or modify mandatory gate requirements without human authorization. See Tension 3.

### Cross-Cutting: The Fabric

Seven primitives are not rings — they are the **substrate and connective tissue** that makes the rings composable:

**Structured Output Persistence (#5):** Every ring produces and consumes structured artifacts. This is the data contract that allows rings to attach to each other. Without it, rings can't compose.

**Event-Driven Observability (#10):** Every ring emits structured events. The event stream is the shared nervous system. Ring 3's learning depends on it. Provenance chains are built from it. Dashboards, alerts, and audit packages are derived from it. Observability is not a ring — it's the connective tissue.

**Error Handling & Recovery (#13):** Every ring can fail. Checkpointing, retry, graceful degradation, and compensation operate within each ring and across ring boundaries. Recovery is not a ring — it's the safety net.

**Adversarial Robustness (#15):** Security is not a ring — it is a posture expressed through the Security Fabric (enforcement at every ring boundary), Security Governance (policy evaluation in Ring 2), and Security Intelligence (detection in the observability layer). See [Security Architecture](#security-architecture) for the full three-level security model.

**Data Governance & Confidentiality (#17):** Data governance operates at two levels: policy definition in Ring 2 (classification rules, consent, retention) and enforcement in the fabric (input validation, output scanning, cross-boundary controls at every ring boundary).

**Evaluation & Assurance (#18):** This primitive operates **outside the ring pipeline.** It is the pre-deployment gate that determines whether a pipeline configuration should enter production. It validates ring configurations, tests policy rules, and red-teams the full ring stack before deployment. Ring 3 configuration changes are its primary target — learning outputs that affect governance must pass evaluation before going live.

**Agent Environment Governance (#19):** The operating environment that all ring agents depend on — context composition, instruction architecture, capability provisioning, workspace scoping, session state. Environment governance is the substrate beneath the rings: it determines what each ring's agents can see, access, and reason about. The environment optimization loop operates as a Ring 3 concern (learning applied to the substrate), validated through Ring 2 and tested by #18 before deployment. See [Agent Environment Architecture](#agent-environment-architecture) for the full environment stack and composition patterns.

### Ring Diagram

```
┌───────────────────────────────────────────────────────────┐
│  Ring 3 — Learning                                        │
│  Self-improvement, memory, trust ladders                  │
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
│  │  │  │  Producer agent, domain logic,    │    │    │    │
│  │  │  │  structured output, identity      │    │    │    │
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
│  Security Response Bus: Intelligence → Fabric fast-path   │
├───────────────────────────────────────────────────────────┤
│  Environment Substrate (#19)                              │
│  Context Composition + Instructions + Capabilities +      │
│  Workspace Scoping + Session State                        │
│  Optimization Loop: Ring 3 proposes → Ring 2 validates    │
└───────────────────────────────────────────────────────────┘
```

---

## Ring Deployment Modes

The rings are a **logical architecture** — they define which primitives activate and in what order. How the rings manifest physically depends on the system type, latency budget, and governance requirements.

This is a critical framing point: **the concentric ring diagram is one deployment mode, not THE architecture.** The majority of deployed agentic systems in 2026 are conversational or tool-calling — not batch pipelines. Wrapper mode is a valuable pattern, but it is the special case, not the default. All three modes are equal citizens of the framework.

The same ring logic deploys in three modes. The guarantees don't change. The topology does.

### Wrapper Mode

Wrapper mode is presented first because its sequential structure makes the ring logic easiest to understand. Most agentic systems in production (conversational agents, coding agents, multi-step task agents) operate in middleware or graph-embedded mode — wrapper mode is the conceptual entry point, not the default deployment pattern.

The rings literally wrap the core execution. Ring 0 produces a discrete output, Ring 1 evaluates it, Ring 2 governs it, Ring 3 learns from it. Sequential, concentric, as diagrammed in the Ring Diagram above.

```
┌─────────────────────────────────────────────────┐
│  Ring 0: Produce output                         │
│  ──────────────── checkpoint ──────────────────  │
│  Ring 1: Verify output (loop until converge)    │
│  ──────────────── checkpoint ──────────────────  │
│  Ring 2: Evaluate policy, gate if required      │
│  ──────────────── checkpoint ──────────────────  │
│  Output released                                │
│                                                 │
│  Ring 3: Learn from execution (async)           │
└─────────────────────────────────────────────────┘
```

**Best fit:** Staged document processing, assessment pipelines, batch review workflows, content generation pipelines, any system where the output is a discrete artifact produced in one pass and then evaluated.

**Real-world examples:** AI risk assessment pipelines, automated report generation, code review pipelines, regulatory filing preparation, batch translation workflows.

**How verification works:** Ring 1 fires after Ring 0 completes. The full output is available for evaluation. Validation loops iterate the complete artifact. Clear pass/fail at the stage boundary.

**How governance works:** Ring 2 fires after Ring 1 passes. Governance Gates (#8) can pause indefinitely for human review — the output is stable, the execution context is frozen. The gate decision is binary: PASS, HALT, or REVISE(context).

**How the Security Response Bus works:** Containment halts the pipeline at the current stage boundary. Simple — the pipeline is already paused between stages. Intelligence triggers, Fabric stops forward progress, the output never releases.

**How checkpointing works:** Checkpoint between each ring. Each checkpoint captures the full state: Ring 0 output, Ring 1 verification results, Ring 2 policy evaluation. Recovery restarts from the last clean checkpoint.

**Governance properties:**
- **Audit clarity:** Highest. Each stage boundary is a clean cut in the provenance chain. Auditors can see exactly what Ring 0 produced, exactly what Ring 1 found, exactly what Ring 2 decided.
- **Human oversight:** Easiest. Gates pause cleanly. Reviewers see the complete context. No time pressure from in-flight execution.
- **Reproducibility:** Highest. Given the same input and configuration, the pipeline produces the same trace.

**Tradeoff:** Latency. The full sequential pass (Ring 0 → Ring 1 → Ring 2) adds wall-clock time proportional to the complexity of verification and governance. For a batch pipeline processing overnight, this is irrelevant. For a user-facing agent, it may be unacceptable.

### Middleware / Interrupt Mode

Ring logic is embedded as control points inside an execution graph. Instead of wrapping the entire output, verification and governance fire at specific decision points — tool calls, data access, external API calls, state mutations. The agent executes continuously; the rings intercept at defined interrupt boundaries.

```
Agent execution graph:

  step 1 → step 2 ──→ [R1: verify tool selection] ──→ step 3
                                                          │
                      [R2: gate — destructive action] ←───┘
                                  │
                           (human approves)
                                  │
                                  ↓
                              step 4 → step 5 ──→ [R1: verify output quality]
                                                          │
                                                      step 6 → done

  Ring 3: learns from full execution trace (async)
  Security fabric: active at every interrupt boundary
```

**Best fit:** Coding agents, ops automation, multi-step task agents, infrastructure management, any system where the agent takes many small actions over an extended execution rather than producing a single output.

**Real-world examples:** Claude Code, Cursor, Devin-style coding agents, GitHub Copilot Workspace, CI/CD pipeline agents, incident response automation, database migration agents.

**MCP as canonical middleware implementation:** The Model Context Protocol (MCP) is the de facto standard for tool execution middleware in 2026, adopted by Anthropic, OpenAI, and Cloudflare. MCP materializes middleware/interrupt mode directly — the protocol defines the boundary between agent reasoning and tool execution, making each tool call a natural interrupt point where ring logic fires. Ring 2 policy defines which MCP servers and tools are authorized (allowlisted servers, permitted tool schemas, scope constraints). The Security Fabric verifies tool integrity at each MCP `execute_tool` invocation. Ring 1 verification can evaluate tool selection (did the agent choose the right tool?) and tool output (did the tool return valid results?). This architecture maps cleanly because MCP already enforces a structured request/response pattern at tool boundaries — the same boundaries where governance naturally intercepts.

**MCP-specific governance concerns in this mode:** (1) **Dynamic tool discovery** — MCP servers can expose new tools at runtime; Ring 2 must decide whether dynamically discovered tools inherit the server's trust level or require explicit authorization. (2) **Server trust chain** — community-built MCP servers undergo no security review; supply chain trust (#15) policy must define trust tiers (verified publisher, community-reviewed, unvetted) with different ring activation intensities per tier. (3) **Context window as attack surface** — MCP tool descriptions are injected into the agent's context; tool poisoning (OWASP MCP03) and prompt injection via contextual payloads (MCP06) operate through this channel. The Security Fabric's input sanitization must treat MCP tool descriptions as untrusted input, not just tool outputs. (4) **Session isolation** — multi-tenant MCP servers must enforce context compartmentalization (OWASP MCP10); Ring 2 policy defines isolation boundaries, fabric enforces them.

**How verification works:** Ring 1 fires at interrupt points, not at the end. Not every step triggers verification — the interrupt policy defines which actions require Ring 1 checks. An agent might execute 50 tool calls with Ring 1 checks on 5 of them (tool selection for unfamiliar tools, output verification for code generation steps, quality checks before committing results).

The interrupt policy is itself a governance artifact — defined in Ring 2, applied by the fabric. Higher-risk actions trigger more interrupts. Trust Ladders (#11) influence interrupt frequency: a trusted agent executing familiar tool calls may skip Ring 1 checks that a new agent would trigger.

**How governance works:** Ring 2 gates fire at specific action boundaries — before destructive operations, before irreversible actions (Transaction & Side-Effect Control #16), before data exfiltration boundaries, before privilege escalation. The agent's execution is suspended at the interrupt point. The execution context is preserved but the agent is not "between stages" — it is mid-graph with state.

This creates a design constraint: **the agent must be resumable.** Pausing for a governance gate mid-execution requires that the agent's state (context window, tool results, partial work) can be frozen, persisted, and resumed after the gate resolves. This maps directly to checkpointing in Error Handling & Recovery (#13).

**How the Security Response Bus works:** Containment triggers an interrupt that halts the current execution step and prevents the next step from starting. More complex than wrapper mode because the agent may have in-flight operations — a tool call that has been dispatched but hasn't returned. The Response Bus must handle: (a) preventing new steps, (b) waiting for or canceling in-flight operations, (c) preserving the execution state for forensic analysis.

**How checkpointing works:** Checkpoint at each interrupt boundary. The checkpoint captures: all prior step results, the current execution graph position, the agent's context/state, and any in-flight operations. Recovery can restart from the last interrupt checkpoint, but steps between checkpoints may need re-execution.

**Governance properties:**
- **Audit clarity:** Good. The provenance chain shows which control points triggered and what decisions were made. But the interleaving of execution and governance makes the trace more complex than wrapper mode — an auditor must follow the execution graph, not just a linear stage sequence.
- **Human oversight:** Good, with constraints. Gates pause at interrupt points, and the human sees the execution context up to that point. But the context is richer (partial execution state, tool call history, in-progress work) and the reviewer needs more domain expertise to evaluate.
- **Reproducibility:** Moderate. The execution graph is deterministic given the same inputs and tool responses, but tool responses are external and may vary. Non-determinism in LLM steps means the specific interrupt points triggered may differ across runs.

**Tradeoff:** Interrupt policy design is hard. Too many interrupts and the agent is constantly paused — overhead negates the benefit. Too few and you miss consequential actions. The interrupt policy is a governance design problem, not an implementation problem. It requires understanding which actions in the agent's domain are consequential enough to warrant ring activation.

### Graph-Embedded Mode

Verification, governance, and security are nodes in the execution graph alongside the agent's domain logic. The rings are not separate layers wrapping execution or interrupting it — they are peers in the orchestration, running concurrently.

```
┌───────────────────────────────────────────────────────────────┐
│  Execution Graph (all nodes run concurrently)                 │
│                                                               │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │  Ring 0   │   │  Ring 1   │   │  Ring 2   │   │ Security │  │
│  │ (produce) │   │ (verify)  │   │ (policy)  │   │ (fabric) │  │
│  │           │   │           │   │           │   │          │  │
│  │  output ──┼──→│  quality ─┼──→│           │   │  safety ─┼──┐
│  │  stream   │   │  signal   │   │  auth     │   │  signal  │  │
│  └──────────┘   └──────────┘   │  signal ──┼──→│          │  │
│                                 └──────────┘   └──────────┘  │
│                                                       │       │
│                                    ┌──────────────────┘       │
│                                    ↓                          │
│                             ┌────────────┐                    │
│                             │  Release    │                    │
│                             │  Gate       │──→ output          │
│                             │  (all pass) │                    │
│                             └────────────┘                    │
│                                                               │
│  Ring 3: async on event stream (not in critical path)         │
└───────────────────────────────────────────────────────────────┘
```

**Best fit:** Streaming/real-time agents, conversational agents, voice assistants, tightly coupled agent swarms, trading systems, any system where latency budgets are near-zero and sequential ring processing would destroy the user experience.

**Real-world examples:** ChatGPT-style conversational agents, voice assistants (Alexa, Google Assistant), real-time recommendation engines, multi-agent swarms (CrewAI, AutoGen), financial trading agents, real-time content moderation.

**How verification works:** Ring 1 runs concurrently with Ring 0. As Ring 0 produces output (potentially streaming), Ring 1 evaluates it in parallel. This is **speculative execution** — Ring 0 produces output optimistically while Ring 1 determines whether it meets quality thresholds.

The release gate blocks output delivery until Ring 1 signals pass. For streaming systems, this can operate on chunks: Ring 0 streams token by token, Ring 1 evaluates accumulated output at defined intervals, the release gate holds or passes each chunk. If Ring 1 signals fail mid-stream, the gate blocks further delivery and triggers a revision.

**How governance works:** Ring 2 evaluates policy concurrently. For most output, policy evaluation is fast enough to keep pace with production. The release gate requires all signals (quality, auth, safety) before output passes.

For actions requiring human approval, graph-embedded mode faces its hardest challenge. The agent has already invested computation in producing the output. If a governance gate pauses for human review, the agent's speculative execution must be held in a buffer — or, if the human rejects, rolled back. **Speculative execution that touches external state (API calls, database writes) before the gate resolves is a Transaction & Side-Effect Control (#16) problem.** The agent must not commit irreversible side effects until the governance gate clears.

**Speculative execution formal bounds** *(Informed proposal — these bounds are derived from our analysis of concurrent governance overhead and require empirical validation in production agentic systems):* Graph-embedded mode's concurrent processing introduces combinatorial complexity that must be bounded:
- **Depth limit:** Speculative execution chains (where one speculative step triggers further speculative steps) should be bounded to depth 3-4. Concurrent state management overhead grows super-linearly beyond depth 4 (the coordination cost of tracking speculative branches, maintaining rollback state, and synchronizing governance signals across concurrent execution paths exceeds the latency savings from speculation). Implementations should measure their specific overhead curves and calibrate accordingly.
- **Entropy constraint:** Speculative execution is only valuable when the probability of governance rejection is low. If the historical rejection rate for a given action class exceeds a configured threshold (recommended starting point: 20%), that action class should be excluded from speculative execution and processed sequentially with explicit governance approval before proceeding. The 20% threshold is a starting heuristic — the optimal threshold depends on the cost of wasted speculative computation relative to the latency benefit.
- **Resource budget:** Speculative computation consumes resources that are wasted on rejection. A per-request speculative budget (compute time, token count, API calls) prevents runaway speculation. When the budget is exhausted, remaining steps fall back to sequential processing.
- **Side-effect fence:** Speculative steps that would produce irreversible side effects (database writes, external API calls, financial transactions) must be fenced — held in a commit buffer until the governance release gate clears. This is Transaction & Side-Effect Control (#16) applied to speculative execution specifically.

The practical constraint: graph-embedded mode works best when governance gates are rare (most output passes policy automatically) and when the cost of speculative-then-discarded computation is acceptable. For systems with frequent mandatory gates, middleware mode is a better fit.

**How the Security Response Bus works:** Most complex of the three modes. Intelligence must send containment signals to multiple concurrent execution nodes simultaneously. The challenges:
- Ring 0 may have output in the buffer that hasn't been released — containment must flush or quarantine the buffer.
- In-flight verification and policy evaluation must be interrupted.
- If the agent is part of a swarm, containment of one agent must propagate to downstream agents that are consuming its output stream.

Pre-authorized response classes must account for the concurrent execution model. A containment signal in graph-embedded mode is closer to a distributed systems transaction abort than a pipeline halt.

**How checkpointing works:** Most complex. Checkpoint must capture the parallel state of all concurrent executions: Ring 0's output buffer, Ring 1's evaluation state, Ring 2's policy context, and the Security Fabric's signal state. Recovery requires restarting all concurrent nodes from a consistent snapshot — a coordination problem analogous to distributed database recovery.

**Governance properties:**
- **Audit clarity:** Lowest. Concurrent execution means the provenance chain is a partial order, not a total order. Multiple rings fire simultaneously, and the causal relationships between events are more complex to reconstruct. Auditors need tooling to visualize concurrent traces, not just linear logs.
- **Human oversight:** Hardest. Speculative execution means the agent has "moved on" by the time a gate fires. The reviewer must understand that rejecting a gate may require discarding work already done. Cognitive load on reviewers is higher.
- **Reproducibility:** Lowest. Concurrency introduces timing-dependent behavior. The same inputs may produce different execution orderings across runs. The logical outcome should be equivalent (same guarantees), but the specific trace may differ.

**Tradeoff:** Latency for governance clarity. Graph-embedded mode is the fastest but produces the most complex audit trail and the hardest environment for human oversight. Systems subject to regulatory audit or requiring clear governance evidence should strongly consider wrapper or middleware mode even if latency suffers.

### Mode Selection Matrix

Choose the deployment mode based on system characteristics. When multiple modes could work, prefer the one with stronger governance properties unless latency requirements force otherwise.

| System Characteristic | Wrapper | Middleware | Graph-Embedded |
|----------------------|---------|-----------|----------------|
| **Output type** | Discrete artifact (document, report, assessment) | Sequence of actions (tool calls, mutations, operations) | Continuous stream (conversation, real-time feed) |
| **Latency tolerance** | Seconds to hours | Sub-second to seconds per action | Milliseconds (user-perceived) |
| **Governance intensity** | High — every output is fully reviewed | Selective — consequential actions trigger rings | Minimal blocking — most output auto-passes |
| **Human gate frequency** | High — frequent pause-and-review acceptable | Moderate — gates at high-stakes actions only | Low — rare, and disruptive when they fire |
| **Regulatory/audit requirement** | Strong — clear evidence trail required | Moderate — action-level audit sufficient | Light — behavioral monitoring sufficient |
| **Side-effect profile** | Contained — output is an artifact, not an action | Mixed — many actions, some irreversible | Continuous — streaming output, real-time effects |
| **Regulatory jurisdiction** | EU AI Act high-risk (Art. 9-15 require full evidence trails) | Most jurisdictions — action-level audit satisfies typical requirements | Permissive jurisdictions, or low-risk classification where behavioral monitoring suffices |
| **Rollback/compensation requirements** | Simple — discard the artifact | Per-action compensation — Transaction & Side-Effect Control (#16) manages partial execution recovery | Complex — speculative execution may have committed partial state, requires side-effect fencing |
| **Observability maturity** | Basic — stage-boundary events are sufficient for audit | Moderate — interrupt-level telemetry, OTel `execute_tool` spans, Ring 1/2 signal events | Advanced — concurrent trace reconstruction, partial-order event correlation, distributed snapshot tooling |
| **Concurrent load** | Low — batch/sequential processing, one pipeline at a time | Medium — multiple agents with interleaved governance, manageable interrupt coordination | High — parallel verification, streaming, swarm coordination; requires distributed systems infrastructure |

| **Protocol integration** | Custom pipeline orchestration | MCP (tool calls), A2A (agent delegation) | Custom streaming protocols, WebSocket-based |

**Hybrid deployment:** Systems are not required to use a single mode. A common pattern is **middleware mode with graph-embedded subsections** — the overall agent operates in middleware mode (interrupt-driven), but within a single user-facing response, the generation pipeline uses graph-embedded mode (parallel verification of streamed output). The mode boundary is a design decision, not a framework constraint.

### The Invariant Across Modes

Regardless of deployment mode, the **logical guarantees** are identical:

1. **Every consequential output is verified before release** (Ring 1). In wrapper mode, this is post-production evaluation. In middleware mode, this is per-interrupt verification. In graph-embedded mode, this is concurrent evaluation with a release gate.

2. **Every consequential action is authorized before execution** (Ring 2). In wrapper mode, this is a stage gate. In middleware mode, this is an interrupt gate. In graph-embedded mode, this is a concurrent policy signal feeding the release gate. For irreversible actions, this is always a blocking gate regardless of mode.

3. **Every execution emits events to the observability fabric.** The event semantics are the same. The event ordering may differ — total order in wrapper mode, partial order in graph-embedded mode.

4. **Every action carries authenticated identity.** The Security Fabric enforces identity verification at every ring boundary in wrapper mode, every interrupt point in middleware mode, and every concurrent node boundary in graph-embedded mode.

5. **Trust is earned, not assumed** (zero trust posture). Trust Ladders (#11) operate identically across modes — the trust level influences which verifications fire, which gates activate, and how much autonomy the agent has. The mode determines how that influence manifests physically.

6. **The Security Response Bus operates in all modes.** Pre-authorized containment fires at stage boundaries (wrapper), interrupt points (middleware), or as distributed abort signals (graph-embedded). The pre-authorization is the same; the containment mechanism adapts to the topology.

The rings define *what must happen*. The deployment mode defines *when and how it happens*. Same primitives, same composition patterns, different physical topology.

### Governance/Latency Tension

The three deployment modes reveal a fundamental tension: **governance clarity degrades as latency improves.**

| Property | Wrapper (High Latency) | Middleware (Medium) | Graph-Embedded (Low Latency) |
|----------|----------------------|--------------------|-----------------------------|
| Audit trail clarity | Total order, clean stages | Action-level, interleaved | Partial order, concurrent |
| Human oversight quality | Full context, no time pressure | Mid-execution context, some pressure | Speculative context, high pressure |
| Reproducibility | Highest | Moderate | Lowest |
| Governance evidence strength | Strongest | Good | Requires tooling support |
| Latency cost | Highest | Moderate | Lowest |

**This is not a flaw — it is a design tradeoff that adopters must make consciously.** The framework does not prescribe a mode. It provides the guarantees and lets the system's governance requirements and latency budget determine the topology.

**The resolution for high-stakes systems in low-latency environments:** Use graph-embedded mode for the fast path (most output), with automatic escalation to middleware or wrapper mode when the system detects high-stakes situations. Trust Ladders (#11) and risk classification drive the mode selection dynamically — routine output streams through graph-embedded, but an irreversible action triggers a blocking gate regardless of mode. The mode boundary shifts at runtime based on what the agent is about to do.

---

## Multi-Agent Coordination

The rings model describes a single agent pipeline. Real systems involve multiple agents coordinating — one agent's output feeds another's input, agents work in parallel, agents negotiate conflicting results.

The rings model does not break in multi-agent scenarios. It **nests**.

### Composition Patterns

**Sequential:** Pipeline A's Ring 2 output feeds Pipeline B's Ring 0 input. The interface is the same structured output contract. Pipeline B treats Pipeline A's output as its input — with its own verification, governance, and learning.

```
Pipeline A: [R0 → R1 → R2] → output
                                 ↓
Pipeline B:                  [R0 → R1 → R2] → output
```

**Parallel:** Multiple pipelines run independently on the same or different inputs. A synthesis pipeline (itself a Ring 0 with its own ring stack) merges their results.

```
Pipeline A: [R0 → R1 → R2] → output A ─┐
                                         ├→ Synthesis [R0 → R1 → R2] → merged output
Pipeline B: [R0 → R1 → R2] → output B ─┘
```

**Orchestrated:** A coordinator agent manages delegation, sequencing, conflict resolution, and cross-pipeline governance. The coordinator is itself a governed pipeline with its own ring stack.

```
Orchestrator [R0 → R1 → R2]:
  ├→ delegates to Pipeline A [R0 → R1 → R2]
  ├→ delegates to Pipeline B [R0 → R1 → R2]
  ├→ resolves conflicts between A and B
  └→ produces coordinated output
```

### Key Insight: Rings Are Fractal

The orchestrator is not a special case — it is a pipeline like any other, wrapped in its own rings. Its Ring 0 is coordination logic. Its Ring 1 verifies that the orchestration produced coherent results. Its Ring 2 governs whether the coordinated output is authorized. Its Ring 3 learns from patterns across orchestration runs.

This means governance is applied at every level: individual agent, pipeline, and orchestration. There is no ungoverned layer.

### Governance Collapse Rule

When rings are fractal, governance recursion is a real risk. A 3-level hierarchy (agent → pipeline → orchestrator) creates 3 Ring 2 instances. A 4-level hierarchy creates 4. Without a termination rule, multi-agent coordination creates governance recursion — conflicting Ring 2 decisions at different levels, with no clear authority.

**The collapse rule: the outermost Ring 2 is authoritative on scope conflicts.**

- Each level's Ring 2 governs decisions **within its scope.** An individual agent's Ring 2 governs that agent's actions. A pipeline's Ring 2 governs cross-agent coordination within the pipeline. An orchestrator's Ring 2 governs cross-pipeline interactions.
- When scope conflicts arise (Pipeline A's Ring 2 approves an action that the orchestrator's Ring 2 rejects), **the outer Ring 2 wins.** The orchestrator's governance boundary encompasses the pipeline's. Broader scope = higher authority.
- **Leaf-level Ring 2 decisions that do not cross scope boundaries are final** within their scope. The orchestrator's Ring 2 does not second-guess every agent-level policy decision — it only governs decisions that affect cross-pipeline interactions.
- **Maximum nesting depth is declared.** The framework recommends a maximum of 3 governance levels for practical systems (agent → pipeline → orchestrator). Beyond 3 levels, governance latency compounds and the conflict resolution path becomes too long. Systems requiring more than 3 levels should flatten by broadening scope at each level rather than adding levels.

### Cross-Pipeline Governance

When agents from different organizational units, trust domains, or tenants interact, the question "which Ring 2 governs?" arises. The answer: **each pipeline has its own Ring 2, and the orchestrator has a Ring 2 that governs the interactions between them.** Cross-pipeline governance is the orchestrator's Ring 2 responsibility.

Identity & Attribution (#14) is critical here — when Pipeline A's output feeds Pipeline B, Pipeline B needs to know who produced that input and under what authority.

**DELEGATE and cross-pipeline governance:** When an agent returns DELEGATE(target, context, scope, depth) from its Ring 2, governance responsibility transfers as follows: the delegator's Ring 2 authorized the delegation (it issued the DELEGATE signal). The delegatee's Ring 2 governs the delegated work within its own scope. If both agents are within the same orchestrator, the orchestrator's Ring 2 governs the interaction between them per the governance collapse rule. If they are in different trust domains, cross-system trust rules apply (see below).

**Delegation cycle prevention:** DELEGATE carries a depth counter that increments on each delegation. A system-wide max_delegation_depth (recommended: 3) prevents circular delegation chains (A → B → C → A). When depth reaches the limit, DELEGATE converts to HALT("delegation depth exceeded"). Additionally, each DELEGATE signal carries the full delegation chain (list of prior delegators). If the target agent appears in the chain, the delegation is rejected as a cycle. This prevents both simple loops and complex multi-agent delegation cycles that could otherwise exhaust system resources or create ungoverned lateral movement.

### Cross-System Trust

When agents operate across organizational boundaries — federated pipelines, marketplace agents, cross-tenant delegation — additional trust mechanisms are required beyond single-system identity:

- **Federated trust.** Each organization maintains its own trust domain. Trust does not automatically transfer across organizational boundaries. An agent trusted at Principal level in Organization A starts at Intern level when interacting with Organization B's systems — unless a federated trust agreement exists.
- **Protocol-level identity.** Cross-system agents must authenticate via protocol-level identity standards (OAuth 2.1, OIDC, SPIFFE) rather than application-level trust. The NIST NCCoE agent identity work and OpenID Foundation recommendations define the emerging standards here.
- **Capability discovery.** Before delegation across system boundaries, the delegating agent must discover what the receiving agent is authorized to do. Capability manifests (signed declarations of an agent's authorized scope) enable this without requiring full trust.
- **Policy translation.** Organization A's policy language may differ from Organization B's. Cross-system governance requires either a shared policy vocabulary or a translation layer. The framework recommends standardizing on the composability interface signals (PASS/REVISE/HALT/GATE/DELEGATE/ERROR) as the cross-system governance protocol, with each organization's Ring 2 interpreting them according to local policy.

### Cross-Ring Concern Routing

Rings occasionally discover issues outside their domain:
- Ring 1 (Verification) discovers what appears to be a policy violation — not a quality issue, but a governance issue.
- Ring 2 (Governance) discovers what appears to be a quality deficiency — not a policy issue, but a verification issue.
- Any ring discovers a security anomaly that should be routed to Security Intelligence.

**The routing mechanism:** Rings may attach **findings annotations** to any signal. A Ring 1 PASS may include `findings: [{type: "policy_concern", detail: "output may violate data classification rules", severity: "medium"}]`. Ring 2 receives these annotations and acts on them within its domain. Similarly, any ring may emit a **security event** to the observability fabric, which Security Intelligence consumes.

Findings annotations are advisory. They do not change the signal (a Ring 1 PASS with a policy concern annotation is still a PASS). They ensure that cross-ring concerns are surfaced, not silently dropped.

---

## Composability Interface

The rings model implies a standard interface — the mechanism by which any ring attaches to any agent pipeline. This is the "bolt-on" pattern.

### The Contract

Each ring wraps the inner rings and communicates through a standard interface:

```
Ring receives:
  - output:   structured artifact from the inner ring
  - context:  execution metadata, provenance chain so far,
              policy context, trust level, iteration count
  - config:   ring-specific configuration (thresholds, rules,
              verification layers, gate requirements)

Ring returns one of:
  - PASS(output, annotations)              → forward to next ring
  - REVISE(output, findings, reason)       → send back for re-production
      reason: quality                      → Ring 1: "not good enough"
      reason: context                      → Ring 2: "world changed, re-execute"
  - HALT(reason)                           → stop execution, escalate
  - GATE(evidence, request)                → pause for authorization
      returns: APPROVE | REJECT | MODIFY | DEFER | ESCALATE
  - DELEGATE(target, context, scope, depth) → lateral delegation to a peer agent
      depth: current delegation depth (incremented on each delegation)
      max_delegation_depth: system property (recommended: 3)
      depth >= max → converts to HALT("delegation depth exceeded")
  - ERROR(reason, partial_state, recovery) → ring failure
      recovery: retry | degrade | halt

Ring receives (in context):
  - execution_budget:
      max_iterations:    total cross-ring revision loops allowed
      max_cost:          cumulative cost ceiling across all rings
      max_wall_clock:    wall-clock time limit for the full pipeline
      iterations_used:   current count of cross-ring revisions
      cost_used:         cumulative cost so far
      budget_exhausted:  → triggers HALT with budget reason
```

**Signal restrictions by ring:**
- **Ring 1** may return: PASS, REVISE(quality), HALT, ERROR
- **Ring 2** may return: PASS, REVISE(context), HALT, GATE, DELEGATE, ERROR
- **Ring 3** does not return signals on individual outputs. It modifies configuration between executions.

**REVISE(context) transaction semantics:**

REVISE(context) — "the world changed, re-execute with updated context" — has special requirements when the prior execution produced side effects:

- **No blind re-execution after side effects.** If Ring 0 committed side effects (API calls, database writes, notifications) before Ring 2 issues REVISE(context), the re-execution must account for what already happened. Transaction & Side-Effect Control (#16) governs this.
- **Idempotency keys carry across revisions.** The re-execution reuses the original idempotency keys. Side effects that already committed are not re-executed — the idempotency check detects the duplicate.
- **Stale-approval invalidation.** If REVISE(context) was triggered because context changed, any prior approvals (GATE → APPROVE) from the original execution are invalidated. The revised execution must re-request approval — the original approval was granted under different circumstances.
- **Compensation for partial execution.** If the original execution partially committed (some side effects succeeded, others are pending), REVISE(context) triggers compensation for committed effects that are no longer valid under the new context. Compensation is itself a governed action, recorded in provenance.
- **Approval expiration.** Approvals carry a validity window. If context changes materially during the validity window, the approval expires even if REVISE(context) was not explicitly triggered. Material change detection is a Security Intelligence responsibility.

### What Makes a Pipeline "Ring-Compatible"

For any ring to attach to any pipeline, the pipeline must:

1. **Produce structured output** — typed, schema-validated artifacts (Primitive #5)
2. **Emit events** — structured events at execution boundaries (Primitive #10)
3. **Accept revision requests** — the ability to re-execute with findings (quality) or updated context
4. **Expose execution metadata** — run ID, actor identity (#14), timestamp, input hash, output hash
5. **Support checkpointing** — the ability to save and restore state at stage boundaries (#13)

If a pipeline meets these five requirements, any ring can wrap it. The rings don't need to know what the pipeline does — they operate on the interface, not the implementation.

### Versioning: Auditable Control-Plane State

The enduring primitive is **versioned, auditable, reviewable control-plane state** — not any specific versioning tool. Every configuration change must be:

- **Immutable:** Every prior state is recoverable
- **Diffable:** What changed between version N and N+1 is always inspectable
- **Rollbackable:** Revert to any prior configuration with a single operation
- **Attributable:** Who changed what, when, and why
- **Branchable:** Test new configurations in isolation before applying

**Reference implementation: Git.** For text-based configuration (prompts, policy rules, threshold definitions, schema files), atomic git commits provide all five properties with familiar tooling. The provenance chain references the commit hash that was active during execution. If regression is detected, the commit is reverted.

**Where git is not enough:** Runtime state, memory stores, vector indexes, feature flags, secrets, artifact registries, and multi-service rollout coordination require different versioning mechanisms — database-backed version stores, event sourcing, artifact registries with signed releases. The principle (versioned, auditable, rollbackable) applies uniformly. The implementation varies by artifact type.

This applies at every level:
- **Ring 0:** Agent prompts, schema definitions, domain configs
- **Ring 1:** Verification rules, quality thresholds, convergence criteria
- **Ring 2:** Policy rules, gate requirements, escalation paths
- **Ring 3:** Trust thresholds, improvement cycle schedules, memory routing rules

**Design principle:** If it changes system behavior, it gets versioned. No silent configuration drift.

### Human Interface Requirements at Gates

When a GATE signal pauses for human authorization, the quality of the human decision depends on what the human sees and how the interaction is structured. Rubber-stamped approvals are governance theater — worse than no gate at all, because they create a false sense of oversight.

**Evidence presentation:**
- The gate must present the **minimum viable context** for an informed decision — not a data dump. What is being approved? What are the consequences? What is the risk classification? What does the agent recommend, and why?
- Evidence must include: the proposed action, the identity context (which agent, which model, which delegation chain), the policy that triggered the gate, any Ring 1 findings, and the risk classification.
- **Counterfactual framing:** Where possible, present what happens if the gate is approved AND what happens if it is rejected. Both paths should be visible.

**Rubber-stamping detection:**
- Security Intelligence monitors gate approval patterns. Approval cadence (time between gate presentation and approval) that is consistently below a threshold indicates rubber-stamping.
- Sequential approvals without rejection or modification over extended periods are flagged for review.
- Cognitive load management: if a human reviewer is presented with more than N gates per hour, the system alerts that review quality is likely degrading. The threshold N is configurable and should be informed by the research showing ~50% oversight accuracy under load.

**Timeout behavior:**
- Gates have configurable timeout periods. If a gate is not resolved within the timeout, the system takes a defined default action — which may be HALT (fail closed) or ESCALATE (route to a different reviewer).
- Fail-closed is the default for high-risk gates. Fail-open is never the default — it must be explicitly configured and documented as a governance decision.

**Cognitive load management:**
- Gate complexity should be proportional to decision stakes. Low-stakes gates present minimal evidence and accept simple approve/reject. High-stakes gates present comprehensive evidence and may require structured justification for the decision.
- Batch approval for homogeneous low-risk gates (e.g., "approve all 15 format-change outputs") is permitted when the gate policy explicitly allows it. Batch approval is never available for gates involving irreversible actions or high-risk classifications.

---

## Primitive Interaction Tensions

The primitives are not always harmonious. Some create tensions that must be explicitly resolved.

### Tension 1: Self-Improvement vs. Reproducibility

**The conflict:** Self-Improving Cycles (#3) change system behavior over time. Provenance Chains (#6) require that decisions be replayable and traceable. If the system improves itself, the same input won't produce the same output next run.

**Resolution: Version everything.** Self-improvement creates a new configuration version (atomic git commit). Provenance chains reference the configuration version (commit hash) that was active during execution. Any past decision can be replayed under the configuration that was active at the time. Improvement and reproducibility coexist through explicit versioning.

**The invariant:** The system is always reproducible *at a specific version*. It is not reproducible *across versions* — and that's by design.

### Tension 2: Trust Ladders vs. Governance Gates

**The conflict:** Trust Ladders (#11) reduce oversight as the system proves itself. Governance Gates (#8) ensure accountability for material decisions. If trust increases and gates relax, who's accountable when something goes wrong?

**Resolution: Two gate classes.**

- **Adaptive gates** — trust-dependent. Can relax as the system demonstrates reliability. Examples: quality review gates, optional human spot-checks, detailed verification layer toggles.
- **Mandatory gates** — always active regardless of trust level. Legally required, regulatorily mandated, or organizationally non-negotiable. Examples: final approval on high-risk decisions, policy exception authorization, actions with irreversible consequences.

Trust ladders only affect adaptive gates. Mandatory gates never relax. The system can earn the right to skip a quality spot-check, but it can never earn the right to skip regulatory approval.

### Tension 3: Bounded Agency vs. Self-Improvement

**The conflict:** Bounded Agency (#7) constrains what an agent can do. Self-Improving Cycles (#3) make the agent better over time. Could a self-improving cycle expand the agent's own boundaries?

**Resolution: Self-improvement operates within declared bounds.** Ring 3 can change what happens *inside* the box — prompts, configurations, thresholds, quality rules. It cannot change the *dimensions* of the box — tool access, output authority, escalation requirements, scope declarations.

Boundary expansion (new tools, new authority, new scope, new data access) requires **human authorization**. It is a governance decision (Ring 2), not a learning outcome (Ring 3).

**The invariant:** The box can get smarter inside. It cannot grow itself.

### Tension 4: Validation Loops vs. Latency/Cost

**The conflict:** Validation Loops (#2) and Adversarial Critique (#4) improve quality through iteration and challenge. But each iteration and each challenger invocation costs time and money (LLM calls, compute, human attention). Aggressive validation can make a system too slow or too expensive to be practical.

**Resolution: Budget-aware iteration.** Each validation loop operates within declared budgets:

- **Iteration budget:** Maximum number of passes (hard cap)
- **Cost budget:** Maximum spend per validation cycle
- **Latency budget:** Maximum wall-clock time for the loop
- **Diminishing returns threshold:** If quality score improvement drops below X% between iterations, exit early
- **Proportional critique:** Adversarial critique is invoked based on stakes and trust level, not on every output. High-stakes + low-trust = full challenge. Low-stakes + high-trust = skip.

The budgets are themselves configurable (Ring 3 can adjust them based on observed patterns) and versioned (git commits).

**The invariant:** Quality is bounded by economics, not just by capability. The system pursues "good enough within budget," not "perfect at any cost."

### Tension 5: Memory-Augmented Reasoning vs. Signal-to-Noise

**The conflict:** Memory-Augmented Reasoning (#12) incorporates accumulated knowledge. But as memory grows, relevance filtering becomes critical. Too much context degrades performance. Stale or irrelevant memories inject noise.

**Resolution: Active memory management.**

- **Relevance filtering:** Semantic search + topic filtering + recency weighting. Agents get relevant context, not everything.
- **Decay:** Memories that haven't been accessed or validated in N cycles are flagged for review, then archived.
- **Routing rules:** Not everything goes to memory. Explicit routing: session state → status.md, cross-project learnings → memory, structured research → KB, ephemeral observations → nowhere.
- **Memory hygiene cycles:** Periodic curation (part of Ring 3 learning) to merge duplicates, archive stale entries, and surface gaps.
- **The hard problem:** Distinguishing "stale" from "rarely-needed-but-critical." Access frequency alone is insufficient — some knowledge is infrequently accessed but essential when needed (disaster recovery procedures, edge-case handling rules). Decay policies must account for criticality, not just recency.

**The invariant:** Memory is curated, not accumulated. Growth without curation is hoarding, not learning.

### Tension 6: Policy as Code vs. Self-Improvement

**The conflict:** Policy as Code (#9) encodes governance rules as versioned, executable objects in Ring 2. Self-Improving Cycles (#3) in Ring 3 generate configuration changes based on patterns. Can Ring 3 propose changes to policy rules?

**Resolution: Distinguish configuration from policy.**

- **Configuration** (Ring 3 can change): quality thresholds, verification layer intensity, convergence criteria, prompt parameters, trust levels, iteration budgets. These tune *how well* the system operates.
- **Policy** (Ring 3 cannot change): authorization requirements, mandatory gate definitions, data classification rules, escalation paths, compliance constraints. These define *what the system is allowed to do*.

Ring 3 can recommend policy changes — surface patterns like "this policy threshold triggers false positives 40% of the time." But the recommendation goes through a governance gate (Ring 2) for human authorization before taking effect. Ring 3 optimizes performance within policy. It does not set policy.

**The invariant:** The system can suggest governance changes. It cannot enact them autonomously.

### Tension 7: Environment Optimization vs. Governance Integrity

**The conflict:** Agent Environment Governance (#19) includes a self-improving optimization loop that proposes changes to the agent's operating environment — instructions, tool sets, context priorities, workspace boundaries. Self-improving environments directly improve agent performance. But the environment IS the control surface. An optimization that reduces context (for efficiency) might remove governance-relevant information. An optimization that expands tools (for capability) might expand the attack surface. An optimization that modifies instructions (for clarity) might weaken behavioral constraints.

**Resolution: Separate the optimizable from the inviolable.**

- **Optimizable** (environment loop can propose changes): context priority ordering, tool description wording, session compaction policy, retrieved context relevance thresholds, workspace boundary sizing, instruction formatting and structure. These tune *how well* the environment supports the agent.
- **Inviolable** (environment loop cannot change): governance policy embedded in instructions, tool authorization boundaries (which tools are permitted vs. which are described), security classification of workspace content, data governance constraints in session state, identity substrate. These define *what the environment IS* from a governance perspective.

The optimization loop can propose changes to the inviolable layer — "this instruction constraint causes 30% of task failures" — but the proposal goes through Ring 2 governance and human review. The environment loop optimizes the agent's experience within governance boundaries. It does not move the boundaries.

**The invariant:** The environment can get better. It cannot get less governed.

---

## Cost of Governance

Every ring adds cost. The rings should be independently activatable so you only pay for what the stakes require.

**The economic question is not "how much does governance cost?"** It is **"what is the cost of ungoverned failure?"** For regulated contexts, the comparison is: audit failure, regulatory penalty, reputational damage, legal liability. For any context, the comparison is: the cost of fixing a bad output that wasn't caught vs. the cost of catching it.

**Proportional activation:**
- **Low-stakes task** → Ring 0 + minimal Ring 1 (basic validation). Cost: near-zero overhead.
- **Medium-stakes task** → Ring 0 + Ring 1 (full validation) + adaptive Ring 2 gates. Cost: 1.5-3x Ring 0 alone.
- **High-stakes decision** → All four rings, mandatory gates, full adversarial critique. Cost: 3-5x Ring 0 alone, but the alternative is unacceptable risk.

**Trust Ladders are the primary cost optimization mechanism.** As trust builds, Ring 1 verification intensity decreases and adaptive Ring 2 gates relax. The system starts expensive and gets cheaper as it proves itself — which is the right economic trajectory.

**Ring 3 is an investment, not a cost.** The learning ring improves all other rings over time — better prompts reduce Ring 1 revision loops, better thresholds reduce false-positive gates, better trust calibration reduces unnecessary oversight. Ring 3 pays for itself through efficiency gains in Rings 0-2.

### Real Cost Drivers

The multipliers above (1.5-3x, 3-5x) are not safe general planning assumptions. They describe LLM compute costs only.

**Empirical reference points from the literature:**
- **Policy evaluation overhead:** Microsoft AutoGen Governance Toolkit achieves 0.43s total overhead across 7,000+ decisions over 11 days (~0.06ms per decision) — demonstrating that runtime governance overhead is negligible at per-decision scale.
- **Gateway routing latency:** Bifrost AI gateway achieves 11μs per request at 5,000 RPS — demonstrating that wire-speed routing overhead is feasible for governance middleware layers.
- **Explainability overhead:** SHAP/LIME-based explanation generation adds approximately 2x compute relative to the base inference — a real cost when transparency is required at every gate.
- **Self-improvement costs:** Reflexion-style learning loops (Ring 3 patterns) consume approximately 50x the tokens of a single execution — the learning ring is a genuine investment, not a rounding error. This validates our framing of Ring 3 as an investment that must demonstrate ROI through efficiency gains in Rings 0-2.

These benchmarks are point-in-time and will evolve. They are included not as planning constants but as calibration evidence that governance overhead is measurable and manageable at production scale.

The real cost drivers of governance are organizational, not computational:

| Cost Driver | What It Costs | Why It Matters |
|------------|--------------|---------------|
| **Human review bandwidth** | Human time at gates, quality of attention, reviewer availability | The scarcest resource. Humans can review ~5-15 complex gates per hour before quality degrades. Scaling human review linearly with agent volume is not viable — Trust Ladders and adaptive gates are the economic answer. |
| **Policy authoring and maintenance** | Expert time to write, test, and update policy-as-code rules | Policies rot. The regulatory landscape shifts. New agent capabilities require new policies. Policy maintenance is an ongoing cost, not a one-time investment. |
| **Evaluation suite maintenance** | Keeping red-team scenarios, regression suites, and policy test harnesses current | Evaluation & Assurance (#18) is only as good as the test suite. Stale tests give false assurance. Maintaining evaluation quality is a continuous cost. |
| **Trace storage and retrieval** | Event stream storage, provenance chain persistence, memory-state snapshots | Observability generates data. At scale (millions of agent executions), trace storage becomes a significant infrastructure cost. Retention policies, sampling strategies, and tiered storage are necessary. |
| **Incident response** | Forensic analysis, containment, recovery, post-incident review | When governance catches a real issue, the response itself has cost. Pre-authorized responses (Security Response Bus) reduce this, but novel incidents require human investigation. |
| **Governance debt** | Accumulated policy exceptions, deferred reviews, untested configurations | Like technical debt, governance debt compounds. Deferred policy updates and untested configuration changes create hidden risk that eventually surfaces as incidents. |

### Minimum Viable Ring Stack

Not every system needs the full governance architecture. The minimum viable ring stack — the least governance that is still governance — is:

**Ring 0 + Ring 1 + thin Ring 2 + fabric + Ring 3 advisory only**

- **Ring 0:** Full execution with structured output, identity, and bounded agency.
- **Ring 1:** At least one verification layer (can be lightweight — schema validation + basic quality check).
- **Thin Ring 2:** Mandatory gates for irreversible actions only. No adaptive gates. Policy evaluation limited to side-effect classification and irreversibility checks.
- **Fabric:** Structured output persistence, event emission, error recovery, security fabric (identity at boundaries, basic containment).
- **Ring 3 advisory:** Observes patterns, suggests improvements, but does not auto-apply changes. Human reviews and manually applies Ring 3 recommendations.

This stack provides: verified outputs, irreversible-action gates, audit trail, and observability. It does not provide: full policy evaluation, adaptive trust, automated learning, or adversarial robustness. For low-stakes internal tools and personal productivity agents, this may be sufficient. For anything regulated or high-stakes, the full stack is necessary.

---

## How the Primitives Compose

The primitives compose into higher-order patterns through the rings:

**Minimum Viable Control Foundation:**
Bounded Agency (#7) + Identity & Attribution (#14) + Provenance Chains (#6) + Event-Driven Observability (#10) + Agent Environment Governance (#19, minimal: scoped workspace + curated instructions). This is the cluster you need even if you have nothing else — the absolute floor for a consequential agent system. Note: environment governance at this tier is simple — scoped workspace boundaries and versioned instructions, not the full optimization loop.

**Validation Pipeline** (Ring 0 + Ring 1):
Minimum Viable Control + Separation of Producer/Verifier (#1) + Validation Loops (#2) + Adversarial Critique (#4) + Structured Output (#5) + Error Handling (#13)

**Governed Decision Flow** (Ring 0 + Ring 1 + Ring 2):
Validation Pipeline + Governance Gates (#8) + Policy as Code (#9) + Transaction & Side-Effect Control (#16) + Data Governance & Confidentiality (#17)

**Secure Governed System** (All rings + zero trust):
Governed Decision Flow + Adversarial Robustness (#15) + zero trust posture at every ring boundary + security correlation in observability layer + Evaluation & Assurance (#18) as the deployment gate

**Learning System** (Ring 3 + fabric):
Self-Improving Cycles (#3) + Memory-Augmented Reasoning (#12) + Event-Driven Observability (#10) + Versioned control-plane state. Ring 3 configuration changes validated by Evaluation & Assurance (#18) before deployment.

**Full Governed Agentic System** (All rings, all primitives, zero trust):
Ring 0 (execution) → Ring 1 (verification) → Ring 2 (governance) → Ring 3 (learning), on a substrate of structured output + event observability + error recovery + versioned state + zero trust identity verification at every boundary + data governance at every data flow + evaluation & assurance gating every deployment + **Agent Environment Governance (#19) providing the managed operating substrate** — governed context composition, versioned instruction architecture, trust-gated capability provisioning, least-privilege workspace scoping, and the environment optimization loop continuously improving the substrate through Ring 3 learning validated by Ring 2 governance.

### Application Examples

These composition patterns are general-purpose. To illustrate how they map to concrete systems:

- A **risk decision platform** is primarily a Governed Decision Flow — Ring 0 through Ring 2 applied to risk-bearing decisions.
- An **agent monitoring/governance product** is the event fabric + Ring 3 intelligence — making the event stream a product for monitoring, correlating, and governing any agentic system.
- A **document processing pipeline** might start as a Validation Pipeline (Ring 0 + Ring 1) and evolve toward a Governed Decision Flow as governance requirements increase.
- A **personal productivity agent** might run Ring 0 + Ring 3 only — execution with learning, no formal governance layer.

---

## Prior Art Mapping

This framework stands on the shoulders of extraordinary work by standards bodies, security organizations, government agencies, academic researchers, and industry practitioners. We did not invent the patterns in this document. We connected them.

The mapping below acknowledges where each part of this framework comes from, how we understand it connecting to the broader landscape, and where our contribution is composition rather than creation. We lead with gratitude for the work that made this synthesis possible.

### Standards Bodies and Government Frameworks

#### NIST — AI Risk Management and Agent Security

NIST's contributions to AI governance are foundational. The AI RMF 1.0 provides the organizing functions; the GenAI Profile (AI 600-1) extends them for generative AI; and the February 2026 CAISI AI Agent Standards Initiative is now building the agent-specific layer.

| NIST Work | What It Contributes | How We Build On It |
|-----------|--------------------|--------------------|
| **AI RMF 1.0** (GOVERN, MAP, MEASURE, MANAGE) | The four organizing functions for AI risk management | Our primitives are **agentic specializations of** these functions, not replacements. **GOVERN** (establish and maintain organizational AI risk governance): Ring 2 instantiates runtime governance — policy evaluation, gate decisions, delegation authority — within the broader organizational governance that GOVERN defines. **MAP** (context framing, risk identification, and categorization): Risk classification + ring activation intensity instantiate MAP's context-framing and risk-identification functions — determining which risks apply to this agent in this context and how intensively to govern. MAP is broader than classification alone; it includes understanding the AI system's context, stakeholders, and potential impacts. **MEASURE** (quantify, monitor, and assess AI risks): Evaluation & Assurance (#18) instantiates pre-deployment measurement; Ring 1 verification + Event-Driven Observability (#10) instantiate continuous runtime measurement. **MANAGE** (allocate resources, plan responses, manage risks): Trust Ladders (#11) + Bounded Agency (#7) instantiate MANAGE's risk treatment — calibrating autonomy levels and enforcing operating boundaries as risk management mechanisms. MANAGE is broader than trust calibration; it includes organizational response planning, resource allocation, and risk prioritization that sit above our runtime architecture. We do not claim to cover the full breadth of each function — these are runtime mechanisms within broader organizational functions. |
| **NIST SP 800-207** (Zero Trust Architecture) | The definitive framework for zero trust — PDP/PEP architecture, continuous verification | Our Security Fabric maps to PEP (enforcement), Security Governance maps to PDP (policy decisions), Security Intelligence maps to continuous diagnostics. We apply these established patterns to inter-ring trust, not just network trust. |
| **NIST NCCoE Agent Identity Concept Paper** (Feb 2026) | Agent-specific identity and authorization — SPIFFE/SPIRE, OAuth 2.1, OIDC, NGAC | Our Identity & Attribution (#14) primitive addresses the same concerns. The NCCoE paper provides the specific protocol recommendations (SPIFFE/SPIRE for cryptographic workload identity, NGAC for attribute-based access control) that implementations of our identity primitive should follow. We reference these protocols; the NCCoE paper specifies them in detail. |
| **NIST IR 8596** (Cybersecurity AI Profile, Dec 2025) | Maps AI agent security onto NIST CSF 2.0's six functions (Govern, Identify, Protect, Detect, Respond, Recover) across three focus areas: (1) Securing AI Systems — inventorying models/agents/integrations, clear ownership of AI actions; (2) AI-Enabled Cyber Defense — AI-driven security operations with HITL for sensitive actions, visibility into AI-generated decisions before production impact; (3) Thwarting AI-Enabled Attacks — assuming AI-driven attacks as baseline, earlier credential abuse detection, automated governed controls. Developed through the NIST Cyber AI Community of Interest (6,500+ participants across the broader CSF 2.0 ecosystem). | Extends our security architecture alignment beyond AI RMF to the cybersecurity-specific framework. Enterprise security teams think in CSF 2.0 terms; this mapping bridges our architecture to their language. Focus area 1 maps to our Security Fabric + Identity & Attribution (#14). Focus area 2 maps to Security Intelligence + Security Response Bus with human oversight. Focus area 3 maps to Adversarial Robustness (#15). The profile's treatment of AI agents as *actors* (not just applications) — entities that make decisions and take actions at machine speed — directly validates our Identity primitive's position that agent identity must be first-class, not derived from the deploying user's identity. The profile's emphasis on least privilege, strong authentication, and continuous verification mirrors our zero trust posture. |
| **NIST CAISI AI Agent Standards Initiative** (Feb 2026) | Organizing signal for agent-specific standards development | Validates the thesis that agentic governance requires purpose-built standards. The RFI highlights agent-specific threat vectors (indirect prompt injection, memory exploitation, specification gaming) that our Security Architecture and OWASP mapping address. |

#### EU AI Act

The EU AI Act provides the regulatory foundation that makes governance frameworks necessary, not optional.

| Article | What It Requires | Framework Mapping |
|---------|-----------------|------------------|
| **Art. 6 — Classification** | Rules for classifying AI systems as high-risk | Our risk classification and ring activation intensity are informed by this classification logic. High-risk classification under Art. 6 implies full ring stack activation. |
| **Art. 9 — Risk management** | Risk management system throughout lifecycle | Three-level security model + risk-based ring activation |
| **Art. 10 — Data governance** | Data collection, preparation, bias examination, representativeness | Data Governance & Confidentiality (#17) — classification, lineage, consent, retention |
| **Art. 11 — Technical documentation** | Complete documentation enabling conformity assessment | Provenance Chains (#6) + versioned control-plane state — every decision traceable and replayable |
| **Art. 12 — Record-keeping** | Automatic recording of events (logs) relevant to identifying risks, substantial modifications, and post-market monitoring obligations | Event-Driven Observability (#10) + Provenance Chains (#6) — structured event emission from all rings. Art. 12 requires logs to be "appropriate to the intended purpose of the high-risk AI system" and retained for an appropriate period — our ring-level event architecture satisfies this by emitting structured, timestamped events at every ring boundary with full identity context. Note: Art. 12's specific minimum field requirements apply primarily to remote biometric identification systems; for other high-risk AI, the logging requirements are more general. Our architecture provides comprehensive logging that exceeds Art. 12's general requirements. |
| **Art. 13 — Transparency** | Sufficient transparency for deployers to interpret output and detect anomalies | Identity & Attribution (#14) — full identity context on every action. Art. 13 requires that deployers can "interpret the system's output and use it appropriately" — our provenance chains, confidence signals, and gate decision explanations provide the interpretability substrate. |
| **Art. 14 — Human oversight** | Effective human oversight including: ability to fully understand capabilities/limitations, monitor operation, intervene/interrupt/halt in safe state, and decide not to use the system | Governance Gates (#8) with human interface requirements — evidence presentation, counterfactual framing, rubber-stamping detection. Art. 14's explicit "stop button" requirement maps to our Security Response Bus safe-halt mechanics and containment semantics. Art. 14's requirement for humans to "correctly monitor" maps to our human cognitive vulnerability protections (approval fatigue detection, cooling-off periods). Engels et al. (NeurIPS 2025) demonstrate that oversight efficacy degrades as the capability gap widens — a structural challenge for Art. 14 compliance as agent capabilities increase. See Known Limitations. |
| **Art. 15 — Accuracy, robustness, cybersecurity** | Resilience against attacks including data poisoning, adversarial examples, model manipulation, and exploitation of supply chain vulnerabilities | Adversarial Robustness (#15) + Security Architecture + Evaluation & Assurance (#18). Art. 15 explicitly names attack categories our three-level security model addresses: data poisoning → Data Governance (#17) + Intelligence memory introspection; adversarial examples → Security Fabric input sanitization; model manipulation → configuration integrity attestation; supply chain → supply chain trust policy. Art. 15's cybersecurity requirement for "appropriate levels of accuracy, robustness and cybersecurity" supports our risk-proportional ring activation — higher-risk classification triggers more intensive ring processing. |
| **Art. 50 — Transparency obligations** | Users must be informed they are interacting with AI | Identity context at gates includes AI-system identification. |

**What this mapping does NOT cover:** Art. 43 (conformity assessment procedures), Art. 73 (serious incident reporting to market surveillance authorities), Art. 51-56 (GPAI model obligations), Art. 72 (post-market monitoring), and Art. 26 (deployer obligations). These are organizational/regulatory processes that sit above our runtime architecture. We acknowledge these gaps — our framework provides the technical evidence substrate that these processes require, but does not define the processes themselves.

#### Singapore — Agentic AI Governance

Singapore has been at the forefront of agentic AI governance, publishing the first government frameworks specifically for autonomous agent systems.

| Framework | What It Contributes | How It Relates |
|-----------|--------------------|--------------------|
| **IMDA Model AI Governance Framework for Agentic AI** (Jan 2026) | World's first government-published governance framework specifically for agentic AI systems. Four dimensions: (1) Risk Assessment & Bounding — restrict tool access, sandbox environments, fine-grained permissions; (2) Accountability & Human Oversight — defined roles across agent lifecycle, HITL for high-stakes/irreversible actions, automation bias safeguards; (3) Technical Controls & Testing — output accuracy, tool usage validation, policy compliance, workflow reliability, gradual rollout with anomaly monitoring; (4) End-User Responsibility — user training, transparency on agent permissions, active stewardship. | Direct external validation of this framework's thesis. Dimension 1 maps to our Bounded Agency (#7) + Security Fabric. Dimension 2 maps to Governance Gates (#8) + human interface requirements. Dimension 3 maps to Evaluation & Assurance (#18) + Ring 1 verification. Dimension 4 maps to Identity & Attribution (#14) transparency requirements. The IMDA framework's emphasis on action reversibility as a risk factor aligns with our Transaction & Side-Effect Control (#16). The IMDA framework also explicitly includes "operational environments" as something to be bounded and governed — directly validating Agent Environment Governance (#19). Note: the Stability-Assured Framework for Entities (SAFE) concept (measurable control guarantees using observability, controllability, and feedback latency) has been discussed in the Singapore AI governance ecosystem by David Hardoon but does not appear in IMDA's official MGF for Agentic AI materials — it is an adjacent concept, not a named framework element within the MGF. |
| **GovTech Agentic Risk & Capability (ARC) Framework** (Dec 2025) | 46 risks, 88 controls with risk-to-control mappings, interactive risk register (ARCvisor) | The most operationally complete government-backed risk framework. Triangulates our risk classification and ring activation logic against an independently developed taxonomy benchmarked against NIST AI RMF, EU AI Act, OWASP, Google SAIF 2.0, and MAESTRO. |

#### ISO/IEC and IEEE

| Standard | What It Contributes | How It Relates |
|----------|--------------------|--------------------|
| **ISO/IEC 42001** (AI Management System) | Requirements for establishing an AI management system — risk management, ethical guidelines, operational planning, documentation | Our Policy as Code (#9) and continuous audit primitives map to ISO 42001's operational planning and documentation requirements. However, ISO 42001 lacks practical guidance for managing autonomy drift in dynamic agents — the gap our runtime architecture addresses. A formal Annex A control crosswalk is needed for enterprise compliance. |
| **IEEE P2863** (Recommended Practice for Organizational Governance of AI, finalizing 2026) | Specific organizational criteria for accountability, ethics, responsible development, continuous performance auditing | Bridges the gap between our runtime architecture and organizational governance requirements. Our framework provides the technical enforcement layer; IEEE P2863 provides the organizational governance practice. Together they cover the full stack from policy to runtime. |

### Security Frameworks

#### OWASP Top 10 for Agentic Applications (2026)

OWASP's Agentic Security Initiative, with 100+ researchers and a NIST-represented Expert Review Board, published the definitive threat taxonomy for agentic systems. Mapped in detail in [Security Architecture](#security-architecture) — all 10 threats (ASI01-ASI10) mapped to the three-level security model with primary and supporting defenses identified.

OWASP also published two MCP-specific resources: the **OWASP MCP Top 10** (note: this taxonomy is living/beta as of March 2026 — the OWASP web page and GitHub repository show signs of evolving category definitions; implementations should pin to a specific version) and a **Practical Guide for Secure MCP Server Development** (Feb 2026). The MCP Top 10 identifies: token mismanagement (MCP01), privilege escalation via scope creep (MCP02), tool poisoning (MCP03), supply chain attacks (MCP04), command injection (MCP05), prompt injection via contextual payloads (MCP06), insufficient auth (MCP07), lack of audit/telemetry (MCP08), shadow MCP servers (MCP09), and context injection/over-sharing (MCP10). These map directly to our security architecture: MCP01/MCP07 → Identity & Attribution (#14) + Security Fabric authentication; MCP02 → Bounded Agency (#7) scope enforcement; MCP03/MCP04 → Adversarial Robustness (#15) supply chain trust; MCP05/MCP06 → Security Fabric input validation + intent verification; MCP08 → Event-Driven Observability (#10); MCP09 → Security Governance policy enforcement; MCP10 → Data Governance (#17) compartmentalization. The Secure MCP Development Guide provides implementation-level specificity — MCP servers run locally with full host access, community-built servers undergo no security review, and the spec lacks mandatory tool integrity verification. Our Security Fabric and supply chain trust policy address these risks at the architecture level, but implementations should follow the OWASP MCP guides for protocol-level specifics.

#### CSA Agentic Trust Framework and MAESTRO

The Cloud Security Alliance's work on agentic trust is the most directly applicable zero trust governance framework for AI agents. Mapped in detail in [Security Architecture](#security-architecture).

Trust Ladders (#11) align with CSA ATF's earned autonomy maturity model (Intern → Junior → Senior → Principal). The ATF's promotion gates — requiring time-at-level, performance thresholds, security validation, and governance sign-off before autonomy escalation — provide operational specificity that our trust ladder architecture should adopt more formally.

CSA's **MAESTRO** (Multi-Agent Environment, Security, Threat, Risk, and Outcome) threat modeling framework provides 7-layer threat modeling with per-layer and cross-layer threat analysis. Primitive mapping to MAESTRO layers:

| MAESTRO Layer | Scope | Primary Primitives | Ring Mapping |
|---------------|-------|-------------------|--------------|
| L1: Foundation Models | Base LLM reasoning, generation, tool-usage capabilities | Adversarial Robustness (#15), Evaluation & Assurance (#18) | Ring 0 (execution) |
| L2: Data Operations | Data handling, preparation, retrieval, ingestion pipelines | Data Governance (#17), Memory-Augmented Reasoning (#12) | Ring 0 + Security Fabric |
| L3: Agent Frameworks | Orchestration (planners, routers, tool-call schemas, memory interfaces) | Composability Interface, Bounded Agency (#7), Policy as Code (#9), Agent Environment Governance (#19) | Ring 1 + Ring 2 |
| L4: Deployment Infrastructure | Runtime environment (cloud, IAM, secrets, CI/CD, service mesh) | Identity & Attribution (#14), Transaction & Side-Effect Control (#16), Agent Environment Governance (#19) | Security Fabric |
| L5: Evaluation & Observability | Monitoring, assessment, anomaly detection | Event-Driven Observability (#10), Validation Loops (#2), Evaluation & Assurance (#18) | Ring 1 + Ring 3 |
| L6: Security & Compliance | Governance, regulatory alignment, policy enforcement | Governance Gates (#8), Policy as Code (#9), Trust Ladders (#11) | Ring 2 |
| L7: Agent Ecosystem | Multi-agent interactions, marketplaces, inter-org trust | Multi-Agent Coordination, Cross-System Trust, DELEGATE signal | Ring 2 + Cross-cutting |

**Cross-layer coverage:** MAESTRO emphasizes that the most dangerous attack paths chain across layers (e.g., L1 prompt injection → L3 tool misuse → L4 infrastructure compromise). Our Security Response Bus addresses cross-layer threat propagation through pre-authorized fast-path containment, and our Security Intelligence layer performs the correlation analysis that identifies these cross-layer chains. MAESTRO's distinction between traditional threats and agentic-specific threats (arising from non-determinism, autonomy, and absent trust boundaries) aligns with our framework's core thesis that agentic systems require purpose-built governance.

### Academic Research

We are deeply grateful for the academic community's contributions to agentic governance. Several papers directly informed or validated specific parts of this architecture:

| Research | What It Contributes | How We Use It |
|----------|--------------------|--------------------|
| **DeepMind "Intelligent AI Delegation"** (Tomašev et al., Feb 2026) | 9-component delegation framework with 11-axis task taxonomy, organized into 5 pillars | Validates and informs our multi-agent coordination, DELEGATE signal, Trust Ladders, and cross-system trust sections. The most comprehensive formal vocabulary for delegation governance. |
| **Anthropic "Measuring AI Agent Autonomy"** (Feb 2026) | Empirical data from millions of real interactions: 20%→40% auto-approval scaling, 0.8% irreversible actions, 73% HITL oversight, deployment overhang | The strongest empirical foundation for Trust Ladders (#11). Confirms graduated trust models and conservative default autonomy. |
| **MAST Multi-Agent Failure Study** (Cemri et al., NeurIPS 2025) | 14 failure modes across 1,642 traces, 41-86.7% failure rates, 36.9% inter-agent misalignment | Validates our multi-agent coordination section and the governance collapse rule. The failure mode taxonomy directly informs what our ring architecture must catch. |
| **SAGA Security Architecture** (Syros et al., NDSS 2026) | First fully implemented cryptographic access control for agent systems — per-interaction OTK tokens, split control/data plane | Validates our Security Fabric identity enforcement pattern. SAGA's key architectural insight is **control/data plane separation**: the control plane handles token issuance, authorization decisions, and policy evaluation (our Ring 2 + Security Governance), while the data plane handles direct agent-to-tool communication via TLS without routing through the control plane (our Ring 0 execution with Fabric-level enforcement). This separation is critical for scalability — per-interaction tokens are issued by the control plane but verified locally at the data plane boundary, avoiding a control-plane bottleneck. Our framework captures the per-interaction token pattern but should adopt SAGA's explicit plane separation more formally: Ring 2 governance operates on the control plane (policy decisions, gate evaluations), while Ring 0 execution and Security Fabric enforcement operate on the data plane (direct execution with locally-verified identity). |
| **AgentSpec** (Wang et al., ICSE 2026) | Lightweight DSL for runtime constraint enforcement — deterministic, rule-based, 90%+ prevention rates | Validates Policy as Code (#9) as a **deterministic enforcement** mechanism. AgentSpec's trigger-predicate-enforce syntax is a reference implementation for our policy-as-code primitive. Note: AgentSpec is deterministic and does not provide probabilistic compliance guarantees. |
| **AgentGuard** (Koohestani et al., ASE 2025) | Dynamic Probabilistic Assurance — online learning to build/update Markov Decision Process models, probabilistic runtime verification | Complements AgentSpec by addressing the stochastic nature of LLM behavior. Where AgentSpec enforces deterministic boundaries, AgentGuard provides quantitative probability assessments for non-deterministic behaviors. Both are needed. |
| **SentinelAgent** (He et al., May 2025) | Dynamic execution graph analysis — models agent interactions as graphs, 92% accuracy identifying harmful behaviors via OTel | Validates our Security Intelligence layer design. SentinelAgent's three-tier anomaly detection (node, edge, path levels) maps directly to our behavioral anomaly detection and cross-pipeline correlation capabilities. |
| **SagaLLM** (VLDB 2025) | Formalizes the Saga distributed transaction pattern for multi-agent systems | Directly validates Primitive #16 (Transaction & Side-Effect Control). Independent confirmation that agent side effects require formal transaction semantics — compensation, idempotency, partial-execution recovery. |
| **"Mind the GAP"** (Feb 2026, arXiv) | Text-safety ≠ tool-call-safety in LLM agents. Governance contracts reduce leakage but show no deterrent on forbidden tool-call attempts | High-leverage finding for our security model: tool-call governance must be first-class, not inferred from text-level safety behavior. Directly supports why Security Fabric must operate at the tool-call boundary, not just the prompt boundary. |
| **Pro2Guard** (Late 2025) | Proactive probabilistic enforcement using discrete-time Markov chains — anticipates violations before they manifest | Extends our Security Intelligence beyond reactive detection to proactive prediction. Our current architecture is primarily reactive (detect → respond). Pro2Guard represents where the field is heading — anticipate → prevent. |
| **AGENTSAFE** (Khan et al., Dec 2025) | Design-time, runtime, and audit governance with capability-scoped sandboxes | Closest taxonomic precedent to our substrate/runtime/lifecycle primitive classification. AGENTSAFE's three-phase model validates the need for governance across the full agent lifecycle, not just at runtime. |
| **Agent Contracts** (Ye & Tan, Jan 2026, arXiv: 2601.08815) | Multi-dimensional resource constraints with budgets and conservation laws — 90% token reduction and 525× lower variance with contracted execution | Directly validates Agent Environment Governance (#19) capability provisioning. Demonstrates that formal resource budgets dramatically improve efficiency and predictability. |
| **Layered Governance Architecture (LGA)** (Mar 2026) | Execution sandboxing, intent verification, zero-trust inter-agent authorization, immutable audit logging — benchmarked on OpenClaw | The strongest governance-specific academic anchor for Agent Environment Governance (#19). LGA explicitly treats sandboxing and audit as a governance stack with measurable outcomes, complementing AgentOS's engineering framing with governance rigor. |
| **AgentOS** (arXiv, Feb 2026) | Full OS metaphor for agent context — L1/L2/L3 memory hierarchy, semantic paging, Reasoning Interrupt Cycle for tool invocation, Cognitive Drift detection, Cognitive Sync Pulses for multi-agent alignment | The most ambitious formalization of the agent operating environment. Directly informs Agent Environment Governance (#19) — our environment stack maps to their memory hierarchy, our optimization loop maps to their drift detection, and our recursive governance maps to their synchronization model. AgentOS treats this as an engineering problem; we add the governance layer. |
| **Anthropic "Effective Context Engineering"** (2025) | Context as "precious, finite resource" — finite attention budget, JIT retrieval, compaction, sub-agent architectures, structured note-taking, "right altitude principle" for instructions | The practitioner's guide to context engineering. Directly informs Agent Environment Governance (#19) — composition patterns, instruction architecture, session state management. Anthropic's framing of context engineering as iterative curation (not static prompting) validates our environment optimization loop. |

### Industry Architecture References

| Reference | What It Contributes | How We Use It |
|-----------|--------------------|--------------------|
| **LangChain Context Engineering** (2025-2026) | Context as "compiled view over richer stateful system" — sessions, memory, and artifacts as sources; flows and processors as compiler pipeline | Validates our environment stack architecture. LangChain's "compiler" metaphor maps to our composition patterns: sources (Layers 1-5 inputs) are compiled through flows (composition policy) into the working context (what the agent sees). |
| **Microsoft Multi-Agent Reference Architecture** (2026) | Three orchestration context patterns: static tools, vector similarity search, semantic caching | Informs Agent Environment Governance (#19) capability provisioning — specifically the trade-off between static provisioning (simple, limited) and dynamic discovery (flexible, higher overhead). |
| **NVIDIA OpenShell** (Mar 2026) | Secure agent runtime with kernel-level isolation, per-binary/endpoint/method policy control | The security-first approach to agent environment management. Validates our position that environment governance is a security concern — OpenShell treats the runtime environment as an attack surface requiring granular policy control. |
| **Google ADK** (Agent Development Kit, 2026) | Tiered context storage, compiled views, pipeline processing, strict scoping | Validates our environment stack's layered architecture. ADK's tiered storage maps to our L1-L5 layers; their strict scoping maps to our workspace scoping governance. |
| **Denis Rothman "Context Engine"** (Packt, Nov 2025) | Context Fabric with structured slots, orchestrator, governance plane. Ch. 8 covers policy-driven AI; Ch. 10 covers production guardrails. | Application-level governance treatment (moderation, content safety) rather than a formalized governance architecture. Validates the direction but does not define "governance plane" as a distinct architectural layer. |
| **Prompt Governance** (Douglas Jackson, Dec 2025; CIO.com five-pillar framework) | Treats prompts as governed artifacts — versioning, auditing, lifecycle management, organizational accountability. Layered governance of system/policy, domain, task, and formatting layers. | Direct partial precursor to Agent Environment Governance (#19) instruction architecture component. The five-pillar framework aligns with NIST AI RMF. Acknowledged as prior art for the instruction governance dimension. |
| **Microsoft MCP Governance** (Feb 2026) | Internal four-layer governance framework for MCP: discovery/metadata, identity/credentials, content/data, infrastructure. Includes "MCP Firewalls" and "Governance Registries." | The most concrete example of governance applied *to* MCP at scale. Validates our MCP integration in Middleware mode and provides implementation-level specificity for MCP governance patterns. |

### Observability Standards

#### OpenTelemetry GenAI Semantic Conventions

OTel provides the interoperable telemetry substrate that our observability architecture depends on.

| OTel Convention | Framework Mapping |
|----------------|------------------|
| `create_agent` / `invoke_agent` spans | Ring 0 execution events — agent identity, configuration, invocation context |
| `execute_tool` spans | Ring 1 verification events (tool selection checks) + Ring 2 governance events (tool authorization) |
| `gen_ai.conversation.id` (v1.40.0, Feb 2026) | Session-level correlation for governance evidence — durable correlation of tool calls, approvals, and interventions |
| Agent trace context propagation | Identity context propagation through rings — identity travels with every action |
| MCP semantic conventions | Trace continuity across tool boundaries — note: MCP does not yet define standard trace context propagation; OTel advises using `params._meta` |

**Honest status:** OTel GenAI conventions remain in "Development" status (requiring explicit opt-in via `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`). Current standard conventions cover foundational operational events but do not include ring-level governance events, gate decisions, or trust calibration telemetry.

Our governance-specific attributes (ring_id, signal_type, gate_decision, trust_level, delegation_chain) are **custom extensions** that operate within the OTel data model but outside the standard semantic namespace. These are implementable as custom attributes but would need to be proposed to the OTel GenAI SIG as a formal extension for standardization. We believe governance telemetry should become part of the standard conventions, and we intend to contribute toward that goal.

### Protocol Standards

#### MCP (Model Context Protocol)

MCP has emerged as the de facto standard for tool execution middleware, adopted natively by OpenAI, Anthropic, and Cloudflare. It defines the integration surface between reasoning models and external tools — authentication, authorization, and data boundary controls.

**How it maps to our framework:** MCP operates primarily in the middleware/interrupt deployment mode. Ring 2 policy defines which MCP servers and tools are authorized. The Security Fabric verifies tool integrity at invocation. Supply chain trust policy (#15) governs MCP server trust — a critical concern given documented MCP vulnerabilities (tool poisoning, rug-pull attacks, 53% of MCP servers using insecure static keys per Astrix Security research, 2025).

**What we address and where we defer:** MCP governance is now integrated into our Middleware/Interrupt deployment mode (dynamic tool discovery governance, server trust chains, context-as-attack-surface, session isolation) and Security Architecture (supply chain trust policy for MCP servers, OWASP MCP Top 10 threat mapping). For protocol-level implementation specifics — secure server development practices, tool integrity verification code patterns, deployment hardening checklists — OWASP's Secure MCP Development Guide and MCP Top 10 provide the implementation-level guidance that complements our architecture-level treatment.

#### A2A (Agent-to-Agent Protocol)

Google's A2A protocol (April 2025, now under Linux Foundation AAIF) addresses agent-to-agent communication with JWT/OIDC authentication. Ring 2 policy defines which agents may communicate. Security Fabric enforces mutual authentication. Identity & Attribution (#14) carries through A2A interactions. DELEGATE signal enables governed lateral delegation.

**Known gaps in A2A that our framework inherits:** A2A does not yet enforce short-lived tokens, lacks consent mechanisms, and has coarse-grained authorization scopes. Our cross-system trust section acknowledges these protocol-level gaps but does not resolve them — they require protocol-level evolution in A2A itself.

#### AGNTCY and Linux Foundation AAIF

The Linux Foundation's Agentic AI Interoperability Forum (AAIF) now houses MCP, A2A, AGNTCY (Cisco-originated agent infrastructure), and AGENTS.md — with gold members including Anthropic, OpenAI, Google, Microsoft, and AWS. This consolidation signals that the protocol governance landscape is converging. MCP's public roadmap (March 2026) includes "Governance Maturation" and "Enterprise Readiness" goals including audit trails and SSO-integrated auth — evidence that governance requirements are entering protocol roadmaps.

### Evaluation Frameworks

| Framework | What It Contributes | Relevance to #18 |
|-----------|--------------------|--------------------|
| **UK AISI Inspect** | Open-source agent evaluation framework with 100+ pre-built evaluations | The most concrete reference implementation anchor for Evaluation & Assurance (#18). Provides practical eval infrastructure rather than abstract eval principles. |
| **METR** (Model Evaluation and Threat Research) | Agent task-length capability measurement, prompted monitors (AUROC 0.96 for reward hacking) | Empirical calibration for what evaluation can realistically detect. Agent capability doubles approximately every 7 months — evaluation suites must evolve at least as fast. |
| **OWASP AI Red Teaming Vendor Evaluation Criteria** (Feb 2026) | Standardized criteria for evaluating red-teaming providers and tooling | Supports our Evaluation & Assurance primitive's red-teaming component with vendor-neutral selection criteria. |

---

## Open Questions

- **Ring activation flexibility:** *Answered — see Minimum Viable Ring Stack in Cost of Governance.* Ring 0 + Ring 1 + thin Ring 2 + fabric + Ring 3 advisory is the floor. Rings are independently attachable. Cost of Governance provides the economic framework.
- **Trust ladder portability:** Can trust earned in one system transfer to another, or does each system start from zero? *Partial answer (Mar 2026): Anthropic's agent autonomy research suggests trust is behavioral and transfers across tasks within a platform — users who reach 40% auto-approval do so across all their agent sessions, not task by task. But new task TYPES still reset trust. Trust transfers within a context boundary but not across context boundaries. See also Cross-System Trust in Multi-Agent Coordination — federated trust defaults to Intern level across organizational boundaries.*
- **Memory routing at scale:** When dozens of agents share memory/KB, how do you prevent noise from drowning signal? *Partial answer (Mar 2026): Krypton's namespace pattern (global, project-scoped, session-scoped) provides a first-order filter. But namespace alone isn't enough — topic relevance scoring at query time is the real mechanism. KB semantic search does this; Memory MCP doesn't yet.*
- **Cross-ring communication:** Does Ring 3 ever directly influence Ring 0 mid-execution? Current model: no for systematic improvement (slow path), yes for anomaly response (sentinel fast path). The sentinel mechanism provides the near-real-time channel without making Ring 3 a synchronous dependency.
- **Personal vs. enterprise:** Which rings simplify for personal agent use? *Partial answer: see Minimum Viable Ring Stack.* For personal agents, Ring 2 simplifies to personal preferences rather than organizational policy. Ring 3 (learning) may be the most valuable personal ring. *Emerging signal (Mar 2026): Anthropic's deployment gap data suggests personal agents DO need trust ladders — users naturally create them informally.*
- **Testing ring configurations:** *Answered — see Evaluation & Assurance (#18).* Policy test harnesses, regression testing, simulation environments, and configuration change risk tiers address this.
- **Multi-agent trust:** When Pipeline A's output feeds Pipeline B, does Pipeline B inherit Pipeline A's trust level? *Partial answer: see Cross-System Trust in Multi-Agent Coordination.* Within a trust domain, trust context propagates via identity. Across organizational boundaries, trust resets to Intern level unless federated trust agreements exist.
- **Determinism spectrum:** When should agentic systems use LLM reasoning vs. deterministic execution? The emerging pattern: LLM for understanding, interpretation, and novel situations. Deterministic execution for actions, transactions, and compliance-critical steps. Ring 0 may mix both; Ring 2 policy evaluation should be deterministic where possible to ensure predictability.
- **Observability vs. Privacy tension:** How deep should monitoring go before it violates user privacy or agent autonomy norms? Security Intelligence needs introspection for threat detection, but comprehensive surveillance of agent internals conflicts with legitimate privacy expectations — especially for personal agents. The resolution likely involves tiered introspection: full introspection for enterprise high-risk agents, behavioral-only monitoring for personal low-risk agents.
