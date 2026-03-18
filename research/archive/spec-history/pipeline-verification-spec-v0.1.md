# Pipeline Verification Architecture
## Event Envelope Schema & Middleware Interface Specification v0.1

**Project:** AI Risk Tools
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 14, 2026
**Status:** Draft — pending external review
**Prerequisite reading:** discover-brief.md (pipeline architecture), AI-Risk-Tools-Deep-Dive-Analysis.md (Part 6: Verification Architecture)

---

## 1. Purpose

This document specifies the event envelope schema and verification middleware interface for the AI Risk Tools assessment pipeline. It defines:

1. The common event schema emitted by all pipeline stages and verification layers
2. The middleware interface that wraps each pipeline stage
3. The verification layer contracts for Stage 2 (Extraction) as the reference implementation
4. The gate logic that determines proceed/flag/halt decisions
5. The observatory data model for UI consumption and retrospective analysis

This is a **Phase 1A enhancement** to the existing 6-stage pipeline. It does not change the pipeline's functional behavior — it adds observability, verification, and quality gating around the existing stages.

---

## 2. Design Principles

1. **Events are structured, not strings.** Every event follows a typed schema. No unstructured log lines.
2. **Events are immutable.** Once emitted, events are never modified. Corrections are new events that reference the original.
3. **Emission is decoupled from consumption.** Pipeline stages emit events through a stable interface. What consumes them (JSON file, database, analytics engine) is a downstream concern.
4. **Verification is middleware, not a separate system.** Verification runs at stage boundaries within the pipeline flow. It can halt progression. It is not a parallel process that races the pipeline.
5. **The verification mix is stage-appropriate.** Not every stage needs every verification layer. The middleware is configurable per stage.
6. **Latency is budgeted.** Each verification layer has a time budget. Full verification adds ~30-48 seconds across 6 stages. Express mode skips expensive layers.

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
  'high',     // All verification layers passed, no flags
  'medium',   // Minor flags, cross-model agreement > 85%
  'low',      // Significant flags or cross-model disagreement
  'failed',   // Verification could not complete
]);

// ─── Gate Decision ──────────────────────────────────────────────
export const GateDecision = z.enum([
  'auto_proceed',       // All checks passed, continue to next stage
  'proceed_with_flags', // Minor issues noted, continue but flag for review
  'halt_for_review',    // Significant issues, pause for human review
  'halt_error',         // Unrecoverable error, pipeline cannot continue
]);

// ─── Human Action Type ──────────────────────────────────────────
export const HumanActionType = z.enum([
  'confirmed',          // Human reviewed and confirmed the output as-is
  'overridden',         // Human changed a value
  'dismissed_flag',     // Human reviewed a flag and dismissed it
  'escalated',          // Human escalated for additional review
  'released',           // Human released pipeline to continue after halt
]);

// ─── Verification Finding ───────────────────────────────────────
export const VerificationFinding = z.object({
  finding_id: z.string(),
  field_path: z.string().optional(),         // JSONPath to the specific field (e.g., "context.sector")
  finding_type: z.enum([
    'ungrounded',        // Field value not supported by source text
    'cross_model_disagreement', // Models produced different values
    'missing_extraction', // Something in source text was not extracted
    'consistency_error',  // Extracted values contradict each other
    'completeness_gap',   // Required or expected field is empty/missing
    'confidence_below_threshold', // Field confidence below acceptable level
    'rule_violation',     // Deterministic rule check failed
  ]),
  severity: z.enum(['info', 'warning', 'critical']),
  description: z.string(),                   // Human-readable explanation
  source_evidence: z.string().optional(),     // Relevant source text passage
  expected_value: z.string().optional(),      // What the verifier thinks it should be
  actual_value: z.string().optional(),        // What the stage produced
  resolution: z.enum([
    'pending',           // Not yet addressed
    'auto_resolved',     // Resolved by verification logic
    'human_resolved',    // Resolved by human review
    'accepted_as_is',    // Flag acknowledged, value kept
  ]).default('pending'),
});

// ─── The Event Envelope ─────────────────────────────────────────
export const PipelineEvent = z.object({
  // Identity
  event_id: z.string(),                      // Unique event ID (ULID recommended)
  assessment_id: z.string(),                 // Ties to the overall assessment run
  tenant_id: z.string().optional(),          // Multi-tenancy (Phase 2)

  // Classification
  category: EventCategory,
  stage: PipelineStage.optional(),           // Which pipeline stage (absent for pipeline-level events)
  verification_layer: VerificationLayer.optional(), // Which verification layer (only for verification events)

  // Timing
  timestamp: z.string().datetime(),          // ISO 8601 UTC
  duration_ms: z.number().optional(),        // How long this event's operation took

  // Context
  model_id: z.string().optional(),           // Which LLM model was used (if applicable)
  model_version: z.string().optional(),      // Model version string
  input_hash: z.string().optional(),         // SHA-256 of stage input (for reproducibility)
  output_hash: z.string().optional(),        // SHA-256 of stage output

  // Verification payload
  confidence: ConfidenceLevel.optional(),    // Overall confidence assessment
  confidence_score: z.number().min(0).max(1).optional(), // Numeric confidence (0-1)
  gate_decision: GateDecision.optional(),    // Gate decision (only for gate_decision events)
  findings: z.array(VerificationFinding).optional(), // Specific findings from verification
  finding_count: z.object({                  // Summary counts
    info: z.number().default(0),
    warning: z.number().default(0),
    critical: z.number().default(0),
  }).optional(),

  // Human action payload
  human_action: HumanActionType.optional(),  // What the human did (only for human_action events)
  human_actor_id: z.string().optional(),     // Who took the action
  human_notes: z.string().optional(),        // Free-text notes from reviewer

  // Metadata
  pipeline_version: z.string(),             // Pipeline software version
  schema_version: z.literal('0.1'),         // This schema version
  metadata: z.record(z.unknown()).optional(),// Extensible metadata bag
});

export type PipelineEvent = z.infer<typeof PipelineEvent>;
export type VerificationFinding = z.infer<typeof VerificationFinding>;
```

### 3.2 Schema Notes

- **event_id**: Use ULID (Universally Unique Lexicographically Sortable Identifier) for natural time-ordering without secondary index.
- **input_hash / output_hash**: SHA-256 of the serialized stage input and output. Enables reproducibility verification — if the same input produces different output on a re-run, the hashes diverge.
- **field_path**: Uses JSONPath notation to point to specific fields in structured output. Enables the observatory UI to highlight exactly which field was flagged.
- **findings array**: Populated by verification layers. Each finding is independently actionable. The UI can render these as a checklist for human review.
- **metadata bag**: Extensible catch-all for stage-specific data that doesn't warrant a top-level field. Use sparingly.

---

## 4. Middleware Interface

The verification middleware wraps each pipeline stage with a consistent interface.

### 4.1 Stage Wrapper Contract

```typescript
// ─── Stage Function Contract ────────────────────────────────────
// Every pipeline stage implements this interface
interface PipelineStageFunction<TInput, TOutput> {
  (input: TInput, context: PipelineContext): Promise<TOutput>;
}

// ─── Pipeline Context ───────────────────────────────────────────
// Shared context available to all stages and verification layers
interface PipelineContext {
  assessment_id: string;
  tenant_id?: string;
  pipeline_version: string;
  source_document: {
    text: string;           // Original parsed document text
    metadata: DocumentMeta; // Filename, word count, format, etc.
  };
  verification_mode: VerificationMode;
  trust_level: TrustLevel;
  event_emitter: EventEmitter;
}

type VerificationMode = 'express' | 'observatory';
type TrustLevel = 'low' | 'medium' | 'high';

// ─── Verification Layer Contract ────────────────────────────────
// Every verification layer implements this interface
interface VerificationLayerFunction<TOutput> {
  (
    stage_output: TOutput,
    context: PipelineContext,
    stage: PipelineStage,
  ): Promise<VerificationResult>;
}

interface VerificationResult {
  layer: VerificationLayer;
  confidence: ConfidenceLevel;
  confidence_score: number;  // 0-1
  findings: VerificationFinding[];
  duration_ms: number;
}

// ─── Stage Configuration ────────────────────────────────────────
// Defines which verification layers run for each stage
// and under what trust conditions
interface StageVerificationConfig {
  stage: PipelineStage;
  layers: {
    self_audit: {
      enabled: boolean;
      required_at_trust: TrustLevel[];  // e.g., ['low', 'medium']
    };
    cross_model: {
      enabled: boolean;
      required_at_trust: TrustLevel[];  // e.g., ['low']
      model_id: string;                 // Which model to use for cross-check
    };
    deterministic: {
      enabled: boolean;
      required_at_trust: TrustLevel[];  // e.g., ['low', 'medium', 'high']
      validators: DeterministicValidator[];
    };
  };
  gate: {
    auto_proceed_threshold: number;     // Confidence score above this = auto-proceed
    halt_threshold: number;             // Confidence score below this = halt
    // Between thresholds = proceed_with_flags
  };
}
```

### 4.2 Middleware Execution Flow

```typescript
async function executeStageWithVerification<TInput, TOutput>(
  stageFn: PipelineStageFunction<TInput, TOutput>,
  input: TInput,
  config: StageVerificationConfig,
  context: PipelineContext,
): Promise<StageResult<TOutput>> {

  // 1. Emit stage_start
  emit(context, {
    category: 'stage_start',
    stage: config.stage,
    input_hash: hash(input),
  });

  // 2. Run the stage
  const stageStartTime = Date.now();
  const output = await stageFn(input, context);
  const stageDuration = Date.now() - stageStartTime;

  // 3. Emit stage_complete
  emit(context, {
    category: 'stage_complete',
    stage: config.stage,
    output_hash: hash(output),
    duration_ms: stageDuration,
  });

  // 4. Run applicable verification layers
  const verificationResults: VerificationResult[] = [];

  for (const layer of ['self_audit', 'cross_model', 'deterministic'] as const) {
    const layerConfig = config.layers[layer];

    // Skip if not enabled or not required at current trust level
    if (!layerConfig.enabled) continue;
    if (!layerConfig.required_at_trust.includes(context.trust_level)) continue;

    // Skip cross-model in express mode (unless trust is low)
    if (layer === 'cross_model'
        && context.verification_mode === 'express'
        && context.trust_level !== 'low') continue;

    emit(context, {
      category: 'verification_start',
      stage: config.stage,
      verification_layer: layer,
    });

    const result = await runVerificationLayer(layer, output, context, config);
    verificationResults.push(result);

    emit(context, {
      category: 'verification_result',
      stage: config.stage,
      verification_layer: layer,
      confidence: result.confidence,
      confidence_score: result.confidence_score,
      findings: result.findings,
      finding_count: countFindings(result.findings),
      duration_ms: result.duration_ms,
    });
  }

  // 5. Aggregate confidence and make gate decision
  const aggregateConfidence = aggregateVerificationResults(verificationResults);
  const decision = makeGateDecision(aggregateConfidence, config.gate);

  emit(context, {
    category: 'gate_decision',
    stage: config.stage,
    confidence: aggregateConfidence.level,
    confidence_score: aggregateConfidence.score,
    gate_decision: decision,
    findings: aggregateConfidence.allFindings,
    finding_count: countFindings(aggregateConfidence.allFindings),
  });

  // 6. Handle gate decision
  if (decision === 'halt_for_review') {
    // In observatory mode: pause and wait for human action
    // In express mode: still halt — this is a quality gate, not a UX preference
    const humanResult = await waitForHumanReview(
      config.stage, output, aggregateConfidence, context
    );

    emit(context, {
      category: 'human_action',
      stage: config.stage,
      human_action: humanResult.action,
      human_actor_id: humanResult.actor_id,
      human_notes: humanResult.notes,
    });

    if (humanResult.overrides) {
      output = applyOverrides(output, humanResult.overrides);
    }
  }

  if (decision === 'halt_error') {
    throw new PipelineVerificationError(config.stage, aggregateConfidence);
  }

  // 7. Return stage result with verification summary
  return {
    output,
    verification: {
      confidence: aggregateConfidence.level,
      confidence_score: aggregateConfidence.score,
      gate_decision: decision,
      findings: aggregateConfidence.allFindings,
      layers_run: verificationResults.map(r => r.layer),
      total_verification_ms: verificationResults.reduce((sum, r) => sum + r.duration_ms, 0),
    },
  };
}
```

---

## 5. Stage 2 (Extraction) — Reference Implementation

Stage 2 is the highest-risk stage and the reference model for verification. Here is the specific verification layer implementation.

### 5.1 Layer 1: Self-Audit (Source Grounding)

**Purpose:** Verify that each extracted field in AssessmentContext is grounded in the source document text.

**Method:** After extraction, a second LLM call receives the original document text and the extracted JSON. It is prompted to:
1. For each extracted field, quote the exact passage from the source that supports the value
2. If no passage supports a field, mark it as "inferred" with the basis for inference
3. If a field contradicts the source text, mark it as "contradicted"

**Output mapping:**

| Self-audit result | Finding type | Severity |
|------------------|--------------|----------|
| Field grounded with exact quote | (no finding) | — |
| Field inferred from context | `ungrounded` | `info` |
| Field inferred with weak basis | `ungrounded` | `warning` |
| Field contradicts source | `ungrounded` | `critical` |
| Source text contains info not extracted | `missing_extraction` | `warning` |

**Prompt structure (conceptual):**
```
You are a verification agent. You have been given:
1. A source document
2. A structured extraction from that document

For each field in the extraction, do ONE of:
- GROUNDED: Quote the exact passage (≤50 words) that supports this value
- INFERRED: Explain what in the document led to this inference
- CONTRADICTED: Quote the passage that contradicts this value
- MISSING: Identify information in the document that should have been
  extracted but was not captured in any field

Return structured JSON matching the VerificationFinding schema.
```

**Cost:** ~1 LLM call (Haiku-class, ~$0.01-0.03)
**Latency:** ~2-4 seconds

### 5.2 Layer 2: Cross-Model Verification

**Purpose:** Use a different model to independently challenge the extraction, catching systematic biases or blind spots in the primary extraction model.

**Method:** A different model (e.g., if Haiku extracted, Sonnet verifies — or a non-Anthropic model for true independence) receives the original document text and the extracted JSON. It is NOT asked to re-extract. It is asked to challenge:

1. Review each extracted field for accuracy
2. Identify any fields that are incorrect, incomplete, or unsupported
3. Identify anything in the document that should have been extracted but wasn't
4. Rate overall extraction quality

**Output mapping:**

| Cross-model result | Finding type | Severity |
|-------------------|--------------|----------|
| Agrees with extraction | (no finding) | — |
| Disagrees on specific field value | `cross_model_disagreement` | `warning` |
| Identifies missing extraction | `missing_extraction` | `warning` |
| Disagrees on multiple fields | `cross_model_disagreement` | `critical` |

**Cost:** ~1 LLM call (Sonnet-class, ~$0.03-0.08)
**Latency:** ~3-6 seconds

### 5.3 Layer 3: Deterministic Validators

**Purpose:** Catch extraction errors that can be detected without an LLM — fast, cheap, deterministic.

**Validators for Stage 2:**

```typescript
const extractionValidators: DeterministicValidator[] = [
  {
    id: 'keyword_coverage',
    description: 'Check that sector-indicating keywords in source text are reflected in extracted sector',
    check: (output, context) => {
      // If "health", "patient", "clinical" appear 5+ times
      // but sector is not "healthcare", flag it
      const healthKeywords = countKeywords(context.source_document.text, HEALTH_TERMS);
      if (healthKeywords >= 5 && output.sector !== 'healthcare') {
        return finding('consistency_error', 'warning',
          `Source contains ${healthKeywords} health-related terms but sector extracted as "${output.sector}"`);
      }
      // Similar for finance, insurance, government, etc.
    }
  },
  {
    id: 'geography_consistency',
    description: 'Check that extracted geography aligns with entities/addresses in source',
    check: (output, context) => {
      // If "EU", "GDPR", "European" appear but geography doesn't include EU
      // If US state names appear but geography is "global" only
    }
  },
  {
    id: 'use_case_completeness',
    description: 'Check that AI use cases mentioned in source text appear in extracted use cases',
    check: (output, context) => {
      // Keyword scan for common AI use case terms
      // Compare against extracted use_cases array
      // Flag any source-mentioned use cases not captured
    }
  },
  {
    id: 'field_completeness',
    description: 'Check that required fields are populated and optional fields are populated when source data exists',
    check: (output, context) => {
      // Required fields: project_name, description, sector, use_cases
      // Flag any that are empty or generic
      // Check if document length suggests more should have been extracted
    }
  },
  {
    id: 'confidence_calibration',
    description: 'Flag fields where extraction confidence is high but source text is ambiguous',
    check: (output, context) => {
      // If a field has confidence > 0.9 but the source passage
      // contains hedging language ("may", "possibly", "potentially"),
      // flag as potential over-confidence
    }
  },
];
```

**Cost:** Zero LLM cost
**Latency:** <10ms total

### 5.4 Gate Logic for Stage 2

```typescript
const extractionGateConfig: StageVerificationConfig = {
  stage: 'extraction',
  layers: {
    self_audit: {
      enabled: true,
      required_at_trust: ['low', 'medium'],
    },
    cross_model: {
      enabled: true,
      required_at_trust: ['low'],
      model_id: 'claude-sonnet-4-5-20250514',
    },
    deterministic: {
      enabled: true,
      required_at_trust: ['low', 'medium', 'high'],
      validators: extractionValidators,
    },
  },
  gate: {
    auto_proceed_threshold: 0.85,  // Above 85% = auto-proceed
    halt_threshold: 0.60,          // Below 60% = halt for review
    // 60-85% = proceed_with_flags
  },
};
```

**Confidence score aggregation for extraction:**
- Start at 1.0
- Each `info` finding: -0.02
- Each `warning` finding: -0.08
- Each `critical` finding: -0.20
- Cross-model disagreement on >2 fields: additional -0.15
- Deterministic validator failures: weighted by validator severity

---

## 6. Event Sink Interface

### 6.1 Phase 1A: JSON File Sink

```typescript
interface EventSink {
  emit(event: PipelineEvent): Promise<void>;
  flush(): Promise<void>;
  getEvents(assessment_id: string): Promise<PipelineEvent[]>;
  getEventsByStage(assessment_id: string, stage: PipelineStage): Promise<PipelineEvent[]>;
}

// Phase 1A implementation: append-only JSON file per assessment
class JsonFileEventSink implements EventSink {
  private buffer: PipelineEvent[] = [];

  async emit(event: PipelineEvent): Promise<void> {
    // Validate against schema
    PipelineEvent.parse(event);
    this.buffer.push(event);
    // In production: append to file immediately for crash safety
  }

  async flush(): Promise<void> {
    // Write buffer to: /assessments/{assessment_id}/events.json
    // This file persists alongside the assessment output
  }

  async getEvents(assessment_id: string): Promise<PipelineEvent[]> {
    // Read from file, filter by assessment_id
  }

  async getEventsByStage(assessment_id: string, stage: PipelineStage): Promise<PipelineEvent[]> {
    // Read from file, filter by assessment_id + stage
  }
}
```

### 6.2 Phase 2: PostgreSQL Sink

Same interface, different implementation. The event envelope maps directly to a PostgreSQL table with JSONB for findings and metadata. GIN index on findings for pattern queries. Partitioned by month for retention management.

### 6.3 Phase 3+: Stream Sink

Same interface, emitting to a stream (Kafka, NATS, or Redis Streams) for real-time consumption by alerting, analytics, and playbook engines.

---

## 7. Observatory Data Model

The observatory UI consumes a derived data structure — not the raw events, but a summary shaped for display.

### 7.1 Verification Summary (per stage)

```typescript
interface StageVerificationSummary {
  stage: PipelineStage;
  stage_duration_ms: number;
  verification_duration_ms: number;
  confidence: ConfidenceLevel;
  confidence_score: number;
  gate_decision: GateDecision;
  layers_run: VerificationLayer[];
  finding_summary: {
    total: number;
    by_severity: { info: number; warning: number; critical: number };
    by_type: Record<string, number>;  // finding_type → count
  };
  findings: VerificationFinding[];    // Full details, expandable in UI
  human_review?: {
    action: HumanActionType;
    actor_id: string;
    notes?: string;
    overrides_applied: number;
  };
}
```

### 7.2 Assessment Verification Summary (full pipeline)

```typescript
interface AssessmentVerificationSummary {
  assessment_id: string;
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
}
```

This summary is what the Express mode renders as a single confidence badge, and what Observatory mode renders as expandable stage panels.

---

## 8. Verification Adaptation by Stage

While Stage 2 is the reference implementation, each stage needs tailored verification. Here is the planned approach for all 6 stages:

### Stage 1: Parse

| Layer | Approach |
|-------|----------|
| Self-audit | N/A — parsing is deterministic |
| Cross-model | Compare extracted text against PDF rendered as image (multimodal check): "Is anything in this image not captured in the text?" |
| Deterministic | Character count vs. page count ratio, structure detection (tables, headers, multi-column), encoding validation, empty page detection |

### Stage 2: Extraction (reference — see Section 5)

### Stage 3: Regulatory Applicability

| Layer | Approach |
|-------|----------|
| Self-audit | For each LLM-reasoned determination: "Explain why this regulation applies. Quote the assessment context that triggered this determination." |
| Cross-model | Second model independently determines regulatory applicability, compare results. Disagreements on "applicable" vs. "not applicable" are critical findings. |
| Deterministic | Rule audit trail verification — confirm that deterministic rules fired correctly given inputs. Check for contradictory determinations (e.g., "GDPR: not applicable" but geography includes EU). |

### Stage 4: Framework Recommendation

| Layer | Approach |
|-------|----------|
| Self-audit | N/A — fully deterministic |
| Cross-model | N/A — fully deterministic |
| Deterministic | Unit test coverage. Filter rule completeness analysis. Verify sort order correctness. Confirm all returned items exist in reference data. |

### Stage 5: Risk Identification

| Layer | Approach |
|-------|----------|
| Self-audit | For each top-ranked risk: "Explain why this risk is relevant to this specific assessment context. Quote the context that makes this risk material." |
| Cross-model | Second model independently ranks the filtered risk set. Compare top-10 rankings. Divergence >3 positions on any risk is a warning. Completely different top-5 is critical. |
| Deterministic | Source attribution verification — every identified risk must cite a specific MIT AIRISK or OWASP taxonomy item. Pre-filter coverage analysis — check if high-severity risks were excluded by the pre-filter and whether exclusion was justified. |

### Stage 6: Action Plan

| Layer | Approach |
|-------|----------|
| Self-audit | Coverage check: "Does every identified risk from Stage 5 have at least one recommendation? Are there any contradictory recommendations?" |
| Cross-model | Second model evaluates: "Given these risks, are these recommendations sufficient? What is missing? Are any recommendations inappropriate or contradictory?" |
| Deterministic | NIST subcategory reference validation — every recommendation citing a NIST subcategory must cite a valid subcategory ID. Minimum recommendation count check (3 for minimal risk, 8 for high risk). Priority ordering validation. |

---

## 9. Cost and Latency Impact

### Per-assessment cost at full verification (all layers, all stages)

| Layer | Stages applied | Calls | Estimated cost |
|-------|---------------|-------|----------------|
| Self-audit | 2, 3, 5, 6 | 4 Haiku calls | ~$0.04-0.12 |
| Cross-model | 1, 2, 3, 5, 6 | 5 Sonnet calls | ~$0.15-0.40 |
| Deterministic | All 6 | 0 LLM calls | $0.00 |
| **Total** | | **9 additional LLM calls** | **~$0.19-0.52** |

Current pipeline COGS: ~$0.50/assessment
Full verification adds: ~$0.19-0.52
**Total with verification: ~$0.69-1.02/assessment**

At $74/assessment, gross margin drops from 99.3% to ~98.6%. Negligible impact.

### Latency at full verification

| Layer | Time per stage | Stages | Total |
|-------|---------------|--------|-------|
| Self-audit | ~2-4s | 4 | ~8-16s |
| Cross-model | ~3-6s | 5 | ~15-30s |
| Deterministic | <10ms | 6 | <60ms |
| **Total added** | | | **~23-46s** |

Current pipeline latency: ~30-60s (estimated)
Full verification adds: ~23-46s
**Total with verification: ~53-106s**

Acceptable for Observatory mode. In Express mode at medium/high trust, cross-model is skipped — reducing added latency to ~8-16s.

---

## 10. Open Questions for External Review

| # | Question | Context |
|---|----------|---------|
| 1 | **Cross-model independence:** Is using two Anthropic models (Haiku + Sonnet) sufficient independence for cross-model verification, or should Layer 2 use a non-Anthropic model (GPT-4o, Gemini) to avoid correlated failure modes? Trade-off: API complexity and vendor dependency vs. verification independence. |
| 2 | **Confidence score aggregation:** The proposed scoring (Section 5.4) uses fixed deductions per finding severity. Should this be a weighted model trained on human review outcomes instead? At what volume of assessments does empirical calibration become viable? |
| 3 | **Gate threshold tuning:** Auto-proceed at 0.85, halt at 0.60. These are initial estimates. What's the right process for tuning these before launch? Run N assessments with full verification and human review on all, then analyze where the natural break points are? |
| 4 | **Trust level assignment:** How does the system determine trust level for a new customer or document type? Is it purely assessment count, or should document similarity (embedding distance to previously verified documents) factor in? |
| 5 | **Verification prompt stability:** The self-audit and cross-model prompts are critical to verification quality. How do we version and test these prompts independently from the pipeline prompts? Should verification prompts have their own eval suite? |
| 6 | **Human review UX in Express mode:** If the gate halts in Express mode (trust is high but a critical finding surfaces), how does the UX handle the interruption? Modal overlay? Redirect to Observatory view for that stage? |
| 7 | **Event volume at scale:** At 1,000 assessments/month with full verification, the event log produces ~30,000-50,000 events/month. Is JSON file sink adequate for Phase 1, or should we go straight to PostgreSQL? |
| 8 | **Verification of verification:** Who watches the watchers? If the self-audit LLM hallucinates a grounding quote that doesn't exist in the source, the verification itself is unreliable. Should Layer 3 include a deterministic check that verifies Layer 1's quoted passages actually appear in the source text? |

---

## 11. Implementation Sequence

### Phase 1A (build now)

1. Define event envelope Zod schema (Section 3)
2. Implement EventSink interface with JSON file backend (Section 6.1)
3. Wire event emission into existing pipeline stages (stage_start, stage_complete)
4. Implement Stage 2 deterministic validators (Section 5.3)
5. Implement Stage 2 self-audit verification layer (Section 5.1)
6. Implement gate logic for Stage 2 (Section 5.4)
7. Build AssessmentVerificationSummary for API response (Section 7)

### Phase 1A+ (fast follow)

8. Extend deterministic validators to Stages 1, 3, 5, 6
9. Extend self-audit to Stages 3, 5, 6
10. Add verification summary to dashboard UI (collapsed by default)

### Phase 2

11. Cross-model verification (Layer 2) on all applicable stages
12. Observatory UI with expandable stage panels
13. Human review gate with override capture
14. Trust-confidence ladder with empirical thresholds
15. PostgreSQL event sink
16. Basic observatory analytics queries

---

*Specification v0.1 — March 14, 2026. Draft for external review. Schema and interface definitions are TypeScript/Zod pseudocode intended to communicate structure, not production-ready implementations.*
