# Agentic Risk Operating System — System Architecture v0.1

## Purpose

This architecture defines a practical first implementation of an **Agentic Risk Operating System** built around the **Risk Decision Graph (RDG)**.

The goal is not generic GRC automation.  
The goal is a **governed decision system** that can:

- ingest case data
- extract entities, claims, and evidence
- revise beliefs as evidence changes
- quantify uncertainty where useful
- evaluate policy constraints
- generate decision options
- route human approvals
- preserve a replayable audit trail

---

## Core design thesis

The platform should be built around this chain:

```text
Case
→ Entities
→ Claims
→ Evidence
→ Beliefs
→ Policy Tests
→ Scenario / Quant Analysis
→ Decision Options
→ Final Decision
→ Governance Approval
→ Continuous Review / Drift Detection
```

That is the center of gravity.

---

## North-star product behavior

A reviewer should be able to answer:

- What was the case?
- What facts and evidence were used?
- What did the system believe at the time?
- Which method was applied?
- What quantitative analysis was run?
- Which policy constraints mattered?
- What decision options were considered?
- Who approved the final outcome?
- What changed later?

If the system cannot answer those questions, it is not defensible.

---

## 1. Top-level architecture

The system should have **7 major layers**:

1. Experience Layer
2. Workflow and Orchestration Layer
3. Agent Layer
4. Decision Intelligence Layer
5. Quantitative Risk Layer
6. Governance and Control Layer
7. Data and Storage Layer

---

## 2. Experience Layer

This is the user-facing application.

### Primary interfaces

- Case intake UI
- Reviewer workbench
- Graph view
- Evidence explorer
- Policy test results view
- Decision memo view
- Governance approval console
- Drift / review dashboard
- Admin configuration UI

### Key requirements

- reviewers must see traceability, not just scores
- all material claims should show supporting and opposing evidence
- belief state should be visible
- decision rationale should be explainable in plain language
- approvals and overrides should be explicit

### Important principle

Do not make the graph the primary UX.

The primary UX should be **case review and decision support**.  
The graph is a supporting view.

---

## 3. Workflow and Orchestration Layer

This is the operating backbone.

It controls:

- case state
- agent sequencing
- retries
- human-in-the-loop checkpoints
- escalation
- review triggers
- re-evaluation on change

### Recommended workflow states

- draft
- intake
- evidence_collection
- analysis_in_progress
- decision_recommendation_ready
- pending_approval
- approved
- approved_with_conditions
- rejected
- escalated
- monitoring
- expired
- superseded

### Orchestration responsibilities

- start and track case runs
- invoke appropriate agents by case type
- prevent duplicate or conflicting writes
- log every material action
- trigger re-runs when evidence/policy/model changes
- enforce approval gates before final state transitions

### Suggested implementation style

Use a **durable workflow engine** or a well-structured orchestration service.  
Do not bury orchestration inside random agent prompts.

---

## 4. Agent Layer

Agents should be specialized, bounded, and governed.

### Recommended initial agent roles

#### 4.1 Intake Agent
Normalizes intake materials into a case package.

Outputs:
- case summary
- case type classification
- initial entity candidates
- missing information requests

#### 4.2 Entity Extraction Agent
Extracts entities from documents and structured records.

Outputs:
- applications
- datasets
- vendors
- controls
- business owners
- policies
- environments

#### 4.3 Evidence Agent
Collects, links, and summarizes evidence.

Outputs:
- evidence records
- evidence metadata
- source references
- confidence notes
- freshness metadata

#### 4.4 Claim Agent
Transforms evidence and case inputs into structured claims.

Outputs:
- fact assertions
- risk assertions
- control assertions
- assumptions
- decision-relevant findings

#### 4.5 Challenger Agent
Searches for contradictions, missing support, weak assumptions, and edge cases.

Outputs:
- counterclaims
- gaps
- contradiction flags
- challenge summaries

#### 4.6 Belief Manager Agent
Maintains the current governed belief state for material claims.

Outputs:
- belief state
- uncertainty
- revision events
- basis for revision

#### 4.7 Policy Agent
Evaluates beliefs, scenarios, and controls against formal governance rules.

Outputs:
- policy tests
- threshold results
- allowed/blocked decision options
- exception requirements

#### 4.8 Quant Risk Agent
Builds quantitative models when relevant.

Outputs:
- FAIR-style factor models
- parameter ranges
- simulation inputs

#### 4.9 Simulation Agent
Runs Monte Carlo or other probabilistic analysis.

Outputs:
- risk distributions
- threshold exceedance probabilities
- expected loss metrics
- scenario comparisons

#### 4.10 Recommendation Agent
Synthesizes all outputs into decision options.

Outputs:
- approve
- approve_with_conditions
- reject
- defer_pending_evidence
- escalate
- grant_exception

#### 4.11 Memo Agent
Generates exportable, reviewer-ready decision memos.

Outputs:
- decision memo
- rationale summary
- condition list
- evidence appendix

### Guardrails for all agents

Every agent write should include:

- agent_id
- version
- timestamp
- method reference
- confidence
- source references
- change justification where applicable

### Important principle

Agents should not directly “decide.”

They should:
- gather
- structure
- challenge
- model
- recommend

Final authority should remain within governance controls.

---

## 5. Decision Intelligence Layer

This is the heart of the product.

This is where the **Risk Decision Graph** lives.

### Core node types

- Case
- Entity
- Claim
- Counterclaim
- Evidence
- Belief
- Method
- PolicyTest
- Score
- Scenario
- Simulation
- DecisionOption
- Decision
- Approval
- ReviewTrigger
- RevisionEvent

### Core edge types

- involves
- supported_by
- contradicted_by
- challenges
- derived_from
- revised_by
- tested_by
- produces
- recommends
- selected_as
- approved_by
- requires
- subject_to
- supersedes
- triggers_review

### Key design rule

The graph should be **case-bound first**.

Cross-case reuse should happen through:
- templates
- libraries
- parameter baselines
- prior-case references

Do not start with one giant enterprise graph.

---

## 6. Belief Layer

This is the most important architectural addition.

### Why it matters

Claims are assertions.  
Beliefs are the current governed stance toward those assertions.

### Belief states

- unknown
- under_review
- plausible
- provisionally_accepted
- accepted
- contested
- insufficient_evidence
- rejected
- stale
- superseded

### Belief fields

- belief_id
- subject_claim_id
- belief_state
- belief_strength
- uncertainty
- supporting_claims
- opposing_claims
- supporting_evidence
- policy_relevance
- last_revised_at
- revision_reason

### Key behavior

When new evidence arrives:

```text
new evidence
→ linked claims updated
→ belief re-evaluated
→ affected policy tests re-run
→ decision options re-evaluated
→ review trigger fired if thresholds crossed
```

This is how the system becomes an operating system rather than a static case database.

---

## 7. Policy Evaluation Layer

Risk reasoning and governance rules must be separated.

### Policy layer responsibilities

- evaluate constraints
- interpret thresholds
- determine required escalation paths
- identify blocked outcomes
- attach policy versions to decisions

### Example policy tests

- restricted data + external model = exception required
- autonomous action without human review = not allowed
- residual risk above threshold = escalate
- missing DPA for sensitive data processor = block approval
- vendor criticality high + no security review = defer

### Why this matters

This enables:
- policy versioning
- replay under prior policy
- clean decision-option generation
- transparent governance logic

---

## 8. Quantitative Risk Layer

This is optional per case, but powerful.

### When to use it

Use quantitative modeling for:
- cyber risk scenarios
- third-party risk
- material AI risk
- architecture change with material exposure
- exception requests with financial stakes

### Recommended model types

- FAIR-style factor decomposition
- Monte Carlo simulation
- threshold exceedance analysis
- scenario comparison

### Typical outputs

- expected annual loss
- P90 / P95 / P99 loss
- likelihood distribution
- control-adjusted residual risk
- sensitivity analysis

### Important principle

Quant models should be traceable back to:
- claims
- evidence
- assumptions
- methodology version

No black-box numbers.

---

## 9. Governance and Control Layer

This is where enterprise trust lives.

### Governance objects

- approval requirements
- received approvals
- overrides
- exceptions
- segregation-of-duty rules
- review schedules
- drift triggers
- policy references
- accountability assignments

### Control points

- human approval gate before final decision
- mandatory challenger review for high-risk cases
- approval quorum for exception cases
- override reason required
- stale evidence review trigger
- policy-change re-evaluation trigger
- model/provider/configuration change trigger

### Minimum governance rules for v0.1

- no final approval without named approver
- no silent overrides
- no decision without policy version reference
- no recommendation without evidence trace
- no approval for expired evidence in high-risk cases

---

## 10. Data and Storage Layer

Do not over-engineer this early.

### Recommended storage pattern

#### Postgres
Use as the primary system of record for:
- cases
- entities
- claims
- evidence metadata
- beliefs
- policy tests
- scores
- decisions
- approvals
- workflow state
- audit events

#### Object storage
Use for:
- uploaded documents
- architecture diagrams
- screenshots
- questionnaires
- exported memos
- contracts
- policy PDFs

#### Graph projection layer
Use when needed for:
- traversals
- graph visualization
- reasoning path reconstruction
- dependency analysis

This can be:
- a graph-friendly schema in Postgres
- or a later graph DB projection

### Recommendation

Start with **Postgres-first**.  
Project graph views later.

---

## 11. Core services

### 11.1 Case Service
Handles:
- create case
- update case
- state transitions
- ownership
- retention metadata

### 11.2 Evidence Service
Handles:
- source registration
- evidence extraction
- metadata
- freshness
- access classification

### 11.3 Claims Service
Handles:
- create claim
- challenge claim
- supersede claim
- link claim to evidence/entities

### 11.4 Belief Service
Handles:
- belief creation
- belief revision
- uncertainty updates
- stale-state management

### 11.5 Policy Engine Service
Handles:
- policy rule execution
- threshold evaluation
- policy version resolution
- decision option constrainting

### 11.6 Quant Service
Handles:
- FAIR parameterization
- simulation runs
- scenario comparisons
- sensitivity analysis

### 11.7 Decision Service
Handles:
- recommendation creation
- final decision record
- conditions
- expiration
- renewal logic

### 11.8 Governance Service
Handles:
- approval routing
- override tracking
- exception tracking
- review schedules

### 11.9 Audit / Provenance Service
Handles:
- immutable event log
- reasoning chain generation
- memo exports
- decision replay support

---

## 12. Essential APIs

### Cases
- `POST /cases`
- `GET /cases/{id}`
- `PATCH /cases/{id}`
- `POST /cases/{id}/submit`

### Entities / Claims / Evidence
- `POST /cases/{id}/entities`
- `POST /cases/{id}/claims`
- `POST /cases/{id}/claims/{claim_id}/challenge`
- `POST /cases/{id}/evidence`
- `POST /cases/{id}/evidence/{evidence_id}/link`

### Beliefs
- `POST /cases/{id}/beliefs/revise`
- `GET /cases/{id}/beliefs`
- `GET /cases/{id}/beliefs/{belief_id}/history`

### Policy
- `POST /cases/{id}/policy-tests/run`
- `GET /cases/{id}/policy-tests`

### Quant
- `POST /cases/{id}/quant-models`
- `POST /cases/{id}/simulate`
- `GET /cases/{id}/simulations`

### Decision
- `POST /cases/{id}/decision-options/generate`
- `POST /cases/{id}/decision/recommend`
- `POST /cases/{id}/decision/finalize`

### Governance
- `POST /cases/{id}/approvals/request`
- `POST /cases/{id}/approvals/respond`
- `POST /cases/{id}/overrides`

### Exports
- `GET /cases/{id}/export/decision-memo`
- `GET /cases/{id}/export/reasoning-chain`
- `GET /cases/{id}/export/audit-package`

---

## 13. Audit and provenance model

This is not optional.

### Every material action should log

- event_id
- case_id
- actor_type (agent/user/system)
- actor_id
- action_type
- target_type
- target_id
- previous_state
- new_state
- timestamp
- justification
- related_sources

### Minimum provenance chain

```text
Evidence
→ Claim
→ Belief
→ Policy Test
→ Decision Option
→ Final Decision
→ Approval
```

### Why this matters

This is the product-level trust chain.

---

## 14. Decision memo generation

Each case should be exportable as a human-readable memo.

### Recommended memo sections

- case summary
- reviewed scope
- material entities
- material claims
- supporting and opposing evidence
- belief states
- methodology used
- quant analysis summary
- policy test results
- decision options considered
- final decision
- conditions and actions
- approvers
- next review date

This becomes a high-value enterprise artifact.

---

## 15. Initial case types to support

Build in this order:

### 1. AI Use Case Review
Best fit for timing and market pull.

### 2. Security Architecture Review
Best fit for repeatability and enterprise depth.

### 3. Policy Exception / Compensating Control Case
Best fit for governance workflows.

### 4. Third-Party Risk Decision
Best fit for expansion.

Do not start broader than this.

---

## 16. Recommended MVP scope

### Include in MVP

- one case type
- 8–12 entity types
- claim model
- evidence model
- belief layer
- policy evaluation
- decision options
- final decision record
- approvals
- decision memo export
- review triggers
- basic audit trail

### Add soon after MVP

- challenger agent
- Monte Carlo for selected cases
- reusable templates
- prior-case reference support
- policy version replay
- evidence aging logic

### Defer

- giant enterprise ontology
- advanced graph database
- general-purpose autonomous agents
- cross-tenant schema builders
- universal simulation engine
- cryptographic proof infrastructure

---

## 17. Build sequence recommendation

### Phase 1 — Defensible decision core
Build:
- case intake
- entity / evidence / claim capture
- belief layer
- policy tests
- decision recommendation
- approvals
- memo export

### Phase 2 — Challenger and replay
Build:
- counterclaims
- belief revision history
- review triggers
- replay views
- prior-case references

### Phase 3 — Quantified decisioning
Build:
- FAIR factor models
- Monte Carlo
- scenario comparison
- threshold-based escalation

### Phase 4 — Portfolio intelligence
Build:
- cross-case analytics
- control effectiveness trends
- recurring policy conflict detection
- reusable parameter baselines

---

## 18. Hard design rules

### Rule 1
Do not let agents write freeform final decisions without structured links.

### Rule 2
Do not collapse claims, beliefs, and decisions into one object.

### Rule 3
Do not hide policy logic in prompts.

### Rule 4
Do not allow evidence without source, timestamp, and freshness metadata.

### Rule 5
Do not make the graph a science project.

### Rule 6
Do not ship quant analysis that cannot explain assumptions.

### Rule 7
Do not allow governance overrides without explicit justification.

---

## 19. Strategic positioning

This system is not just:

- GRC workflow
- AI governance dashboard
- questionnaire automation
- risk scoring software

It is:

### A governed decision intelligence platform

That is the stronger category.

The moat comes from:

- belief revision
- policy-aware decisioning
- evidence traceability
- replayable decision provenance
- agent coordination under governance

That is much harder to copy than a workflow UI with an LLM wrapper.

---

## 20. Bottom line

The winning architecture is:

```text
Postgres-first system of record
+ bounded specialized agents
+ Risk Decision Graph as case-bound reasoning substrate
+ Belief revision layer
+ explicit policy evaluation layer
+ optional FAIR / Monte Carlo quant layer
+ hard governance gates
+ full decision provenance
```

That gives you a practical, defensible first platform for:

- AI use case review
- security architecture review
- policy exceptions
- third-party risk decisions

If this is built cleanly, it can become the **system of record for risk-bearing enterprise decisions**.
