# Canonical Risk Decision Graph (RDG) Schema
## DecisionOS / Agentic Risk OS

## 1. Purpose

The canonical **Risk Decision Graph (RDG)** is the case-bound system of record for enterprise risk decisions.

It must satisfy seven requirements already implied by the source docs:

1. separate **claims**, **beliefs**, and **decisions**
2. preserve a strict provenance chain from evidence to approval
3. keep policy logic explicit and versioned
4. support human governance gates
5. remain **Postgres-first**
6. allow optional quant/scenario analysis
7. support replay, revision, and reuse

This design follows the source architecture’s hard rules and provenance model. fileciteturn0file2L8-L37 fileciteturn0file2L163-L184

---

# 2. Canonical RDG Design Principles

## Rule A — Case-bound first
The graph is scoped to one case. Cross-case intelligence comes later through templates, baselines, and prior-case references, not through one giant enterprise graph. fileciteturn0file4L59-L70

## Rule B — Claims are not beliefs
A claim is an assertion. A belief is the governed stance toward that assertion. A decision is an authorized outcome. These must remain separate. fileciteturn0file4L77-L122 fileciteturn0file2L165-L172

## Rule C — No freeform final decisions
Final decisions must be structurally linked back to evidence, claims, beliefs, and policy tests. fileciteturn0file2L163-L170

## Rule D — Explicit policy layer
Policy tests must be executable objects with policy version references. Policy logic must not be hidden in prompts. fileciteturn0file3L5-L32 fileciteturn0file2L171-L176

## Rule E — Evidence freshness is first-class
Evidence without source, timestamp, and freshness metadata is invalid. fileciteturn0file2L173-L176

---

# 3. Canonical Object Model

The canonical model has **15 primary node types** and **18 canonical edge types**.

## 3.1 Node Types

### 1. Case
Top-level decision container.

**Purpose**
- anchor for all graph objects
- workflow state boundary
- governance and retention boundary

**Required fields**
- `case_id`
- `case_type`
- `title`
- `description`
- `status`
- `risk_domain`
- `workflow_template_id`
- `priority`
- `requestor_id`
- `owner_id`
- `created_at`
- `submitted_at`
- `closed_at`
- `retention_class`
- `current_decision_id` (nullable)

---

### 2. Entity
A material subject involved in the case.

**Examples**
- system
- application
- dataset
- vendor
- model
- business process
- control
- policy
- regulation
- owner

These align with both documents’ entity concepts. fileciteturn0file0L78-L86 fileciteturn0file6L16-L39

**Required fields**
- `entity_id`
- `case_id`
- `entity_type`
- `name`
- `external_ref`
- `criticality`
- `classification`
- `owner_id`
- `source_system`
- `attributes_json`

---

### 3. Evidence
Source-backed material used in reasoning.

**Required fields**
- `evidence_id`
- `case_id`
- `evidence_type`
- `title`
- `source_type`
- `source_uri`
- `source_hash`
- `captured_at`
- `effective_at`
- `expires_at`
- `freshness_state`
- `confidence`
- `access_classification`
- `extracted_text_ref`
- `metadata_json`

This directly reflects the requirement that evidence have source, timestamp, and freshness metadata. fileciteturn0file2L173-L176

---

### 4. Claim
A structured assertion about the case.

**Examples**
- “Sensitive customer data leaves the trust boundary.”
- “Vendor has no signed DPA.”
- “The proposed compensating control lowers residual risk.”

**Required fields**
- `claim_id`
- `case_id`
- `claim_type`
- `statement`
- `subject_entity_id` (nullable)
- `object_entity_id` (nullable)
- `asserted_by_actor_id`
- `asserted_by_actor_type`
- `method_id` (nullable)
- `materiality`
- `status`
- `created_at`
- `superseded_by_claim_id` (nullable)

---

### 5. Counterclaim
A specialized claim that explicitly challenges another claim.

**Required fields**
- `counterclaim_id`
- `case_id`
- `statement`
- `target_claim_id`
- `asserted_by_actor_id`
- `asserted_by_actor_type`
- `created_at`
- `status`

The architecture calls out counterclaims and challenger behavior as a core later phase. fileciteturn0file4L22-L40 fileciteturn0file2L139-L145

---

### 6. Belief
The current governed stance toward a claim.

**Required fields**
- `belief_id`
- `case_id`
- `subject_claim_id`
- `belief_state`
- `belief_strength`
- `uncertainty`
- `policy_relevance`
- `last_revised_at`
- `revision_reason`
- `computed_by_actor_id`
- `computed_by_actor_type`
- `version_no`

**Enumerated states**
- `unknown`
- `under_review`
- `plausible`
- `provisionally_accepted`
- `accepted`
- `contested`
- `insufficient_evidence`
- `rejected`
- `stale`
- `superseded`

This uses the source belief model directly. fileciteturn0file4L73-L108

---

### 7. Method
Methodology or framework used to derive or evaluate reasoning.

**Examples**
- NIST AI RMF
- STRIDE
- FAIR
- vendor risk rubric
- internal architecture review standard

**Required fields**
- `method_id`
- `case_id`
- `method_type`
- `name`
- `version`
- `parameters_json`
- `applied_scope`
- `created_at`

This aligns with the methodology engine described in the product brief. fileciteturn0file0L116-L126

---

### 8. PolicyTest
Executable governance constraint or threshold evaluation.

**Required fields**
- `policy_test_id`
- `case_id`
- `policy_id`
- `policy_version`
- `rule_id`
- `name`
- `test_expression`
- `result`
- `severity`
- `blocked_outcomes_json`
- `required_escalations_json`
- `executed_at`
- `explanation`

This follows the explicit policy evaluation layer from the architecture. fileciteturn0file3L5-L32

---

### 9. Score
Structured score produced during reasoning.

**Examples**
- inherent risk
- residual risk
- control adequacy
- vendor criticality
- model risk rating

**Required fields**
- `score_id`
- `case_id`
- `score_type`
- `value_num`
- `value_label`
- `scale`
- `method_id`
- `inputs_json`
- `confidence`
- `created_at`

---

### 10. Scenario
A decision-relevant scenario under evaluation.

**Required fields**
- `scenario_id`
- `case_id`
- `name`
- `description`
- `scenario_type`
- `assumptions_json`
- `created_at`

---

### 11. Simulation
Optional quantitative run tied to a scenario or method.

**Required fields**
- `simulation_id`
- `case_id`
- `scenario_id`
- `method_id`
- `simulation_type`
- `version`
- `inputs_json`
- `outputs_json`
- `explainability_json`
- `executed_at`

The architecture makes quant optional but traceable back to claims, evidence, assumptions, and method version. fileciteturn0file3L35-L71

---

### 12. DecisionOption
A candidate outcome before final authorization.

**Examples**
- approve
- approve_with_conditions
- reject
- defer
- escalate
- require_compensating_controls

These outputs align directly with the product brief’s workflow wedges. fileciteturn0file7L1-L52

**Required fields**
- `decision_option_id`
- `case_id`
- `option_type`
- `summary`
- `rationale`
- `conditions_json`
- `expiration_at`
- `recommended_by_actor_id`
- `recommended_by_actor_type`
- `created_at`

---

### 13. Decision
The final governed outcome.

**Required fields**
- `decision_id`
- `case_id`
- `selected_option_id`
- `final_outcome`
- `decision_summary`
- `effective_at`
- `expires_at`
- `renewal_required`
- `status`
- `finalized_by_actor_id`
- `finalized_by_actor_type`
- `finalized_at`

---

### 14. Approval
A human governance action or approval artifact.

**Required fields**
- `approval_id`
- `case_id`
- `decision_id` (nullable until final)
- `approval_type`
- `approver_id`
- `approver_role`
- `outcome`
- `justification`
- `signed_at`
- `quorum_group` (nullable)
- `sod_check_result`

This aligns to the governance layer’s named approvers, overrides, and quorum rules. fileciteturn0file3L75-L109

---

### 15. ReviewTrigger
An object representing re-evaluation conditions.

**Examples**
- stale evidence
- policy change
- model/provider change
- high residual risk threshold crossed
- review date reached

**Required fields**
- `review_trigger_id`
- `case_id`
- `trigger_type`
- `trigger_condition`
- `status`
- `fired_at`
- `resolved_at`
- `notes`

The source architecture explicitly calls out stale evidence, policy changes, and model/provider changes as review triggers. fileciteturn0file3L91-L109

---

### 16. RevisionEvent
A provenance object for material state change.

**Required fields**
- `revision_event_id`
- `case_id`
- `target_type`
- `target_id`
- `previous_state_json`
- `new_state_json`
- `reason`
- `actor_id`
- `actor_type`
- `created_at`

This aligns with the audit/provenance model. fileciteturn0file2L12-L25

---

# 4. Canonical Edge Types

These are the minimum edge verbs for the graph projection layer.

| Edge Type | From | To | Meaning |
|---|---|---|---|
| `involves` | Case | Entity | case materially involves entity |
| `contains` | Case | any node | node belongs to case |
| `supported_by` | Claim / Belief / Score | Evidence | evidence supports object |
| `contradicted_by` | Claim / Belief | Evidence | evidence contradicts object |
| `challenges` | Counterclaim | Claim | explicit challenge |
| `about` | Claim / Evidence / Score | Entity | object concerns entity |
| `derived_from` | Belief / Score / DecisionOption | Claim / Score / Simulation | downstream derivation |
| `revised_by` | Belief / Claim / Decision | RevisionEvent | revision history |
| `tested_by` | DecisionOption / Belief / Case | PolicyTest | policy constraint applied |
| `produces` | Method / Simulation | Score / Claim / Scenario | method produces outputs |
| `evaluates` | Method | Claim / Scenario / Entity | method evaluated target |
| `considers` | DecisionOption | Scenario | option evaluated against scenario |
| `recommends` | actor/service | DecisionOption | recommendation created |
| `selected_as` | DecisionOption | Decision | option chosen as final |
| `approved_by` | Decision | Approval | approval attached |
| `requires` | PolicyTest / DecisionOption | Approval / ReviewTrigger / Entity | mandatory governance condition |
| `subject_to` | Decision / DecisionOption | PolicyTest | constrained by policy |
| `triggers_review` | Evidence / Belief / PolicyTest / Simulation | ReviewTrigger | event creates re-review |

The source architecture lists substantially the same node and edge set. fileciteturn0file4L22-L58

---

# 5. Provenance Chain

This is the required trust chain and should be enforceable at the data model level:

```text
Evidence
→ Claim
→ Belief
→ PolicyTest
→ DecisionOption
→ Final Decision
→ Approval
```

This exact minimum chain comes from the architecture doc. fileciteturn0file2L27-L37

## Mandatory provenance constraints

A `Decision` cannot move to `finalized` unless:
- at least one `DecisionOption` is selected
- at least one linked `PolicyTest` exists
- at least one linked `Claim` exists through the selected option’s chain
- all material claims have supporting or contradicting evidence links
- all required approvals are satisfied
- every material evidence item has freshness metadata

---

# 6. Canonical Relational Schema (Postgres-first)

## 6.1 Core tables

```sql
cases
entities
evidence
claims
counterclaims
beliefs
methods
policy_tests
scores
scenarios
simulations
decision_options
decisions
approvals
review_triggers
revision_events
audit_events
```

This matches the architecture’s recommendation to keep Postgres as system of record and project graph views later. fileciteturn0file3L111-L156

## 6.2 Link tables

Because the graph is relational-first, use explicit edge/link tables rather than a general property graph on day one.

```sql
case_entities
claim_evidence_links
claim_entity_links
belief_support_links
belief_opposition_links
policy_test_subject_links
decision_option_claim_links
decision_option_policy_links
decision_option_scenario_links
decision_approval_links
review_trigger_source_links
prior_case_reference_links
```

## 6.3 Universal graph edge table

Also keep one normalized edge table for traversal and export:

```sql
rdg_edges (
  edge_id uuid pk,
  case_id uuid not null,
  from_type text not null,
  from_id uuid not null,
  edge_type text not null,
  to_type text not null,
  to_id uuid not null,
  attributes_json jsonb,
  created_at timestamptz not null
)
```

This gives you:
- relational integrity for core operations
- graph traversal for visualization and replay
- easy later projection into Neo4j or similar

---

# 7. Canonical Enums

## Case Status
- `draft`
- `submitted`
- `in_review`
- `pending_approval`
- `approved`
- `approved_with_conditions`
- `rejected`
- `deferred`
- `escalated`
- `closed`

## Claim Status
- `proposed`
- `active`
- `challenged`
- `superseded`
- `withdrawn`

## Evidence Freshness State
- `current`
- `aging`
- `stale`
- `expired`
- `unknown`

## Policy Test Result
- `pass`
- `fail`
- `warning`
- `not_applicable`
- `manual_review_required`

## Approval Outcome
- `approved`
- `rejected`
- `abstained`
- `override_approved`
- `exception_granted`

## Review Trigger Status
- `open`
- `fired`
- `suppressed`
- `resolved`

---

# 8. Canonical JSON Shapes

## 8.1 Claim

```json
{
  "claim_id": "uuid",
  "case_id": "uuid",
  "claim_type": "risk_assertion",
  "statement": "Sensitive customer data is sent to an external model provider.",
  "subject_entity_id": "uuid",
  "asserted_by_actor_type": "agent",
  "asserted_by_actor_id": "evidence-agent-01",
  "method_id": "uuid",
  "materiality": "high",
  "status": "active",
  "created_at": "2026-03-09T10:00:00Z"
}
```

## 8.2 Belief

```json
{
  "belief_id": "uuid",
  "case_id": "uuid",
  "subject_claim_id": "uuid",
  "belief_state": "provisionally_accepted",
  "belief_strength": 0.78,
  "uncertainty": 0.19,
  "policy_relevance": "high",
  "last_revised_at": "2026-03-09T10:30:00Z",
  "revision_reason": "DPA missing; evidence from architecture diagram and vendor questionnaire consistent.",
  "computed_by_actor_type": "service",
  "computed_by_actor_id": "belief-service",
  "version_no": 3
}
```

## 8.3 PolicyTest

```json
{
  "policy_test_id": "uuid",
  "case_id": "uuid",
  "policy_id": "ai-policy-7",
  "policy_version": "2026.02",
  "rule_id": "RULE-EXTERNAL-MODEL-SENSITIVE-DATA",
  "name": "Sensitive data with external model requires exception",
  "test_expression": "dataset.classification in ['restricted','confidential'] && model.hosting == 'external'",
  "result": "fail",
  "severity": "high",
  "blocked_outcomes_json": ["approve"],
  "required_escalations_json": ["privacy-review", "security-review"],
  "executed_at": "2026-03-09T10:45:00Z",
  "explanation": "Restricted data and external hosted model detected."
}
```

## 8.4 DecisionOption

```json
{
  "decision_option_id": "uuid",
  "case_id": "uuid",
  "option_type": "approve_with_conditions",
  "summary": "Approve only if restricted fields are removed and human review remains mandatory.",
  "rationale": "Policy exception avoided if data minimization control is implemented.",
  "conditions_json": [
    "Remove restricted fields before inference",
    "Log all prompts and outputs",
    "Quarterly re-review"
  ],
  "expiration_at": "2027-03-09T00:00:00Z",
  "recommended_by_actor_type": "agent",
  "recommended_by_actor_id": "decision-synthesis-agent",
  "created_at": "2026-03-09T11:00:00Z"
}
```

## 8.5 Decision

```json
{
  "decision_id": "uuid",
  "case_id": "uuid",
  "selected_option_id": "uuid",
  "final_outcome": "approved_with_conditions",
  "decision_summary": "Approved subject to data minimization and quarterly review.",
  "effective_at": "2026-03-09T12:00:00Z",
  "expires_at": "2027-03-09T00:00:00Z",
  "renewal_required": true,
  "status": "finalized",
  "finalized_by_actor_type": "user",
  "finalized_by_actor_id": "approver-123",
  "finalized_at": "2026-03-09T12:03:00Z"
}
```

---

# 9. Belief Revision Model

The docs identify belief revision as core but do not fully formalize it. This section closes that gap while staying consistent with the source direction. The architecture explicitly says new evidence should update claims, re-evaluate beliefs, re-run policy tests, and re-evaluate options. fileciteturn0file4L109-L122

## 9.1 Canonical belief formula

Use a simple v1 governed scoring model:

```text
belief_strength =
  weighted_support
  - weighted_opposition
  + source_quality_adjustment
  + method_confidence_adjustment
```

Then clamp to `[0.0, 1.0]`.

## 9.2 Uncertainty formula

```text
uncertainty =
  1 - evidence_coverage_score
      * source_diversity_score
      * freshness_score
```

## 9.3 State transitions

| Condition | Resulting Belief State |
|---|---|
| no material evidence | `unknown` |
| some evidence, active review | `under_review` |
| moderate support, high uncertainty | `plausible` |
| strong support, unresolved challenge | `provisionally_accepted` |
| strong support, policy relevant, low uncertainty | `accepted` |
| substantial conflicting evidence | `contested` |
| inadequate evidence quality | `insufficient_evidence` |
| strong opposing evidence | `rejected` |
| support exists but evidence expired | `stale` |
| replaced by newer claim or belief | `superseded` |

This is practical enough for MVP and avoids fake precision.

---

# 10. Governance Constraints

These constraints should be implemented as database checks and service-layer rules.

## 10.1 Finalization constraints
A case cannot finalize without:
- named approver
- policy version reference
- evidence trace for recommendation
- no silent override
- no expired evidence in high-risk cases

These are directly drawn from the architecture. fileciteturn0file3L101-L109 fileciteturn0file5L1-L7

## 10.2 Override object
Use a structured override record:

```json
{
  "override_id": "uuid",
  "case_id": "uuid",
  "decision_id": "uuid",
  "overridden_rule_ids": ["RULE-123"],
  "override_reason": "Critical business continuity requirement.",
  "approved_by": "approver-789",
  "approved_at": "2026-03-09T12:05:00Z"
}
```

## 10.3 Review triggers
Auto-create triggers when:
- evidence becomes stale
- policy version changes
- model/provider/config changes
- risk threshold crosses escalation boundary
- scheduled review date arrives

---

# 11. Canonical Audit Event Schema

The architecture already defines the minimum material action log. Use it exactly. fileciteturn0file2L12-L25

```json
{
  "event_id": "uuid",
  "case_id": "uuid",
  "actor_type": "agent",
  "actor_id": "claims-agent-01",
  "action_type": "belief_revised",
  "target_type": "belief",
  "target_id": "uuid",
  "previous_state": {"belief_state": "plausible", "belief_strength": 0.54},
  "new_state": {"belief_state": "accepted", "belief_strength": 0.82},
  "timestamp": "2026-03-09T10:31:00Z",
  "justification": "Supporting evidence quality improved after vendor contract upload.",
  "related_sources": ["evidence-uuid-1", "evidence-uuid-2"]
}
```

---

# 12. Canonical API Resource Model

The architecture already proposes the right API family. Keep it. fileciteturn0file5L129-L161

## Core resources
- `/cases`
- `/cases/{id}/entities`
- `/cases/{id}/claims`
- `/cases/{id}/claims/{claim_id}/challenge`
- `/cases/{id}/evidence`
- `/cases/{id}/beliefs`
- `/cases/{id}/policy-tests`
- `/cases/{id}/quant-models`
- `/cases/{id}/simulations`
- `/cases/{id}/decision-options`
- `/cases/{id}/decision`
- `/cases/{id}/approvals`
- `/cases/{id}/review-triggers`
- `/cases/{id}/audit-events`
- `/cases/{id}/export/decision-memo`
- `/cases/{id}/export/reasoning-chain`
- `/cases/{id}/export/audit-package`

---

# 13. Minimal MVP Schema Cut

Do not implement the full graph on day one.

## MVP required tables
```sql
cases
entities
evidence
claims
beliefs
policy_tests
decision_options
decisions
approvals
review_triggers
audit_events
```

## MVP deferred
```sql
counterclaims
scenarios
simulations
scores
prior_case_reference_links
```

This respects the architecture’s phased build sequence. fileciteturn0file2L90-L123

---

# 14. Recommended Physical Storage Split

## Postgres
System of record for:
- cases
- workflow state
- graph nodes
- graph edges
- approvals
- audit events

## Object storage
Store:
- source documents
- diagrams
- screenshots
- contracts
- policy files
- memo exports

## Optional graph projection
Use later for:
- visual traversal
- replay path views
- dependency analysis
- cross-case pattern exploration

This is consistent with the architecture’s recommended storage pattern. fileciteturn0file3L111-L156

---

# 15. Final Canonical Definition

The **canonical Risk Decision Graph schema** is:

> A case-bound, provenance-preserving, policy-aware graph of entities, evidence, claims, beliefs, policy tests, optional quantitative analysis, decision options, final decisions, approvals, and review triggers, stored Postgres-first and replayable end-to-end.

That is the right system-of-record definition for DecisionOS.

---

# 16. Bottom Line

The schema should be implemented around one non-negotiable chain:

```text
Case
→ Entity / Evidence / Claim capture
→ Belief revision
→ Policy evaluation
→ Decision option generation
→ Human approval
→ Final decision
→ Replay / audit / review trigger
```

That is the canonical RDG.

The most important modeling choice is still this:

```text
Claim ≠ Belief ≠ Decision
```

If that separation stays clean, the platform stays defensible.
