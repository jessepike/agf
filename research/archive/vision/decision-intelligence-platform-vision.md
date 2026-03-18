# Decision Intelligence Platform — Consolidated Vision

**Status:** Long-term product vision (Phase 2-4)
**Relationship to current product:** The AI Risk Tools assessment pipeline is Phase 1 of this architecture. The pipeline is the first ring of the platform.
**Consolidated from:** 10+ session documents (March 2026). Source files preserved in `Research/vision/sessions/`.

---

## The Core Thesis

Current GRC tools are built for **recordkeeping**, not **decision making**. Organizations have control libraries, questionnaires, document storage, and static reports — but the critical decisions (security architecture reviews, AI governance approvals, vendor risk assessments, policy exceptions) are still made manually by committees. These processes are slow, inconsistent, poorly documented, and dependent on scarce expert labor.

The platform thesis: build a **governed decision intelligence system** that captures how decisions are made and why — not just what was decided. Every decision produces a structured, auditable, replayable artifact that traces from evidence through reasoning to outcome.

The moat is not AI. The moat is **structured decision persistence** — the accumulated graph of how an organization makes risk-bearing decisions, with full provenance.

---

## Five Architectural Threads

These five concepts are the intellectual core of the platform. Each is independently valuable and publishable. Together they define a new product category.

### Thread 1: The Risk Decision Graph (RDG)

**The core data structure.** A case-bound reasoning substrate — not a generic knowledge graph.

Every decision case produces a graph containing:
- **Entities:** systems, datasets, vendors, controls, policies, owners
- **Claims:** assertions produced during reasoning (fact, risk, control, assumption)
- **Evidence:** supporting or contradicting information with source, timestamp, freshness
- **Beliefs:** the governed stance toward claims (see Thread 2)
- **Policy Tests:** explicit evaluation of governance rules against case data
- **Scenarios:** alternative configurations or outcomes with quantified risk
- **Decision Options:** system-generated proposals (approve, approve with conditions, reject, defer, escalate)
- **Final Decision:** authorized outcome with conditions and expiration
- **Approval:** human governance action with justification

**Key design rules:**
1. The graph is **case-bound first**. Cross-case intelligence comes later through templates, baselines, and prior-case references — not one giant enterprise graph.
2. Every node must include: creator identity, timestamp, method reference, confidence, and source references.
3. Agents must return **structured JSON objects**, not prose. LLM output is converted into graph objects.

**Canonical node types (15):** Case, Entity, Claim, Counterclaim, Evidence, Belief, Method, PolicyTest, Score, Scenario, Simulation, DecisionOption, Decision, Approval, ReviewTrigger, RevisionEvent.

**Canonical edge types (18):** involves, supported_by, contradicted_by, challenges, derived_from, revised_by, tested_by, produces, recommends, selected_as, approved_by, requires, subject_to, supersedes, triggers_review, and others.

**Source files:** `canonical_risk_decision_graph_schema.md`, `decision-graph-schema-v0.1.md`

---

### Thread 2: The Belief Layer

**The most conceptually novel element.** This is what separates a decision intelligence platform from a static case database.

The key distinction:
- **Claims** = assertions about facts ("This system processes PII")
- **Beliefs** = the *governed stance* toward those assertions ("We provisionally accept this based on the architecture document, pending validation")
- **Decisions** = authorized outcomes that follow from beliefs, policy tests, and governance approval

**Belief states:**
`unknown` → `under_review` → `plausible` → `provisionally_accepted` → `accepted`
Also: `contested`, `insufficient_evidence`, `rejected`, `stale`, `superseded`

**Belief fields:** belief_id, subject_claim_id, belief_state, belief_strength, uncertainty, supporting_claims, opposing_claims, supporting_evidence, policy_relevance, last_revised_at, revision_reason.

**The revision cascade — this is the operating system behavior:**
```
New evidence arrives
  → Linked claims updated
    → Beliefs re-evaluated
      → Affected policy tests re-run
        → Decision options re-evaluated
          → Review trigger fired if thresholds crossed
```

When evidence changes, beliefs revise, which cascades through policy evaluation to decision options. This is how the system becomes an operating system rather than a database.

**Why this matters for content/AFAS:** This is a concrete, production-grade implementation of Bayesian governance for agentic systems. No framework or product in the market has anything like it. The Belief Layer is the mechanism by which an agentic system maintains a *governed epistemic state* — it knows what it knows, what it doesn't know, and what has changed.

**Source files:** `agentic-risk-os-architecture-v0.1.md` (Section 6), `agentic_grc_decision_platform_product_brief.md`

---

### Thread 3: Adversarial Self-Critique (The Challenger)

**The principle:** Every decision system should have a mechanism explicitly designed to find contradictions, weak assumptions, missing evidence, and edge cases.

**The Challenger Agent produces:**
- Counterclaims (structured opposition to existing claims)
- Gaps (missing evidence or analysis)
- Contradiction flags (claims that conflict with each other or with evidence)
- Challenge summaries

**Design rule:** Agents should not directly "decide." They should gather, structure, challenge, model, and recommend. Final authority remains within governance controls.

**Connection to current pipeline:** The verification layer (shadow mode, self-audit, grounding quote checks) is an early implementation of this principle. The self-audit layer asks the LLM to verify its own extraction — classifying each field as GROUNDED / INFERRED / CONTRADICTED / UNSUPPORTED. This is adversarial self-critique at the field level. The platform version elevates it to the case level.

**Why this matters for content/AFAS:** Adversarial verification is a general architectural pattern for any agentic system that produces consequential output. The pattern: separate the "producer" from the "verifier," give the verifier explicit mandate to challenge, and make the challenge results visible in the provenance chain.

**Source files:** `agentic-risk-os-architecture-v0.1.md` (Section 4.5), `pipeline-verification-spec-v0.3.md`

---

### Thread 4: Policy as Code

**The principle:** Governance rules must be separated from reasoning logic and encoded as explicit, versioned, executable objects.

**Policy layer responsibilities:**
- Evaluate constraints against case data
- Interpret thresholds (risk appetite, materiality)
- Determine required escalation paths
- Identify blocked decision options
- Attach policy version to every decision

**Example policy tests (from architecture doc):**
- Restricted data + external model = exception required
- Autonomous action without human review = not allowed
- Residual risk above threshold = escalate
- Missing DPA for sensitive data processor = block approval
- Vendor criticality high + no security review = defer

**Why this matters:**
1. **Policy versioning:** Decisions can be replayed under a prior or proposed policy. "What would this decision have been under last year's policy?" or "If we adopt this new standard, how many of our existing approvals would fail?"
2. **Transparent governance logic:** The reasoning for a decision isn't hidden in a prompt — it's encoded in a policy test that can be inspected, versioned, and audited.
3. **Enterprise trust:** Regulated industries need to demonstrate that governance rules are applied consistently. Policy-as-code provides that evidence.

**Connection to current pipeline:** The pipeline's framework mapping stage (NIST AI RMF subcategory citations with determination levels) is an early expression of policy-as-code. The platform version makes the policy layer a first-class service with version control and replay.

**Source files:** `agentic-risk-os-architecture-v0.1.md` (Section 7), `decision_intelligence_platform_architecture.md` (Section 4)

---

### Thread 5: Decision Provenance

**The strict chain:** Every decision must trace from evidence through reasoning to outcome with no gaps.

```
Evidence
  → Claim
    → Belief
      → Policy Test
        → Decision Option
          → Final Decision
            → Approval
```

**Audit requirements — every material action logs:**
- event_id, case_id
- actor_type (agent / user / system), actor_id
- action_type, target_type, target_id
- previous_state, new_state
- timestamp, justification
- related_sources

**The Decision Memo as first-class output:**
Each case should be exportable as a human-readable memo containing: case summary, reviewed scope, material entities, material claims, supporting and opposing evidence, belief states, methodology used, quantitative analysis summary, policy test results, decision options considered, final decision, conditions and actions, approvers, next review date.

This becomes a high-value enterprise artifact — and the primary deliverable that justifies the product's existence.

**Connection to current pipeline:** The pipeline's structured output (GovernanceAssessment with source-attributed findings, determination levels, confidence scores) is an early decision memo. The verification layer's event system (JSONL with structured events per stage) is an early provenance chain. The platform version makes provenance first-class with immutable append-only event logs, hash chaining, and decision replay.

**Source files:** `agentic-risk-os-architecture-v0.1.md` (Section 13), all architecture docs

---

## Supporting Concepts

### Multi-Agent Governance

The platform operates through **bounded, specialized agents** — not a monolithic LLM:

| Agent | Role |
|-------|------|
| Intake Agent | Normalizes intake materials into a case package |
| Entity Extraction Agent | Extracts systems, datasets, vendors, controls from documents |
| Evidence Agent | Collects, links, and summarizes evidence with metadata |
| Claim Agent | Transforms evidence into structured claims |
| Challenger Agent | Searches for contradictions and weak assumptions |
| Belief Manager Agent | Maintains governed belief state for material claims |
| Policy Agent | Evaluates beliefs against formal governance rules |
| Quant Risk Agent | Builds FAIR-style factor models when relevant |
| Simulation Agent | Runs Monte Carlo or probabilistic analysis |
| Recommendation Agent | Synthesizes all outputs into decision options |
| Memo Agent | Generates exportable, reviewer-ready decision memos |

**Guardrails:** Every agent write includes agent_id, version, timestamp, method reference, confidence, source references, and change justification. Agents recommend; humans decide.

### Quantitative Risk Layer (Optional)

When quantitative analysis is warranted (cyber risk, material AI risk, vendor risk with financial stakes):
- FAIR-style factor decomposition (threat event frequency, vulnerability, loss magnitude)
- Monte Carlo simulation
- Threshold exceedance analysis (P90/P95/P99)
- Scenario comparison
- All traceable back to claims, evidence, assumptions, and methodology version

### Hard Design Rules

1. Do not let agents write freeform final decisions without structured links
2. Do not collapse claims, beliefs, and decisions into one object
3. Do not hide policy logic in prompts
4. Do not allow evidence without source, timestamp, and freshness metadata
5. Do not make the graph a science project
6. Do not ship quant analysis that cannot explain assumptions
7. Do not allow governance overrides without explicit justification

---

## Case Type Wedge Strategy

Build in this order:

1. **AI Use Case Governance** ← Phase 1 (current pipeline)
2. **Security Architecture Review** — best fit for repeatability and enterprise depth
3. **Policy Exception / Compensating Control Case** — best fit for governance workflows
4. **Third-Party Vendor Risk Decisions** — best fit for expansion

Do not start broader than this.

---

## How the Current Pipeline Maps to This Vision

| Pipeline Component | Platform Equivalent | Status |
|---|---|---|
| Document parsing + extraction | Intake Agent + Entity Extraction Agent | Built (Phase 1) |
| Regulatory analysis | Policy Agent (early form) | Built (Phase 1) |
| Framework mapping (NIST AI RMF) | Policy-as-Code evaluation | Built (Phase 1) |
| Risk identification | Claim Agent + Risk Scorer | Built (Phase 1) |
| Action plan generation | Recommendation Agent + Memo Agent | Built (Phase 1) |
| Verification layer (shadow mode) | Challenger Agent (field-level) | Built (Phase 1) |
| Structured output with citations | Decision Provenance (early form) | Built (Phase 1) |
| Belief Layer | — | Not started (Phase 2+) |
| Decision Graph persistence | — | Not started (Phase 2+) |
| Policy versioning + replay | — | Not started (Phase 2+) |
| Case-to-case intelligence | — | Not started (Phase 3+) |
| Quantitative risk modeling | — | Not started (Phase 3+) |

---

## Build Sequence (Platform Phases)

### Phase 1 — Assessment Pipeline (Current)
What's built: headless governance intelligence pipeline. Document in, structured assessment out. Verification layer in shadow mode.

### Phase 2 — Defensible Decision Core
Build: case intake, entity/evidence/claim capture, belief layer, policy tests, decision recommendation, approvals, memo export.

### Phase 3 — Challenger and Replay
Build: counterclaims, belief revision history, review triggers, replay views, prior-case references.

### Phase 4 — Quantified Decisioning
Build: FAIR factor models, Monte Carlo, scenario comparison, threshold-based escalation.

### Phase 5 — Portfolio Intelligence
Build: cross-case analytics, control effectiveness trends, recurring policy conflict detection, reusable parameter baselines.

---

## Strategic Positioning

This system is not:
- GRC workflow software
- An AI governance dashboard
- Questionnaire automation
- Risk scoring with an LLM wrapper

It is a **governed decision intelligence platform.** The moat comes from:
- Belief revision (no competitor has this)
- Policy-aware decisioning (explicit, versioned, replayable)
- Evidence traceability (every claim linked to source)
- Replayable decision provenance (full chain, auditable)
- Agent coordination under governance (bounded agents, structured output, governance gates)

That is much harder to copy than a workflow UI with an LLM wrapper.

---

## Source File Index

All source files are preserved in `Research/vision/sessions/`:

| File | Primary Threads | Era |
|------|----------------|-----|
| `agentic-risk-os-architecture-v0.1.md` | All 5 threads — richest single source | Mar 9, 2026 |
| `canonical_risk_decision_graph_schema.md` | Thread 1 (RDG), Thread 2 (Belief) | Mar 9, 2026 |
| `decision-graph-schema-v0.1.md` | Thread 1 (RDG), Thread 5 (Provenance) | Mar 9, 2026 |
| `decision_intelligence_platform_architecture.md` | Thread 1, Thread 4, Thread 5 | Mar 9, 2026 |
| `agentic_grc_decision_platform_product_brief.md` | Product framing, case type strategy | Mar 9, 2026 |
| `DecisionOS Product Brief v1.docx` | Belief Layer origin, adversarial critique | Mar 9, 2026 |
| `postgres_ddl_v0_1_rdg.md` | Data model implementation (reference) | Mar 9, 2026 |
| `security_architecture_ontology_v0.1.md` | Security review case type ontology | Mar 9, 2026 |
| `security_architecture_review_mvp.md` | Case type #2 MVP design | Mar 9, 2026 |
| `seed_sql_ai_use_case_review.md` | Reference data for case type #1 | Mar 9, 2026 |
| `agentic_grc_mvp_90_day_build_plan.md` | Original build sequence (superseded) | Mar 9, 2026 |
| `decisionos_doc_merge_plan.md` | Meta-doc for organizing earlier docs | Mar 9, 2026 |
