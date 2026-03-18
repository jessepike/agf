# Seed SQL + One Full AI Use Case Review Test Case
## DecisionOS / Agentic Risk Operating System

This artifact provides:

1. **seed SQL** for a realistic AI Use Case Review case
2. **one full end-to-end test case**
3. a data path that exercises the canonical RDG v0.1 schema

The scenario is intentionally simple but complete enough to validate:

- case creation
- entity registration
- evidence capture
- claim creation
- belief formation
- policy testing
- decision option generation
- approval capture
- final decision issuance
- review scheduling
- audit logging

---

# 1. Test Case Summary

## Scenario

A business unit wants to deploy an **external LLM-based customer support assistant**.

### Proposed use
- summarize support tickets
- draft suggested responses for agents
- retrieve internal KB content
- operate in a human-in-the-loop workflow

### Material risks
- customer PII may appear in prompts
- data may be sent to an external model provider
- prompt/output logging may create retention risk
- hallucinated answers could mislead agents
- vendor DPA and data residency terms must be validated

### Expected outcome
This case should result in:

```text
approved_with_conditions
```

### Required conditions
- restricted fields removed before inference
- prompts/outputs logged under retention controls
- human review required before outbound response
- vendor DPA executed
- quarterly re-review scheduled

---

# 2. Seed SQL Assumptions

This seed assumes the **RDG Postgres DDL v0.1** already exists.

It uses deterministic UUIDs for readability.

If your environment enforces stricter foreign keys or actor registries later, adapt IDs accordingly.

---

# 3. Seed SQL

```sql
-- =========================================================
-- Seed SQL: AI Use Case Review
-- =========================================================

begin;

-- ---------------------------------------------------------
-- CASE
-- ---------------------------------------------------------
insert into cases (
  case_id,
  case_type,
  title,
  description,
  status,
  risk_domain,
  workflow_template_id,
  priority,
  requestor_id,
  owner_id,
  retention_class,
  submitted_at
) values (
  '11111111-1111-1111-1111-111111111111',
  'ai_use_case_review',
  'AI Support Copilot for Customer Success',
  'Review of an external LLM-based assistant used to summarize support tickets and draft agent responses.',
  'in_review',
  'ai_governance',
  'wf-ai-usecase-v1',
  2,
  'user-bu-cs-001',
  'owner-ai-governance-001',
  'regulated',
  '2026-03-09T16:00:00Z'
);

-- ---------------------------------------------------------
-- ENTITIES
-- ---------------------------------------------------------
insert into entities (
  entity_id, case_id, entity_type, name, external_ref, criticality, classification, owner_id, source_system, attributes_json
) values
(
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'application',
  'Support Copilot',
  'APP-001',
  'high',
  'internal',
  'owner-cs-platform-001',
  'service_catalog',
  '{"business_unit":"Customer Success","channel":"support"}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'dataset',
  'Customer Support Tickets',
  'DATA-001',
  'critical',
  'confidential',
  'owner-data-platform-001',
  'data_catalog',
  '{"contains":["customer_name","email","ticket_text","account_notes"]}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222223',
  '11111111-1111-1111-1111-111111111111',
  'vendor',
  'Acme LLM Cloud',
  'VEND-001',
  'high',
  'third_party',
  'owner-vrm-001',
  'vrm',
  '{"hosting":"external","region":"us","subprocessors":true}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222224',
  '11111111-1111-1111-1111-111111111111',
  'model',
  'Acme GPT Enterprise',
  'MODEL-001',
  'high',
  'external_model',
  'owner-ai-platform-001',
  'model_registry',
  '{"provider":"Acme LLM Cloud","deployment":"vendor_managed"}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222225',
  '11111111-1111-1111-1111-111111111111',
  'control',
  'PII Redaction Gateway',
  'CTRL-001',
  'high',
  'security_control',
  'owner-security-eng-001',
  'control_library',
  '{"mode":"pre-inference","coverage":"ticket payload"}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222226',
  '11111111-1111-1111-1111-111111111111',
  'policy',
  'AI Data Handling Standard',
  'POL-001',
  'critical',
  'policy',
  'owner-policy-001',
  'policy_repo',
  '{"version":"2026.02"}'::jsonb
);

-- ---------------------------------------------------------
-- EVIDENCE
-- ---------------------------------------------------------
insert into evidence (
  evidence_id, case_id, evidence_type, title, source_type, source_uri, source_hash,
  captured_at, effective_at, expires_at, freshness_state, confidence,
  access_classification, extracted_text_ref, metadata_json
) values
(
  '33333333-3333-3333-3333-333333333331',
  '11111111-1111-1111-1111-111111111111',
  'architecture_diagram',
  'Support Copilot Architecture Diagram',
  'uploaded_file',
  's3://decisionos/evidence/case-111/architecture-diagram-v1.pdf',
  'hash-arch-001',
  '2026-03-09T16:05:00Z',
  '2026-03-09T16:05:00Z',
  '2026-09-09T00:00:00Z',
  'current',
  0.92,
  'internal',
  'obj://extract/arch-001',
  '{"reviewer":"security_architecture","version":"1.0"}'::jsonb
),
(
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  'vendor_questionnaire',
  'Vendor Security Questionnaire',
  'vrm_record',
  'vrm://vendor/VEND-001/questionnaire/2026-q1',
  'hash-vrq-001',
  '2026-03-09T16:07:00Z',
  '2026-03-01T00:00:00Z',
  '2026-06-30T00:00:00Z',
  'current',
  0.85,
  'confidential',
  'obj://extract/vrq-001',
  '{"reviewer":"third_party_risk","attestation":"self_reported"}'::jsonb
),
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'dpa_status',
  'Vendor DPA Status',
  'legal_record',
  'legal://contracts/VEND-001/dpa',
  'hash-dpa-001',
  '2026-03-09T16:10:00Z',
  '2026-03-09T16:10:00Z',
  '2026-12-31T00:00:00Z',
  'current',
  0.98,
  'restricted',
  'obj://extract/dpa-001',
  '{"status":"pending_signature"}'::jsonb
),
(
  '33333333-3333-3333-3333-333333333334',
  '11111111-1111-1111-1111-111111111111',
  'control_design',
  'PII Redaction Gateway Control Design',
  'control_repo',
  'controls://CTRL-001/design',
  'hash-ctrl-001',
  '2026-03-09T16:12:00Z',
  '2026-03-09T16:12:00Z',
  '2026-09-30T00:00:00Z',
  'current',
  0.90,
  'internal',
  'obj://extract/ctrl-001',
  '{"status":"designed_not_validated"}'::jsonb
),
(
  '33333333-3333-3333-3333-333333333335',
  '11111111-1111-1111-1111-111111111111',
  'test_result',
  'Prompt Logging Retention Review',
  'privacy_review',
  'privacy://reviews/logging/ai-support-copilot',
  'hash-priv-001',
  '2026-03-09T16:14:00Z',
  '2026-03-09T16:14:00Z',
  '2026-06-09T00:00:00Z',
  'current',
  0.88,
  'confidential',
  'obj://extract/priv-001',
  '{"finding":"retention controls required"}'::jsonb
);

-- ---------------------------------------------------------
-- METHODS
-- ---------------------------------------------------------
insert into methods (
  method_id, case_id, method_type, name, version, parameters_json, applied_scope
) values
(
  '44444444-4444-4444-4444-444444444441',
  '11111111-1111-1111-1111-111111111111',
  'ai_governance_rubric',
  'AI Use Case Review Rubric',
  '2026.02',
  '{"dimensions":["data_sensitivity","external_hosting","human_oversight","vendor_terms"]}'::jsonb,
  'case'
),
(
  '44444444-4444-4444-4444-444444444442',
  '11111111-1111-1111-1111-111111111111',
  'policy_evaluation',
  'AI Policy Evaluation',
  '2026.02',
  '{"strict_mode":true}'::jsonb,
  'case'
);

-- ---------------------------------------------------------
-- CLAIMS
-- ---------------------------------------------------------
insert into claims (
  claim_id, case_id, claim_type, statement, subject_entity_id, object_entity_id,
  asserted_by_actor_id, asserted_by_actor_type, method_ref, materiality, status
) values
(
  '55555555-5555-5555-5555-555555555551',
  '11111111-1111-1111-1111-111111111111',
  'data_flow_assertion',
  'Customer support ticket data is transmitted to an external model provider during inference.',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222224',
  'evidence-agent-01',
  'agent',
  'AI Use Case Review Rubric v2026.02',
  'critical',
  'active'
),
(
  '55555555-5555-5555-5555-555555555552',
  '11111111-1111-1111-1111-111111111111',
  'control_assertion',
  'A PII redaction control exists and can remove restricted fields before prompt transmission.',
  '22222222-2222-2222-2222-222222222225',
  '22222222-2222-2222-2222-222222222222',
  'controls-agent-01',
  'agent',
  'AI Use Case Review Rubric v2026.02',
  'high',
  'active'
),
(
  '55555555-5555-5555-5555-555555555553',
  '11111111-1111-1111-1111-111111111111',
  'legal_assertion',
  'The vendor DPA is not yet fully executed.',
  '22222222-2222-2222-2222-222222222223',
  null,
  'legal-reviewer-01',
  'user',
  'contract_review',
  'critical',
  'active'
),
(
  '55555555-5555-5555-5555-555555555554',
  '11111111-1111-1111-1111-111111111111',
  'operational_assertion',
  'All outbound responses remain human-reviewed before delivery to the customer.',
  '22222222-2222-2222-2222-222222222221',
  null,
  'workflow-agent-01',
  'agent',
  'workflow_review',
  'high',
  'active'
),
(
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'privacy_assertion',
  'Prompt and output logging requires explicit retention controls.',
  '22222222-2222-2222-2222-222222222221',
  null,
  'privacy-reviewer-01',
  'user',
  'privacy_review',
  'high',
  'active'
);

-- ---------------------------------------------------------
-- COUNTERCLAIM
-- ---------------------------------------------------------
insert into counterclaims (
  counterclaim_id, case_id, target_claim_id, statement,
  asserted_by_actor_id, asserted_by_actor_type, status
) values
(
  '56666666-6666-6666-6666-666666666661',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555552',
  'The PII redaction control is designed but not yet operationally validated in production.',
  'challenger-agent-01',
  'agent',
  'active'
);

-- ---------------------------------------------------------
-- CLAIM ↔ EVIDENCE LINKS
-- ---------------------------------------------------------
insert into claim_evidence_links (claim_id, evidence_id, relationship_type, material) values
('55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333331', 'supported_by', true),
('55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333332', 'supported_by', true),
('55555555-5555-5555-5555-555555555552', '33333333-3333-3333-3333-333333333334', 'supported_by', true),
('55555555-5555-5555-5555-555555555553', '33333333-3333-3333-3333-333333333333', 'supported_by', true),
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333335', 'supported_by', true),
('55555555-5555-5555-5555-555555555552', '33333333-3333-3333-3333-333333333334', 'referenced_by', false);

-- ---------------------------------------------------------
-- CLAIM ↔ ENTITY LINKS
-- ---------------------------------------------------------
insert into claim_entity_links (claim_id, entity_id, relationship_type) values
('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222222', 'about'),
('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222224', 'about'),
('55555555-5555-5555-5555-555555555552', '22222222-2222-2222-2222-222222222225', 'controls'),
('55555555-5555-5555-5555-555555555553', '22222222-2222-2222-2222-222222222223', 'about'),
('55555555-5555-5555-5555-555555555554', '22222222-2222-2222-2222-222222222221', 'about'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222221', 'about');

-- ---------------------------------------------------------
-- BELIEFS
-- ---------------------------------------------------------
insert into beliefs (
  belief_id, case_id, subject_claim_id, belief_state, belief_strength, uncertainty,
  policy_relevance, supporting_claims, opposing_claims, supporting_evidence,
  last_revised_at, revision_reason, computed_by_actor_id, computed_by_actor_type, version_no
) values
(
  '66666666-6666-6666-6666-666666666661',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555551',
  'accepted',
  0.93,
  0.08,
  'critical',
  '[]'::jsonb,
  '[]'::jsonb,
  '["33333333-3333-3333-3333-333333333331","33333333-3333-3333-3333-333333333332"]'::jsonb,
  '2026-03-09T16:20:00Z',
  'Architecture and vendor evidence consistently indicate external inference processing.',
  'belief-service',
  'service',
  1
),
(
  '66666666-6666-6666-6666-666666666662',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555552',
  'provisionally_accepted',
  0.71,
  0.26,
  'high',
  '[]'::jsonb,
  '["56666666-6666-6666-6666-666666666661"]'::jsonb,
  '["33333333-3333-3333-3333-333333333334"]'::jsonb,
  '2026-03-09T16:22:00Z',
  'Control design exists, but operational validation is incomplete.',
  'belief-service',
  'service',
  1
),
(
  '66666666-6666-6666-6666-666666666663',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555553',
  'accepted',
  0.97,
  0.03,
  'critical',
  '[]'::jsonb,
  '[]'::jsonb,
  '["33333333-3333-3333-3333-333333333333"]'::jsonb,
  '2026-03-09T16:23:00Z',
  'Legal evidence indicates DPA remains pending.',
  'belief-service',
  'service',
  1
),
(
  '66666666-6666-6666-6666-666666666664',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555554',
  'accepted',
  0.86,
  0.10,
  'high',
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '2026-03-09T16:24:00Z',
  'Workflow design enforces agent draft only; human sends final response.',
  'belief-service',
  'service',
  1
),
(
  '66666666-6666-6666-6666-666666666665',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555',
  'accepted',
  0.89,
  0.09,
  'high',
  '[]'::jsonb,
  '[]'::jsonb,
  '["33333333-3333-3333-3333-333333333335"]'::jsonb,
  '2026-03-09T16:25:00Z',
  'Privacy review found retention control requirement.',
  'belief-service',
  'service',
  1
);

-- ---------------------------------------------------------
-- BELIEF SUPPORT / OPPOSITION LINKS
-- ---------------------------------------------------------
insert into belief_support_links (belief_id, evidence_id) values
('66666666-6666-6666-6666-666666666661', '33333333-3333-3333-3333-333333333331'),
('66666666-6666-6666-6666-666666666661', '33333333-3333-3333-3333-333333333332'),
('66666666-6666-6666-6666-666666666662', '33333333-3333-3333-3333-333333333334'),
('66666666-6666-6666-6666-666666666663', '33333333-3333-3333-3333-333333333333'),
('66666666-6666-6666-6666-666666666665', '33333333-3333-3333-3333-333333333335');

insert into belief_opposition_links (belief_id, claim_id) values
('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555552');

-- ---------------------------------------------------------
-- POLICY TESTS
-- ---------------------------------------------------------
insert into policy_tests (
  policy_test_id, case_id, policy_id, policy_version, rule_id, name,
  test_expression, result, severity, blocked_outcomes_json,
  required_escalations_json, executed_at, explanation
) values
(
  '77777777-7777-7777-7777-777777777771',
  '11111111-1111-1111-1111-111111111111',
  'AI-DATA-HANDLING',
  '2026.02',
  'RULE-EXT-LLM-CONFIDENTIAL',
  'Confidential data with external hosted model requires controls and approval',
  'dataset.classification = confidential AND model.hosting = external',
  'warning',
  'critical',
  '[]'::jsonb,
  '["privacy-review","security-review"]'::jsonb,
  '2026-03-09T16:30:00Z',
  'External hosted model may process confidential support data.'
),
(
  '77777777-7777-7777-7777-777777777772',
  '11111111-1111-1111-1111-111111111111',
  'AI-DATA-HANDLING',
  '2026.02',
  'RULE-DPA-REQUIRED',
  'External vendor processing requires executed DPA',
  'vendor.hosting = external AND legal.dpa_status = executed',
  'fail',
  'critical',
  '["approve"]'::jsonb,
  '["legal-review"]'::jsonb,
  '2026-03-09T16:31:00Z',
  'Vendor DPA is pending signature.'
),
(
  '77777777-7777-7777-7777-777777777773',
  '11111111-1111-1111-1111-111111111111',
  'AI-USE-CASE',
  '2026.02',
  'RULE-HUMAN-REVIEW',
  'Customer-facing output requires human review',
  'workflow.customer_facing = true AND human_review = true',
  'pass',
  'high',
  '[]'::jsonb,
  '[]'::jsonb,
  '2026-03-09T16:32:00Z',
  'Human review is present before outbound response.'
),
(
  '77777777-7777-7777-7777-777777777774',
  '11111111-1111-1111-1111-111111111111',
  'AI-LOGGING',
  '2026.02',
  'RULE-LOG-RETENTION',
  'Prompt and output logging require retention controls',
  'logging.prompts = true OR logging.outputs = true',
  'warning',
  'high',
  '[]'::jsonb,
  '["privacy-review"]'::jsonb,
  '2026-03-09T16:33:00Z',
  'Retention controls must be defined and enforced.'
);

-- ---------------------------------------------------------
-- POLICY TEST SUBJECT LINKS
-- ---------------------------------------------------------
insert into policy_test_subject_links (policy_test_id, subject_type, subject_id) values
('77777777-7777-7777-7777-777777777771', 'case', '11111111-1111-1111-1111-111111111111'),
('77777777-7777-7777-7777-777777777772', 'claim', '55555555-5555-5555-5555-555555555553'),
('77777777-7777-7777-7777-777777777773', 'claim', '55555555-5555-5555-5555-555555555554'),
('77777777-7777-7777-7777-777777777774', 'claim', '55555555-5555-5555-5555-555555555555');

-- ---------------------------------------------------------
-- SCORES
-- ---------------------------------------------------------
insert into scores (
  score_id, case_id, score_type, value_num, value_label, scale, method_id, inputs_json, confidence
) values
(
  '78888888-8888-8888-8888-888888888881',
  '11111111-1111-1111-1111-111111111111',
  'inherent_risk',
  4.00,
  'high',
  '1_to_5',
  '44444444-4444-4444-4444-444444444441',
  '{"external_model":true,"confidential_data":true,"customer_facing":true}'::jsonb,
  0.90
),
(
  '78888888-8888-8888-8888-888888888882',
  '11111111-1111-1111-1111-111111111111',
  'residual_risk',
  2.80,
  'moderate',
  '1_to_5',
  '44444444-4444-4444-4444-444444444441',
  '{"redaction_control":"partial","human_review":true,"dpa_pending":true}'::jsonb,
  0.74
);

-- ---------------------------------------------------------
-- SCENARIO
-- ---------------------------------------------------------
insert into scenarios (
  scenario_id, case_id, name, description, scenario_type, assumptions_json
) values
(
  '79999999-9999-9999-9999-999999999991',
  '11111111-1111-1111-1111-111111111111',
  'Conditional Approval Scenario',
  'Approve with conditions: redaction, DPA execution, human review, logging controls.',
  'decision_path',
  '{"dpa_executed_before_go_live":true,"redaction_enabled":true,"human_review_required":true}'::jsonb
);

-- ---------------------------------------------------------
-- DECISION OPTIONS
-- ---------------------------------------------------------
insert into decision_options (
  decision_option_id, case_id, option_type, summary, rationale, conditions_json,
  expiration_at, recommended_by_actor_id, recommended_by_actor_type
) values
(
  '88888888-8888-8888-8888-888888888881',
  '11111111-1111-1111-1111-111111111111',
  'reject',
  'Reject deployment pending legal and control maturity.',
  'External processing of confidential data without executed DPA is unacceptable.',
  '[]'::jsonb,
  null,
  'decision-synthesis-agent',
  'agent'
),
(
  '88888888-8888-8888-8888-888888888882',
  '11111111-1111-1111-1111-111111111111',
  'approve_with_conditions',
  'Approve with strict pre-go-live conditions and quarterly review.',
  'Risk can be reduced to an acceptable level if legal, privacy, and technical controls are implemented before launch.',
  '[
    "Execute vendor DPA before production go-live",
    "Enable PII redaction before inference",
    "Require human review before customer-facing response",
    "Apply retention controls to prompt/output logs",
    "Complete quarterly review"
  ]'::jsonb,
  '2027-03-09T00:00:00Z',
  'decision-synthesis-agent',
  'agent'
),
(
  '88888888-8888-8888-8888-888888888883',
  '11111111-1111-1111-1111-111111111111',
  'defer',
  'Defer decision until DPA execution and control validation complete.',
  'Evidence supports conditional approval path, but preconditions are not fully met today.',
  '[
    "Collect signed DPA",
    "Validate redaction control in production-like environment"
  ]'::jsonb,
  null,
  'decision-synthesis-agent',
  'agent'
);

-- ---------------------------------------------------------
-- DECISION OPTION LINKS
-- ---------------------------------------------------------
insert into decision_option_claim_links (decision_option_id, claim_id) values
('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555551'),
('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555552'),
('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555553'),
('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555554'),
('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555555');

insert into decision_option_policy_links (decision_option_id, policy_test_id) values
('88888888-8888-8888-8888-888888888882', '77777777-7777-7777-7777-777777777771'),
('88888888-8888-8888-8888-888888888882', '77777777-7777-7777-7777-777777777772'),
('88888888-8888-8888-8888-888888888882', '77777777-7777-7777-7777-777777777773'),
('88888888-8888-8888-8888-888888888882', '77777777-7777-7777-7777-777777777774');

insert into decision_option_scenario_links (decision_option_id, scenario_id) values
('88888888-8888-8888-8888-888888888882', '79999999-9999-9999-9999-999999999991');

-- ---------------------------------------------------------
-- PRE-FINAL APPROVALS
-- ---------------------------------------------------------
insert into approvals (
  approval_id, case_id, decision_id, approval_type, approver_id, approver_role,
  outcome, justification, signed_at, quorum_group, sod_check_result
) values
(
  '99999999-9999-9999-9999-999999999991',
  '11111111-1111-1111-1111-111111111111',
  null,
  'security_review',
  'approver-security-001',
  'Security Architect',
  'approved',
  'Approved subject to PII redaction and logging controls.',
  '2026-03-09T16:40:00Z',
  'ai-governance-board',
  'pass'
),
(
  '99999999-9999-9999-9999-999999999992',
  '11111111-1111-1111-1111-111111111111',
  null,
  'privacy_review',
  'approver-privacy-001',
  'Privacy Officer',
  'approved',
  'Approved subject to retention controls and DPA execution.',
  '2026-03-09T16:42:00Z',
  'ai-governance-board',
  'pass'
);

-- ---------------------------------------------------------
-- DECISION
-- Note: create final decision after at least one approval is associated
-- ---------------------------------------------------------
insert into decisions (
  decision_id, case_id, selected_option_id, final_outcome, decision_summary,
  effective_at, expires_at, renewal_required, status,
  finalized_by_actor_id, finalized_by_actor_type, finalized_at
) values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '88888888-8888-8888-8888-888888888882',
  'approve_with_conditions',
  'Approved with conditions: execute DPA, enable redaction, enforce human review, apply logging retention controls, and schedule quarterly review.',
  '2026-03-09T16:45:00Z',
  '2027-03-09T00:00:00Z',
  true,
  'pending_approval',
  null,
  null,
  null
);

-- backfill approval linkage to decision
update approvals
set decision_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
where approval_id in (
  '99999999-9999-9999-9999-999999999991',
  '99999999-9999-9999-9999-999999999992'
);

insert into decision_approval_links (decision_id, approval_id) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999991'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999992');

-- finalize decision now that approvals exist
update decisions
set status = 'finalized',
    finalized_by_actor_id = 'approver-board-chair-001',
    finalized_by_actor_type = 'user',
    finalized_at = '2026-03-09T16:47:00Z'
where decision_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

update cases
set status = 'approved_with_conditions',
    current_decision_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
where case_id = '11111111-1111-1111-1111-111111111111';

-- ---------------------------------------------------------
-- REVIEW TRIGGERS
-- ---------------------------------------------------------
insert into review_triggers (
  review_trigger_id, case_id, trigger_type, trigger_condition, status, notes
) values
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'scheduled_review',
  'quarterly_review_due',
  'open',
  'Quarterly review required for external hosted AI use case.'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc',
  '11111111-1111-1111-1111-111111111111',
  'policy_change',
  'ai_policy_version_change',
  'open',
  'Re-review if AI data handling standard changes.'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbd',
  '11111111-1111-1111-1111-111111111111',
  'vendor_change',
  'provider_terms_or_model_change',
  'open',
  'Re-review if vendor model, hosting, or terms materially change.'
);

insert into review_trigger_source_links (review_trigger_id, source_type, source_id) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'decision', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'policy_test', '77777777-7777-7777-7777-777777777771'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbd', 'entity', '22222222-2222-2222-2222-222222222223');

insert into review_schedules (
  review_schedule_id, case_id, decision_id, next_review_at, cadence, active
) values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '2026-06-09T00:00:00Z',
  'quarterly',
  true
);

-- ---------------------------------------------------------
-- REVISION EVENTS
-- ---------------------------------------------------------
insert into revision_events (
  revision_event_id, case_id, target_type, target_id, previous_state_json, new_state_json,
  reason, actor_id, actor_type
) values
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '11111111-1111-1111-1111-111111111111',
  'belief',
  '66666666-6666-6666-6666-666666666662',
  '{"belief_state":"plausible","belief_strength":0.61}'::jsonb,
  '{"belief_state":"provisionally_accepted","belief_strength":0.71}'::jsonb,
  'Control design evidence increased confidence, but validation gap remains.',
  'belief-service',
  'service'
);

-- ---------------------------------------------------------
-- AUDIT EVENTS
-- ---------------------------------------------------------
insert into audit_events (
  event_id, case_id, actor_type, actor_id, action_type, target_type, target_id,
  previous_state, new_state, event_timestamp, justification, related_sources
) values
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
  '11111111-1111-1111-1111-111111111111',
  'agent',
  'claims-agent-01',
  'claim_created',
  'claim',
  '55555555-5555-5555-5555-555555555551',
  '{}'::jsonb,
  '{"statement":"Customer support ticket data is transmitted to an external model provider during inference."}'::jsonb,
  '2026-03-09T16:15:00Z',
  'Derived from architecture and vendor evidence.',
  '["33333333-3333-3333-3333-333333333331","33333333-3333-3333-3333-333333333332"]'::jsonb
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
  '11111111-1111-1111-1111-111111111111',
  'service',
  'belief-service',
  'belief_revised',
  'belief',
  '66666666-6666-6666-6666-666666666662',
  '{"belief_state":"plausible","belief_strength":0.61}'::jsonb,
  '{"belief_state":"provisionally_accepted","belief_strength":0.71}'::jsonb,
  '2026-03-09T16:22:00Z',
  'Control design recognized, but operational validation still outstanding.',
  '["33333333-3333-3333-3333-333333333334"]'::jsonb
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3',
  '11111111-1111-1111-1111-111111111111',
  'agent',
  'decision-synthesis-agent',
  'decision_option_created',
  'decision_option',
  '88888888-8888-8888-8888-888888888882',
  '{}'::jsonb,
  '{"option_type":"approve_with_conditions"}'::jsonb,
  '2026-03-09T16:36:00Z',
  'Conditional approval recommended based on control pathway and governance conditions.',
  '["77777777-7777-7777-7777-777777777771","77777777-7777-7777-7777-777777777772","77777777-7777-7777-7777-777777777773","77777777-7777-7777-7777-777777777774"]'::jsonb
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4',
  '11111111-1111-1111-1111-111111111111',
  'user',
  'approver-board-chair-001',
  'decision_finalized',
  'decision',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '{"status":"pending_approval"}'::jsonb,
  '{"status":"finalized","final_outcome":"approve_with_conditions"}'::jsonb,
  '2026-03-09T16:47:00Z',
  'Final board chair authorization after security and privacy approvals.',
  '["99999999-9999-9999-9999-999999999991","99999999-9999-9999-9999-999999999992"]'::jsonb
);

-- ---------------------------------------------------------
-- UNIVERSAL GRAPH EDGES
-- ---------------------------------------------------------
insert into rdg_edges (case_id, from_type, from_id, edge_type, to_type, to_id, attributes_json) values
('11111111-1111-1111-1111-111111111111', 'case', '11111111-1111-1111-1111-111111111111', 'involves', 'entity', '22222222-2222-2222-2222-222222222221', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'case', '11111111-1111-1111-1111-111111111111', 'involves', 'entity', '22222222-2222-2222-2222-222222222222', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'claim', '55555555-5555-5555-5555-555555555551', 'supported_by', 'evidence', '33333333-3333-3333-3333-333333333331', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'claim', '55555555-5555-5555-5555-555555555551', 'supported_by', 'evidence', '33333333-3333-3333-3333-333333333332', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'counterclaim', '56666666-6666-6666-6666-666666666661', 'challenges', 'claim', '55555555-5555-5555-5555-555555555552', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'belief', '66666666-6666-6666-6666-666666666663', 'derived_from', 'claim', '55555555-5555-5555-5555-555555555553', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'decision_option', '88888888-8888-8888-8888-888888888882', 'tested_by', 'policy_test', '77777777-7777-7777-7777-777777777772', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'decision_option', '88888888-8888-8888-8888-888888888882', 'selected_as', 'decision', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'decision', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved_by', 'approval', '99999999-9999-9999-9999-999999999991', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'decision', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved_by', 'approval', '99999999-9999-9999-9999-999999999992', '{}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'decision', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'triggers_review', 'review_trigger', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '{}'::jsonb);

commit;
-- =========================================================
-- End Seed SQL
-- =========================================================
```

---

# 4. Expected Final State

After the script runs successfully, the case should be in this state.

## Case
- status: `approved_with_conditions`

## Final decision
- outcome: `approve_with_conditions`

## Conditions
- DPA required before go-live
- PII redaction required before inference
- human review required before customer response
- logging retention controls required
- quarterly review required

## Review posture
- scheduled quarterly review
- policy-change trigger
- vendor-change trigger

---

# 5. Why This Test Case Is Useful

This test case validates the most important schema choices.

## A. Claim / Belief / Decision separation
The case proves the platform does not jump directly from evidence to outcome.

## B. Policy-aware decisioning
A failed DPA-related policy test blocks unconditional approval but still allows a governed conditional path.

## C. Human governance
Security and privacy approvals are required before finalization.

## D. Re-review model
The decision creates review triggers and a scheduled control cycle.

---

# 6. How to Validate the Test Case

Use these checks after running the seed SQL.

## 6.1 Final decision check

```sql
select
  c.case_id,
  c.title,
  c.status as case_status,
  d.final_outcome,
  d.status as decision_status,
  d.finalized_at
from cases c
join decisions d on d.decision_id = c.current_decision_id
where c.case_id = '11111111-1111-1111-1111-111111111111';
```

Expected result:

```text
case_status        = approved_with_conditions
final_outcome      = approve_with_conditions
decision_status    = finalized
```

## 6.2 Policy chain check

```sql
select
  dopt.decision_option_id,
  dopt.option_type,
  pt.rule_id,
  pt.result,
  pt.severity
from decision_options dopt
join decision_option_policy_links dopl
  on dopl.decision_option_id = dopt.decision_option_id
join policy_tests pt
  on pt.policy_test_id = dopl.policy_test_id
where dopt.decision_option_id = '88888888-8888-8888-8888-888888888882'
order by pt.rule_id;
```

Expected result:
- one `fail`
- two `warning/pass` style controls
- evidence of explicit policy constraint linkage

## 6.3 Claim-to-evidence trace

```sql
select
  c.claim_id,
  c.statement,
  e.evidence_id,
  e.title,
  cel.relationship_type
from claims c
join claim_evidence_links cel
  on cel.claim_id = c.claim_id
join evidence e
  on e.evidence_id = cel.evidence_id
where c.case_id = '11111111-1111-1111-1111-111111111111'
order by c.claim_id, e.evidence_id;
```

## 6.4 Approval check

```sql
select
  a.approval_type,
  a.approver_role,
  a.outcome,
  a.signed_at
from approvals a
where a.decision_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
order by a.signed_at;
```

Expected result:
- security approval
- privacy approval

## 6.5 Review trigger check

```sql
select
  trigger_type,
  trigger_condition,
  status
from review_triggers
where case_id = '11111111-1111-1111-1111-111111111111'
order by trigger_type;
```

Expected result:
- policy_change
- scheduled_review
- vendor_change

---

# 7. Plain-English Outcome Narrative

This is the decision narrative the system should be able to generate from the seeded graph.

> The proposed AI Support Copilot uses an external hosted LLM to process confidential support ticket content. Evidence confirms external inference and identifies a pending vendor DPA. A redaction control exists but is not yet fully validated in production. Human review is present for all customer-facing responses, and logging retention controls are required. Based on policy evaluation and approvals from Security and Privacy, the use case is approved with conditions: DPA execution before go-live, PII redaction before inference, human review for outbound responses, retention controls for logs, and quarterly re-review.

That is the exact kind of memo your system should be able to produce deterministically.

---

# 8. Recommended Next Artifact

After this test case, the next best deliverable is:

## **decision memo generation SQL/view + API response shape**

That forces you to prove the graph can be rendered into an executive-grade outcome, not just stored.
