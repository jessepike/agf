# AGF Platform Profile: Building and Deploying Governed Agent Infrastructure

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Parent:** [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md)

---

## Who This Is For

Platform engineers, infrastructure architects, DevOps/MLOps teams, and anyone responsible for building, deploying, and scaling the infrastructure that autonomous AI agents run on.

**The key question this profile answers:** *How do I build and deploy governed agent infrastructure?*

**Scope boundary:** This profile covers build-time and deployment-time infrastructure. Runtime operations (monitoring, incident response, observability) belong to the Observability Profile (forthcoming). The split mirrors Platform Engineering vs. SRE.

**Prerequisites:** Familiarity with the [Rings Model and core concepts](../docs/agf-reference-architecture.md#core-concepts) in the AGF meta document.

---

## Contents

1. [The Platform Challenge](#the-platform-challenge)
2. [Ring Deployment Modes](#ring-deployment-modes)
3. [Mode Selection Matrix](#mode-selection-matrix)
4. [The Agent Environment Stack](#the-agent-environment-stack)
5. [The Composability Interface](#the-composability-interface)
6. [MCP Integration Patterns](#mcp-integration-patterns)
7. [Multi-Agent Coordination](#multi-agent-coordination)
8. [Cost of Governance](#cost-of-governance)
9. [Platform Primitives Reference](#platform-primitives-reference)
10. [Infrastructure Checklist](#infrastructure-checklist)

---

## The Platform Challenge

Building infrastructure for governed agentic systems is fundamentally different from building infrastructure for traditional applications. Traditional infrastructure serves deterministic software — the application does what it's told, every time. Agentic infrastructure serves non-deterministic, autonomous systems that select tools, modify their own behavior, and take actions their developers never explicitly programmed.

The platform challenge has three dimensions:

1. **Governance must be structural, not bolted on.** You can't add governance to an agentic system after the fact — it must be built into the infrastructure from the start. The rings, the verification layers, the gates, the containment mechanisms — these are infrastructure, not application features.

2. **The topology must match the system type.** A document processing pipeline and a conversational agent have completely different latency requirements, governance patterns, and failure modes. The infrastructure must adapt — the same logical governance deployed in different physical topologies.

3. **The agent's operating environment is infrastructure.** Context composition, instruction management, tool provisioning, workspace scoping, session state — these are infrastructure concerns that determine agent performance as much as compute and networking.

---

## Ring Deployment Modes

The Rings Model is a logical architecture. How the rings manifest physically depends on the system type, latency budget, and governance requirements. Three modes, each with different tradeoffs:

### Wrapper Mode

The rings literally wrap execution. Sequential, concentric — Ring 0 produces, Ring 1 verifies, Ring 2 governs, output releases.

```
Ring 0: Produce output
──── checkpoint ────
Ring 1: Verify (loop until converge)
──── checkpoint ────
Ring 2: Evaluate policy, gate if required
──── checkpoint ────
Output released
Ring 3: Learn (async)
```

| Property | Assessment |
|----------|-----------|
| **Best for** | Batch pipelines, document processing, assessment workflows, regulatory filings |
| **Real-world examples** | AI risk assessment pipelines, automated report generation, code review pipelines |
| **Latency** | Seconds to hours — the full sequential pass adds wall-clock time proportional to verification complexity |
| **Audit clarity** | Highest — each stage boundary is a clean cut in the provenance chain |
| **Human oversight** | Easiest — gates pause cleanly, reviewers see complete context |
| **Reproducibility** | Highest — same inputs + configuration = same trace |
| **Checkpointing** | Simple — checkpoint between each ring, full state capture |
| **Tradeoff** | Latency. For user-facing agents, the sequential pass may be unacceptable. |

### Middleware / Interrupt Mode

Ring logic fires at specific decision points within an execution graph — tool calls, data access, state mutations. The agent executes continuously; the rings intercept at defined boundaries.

```
step 1 → step 2 → [R1: verify tool] → step 3
                                          │
                    [R2: gate — destructive] ←┘
                              │
                       (human approves)
                              │
                          step 4 → step 5 → [R1: verify output]
                                                    │
                                                step 6 → done

Ring 3: learns from full trace (async)
Security fabric: active at every interrupt boundary
```

| Property | Assessment |
|----------|-----------|
| **Best for** | Coding agents, ops automation, multi-step task agents, infrastructure management |
| **Real-world examples** | Claude Code, Cursor, Devin, GitHub Copilot Workspace, CI/CD agents |
| **Latency** | Sub-second to seconds per action |
| **Audit clarity** | Good — provenance shows which control points triggered and what was decided |
| **Human oversight** | Good with constraints — richer context, more domain expertise required |
| **Reproducibility** | Moderate — tool responses are external and may vary |
| **Checkpointing** | Checkpoint at each interrupt boundary. Agent must be resumable — pausing mid-execution for a gate requires frozen, persisted, resumable state. |
| **Tradeoff** | Interrupt policy design is hard. Too many = constant pausing. Too few = missed consequential actions. |

**MCP as canonical implementation:** The Model Context Protocol materializes middleware/interrupt mode directly — the protocol defines the boundary between agent reasoning and tool execution, making each tool call a natural interrupt point. See [MCP Integration Patterns](#mcp-integration-patterns) below.

### Graph-Embedded Mode

Verification, governance, and security run concurrently with execution as peer nodes in the orchestration graph.

```
┌───────────────────────────────────────────────┐
│  Execution Graph (concurrent)                  │
│                                                │
│  Ring 0    Ring 1    Ring 2    Security        │
│  produce → quality → auth  →  safety →        │
│  stream    signal    signal   signal           │
│                                    │           │
│                          ┌─────────┘           │
│                          ▼                     │
│                    Release Gate                 │
│                    (all pass) → output          │
│                                                │
│  Ring 3: async on event stream                 │
└───────────────────────────────────────────────┘
```

| Property | Assessment |
|----------|-----------|
| **Best for** | Conversational agents, voice assistants, real-time systems, agent swarms |
| **Real-world examples** | ChatGPT-style agents, voice assistants, real-time recommendation engines, trading agents |
| **Latency** | Milliseconds (user-perceived) |
| **Audit clarity** | Lowest — concurrent execution produces a partial order, not a total order |
| **Human oversight** | Hardest — speculative execution means the agent has "moved on" by the time a gate fires |
| **Reproducibility** | Lowest — concurrency introduces timing-dependent behavior |
| **Checkpointing** | Most complex — must capture parallel state of all concurrent executions |
| **Tradeoff** | Latency for governance clarity. Systems subject to regulatory audit should strongly consider wrapper or middleware. |

**Speculative execution bounds** *(Informed proposal):*
- **Depth limit:** 3-4 levels of speculative chaining. Governance overhead grows super-linearly beyond depth 4.
- **Entropy constraint:** If historical rejection rate for an action class exceeds ~20%, exclude from speculation and process sequentially.
- **Resource budget:** Per-request speculative budget (compute, tokens, API calls) prevents runaway speculation.
- **Side-effect fence:** Speculative steps that produce irreversible side effects are held in a commit buffer until the governance release gate clears.

### Hybrid Deployment

Systems are not required to use a single mode. The common pattern: **middleware mode overall with graph-embedded subsections.** The coding agent operates in middleware mode (interrupt-driven), but within a single user-facing response, the generation pipeline uses graph-embedded mode (parallel verification of streamed output).

---

## Mode Selection Matrix

Choose the deployment mode based on system characteristics. When multiple modes could work, prefer the one with stronger governance properties unless latency requirements force otherwise.

| System Characteristic | Wrapper | Middleware | Graph-Embedded |
|----------------------|---------|-----------|----------------|
| **Output type** | Discrete artifact (document, report, assessment) | Sequence of actions (tool calls, mutations, operations) | Continuous stream (conversation, real-time feed) |
| **Latency tolerance** | Seconds to hours | Sub-second to seconds per action | Milliseconds (user-perceived) |
| **Governance intensity** | High — every output fully reviewed | Selective — consequential actions trigger rings | Minimal blocking — most output auto-passes |
| **Human gate frequency** | High — frequent pause-and-review acceptable | Moderate — gates at high-stakes actions only | Low — rare, and disruptive when they fire |
| **Regulatory/audit** | Strong — clear evidence trail required | Moderate — action-level audit sufficient | Light — behavioral monitoring sufficient |
| **Side-effect profile** | Contained — output is an artifact | Mixed — many actions, some irreversible | Continuous — streaming output, real-time effects |
| **Regulatory jurisdiction** | EU AI Act high-risk (Art. 9-15) | Most jurisdictions — action-level audit satisfies | Permissive or low-risk classification |
| **Rollback/compensation** | Simple — discard the artifact | Per-action compensation via Transaction Control #16 | Complex — speculative execution may have committed partial state |
| **Observability maturity** | Basic — stage-boundary events sufficient | Moderate — interrupt-level telemetry, OTel `execute_tool` spans | Advanced — concurrent trace reconstruction, distributed snapshot tooling |
| **Concurrent load** | Low — batch/sequential | Medium — multiple agents with interleaved governance | High — parallel verification, swarm coordination |
| **Protocol integration** | Custom pipeline orchestration | MCP (tool calls), A2A (agent delegation) | Custom streaming protocols, WebSocket-based |

**Decision heuristic:** If you're unsure, start with middleware mode. It's the most common deployment pattern for agentic systems in 2026, handles the widest range of use cases, and has the strongest middleware ecosystem (MCP).

---

## The Agent Environment Stack

Every agent operates within a 5-layer environment. Each layer has its own composition policy, governance intensity, and lifecycle:

```
┌──────────────────────────────────────────────────┐
│ L5: Session State                     20-30%     │
│ conversation history, tool results, working      │
│ memory, handoff context                          │
│ Ephemeral, session-scoped                        │
├──────────────────────────────────────────────────┤
│ L4: Retrieved Context                 30-40%     │
│ task-specific knowledge, documents, search        │
│ Dynamic, loaded JIT per task                     │
├──────────────────────────────────────────────────┤
│ L3: Capability Set                    10-15%     │
│ active tools, skills, MCP servers, API access    │
│ Provisioned per role, subject to trust level     │
├─ ─ ─ ─ ─ ─ TRUST BOUNDARY ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ L2: Instruction Architecture          10-20%     │
│ system prompts, rules, personas, constraints     │
│ Versioned, tested, slow-changing                 │
├──────────────────────────────────────────────────┤
│ L1: Identity & Policy Substrate       5-10%      │
│ agent identity, ring assignment, governance      │
│ policy, trust level, workspace boundaries        │
│ Foundational                                     │
└──────────────────────────────────────────────────┘
         ▲ Composition flow: bottom-up
```

**Trust boundary:** Below L3 (L1-L2) is human-authored, version-controlled, and trusted. Above the boundary (L3-L5) is dynamic, runtime-composed, and treated as untrusted input by the Security Fabric.

**Percentages** are context budget allocation starting points. The Environment Optimization Loop adjusts based on measured effectiveness.

### Composition Patterns

| Pattern | Aligns With | Description |
|---------|------------|-------------|
| **Static** | Wrapper mode | Full environment composed before execution. All context, tools, instructions loaded upfront. |
| **JIT** | Middleware mode | Layers 1-3 loaded at start. Layers 4-5 loaded dynamically as the agent executes — lightweight identifiers (paths, queries, URLs) rather than pre-loading everything. Anthropic's recommended pattern: progressive disclosure through exploration. |
| **Streaming** | Graph-Embedded mode | Continuously updated. Context enters and exits based on relevance scoring. Most sophisticated, highest overhead. |

### The Environment Optimization Loop

The governed self-improving cycle for the agent's operating substrate:

**Observe** → Measure effectiveness (context hit rate, tool selection accuracy, token efficiency, instruction adherence, task completion quality)

**Identify** → Find gaps (missing context that caused errors, unused tools wasting budget, stale instructions, workspace boundaries too narrow or too broad)

**Propose** → Generate improvements (updated instructions, revised tool sets, adjusted context priorities, modified workspace boundaries)

**Validate** → Ring 2 evaluates policy compliance. Evaluation & Assurance (#18) regression-tests. Security review for attack surface expansion.

**Deploy** → Staged rollout with monitoring and rollback capability.

**Termination condition:** If N consecutive proposals are rejected (recommended: 3), the loop pauses and surfaces the constraint conflict for human review.

**Governance constraint:** The loop proposes, it does not autonomously enact. An unconstrained optimization loop on the agent's own environment is a safety risk — it could optimize instructions to bypass governance, expand tool access beyond scope, or modify context to exclude governance-relevant information.

---

## The Composability Interface

The standard contract that makes rings attachable to any pipeline:

### The Signal Protocol

```
Ring receives:
  - output:   structured artifact from the inner ring
  - context:  execution metadata, provenance chain, policy context,
              trust level, iteration count
  - config:   ring-specific configuration

Ring returns one of:
  - PASS(output, annotations)
  - REVISE(output, findings, reason)
      reason: quality    → Ring 1: "not good enough"
      reason: context    → Ring 2: "world changed, re-execute"
  - HALT(reason)         → stop execution, escalate
  - GATE(evidence, req)  → pause for authorization
      returns: APPROVE | REJECT | MODIFY | DEFER | ESCALATE
  - DELEGATE(target, context, scope, depth)
      depth >= max_delegation_depth → converts to HALT
  - ERROR(reason, partial_state, recovery)
      recovery: retry | degrade | halt
```

**Signal restrictions:** Ring 1 → PASS, REVISE(quality), HALT, ERROR. Ring 2 → PASS, REVISE(context), HALT, GATE, DELEGATE, ERROR. Ring 3 → no signals on individual outputs; modifies configuration between executions.

### Execution Budgets

Every pipeline execution carries a budget:

| Budget Dimension | Purpose |
|-----------------|---------|
| `max_iterations` | Total cross-ring revision loops allowed |
| `max_cost` | Cumulative cost ceiling across all rings |
| `max_wall_clock` | Wall-clock time limit for the full pipeline |
| `budget_exhausted` | Triggers HALT with budget reason |

### REVISE(context) Transaction Semantics

When Ring 2 issues REVISE(context) — "world changed, re-execute" — after Ring 0 has already committed side effects:

- **No blind re-execution.** The re-execution must account for what already happened.
- **Idempotency keys carry across revisions.** Already-committed effects are not re-executed.
- **Prior approvals invalidated.** Approvals granted under the original context expire.
- **Compensation for partial execution.** Committed effects no longer valid under new context trigger governed compensation.
- **Approval expiration.** Material changes during the validity window expire approvals automatically.

### Pipeline Compatibility Requirements

For any ring to attach, the pipeline must:

1. **Produce structured output** — not raw text, but schema-conformant artifacts with metadata
2. **Carry identity context** — agent, model, delegation chain, tenant, data scope on every action
3. **Emit events** — structured events at ring boundaries for observability
4. **Support checkpointing** — state capture and recovery at defined boundaries
5. **Accept the composability signals** — PASS, REVISE, HALT, GATE, DELEGATE, ERROR

---

## MCP Integration Patterns

The Model Context Protocol is the canonical implementation of middleware/interrupt mode. Each MCP tool call is a natural interrupt point where ring logic fires.

### How AGF Maps to MCP

| AGF Concept | MCP Implementation |
|------------|-------------------|
| **Ring 2 tool authorization** | Policy defines which MCP servers and tools are authorized (allowlisted servers, permitted tool schemas, scope constraints) |
| **Security Fabric verification** | Tool integrity verified at each `execute_tool` invocation |
| **Ring 1 verification** | Evaluates tool selection (right tool?) and tool output (valid results?) |
| **Identity propagation** | OTel `execute_tool` spans carry identity context. Note: MCP does not yet define standard trace context propagation; use `params._meta`. |

### MCP-Specific Governance Concerns

1. **Dynamic tool discovery.** MCP servers expose new tools at runtime. Ring 2 must decide: do dynamically discovered tools inherit the server's trust level, or require explicit authorization?

2. **Server trust chain.** Community MCP servers undergo no security review. Supply chain trust (#15) policy must define trust tiers (verified publisher, community-reviewed, unvetted) with different ring activation intensity per tier.

3. **Context window as attack surface.** MCP tool descriptions are injected into the agent's context. Tool poisoning (OWASP MCP03) and prompt injection (MCP06) operate through this channel. The Security Fabric must treat MCP tool descriptions as untrusted input.

4. **Session isolation.** Multi-tenant MCP servers must enforce context compartmentalization (OWASP MCP10). Ring 2 policy defines isolation boundaries; Fabric enforces them.

---

## Multi-Agent Coordination

When multiple agents interact, governance scales fractally.

### Composition Patterns

| Pattern | Description | Governance |
|---------|-------------|-----------|
| **Sequential** | Agent A → Agent B → Agent C. Each agent's output is the next's input. | Each agent's rings evaluate their output independently. Cross-pipeline governance applies at handoff boundaries. |
| **Parallel** | Agents A, B, C execute simultaneously. Results merged. | Each agent governed independently. Merge logic is itself a governed operation (Ring 1 evaluates merge quality). |
| **Orchestrated** | A coordinator agent dispatches to specialists. | Coordinator operates in its own rings. Each specialist operates in its own rings. DELEGATE signal enables governed lateral delegation. |

### Rings Are Fractal

A multi-agent system can have rings within rings — each agent with its own Ring 0/1/2, and an outer ring architecture governing the ensemble. The **governance collapse rule**: outermost Ring 2 is authoritative on scope conflicts. Leaf-level Ring 2 is final within scope. Maximum 3 nesting levels recommended.

### Cross-System Trust

When agents cross organizational boundaries:
- **Federated trust:** Trust resets to Intern level across organizational boundaries unless federated trust agreements exist.
- **Protocol-level identity:** OAuth 2.1, OIDC, SPIFFE for cross-system authentication.
- **Capability discovery:** Signed capability manifests before delegation.
- **Policy translation:** Standardize on composability interface signals (PASS/REVISE/HALT/GATE/DELEGATE/ERROR) as the cross-system governance protocol.

---

## Cost of Governance

### Proportional Activation

| Stakes | Ring Configuration | Overhead |
|--------|-------------------|----------|
| Low | Ring 0 + minimal Ring 1 | Near-zero |
| Medium | Ring 0 + Ring 1 + adaptive Ring 2 gates | 1.5–3× Ring 0 |
| High | All four rings, mandatory gates, full verification | 3–5× Ring 0 |
| Critical | All rings + enhanced Intelligence monitoring + continuous evaluation/red-teaming | 5×+ Ring 0 |

### Empirical Benchmarks

| Metric | Value | Implication |
|--------|-------|------------|
| **Policy evaluation latency** | 0.43s / 7K decisions (Microsoft AGT) | Runtime governance overhead is sub-second |
| **Security fabric latency** | 11μs per check (Bifrost) | Fabric enforcement at wire speed is feasible |
| **Explainability overhead** | ~2× compute (SHAP/LIME) | Transparency at every gate has real cost |
| **Self-improvement cost** | ~50× tokens (Reflexion-style) | Ring 3 learning is a genuine investment |

### Real Cost Drivers

The multipliers above describe LLM compute only. The real costs are organizational:

| Driver | Why It Matters |
|--------|---------------|
| **Human review bandwidth** | ~5-15 complex gates/hour before quality degrades. Trust Ladders are the economic answer. |
| **Policy authoring & maintenance** | Policies rot. Regulatory landscape shifts. Ongoing cost, not one-time. |
| **Evaluation suite maintenance** | Stale tests = false assurance. Continuous cost. |
| **Trace storage** | At scale, trace storage is significant infrastructure cost. Retention policies, sampling, tiered storage needed. |
| **Incident response** | Pre-authorized responses reduce cost; novel incidents require investigation. |
| **Governance debt** | Like tech debt, compounds. Deferred updates surface as incidents. |

---

## Platform Primitives Reference

The following AGF primitives are directly relevant to platform engineering. For full pattern descriptions, see the [AI Engineering Profile](ai-engineering-profile.md) or the [AGF Primitives catalog](../docs/agentic-primitives.md).

| Primitive | Platform Role |
|-----------|--------------|
| **#5 Structured Output Persistence** | The data contract between rings. Infrastructure must support structured artifact persistence. |
| **#8 Governance Gates** | Platform provides gate UX — the interface where humans review evidence and make decisions. |
| **#10 Event-Driven Observability** | The event stream. Platform provides ingestion, routing, storage. |
| **#13 Error Handling & Recovery** | Checkpointing, retry, graceful degradation. Platform provides the recovery infrastructure. |
| **#14 Identity & Attribution** | Platform operates the identity infrastructure — SPIFFE/SPIRE, OAuth, certificate management. |
| **#16 Transaction & Side-Effect Control** | Pre-commit/commit/post-commit. Platform manages the transaction layer for irreversible actions. |
| **#19 Agent Environment Governance** | The 5-layer environment stack. Platform builds and operates the composition, provisioning, and optimization infrastructure. |

---

## Infrastructure Checklist

Use this checklist to verify that your platform supports governed agentic systems.

### Deployment Mode Infrastructure
- [ ] Deployment mode selected based on system characteristics (Mode Selection Matrix)
- [ ] Ring infrastructure deployed for selected mode (wrapper/middleware/graph-embedded)
- [ ] Interrupt policy defined (middleware mode: which actions trigger ring activation)
- [ ] Checkpointing configured at ring/interrupt boundaries
- [ ] Agent state is resumable (for governance gates that pause mid-execution)

### Composability Interface
- [ ] Pipeline produces structured output (schema-conformant, not raw text)
- [ ] Identity context propagated on every action
- [ ] Events emitted at ring boundaries
- [ ] Execution budgets configured (iterations, cost, wall-clock)
- [ ] All six signal types handled (PASS, REVISE, HALT, GATE, DELEGATE, ERROR)

### Agent Environment
- [ ] 5-layer environment stack configured (L1 identity → L5 session state)
- [ ] Trust boundary enforced between L2 (trusted) and L3 (untrusted)
- [ ] Context budget allocation defined
- [ ] Composition pattern selected (static/JIT/streaming)
- [ ] Environment optimization loop configured with governance constraints
- [ ] Termination condition set for rejected proposals

### MCP Integration (if applicable)
- [ ] MCP servers authorized via Ring 2 policy
- [ ] Tool schema integrity verification active
- [ ] Dynamic tool discovery governance defined
- [ ] MCP tool descriptions treated as untrusted input
- [ ] Session isolation enforced for multi-tenant deployments
- [ ] OTel trace context propagated via `params._meta`

### Multi-Agent Coordination (if applicable)
- [ ] Composition pattern selected (sequential/parallel/orchestrated)
- [ ] DELEGATE signal configured with depth limits (max 3 recommended)
- [ ] Cross-system trust policy defined (federated trust, capability discovery)
- [ ] Governance collapse rule configured (outermost Ring 2 authoritative on scope conflicts)

### Cost Governance
- [ ] Execution budgets enforced (max iterations, max cost, max wall-clock)
- [ ] Trust Ladders configured (starting trust level, promotion criteria)
- [ ] Trace storage retention policy defined
- [ ] Ring activation proportional to risk classification

---

*This is the AGF Platform Profile — one of five domain profiles in the AGF reference architecture. For the complete framework, see [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md).*
