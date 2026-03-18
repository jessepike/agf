# Postgres DDL v0.1 — Risk Decision Graph (RDG)
## DecisionOS / Agentic Risk Operating System

This is the **v0.1 relational implementation** of the canonical RDG schema.

It is designed to match the documented MVP direction:

- Postgres-first system of record
- case-bound reasoning graph
- explicit separation of claims, beliefs, and decisions
- policy tests as first-class objects
- approvals and governance gates
- immutable audit trail
- review triggers for drift and re-evaluation

It intentionally implements the **defensible decision core** first, with optional quant/scenario layers kept lightweight or deferred.

---

# 1. Scope of DDL v0.1

## Included in v0.1
- cases
- entities
- evidence
- claims
- beliefs
- policy_tests
- decision_options
- decisions
- approvals
- review_triggers
- audit_events
- link tables
- universal edge table
- override table
- review schedule table

## Deferred or optional
- full simulation engine
- prior-case precedent graph
- advanced portfolio analytics
- full external graph DB projection
- cross-tenant ontology management

---

# 2. Design Notes

## Non-negotiable model separation

```text
Claim ≠ Belief ≠ Decision
```

## Provenance backbone

```text
Evidence → Claim → Belief → Policy Test → Decision Option → Final Decision → Approval
```

## Storage strategy
- Postgres stores operational system-of-record data
- object storage holds files and exports
- graph projection can be added later

---

# 3. SQL DDL

```sql
-- =========================================================
-- Risk Decision Graph (RDG) DDL v0.1
-- PostgreSQL 15+
-- =========================================================

-- ---------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- Utility trigger for updated_at
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------
-- Enums
-- ---------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'actor_type_enum') then
    create type actor_type_enum as enum ('user', 'agent', 'system', 'service');
  end if;

  if not exists (select 1 from pg_type where typname = 'case_status_enum') then
    create type case_status_enum as enum (
      'draft',
      'submitted',
      'in_review',
      'pending_approval',
      'approved',
      'approved_with_conditions',
      'rejected',
      'deferred',
      'escalated',
      'closed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'risk_domain_enum') then
    create type risk_domain_enum as enum (
      'ai_governance',
      'security_architecture',
      'third_party_risk',
      'policy_exception',
      'privacy',
      'compliance',
      'other'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'claim_status_enum') then
    create type claim_status_enum as enum (
      'proposed',
      'active',
      'challenged',
      'superseded',
      'withdrawn'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'belief_state_enum') then
    create type belief_state_enum as enum (
      'unknown',
      'under_review',
      'plausible',
      'provisionally_accepted',
      'accepted',
      'contested',
      'insufficient_evidence',
      'rejected',
      'stale',
      'superseded'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'freshness_state_enum') then
    create type freshness_state_enum as enum (
      'current',
      'aging',
      'stale',
      'expired',
      'unknown'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'policy_test_result_enum') then
    create type policy_test_result_enum as enum (
      'pass',
      'fail',
      'warning',
      'not_applicable',
      'manual_review_required'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'decision_option_type_enum') then
    create type decision_option_type_enum as enum (
      'approve',
      'approve_with_conditions',
      'reject',
      'defer_pending_evidence',
      'defer',
      'escalate',
      'grant_exception',
      'require_compensating_controls'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'decision_status_enum') then
    create type decision_status_enum as enum (
      'draft',
      'recommended',
      'pending_approval',
      'finalized',
      'superseded',
      'expired'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'approval_outcome_enum') then
    create type approval_outcome_enum as enum (
      'approved',
      'rejected',
      'abstained',
      'override_approved',
      'exception_granted',
      'pending'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'review_trigger_status_enum') then
    create type review_trigger_status_enum as enum (
      'open',
      'fired',
      'suppressed',
      'resolved'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'materiality_enum') then
    create type materiality_enum as enum (
      'low',
      'medium',
      'high',
      'critical'
    );
  end if;
end $$;

-- ---------------------------------------------------------
-- Cases
-- ---------------------------------------------------------
create table if not exists cases (
  case_id uuid primary key default gen_random_uuid(),
  case_type text not null,
  title text not null,
  description text,
  status case_status_enum not null default 'draft',
  risk_domain risk_domain_enum not null,
  workflow_template_id text,
  priority smallint not null default 3 check (priority between 1 and 5),
  requestor_id text not null,
  owner_id text not null,
  retention_class text not null default 'standard',
  current_decision_id uuid,
  submitted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cases_status on cases(status);
create index if not exists idx_cases_risk_domain on cases(risk_domain);
create index if not exists idx_cases_owner_id on cases(owner_id);

create trigger trg_cases_updated_at
before update on cases
for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Entities
-- ---------------------------------------------------------
create table if not exists entities (
  entity_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  entity_type text not null,
  name text not null,
  external_ref text,
  criticality materiality_enum,
  classification text,
  owner_id text,
  source_system text,
  attributes_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_entities_case_id on entities(case_id);
create index if not exists idx_entities_type on entities(entity_type);
create index if not exists idx_entities_external_ref on entities(external_ref);

create trigger trg_entities_updated_at
before update on entities
for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Evidence
-- ---------------------------------------------------------
create table if not exists evidence (
  evidence_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  evidence_type text not null,
  title text not null,
  source_type text not null,
  source_uri text not null,
  source_hash text,
  captured_at timestamptz not null,
  effective_at timestamptz,
  expires_at timestamptz,
  freshness_state freshness_state_enum not null default 'unknown',
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  access_classification text,
  extracted_text_ref text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    source_uri <> ''
  )
);

create index if not exists idx_evidence_case_id on evidence(case_id);
create index if not exists idx_evidence_freshness on evidence(freshness_state);
create index if not exists idx_evidence_expires_at on evidence(expires_at);
create index if not exists idx_evidence_source_type on evidence(source_type);

create trigger trg_evidence_updated_at
before update on evidence
for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Claims
-- ---------------------------------------------------------
create table if not exists claims (
  claim_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  claim_type text not null,
  statement text not null,
  subject_entity_id uuid references entities(entity_id) on delete set null,
  object_entity_id uuid references entities(entity_id) on delete set null,
  asserted_by_actor_id text not null,
  asserted_by_actor_type actor_type_enum not null,
  method_ref text,
  materiality materiality_enum not null default 'medium',
  status claim_status_enum not null default 'proposed',
  superseded_by_claim_id uuid references claims(claim_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_claims_case_id on claims(case_id);
create index if not exists idx_claims_status on claims(status);
create index if not exists idx_claims_subject_entity on claims(subject_entity_id);
create index if not exists idx_claims_materiality on claims(materiality);

create trigger trg_claims_updated_at
before update on claims
for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Counterclaims
-- ---------------------------------------------------------
create table if not exists counterclaims (
  counterclaim_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  target_claim_id uuid not null references claims(claim_id) on delete cascade,
  statement text not null,
  asserted_by_actor_id text not null,
  asserted_by_actor_type actor_type_enum not null,
  status claim_status_enum not null default 'proposed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_counterclaims_case_id on counterclaims(case_id);
create index if not exists idx_counterclaims_target_claim on counterclaims(target_claim_id);

create trigger trg_counterclaims_updated_at
before update on counterclaims
for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Beliefs
-- ---------------------------------------------------------
create table if not exists beliefs (
  belief_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  subject_claim_id uuid not null references claims(claim_id) on delete cascade,
  belief_state belief_state_enum not null default 'unknown',
  belief_strength numeric(5,4) check (belief_strength is null or (belief_strength >= 0 and belief_strength <= 1)),
  uncertainty numeric(5,4) check (uncertainty is null or (uncertainty >= 0 and uncertainty <= 1)),
  policy_relevance materiality_enum,
  supporting_claims jsonb not null default '[]'::jsonb,
  opposing_claims jsonb not null default '[]'::jsonb,
  supporting_evidence jsonb not null default '[]'::jsonb,
  last_revised_at timestamptz,
  revision_reason text,
  computed_by_actor_id text,
  computed_by_actor_type actor_type_enum,
  version_no integer not null default 1 check (version_no >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(case_id, subject_claim_id, version_no)
);

create index if not exists idx_beliefs_case_id on beliefs(case_id);
create index if not exists idx_beliefs_subject_claim on beliefs(subject_claim_id);
create index if not exists idx_beliefs_state on beliefs(belief_state);

create trigger trg_beliefs_updated_at
before update on beliefs
for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Methods
-- ---------------------------------------------------------
create table if not exists methods (
  method_id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(case_id) on delete cascade,
  method_type text not null,
  name text not null,
  version text not null,
  parameters_json jsonb not null default '{}'::jsonb,
  applied_scope text,
  created_at timestamptz not null default now()
);

create index if not exists idx_methods_case_id on methods(case_id);
create index if not exists idx_methods_type_name on methods(method_type, name);

-- ---------------------------------------------------------
-- Policy Tests
-- ---------------------------------------------------------
create table if not exists policy_tests (
  policy_test_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  policy_id text not null,
  policy_version text not null,
  rule_id text not null,
  name text not null,
  test_expression text not null,
  result policy_test_result_enum not null,
  severity materiality_enum not null default 'medium',
  blocked_outcomes_json jsonb not null default '[]'::jsonb,
  required_escalations_json jsonb not null default '[]'::jsonb,
  executed_at timestamptz not null default now(),
  explanation text,
  created_at timestamptz not null default now()
);

create index if not exists idx_policy_tests_case_id on policy_tests(case_id);
create index if not exists idx_policy_tests_policy on policy_tests(policy_id, policy_version);
create index if not exists idx_policy_tests_result on policy_tests(result);

-- ---------------------------------------------------------
-- Scores
-- ---------------------------------------------------------
create table if not exists scores (
  score_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  score_type text not null,
  value_num numeric(18,6),
  value_label text,
  scale text,
  method_id uuid references methods(method_id) on delete set null,
  inputs_json jsonb not null default '{}'::jsonb,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  created_at timestamptz not null default now()
);

create index if not exists idx_scores_case_id on scores(case_id);
create index if not exists idx_scores_type on scores(score_type);

-- ---------------------------------------------------------
-- Scenarios
-- ---------------------------------------------------------
create table if not exists scenarios (
  scenario_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  name text not null,
  description text,
  scenario_type text not null,
  assumptions_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_scenarios_case_id on scenarios(case_id);

-- ---------------------------------------------------------
-- Simulations
-- ---------------------------------------------------------
create table if not exists simulations (
  simulation_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  scenario_id uuid references scenarios(scenario_id) on delete set null,
  method_id uuid references methods(method_id) on delete set null,
  simulation_type text not null,
  version text not null,
  inputs_json jsonb not null default '{}'::jsonb,
  outputs_json jsonb not null default '{}'::jsonb,
  explainability_json jsonb not null default '{}'::jsonb,
  executed_at timestamptz not null default now()
);

create index if not exists idx_simulations_case_id on simulations(case_id);
create index if not exists idx_simulations_scenario_id on simulations(scenario_id);

-- ---------------------------------------------------------
-- Decision Options
-- ---------------------------------------------------------
create table if not exists decision_options (
  decision_option_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  option_type decision_option_type_enum not null,
  summary text not null,
  rationale text not null,
  conditions_json jsonb not null default '[]'::jsonb,
  expiration_at timestamptz,
  recommended_by_actor_id text not null,
  recommended_by_actor_type actor_type_enum not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_decision_options_case_id on decision_options(case_id);
create index if not exists idx_decision_options_type on decision_options(option_type);

-- ---------------------------------------------------------
-- Decisions
-- ---------------------------------------------------------
create table if not exists decisions (
  decision_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  selected_option_id uuid not null references decision_options(decision_option_id) on delete restrict,
  final_outcome decision_option_type_enum not null,
  decision_summary text not null,
  effective_at timestamptz not null,
  expires_at timestamptz,
  renewal_required boolean not null default false,
  status decision_status_enum not null default 'draft',
  finalized_by_actor_id text,
  finalized_by_actor_type actor_type_enum,
  finalized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(case_id, selected_option_id)
);

create index if not exists idx_decisions_case_id on decisions(case_id);
create index if not exists idx_decisions_status on decisions(status);
create index if not exists idx_decisions_expires_at on decisions(expires_at);

create trigger trg_decisions_updated_at
before update on decisions
for each row execute function set_updated_at();

alter table cases
  add constraint fk_cases_current_decision
  foreign key (current_decision_id)
  references decisions(decision_id)
  on delete set null;

-- ---------------------------------------------------------
-- Approvals
-- ---------------------------------------------------------
create table if not exists approvals (
  approval_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  decision_id uuid references decisions(decision_id) on delete cascade,
  approval_type text not null,
  approver_id text not null,
  approver_role text not null,
  outcome approval_outcome_enum not null default 'pending',
  justification text,
  signed_at timestamptz,
  quorum_group text,
  sod_check_result text,
  created_at timestamptz not null default now()
);

create index if not exists idx_approvals_case_id on approvals(case_id);
create index if not exists idx_approvals_decision_id on approvals(decision_id);
create index if not exists idx_approvals_outcome on approvals(outcome);

-- ---------------------------------------------------------
-- Overrides
-- ---------------------------------------------------------
create table if not exists overrides (
  override_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  decision_id uuid not null references decisions(decision_id) on delete cascade,
  overridden_rule_ids jsonb not null default '[]'::jsonb,
  override_reason text not null,
  approved_by text not null,
  approved_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_overrides_case_id on overrides(case_id);
create index if not exists idx_overrides_decision_id on overrides(decision_id);

-- ---------------------------------------------------------
-- Review Triggers
-- ---------------------------------------------------------
create table if not exists review_triggers (
  review_trigger_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  trigger_type text not null,
  trigger_condition text not null,
  status review_trigger_status_enum not null default 'open',
  fired_at timestamptz,
  resolved_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_review_triggers_case_id on review_triggers(case_id);
create index if not exists idx_review_triggers_status on review_triggers(status);

-- ---------------------------------------------------------
-- Review Schedules
-- ---------------------------------------------------------
create table if not exists review_schedules (
  review_schedule_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  decision_id uuid references decisions(decision_id) on delete cascade,
  next_review_at timestamptz not null,
  cadence text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_review_schedules_case_id on review_schedules(case_id);
create index if not exists idx_review_schedules_next_review on review_schedules(next_review_at);

-- ---------------------------------------------------------
-- Revision Events
-- ---------------------------------------------------------
create table if not exists revision_events (
  revision_event_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  previous_state_json jsonb not null default '{}'::jsonb,
  new_state_json jsonb not null default '{}'::jsonb,
  reason text not null,
  actor_id text not null,
  actor_type actor_type_enum not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_revision_events_case_id on revision_events(case_id);
create index if not exists idx_revision_events_target on revision_events(target_type, target_id);

-- ---------------------------------------------------------
-- Audit Events
-- ---------------------------------------------------------
create table if not exists audit_events (
  event_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  actor_type actor_type_enum not null,
  actor_id text not null,
  action_type text not null,
  target_type text not null,
  target_id uuid not null,
  previous_state jsonb not null default '{}'::jsonb,
  new_state jsonb not null default '{}'::jsonb,
  event_timestamp timestamptz not null default now(),
  justification text,
  related_sources jsonb not null default '[]'::jsonb
);

create index if not exists idx_audit_events_case_id on audit_events(case_id);
create index if not exists idx_audit_events_target on audit_events(target_type, target_id);
create index if not exists idx_audit_events_timestamp on audit_events(event_timestamp);

-- ---------------------------------------------------------
-- Link Tables
-- ---------------------------------------------------------
create table if not exists claim_evidence_links (
  claim_id uuid not null references claims(claim_id) on delete cascade,
  evidence_id uuid not null references evidence(evidence_id) on delete cascade,
  relationship_type text not null check (relationship_type in ('supported_by', 'contradicted_by', 'referenced_by')),
  material boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (claim_id, evidence_id, relationship_type)
);

create index if not exists idx_claim_evidence_links_evidence on claim_evidence_links(evidence_id);

create table if not exists claim_entity_links (
  claim_id uuid not null references claims(claim_id) on delete cascade,
  entity_id uuid not null references entities(entity_id) on delete cascade,
  relationship_type text not null check (relationship_type in ('about', 'impacts', 'owned_by', 'controls', 'processes')),
  created_at timestamptz not null default now(),
  primary key (claim_id, entity_id, relationship_type)
);

create table if not exists belief_support_links (
  belief_id uuid not null references beliefs(belief_id) on delete cascade,
  claim_id uuid references claims(claim_id) on delete cascade,
  evidence_id uuid references evidence(evidence_id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (claim_id is not null and evidence_id is null) or
    (claim_id is null and evidence_id is not null)
  )
);

create table if not exists belief_opposition_links (
  belief_id uuid not null references beliefs(belief_id) on delete cascade,
  claim_id uuid references claims(claim_id) on delete cascade,
  evidence_id uuid references evidence(evidence_id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (claim_id is not null and evidence_id is null) or
    (claim_id is null and evidence_id is not null)
  )
);

create table if not exists policy_test_subject_links (
  policy_test_id uuid not null references policy_tests(policy_test_id) on delete cascade,
  subject_type text not null,
  subject_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (policy_test_id, subject_type, subject_id)
);

create table if not exists decision_option_claim_links (
  decision_option_id uuid not null references decision_options(decision_option_id) on delete cascade,
  claim_id uuid not null references claims(claim_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (decision_option_id, claim_id)
);

create table if not exists decision_option_policy_links (
  decision_option_id uuid not null references decision_options(decision_option_id) on delete cascade,
  policy_test_id uuid not null references policy_tests(policy_test_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (decision_option_id, policy_test_id)
);

create table if not exists decision_option_scenario_links (
  decision_option_id uuid not null references decision_options(decision_option_id) on delete cascade,
  scenario_id uuid not null references scenarios(scenario_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (decision_option_id, scenario_id)
);

create table if not exists decision_approval_links (
  decision_id uuid not null references decisions(decision_id) on delete cascade,
  approval_id uuid not null references approvals(approval_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (decision_id, approval_id)
);

create table if not exists review_trigger_source_links (
  review_trigger_id uuid not null references review_triggers(review_trigger_id) on delete cascade,
  source_type text not null,
  source_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (review_trigger_id, source_type, source_id)
);

create table if not exists prior_case_reference_links (
  source_case_id uuid not null references cases(case_id) on delete cascade,
  referenced_case_id uuid not null references cases(case_id) on delete cascade,
  relationship_type text not null default 'similar_case',
  notes text,
  created_at timestamptz not null default now(),
  primary key (source_case_id, referenced_case_id, relationship_type),
  check (source_case_id <> referenced_case_id)
);

-- ---------------------------------------------------------
-- Universal Graph Edge Table
-- ---------------------------------------------------------
create table if not exists rdg_edges (
  edge_id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(case_id) on delete cascade,
  from_type text not null,
  from_id uuid not null,
  edge_type text not null,
  to_type text not null,
  to_id uuid not null,
  attributes_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_rdg_edges_case_id on rdg_edges(case_id);
create index if not exists idx_rdg_edges_from on rdg_edges(from_type, from_id);
create index if not exists idx_rdg_edges_to on rdg_edges(to_type, to_id);
create index if not exists idx_rdg_edges_type on rdg_edges(edge_type);

-- ---------------------------------------------------------
-- Governance Validation Functions
-- ---------------------------------------------------------

-- Prevent finalizing decision without approver metadata
create or replace function validate_finalized_decision()
returns trigger
language plpgsql
as $$
declare
  approval_count integer;
  policy_link_count integer;
  claim_link_count integer;
  expired_high_risk_count integer;
begin
  if new.status = 'finalized' then
    if new.finalized_by_actor_id is null or new.finalized_by_actor_type is null or new.finalized_at is null then
      raise exception 'finalized decision requires finalized_by_actor_id, finalized_by_actor_type, and finalized_at';
    end if;

    select count(*)
      into approval_count
    from approvals a
    where a.decision_id = new.decision_id
      and a.outcome in ('approved', 'override_approved', 'exception_granted');

    if approval_count = 0 then
      raise exception 'cannot finalize decision without at least one approval';
    end if;

    select count(*)
      into policy_link_count
    from decision_option_policy_links dopl
    join decision_options dopt on dopt.decision_option_id = dopl.decision_option_id
    where dopt.decision_option_id = new.selected_option_id;

    if policy_link_count = 0 then
      raise exception 'cannot finalize decision without linked policy test';
    end if;

    select count(*)
      into claim_link_count
    from decision_option_claim_links docl
    join decision_options dopt on dopt.decision_option_id = docl.decision_option_id
    where dopt.decision_option_id = new.selected_option_id;

    if claim_link_count = 0 then
      raise exception 'cannot finalize decision without linked claim';
    end if;

    select count(*)
      into expired_high_risk_count
    from evidence e
    join claim_evidence_links cel on cel.evidence_id = e.evidence_id
    join decision_option_claim_links docl on docl.claim_id = cel.claim_id
    where docl.decision_option_id = new.selected_option_id
      and e.freshness_state = 'expired';

    if expired_high_risk_count > 0 then
      raise exception 'cannot finalize decision with expired evidence in decision chain';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_finalized_decision on decisions;
create trigger trg_validate_finalized_decision
before insert or update on decisions
for each row execute function validate_finalized_decision();

-- Prevent override without reason
create or replace function validate_override_reason()
returns trigger
language plpgsql
as $$
begin
  if btrim(coalesce(new.override_reason, '')) = '' then
    raise exception 'override_reason is required';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_override_reason on overrides;
create trigger trg_validate_override_reason
before insert or update on overrides
for each row execute function validate_override_reason();

-- ---------------------------------------------------------
-- Seed comments for graph edge verbs
-- ---------------------------------------------------------
comment on table rdg_edges is 'Universal edge table for case-bound graph traversal and replay';
comment on column rdg_edges.edge_type is 'Recommended verbs: involves, supported_by, contradicted_by, challenges, derived_from, revised_by, tested_by, produces, recommends, selected_as, approved_by, requires, subject_to, supersedes, triggers_review';

-- =========================================================
-- End RDG DDL v0.1
-- =========================================================
```

---

# 4. What This DDL Gets Right

## Operationally sound
This is a practical schema, not a graph science project.

## Postgres-first
Core operational data stays relational.

## Governance-enforced
The schema includes:
- finalization checks
- approval dependency
- policy-link dependency
- claim-link dependency
- override reason enforcement

## Replayable
You can reconstruct reasoning through:
- link tables
- audit_events
- revision_events
- rdg_edges

---

# 5. Recommended Immediate Additions After v0.1

## v0.2
- row-level security for tenant isolation
- immutable audit partitioning
- policy package table
- actor registry table
- generated decision memo materialized view

## v0.3
- case similarity / precedent tables
- scenario comparison materialized views
- method library normalization
- evidence freshness automation jobs

---

# 6. Practical Implementation Notes

## Use object storage for files
Do not store raw PDFs, diagrams, contracts, or screenshots in Postgres blobs unless forced to.

## Keep `rdg_edges`, but do not depend on it for integrity
Use it for traversal and visualization.
Use typed tables and link tables for actual system correctness.

## Partition audit_events early if volume rises
That table will grow fast.

## Do not over-normalize actors on day one
Using `actor_id` + `actor_type` is enough for MVP.

---

# 7. Recommended Next Deliverable

After this, the next concrete artifact should be:

**seed data + one full AI Use Case Review example**

That will force validation of:
- constraints
- workflow state transitions
- policy test mechanics
- memo generation
- approval routing
