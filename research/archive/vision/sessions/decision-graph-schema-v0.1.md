# Decision Graph Schema
## JSON + Database Schema v0.1

## Purpose

This document defines the **core Decision Graph schema** for a decision intelligence platform used in:

- security architecture review
- AI governance review
- vendor risk decisions
- policy exceptions
- risk acceptance workflows

The schema is designed to support:

- structured reasoning
- evidence traceability
- replayable decisions
- human approvals
- multi-workflow reuse
- long-term decision intelligence

This is the **core primitive** of the platform.

---

# 1. Design Principles

## 1.1 Case-centric

Every Decision Graph belongs to a single **Decision Case**.

## 1.2 Structured, not prose-first

LLM output should be converted into structured objects.

## 1.3 Evidence-linked

Every meaningful claim or recommendation should link to supporting or contradicting evidence.

## 1.4 Method-aware

Every graph must record the methodology and version used.

## 1.5 Human-governed

Recommendations are not final decisions until approved, overridden, or escalated by a human.

## 1.6 Workflow-agnostic

The same graph model should support multiple decision workflows.

---

# 2. Core Object Model

A Decision Graph contains these primary object types:

- Case
- Entity
- Relationship
- Claim
- Evidence
- Score
- Scenario
- Recommendation
- Approval
- Decision Artifact
- Audit Event

---

# 3. JSON Schema Structure

At the highest level, a Decision Graph document can be represented like this:

```json
{
  "graph_id": "dg_01HXYZ123ABC",
  "tenant_id": "tenant_001",
  "case": {},
  "entities": [],
  "relationships": [],
  "claims": [],
  "evidence": [],
  "scores": [],
  "scenarios": [],
  "recommendations": [],
  "approvals": [],
  "decision_artifact": {},
  "audit_events": [],
  "metadata": {}
}
```

---

# 4. JSON Schema Definitions

## 4.1 Case

The root decision object.

```json
{
  "case_id": "case_01HXYZ123ABC",
  "case_type": "security_architecture_review",
  "title": "Review customer analytics platform",
  "status": "in_review",
  "priority": "high",
  "submitted_by": "user_123",
  "business_owner": "user_456",
  "risk_owner": "user_789",
  "created_at": "2026-03-09T10:00:00Z",
  "updated_at": "2026-03-09T10:30:00Z",
  "workflow_version": "architecture-review-v1",
  "methodology_version": "sar-method-v1.0",
  "tags": [
    "cloud",
    "customer-data",
    "third-party"
  ]
}
```

### Required fields

- case_id
- case_type
- title
- status
- created_at
- methodology_version

### Suggested enum: case_type

- security_architecture_review
- ai_governance_review
- vendor_risk_review
- policy_exception
- risk_acceptance

### Suggested enum: status

- draft
- submitted
- in_review
- awaiting_evidence
- awaiting_approval
- approved
- approved_with_conditions
- rejected
- escalated
- archived

---

## 4.2 Entity

Entities are the real-world things involved in the decision.

```json
{
  "entity_id": "ent_001",
  "entity_type": "System",
  "name": "Customer Analytics Platform",
  "description": "Cloud analytics platform for customer behavior data",
  "attributes": {
    "environment": "aws",
    "internet_exposed": true,
    "contains_sensitive_data": true
  },
  "source": "intake_parser",
  "created_at": "2026-03-09T10:01:00Z"
}
```

### Common entity_type values

- System
- Application
- API
- Dataset
- DataStore
- Vendor
- Model
- Integration
- Threat
- Risk
- Control
- Policy
- Standard
- Requirement
- Regulation
- TrustBoundary
- UserRole
- ScenarioObject

---

## 4.3 Relationship

Relationships define graph edges.

```json
{
  "relationship_id": "rel_001",
  "from_entity_id": "ent_001",
  "to_entity_id": "ent_002",
  "relationship_type": "transfers_to",
  "attributes": {
    "encrypted": false
  },
  "created_at": "2026-03-09T10:02:00Z"
}
```

### Common relationship_type values

- uses
- stores
- processes
- transfers_to
- depends_on
- integrates_with
- exposed_to
- mitigated_by
- governed_by
- required_by
- owned_by
- located_in
- crosses
- supports
- contradicts
- derived_from
- recommends
- approved_by

---

## 4.4 Claim

A Claim is an assertion created during reasoning.

```json
{
  "claim_id": "claim_001",
  "claim_type": "risk_assertion",
  "statement": "Customer behavior data may be exposed to a third-party analytics provider without encryption.",
  "status": "supported",
  "confidence": 0.84,
  "materiality": "high",
  "created_by": "control-evaluator",
  "created_at": "2026-03-09T10:05:00Z",
  "related_entity_ids": [
    "ent_001",
    "ent_010"
  ]
}
```

### Suggested enum: claim_type

- fact_assertion
- risk_assertion
- control_assertion
- compliance_assertion
- assumption
- counterargument
- decision_assertion

### Suggested enum: status

- proposed
- supported
- challenged
- accepted
- rejected
- superseded

---

## 4.5 Evidence

Evidence supports or contradicts claims.

```json
{
  "evidence_id": "evid_001",
  "evidence_type": "architecture_document",
  "source_type": "upload",
  "source_ref": "file_abc123",
  "locator": "diagram page 1",
  "summary": "Diagram shows outbound connection to third-party analytics API.",
  "trust_level": "high",
  "freshness": "current",
  "collected_by": "intake_parser",
  "created_at": "2026-03-09T10:04:00Z"
}
```

### Common evidence_type values

- architecture_document
- policy_reference
- standard_reference
- questionnaire_response
- contract_clause
- human_attestation
- telemetry_snapshot
- calculation_result
- prior_decision_reference

### Common trust_level values

- low
- medium
- high

---

## 4.6 Score

Scores capture quantitative or semi-quantitative reasoning.

```json
{
  "score_id": "score_001",
  "score_type": "residual_risk",
  "label": "high",
  "value_numeric": 0.72,
  "scale": "0_to_1",
  "method": "risk-scoring-v1",
  "derived_from_claim_ids": [
    "claim_001",
    "claim_002"
  ],
  "derived_from_evidence_ids": [
    "evid_001"
  ],
  "created_by": "risk-scorer",
  "created_at": "2026-03-09T10:10:00Z"
}
```

### Common score_type values

- inherent_risk
- control_effectiveness
- likelihood
- impact
- residual_risk
- compliance_severity
- confidence
- uncertainty
- financial_exposure

---

## 4.7 Scenario

Scenarios represent alternative configurations or decision branches.

```json
{
  "scenario_id": "scn_001",
  "name": "Current architecture without encryption",
  "description": "Baseline design as submitted",
  "status": "evaluated",
  "assumption_claim_ids": [
    "claim_010"
  ],
  "score_ids": [
    "score_001"
  ],
  "created_at": "2026-03-09T10:12:00Z"
}
```

### Suggested enum: status

- proposed
- evaluated
- selected
- rejected

---

## 4.8 Recommendation

System-generated recommendation before human approval.

```json
{
  "recommendation_id": "rec_001",
  "recommendation_type": "approval_decision",
  "outcome": "approve_with_conditions",
  "summary": "Approve only if encryption is added for third-party transfers and least privilege IAM is enforced.",
  "condition_list": [
    "Enable encryption for outbound data transfers",
    "Restrict IAM permissions for analytics service role"
  ],
  "supporting_claim_ids": [
    "claim_003",
    "claim_004"
  ],
  "score_ids": [
    "score_004"
  ],
  "created_by": "decision-synthesizer",
  "created_at": "2026-03-09T10:15:00Z"
}
```

### Suggested enum: outcome

- approve
- approve_with_conditions
- reject
- escalate
- defer_pending_evidence
- grant_exception

---

## 4.9 Approval

Human governance action.

```json
{
  "approval_id": "appr_001",
  "approval_role": "Security Architect",
  "actor_id": "user_789",
  "action": "approved_with_conditions",
  "notes": "Conditions are required before production release.",
  "recommendation_id": "rec_001",
  "created_at": "2026-03-09T10:20:00Z"
}
```

### Suggested enum: action

- approved
- approved_with_conditions
- rejected
- escalated
- overridden

---

## 4.10 Decision Artifact

Final canonical decision record.

```json
{
  "decision_artifact_id": "da_001",
  "final_outcome": "approved_with_conditions",
  "final_summary": "Architecture approved subject to encryption and IAM remediation.",
  "effective_date": "2026-03-09",
  "review_due_date": "2026-09-09",
  "recommendation_id": "rec_001",
  "approval_ids": [
    "appr_001"
  ],
  "export_refs": [
    "report_md_001",
    "report_pdf_001"
  ],
  "created_at": "2026-03-09T10:22:00Z"
}
```

---

## 4.11 Audit Event

Immutable log of important system activity.

```json
{
  "audit_event_id": "audit_001",
  "event_type": "claim_created",
  "actor_type": "agent",
  "actor_id": "threat-modeler",
  "target_type": "claim",
  "target_id": "claim_001",
  "timestamp": "2026-03-09T10:05:00Z",
  "details": {
    "reason": "Threat model identified outbound data exposure"
  }
}
```

### Common event_type values

- case_created
- entity_created
- relationship_created
- claim_created
- evidence_attached
- score_created
- scenario_evaluated
- recommendation_created
- approval_recorded
- decision_finalized
- methodology_changed

---

# 5. Full Example Decision Graph JSON

```json
{
  "graph_id": "dg_001",
  "tenant_id": "tenant_001",
  "case": {
    "case_id": "case_001",
    "case_type": "security_architecture_review",
    "title": "Review customer analytics platform",
    "status": "approved_with_conditions",
    "created_at": "2026-03-09T10:00:00Z",
    "updated_at": "2026-03-09T10:22:00Z",
    "methodology_version": "sar-method-v1.0"
  },
  "entities": [
    {
      "entity_id": "ent_sys_001",
      "entity_type": "System",
      "name": "Customer Analytics Platform",
      "attributes": {
        "environment": "aws"
      }
    },
    {
      "entity_id": "ent_vendor_001",
      "entity_type": "Vendor",
      "name": "Third-Party Analytics Provider",
      "attributes": {}
    }
  ],
  "relationships": [
    {
      "relationship_id": "rel_001",
      "from_entity_id": "ent_sys_001",
      "to_entity_id": "ent_vendor_001",
      "relationship_type": "transfers_to",
      "attributes": {
        "encrypted": false
      }
    }
  ],
  "claims": [
    {
      "claim_id": "claim_001",
      "claim_type": "risk_assertion",
      "statement": "Sensitive customer data may be transferred without encryption.",
      "status": "supported",
      "confidence": 0.88
    }
  ],
  "evidence": [
    {
      "evidence_id": "evid_001",
      "evidence_type": "architecture_document",
      "summary": "Diagram shows outbound connection to vendor API without encryption note.",
      "trust_level": "high"
    }
  ],
  "scores": [
    {
      "score_id": "score_001",
      "score_type": "residual_risk",
      "label": "high",
      "value_numeric": 0.72
    }
  ],
  "scenarios": [],
  "recommendations": [
    {
      "recommendation_id": "rec_001",
      "outcome": "approve_with_conditions",
      "summary": "Approve only after encryption and IAM remediation."
    }
  ],
  "approvals": [
    {
      "approval_id": "appr_001",
      "approval_role": "Security Architect",
      "action": "approved_with_conditions"
    }
  ],
  "decision_artifact": {
    "decision_artifact_id": "da_001",
    "final_outcome": "approved_with_conditions",
    "final_summary": "Approved subject to remediation."
  },
  "audit_events": [
    {
      "audit_event_id": "audit_001",
      "event_type": "case_created"
    }
  ],
  "metadata": {
    "schema_version": "0.1"
  }
}
```

---

# 6. Relational Database Schema

The recommended first implementation is **PostgreSQL**.

This schema is designed for a **modular monolith** and can later evolve into service-specific schemas if needed.

---

## 6.1 Table: tenants

```sql
CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 6.2 Table: cases

```sql
CREATE TABLE cases (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id),
    case_type TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT,
    submitted_by TEXT,
    business_owner TEXT,
    risk_owner TEXT,
    workflow_version TEXT,
    methodology_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_cases_tenant_id ON cases(tenant_id);
CREATE INDEX idx_cases_case_type ON cases(case_type);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at);
```

---

## 6.3 Table: case_tags

```sql
CREATE TABLE case_tags (
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (case_id, tag)
);
```

---

## 6.4 Table: entities

```sql
CREATE TABLE entities (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_entities_case_id ON entities(case_id);
CREATE INDEX idx_entities_entity_type ON entities(entity_type);
CREATE INDEX idx_entities_attributes_gin ON entities USING GIN(attributes);
```

---

## 6.5 Table: relationships

```sql
CREATE TABLE relationships (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    from_entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    to_entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_relationships_case_id ON relationships(case_id);
CREATE INDEX idx_relationships_from_entity_id ON relationships(from_entity_id);
CREATE INDEX idx_relationships_to_entity_id ON relationships(to_entity_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);
```

---

## 6.6 Table: claims

```sql
CREATE TABLE claims (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    claim_type TEXT NOT NULL,
    statement TEXT NOT NULL,
    status TEXT NOT NULL,
    confidence NUMERIC(5,4),
    materiality TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    superseded_by_claim_id TEXT REFERENCES claims(id)
);
```

### Indexes

```sql
CREATE INDEX idx_claims_case_id ON claims(case_id);
CREATE INDEX idx_claims_claim_type ON claims(claim_type);
CREATE INDEX idx_claims_status ON claims(status);
```

---

## 6.7 Table: claim_entities

Many-to-many link between claims and entities.

```sql
CREATE TABLE claim_entities (
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    PRIMARY KEY (claim_id, entity_id)
);
```

---

## 6.8 Table: evidence

```sql
CREATE TABLE evidence (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_ref TEXT,
    locator TEXT,
    summary TEXT NOT NULL,
    trust_level TEXT,
    freshness TEXT,
    collected_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_evidence_type ON evidence(evidence_type);
CREATE INDEX idx_evidence_source_type ON evidence(source_type);
```

---

## 6.9 Table: claim_evidence_links

Links claims to evidence with support direction.

```sql
CREATE TABLE claim_evidence_links (
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    evidence_id TEXT NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    link_type TEXT NOT NULL,
    PRIMARY KEY (claim_id, evidence_id, link_type)
);
```

### Suggested link_type values

- supports
- contradicts
- informs

---

## 6.10 Table: scores

```sql
CREATE TABLE scores (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    score_type TEXT NOT NULL,
    label TEXT,
    value_numeric NUMERIC(10,4),
    scale TEXT,
    method TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_scores_case_id ON scores(case_id);
CREATE INDEX idx_scores_type ON scores(score_type);
```

---

## 6.11 Table: score_claim_links

```sql
CREATE TABLE score_claim_links (
    score_id TEXT NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    PRIMARY KEY (score_id, claim_id)
);
```

---

## 6.12 Table: score_evidence_links

```sql
CREATE TABLE score_evidence_links (
    score_id TEXT NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
    evidence_id TEXT NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    PRIMARY KEY (score_id, evidence_id)
);
```

---

## 6.13 Table: scenarios

```sql
CREATE TABLE scenarios (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_scenarios_case_id ON scenarios(case_id);
CREATE INDEX idx_scenarios_status ON scenarios(status);
```

---

## 6.14 Table: scenario_claim_links

```sql
CREATE TABLE scenario_claim_links (
    scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    link_type TEXT NOT NULL,
    PRIMARY KEY (scenario_id, claim_id, link_type)
);
```

### Suggested link_type values

- assumes
- tests
- challenges

---

## 6.15 Table: scenario_score_links

```sql
CREATE TABLE scenario_score_links (
    scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    score_id TEXT NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
    PRIMARY KEY (scenario_id, score_id)
);
```

---

## 6.16 Table: recommendations

```sql
CREATE TABLE recommendations (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    outcome TEXT NOT NULL,
    summary TEXT NOT NULL,
    condition_list JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_recommendations_case_id ON recommendations(case_id);
CREATE INDEX idx_recommendations_outcome ON recommendations(outcome);
```

---

## 6.17 Table: recommendation_claim_links

```sql
CREATE TABLE recommendation_claim_links (
    recommendation_id TEXT NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    PRIMARY KEY (recommendation_id, claim_id)
);
```

---

## 6.18 Table: recommendation_score_links

```sql
CREATE TABLE recommendation_score_links (
    recommendation_id TEXT NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    score_id TEXT NOT NULL REFERENCES scores(id) ON DELETE CASCADE,
    PRIMARY KEY (recommendation_id, score_id)
);
```

---

## 6.19 Table: approvals

```sql
CREATE TABLE approvals (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    recommendation_id TEXT REFERENCES recommendations(id) ON DELETE SET NULL,
    approval_role TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_approvals_case_id ON approvals(case_id);
CREATE INDEX idx_approvals_action ON approvals(action);
CREATE INDEX idx_approvals_actor_id ON approvals(actor_id);
```

---

## 6.20 Table: decision_artifacts

```sql
CREATE TABLE decision_artifacts (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
    final_outcome TEXT NOT NULL,
    final_summary TEXT NOT NULL,
    effective_date DATE,
    review_due_date DATE,
    recommendation_id TEXT REFERENCES recommendations(id) ON DELETE SET NULL,
    export_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 6.21 Table: audit_events

```sql
CREATE TABLE audit_events (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    actor_type TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_audit_events_case_id ON audit_events(case_id);
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at);
CREATE INDEX idx_audit_events_details_gin ON audit_events USING GIN(details);
```

---

# 7. Recommended Constraints and Validation Rules

## Case-level rules

- A case may have many recommendations, but only one final decision artifact.
- A decision artifact should not exist until at least one approval or explicit override exists.
- All records must belong to the same case.

## Claim rules

- Claims should not be deleted after use; prefer status transitions.
- Superseded claims should reference the newer claim.

## Evidence rules

- Evidence should remain immutable after creation except for metadata correction.

## Score rules

- Scores should record the method used.
- If a score is recalculated, create a new score row rather than mutating the original in place.

## Approval rules

- Approvals are append-only.
- Overrides should be captured as separate approval actions, not edits.

---

# 8. Suggested JSON Schema Validation Notes

At the application layer, validate:

- required IDs are present
- confidence values are between 0 and 1
- score numeric values match expected scale
- enums are enforced where practical
- all linked IDs exist in the same graph
- timestamps use ISO 8601 UTC format

---

# 9. Suggested Evolution Path

## v0.1

- PostgreSQL only
- JSON export/import
- modular monolith
- one or two case types

## v0.2

- add pgvector for retrieval
- add policy package version tables
- add report templates
- add graph traversal helper queries

## v0.3

- add cross-case analytics views
- add scenario comparison functions
- add policy simulation tables

## v1.0

- optional dedicated graph DB
- workflow-specific methodology packs
- multi-tenant analytics
- advanced governance simulation

---

# 10. Direct Recommendation

Use this schema in practice as:

- **PostgreSQL for persistence**
- **JSON objects for agent/module interchange**
- **append-only audit and approval patterns**
- **structured links instead of unstructured prose**

That gives you:

- fast implementation
- strong traceability
- workflow reuse
- upgrade path to a full decision intelligence platform

This is the right foundation.
