/**
 * Pipeline Verification Schemas — v0.3
 *
 * Drop into: packages/shared-types/src/verification.ts
 * Then re-export from packages/shared-types/src/index.ts
 *
 * These schemas define the structured event envelope, verification findings,
 * artifact lineage, and review package contracts for the pipeline verification
 * layer. They are the foundation for shadow mode logging (Phase 1A) and
 * gate enforcement (Phase 1A+).
 *
 * Spec reference: pipeline-verification-spec-v0.3.md, Sections 3-6
 */

import { z } from 'zod';

// ─── Pipeline Stages ────────────────────────────────────────────
export const PipelineStage = z.enum([
  'parse',               // Stage 1: Document parsing
  'extraction',          // Stage 2: LLM extraction to AssessmentContext
  'regulatory',          // Stage 3: Regulatory applicability
  'framework',           // Stage 4: Framework recommendation
  'risk_identification', // Stage 5: Risk identification and ranking
  'action_plan',         // Stage 6: Recommendations and action plan
]);

// ─── Pipeline Lifecycle State Machine (v0.3 §3) ────────────────
export const PipelineLifecycleState = z.enum([
  'queued',           // Assessment submitted, pipeline not yet started
  'running_stage',    // A pipeline stage is actively processing
  'paused_review',    // Pipeline halted at a gate; awaiting human review
  'resuming',         // Human review complete; pipeline re-entering execution
  'completed',        // All stages finished successfully
  'error',            // Unrecoverable error; pipeline terminated
]);

// ─── Event Categories ──────────────────────────────────────────
export const EventCategory = z.enum([
  'stage_start',             // Pipeline stage began processing
  'stage_complete',          // Pipeline stage finished producing output
  'verification_start',      // A verification layer began
  'verification_result',     // A verification layer produced findings
  'gate_decision',           // The stage gate made a proceed/flag/halt decision
  'human_action',            // A human reviewed, overrode, or confirmed something
  'pipeline_start',          // Full pipeline run initiated
  'pipeline_complete',       // Full pipeline run finished
  'pipeline_error',          // Pipeline encountered an unrecoverable error
  'review_requested',        // Pipeline halted and is awaiting human review
  'pipeline_resumed',        // Pipeline resumed after human review
  'artifact_revised',        // v0.3: Human override created new artifact version
  'downstream_invalidated',  // v0.3: Downstream stages marked stale after override
]);

// ─── Verification Layers ───────────────────────────────────────
export const VerificationLayer = z.enum([
  'self_audit',     // Layer 1: Same-model grounding check
  'cross_model',    // Layer 2: Different-model adversarial check
  'deterministic',  // Layer 3: Rule-based validators
]);

// ─── Confidence Level ──────────────────────────────────────────
export const ConfidenceLevel = z.enum([
  'high',        // All checks passed, no flags
  'medium',      // Minor flags, no hard-stop triggers
  'low',         // Significant flags or hard-stop triggered
  'unverified',  // Verification could not complete (verifier failure)
]);

// ─── Gate Decision ─────────────────────────────────────────────
export const GateDecision = z.enum([
  'auto_proceed',       // All checks passed, continue to next stage
  'proceed_with_flags', // Minor issues noted, continue but flag for review
  'needs_review',       // Significant issues, pipeline paused for human review
  'halt_error',         // Unrecoverable system error, pipeline cannot continue
]);

// ─── Verifier Status ───────────────────────────────────────────
export const VerifierStatus = z.enum([
  'completed',     // Verifier ran successfully, findings reflect content quality
  'timeout',       // Verifier timed out
  'error',         // Verifier encountered an error
  'skipped',       // Verifier was skipped (trust level, mode, or config)
  'unavailable',   // Verifier service/model unavailable
]);

// ─── Field Criticality ─────────────────────────────────────────
export const FieldCriticality = z.enum([
  'required_material',   // Must be correct — gate halts if flagged critical
  'required_supporting', // Should be correct — gate flags but may proceed
  'optional',            // Nice to have — info-level findings only
]);

// ─── Human Review Outcome (v0.3: replaces HumanActionType) ────
// Content judgment: what did the human decide about the output?
export const HumanReviewOutcome = z.enum([
  'approved',                // Output is correct as-is
  'approved_with_override',  // Output corrected; new artifact version created
  'rejected',                // Output is unacceptable; escalation or re-run needed
  'escalated',               // Needs higher-authority review
]);

// ─── Human Workflow Action (v0.3: new) ─────────────────────────
// Workflow routing: what should happen next?
export const HumanWorkflowAction = z.enum([
  'resume_pipeline',  // Continue to next stage
  're_run_stage',     // Re-run this stage from scratch
  'keep_paused',      // Keep paused; will return later
  'abort_pipeline',   // Cancel the assessment
]);

// ─── Evidence Reference ────────────────────────────────────────
export const EvidenceReference = z.object({
  document_id: z.string(),
  page: z.number().optional(),
  char_start: z.number().optional(),
  char_end: z.number().optional(),
  quote: z.string().optional(),
  quote_verified: z.boolean().optional(),
  match_type: z.enum(['exact', 'fuzzy', 'none']).optional(),
  match_similarity: z.number().min(0).max(1).optional(),
});

// ─── Finding Type ──────────────────────────────────────────────
export const FindingType = z.enum([
  'ungrounded',                 // Field value not supported by source text
  'cross_model_disagreement',   // Models produced different values
  'missing_extraction',         // Something in source text was not extracted
  'consistency_error',          // Extracted values contradict each other
  'completeness_gap',           // Required or expected field is empty/missing
  'confidence_below_threshold', // Field confidence below acceptable level
  'rule_violation',             // Deterministic rule check failed
  'grounding_quote_missing',    // Self-audit quoted text not found in source
]);

// ─── Verification Finding ──────────────────────────────────────
export const VerificationFinding = z.object({
  finding_id: z.string(),
  check_id: z.string(),
  field_path: z.string().optional(),
  field_criticality: FieldCriticality.optional(),
  finding_type: FindingType,
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string(),
  evidence_refs: z.array(EvidenceReference).optional(),
  expected_value: z.string().optional(),
  actual_value: z.string().optional(),
  resolution: z.enum([
    'pending',
    'auto_resolved',
    'human_resolved',
    'accepted_as_is',
  ]).default('pending'),

  // v0.3: Storage context — findings carry their own context
  assessment_id: z.string(),
  run_id: z.string(),
  stage: PipelineStage,
  artifact_version: z.string(),
});

// ─── Structured Error ──────────────────────────────────────────
export const PipelineError = z.object({
  error_code: z.string(),
  error_class: z.enum([
    'parse_failure',
    'extraction_failure',
    'verification_failure',
    'gate_failure',
    'model_unavailable',
    'timeout',
    'schema_validation',
    'internal',
  ]),
  retryable: z.boolean(),
  message: z.string(),
  failed_component: z.string(),
  diagnostics_ref: z.string().optional(),
});

// ─── Artifact Record (v0.3 §4.4) ──────────────────────────────
export const ArtifactRecord = z.object({
  artifact_version: z.string(),     // Unique version ID (ULID)
  assessment_id: z.string(),
  run_id: z.string(),
  stage: PipelineStage,
  artifact_status: z.enum([
    'active',       // Current canonical version
    'superseded',   // Replaced by human override
    'stale',        // Invalidated by upstream override
  ]),
  parent_artifact_version: z.string().optional(),
  output_hash: z.string(),
  created_at: z.string().datetime(),
  created_by: z.enum(['pipeline', 'human_override']),
});

// ─── The Event Envelope (v0.3) ─────────────────────────────────
export const PipelineEvent = z.object({
  // Identity & Lineage
  event_id: z.string(),
  assessment_id: z.string(),
  run_id: z.string(),
  attempt_no: z.number().int().min(1),
  sequence_no: z.number().int().min(0),
  caused_by_event_id: z.string().optional(),
  tenant_id: z.string().optional(),

  // Classification
  category: EventCategory,
  stage: PipelineStage.optional(),
  verification_layer: VerificationLayer.optional(),

  // Timing
  timestamp: z.string().datetime(),
  duration_ms: z.number().optional(),

  // Context
  model_id: z.string().optional(),
  model_version: z.string().optional(),
  input_hash: z.string().optional(),
  output_hash: z.string().optional(),

  // Version references
  prompt_version: z.string().optional(),
  ruleset_version: z.string().optional(),
  taxonomy_version: z.string().optional(),
  framework_version: z.string().optional(),

  // Verification payload
  confidence: ConfidenceLevel.optional(),
  confidence_score: z.number().min(0).max(1).optional(),
  gate_decision: GateDecision.optional(),
  verifier_status: VerifierStatus.optional(),
  finding_ids: z.array(z.string()).optional(),
  finding_count: z.object({
    info: z.number().default(0),
    warning: z.number().default(0),
    critical: z.number().default(0),
  }).optional(),

  // Gate reasoning (v0.3: added machine-readable codes)
  gate_reasons: z.array(z.string()).optional(),
  gate_reason_codes: z.array(z.string()).optional(),

  // Human action payload (v0.3: split into outcome + action)
  human_review_outcome: HumanReviewOutcome.optional(),
  human_workflow_action: HumanWorkflowAction.optional(),
  human_actor_id: z.string().optional(),
  human_notes: z.string().optional(),

  // Review/resume payload
  resume_token: z.string().optional(),
  review_package_ref: z.string().optional(),

  // Error payload
  error: PipelineError.optional(),

  // Pipeline state (v0.3: new)
  pipeline_state: PipelineLifecycleState.optional(),

  // Metadata
  pipeline_version: z.string(),
  schema_version: z.literal('0.3'),
  metadata: z.record(z.unknown()).optional(),
});

// ─── Review Package (v0.3 §6) ──────────────────────────────────
export const ReviewPackageStatus = z.enum([
  'open',         // Awaiting human review
  'completed',    // Human submitted review
  'expired',      // TTL exceeded without action
  'superseded',   // Replaced by a newer review (e.g., pipeline retried)
]);

export const ReviewPackage = z.object({
  package_id: z.string(),
  resume_token: z.string(),
  assessment_id: z.string(),
  run_id: z.string(),
  stage: PipelineStage,
  status: ReviewPackageStatus,
  version: z.number().int().min(1),

  stage_output: z.object({
    artifact_version: z.string(),
    output_hash: z.string(),
    output: z.unknown(),
  }),
  gate_result: z.object({
    decision: GateDecision,
    reasons: z.array(z.string()),
    reason_codes: z.array(z.string()),
    hard_stops_triggered: z.array(z.string()),
    confidence: ConfidenceLevel,
    confidence_score: z.number(),
  }),
  finding_ids: z.array(z.string()),
  source_document_ref: z.string(),

  created_at: z.string().datetime(),
  expires_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
  completed_by: z.string().optional(),

  review_outcome: HumanReviewOutcome.optional(),
  workflow_action: HumanWorkflowAction.optional(),
  overrides: z.array(z.object({
    field_path: z.string(),
    original_value: z.unknown(),
    new_value: z.unknown(),
    finding_id: z.string(),
  })).optional(),
  reviewer_notes: z.string().optional(),
});

// ─── Observatory Data Model ────────────────────────────────────
export const StageVerificationSummary = z.object({
  stage: PipelineStage,
  stage_duration_ms: z.number(),
  verification_duration_ms: z.number(),
  confidence: ConfidenceLevel,
  confidence_score: z.number(),
  gate_decision: GateDecision,
  gate_reasons: z.array(z.string()),
  gate_reason_codes: z.array(z.string()),
  hard_stops_triggered: z.array(z.string()),
  layers_run: z.array(VerificationLayer),
  layers_skipped: z.array(z.object({
    layer: VerificationLayer,
    reason: z.string(),
  })),
  finding_summary: z.object({
    total: z.number(),
    by_severity: z.object({
      info: z.number(),
      warning: z.number(),
      critical: z.number(),
    }),
    by_type: z.record(z.number()),
  }),
  finding_ids: z.array(z.string()),
  artifact_version: z.string(),
  human_review: z.object({
    outcome: HumanReviewOutcome,
    workflow_action: HumanWorkflowAction,
    actor_id: z.string(),
    notes: z.string().optional(),
    overrides_applied: z.number(),
    revised_artifact_version: z.string().optional(),
  }).optional(),
});

export const AssessmentVerificationSummary = z.object({
  assessment_id: z.string(),
  run_id: z.string(),
  attempt_no: z.number(),
  trust_level: z.enum(['low', 'medium', 'high']),
  overall_confidence: ConfidenceLevel,
  overall_confidence_score: z.number(),
  total_pipeline_duration_ms: z.number(),
  total_verification_duration_ms: z.number(),
  stages: z.array(StageVerificationSummary),
  human_reviews_required: z.number(),
  human_reviews_completed: z.number(),
  flags_raised: z.number(),
  flags_resolved: z.number(),
  status: z.enum(['completed', 'needs_review', 'error']),
  resume_token: z.string().optional(),
  pipeline_state: PipelineLifecycleState,
});

// ─── Inferred Types ────────────────────────────────────────────
export type PipelineStage = z.infer<typeof PipelineStage>;
export type PipelineLifecycleState = z.infer<typeof PipelineLifecycleState>;
export type EventCategory = z.infer<typeof EventCategory>;
export type VerificationLayer = z.infer<typeof VerificationLayer>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>;
export type GateDecision = z.infer<typeof GateDecision>;
export type VerifierStatus = z.infer<typeof VerifierStatus>;
export type FieldCriticality = z.infer<typeof FieldCriticality>;
export type HumanReviewOutcome = z.infer<typeof HumanReviewOutcome>;
export type HumanWorkflowAction = z.infer<typeof HumanWorkflowAction>;
export type FindingType = z.infer<typeof FindingType>;
export type EvidenceReference = z.infer<typeof EvidenceReference>;
export type VerificationFinding = z.infer<typeof VerificationFinding>;
export type PipelineError = z.infer<typeof PipelineError>;
export type ArtifactRecord = z.infer<typeof ArtifactRecord>;
export type PipelineEvent = z.infer<typeof PipelineEvent>;
export type ReviewPackageStatus = z.infer<typeof ReviewPackageStatus>;
export type ReviewPackage = z.infer<typeof ReviewPackage>;
export type StageVerificationSummary = z.infer<typeof StageVerificationSummary>;
export type AssessmentVerificationSummary = z.infer<typeof AssessmentVerificationSummary>;
