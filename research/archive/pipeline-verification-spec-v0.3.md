# Pipeline Verification Architecture
## Event Envelope Schema & Middleware Interface Specification v0.3

**Project:** AI Risk Tools
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 14, 2026
**Status:** Build-ready — final revision per second external review round
**Prerequisite reading:** discover-brief.md, AI-Risk-Tools-Deep-Dive-Analysis.md (Part 7)

---

## Changelog from v0.2

| Change | Source | Rationale |
|--------|--------|-----------|
| Defined `ReviewPackage` schema as first-class contract | GPT (R2) + Gemini (R2) | Referenced but never defined in v0.2. Resume flow cannot be built without it. |
| Added resume token lifecycle rules: single-use, TTL, optimistic locking | GPT (R2) + Gemini (R2) | Both flagged race conditions and garbage collection as gaps. |
| Locked `run_id` / `attempt_no` semantics for resume vs. retry | GPT (R2) | Resume = new run_id, same attempt. Retry = new run_id, incremented attempt. |
| Added downstream invalidation policy: conservative re-run after override | GPT (R2) + Gemini (R2) | Both said this is NOT deferrable. Override on Stage 2 makes Stages 3-6 stale. |
| Added `artifact_revised` and `downstream_invalidated` event categories | GPT (R2) | Required for invalidation audit trail. |
| Split verifier failure handling: deterministic failure = `halt_error`, LLM verifier failure = `needs_review`, optional layer failure = `proceed_with_flags` | GPT (R2) | "Mandatory verifier failed" collapsed too many failure types with different responses. |
| Tightened gate: critical on `required_supporting` now triggers `needs_review` | GPT (R2) | `proceed_with_flags` for criticals on supporting fields was under-protective for a governance product. |
| Added `required_material_grounding_coverage` hard-stop rule | GPT (R2) | If verification can't ground most required fields, overall extraction is untrustworthy even without individual criticals. |
| Added `gate_reason_codes` (machine-readable) alongside `gate_reasons` (human-readable) | GPT (R2) | Free-text reasons are weak for downstream analytics and UI filtering. |
| Documented substring match limitation on `grounding_quote_exists`; added normalized fuzzy fallback | Gemini (R2) | LLMs slightly rephrase quotes; strict substring match produces false-positive criticals. |
| Added explicit pipeline lifecycle state machine | GPT (R2) | Pipeline states were spread across events and return objects without a single source of truth. |
| Separated `HumanReviewOutcome` from `HumanWorkflowAction` | GPT (R2) | Single `HumanActionType` enum was carrying content judgment, artifact mutation, and workflow routing — different dimensions. |
| Added `assessment_id`, `run_id`, `stage` directly to `VerificationFinding` storage model | GPT (R2) | Findings need first-class context for analytics without requiring event-relationship joins. |
| Added artifact lineage: `parent_artifact_version`, `artifact_status` | GPT (R2) | Version exists but lineage was partial; override chains need parent tracking. |
| Added re-validation of revised artifacts after human override | GPT (R2) | Human overrides bypass verification; deterministic checks must re-run on revised output. |
| Added event ownership rules: components compute, orchestrator emits | GPT (R2) | Event emission responsibility was smeared across components; risks instrumentation drift. |

### Deferred by Design (unchanged from v0.2)

| Item | Why Deferred |
|------|-------------|
| Multi-vendor cross-model verification | Phase 2. Same-vendor different-model acceptable for Phase 1. |
| PostgreSQL event sink | Phase 2. JSON file adequate at Phase 1 volume. Interface is stable. |
| Full six-stage verification rollout | Phase 1 proves pattern on Stage 2. Extend in Phase 1A+. |
| Embedding-based trust level assignment | Requires baseline data. Conservative rules first. |
| Stream sink architecture | Not relevant until real-time consumption demand. |

---

## 1. Purpose

Unchanged from v0.2. This spec defines the event envelope schema, verification middleware, gate logic, async review model, and observatory data model for the AI Risk Tools assessment pipeline.

---

## 2. Design Principles

Unchanged from v0.2, with one addition:

10. **Components compute; the orchestrator emits.** (v0.3) StageExecutor and VerificationCoordinator return data. Only the orchestration layer emits events to the EventSink. This prevents instrumentation drift across components.

---

## 3. Pipeline Lifecycle State Machine (v0.3: new)

The pipeline has an explicit lifecycle with defined transitions.

```
                    ┌──────────┐
                    │  queued   │
                    └────┬─────┘
                         │ start
                         ▼
                ┌─────────────────┐
           ┌───►│  running_stage   │◄──────────┐
           │    └───────┬─────────┘            │
           │            │                      │
           │     ┌──────┴──────┐               │
           │     ▼             ▼               │
    ┌──────┴────────┐  ┌──────────────┐        │
    │  completed     │  │paused_review │        │
    └───────────────┘  └──────┬───────┘        │
                              │ human acts     │
                              ▼                │
                      ┌──────────────┐         │
                      │  resuming    ├─────────┘
                      └──────────────┘

                      ┌──────────────┐
          (any) ─────►│    error     │
                      └──────────────┘
```

```typescript
export const PipelineLifecycleState = z.enum([
  'queued',           // Assessment submitted, pipeline not yet started
  'running_stage',    // A pipeline stage is actively processing
  'paused_review',    // Pipeline halted at a gate; awaiting human review
  'resuming',         // Human review complete; pipeline re-entering execution
  'completed',        // All stages finished successfully
  'error',            // Unrecoverable error; pipeline terminated
]);
```

**Transition rules:**
- `queued` → `running_stage`: Pipeline starts Stage 1
- `running_stage` → `running_stage`: Stage completes, gate auto-proceeds, next stage starts
- `running_stage` → `paused_review`: Gate returns `needs_review`
- `running_stage` → `completed`: Final stage (Stage 6) gate auto-proceeds
- `running_stage` → `error`: Unrecoverable error or `halt_error` gate decision
- `paused_review` → `resuming`: Human submits review via resume token
- `resuming` → `running_stage`: Revised artifact validated, next stage starts (or current stage re-enters if downstream invalidation triggered re-run)
- `resuming` → `error`: Re-validation of revised artifact fails critically

---

## 4. Event Envelope Schema

### 4.1 Updated Enums (v0.3 changes only)

```typescript
// ─── Event Categories (v0.3: added 2) ──────────────────────────
export const EventCategory = z.enum([
  // ... all v0.2 categories, plus:
  'artifact_revised',          // v0.3: Human override created new artifact version
  'downstream_invalidated',    // v0.3: Downstream stages marked stale after override
]);

// ─── Human Review Outcome (v0.3: replaces HumanActionType) ─────
// Content judgment: what did the human decide about the output?
export const HumanReviewOutcome = z.enum([
  'approved',                  // Output is correct as-is
  'approved_with_override',    // Output corrected; new artifact version created
  'rejected',                  // Output is unacceptable; escalation or re-run needed
  'escalated',                 // Needs higher-authority review
]);

// ─── Human Workflow Action (v0.3: new) ──────────────────────────
// Workflow routing: what should happen next?
export const HumanWorkflowAction = z.enum([
  'resume_pipeline',           // Continue to next stage
  're_run_stage',              // Re-run this stage from scratch
  'keep_paused',               // Keep paused; will return later
  'abort_pipeline',            // Cancel the assessment
]);

// ─── Verifier Failure Classification (v0.3: tightened) ──────────
// Maps verifier status to gate behavior
//
// deterministic verifier fails → halt_error
//     (internal control plane broken; gate itself untrustworthy)
//
// LLM self-audit timeout/error → needs_review
//     (degraded assurance; human should review unverified output)
//
// optional/cross-model layer unavailable → proceed_with_flags
//     (reduced confidence but core verification intact)
```

### 4.2 Updated Event Envelope Fields (v0.3 changes only)

```typescript
// Changes to PipelineEvent from v0.2:

  // Human action payload (v0.3: split into outcome + action)
  human_review_outcome: HumanReviewOutcome.optional(),  // v0.3: replaces human_action
  human_workflow_action: HumanWorkflowAction.optional(), // v0.3: new
  human_actor_id: z.string().optional(),
  human_notes: z.string().optional(),

  // Gate reasoning (v0.3: added machine-readable codes)
  gate_reasons: z.array(z.string()).optional(),          // Human-readable (unchanged)
  gate_reason_codes: z.array(z.string()).optional(),     // v0.3: Machine-readable codes

  // Pipeline state (v0.3: new)
  pipeline_state: PipelineLifecycleState.optional(),     // v0.3: Current lifecycle state

  // Schema version
  schema_version: z.literal('0.3'),                      // v0.3
```

### 4.3 Updated VerificationFinding (v0.3: storage context)

```typescript
export const VerificationFinding = z.object({
  // ... all v0.2 fields, plus:

  // Storage context (v0.3: findings carry their own context)
  assessment_id: z.string(),                  // v0.3: Direct linkage
  run_id: z.string(),                         // v0.3: Direct linkage
  stage: PipelineStage,                       // v0.3: Which stage produced this
  artifact_version: z.string(),               // v0.3: Which artifact version was verified
});
```

### 4.4 Artifact Lineage (v0.3: new)

```typescript
export const ArtifactRecord = z.object({
  artifact_version: z.string(),              // Unique version ID (ULID)
  assessment_id: z.string(),
  run_id: z.string(),
  stage: PipelineStage,
  artifact_status: z.enum([
    'active',           // Current canonical version
    'superseded',       // Replaced by human override
    'stale',            // Invalidated by upstream override
  ]),
  parent_artifact_version: z.string().optional(), // v0.3: Links to the version this was derived from
  output_hash: z.string(),
  created_at: z.string().datetime(),
  created_by: z.enum(['pipeline', 'human_override']),
});
```

---

## 5. Run Lineage Semantics (v0.3: locked)

### 5.1 Resume vs. Retry

| Scenario | assessment_id | run_id | attempt_no | caused_by |
|----------|--------------|--------|------------|-----------|
| Initial run | A1 | R1 | 1 | — |
| Resume after human review | A1 | R2 | 1 | review_requested event from R1 |
| Retry after system error | A1 | R3 | 2 | pipeline_error event from R1 or R2 |
| Second review resume | A1 | R4 | 2 | review_requested event from R3 |

**Rules:**
- **Resume** (human completed review): new `run_id`, same `attempt_no`. Operational continuation.
- **Retry** (system failure re-execution): new `run_id`, incremented `attempt_no`. Re-execution from failure point.
- `assessment_id` is always stable across all runs for the same assessment.
- `sequence_no` resets to 0 with each new `run_id`.

---

## 6. Review Package Schema (v0.3: new)

### 6.1 ReviewPackage Contract

```typescript
export const ReviewPackageStatus = z.enum([
  'open',            // Awaiting human review
  'completed',       // Human submitted review
  'expired',         // TTL exceeded without action
  'superseded',      // Replaced by a newer review (e.g., pipeline retried)
]);

export const ReviewPackage = z.object({
  // Identity
  package_id: z.string(),                    // Unique ID (ULID)
  resume_token: z.string(),                  // High-entropy token for API resume call
  assessment_id: z.string(),
  run_id: z.string(),                        // The run that produced this review request
  stage: PipelineStage,                      // Which stage is paused

  // State
  status: ReviewPackageStatus,
  version: z.number().int().min(1),          // Optimistic concurrency version

  // Snapshot of what the reviewer needs to see
  stage_output: z.object({
    artifact_version: z.string(),
    output_hash: z.string(),
    output: z.unknown(),                     // The actual stage output (typed per stage)
  }),
  gate_result: z.object({
    decision: GateDecision,
    reasons: z.array(z.string()),
    reason_codes: z.array(z.string()),
    hard_stops_triggered: z.array(z.string()),
    confidence: ConfidenceLevel,
    confidence_score: z.number(),
  }),
  finding_ids: z.array(z.string()),          // References to findings (loaded separately)
  source_document_ref: z.string(),           // Reference to source doc (not embedded)

  // Lifecycle
  created_at: z.string().datetime(),
  expires_at: z.string().datetime(),         // TTL-based expiration
  completed_at: z.string().datetime().optional(),
  completed_by: z.string().optional(),       // Actor ID

  // Review result (populated on completion)
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
```

### 6.2 Resume Token Lifecycle Rules

| Rule | Specification |
|------|--------------|
| **Single-use** | A resume token can be consumed exactly once. Second call returns 409 Conflict. |
| **TTL** | Default: 24 hours. Configurable per deployment. After expiry, status transitions to `expired` and the assessment is marked as abandoned. |
| **Entropy** | 256-bit cryptographically random token. URL-safe base64 encoded. |
| **Concurrency** | Optimistic locking via `version` field. Resume call must include current version. If version mismatch, return 409 Conflict. |
| **Invalidation** | Token is invalidated when: (a) consumed by resume call, (b) TTL expires, (c) pipeline is retried (status → `superseded`), (d) assessment is manually aborted. |

### 6.3 Resume API Contract

```typescript
// POST /assessments/{assessment_id}/resume
interface ResumeRequest {
  resume_token: string;
  package_version: number;           // Optimistic concurrency check
  review_outcome: HumanReviewOutcome;
  workflow_action: HumanWorkflowAction;
  overrides?: Array<{
    field_path: string;
    new_value: unknown;
    finding_id: string;
  }>;
  reviewer_notes?: string;
  actor_id: string;
}

// Possible responses:
// 200 OK — review accepted, pipeline resuming
// 409 Conflict — token already used, version mismatch, or expired
// 404 Not Found — invalid token
// 422 Unprocessable — override references invalid field_path or finding_id
```

---

## 7. Downstream Invalidation Policy (v0.3: new)

### 7.1 The Problem

If a human overrides Stage 2 output (e.g., corrects sector from "technology" to "healthcare"), Stages 3-6 were computed against the original data. Their outputs may be incorrect.

### 7.2 Policy: Conservative Invalidation

**Rule:** If a human override changes any `required_material` or `required_supporting` field in a stage's output, all downstream stages are invalidated and must re-run.

```typescript
function handleOverrideInvalidation(
  overrides: Override[],
  currentStage: PipelineStage,
  fieldCriticalityMap: Record<string, FieldCriticality>,
): InvalidationResult {
  // Check if any override touches a material or supporting field
  const materialOverride = overrides.some(o => {
    const criticality = fieldCriticalityMap[o.field_path];
    return criticality === 'required_material' || criticality === 'required_supporting';
  });

  if (!materialOverride) {
    // Override only affects optional fields — no invalidation needed
    return { invalidate_downstream: false };
  }

  // All stages after currentStage are stale
  const stageOrder = ['parse', 'extraction', 'regulatory', 'framework', 'risk_identification', 'action_plan'];
  const currentIndex = stageOrder.indexOf(currentStage);
  const staleStages = stageOrder.slice(currentIndex + 1) as PipelineStage[];

  return {
    invalidate_downstream: true,
    stale_stages: staleStages,
    reason: `Override on ${currentStage} changed material/supporting fields: ${overrides.map(o => o.field_path).join(', ')}`,
  };
}
```

### 7.3 Invalidation Event Flow

When downstream invalidation occurs:

```
1. Human submits override on Stage 2
2. emit('artifact_revised', { stage: 'extraction', new_artifact_version, parent_artifact_version })
3. Re-run deterministic validators on revised artifact (safety check)
4. Compute invalidation
5. For each stale stage:
   emit('downstream_invalidated', { stage, reason, stale_artifact_version })
   Mark artifact_status → 'stale'
6. Pipeline re-enters 'running_stage' at Stage 3 with revised Stage 2 output
7. Stages 3-6 re-run normally with full verification
```

### 7.4 Override on Optional Fields Only

If overrides only affect `optional` fields, downstream stages are NOT invalidated. Rationale: optional fields don't drive downstream logic (regulatory applicability, framework filtering, risk pre-filtering are all keyed on required fields).

---

## 8. Gate Logic (v0.3: tightened)

### 8.1 Hard-Stop Rules (v0.3: updated)

```typescript
const universalHardStops: HardStopRule[] = [
  // --- v0.2 rules (unchanged) ---
  {
    id: 'critical_on_required_material',
    code: 'GATE_CRIT_MATERIAL',
    description: 'Any critical finding on a required_material field',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.severity === 'critical' && f.field_criticality === 'required_material'
    ),
  },
  {
    id: 'missing_required_material',
    code: 'GATE_MISSING_MATERIAL',
    description: 'Required material field is empty or missing',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.finding_type === 'completeness_gap' && f.field_criticality === 'required_material'
    ),
  },
  {
    id: 'grounding_quote_fabricated',
    code: 'GATE_QUOTE_FABRICATED',
    description: 'Self-audit quoted text not found in source (after fuzzy match)',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.finding_type === 'grounding_quote_missing'
    ),
  },

  // --- v0.3 new/tightened rules ---
  {
    id: 'critical_on_required_supporting',
    code: 'GATE_CRIT_SUPPORTING',
    description: 'Any critical finding on a required_supporting field',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.severity === 'critical' && f.field_criticality === 'required_supporting'
    ),
  },
  {
    id: 'contradiction_on_any_required',
    code: 'GATE_CONTRADICTION',
    description: 'Consistency error on any required field (material or supporting)',
    triggers_decision: 'needs_review',
    check: (findings) => findings.some(f =>
      f.finding_type === 'consistency_error'
      && f.field_criticality !== 'optional'
    ),
  },
  {
    id: 'required_material_grounding_coverage',
    code: 'GATE_LOW_COVERAGE',
    description: 'Fewer than 80% of required_material fields have grounded or explicit status from self-audit',
    triggers_decision: 'needs_review',
    check: (findings, layerResults, fieldCriticalityMap) => {
      const materialFields = Object.entries(fieldCriticalityMap)
        .filter(([_, c]) => c === 'required_material')
        .map(([path]) => path);
      const groundedOrExplicit = materialFields.filter(path =>
        findings.some(f =>
          f.field_path === path
          && (f.finding_type === 'ungrounded' && f.severity === 'info') // inferred = explicit
        )
        || !findings.some(f => f.field_path === path) // no finding = grounded
      );
      return groundedOrExplicit.length / materialFields.length < 0.80;
    },
  },

  // --- Verifier failure rules (v0.3: split by verifier type) ---
  {
    id: 'deterministic_verifier_failure',
    code: 'GATE_DETERMINISTIC_FAIL',
    description: 'Deterministic validator failed to execute (internal control plane failure)',
    triggers_decision: 'halt_error',
    check: (_, layerResults) => layerResults.some(r =>
      r.layer === 'deterministic' && (r.status === 'error' || r.status === 'timeout')
    ),
  },
  {
    id: 'mandatory_llm_verifier_failure',
    code: 'GATE_LLM_VERIFY_FAIL',
    description: 'Required LLM verifier (self-audit) failed — degraded assurance',
    triggers_decision: 'needs_review',
    check: (_, layerResults) => layerResults.some(r =>
      r.layer === 'self_audit' && (r.status === 'error' || r.status === 'timeout' || r.status === 'unavailable')
    ),
  },
  // Optional layer (cross_model) failure → no hard stop; handled as proceed_with_flags in Tier 2
];
```

### 8.2 Gate Evaluation (v0.3: with reason codes)

```typescript
function evaluateGate(
  bundle: VerificationBundle,
  hardStops: HardStopRule[],
  fieldCriticalityMap: Record<string, FieldCriticality>,
): GateResult {
  const triggeredStops: string[] = [];
  const reasons: string[] = [];
  const reasonCodes: string[] = [];

  // Tier 1: Hard stops
  for (const rule of hardStops) {
    if (rule.check(bundle.all_findings, bundle.layers_run, fieldCriticalityMap)) {
      triggeredStops.push(rule.id);
      reasons.push(rule.description);
      reasonCodes.push(rule.code);

      if (rule.triggers_decision === 'halt_error') {
        return {
          decision: 'halt_error',
          reasons, reason_codes: reasonCodes,
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
      reasons, reason_codes: reasonCodes,
      hard_stops_triggered: triggeredStops,
      confidence: 'low',
      confidence_score: computeSecondaryScore(bundle),
    };
  }

  // Tier 2: No hard stops
  const hasCriticalsOnOptional = bundle.all_findings.some(f =>
    f.severity === 'critical' && f.field_criticality === 'optional'
  );
  const hasWarnings = bundle.all_findings.some(f => f.severity === 'warning');
  const optionalLayerDegraded = bundle.layers_run.some(r =>
    r.layer === 'cross_model' && r.status !== 'completed' && r.status !== 'skipped'
  );

  if (hasCriticalsOnOptional || hasWarnings || optionalLayerDegraded) {
    const r = [];
    if (hasCriticalsOnOptional) r.push('Critical on optional fields');
    if (hasWarnings) r.push('Warning-level findings');
    if (optionalLayerDegraded) r.push('Optional verification layer degraded');
    return {
      decision: 'proceed_with_flags',
      reasons: r, reason_codes: ['GATE_FLAGS'],
      hard_stops_triggered: [],
      confidence: 'medium',
      confidence_score: computeSecondaryScore(bundle),
    };
  }

  return {
    decision: 'auto_proceed',
    reasons: ['All checks passed'], reason_codes: ['GATE_CLEAR'],
    hard_stops_triggered: [],
    confidence: 'high',
    confidence_score: computeSecondaryScore(bundle),
  };
}
```

---

## 9. Grounding Quote Verification (v0.3: fuzzy match)

### 9.1 The Problem

LLMs frequently alter quoted text in minor ways: "cannot" → "can not", slight punctuation changes, word reordering within a phrase. OCR artifacts may introduce additional noise. A strict substring match on grounding quotes produces false-positive critical findings.

### 9.2 Solution: Two-Pass Verification

```typescript
const groundingQuoteValidator: DeterministicValidator = {
  id: 'grounding_quote_exists',
  description: 'Verify self-audit quotes appear in source. Pass 1: exact substring. Pass 2: normalized fuzzy match.',
  check: (output, context, selfAuditFindings) => {
    const findings: VerificationFinding[] = [];
    const normalizedSource = normalizeForComparison(context.source_document.text);

    for (const auditFinding of selfAuditFindings) {
      if (!auditFinding.evidence_refs) continue;
      for (const ref of auditFinding.evidence_refs) {
        if (!ref.quote) continue;

        // Pass 1: Exact substring (normalized whitespace + lowercase)
        const normalizedQuote = normalizeForComparison(ref.quote);
        if (normalizedSource.includes(normalizedQuote)) {
          ref.quote_verified = true;
          ref.match_type = 'exact';
          continue;
        }

        // Pass 2: Token overlap (Jaccard similarity on word tokens)
        const similarity = jaccardSimilarity(
          tokenize(normalizedQuote),
          bestWindowMatch(tokenize(normalizedQuote), tokenize(normalizedSource))
        );

        if (similarity >= 0.85) {
          // Close enough — likely a minor LLM rephrasing
          ref.quote_verified = true;
          ref.match_type = 'fuzzy';
          ref.match_similarity = similarity;
          // Info-level finding: quote was rephrased, not fabricated
          findings.push({
            ...baseFinding(auditFinding),
            check_id: 'grounding_quote_exists',
            finding_type: 'grounding_quote_missing', // Reuse type for tracking
            severity: 'info', // Downgraded from critical
            description: `Self-audit quote was rephrased (${Math.round(similarity * 100)}% token overlap). Likely minor LLM paraphrasing, not fabrication.`,
          });
        } else {
          // Below threshold — possible fabrication
          ref.quote_verified = false;
          ref.match_type = 'none';
          ref.match_similarity = similarity;
          findings.push({
            ...baseFinding(auditFinding),
            check_id: 'grounding_quote_exists',
            finding_type: 'grounding_quote_missing',
            severity: 'critical', // True fabrication concern
            description: `Self-audit quoted "${ref.quote}" but text not found in source (${Math.round(similarity * 100)}% best match). Possible hallucinated evidence.`,
          });
        }
      }
    }
    return findings;
  }
};

// Utility functions
function normalizeForComparison(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function tokenize(text: string): Set<string> {
  return new Set(text.split(/\s+/).filter(t => t.length > 2));
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}
```

### 9.3 Documented Limitations

- Token-level Jaccard similarity is a rough heuristic. It will miss reorderings that change meaning.
- OCR artifacts (broken words, merged characters) may reduce match scores below threshold even for correct quotes.
- Character offset references from the LLM self-audit are approximate, not precise.
- Phase 2 should evaluate edit distance or embedding similarity as alternatives once baseline data exists.

---

## 10. Middleware (v0.3: event ownership + re-validation)

### 10.1 Event Ownership Rules

| Component | Emits Events? | Responsibility |
|-----------|--------------|----------------|
| **Orchestrator** | YES | All lifecycle events: `stage_start`, `stage_complete`, `gate_decision`, `review_requested`, `pipeline_resumed`, `artifact_revised`, `downstream_invalidated`, `pipeline_start`, `pipeline_complete`, `pipeline_error` |
| **StageExecutor** | NO | Returns `StageOutput`. Does not emit. |
| **VerificationCoordinator** | NO | Returns `VerificationBundle`. Orchestrator emits `verification_start` and `verification_result` per layer based on bundle contents. |
| **GateEvaluator** | NO | Returns `GateResult`. Orchestrator emits `gate_decision`. |

### 10.2 Post-Override Re-Validation

When a human override creates a revised artifact, deterministic validators must re-run before the pipeline resumes. This prevents human-introduced errors from bypassing verification.

```typescript
async function handleResumeWithOverride(
  resumeRequest: ResumeRequest,
  reviewPackage: ReviewPackage,
  context: PipelineContext,
): Promise<ResumeResult> {
  // 1. Create revised artifact
  const revisedOutput = applyOverrides(reviewPackage.stage_output.output, resumeRequest.overrides);
  const revisedVersion = generateArtifactVersion();

  emit('artifact_revised', {
    stage: reviewPackage.stage,
    parent_artifact_version: reviewPackage.stage_output.artifact_version,
    new_artifact_version: revisedVersion,
  });

  // 2. Re-run deterministic validators on revised artifact
  const revalidation = await runDeterministicValidators(revisedOutput, context, stageConfig);

  if (revalidation.findings.some(f => f.severity === 'critical' && f.field_criticality !== 'optional')) {
    // Human override introduced a new critical issue
    // Create a new review package rather than silently proceeding
    return { status: 'needs_re_review', findings: revalidation.findings };
  }

  // 3. Compute downstream invalidation
  const invalidation = handleOverrideInvalidation(
    resumeRequest.overrides, reviewPackage.stage, fieldCriticalityMap
  );

  if (invalidation.invalidate_downstream) {
    for (const staleStage of invalidation.stale_stages) {
      emit('downstream_invalidated', { stage: staleStage, reason: invalidation.reason });
    }
  }

  // 4. Resume pipeline at next stage (or re-run from first stale stage)
  return { status: 'resuming', next_stage: invalidation.stale_stages?.[0] ?? nextStage(reviewPackage.stage) };
}
```

---

## 11. Sections Unchanged from v0.2

The following sections are carried forward from v0.2 without modification:

- **Stage 2 Reference Implementation** (self-audit layer, field criticality map, cross-model deferred to Phase 2) — v0.2 Section 6, except grounding quote validator updated in this doc Section 9
- **Event Sink Interface** (JSON file backend Phase 1, PostgreSQL Phase 2) — v0.2 Section 7
- **Verification Adaptation by Stage** (roadmap for Stages 1, 3-6) — v0.2 Section 9
- **Cost and Latency Impact** — v0.2 Section 10

---

## 12. Open Questions (v0.3: status update)

### Resolved

| # | Resolution |
|---|-----------|
| 4 | Trust level: default `medium`. `low` on parse anomalies, high missing-field rates, or prior review failures. `high` after 20+ successful assessments on same document profile with <5% flag rate. 20 is a starting heuristic; calibrate after shadow mode. |
| 9 | Downstream invalidation: resolved in Section 7. Conservative re-run on material/supporting field override. No re-run on optional-only overrides. |

### Remaining

| # | Question | Status |
|---|----------|--------|
| 5 | **Verification prompt eval suite:** Self-audit prompt needs golden test cases before pilot. Build lightweight eval (5-10 test documents, known-correct extractions, expected grounding results) during shadow mode. | Planned for shadow mode phase. |
| 10 | **Review package retention:** 24-hour TTL on resume tokens. Review packages retained for 90 days for audit trail, then redacted (quotes truncated, output hashes retained, full output deleted). Needs implementation but policy is locked. | Policy locked; implementation Phase 1A+. |
| 11 | **Shadow mode calibration:** Run 30-50 assessments across 3+ document types/sectors. Force `auto_proceed` on all gates. Log all verification data. Analyze: (a) false-positive rate on grounding quote check, (b) which hard-stop rules fire most, (c) where human reviewers disagree with gate decisions. Calibrate hard-stop coverage threshold (currently 80%) and fuzzy match threshold (currently 0.85 Jaccard) based on results. | Run before gate enforcement. |

---

## 13. Implementation Sequence (v0.3: final)

### Phase 1A: Build Now

| # | Task | Section |
|---|------|---------|
| 1 | Define event envelope Zod schema (v0.3) | 4 |
| 2 | Define VerificationFinding, EvidenceReference, ArtifactRecord schemas | 4.3, 4.4 |
| 3 | Define ReviewPackage schema and resume token generation | 6 |
| 4 | Define PipelineLifecycleState and transition rules | 3 |
| 5 | Implement EventSink + FindingStore with JSON file backend | 11 (v0.2 §7) |
| 6 | Wire event emission into all 6 pipeline stages (stage_start, stage_complete) | 10.1 |
| 7 | Implement field criticality map for Stage 2 extraction | 11 (v0.2 §6.1) |
| 8 | Implement Stage 2 deterministic validators including two-pass grounding quote check | 9 |
| 9 | Implement Stage 2 self-audit with structured EvidenceReference output | 11 (v0.2 §6.2) |
| 10 | Implement hard-stop gate rules (v0.3 rule set) | 8 |
| 11 | Implement StageExecutor / VerificationCoordinator / GateEvaluator for Stage 2 | 10 |
| 12 | Build AssessmentVerificationSummary for API response | 11 (v0.2 §8) |
| 13 | **Shadow mode**: Full verification, gate always auto-proceeds. 30-50 assessments. | 12 |

### Phase 1A+: After Shadow Mode Calibration

| # | Task |
|---|------|
| 14 | Calibrate fuzzy match threshold and coverage threshold from shadow data |
| 15 | Enable gate enforcement on Stage 2 |
| 16 | Implement ReviewPackageStore and resume endpoint (Section 6) |
| 17 | Implement post-override re-validation (Section 10.2) |
| 18 | Implement downstream invalidation flow (Section 7) |
| 19 | Extend deterministic validators to Stages 1, 3, 5, 6 |
| 20 | Extend self-audit to Stages 3, 5, 6 |
| 21 | Add verification summary to dashboard UI (collapsed by default) |

### Phase 2

| # | Task |
|---|------|
| 22 | Cross-model verification on Stages 2, 3, 5, 6 |
| 23 | Observatory UI with expandable stage panels |
| 24 | Human review gate UI |
| 25 | Trust-confidence ladder with empirical thresholds |
| 26 | PostgreSQL event + finding stores |
| 27 | Self-audit prompt eval suite |
| 28 | Observatory analytics queries |

---

*Specification v0.3 — March 14, 2026. Final revision incorporating two rounds of external review (GPT-4o, Gemini). All reviewer concerns either resolved in spec or explicitly deferred with rationale. Build-ready for Phase 1A implementation.*
