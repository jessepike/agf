# Pipeline Verification Architecture
## Event Envelope Schema & Middleware Interface Specification v0.2

**Project:** AI Risk Tools
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 14, 2026
**Status:** Draft — revised per external review, pending second review round
**Prerequisite reading:** discover-brief.md (pipeline architecture), AI-Risk-Tools-Deep-Dive-Analysis.md (Part 7: Verification Architecture)

---

## Changelog from v0.1

| Change | Source | Rationale |
|--------|--------|-----------|
| Added run lineage fields (`run_id`, `attempt_no`, `sequence_no`, `caused_by_event_id`) to event envelope | GPT + Gemini | Retries, resumed runs, and deterministic replay require lineage beyond `assessment_id` |
| Restructured `source_evidence` from free-text string to structured `EvidenceReference` object with document ID, page, char offsets | GPT | Free-text quotes cannot be programmatically verified, highlighted in UI, or compared across parser revisions |
| Added `check_id` to `VerificationFinding` | GPT | Findings need stable identifiers for automation, analytics, and regression tracking |
| Replaced linear score-based gate logic with hard-stop rules + secondary score | GPT + Gemini | Linear deductions let trivial findings mask deal-breakers. Both reviewers converged on this. |
| Made human review asynchronous — removed `waitForHumanReview()`, added `needs_review` status with resume token | GPT + Gemini | Synchronous human wait blocks the API request path and creates terrible UX |
| Made stage outputs immutable — overrides create versioned artifacts, not in-place mutations | GPT | Auditability requires distinguishing original output from human-revised output |
| Split middleware into three components: `StageExecutor`, `VerificationCoordinator`, `GateEvaluator` | GPT | Single wrapper carried too many responsibilities; hard to test and reason about |
| Added `VerifierStatus` to distinguish content quality issues from verifier system failures | GPT + Gemini | "Content is bad" and "verifier broke" require different handling |
| Added `field_criticality` to extraction schema | GPT | Gate logic needs to weight findings by field importance, not just severity |
| Added deterministic "quote exists in source" validator for Layer 1 output | GPT + Gemini (Q#8) | Both reviewers rated this as highest-value, lowest-cost addition |
| Added structured error payload to event envelope | GPT | `pipeline_error` events need structured diagnostics for production triage |
| Added `prompt_version` and `ruleset_version` to event envelope | GPT | Governance product must track which prompt and rule versions produced each result |
| Removed findings duplication between `verification_result` and `gate_decision` events | GPT + Gemini | Gate decisions now reference finding IDs, not full finding payloads |
| Narrowed Phase 1 scope: Stage 2 only, self-audit + deterministic, defer cross-model | GPT + Gemini | Both reviewers said full multi-stage verification is over-engineered for Phase 1 |
| Deferred multimodal parse verification (Stage 1 cross-model) | GPT | Expensive, messy, and deterministic parse health checks are sufficient for Phase 1 |
| Deferred stream sink architecture | GPT | Not relevant until event volume and real-time consumption demand it |
| Deferred trust ladder sophistication | GPT + Gemini | Premature without baseline calibration data; default to `medium`, simple rules only |

### Deferred by Design (heard, intentionally parked)

| Item | Reviewer | Why Deferred |
|------|----------|-------------|
| Multi-vendor cross-model verification (non-Anthropic) | Gemini | Adds API complexity; same-vendor different-model is acceptable for Phase 1. Revisit Phase 2. |
| PostgreSQL event sink from day 1 | Gemini | JSON file sink is adequate at Phase 1 volume (<1,000 assessments/mo). Sink interface is stable; swap implementation when analytics demand it. |
| Full six-stage verification rollout in Phase 1 | Both | Phase 1 proves the pattern on Stage 2. Extend to other stages in Phase 1A+. |
| Embedding-based trust level assignment | GPT | Requires baseline data that doesn't exist yet. Conservative rule-based assignment first. |
| `tenant_id` in event schema | GPT | Multi-tenancy is Phase 2. Field is defined but optional; no implementation until needed. |

---

## 1. Purpose

This document specifies the event envelope schema and verification middleware interface for the AI Risk Tools assessment pipeline. It defines:

1. The common event schema emitted by all pipeline stages and verification layers
2. The middleware interface that wraps each pipeline stage (split into Executor, Coordinator, Evaluator)
3. The verification layer contracts for Stage 2 (Extraction) as the reference implementation
4. The gate logic — hard-stop rules with secondary scoring — that determines proceed/flag/halt decisions
5. The asynchronous human review and resume model
6. The observatory data model for UI consumption and retrospective analysis

This is a **Phase 1A enhancement** to the existing 6-stage pipeline. It does not change the pipeline's functional behavior — it adds observability, verification, and quality gating around the existing stages.

---

## 2. Design Principles

1. **Events are structured, not strings.** Every event follows a typed schema. No unstructured log lines.
2. **Events are immutable.** Once emitted, events are never modified. Corrections are new events that reference the original.
3. **Emission is decoupled from consumption.** Pipeline stages emit events through a stable interface. What consumes them (JSON file, database, analytics engine) is a downstream concern.
4. **Verification is middleware, not a separate system.** Verification runs at stage boundaries within the pipeline flow. It is not a parallel process that races the pipeline.
5. **The verification mix is stage-appropriate.** Not every stage needs every verification layer. The middleware is configurable per stage.
6. **Stage outputs are immutable.** Human overrides create new artifact versions, not in-place mutations.
7. **Human review is asynchronous.** The pipeline never blocks waiting for a human. It persists state, returns a review request, and resumes on command.
8. **Verification failures are distinct from content quality issues.** "The extraction is bad" and "the verifier timed out" are different conditions with different handling.
9. **Latency is budgeted.** Each verification layer has a time budget. Full verification adds ~8-16 seconds (Phase 1, self-audit + deterministic on Stage 2 only).

---

## 3. Event Envelope Schema

Every event emitted by the pipeline — stage outputs, verification results, gate decisions, human actions — follows this common envelope.

### 3.1 TypeScript / Zod Definition

```typescript
import { z } from 'zod';

// ─── Event Categories ───────────────────────────────────────────
export const EventCategory = z.enum([
  'stage_start',        // Pipeline stage began processing
  'stage_complete',     // Pipeline stage finished producing output
  'verification_start', // A verification layer began
  'verification_result',// A verification layer produced findings
  'gate_decision',      // The stage gate made a proceed/flag/halt decision
  'human_action',       // A human reviewed, overrode, or confirmed something
  'pipeline_start',     // Full pipeline run initiated
  'pipeline_complete',  // Full pipeline run finished
  'pipeline_error',     // Pipeline encountered an unrecoverable error
  'review_requested',   // Pipeline halted and is awaiting human review (v0.2)
  'pipeline_resumed',   // Pipeline resumed after human review (v0.2)
]);

// ─── Verification Layers ────────────────────────────────────────
export const VerificationLayer = z.enum([
  'self_audit',         // Layer 1: Same-model grounding check
  'cross_model',        // Layer 2: Different-model adversarial check
  'deterministic',      // Layer 3: Rule-based validators
]);

// ─── Pipeline Stages ────────────────────────────────────────────
export const PipelineStage = z.enum([
  'parse',              // Stage 1: Document parsing
  'extraction',         // Stage 2: LLM extraction to AssessmentContext
  'regulatory',         // Stage 3: Regulatory applicability
  'framework',          // Stage 4: Framework recommendation
  'risk_identification',// Stage 5: Risk identification and ranking
  'action_plan',        // Stage 6: Recommendations and action plan
]);

// ─── Confidence Level ───────────────────────────────────────────
export const ConfidenceLevel = z.enum([
  'high',     // All checks passed, no flags
  'medium',   // Minor flags, no hard-stop triggers
  'low',      // Significant flags or hard-stop triggered
  'unverified', // Verification could not complete (verifier failure) (v0.2: renamed from 'failed')
]);

// ─── Gate Decision ──────────────────────────────────────────────
export const GateDecision = z.enum([
  'auto_proceed',       // All checks passed, continue to next stage
  'proceed_with_flags', // Minor issues noted, continue but flag for review
  'needs_review',       // Significant issues, pipeline paused for human review (v0.2: renamed)
  'halt_error',         // Unrecoverable system error, pipeline cannot continue
]);

// ─── Verifier Status ────────────────────────────────────────────
// v0.2: Distinguishes content quality from verifier system health
export const VerifierStatus = z.enum([
  'completed',          // Verifier ran successfully, findings reflect content quality
  'timeout',            // Verifier timed out
  'error',              // Verifier encountered an error
  'skipped',            // Verifier was skipped (trust level, mode, or config)
  'unavailable',        // Verifier service/model unavailable
]);

// ─── Human Action Type ──────────────────────────────────────────
export const HumanActionType = z.enum([
  'confirmed',          // Human reviewed and confirmed the output as-is
  'overridden',         // Human changed a value (creates new artifact version)
  'dismissed_flag',     // Human reviewed a flag and dismissed it
  'escalated',          // Human escalated for additional review
  'released',           // Human released pipeline to continue after halt
]);

// ─── Field Criticality ──────────────────────────────────────────
// v0.2: Enables gate logic to weight findings by field importance
export const FieldCriticality = z.enum([
  'required_material',  // Must be correct — gate halts if flagged critical
  'required_supporting',// Should be correct — gate flags but may proceed
  'optional',           // Nice to have — info-level findings only
]);

// ─── Evidence Reference ─────────────────────────────────────────
// v0.2: Replaces free-text source_evidence with structured reference
export const EvidenceReference = z.object({
  document_id: z.string(),                   // Reference to source document
  page: z.number().optional(),               // Page number (if PDF)
  char_start: z.number().optional(),         // Character offset start
  char_end: z.number().optional(),           // Character offset end
  quote: z.string().optional(),              // Normalized quote (≤100 chars)
  quote_verified: z.boolean().optional(),    // v0.2: Did deterministic check confirm quote exists in source?
});

// ─── Verification Finding ───────────────────────────────────────
export const VerificationFinding = z.object({
  finding_id: z.string(),
  check_id: z.string(),                      // v0.2: Stable identifier for the check that produced this finding
  field_path: z.string().optional(),         // JSONPath to the specific field (e.g., "context.sector")
  field_criticality: FieldCriticality.optional(), // v0.2: How important is this field?
  finding_type: z.enum([
    'ungrounded',        // Field value not supported by source text
    'cross_model_disagreement', // Models produced different values
    'missing_extraction', // Something in source text was not extracted
    'consistency_error',  // Extracted values contradict each other
    'completeness_gap',   // Required or expected field is empty/missing
    'confidence_below_threshold', // Field confidence below acceptable level
    'rule_violation',     // Deterministic rule check failed
    'grounding_quote_missing', // v0.2: Self-audit quoted text not found in source
  ]),
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string(),                   // Human-readable explanation
  evidence_refs: z.array(EvidenceReference).optional(), // v0.2: Structured evidence references
  expected_value: z.string().optional(),      // What the verifier thinks it should be
  actual_value: z.string().optional(),        // What the stage produced
  resolution: z.enum([
    'pending',           // Not yet addressed
    'auto_resolved',     // Resolved by verification logic
    'human_resolved',    // Resolved by human review
    'accepted_as_is',    // Flag acknowledged, value kept
  ]).default('pending'),
});

// ─── Structured Error ───────────────────────────────────────────
// v0.2: Structured error payload for pipeline_error events
export const PipelineError = z.object({
  error_code: z.string(),                    // Machine-readable error code
  error_class: z.enum([
    'parse_failure',       // Document parsing failed
    'extraction_failure',  // LLM extraction failed
    'verification_failure',// Verification layer failed (not content — system)
    'gate_failure',        // Gate evaluation failed
    'model_unavailable',   // LLM model unreachable
    'timeout',             // Operation timed out
    'schema_validation',   // Output failed schema validation
    'internal',            // Unexpected internal error
  ]),
  retryable: z.boolean(),
  message: z.string(),
  failed_component: z.string(),              // Which stage/layer/module failed
  diagnostics_ref: z.string().optional(),    // Reference to detailed diagnostics (not inline)
});

// ─── The Event Envelope ─────────────────────────────────────────
export const PipelineEvent = z.object({
  // Identity & Lineage (v0.2: expanded)
  event_id: z.string(),                      // Unique event ID (ULID)
  assessment_id: z.string(),                 // Ties to the overall assessment
  run_id: z.string(),                        // v0.2: Specific execution run (new run on resume/retry)
  attempt_no: z.number().int().min(1),       // v0.2: Which attempt (1 = first, 2 = retry, etc.)
  sequence_no: z.number().int().min(0),      // v0.2: Monotonic per-run event index
  caused_by_event_id: z.string().optional(), // v0.2: Event that triggered this event (for resume/retry chains)
  tenant_id: z.string().optional(),          // Multi-tenancy (Phase 2)

  // Classification
  category: EventCategory,
  stage: PipelineStage.optional(),           // Which pipeline stage (absent for pipeline-level events)
  verification_layer: VerificationLayer.optional(), // Which layer (only for verification events)

  // Timing
  timestamp: z.string().datetime(),          // ISO 8601 UTC
  duration_ms: z.number().optional(),        // How long this event's operation took

  // Context
  model_id: z.string().optional(),           // Which LLM model was used (if applicable)
  model_version: z.string().optional(),      // Model version string
  input_hash: z.string().optional(),         // SHA-256 of stage input (for reproducibility)
  output_hash: z.string().optional(),        // SHA-256 of stage output

  // Version references (v0.2: track what produced this result)
  prompt_version: z.string().optional(),     // v0.2: Which prompt version was used
  ruleset_version: z.string().optional(),    // v0.2: Which rule/validator version was used
  taxonomy_version: z.string().optional(),   // v0.2: Which risk taxonomy version (MIT AIRISK, OWASP)
  framework_version: z.string().optional(),  // v0.2: Which framework data version (NIST AI RMF)

  // Verification payload
  confidence: ConfidenceLevel.optional(),
  confidence_score: z.number().min(0).max(1).optional(), // Secondary signal — not used for gating
  gate_decision: GateDecision.optional(),
  verifier_status: VerifierStatus.optional(), // v0.2: Verifier health status
  finding_ids: z.array(z.string()).optional(), // v0.2: References to findings (not full payloads)
  finding_count: z.object({
    info: z.number().default(0),
    warning: z.number().default(0),
    critical: z.number().default(0),
  }).optional(),

  // Gate reasoning (v0.2: explicit disposition)
  gate_reasons: z.array(z.string()).optional(), // v0.2: Why the gate decided what it decided

  // Human action payload
  human_action: HumanActionType.optional(),
  human_actor_id: z.string().optional(),
  human_notes: z.string().optional(),

  // Review/resume payload (v0.2)
  resume_token: z.string().optional(),       // v0.2: Token to resume pipeline after review
  review_package_ref: z.string().optional(), // v0.2: Reference to persisted review package

  // Error payload (v0.2)
  error: PipelineError.optional(),           // v0.2: Structured error (only for pipeline_error events)

  // Metadata
  pipeline_version: z.string(),
  schema_version: z.literal('0.2'),          // v0.2
  metadata: z.record(z.unknown()).optional(),
});

export type PipelineEvent = z.infer<typeof PipelineEvent>;
export type VerificationFinding = z.infer<typeof VerificationFinding>;
export type EvidenceReference = z.infer<typeof EvidenceReference>;
export type PipelineError = z.infer<typeof PipelineError>;
```

### 3.2 Schema Notes

- **run_id** (v0.2): Distinct from `assessment_id`. A single assessment may have multiple runs — initial run, resumed after review, retried after error. Each run gets a unique `run_id`. All runs for the same assessment share `assessment_id`.
- **attempt_no** (v0.2): Starts at 1. Increments on retry. Distinguishes "first try" from "second try after fixing something."
- **sequence_no** (v0.2): Monotonic counter within a run. Enables deterministic ordering even if ULID timestamps collide under high-throughput future scenarios.
- **caused_by_event_id** (v0.2): Links resume/retry events to the event that caused them (e.g., a `pipeline_resumed` event links to the `review_requested` event that paused it).
- **finding_ids vs. findings** (v0.2): Gate decision events now reference finding IDs, not full finding payloads. Findings are emitted once in `verification_result` events and referenced by ID elsewhere. Eliminates payload duplication.
- **prompt_version / ruleset_version** (v0.2): Critical for answering "why did this assessment produce X on March 14 but Y on April 7?" Must be populated on every LLM and rule-based event.
- **quote_verified** on EvidenceReference (v0.2): Set by the deterministic "grounding quote exists" validator. `true` = quote found in source via substring match. `false` = quote not found. `undefined` = check not yet run.
- **metadata bag**: Extensible catch-all. Convention: keys must be namespaced (e.g., `stage2.raw_extraction_tokens`, `verifier.model_temperature`). Unenforced in Phase 1; lint rule in Phase 2.

---

## 4. Middleware Interface

v0.2 splits the middleware into three components with distinct responsibilities.

### 4.1 Component Contracts

```typescript
// ─── Stage Executor ─────────────────────────────────────────────
// Runs the pipeline stage and emits raw execution events.
// Single responsibility: execute and report.
interface StageExecutor<TInput, TOutput> {
  execute(
    input: TInput,
    context: PipelineContext,
  ): Promise<StageOutput<TOutput>>;
}

interface StageOutput<TOutput> {
  output: TOutput;
  output_hash: string;
  duration_ms: number;
  artifact_version: string;  // v0.2: Immutable version ID for this output
}

// ─── Verification Coordinator ───────────────────────────────────
// Runs applicable verification layers and produces a VerificationBundle.
// Single responsibility: verify and report.
interface VerificationCoordinator<TOutput> {
  verify(
    stage_output: StageOutput<TOutput>,
    context: PipelineContext,
    config: StageVerificationConfig,
  ): Promise<VerificationBundle>;
}

interface VerificationBundle {
  layers_run: LayerResult[];
  layers_skipped: { layer: VerificationLayer; reason: string }[];
  all_findings: VerificationFinding[];
  finding_store_ref: string;  // v0.2: Where findings are persisted
}

interface LayerResult {
  layer: VerificationLayer;
  status: VerifierStatus;     // v0.2: completed | timeout | error | skipped
  confidence: ConfidenceLevel;
  confidence_score: number;
  findings: VerificationFinding[];
  duration_ms: number;
}

// ─── Gate Evaluator ─────────────────────────────────────────────
// Turns a VerificationBundle into a gate decision.
// Single responsibility: decide and explain.
interface GateEvaluator {
  evaluate(
    bundle: VerificationBundle,
    config: GateConfig,
  ): GateResult;
}

interface GateResult {
  decision: GateDecision;
  reasons: string[];          // v0.2: Explicit reasons for the decision
  hard_stops_triggered: string[]; // v0.2: Which hard-stop rules fired
  confidence: ConfidenceLevel;
  confidence_score: number;   // Secondary signal only
}
```

### 4.2 Pipeline Context (v0.2: expanded)

```typescript
interface PipelineContext {
  assessment_id: string;
  run_id: string;                // v0.2
  attempt_no: number;            // v0.2
  tenant_id?: string;
  pipeline_version: string;
  source_document: {
    document_id: string;         // v0.2: Stable reference for evidence linking
    text: string;
    metadata: DocumentMeta;
  };
  verification_mode: VerificationMode;
  trust_level: TrustLevel;
  event_emitter: EventEmitter;
  sequence_counter: () => number; // v0.2: Monotonic sequence generator
}

type VerificationMode = 'express' | 'observatory';
type TrustLevel = 'low' | 'medium' | 'high';
```

### 4.3 Middleware Orchestration Flow (v0.2: async review)

```typescript
async function executeStageWithVerification<TInput, TOutput>(
  executor: StageExecutor<TInput, TOutput>,
  coordinator: VerificationCoordinator<TOutput>,
  evaluator: GateEvaluator,
  input: TInput,
  config: StageVerificationConfig,
  context: PipelineContext,
): Promise<StageResult<TOutput>> {

  // 1. Execute the stage
  emit(context, { category: 'stage_start', stage: config.stage, input_hash: hash(input) });

  const stageOutput = await executor.execute(input, context);

  emit(context, {
    category: 'stage_complete',
    stage: config.stage,
    output_hash: stageOutput.output_hash,
    duration_ms: stageOutput.duration_ms,
  });

  // 2. Run verification
  const bundle = await coordinator.verify(stageOutput, context, config);

  // (Verification events emitted internally by coordinator per layer)

  // 3. Evaluate gate
  const gate = evaluator.evaluate(bundle, config.gate);

  emit(context, {
    category: 'gate_decision',
    stage: config.stage,
    gate_decision: gate.decision,
    confidence: gate.confidence,
    confidence_score: gate.confidence_score,
    finding_ids: bundle.all_findings.map(f => f.finding_id),
    finding_count: countFindings(bundle.all_findings),
    gate_reasons: gate.reasons,
  });

  // 4. Handle gate decision
  switch (gate.decision) {
    case 'auto_proceed':
    case 'proceed_with_flags':
      // Continue — flags are logged, not blocking
      return {
        output: stageOutput.output,
        artifact_version: stageOutput.artifact_version,
        verification: buildSummary(bundle, gate),
        status: 'completed',
      };

    case 'needs_review': {
      // v0.2: ASYNC — persist state, return review request, do NOT block
      const resumeToken = generateResumeToken(context, config.stage);
      const reviewPackage = await persistReviewPackage({
        assessment_id: context.assessment_id,
        run_id: context.run_id,
        stage: config.stage,
        stage_output: stageOutput,
        verification_bundle: bundle,
        gate_result: gate,
        resume_token: resumeToken,
      });

      emit(context, {
        category: 'review_requested',
        stage: config.stage,
        resume_token: resumeToken,
        review_package_ref: reviewPackage.ref,
        finding_ids: gate.hard_stops_triggered.length > 0
          ? bundle.all_findings.filter(f => f.severity === 'critical').map(f => f.finding_id)
          : bundle.all_findings.filter(f => f.severity !== 'info').map(f => f.finding_id),
      });

      return {
        output: stageOutput.output,
        artifact_version: stageOutput.artifact_version,
        verification: buildSummary(bundle, gate),
        status: 'needs_review',
        resume_token: resumeToken,
        review_package_ref: reviewPackage.ref,
      };
    }

    case 'halt_error':
      throw new PipelineVerificationError(config.stage, gate);
  }
}
```

### 4.4 Resume Flow (v0.2: new)

```typescript
// Called when a human completes review and releases the pipeline
async function resumeAfterReview(
  resumeToken: string,
  humanResult: HumanReviewResult,
  context: PipelineContext,
): Promise<StageResult<TOutput>> {

  const reviewPackage = await loadReviewPackage(resumeToken);

  emit(context, {
    category: 'pipeline_resumed',
    stage: reviewPackage.stage,
    caused_by_event_id: reviewPackage.review_requested_event_id,
  });

  emit(context, {
    category: 'human_action',
    stage: reviewPackage.stage,
    human_action: humanResult.action,
    human_actor_id: humanResult.actor_id,
    human_notes: humanResult.notes,
  });

  // If human overrode values, create a new artifact version
  // Original stage output is NEVER mutated
  let finalOutput = reviewPackage.stage_output;
  let artifactVersion = reviewPackage.stage_output.artifact_version;

  if (humanResult.action === 'overridden' && humanResult.overrides) {
    const revisedOutput = applyOverrides(reviewPackage.stage_output.output, humanResult.overrides);
    artifactVersion = generateArtifactVersion(); // New version ID
    finalOutput = {
      ...reviewPackage.stage_output,
      output: revisedOutput,
      artifact_version: artifactVersion,
      output_hash: hash(revisedOutput),
      // original_artifact_version preserved in review package for audit trail
    };
  }

  return {
    output: finalOutput.output,
    artifact_version: artifactVersion,
    verification: reviewPackage.verification_summary,
    status: 'completed',
  };
}

interface HumanReviewResult {
  action: HumanActionType;
  actor_id: string;
  notes?: string;
  overrides?: Array<{
    field_path: string;
    original_value: unknown;
    new_value: unknown;
    finding_id: string;     // Which finding prompted this override
  }>;
}
```

---

## 5. Gate Logic (v0.2: Hard-Stop Rules + Secondary Score)

### 5.1 Design Change from v0.1

v0.1 used linear score deductions to drive gate decisions. Both external reviewers identified this as too naive — findings are not interchangeable, and aggregate scoring can hide deal-breakers.

v0.2 uses a two-tier system:

**Tier 1: Hard-stop rules.** These are absolute conditions that trigger `needs_review` regardless of aggregate score. They cannot be overridden by a high score.

**Tier 2: Secondary score.** The numeric confidence score is still computed for dashboard display, trend analysis, and calibration research. But it does not drive the gate decision.

### 5.2 Hard-Stop Rules

```typescript
interface HardStopRule {
  id: string;
  description: string;
  triggers_decision: 'needs_review' | 'halt_error';
  check: (findings: VerificationFinding[], layerResults: LayerResult[]) => boolean;
}

const universalHardStops: HardStopRule[] = [
  {
    id: 'critical_on_required_material',
    description: 'Any critical finding on a required_material field',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.severity === 'critical' && f.field_criticality === 'required_material'
    ),
  },
  {
    id: 'contradiction_on_required',
    description: 'Consistency error on any required field',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.finding_type === 'consistency_error'
      && (f.field_criticality === 'required_material' || f.field_criticality === 'required_supporting')
    ),
  },
  {
    id: 'missing_required_material',
    description: 'Required material field is empty or missing',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.finding_type === 'completeness_gap' && f.field_criticality === 'required_material'
    ),
  },
  {
    id: 'grounding_quote_fabricated',
    description: 'Self-audit quoted text not found in source document',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.finding_type === 'grounding_quote_missing'
    ),
  },
  {
    id: 'mandatory_verifier_failed',
    description: 'A required verification layer failed to complete',
    triggers_decision: 'needs_review',
    check: (_, layerResults) => layerResults.some(r =>
      r.status !== 'completed' && r.status !== 'skipped'
    ),
  },
];
```

### 5.3 Gate Evaluation Logic

```typescript
function evaluateGate(
  bundle: VerificationBundle,
  hardStops: HardStopRule[],
): GateResult {
  const triggeredStops: string[] = [];
  const reasons: string[] = [];

  // Tier 1: Check hard stops
  for (const rule of hardStops) {
    if (rule.check(bundle.all_findings, bundle.layers_run)) {
      triggeredStops.push(rule.id);
      reasons.push(rule.description);

      if (rule.triggers_decision === 'halt_error') {
        return {
          decision: 'halt_error',
          reasons,
          hard_stops_triggered: triggeredStops,
          confidence: 'low',
          confidence_score: computeSecondaryScore(bundle),
        };
      }
    }
  }

  if (triggeredStops.length > 0) {
    return {
      decision: 'needs_review',
      reasons,
      hard_stops_triggered: triggeredStops,
      confidence: 'low',
      confidence_score: computeSecondaryScore(bundle),
    };
  }

  // Tier 2: No hard stops — use finding severity for proceed vs. proceed_with_flags
  const hasWarnings = bundle.all_findings.some(f => f.severity === 'warning');
  const hasCriticals = bundle.all_findings.some(f => f.severity === 'critical');

  if (hasCriticals) {
    // Critical on non-required field — warn but proceed
    reasons.push('Critical finding(s) on non-material fields');
    return {
      decision: 'proceed_with_flags',
      reasons,
      hard_stops_triggered: [],
      confidence: 'medium',
      confidence_score: computeSecondaryScore(bundle),
    };
  }

  if (hasWarnings) {
    reasons.push('Warning-level findings present');
    return {
      decision: 'proceed_with_flags',
      reasons,
      hard_stops_triggered: [],
      confidence: 'medium',
      confidence_score: computeSecondaryScore(bundle),
    };
  }

  reasons.push('All checks passed');
  return {
    decision: 'auto_proceed',
    reasons,
    hard_stops_triggered: [],
    confidence: 'high',
    confidence_score: computeSecondaryScore(bundle),
  };
}

// Secondary score — for dashboards and trend analysis, NOT for gating
function computeSecondaryScore(bundle: VerificationBundle): number {
  let score = 1.0;
  for (const finding of bundle.all_findings) {
    switch (finding.severity) {
      case 'info': score -= 0.01; break;
      case 'warning': score -= 0.05; break;
      case 'critical': score -= 0.15; break;
    }
  }
  return Math.max(0, Math.round(score * 100) / 100);
}
```

---

## 6. Stage 2 (Extraction) — Reference Implementation

### 6.1 Field Criticality Map

v0.2 adds field criticality to enable weighted gate logic.

```typescript
const extractionFieldCriticality: Record<string, FieldCriticality> = {
  'context.project_name':     'required_material',
  'context.description':      'required_material',
  'context.sector':           'required_material',   // Drives regulatory applicability
  'context.geography':        'required_material',   // Drives regulatory applicability
  'context.use_cases':        'required_material',   // Drives risk identification
  'context.data_types':       'required_supporting',
  'context.lifecycle_stage':  'required_supporting',  // Drives framework filtering
  'context.stakeholders':     'optional',
  'context.deployment_model': 'required_supporting',
  'context.ai_techniques':    'optional',
};
```

### 6.2 Layer 1: Self-Audit (Source Grounding)

Unchanged from v0.1 in purpose and method. Key v0.2 changes:

- Self-audit must return structured `EvidenceReference` objects, not free-text quotes
- Each `EvidenceReference` must include `char_start` and `char_end` when available
- Quote text is normalized (trimmed, ≤100 chars)

**Prompt structure (v0.2: updated output format):**
```
You are a verification agent. You have been given:
1. A source document (with character offsets available)
2. A structured extraction from that document

For each field in the extraction, do ONE of:
- GROUNDED: Quote the exact passage (≤100 chars) and provide the approximate
  character offset range where it appears in the source
- INFERRED: Explain what in the document led to this inference
- CONTRADICTED: Quote the passage that contradicts this value
- MISSING: Identify information in the document that should have been
  extracted but was not captured in any field

Return structured JSON with EvidenceReference objects for each grounded field.
```

### 6.3 Layer 3: Deterministic Validators (v0.2: includes grounding quote check)

All validators from v0.1 are retained. v0.2 adds:

```typescript
const extractionValidators: DeterministicValidator[] = [
  // ... (v0.1 validators: keyword_coverage, geography_consistency,
  //       use_case_completeness, field_completeness, confidence_calibration)

  // v0.2: NEW — Grounding quote verification
  {
    id: 'grounding_quote_exists',
    description: 'Verify that every quote from Layer 1 self-audit actually appears in the source document',
    check: (output, context, selfAuditFindings) => {
      const findings: VerificationFinding[] = [];
      for (const auditFinding of selfAuditFindings) {
        if (!auditFinding.evidence_refs) continue;
        for (const ref of auditFinding.evidence_refs) {
          if (!ref.quote) continue;
          // Normalize whitespace for comparison
          const normalizedQuote = ref.quote.replace(/\s+/g, ' ').trim().toLowerCase();
          const normalizedSource = context.source_document.text.replace(/\s+/g, ' ').trim().toLowerCase();
          if (!normalizedSource.includes(normalizedQuote)) {
            findings.push({
              finding_id: generateFindingId(),
              check_id: 'grounding_quote_exists',
              field_path: auditFinding.field_path,
              field_criticality: extractionFieldCriticality[auditFinding.field_path ?? ''],
              finding_type: 'grounding_quote_missing',
              severity: 'critical',  // Fabricated evidence is always critical
              description: `Self-audit quoted "${ref.quote}" but this text was not found in the source document`,
              evidence_refs: [ref],
              actual_value: ref.quote,
              resolution: 'pending',
            });
          } else {
            // Mark quote as verified
            ref.quote_verified = true;
          }
        }
      }
      return findings;
    }
  },
];
```

### 6.4 Layer 2: Cross-Model Verification

Deferred to Phase 2. Same-vendor different-model approach (Haiku extraction, Sonnet verification). Documented here for completeness; not built in Phase 1.

---

## 7. Event Sink Interface

Unchanged from v0.1. JSON file sink for Phase 1. PostgreSQL in Phase 2. Interface is stable; implementation swaps cleanly.

```typescript
interface EventSink {
  emit(event: PipelineEvent): Promise<void>;
  flush(): Promise<void>;
  getEvents(assessment_id: string): Promise<PipelineEvent[]>;
  getEventsByStage(assessment_id: string, stage: PipelineStage): Promise<PipelineEvent[]>;
  getEventsByRun(run_id: string): Promise<PipelineEvent[]>; // v0.2
}

// v0.2: Separate store for findings (referenced by ID from events)
interface FindingStore {
  persist(findings: VerificationFinding[]): Promise<void>;
  getFindings(finding_ids: string[]): Promise<VerificationFinding[]>;
  getFindingsByAssessment(assessment_id: string): Promise<VerificationFinding[]>;
}

// v0.2: Separate store for review packages
interface ReviewPackageStore {
  persist(pkg: ReviewPackage): Promise<string>; // Returns ref
  load(resume_token: string): Promise<ReviewPackage>;
}
```

---

## 8. Observatory Data Model

### 8.1 Verification Summary (per stage)

```typescript
interface StageVerificationSummary {
  stage: PipelineStage;
  stage_duration_ms: number;
  verification_duration_ms: number;
  confidence: ConfidenceLevel;
  confidence_score: number;       // Secondary signal
  gate_decision: GateDecision;
  gate_reasons: string[];         // v0.2: Why the gate decided what it decided
  hard_stops_triggered: string[]; // v0.2: Which hard-stop rules fired
  layers_run: VerificationLayer[];
  layers_skipped: { layer: VerificationLayer; reason: string }[];  // v0.2
  finding_summary: {
    total: number;
    by_severity: { info: number; warning: number; critical: number };
    by_type: Record<string, number>;
  };
  finding_ids: string[];          // v0.2: Reference IDs, not full payloads
  artifact_version: string;       // v0.2: Which version of the stage output
  human_review?: {
    action: HumanActionType;
    actor_id: string;
    notes?: string;
    overrides_applied: number;
    revised_artifact_version?: string; // v0.2: New version if overrides applied
  };
}
```

### 8.2 Assessment Verification Summary (full pipeline)

```typescript
interface AssessmentVerificationSummary {
  assessment_id: string;
  run_id: string;                   // v0.2
  attempt_no: number;               // v0.2
  verification_mode: VerificationMode;
  trust_level: TrustLevel;
  overall_confidence: ConfidenceLevel;
  overall_confidence_score: number;
  total_pipeline_duration_ms: number;
  total_verification_duration_ms: number;
  stages: StageVerificationSummary[];
  human_reviews_required: number;
  human_reviews_completed: number;
  flags_raised: number;
  flags_resolved: number;
  status: 'completed' | 'needs_review' | 'error'; // v0.2
  resume_token?: string;             // v0.2: If needs_review
}
```

---

## 9. Verification Adaptation by Stage

Unchanged from v0.1 as a roadmap. Phase 1 implements Stage 2 only. Stage-specific plans for Stages 1, 3, 4, 5, 6 remain as documented in v0.1 Section 8 for reference.

---

## 10. Cost and Latency Impact (v0.2: Phase 1 only)

### Phase 1 cost (Stage 2: self-audit + deterministic only)

| Layer | Calls | Estimated cost |
|-------|-------|----------------|
| Self-audit (Haiku-class) | 1 | ~$0.01-0.03 |
| Deterministic | 0 LLM calls | $0.00 |
| **Total added** | **1 LLM call** | **~$0.01-0.03** |

Current pipeline COGS: ~$0.50/assessment
Phase 1 verification adds: ~$0.01-0.03
**Phase 1 total: ~$0.51-0.53/assessment**

### Phase 1 latency

| Layer | Time |
|-------|------|
| Self-audit | ~2-4s |
| Deterministic (incl. grounding quote check) | <50ms |
| **Total added** | **~2-4s** |

Negligible impact on user experience.

---

## 11. Open Questions (v0.2: updated per external review)

### Resolved from v0.1

| # | Question | Resolution |
|---|----------|-----------|
| 1 | Cross-model independence | Same-vendor acceptable for Phase 1. Revisit Phase 2 with optional alternate-vendor spot checks. |
| 2 | Confidence score aggregation | Score is now secondary signal only. Hard-stop rules drive gating. Score retained for dashboards and calibration research. |
| 3 | Gate threshold tuning | Replaced with hard-stop rules. No thresholds to tune for Phase 1. Secondary score calibration deferred to 50-100 assessment dataset. |
| 6 | Human review UX in Express mode | Async model resolves this. Pipeline returns `needs_review` status; UI transitions from "Processing..." to "Action Required" naturally. |
| 8 | Verification of verification | Implemented. `grounding_quote_exists` deterministic validator confirms Layer 1 quotes via substring match. |

### Remaining / New

| # | Question | Context |
|---|----------|---------|
| 4 | **Trust level assignment:** Default to `medium` for Phase 1. `low` for parse anomalies or high missing-field rates. `high` only after conservative operational evidence. What is "conservative" — 10 assessments? 50? | Needs calibration data. |
| 5 | **Verification prompt stability:** Self-audit prompt needs its own eval suite and golden test cases. When to build this? Before or after first pilot? | GPT says treat as first-class asset. Agree. |
| 9 | **Stale data propagation (v0.2):** If human overrides Stage 2 output, downstream stages used the original input. Must downstream stages re-run, or are they explicitly marked as "based on pre-override data"? | Gemini raised. Needs clear invalidation policy. |
| 10 | **Review package retention (v0.2):** How long do persisted review packages live? They contain stage output, verification evidence, and potentially sensitive document content. Retention/redaction policy needed. | GPT flagged security/privacy concern. |
| 11 | **Shadow Mode calibration (v0.2):** Before turning gate enforcement on, run the pipeline in "shadow mode" — compute flags and decisions but force `auto_proceed` on everything. Review logs after N runs to validate gate logic before enforcement. How many runs? What document diversity? | Gemini proposed. Smart calibration approach. |

---

## 12. Implementation Sequence (v0.2: tightened)

### Phase 1A (build now — Stage 2 only)

1. Define event envelope Zod schema (Section 3 — v0.2)
2. Define VerificationFinding + EvidenceReference schemas
3. Implement EventSink + FindingStore interfaces with JSON file backend
4. Wire event emission into existing pipeline stages (stage_start, stage_complete for all 6 stages)
5. Implement field criticality map for Stage 2 extraction
6. Implement Stage 2 deterministic validators (including `grounding_quote_exists`)
7. Implement Stage 2 self-audit verification layer with structured EvidenceReference output
8. Implement hard-stop gate rules for Stage 2
9. Implement StageExecutor / VerificationCoordinator / GateEvaluator for Stage 2
10. Build AssessmentVerificationSummary for API response
11. **Shadow mode**: Run with verification active but gate always auto-proceeding. Log everything. Do NOT enforce halts until calibrated.

### Phase 1A+ (fast follow — after shadow mode calibration)

12. Enable gate enforcement on Stage 2
13. Implement async review/resume flow (ReviewPackageStore, resume endpoint)
14. Extend deterministic validators to Stages 1, 3, 5, 6
15. Extend self-audit to Stages 3, 5, 6
16. Add verification summary to dashboard UI (collapsed by default)

### Phase 2

17. Cross-model verification (Layer 2) on Stages 2, 3, 5, 6
18. Observatory UI with expandable stage panels
19. Human review gate UI with override capture
20. Trust-confidence ladder with empirical thresholds
21. PostgreSQL event sink + finding store
22. Downstream invalidation policy (re-run vs. mark stale)
23. Self-audit prompt eval suite and regression tests
24. Basic observatory analytics queries

---

*Specification v0.2 — March 14, 2026. Revised per external review from GPT-4o and Gemini. Schema and interface definitions are TypeScript/Zod pseudocode intended to communicate structure, not production-ready implementations. Changes from v0.1 tracked in changelog.*
