# AGF AI Engineering Profile: Implementing Governed Agentic Systems

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Parent:** [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md)
**Terminology:** [Shared Vocabulary](../docs/shared-vocabulary.md)

---

## Who This Is For

AI engineers, ML engineers, prompt engineers, agent developers, and anyone responsible for building agentic systems that need to be governed, auditable, and improvable.

**The key question this profile answers:** *Which primitives do I implement first, and how do they compose into governed systems?*

**Prerequisites:** Familiarity with the [Rings Model and core concepts](../docs/agf-reference-architecture.md#core-concepts) in the AGF meta document.

**Scope boundary:** This profile covers what to build and in what order. Deployment topology belongs to the [Platform Profile](platform-profile.md). Security architecture belongs to the [Security Profile](security-profile.md). Regulatory evidence belongs to the [GRC Profile](grc-profile.md). Runtime operations belong to the [Observability Profile](observability-profile.md).

---

## Contents

1. [The Engineering Challenge](#the-engineering-challenge)
2. [The 19 Primitives: Pattern Catalog](#the-19-primitives-pattern-catalog)
3. [Implementation Priority: Where to Start](#implementation-priority-where-to-start)
4. [Composition Patterns](#composition-patterns)
5. [Primitive Interaction Tensions](#primitive-interaction-tensions)
6. [Trust Ladders: How Agents Earn Autonomy](#trust-ladders-how-agents-earn-autonomy)
7. [The Environment Optimization Loop](#the-environment-optimization-loop)
8. [Prior Art: What to Read, What Tools to Use](#prior-art-what-to-read-what-tools-to-use)
9. [Implementation Checklist](#implementation-checklist)

---

## The Engineering Challenge

Building an agentic system that works in a demo is straightforward. Building one that is trustworthy, auditable, and improvable in production is a different problem entirely.

The engineering challenge has three dimensions:

1. **Governance must be composable.** You can't implement all 19 primitives at once. You need to know which ones to start with, which ones compose naturally, and which ones you can defer. The wrong implementation order creates wasted work or brittle half-governance.

2. **The architecture must adapt to your system type.** A batch document pipeline and a conversational agent have different governance needs. The primitives are the same; the composition and deployment mode are different.

3. **The system must improve without breaking governance.** Ring 3 (Learning) makes the system better over time. But self-improvement that weakens verification, expands scope, or bypasses gates is worse than no improvement at all. The optimization loop must be governed.

---

## The 19 Primitives: Pattern Catalog

AGF defines 19 named patterns for governed agentic systems. These are not new inventions — they are established patterns from distributed systems, security engineering, compliance, and control theory, named for the agentic context.

**Taxonomy:** #1–#17 are runtime primitives (operate within the ring pipeline during execution). #18 is a lifecycle primitive (the CI/CD gate for ring configurations). #19 is a substrate primitive (governs the operating environment beneath all rings).

### Runtime Primitives (#1–#17)

#### #1 — Separation of Producer and Verifier
**Ring:** 0 + 1 | **Category:** Structural guarantee

The agent that creates output must not be the sole agent that validates it. This is separation of duties applied to AI output.

- **Variations:** Self-audit (same model, different role — weakest), cross-model verification (stronger), multi-agent panel (strongest)
- **Key decision:** Verification strength should match output stakes. Self-audit is acceptable for low-stakes; high-stakes demands independent verification.
- **Distinction from #4:** This is structural (different actors for different roles). #4 is intentional (the challenger's mandate is to find flaws, not confirm quality).

#### #2 — Validation Loops with Convergence Gates
**Ring:** 1 | **Category:** Quality assurance

Multi-pass review cycles where output is iteratively improved until it meets a quality threshold — or escalates when iteration limits are reached.

- **Key decisions:** Convergence criteria (explicit, measurable, not vibes), iteration budget (hard cap — unbounded iteration is a cost trap), diminishing returns detection (plateau → exit early)
- **Economic constraint:** Each iteration costs time and tokens. Budget-aware iteration is non-negotiable.

#### #3 — Self-Improving Cycles
**Ring:** 3 | **Category:** Learning

The system learns from its own execution history to get better over time — without retraining.

- **What changes:** Prompts, configurations, rules, thresholds — runtime-tunable parameters only, never model weights
- **What feeds the loop:** Execution logs, human overrides, quality scores, KB updates
- **Honest limitation:** This is the least durable primitive. As foundation models improve, the gap that runtime adaptation fills may narrow. Three independent reviews ranked #3 as the least durable. Include it while the capability-performance gap persists — but acknowledge the trajectory.

#### #4 — Adversarial Critique
**Ring:** 1 | **Category:** Quality assurance

A dedicated challenger whose sole purpose is to find weaknesses. The framing matters: the challenger is asked "what's wrong with this?" — never "is this good?"

- **When to invoke:** Proportional to stakes and trust level. High-stakes + low-trust = full challenge. Low-stakes + high-trust = skip.
- **Independence:** The challenger should not share context/state that would bias it toward agreement.

#### #5 — Structured Output Persistence
**Ring:** Fabric | **Category:** Data contract

Every ring produces and consumes structured artifacts — not raw text. This is the data contract that makes rings composable.

- **What it means:** Schema-conformant outputs with metadata (provenance, identity context, timestamps, quality signals)
- **Why it matters:** Without structured output, rings can't compose. Ring 1 can't verify what it can't parse. Ring 2 can't evaluate policy against unstructured content.

#### #6 — Provenance Chains
**Ring:** Fabric | **Category:** Auditability

Every output carries its full decision history — which agent, which model, which inputs, which configuration, which decisions led to this result.

- **Implementation:** Append-only chain. Each ring adds its contribution. Tamper-evident.
- **Regulatory value:** Art. 11 (documentation), Art. 12 (record-keeping). This is how you answer "why did the system do that?"

#### #7 — Bounded Agency
**Ring:** 2 | **Category:** Safety

Agents operate within explicit, enforced boundaries — which tools they can use, which data they can access, which actions they can take, what scope they're authorized for.

- **Implementation:** Declared scope (tool allowlists, data access boundaries, output authority limits) + enforcement (Fabric verifies at every boundary)
- **Key invariant:** "The box can get smarter inside. It cannot grow itself." Boundary expansion requires human authorization.

#### #8 — Governance Gates
**Ring:** 2 | **Category:** Human oversight

Explicit decision points where execution pauses for authorization. The primary mechanism for human-in-the-loop governance.

- **Two gate classes:** Adaptive gates (trust-dependent, relax as trust grows) and mandatory gates (always active, regardless of trust — regulatory, legal, irreversible actions)
- **Human interface requirements:** Evidence presentation, counterfactual framing, rubber-stamping detection, fail-closed timeout, cognitive load management
- **Gate response signals:** APPROVE, REJECT, MODIFY, DEFER, ESCALATE

#### #9 — Policy as Code
**Ring:** 2 | **Category:** Governance

Governance rules as versioned, executable, testable objects — not implicit tribal knowledge.

- **Key distinction:** Policy (Ring 3 cannot change: authorization, mandatory gates, compliance constraints) vs. configuration (Ring 3 can change: quality thresholds, verification intensity, trust levels)
- **Implementation:** Policy rules live in version control. Policy changes go through the same review process as code changes. Policy test harnesses verify before deployment.

#### #10 — Event-Driven Observability
**Ring:** Fabric | **Category:** Monitoring

Every ring emits structured events — the shared nervous system of the governed system.

- **Event types:** Ring boundary events, gate decisions, trust changes, security signals, error events, performance metrics
- **Key property:** Events are the raw material for Security Intelligence, Ring 3 learning, audit trails, and operational monitoring. Without events, nothing else works.

#### #11 — Trust Ladders
**Ring:** 2 + 3 | **Category:** Risk management

Trust is earned through demonstrated performance, not granted by default. Agents start at low trust with full verification, and earn reduced oversight as they prove reliability.

- **Trust affects:** Adaptive gate frequency, verification intensity, autonomy scope
- **Trust never affects:** Mandatory gates, boundary enforcement, identity verification
- **Calibration:** Trust promotions/demotions are logged, justified, and auditable. Trust escalation anomalies trigger Security Intelligence alerts.
- **Aligns with:** CSA ATF earned autonomy maturity model (Intern → Junior → Senior → Principal)

#### #12 — Memory-Augmented Reasoning
**Ring:** 0 + 3 | **Category:** Knowledge management

Agents reason with persistent memory — not just immediate context. Cross-session knowledge, accumulated learnings, domain expertise.

- **Relationship to #3:** #3 is the learning engine (closed-loop improvement). #12 is the knowledge infrastructure (persistent memory that makes learnings available at execution time). One is the engine, the other is the fuel system.
- **Key concern:** Memory growth without curation is hoarding, not learning. Active memory management: relevance filtering, decay, routing rules, periodic curation.

#### #13 — Error Handling & Recovery
**Ring:** Fabric | **Category:** Resilience

Graceful degradation, checkpointing, compensation. When things go wrong — and they will — the system fails safely.

- **Recovery hierarchy:** Retry (transient errors), degrade (reduced capability), halt (safe stop with state preservation)
- **Checkpointing:** State capture at ring boundaries enables rollback without full re-execution
- **Compensation:** When committed side effects need to be reversed, governed compensation logic executes under the same ring architecture

#### #14 — Identity & Attribution
**Ring:** Fabric | **Category:** Accountability

Every agent has authenticated, inspectable identity. Every action carries identity context through every ring.

- **Identity dimensions:** Agent identity (ID, version, config hash), model identity (model, provider, fine-tune), delegation chain (who authorized this agent), execution identity (run ID, context), data identity (whose data, classification), human identity (who's in the loop)
- **Implementation protocols:** SPIFFE/SPIRE (cryptographic workload identity), OAuth 2.1 (user-delegated authority), OIDC (federated identity), NGAC (attribute-based access control)

#### #15 — Adversarial Robustness
**Ring:** Security | **Category:** Defense

Assume breach. Defense in depth. Verify explicitly. The security posture for governed agentic systems.

- **Scope:** This primitive defines the security posture. The three-level security model (Fabric → Governance → Intelligence) is the architecture. See the [Security Profile](security-profile.md) for full threat analysis.
- **Supply chain trust:** Approved sources, version pins, trust tiers — critical for MCP/A2A ecosystems where 53% of community servers use insecure static API keys.

#### #16 — Transaction & Side-Effect Control
**Ring:** 0 + 2 | **Category:** Safety

Pre-commit/commit/post-commit for irreversible actions. The transaction layer that makes agent actions manageable.

- **Key mechanisms:** Idempotency keys (prevent duplicate execution), stale-approval invalidation (approvals expire when context changes materially), compensation (governed reversal of committed effects), partial-execution state tracking
- **REVISE(context) semantics:** When Ring 2 says "world changed, re-execute" after side effects are committed — no blind re-execution. Idempotency keys carry across revisions.

#### #17 — Data Governance & Confidentiality
**Ring:** 2 + Fabric | **Category:** Privacy & compliance

Classification, consent, PII detection, lineage, retention at every data flow. Data governance for the agentic context.

- **Scope:** Data classification at ingestion, PII detection/handling, consent/purpose binding, data lineage, memory privacy, retention/deletion, cross-boundary controls
- **Aligns with:** CSA ATF Data Governance domain, EU AI Act Art. 10-12, GDPR Articles 5, 13-17, 25, ISO 42001

### Lifecycle Primitive (#18)

#### #18 — Evaluation & Assurance
**Scope:** Pre-deployment | **Category:** Quality gate

The gate before the gate — validates configurations, policies, and agent behavior before they reach production.

- **What it covers:** Pre-deployment evaluation suites, regression testing against known-good behaviors, adversarial red-teaming, policy test harnesses, simulation environments, configuration change approval tiers
- **Key role:** Ring 3 proposes improvements. #18 validates them before deployment. Without #18, self-improvement is uncontrolled.
- **Change tiers:** Low-risk (automated evaluation only), high-risk (human review of evaluation results), critical (evaluation + staged rollout with monitoring)

### Substrate Primitive (#19)

#### #19 — Agent Environment Governance
**Scope:** All rings | **Category:** Operating environment

Every agent operates within a 5-layer environment: identity/policy substrate (L1), instruction architecture (L2), capability set (L3), retrieved context (L4), session state (L5). Agent Environment Governance ensures this substrate is composed by policy, scoped by least privilege, and continuously improved.

- **Trust boundary:** L1-L2 (human-authored, version-controlled, trusted) vs. L3-L5 (dynamic, runtime-composed, treated as untrusted input)
- **The optimization loop:** Observe → Identify gaps → Propose improvements → Validate (Ring 2 + #18) → Deploy with rollback. The loop proposes; governance decides.
- **Key invariant:** "The environment can get better. It cannot get less governed."
- **Attack surface:** The agent's environment is simultaneously the primary optimization target and the primary attack surface. See the [Security Profile](security-profile.md#the-agent-environment-as-attack-surface) for threat analysis.

---

## Implementation Priority: Where to Start

Not every primitive is equally urgent. Implementation priority depends on your system's risk level and maturity.

### Phase 1: Minimum Viable Control (Start Here)

**Implement first, regardless of system type:**

| Primitive | Why First | Effort |
|-----------|----------|--------|
| **#7 Bounded Agency** | Without boundaries, everything else is moot. Define what the agent can and cannot do. | Low — scope declaration + enforcement |
| **#14 Identity & Attribution** | Without identity, you can't audit, can't attribute, can't trust. | Medium — identity infrastructure |
| **#6 Provenance Chains** | Without provenance, you can't answer "why did it do that?" | Low — append-only logging |
| **#10 Event-Driven Observability** | Without events, you're blind. | Low — structured event emission |
| **#19 Agent Environment Governance** (minimal) | Scoped workspace + versioned instructions. Not the full optimization loop yet. | Low — environment scoping |

**What this gives you:** Agents that can't exceed their scope, actions that are attributable, an audit trail, and visibility into what's happening.

### Phase 2: Verification (Ring 0 + Ring 1)

**Add when outputs matter:**

| Primitive | Why Now | Effort |
|-----------|--------|--------|
| **#1 Separation of Producer/Verifier** | Verified outputs before release. | Medium — verification agent + orchestration |
| **#2 Validation Loops** | Iterative improvement with convergence. | Medium — loop logic + budget management |
| **#5 Structured Output Persistence** | The data contract that makes rings composable. | Low — schema definition + serialization |
| **#13 Error Handling & Recovery** | Graceful failure when things go wrong. | Medium — checkpointing + recovery logic |

**What this gives you:** Verified outputs. Quality assurance is structural, not manual.

### Phase 3: Governance (Ring 0 + Ring 1 + Ring 2)

**Add when decisions are consequential:**

| Primitive | Why Now | Effort |
|-----------|--------|--------|
| **#8 Governance Gates** | Human oversight on material decisions. | Medium — gate UX + pause/resume |
| **#9 Policy as Code** | Governance rules as versioned, testable artifacts. | Medium — policy engine + test harness |
| **#16 Transaction & Side-Effect Control** | Safe handling of irreversible actions. | High — transaction layer + compensation |
| **#17 Data Governance** | PII, consent, classification at every data flow. | High — classification pipeline + enforcement |

**What this gives you:** Policy-evaluated, human-gateable decisions with side-effect management and data protection.

### Phase 4: Security & Assurance

**Add when the system is production-bound:**

| Primitive | Why Now | Effort |
|-----------|--------|--------|
| **#15 Adversarial Robustness** | Defense in depth. Assume breach. | High — security architecture |
| **#18 Evaluation & Assurance** | The deployment gate. Validates before production. | Medium — evaluation suites + CI/CD integration |
| **#11 Trust Ladders** | Calibrated trust. System earns reduced oversight. | Medium — trust model + calibration logic |

### Phase 5: Learning (Full System)

**Add when the system should improve over time:**

| Primitive | Why Now | Effort |
|-----------|--------|--------|
| **#3 Self-Improving Cycles** | The learning engine. | High — analysis pipeline + change management |
| **#4 Adversarial Critique** | Dedicated challenger for high-stakes outputs. | Medium — challenger agent + mandate |
| **#12 Memory-Augmented Reasoning** | Persistent knowledge across sessions. | Medium — memory infrastructure + curation |
| **#19 Agent Environment Governance** (full) | The optimization loop for the operating environment. | High — full observe/propose/validate/deploy cycle |

**Key principle:** Each phase is independently valuable. You don't need Phase 5 to get value from Phase 1. Start where the risk is and grow governance as stakes increase.

---

## Composition Patterns

The primitives compose into progressively more governed architectures:

### Minimum Viable Control
Bounded Agency (#7) + Identity (#14) + Provenance (#6) + Observability (#10) + Environment Governance (#19, minimal)

**What it gives you:** Agents that can't exceed their scope, actions that are attributable, an audit trail, and scoped operating environments. The absolute floor for any consequential agent system.

### Validation Pipeline (Ring 0 + Ring 1)
Minimum Viable Control + Separation (#1) + Validation Loops (#2) + Structured Output (#5) + Error Handling (#13)

**What it gives you:** Verified outputs before release. Quality assurance is structural.

### Governed Decision Flow (Ring 0 + Ring 1 + Ring 2)
Validation Pipeline + Governance Gates (#8) + Policy as Code (#9) + Transaction Control (#16) + Data Governance (#17)

**What it gives you:** Policy-evaluated, human-gateable decisions with side-effect management.

### Secure Governed System (All rings + zero trust)
Governed Decision Flow + Adversarial Robustness (#15) + zero trust at every boundary + Evaluation & Assurance (#18) as the deployment gate

**What it gives you:** Defense in depth, pre-deployment validation, and security monitoring for production-grade agentic systems.

### Full Governed Agentic System (Everything)
All rings active, all primitives engaged, zero trust at every boundary, environment optimization loop improving the substrate continuously.

**What it gives you:** The complete governance architecture for high-stakes, regulated, enterprise-grade agentic systems that improve over time.

### Application Examples

| System Type | Primary Composition | Deployment Mode |
|-------------|-------------------|----------------|
| Risk decision platform | Governed Decision Flow | Wrapper |
| Coding agent (Claude Code, Cursor) | Validation Pipeline + selective Ring 2 gates | Middleware/Interrupt |
| Conversational agent (ChatGPT-style) | Minimum Viable Control + graph-embedded verification | Graph-Embedded |
| Document processing pipeline | Validation Pipeline → Governed Decision Flow (as stakes increase) | Wrapper |
| Personal productivity agent | Ring 0 + Ring 3 (execution + learning, no formal governance) | Middleware |
| Agent monitoring platform | Event fabric + Ring 3 intelligence | Wrapper (for the monitoring pipeline itself) |

---

## Primitive Interaction Tensions

The primitives are not always harmonious. Seven named tensions with architectural resolutions:

### Tension 1: Self-Improvement vs. Reproducibility
**Conflict:** #3 changes behavior over time. #6 requires traceability.
**Resolution:** Version everything. Self-improvement creates a new configuration version. Provenance chains reference the active version. Reproducible *at a specific version*, not across versions.
**Invariant:** *The system is always reproducible at a specific version.*

### Tension 2: Trust Ladders vs. Governance Gates
**Conflict:** #11 reduces oversight. #8 ensures accountability.
**Resolution:** Two gate classes. Adaptive gates (trust-dependent — relax as trust grows). Mandatory gates (always active — regulatory, legal, irreversible). Trust only affects adaptive gates.
**Invariant:** *The system can earn the right to skip a spot-check, never the right to skip regulatory approval.*

### Tension 3: Bounded Agency vs. Self-Improvement
**Conflict:** #7 constrains scope. #3 makes the agent better. Can it expand its own boundaries?
**Resolution:** Self-improvement operates within declared bounds. Ring 3 changes what happens *inside* the box. Boundary expansion requires human authorization (Ring 2).
**Invariant:** *The box can get smarter inside. It cannot grow itself.*

### Tension 4: Validation Loops vs. Latency/Cost
**Conflict:** #2 and #4 improve quality through iteration, but each pass costs time and money.
**Resolution:** Budget-aware iteration. Iteration budget (hard cap), cost budget, latency budget, diminishing returns threshold. Proportional critique based on stakes and trust level.
**Invariant:** *Quality is bounded by economics, not just by capability.*

### Tension 5: Memory vs. Signal-to-Noise
**Conflict:** #12 accumulates knowledge. But stale/irrelevant memories inject noise.
**Resolution:** Active memory management — relevance filtering, decay, routing rules, periodic curation. Memory is curated, not accumulated.
**Invariant:** *Growth without curation is hoarding, not learning.*

### Tension 6: Policy as Code vs. Self-Improvement
**Conflict:** Can Ring 3 change Ring 2's policy rules?
**Resolution:** Distinguish configuration (Ring 3 can change: thresholds, intensity, trust levels) from policy (Ring 3 cannot change: authorization, mandatory gates, compliance). Ring 3 can *recommend* policy changes; the recommendation goes through Ring 2 governance for human authorization.
**Invariant:** *The system can suggest governance changes. It cannot enact them autonomously.*

### Tension 7: Environment Optimization vs. Governance Integrity
**Conflict:** #19's optimization loop improves the agent's environment, but the environment IS the control surface.
**Resolution:** Separate the optimizable (context priorities, tool descriptions, session policy) from the inviolable (governance policy, authorization boundaries, security constraints). The loop optimizes within governance boundaries; it cannot move them.
**Invariant:** *The environment can get better. It cannot get less governed.*

---

## Trust Ladders: How Agents Earn Autonomy

Trust Ladders (#11) are the primary cost optimization mechanism and the calibrated alternative to binary trust (fully trusted / fully untrusted).

### How Trust Works

1. **All agents start at low trust.** Full verification, all adaptive gates active, maximum oversight.
2. **Performance builds trust.** Consistent, high-quality outputs that pass Ring 1 verification → trust score increases.
3. **Trust reduces overhead.** Higher trust → less frequent adaptive gates, lighter Ring 1 verification, broader autonomy within scope.
4. **Trust never bypasses mandatory controls.** Mandatory gates, boundary enforcement, identity verification are trust-independent.
5. **Anomalies degrade trust.** Quality regression, behavioral anomaly, security signal → trust drops. Severity determines drop magnitude.

### Trust Calibration Signals

| Signal | Effect on Trust |
|--------|----------------|
| Consistent Ring 1 pass rate | Gradual increase |
| Human gate approval rate (high) | Gradual increase |
| Quality score improvement over time | Gradual increase |
| Ring 1 failure / quality regression | Decrease (proportional to severity) |
| Security Intelligence alert | Significant decrease |
| Behavioral anomaly (deviation from baseline) | Significant decrease |
| Configuration change (new model, new tools) | Trust resets to lower level until re-evaluated |

### The Economic Argument

Without Trust Ladders, governance cost is constant — every output gets the same verification regardless of track record. With Trust Ladders, the system starts expensive and gets cheaper. This is the right economic trajectory: high governance overhead when trust is unproven, reduced overhead as trust is earned.

**Empirical reference:** Human reviewers sustain ~5-15 complex gate decisions per hour before quality degrades. Trust Ladders reduce the volume of gates that reach human reviewers, focusing human attention on the decisions that genuinely need it.

---

## The Environment Optimization Loop

Agent Environment Governance (#19) includes a governed self-improving cycle for the agent's operating substrate.

### The 5-Layer Environment Stack

| Layer | Content | Lifecycle | Trust Level |
|-------|---------|-----------|-------------|
| **L5: Session State** (20-30%) | Conversation history, tool results, working memory | Ephemeral, session-scoped | Untrusted (runtime-composed) |
| **L4: Retrieved Context** (30-40%) | Task-specific knowledge, documents, search results | Dynamic, loaded JIT per task | Untrusted (runtime-composed) |
| **L3: Capability Set** (10-15%) | Active tools, skills, MCP servers, API access | Provisioned per role, trust-gated | Untrusted (runtime-composed) |
| **L2: Instruction Architecture** (10-20%) | System prompts, rules, personas, constraints | Versioned, tested, slow-changing | Trusted (human-authored) |
| **L1: Identity & Policy Substrate** (5-10%) | Agent identity, ring assignment, governance policy, trust level | Foundational | Trusted (human-authored) |

**Trust boundary:** Between L2 and L3. Below the boundary is human-authored and version-controlled. Above is dynamic and treated as untrusted input by the Security Fabric.

### The Loop

1. **Observe** — Measure effectiveness: context hit rate, tool selection accuracy, token efficiency, instruction adherence, task completion quality
2. **Identify** — Find gaps: missing context that caused errors, unused tools wasting budget, stale instructions, workspace boundaries too narrow or too broad
3. **Propose** — Generate improvements: updated instructions, revised tool sets, adjusted context priorities, modified workspace boundaries
4. **Validate** — Ring 2 evaluates policy compliance. #18 regression-tests. Security review for attack surface expansion.
5. **Deploy** — Staged rollout with monitoring and rollback capability

**Termination condition:** If N consecutive proposals are rejected (recommended: 3), the loop pauses and surfaces the constraint conflict for human review.

---

## Prior Art: What to Read, What Tools to Use

### Standards and Frameworks (Read These)

| Resource | Why It Matters | AGF Connection |
|----------|---------------|---------------|
| **NIST AI RMF 1.0** | The four organizing functions for AI risk management | AGF primitives are agentic specializations of GOVERN, MAP, MEASURE, MANAGE |
| **OWASP Top 10 for Agentic Applications** | The definitive agentic threat taxonomy | Mapped threat-by-threat to AGF security architecture |
| **OWASP MCP Top 10** | MCP-specific security threats | Mapped to AGF primitives and deployment modes |
| **CSA Agentic Trust Framework** | Earned autonomy maturity model | Trust Ladders (#11) aligns with ATF's promotion model |
| **CSA MAESTRO** | 7-layer threat model for agentic systems | Layer-by-layer mapping to AGF primitives |
| **Singapore IMDA MGF for Agentic AI** | First government agentic governance framework | Four dimensions validate AGF's scope, including operational environments |
| **NIST NCCoE Agent Identity** (concept paper, Feb 2026) | Candidate agent-specific identity protocols | SPIFFE/SPIRE, OAuth 2.1, OIDC, NGAC under consideration for Identity #14 |

### Academic Research (Key Papers)

| Paper | Contribution | AGF Connection |
|-------|-------------|---------------|
| Engels et al., "Scaling Laws For Scalable Oversight" (NeurIPS 2025) | Oversight efficacy degrades as capability gap widens | The declared architectural constraint — why structural guarantees matter |
| SAGA (NDSS 2026) | Cryptographic per-interaction access control | Security Fabric identity model |
| AgentSpec (ICSE 2026) | Deterministic runtime policy enforcement (90%+ prevention) | Security Governance policy enforcement |
| AgentGuard (ASE 2025) | MDP-based probabilistic behavioral verification | Security Intelligence behavioral analysis |
| DeepMind delegation framework | Structured delegation with oversight calibration | Trust Ladders and DELEGATE signal |
| Anthropic agent autonomy research | Empirical data on agents in practice | Trust calibration, context engineering patterns |
| Mind the GAP (Feb 2026) | Text-level safety doesn't transfer to tool-call behavior | Gap in semantic goal-state attestation |

### Implementation Ecosystem

| Tool/Framework | Relevant Primitives |
|---------------|-------------------|
| **OpenTelemetry GenAI Conventions** | Event-Driven Observability (#10) — the event emission standard |
| **SPIFFE/SPIRE** | Identity & Attribution (#14) — cryptographic workload identity |
| **OPA / Cedar / Rego** | Policy as Code (#9) — policy engines |
| **Model Context Protocol (MCP)** | Middleware/Interrupt deployment mode — natural interrupt points for ring logic |
| **A2A Protocol** | Multi-agent coordination — governed delegation |

---

## Implementation Checklist

### Phase 1: Minimum Viable Control
- [ ] Agent scope defined (tool allowlists, data access boundaries, output authority limits)
- [ ] Agent identity established (ID, version, configuration hash)
- [ ] Provenance logging active (append-only, structured, includes identity context)
- [ ] Structured events emitted at action boundaries
- [ ] Workspace scoped and instructions versioned

### Phase 2: Verification
- [ ] Separate verification agent operational (not self-audit for high-stakes outputs)
- [ ] Validation loops with convergence criteria and iteration budget
- [ ] Structured output schema defined and enforced
- [ ] Error handling: checkpointing at ring boundaries, graceful degradation configured

### Phase 3: Governance
- [ ] Governance gates operational (adaptive + mandatory classes defined)
- [ ] Policy rules versioned and testable
- [ ] Transaction control for irreversible actions (idempotency, compensation)
- [ ] Data classification pipeline active (PII detection, consent tracking)

### Phase 4: Security & Assurance
- [ ] Security posture: defense in depth, supply chain trust policy, containment mechanisms
- [ ] Evaluation suites: pre-deployment testing, regression testing, adversarial testing
- [ ] Trust Ladders: initial trust levels set, promotion/demotion criteria defined, calibration logging active

### Phase 5: Learning
- [ ] Ring 3 learning pipeline: execution analysis → improvement proposals → Ring 2 validation → #18 testing → staged deployment
- [ ] Memory infrastructure: persistent storage, relevance filtering, decay, curation cycles
- [ ] Full environment optimization loop: observe → identify → propose → validate → deploy, with termination condition
- [ ] Adversarial Critique: challenger agent operational for high-stakes outputs

---

*This is the AGF AI Engineering Profile — one of five domain profiles in the AGF reference architecture. For the complete framework, see [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md). For full primitive detail including all subsections and edge cases, see the [AGF Primitives catalog](../docs/agentic-primitives.md).*
