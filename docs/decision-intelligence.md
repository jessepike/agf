# Decision Intelligence

**Status:** Living concept document
**Last updated:** 2026-03-16
**Terminology:** [Shared Vocabulary](shared-vocabulary.md)
**Relationship:** A **Governed Decision Flow** built on the Agentic Primitives framework — Ring 0 through Ring 2 applied to risk-bearing decisions, with Ring 3 learning across decision cases over time.
**Detailed architecture:** `research/vision/decision-intelligence-platform-vision.md` (consolidated from 10+ session documents)

---

## Contents

1. [Core Thesis](#core-thesis)
2. [First Principles](#first-principles)
3. [Mapping to Agentic Primitives](#mapping-to-agentic-primitives)
4. [Key Patterns](#key-patterns) — Risk Decision Graph, Belief Layer, Challenger, Multi-Agent Governance
5. [Architecture Through the Rings](#architecture-through-the-rings)
6. [Zero Trust for Decision Systems](#zero-trust-for-decision-systems)
7. [Build Sequence](#build-sequence)
8. [Threads to Current Work](#threads-to-current-work)
9. [Open Questions](#open-questions)

---

## Core Thesis

Current governance and risk tools are built for **recordkeeping**, not **decision making**. Organizations have control libraries, questionnaires, document storage, and static reports. But the critical decisions — security architecture reviews, AI governance approvals, vendor risk assessments, policy exceptions — are still made manually by committees. These processes are slow, inconsistent, poorly documented, and dependent on scarce expert labor.

Decision Intelligence is a governed system that captures **how decisions are made and why** — not just what was decided. Every decision produces a structured, auditable, replayable artifact that traces from evidence through reasoning to outcome.

**The moat is not AI. The moat is structured decision persistence** — the accumulated graph of how an organization makes risk-bearing decisions, with full provenance.

In Agentic Primitives terms, Decision Intelligence is a **Governed Decision Flow** — the composition of Ring 0 (execution) + Ring 1 (verification) + Ring 2 (governance) applied to risk-bearing decisions, with Ring 3 (learning) enabling cross-case intelligence over time.

---

## First Principles

These are the constants that will survive technology change:

### 1. Decisions are data structures, not documents

A decision is not a memo or a meeting outcome. It is a structured artifact (Primitive #5: Structured Output Persistence) containing: the case, the evidence considered, the claims made, the governed stance toward those claims, the policy rules applied, the options evaluated, the outcome selected, and the authorization. If any of these are missing, the decision is indefensible.

### 2. Claims, beliefs, and decisions are distinct objects

- **Claims** = assertions about facts ("This system processes PII")
- **Beliefs** = the governed stance toward those assertions ("We provisionally accept this based on the architecture document, pending validation")
- **Decisions** = authorized outcomes that follow from beliefs, policy tests, and governance approval

Collapsing these into one object destroys the ability to reason about uncertainty, revise positions, and explain outcomes. This separation is what makes the Belief Layer (below) possible — and it is the most conceptually novel aspect of the Decision Intelligence architecture.

### 3. Evidence changes; decisions must respond

When new evidence arrives, the system must be able to:
- Identify which claims are affected
- Re-evaluate beliefs
- Re-run policy tests (Primitive #9: Policy as Code)
- Re-evaluate decision options
- Trigger review if thresholds are crossed (Primitive #8: Governance Gates)

This is the **revision cascade** — the mechanism by which the system maintains a current governed state rather than a static snapshot. In ring terms, this is Ring 2 issuing REVISE(context) back to Ring 0 when the world changes during or after a decision.

### 4. Policy rules are explicit and versioned

Governance logic must not live in prompts, committee member heads, or unversioned documents. Rules are declared, versioned, and executed (Primitive #9: Policy as Code). Decisions reference the specific policy version applied. Past decisions can be replayed under new policies. ("If we adopt this new standard, how many of our existing approvals would fail?")

Policy versions are tracked through auditable control-plane state — the same versioning principle that governs all ring configuration in the Agentic Primitives framework.

### 5. Provenance is the product

The single most valuable output is not a score or a recommendation — it's the provenance chain (Primitive #6: Provenance Chains). The ability to show an auditor, regulator, or board exactly how a decision was reached, what evidence was considered, what was challenged, and who authorized the outcome. That chain IS the product.

Every node in the provenance chain carries full identity context (Primitive #14: Identity & Attribution) — which agent produced this claim, which model version was used, who authorized the decision, under what delegation authority.

---

## Mapping to Agentic Primitives

Decision Intelligence is a specific application of the Agentic Primitives framework. Here's how the 19 primitives map:

### Core primitives (actively used)

| Primitive | Role in Decision Intelligence |
|-----------|------------------------------|
| **#5 Structured Output** | Every decision artifact is typed, schema-validated, versioned. The Risk Decision Graph is a structured data model, not prose. |
| **#6 Provenance Chains** | The decision provenance chain: evidence → claims → beliefs → policy tests → decision options → final decision → approval. Unbroken, immutable, auditable. |
| **#7 Bounded Agency** | Each decision agent (Intake, Evidence, Claim, Challenger, Belief Manager, Policy, Recommendation, Memo) has declared scope. Agents recommend; humans decide. |
| **#8 Governance Gates** | Mandatory gates at material decision points — final approval, policy exceptions, high-risk determinations. Adaptive gates for routine quality checks. |
| **#9 Policy as Code** | Governance rules as versioned, executable objects. Policy tests evaluated programmatically. Decision replay under prior or proposed policies. |
| **#14 Identity & Attribution** | Every decision artifact carries: which agent, which model, which configuration, which human authorizer, under what delegation authority. |
| **#15 Adversarial Robustness** | Decision inputs are potentially adversarial (manipulated documents, poisoned evidence). Evidence verification is a security concern, not just a quality concern. |
| **#16 Transaction Control** | Decisions that trigger downstream actions (approvals, exceptions, escalations) are side effects requiring pre-commit/commit/post-commit lifecycle management. Stale approvals expire. |

### Verification primitives (Ring 1)

| Primitive | Role in Decision Intelligence |
|-----------|------------------------------|
| **#1 Separation of Producer/Verifier** | The agent that extracts claims is not the agent that verifies them. The agent that recommends a decision is not the agent that challenges it. |
| **#2 Validation Loops** | Claim extraction, evidence grounding, and policy evaluation all run through convergence-gated validation loops before being accepted into the decision graph. |
| **#4 Adversarial Critique** | The Challenger Agent — dedicated role with structural mandate to find contradictions, missing evidence, weak assumptions. Challenge results are first-class artifacts in the provenance chain. |

### Learning primitives (Ring 3)

| Primitive | Role in Decision Intelligence |
|-----------|------------------------------|
| **#3 Self-Improving Cycles** | Cross-case pattern detection: which claim types are most frequently revised, which policy rules produce false positives, which evidence sources are unreliable. |
| **#10 Event-Driven Observability** | Every decision action emits structured events. The event stream feeds quality monitoring, decision analytics, and the Agentic Observability layer. |
| **#11 Trust Ladders** | Agents that demonstrate reliable extraction, policy evaluation, and recommendation earn reduced verification. New case types start at low trust. |
| **#12 Memory-Augmented Reasoning** | Prior decisions, established baselines, and organizational context inform new decisions. The system accumulates institutional knowledge about risk-bearing decisions. |
| **#13 Error Handling** | Partial decision processing recovers from checkpoints. External evidence source failures degrade gracefully. Pipeline failures don't lose completed analysis. |

### Data governance and environment primitives

| Primitive | Role in Decision Intelligence |
|-----------|------------------------------|
| **#17 Data Governance & Confidentiality** | Decision evidence may contain PII, confidential data, or regulated information. Data classification at ingestion, consent tracking through the provenance chain, cross-boundary controls when decisions reference external data. Memory privacy for accumulated institutional knowledge. |
| **#18 Evaluation & Assurance** | Pre-deployment validation of decision agent configurations. Regression testing when claim extraction models are updated, policy rules are changed, or new case types are onboarded. The gate before the gate — validates that decision pipeline changes don't degrade known-good behaviors. |
| **#19 Agent Environment Governance** | Decision agents operate within governed environments: scoped workspace per case type, versioned instruction architecture per agent role, trust-gated capability provisioning (high-stakes case types get more constrained environments). Environment optimization loop improves agent performance within governance boundaries. |

---

## Key Patterns

### The Risk Decision Graph (RDG)

The core data structure. A case-bound reasoning substrate — not a generic knowledge graph.

Every decision case produces a graph containing:
- **Agents:** the actors who produced, verified, challenged, and authorized each artifact (human and AI)
- **Entities:** systems, datasets, vendors, controls, policies, owners
- **Claims:** assertions produced during reasoning — with typed relationships (SUPPORTS, CONTRADICTS, QUALIFIES) rather than separate claim/counterclaim types
- **Evidence:** supporting or contradicting information with source, timestamp, freshness, integrity status
- **Beliefs:** the governed stance toward claims (see Belief Layer below)
- **Policy Tests:** explicit evaluation of governance rules against case data
- **Scenarios:** alternative configurations or outcomes with quantified risk (includes simulations)
- **Decision Options:** system-generated proposals (approve, approve with conditions, reject, defer, escalate)
- **Final Decision:** authorized outcome with conditions and expiration
- **Approval:** human governance action with justification

**Key design rules:**
1. The graph is **case-bound first**. Cross-case intelligence comes later through templates, baselines, and prior-case references — not one giant enterprise graph. Design the schema for cross-case interoperability from day one (global entity IDs, canonical schemas) even if cross-case queries come in a later phase.
2. Every node includes: creator agent reference, timestamp, method reference, confidence, and source references.
3. Agents return **structured objects** (#5), not prose. LLM output is converted into graph objects.

**Canonical node types (9):** Case, Agent, Entity, Claim, Evidence, Belief, PolicyTest, Scenario, Decision. Extended types for governance workflow: Approval, ReviewTrigger, Condition.

**Standards alignment:** The RDG aligns with W3C PROV-O (Entity, Activity, Agent) for provenance and with DeCPROV for decision-specific provenance. Agent is a first-class node type — not metadata — enabling behavioral queries across the graph (e.g., which agent produced the most contested claims, which reviewer overrides the Challenger most frequently).

**Design note (from external review):** The original design specified 15+ node types including separate Claim/Counterclaim, Score, and Simulation types. Three independent reviews converged on reducing to ~9 core types: merge Claim/Counterclaim into Claim with typed edges (SUPPORTS/CONTRADICTS); merge Score into Belief (a score is a quantified belief); merge Simulation into Scenario; add Agent as a first-class citizen. Standards adoption (DMN: 5 types, PROV-O: 3 core types, influence diagrams: 3 types) consistently shows that parsimony drives adoption.

### The Belief Layer

The most conceptually novel element. This is what separates a decision intelligence platform from a static case database.

**Belief states:**
`unknown` → `under_review` → `plausible` → `provisionally_accepted` → `accepted`
Also: `contested`, `insufficient_evidence`, `rejected`, `stale`, `superseded`, `suspended`

**Key transitions:**
- `accepted` → `under_review` (triggered by new contradicting evidence or Challenger finding)
- `accepted` → `stale` (evidence freshness expired)
- `accepted` → `superseded` (replaced by newer claim with stronger evidence)
- Any state → `suspended` (circuit breaker: intractable dispute, legally toxic claim, infinite loop detected — requires human adjudication to resume)
- `provisionally_accepted` → `expired` (time-bound acceptance window closed)

**The `suspended` state** is an epistemic circuit breaker — a hard halt when the system cannot converge by iteration. Distinct from `under_review` (which implies active processing), `suspended` enforces a governance gate: the claim is frozen and requires explicit human adjudication before any state change.

**The revision cascade — the operating system behavior:**
```
New evidence arrives
  → Linked claims updated
    → Beliefs re-evaluated
      → Affected policy tests re-run
        → Decision options re-evaluated
          → Review trigger fired if thresholds crossed
```

When evidence changes, beliefs revise, which cascades through policy evaluation to decision options. In ring terms: Ring 2 detects the context change and issues REVISE(context) back to Ring 0, triggering re-execution of the affected decision pipeline with updated evidence.

**Cascade protection (from external review):**
- **Cycle detection:** Circular dependencies (Belief A → Claim X → Belief B → Claim Y → Belief A) are detected and broken. The cascade enforces DAG traversal; cycles trigger `suspended` state on the cycle entry point.
- **Depth limit:** Maximum cascade depth (recommended: 5). Beyond the limit, the cascade halts and surfaces the constraint for human review.
- **Hysteresis bands:** Promotion and demotion thresholds differ to prevent oscillation. A belief that was just demoted requires a higher evidence bar to be re-promoted than a belief being promoted for the first time.
- **Cascade budget:** Maximum number of belief state changes per evidence event (recommended: 50). Budget exhaustion triggers review.

**Prior art and intellectual lineage:**

The Belief Layer draws on established traditions:
- **Argumentation frameworks** — IBIS (Kunz & Rittel), Toulmin model, Dung's abstract argumentation (1995), Carneades (Gordon, Prakken, Walton, 2007) with dialectical statuses and proof standards, ASPIC+ for structured argumentation
- **Belief revision theory** — AGM framework (Alchourrón, Gärdenfors, Makinson) for rational belief update under new information
- **Truth Maintenance Systems** — Doyle (1979), de Kleer (1986) for dependency-directed revision cascades
- **Assurance cases** — GSN, CAE, OMG SACM for structured claims-arguments-evidence to justify system properties
- **W3C PROV-O** — Entity/Activity/Agent provenance model; DeCPROV for decision-specific provenance

**What is novel:** None of the above treat belief as an **organizational governance act** rather than a logical derivation. In every prior system, belief status is computed from argument acceptability or logical entailment. The Belief Layer makes belief a deliberate institutional stance — a human governance decision mediated by evidence but not determined by it. The reframing from "what the logic says" to "what the organization is willing to stand behind" is the genuine contribution. The revision cascade applies TMS-style dependency propagation to this governed epistemic state, and the temporal states (`stale`, `superseded`, `suspended`) address governance needs absent from classical systems.

**Design trade-off:** Discrete states vs. probabilistic confidence (Bayesian networks, Dempster-Shafer). Discrete states are auditable, interpretable, and governance-friendly — a committee can discuss whether a belief should move from "plausible" to "provisionally accepted" in ways they cannot discuss a posterior probability shift. The cost is lost nuance. A hybrid approach — discrete governance states with optional underlying confidence scores — would capture benefits of both paradigms.

### Adversarial Self-Critique (The Challenger)

Implementation of Primitive #4 (Adversarial Critique) applied to decision-making.

**The Challenger Agent produces:**
- Contradicting claims (claims with CONTRADICTS relationships to existing claims)
- Gaps (missing evidence or analysis)
- Contradiction flags (claims that conflict with each other or with evidence)
- Challenge summaries

**Design rule:** Agents should not directly "decide." They should gather, structure, challenge, model, and recommend. Final authority remains within governance controls (Primitive #8: Governance Gates, mandatory class).

**Zero trust application:** The Challenger Agent operates under the same zero trust posture as all agents. Its identity is verified independently. Its challenges are recorded in the provenance chain. The Challenger cannot be silently bypassed — its invocation (or non-invocation) is an auditable event.

### Multi-Agent Governance

The decision pipeline is an **orchestrated multi-agent system** (see Agentic Primitives: Multi-Agent Coordination, orchestrated composition pattern).

| Agent | Ring | Role |
|-------|------|------|
| Intake & Extraction Agent | R0 | Normalizes intake materials, extracts entities (systems, datasets, vendors, controls) into a structured case package |
| Evidence Agent | R0 | Collects, links, and summarizes evidence with metadata. Integrity verification (source authentication, tampering detection, freshness) |
| Claim Agent | R0 | Transforms evidence into structured claims with typed relationships (SUPPORTS, CONTRADICTS, QUALIFIES) |
| Challenger Agent | R1 | Searches for contradictions, weak assumptions, missing evidence. Structural mandate: find flaws, never confirm |
| Belief Manager | R1 | Maintains governed belief state. **Deterministic state machine**, not an LLM agent — applies formal transition rules, threshold checks, and provenance capture. Receives claim proposals from R0, subjects them to Challenger validation before committing state changes |
| Policy Agent | R2 | Evaluates beliefs against formal governance rules |
| Recommendation Agent | R0 | Synthesizes all outputs into decision options |
| Memo Agent | R0 (lightweight) | Generates exportable, reviewer-ready decision memos. Formatting tool, not a reasoning agent |

**Design notes (from external review):**
- **Intake + Entity Extraction merged:** These execute highly overlapping NLP tasks. Separating them introduces unnecessary latency and forces context reconstruction. A single agent produces both the normalized case package and extracted entities in one pass.
- **Belief Manager moved to Ring 1:** Three independent reviews identified the original Ring 0/Ring 1 boundary position as a security vulnerability — a component bridging two trust zones is the most attacked element in any security architecture. The Belief Manager now sits firmly in Ring 1, receiving immutable claim proposals from Ring 0 and subjecting them to adversarial challenge before committing state changes. It operates as a **deterministic state machine** (formal transition rules, not LLM reasoning) to ensure predictable, auditable state transitions.
- **Memo Agent downgraded:** From full reasoning agent to lightweight formatting tool. It renders the provenance chain for human consumption but does not perform reasoning.
- **Pipeline is a directed graph, not a linear pipeline.** The Challenger creates feedback loops, the Policy Agent applies constraints throughout, and Evidence and Claim agents can run in parallel. Design and implement as a cyclic graph with explicit cycle handling.

**Guardrails (from Primitives #7 and #14):** Every agent write includes agent_id, version, timestamp, method reference, confidence, source references, and change justification. Each agent has declared scope (Bounded Agency). Identity context travels with every action (Identity & Attribution).

The orchestrator itself has its own ring stack — it is a governed pipeline managing governed sub-pipelines. Rings are fractal.

### Decision Memo as First-Class Output

Each case exports as a human-readable memo: case summary, reviewed scope, material entities, material claims, supporting and opposing evidence, belief states, methodology used, quantitative analysis summary, policy test results, decision options considered, final decision, conditions and actions, approvers, next review date.

This becomes a high-value enterprise artifact — and the primary deliverable that justifies the product's existence. The memo is derived from the provenance chain (#6) — it IS the chain, rendered for human consumption.

---

## Architecture Through the Rings

### Ring 0 — Core Execution

The decision agents (Intake, Entity Extraction, Evidence, Claim, Recommendation, Memo) produce the core decision artifacts. Every output is a structured node in the Risk Decision Graph.

**Deployment mode:** Wrapper mode for batch assessments (document in, decision out). Middleware mode for interactive review workflows (human reviews case, triggers additional analysis, iterates).

### Ring 1 — Verification

The Challenger Agent lives here. Validation loops verify claim extraction against source documents (grounding checks), cross-model verification challenges key determinations, and deterministic validators check completeness and consistency.

**Key behaviors:**
- Claim grounding: is this claim supported by the source evidence?
- Cross-model challenge: does an independent model produce the same extraction?
- Completeness: are all required elements present?
- Consistency: do claims contradict each other?
- Convergence gate: early exit when quality threshold met, escalation when iteration limit reached

### Ring 2 — Governance

Policy evaluation, governance gates, provenance recording, and transaction control.

**Policy evaluation:** Every belief, policy test, and decision option is evaluated against versioned policy rules. The specific policy version is recorded in the provenance chain.

**Governance gates:**
- **Mandatory:** Final decision approval, policy exception authorization, high-risk case escalation. These never relax regardless of trust level.
- **Adaptive:** Quality review of claim extraction, spot-check of evidence grounding, optional human review of intermediate analysis. These relax as the system demonstrates reliability via Trust Ladders.

**Transaction control:** When a decision triggers downstream actions (granting an approval, creating an exception, sending a notification), those are side effects with pre-commit/commit/post-commit lifecycle. Stale approvals expire if context changes materially before execution.

**REVISE(context):** When Ring 2 detects that evidence has changed, policy has been updated, or a prior decision has been superseded, it issues REVISE(context) back to Ring 0 — triggering the belief revision cascade with updated context.

### Ring 3 — Learning

Cross-case intelligence, trust calibration, and system improvement.

**Cross-case patterns:**
- Which claim types are most frequently revised by human reviewers? → Prompt improvement opportunities
- Which policy rules produce the most false-positive gates? → Threshold recalibration
- Which evidence sources are consistently unreliable? → Source trust adjustment
- Which case types converge fastest? → Trust ladder advancement candidates

**Memory-augmented reasoning:** Prior decisions, established baselines, and organizational context inform new decisions. "Last time we reviewed a similar AI use case, we required these specific controls." The system accumulates institutional knowledge.

**Trust ladders:** Decision agents earn reduced verification through demonstrated reliability. New case types, new document formats, and new regulatory frameworks start at low trust with full verification.

---

## Zero Trust for Decision Systems

Decision Intelligence handles consequential, regulated outputs. Zero trust is not optional — it's the security posture for the entire system.

### Why decisions are high-value targets

- Decision outputs grant approvals, create exceptions, authorize actions
- Manipulated evidence could produce favorable decisions for adversarial actors
- Compromised decision agents could approve things that should be rejected
- Poisoned learning data could systematically bias future decisions

### Zero trust application

| Principle | Decision Intelligence Application |
|-----------|----------------------------------|
| **Never trust, always verify** | Ring 1 independently verifies Ring 0's claim extraction. The Challenger independently challenges conclusions. Ring 2 independently evaluates policy compliance. No ring trusts another's output. |
| **Least privilege** | Each decision agent has access only to the data and tools it needs. The Claim Agent can read evidence but cannot modify it. The Policy Agent can evaluate rules but cannot change them. |
| **Assume breach** | Evidence may be adversarial (manipulated documents). Claim extraction may be poisoned (prompt injection via document content). The system assumes inputs are potentially hostile and verifies accordingly. |
| **Verify explicitly** | Every decision artifact carries full identity context: which agent, which model, which config version, which human authorizer, under what delegation chain. |
| **Microsegmentation** | Decision cases are isolated — one case's data doesn't leak to another. Multi-tenant deployments enforce tenant-level policy isolation. Agent communication goes through the composability interface, not direct state sharing. |

### Evidence integrity

Evidence is the foundation of every decision. If evidence is compromised, the entire decision is compromised. Decision Intelligence must treat evidence verification as a **security concern**, not just a quality concern:

- Source authentication: is this document actually from the claimed source?
- Freshness verification: is this evidence current, or has it been superseded?
- Tampering detection: has this document been modified since it was submitted?
- Grounding verification: do extracted claims actually appear in the source document, or were they hallucinated?

These map to Primitive #15 (Adversarial Robustness) applied specifically to the evidence layer.

---

## What This Is NOT

- **Not a chatbot or assistant.** Decision Intelligence structures and governs consequential decisions. It is a governed pipeline, not a conversational interface. The output is a structured, auditable decision artifact — not a generated response.

- **Not a GRC platform.** Traditional GRC (OneTrust, Archer, ServiceNow GRC) manages controls, questionnaires, and compliance workflows. Decision Intelligence governs how specific risk-bearing decisions are made — it produces the decision artifacts that GRC platforms track.

- **Not a business intelligence tool.** BI tools aggregate data for human analysis. Decision Intelligence structures the reasoning process itself — evidence, claims, beliefs, policy evaluation, and authorization — into auditable artifacts. BI answers "what happened?" DI answers "why was this decided, and was the decision governed?"

- **Not a decision automation engine.** The Gartner Decision Intelligence Platform Leaders (FICO, SAS, Aera Technology) focus on automated decisioning — rules engines that make operational decisions at scale without human involvement. This system explicitly requires human judgment in the governance loop. It captures and governs the reasoning process; it does not automate the decision away.

- **Not a replacement for human judgment.** Agents recommend; humans decide. The system captures how decisions are made and ensures governance rigor. It does not remove human authority from consequential decisions — it makes human authority more effective by providing structured evidence, adversarial challenge, and explicit policy evaluation.

---

## Build Sequence (Directional)

Each phase implements additional primitives and ring capabilities:

### Phase 1 — Assessment Pipeline (Current)

**What's built:** Headless governance intelligence pipeline. Document in, structured assessment out. Verification layer in shadow mode.

**Primitives active:** Structured Output (#5), early Provenance (#6), early Policy as Code (#9), Separation of Producer/Verifier (#1), Validation Loops (#2), Error Handling (#13), Event-Driven Observability (#10)

**Ring coverage:** Ring 0 (built), Ring 1 (partially built — verification spec), Ring 2 (minimal — framework mapping)

### Phase 2 — Defensible Decision Core

**Build:** Case intake, entity/evidence/claim capture, belief layer, policy tests, decision recommendation, approvals, memo export.

**New primitives:** Full Governance Gates (#8), full Policy as Code (#9), Identity & Attribution (#14), Transaction Control (#16)

**Ring coverage:** Ring 0 + Ring 1 + Ring 2 (full Governed Decision Flow)

### Phase 3 — Challenger and Replay

**Build:** Counterclaims, belief revision history, review triggers, replay views, prior-case references.

**New primitives:** Full Adversarial Critique (#4), Adversarial Robustness (#15)

### Phase 4 — Quantified Decisioning

**Build:** FAIR factor models, Monte Carlo simulation, scenario comparison, threshold-based escalation.

### Phase 5 — Portfolio Intelligence

**Build:** Cross-case analytics, control effectiveness trends, recurring policy conflict detection, reusable parameter baselines.

**New primitives:** Full Self-Improving Cycles (#3), Memory-Augmented Reasoning (#12), Trust Ladders (#11)

**Ring coverage:** Ring 3 (learning system) fully operational

Each phase should be funded by the previous phase's revenue or a funding event.

---

## Threads to Current Work

| Current Work | Connection | Status |
|-------------|-----------|--------|
| AI Risk Tools assessment pipeline | Phase 1 — document in, structured assessment out. Ring 0 + partial Ring 1. | Built |
| Pipeline verification spec (v0.3) | Event envelope, artifact lineage, gate logic — engineering primitives for Ring 1 and observability fabric. | Specified |
| Agentic Primitives framework | Decision Intelligence is a Governed Decision Flow — the composition pattern for Ring 0 + Ring 1 + Ring 2 applied to risk-bearing decisions. | Defined (19 primitives, rings model, zero trust) |
| Agentic Observability concept | Decision Intelligence produces decisions and emits events. Observability monitors the decision agents, detects quality degradation and adversarial patterns, and provides the security monitoring layer. | Concept stage |

---

## Case Type Wedge Strategy

Build in this order:

1. **AI Use Case Governance** ← Phase 1 (current pipeline)
2. **Security Architecture Review** — best fit for repeatability and enterprise depth
3. **Policy Exception / Compensating Control Case** — best fit for governance workflows
4. **Third-Party Vendor Risk Decisions** — best fit for expansion

Do not start broader than this.

---

## Open Questions

- **Belief layer complexity vs. adoption:** Is the belief layer too conceptually novel for enterprise buyers to understand and trust? Or is it the thing that makes them buy? The revision cascade is the most powerful capability — but also the hardest to explain.
- **Case type breadth vs. depth:** How many case types before the platform is credible? One deep (AI governance) may beat four shallow.
- **Relationship to Agentic Observability:** Shared primitives, distinct products, eventual convergence. Decision Intelligence produces decisions and emits events. Observability consumes those events for monitoring, security detection, and learning. The Agentic Observability layer IS the security monitoring layer for Decision Intelligence.
- **Graph storage timing:** When does Postgres-first hit its limits and graph projection becomes necessary? Case-bound-first design defers this, but cross-case intelligence (Phase 5) may force it.
- **Revenue gate per phase:** Phase 1 has a revenue model. Phase 2+ needs either customer pull or funding. What's the trigger?
- **Zero trust overhead:** How much does evidence integrity verification (source authentication, tampering detection, grounding verification) add to per-assessment cost and latency? Is this a Trust Ladder candidate — full verification early, relaxed for trusted document sources?
- **Ring deployment mode for interactive review:** When a human reviewer is interacting with the decision system (reviewing evidence, challenging claims, modifying beliefs), is that wrapper mode or middleware mode? Likely middleware — the human's actions are interrupt points in the decision graph.

---

*This is an AGF capability layer document. For the framework overview, see [AGF: A Reference Architecture for Governed Agentic Systems](agf-reference-architecture.md). For the foundational primitives, see [Agentic Primitives](agentic-primitives.md). For event monitoring of decision systems, see [Agentic Observability](agentic-observability.md).*
