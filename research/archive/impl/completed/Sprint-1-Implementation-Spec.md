# Implementation Spec: Pipeline Verification Layer — Sprint 1

**Project:** AI Risk Tools
**Sprint:** Shadow Mode Foundation
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 15, 2026
**Status:** Ready for implementation (Codex handoff)
**Architecture Spec:** `pipeline-verification-spec-v0.3.md`

---

## Goal

Wire structured event logging into the existing 6-stage assessment pipeline. No gate enforcement. No verification layers. Pure structured logging that captures the baseline data needed to calibrate verification thresholds in Sprint 3.

The existing SSE stream and logger.info() calls remain unchanged. This adds a parallel structured event stream using an immutable, append-only JSONL backend.

---

## Codebase Context

**Stack:** TypeScript, Node 20, pnpm monorepo, Vitest, Express
**Existing state:** 6-stage pipeline, 75 passing tests, SSE progress streaming, structured JSON logging with request_id

### Monorepo Structure

```
airisktools-mvp/
  packages/
    shared-types/                          # Canonical Zod schemas + TS types
      src/
        index.ts                           # All type exports (MODIFY: add re-export)
        verification.ts                    # NEW FILE (Task 1)
    pipeline-api/                          # Express API + pipeline orchestration
      src/
        services/
          pipeline-orchestrator.ts         # MODIFY (Task 4: wire emitter)
          extraction/                      # Stage 2
          regulatory/                      # Stage 3
          framework/                       # Stage 4
          risk/                            # Stage 5
          recommendations/                 # Stage 6
        lib/                               # NEW FILES (Tasks 2-3)
          llm-client.ts                    # Existing
          validation.ts                    # Existing
        routes/
      tests/                               # Vitest, 75 tests
  apps/
    dashboard/                             # Next.js 15 — DO NOT MODIFY
```

### Existing Pipeline Signature

```typescript
async function runAssessment(
  documentBuffer: Buffer,
  filename: string,
  config: PipelineConfig,
  progressCallback: (event: SSEEvent) => void
): Promise<GovernanceAssessment>
```

Calls 6 stages sequentially. At each stage, emits SSE events via `progressCallback` (`step_start`, `step_complete`). Also writes structured JSON logs via `logger.info()`.

### Constraints

- **Do not modify SSE behavior.** The dashboard consumes the existing SSE stream.
- **Do not modify existing test assertions.** All 75 tests must continue passing.
- **Do not add dependencies to shared-types** beyond `zod` (already present).
- **Use Vitest** for all new tests.
- **TypeScript strict mode** is enabled. All new code must compile cleanly.

---

## Reference Files

These files are in `Research/impl/`. They are source material for implementation.

| File | Contains | Usage |
|------|----------|-------|
| `verification-schemas.ts` | Complete Zod schemas (392 lines) | **Copy verbatim** to `shared-types/src/verification.ts` |
| `event-sink.ts` | EventSink + FindingStore interfaces and JSON backends | Use as starting point for Task 2 |
| `event-emitter-wiring.ts` | PipelineEventEmitter class (top half) + orchestrator wiring example (bottom half, commented) | Extract class for Task 3; follow wiring pattern for Task 4 |
| `sprint-backlog.md` | Full backlog (Sprint 1-3, Phase 1A+, Phase 2) | Context only |
| `pipeline-verification-spec-v0.3.md` | Architecture spec (2 rounds external review) | Context only |

---

## Task 1: Verification Schemas

**Create:** `packages/shared-types/src/verification.ts`
**Modify:** `packages/shared-types/src/index.ts`
**Reference:** `Research/impl/verification-schemas.ts`

### What to Do

1. Copy `Research/impl/verification-schemas.ts` to `packages/shared-types/src/verification.ts` verbatim. This file is production-ready TypeScript.
2. In `packages/shared-types/src/index.ts`, add: `export * from './verification';`
3. Run `pnpm build` from shared-types. Confirm zero TypeScript errors.
4. Run `pnpm build` from pipeline-api. Confirm shared-types import resolves.

### Schemas Defined

The file exports 18 Zod schemas and their inferred TypeScript types:

| Schema | Purpose |
|--------|---------|
| `PipelineStage` | Enum: parse, extraction, regulatory, framework, risk_identification, action_plan |
| `PipelineLifecycleState` | State machine: queued, running_stage, paused_review, resuming, completed, error |
| `EventCategory` | 13 event types (stage_start, stage_complete, gate_decision, artifact_revised, etc.) |
| `VerificationLayer` | Enum: self_audit, cross_model, deterministic |
| `ConfidenceLevel` | Enum: high, medium, low, unverified |
| `GateDecision` | Enum: auto_proceed, proceed_with_flags, needs_review, halt_error |
| `VerifierStatus` | Enum: completed, timeout, error, skipped, unavailable |
| `FieldCriticality` | Enum: required_material, required_supporting, optional |
| `HumanReviewOutcome` | Enum: approved, approved_with_override, rejected, escalated |
| `HumanWorkflowAction` | Enum: resume_pipeline, re_run_stage, keep_paused, abort_pipeline |
| `EvidenceReference` | Structured quote reference with verification metadata |
| `FindingType` | Enum: ungrounded, cross_model_disagreement, missing_extraction, consistency_error, completeness_gap, confidence_below_threshold, rule_violation, grounding_quote_missing |
| `VerificationFinding` | Individual finding with severity, type, field path, evidence, resolution, storage context |
| `PipelineError` | Structured error with class, retryable flag, diagnostics ref |
| `ArtifactRecord` | Version-tracked stage output with lineage (active/superseded/stale) |
| `PipelineEvent` | The event envelope: identity, classification, timing, context, verification payload, gate reasoning, human action, error, metadata |
| `ReviewPackage` | Human review contract with resume token, gate snapshot, outcome |
| `StageVerificationSummary` | Per-stage verification rollup |
| `AssessmentVerificationSummary` | Full pipeline verification rollup |

### Acceptance Criteria

- `pnpm build` succeeds in shared-types with zero errors
- `pnpm build` succeeds in pipeline-api (imports resolve)
- All 18 schemas and their inferred types are exported from the package
- Existing tests still pass (`pnpm test` from pipeline-api)

---

## Task 2: EventSink + FindingStore

**Create:** `packages/pipeline-api/src/lib/event-sink.ts`
**Test:** `packages/pipeline-api/tests/lib/event-sink.spec.ts`
**Reference:** `Research/impl/event-sink.ts`

### EventSink Interface

```typescript
interface EventSink {
  emit(event: PipelineEvent): Promise<void>;
  flush(): Promise<void>;
  getEvents(assessment_id: string): Promise<PipelineEvent[]>;
  getEventsByStage(assessment_id: string, stage: PipelineStage): Promise<PipelineEvent[]>;
  getEventsByRun(run_id: string): Promise<PipelineEvent[]>;
}
```

### FindingStore Interface

```typescript
interface FindingStore {
  persist(findings: VerificationFinding[]): Promise<void>;
  getFindings(finding_ids: string[]): Promise<VerificationFinding[]>;
  getFindingsByAssessment(assessment_id: string): Promise<VerificationFinding[]>;
  getFindingsByStageRun(
    assessment_id: string,
    run_id: string,
    stage: PipelineStage,
  ): Promise<VerificationFinding[]>;
}
```

### Implementation: JsonFileEventSink + JsonFileFindingStore

- **Storage format:** JSONL (one JSON object per line). One file per assessment.
- **Directory structure:** `{baseDir}/events/{assessment_id}.jsonl` and `{baseDir}/findings/{assessment_id}.jsonl`
- **Write strategy:** Buffer up to 10 events, then flush. Also flush on 1-second timer. Flush on explicit `.flush()` call.
- **Read strategy:** Read entire JSONL file, parse line by line, filter in memory.
- **`getEventsByRun`:** Must scan all assessment files (acceptable at Phase 1 volume). Add a comment noting PostgreSQL Phase 2 uses indexed query.
- **Thread safety:** Not required. Node.js is single-threaded. Concurrent assessment runs write to different files.
- **Missing/empty files:** Return empty array, do not throw.
- **Directory creation:** Use `mkdir({ recursive: true })` on first write.

### Configuration

- **Environment variable:** `VERIFICATION_DATA_DIR` (default: `./data/verification`)
- **Add to `.gitignore`:** `data/verification/` (JSONL files contain assessment data)
- **Create directory on first write:** Use `mkdir({ recursive: true })`

### Tests Required

Write tests in `packages/pipeline-api/tests/lib/event-sink.spec.ts` using Vitest. Use a temp directory (`fs.mkdtempSync`) for each test.

1. **emit + flush + getEvents roundtrip:** emit 3 events, flush, read back, verify all 3 present with correct structure
2. **getEventsByStage:** emit events for 2 different stages, filter by one, verify only matching events returned
3. **getEventsByRun:** emit events with 2 different run_ids across 2 assessment files, query by run_id, verify correct results
4. **Auto-flush on buffer size:** emit 10 events without explicit flush, verify file is written
5. **FindingStore persist + getFindings roundtrip**
6. **FindingStore getFindingsByAssessment filter**
7. **FindingStore getFindingsByStageRun filter**
8. **Empty file / missing file returns empty array** (no throw)

### Acceptance Criteria

- All 8 tests pass
- JSONL files are valid (each line is parseable JSON)
- Events are appended, never overwritten (append-only log)
- No runtime errors when `VERIFICATION_DATA_DIR` does not exist (auto-create)

---

## Task 3: PipelineEventEmitter

**Create:** `packages/pipeline-api/src/lib/pipeline-event-emitter.ts`
**Test:** `packages/pipeline-api/tests/lib/pipeline-event-emitter.spec.ts`
**Reference:** `Research/impl/event-emitter-wiring.ts` (top half: PipelineEventEmitter class)

### Purpose

Helper class that manages run context (`assessment_id`, `run_id`, `attempt_no`), auto-increments `sequence_no`, and constructs `PipelineEvent` objects so the orchestrator does not deal with event boilerplate. Delegates to `EventSink` for persistence.

### Constructor

```typescript
constructor(opts: {
  sink: EventSink;
  assessmentId: string;
  runId: string;
  attemptNo?: number;        // Default: 1
  pipelineVersion: string;
})
```

### Public Methods

| Method | Behavior |
|--------|----------|
| `pipelineStart()` | Emit `pipeline_start` event. Set internal state to `running_stage`. Returns event_id. |
| `pipelineComplete({totalDurationMs, overallConfidence?, overallConfidenceScore?})` | Emit `pipeline_complete`. Set state to `completed`. Returns event_id. |
| `pipelineError(error: PipelineError)` | Emit `pipeline_error`. Set state to `error`. Returns event_id. |
| `stageStart(stage, {inputHash?, modelId?, promptVersion?})` | Emit `stage_start` for the given stage. Returns event_id. |
| `stageComplete(stage, {durationMs, output, modelId?, artifactVersion?, promptVersion?, taxonomyVersion?, frameworkVersion?})` | Emit `stage_complete`. Hash the output for `output_hash`. Returns event_id. |
| `gateDecision(stage, {decision, confidence, confidenceScore, reasons, reasonCodes, hardStopsTriggered, findingIds?, findingCount?})` | Emit `gate_decision`. In shadow mode, caller always passes `auto_proceed`. Returns event_id. |
| `flush()` | Delegate to `sink.flush()`. Call at end of pipeline run. |

### Internal Behavior

- **Event ID generation:** Timestamp prefix (base36) + 16 random hex chars. Sortable and unique. Or use a ULID library if already in the project.
- **Sequence numbering:** Internal counter starts at 0, increments on each `emit()` call. Monotonic within a run.
- **Output hashing:** `SHA-256` of `JSON.stringify(output)`, truncated to 16 hex chars.
- **Timestamp:** `new Date().toISOString()` at emit time.
- **Schema version:** Always `'0.3'` (literal).
- **Pipeline state tracking:** Internal state variable. Updated by lifecycle methods. Included in every event as `pipeline_state`.

### Tests Required

Write tests in `packages/pipeline-api/tests/lib/pipeline-event-emitter.spec.ts` using Vitest. Use a mock or in-memory `EventSink`.

1. **Sequence numbering:** emit 5 events, verify `sequence_no` is 0, 1, 2, 3, 4
2. **Event structure:** emit a `stageStart`, validate the resulting event against `PipelineEvent` Zod schema
3. **Pipeline state transitions:** `pipelineStart` sets `running_stage`, `pipelineComplete` sets `completed`, `pipelineError` sets `error`
4. **Output hashing:** `stageComplete` produces a deterministic `output_hash` for the same input
5. **Flush delegation:** calling `flush()` calls `sink.flush()`

### Acceptance Criteria

- All 5 tests pass
- Every emitted event validates against the `PipelineEvent` Zod schema
- No direct event emission to disk; all writes go through `EventSink` interface

---

## Task 4: Orchestrator Wiring

**Modify:** `packages/pipeline-api/src/services/pipeline-orchestrator.ts`
**Reference:** `Research/impl/event-emitter-wiring.ts` (bottom half: commented wiring example)
**Pattern:** Add emitter calls alongside existing SSE calls. Do not replace SSE calls.

### 4.1 Module-level Initialization

At the top of `pipeline-orchestrator.ts`, add:

```typescript
import { PipelineEventEmitter } from '../lib/pipeline-event-emitter';
import { JsonFileEventSink } from '../lib/event-sink';
import { randomUUID } from 'crypto';

const eventSink = new JsonFileEventSink({
  baseDir: process.env.VERIFICATION_DATA_DIR ?? './data/verification',
});
```

Initialize the sink once at module level. It is reused across all assessment runs.

### 4.2 Inside runAssessment()

At the start of the function, create an emitter:

```typescript
const assessmentId = randomUUID();  // Or use existing ID if one is already generated
const runId = randomUUID();
const emitter = new PipelineEventEmitter({
  sink: eventSink,
  assessmentId,
  runId,
  pipelineVersion: process.env.PIPELINE_VERSION ?? '1.0.0',
});

const pipelineStart = Date.now();
await emitter.pipelineStart();
```

### 4.3 At Each Stage

For each of the 6 stages, add emitter calls alongside the existing `progressCallback` calls. The pattern is identical for every stage:

```typescript
// BEFORE the stage runs:
await emitter.stageStart('extraction', {
  inputHash: hashContent(previousOutput),
  modelId: config.extractionModel ?? 'claude-haiku-4-5-20251001',
  promptVersion: config.extractionPromptVersion ?? '1.0',
});

// AFTER the stage completes (alongside existing progressCallback):
await emitter.stageComplete('extraction', {
  durationMs: elapsed,
  output: stageOutput,
  modelId: config.extractionModel ?? 'claude-haiku-4-5-20251001',
});

// AFTER stage_complete, emit shadow gate:
await emitter.gateDecision('extraction', {
  decision: 'auto_proceed',
  confidence: 'medium',
  confidenceScore: 0.7,
  reasons: ['Shadow mode - verification not yet active'],
  reasonCodes: ['SHADOW_PASS'],
  hardStopsTriggered: [],
});
```

### 4.4 Stage-Specific Notes

| Stage | modelId | Extra Fields | Gate Confidence |
|-------|---------|-------------|-----------------|
| 1 - parse | None (deterministic) | None | `high`, score `1.0`, reason: `'Deterministic parse'` |
| 2 - extraction | From config, default `claude-haiku-4-5-20251001` | `promptVersion` from config. If per-field confidence scores exist, compute average for `confidenceScore`. | Computed from field scores, or `medium` / `0.7` default |
| 3 - regulatory | From config, default `claude-sonnet-4-6` | None | `medium`, `0.7` |
| 4 - framework | None (deterministic) | `frameworkVersion` from config | `high`, `1.0`, reason: `'Deterministic stage'` |
| 5 - risk_identification | From config, default `claude-sonnet-4-6` | `taxonomyVersion` from config | `medium`, `0.7` |
| 6 - action_plan | From config, default `claude-sonnet-4-6` | None | `medium`, `0.7` |

### 4.5 Pipeline Completion

```typescript
// After final stage completes and assessment is assembled:
await emitter.pipelineComplete({
  totalDurationMs: Date.now() - pipelineStart,
  overallConfidence: 'medium',
  overallConfidenceScore: 0.7,
});
await emitter.flush();
```

### 4.6 Error Handling

Wrap the entire pipeline in try/catch. In the catch block:

```typescript
await emitter.pipelineError({
  error_code: 'PIPELINE_UNHANDLED',
  error_class: 'internal',
  retryable: false,
  message: error instanceof Error ? error.message : String(error),
  failed_component: 'pipeline-orchestrator',
});
await emitter.flush();
throw error;  // Re-throw to preserve existing error handling
```

### 4.7 What NOT to Change

- Do not remove or modify any existing `progressCallback()` calls
- Do not remove or modify any existing `logger.info()` calls
- Do not change the function signature of `runAssessment()`
- Do not change the return type (`GovernanceAssessment`)
- Do not add gate enforcement logic — all gates `auto_proceed` in shadow mode

### Acceptance Criteria

- All 75 existing tests still pass
- Running an assessment produces a JSONL file in `data/verification/events/` with events for all 6 stages
- Each JSONL file contains: 1 `pipeline_start` + 6 `stage_start` + 6 `stage_complete` + 6 `gate_decision` + 1 `pipeline_complete` = **20 events minimum**
- Every event in the JSONL file validates against the `PipelineEvent` Zod schema
- SSE stream behavior is unchanged (dashboard still works)
- Pipeline errors produce a `pipeline_error` event before re-throwing

---

## Task 5: Environment Configuration

1. **Add `VERIFICATION_DATA_DIR`** to `.env.example` with default value `./data/verification`
2. **Add `data/verification/`** to `.gitignore` (JSONL files contain assessment data, must not be committed)
3. **Add `PIPELINE_VERSION`** to `.env.example` with default value `1.0.0`

---

## File Manifest

### Files to Create

| File | Source | Action |
|------|--------|--------|
| `packages/shared-types/src/verification.ts` | `impl/verification-schemas.ts` | Copy verbatim |
| `packages/pipeline-api/src/lib/event-sink.ts` | `impl/event-sink.ts` | Use as starting point |
| `packages/pipeline-api/src/lib/pipeline-event-emitter.ts` | `impl/event-emitter-wiring.ts` | Extract class (top half) |
| `packages/pipeline-api/tests/lib/event-sink.spec.ts` | None | Write per Task 2 tests |
| `packages/pipeline-api/tests/lib/pipeline-event-emitter.spec.ts` | None | Write per Task 3 tests |

### Files to Modify

| File | Change |
|------|--------|
| `packages/shared-types/src/index.ts` | Add: `export * from './verification';` |
| `packages/pipeline-api/src/services/pipeline-orchestrator.ts` | Wire emitter per Task 4 |
| `.env.example` | Add `VERIFICATION_DATA_DIR` and `PIPELINE_VERSION` |
| `.gitignore` | Add `data/verification/` |

---

## Validation Checklist

Run these checks after implementation is complete. All must pass.

### Build Checks

```bash
cd packages/shared-types && pnpm build       # Zero TS errors
cd packages/pipeline-api && pnpm build       # Zero TS errors, shared-types resolves
cd packages/pipeline-api && pnpm test        # All 75+ tests pass (existing + new)
```

### Functional Checks

- Run one assessment through the pipeline (any test fixture document)
- Verify `data/verification/events/{assessment_id}.jsonl` exists
- Verify the JSONL file contains exactly 20 events (1 pipeline_start + 6 stage_start + 6 stage_complete + 6 gate_decision + 1 pipeline_complete)
- Parse every line as JSON and validate against `PipelineEvent` schema
- Verify `sequence_no` values are 0 through 19 (monotonic)
- Verify all `gate_decision` events have `decision: 'auto_proceed'` (shadow mode)
- Verify the SSE stream still works (dashboard renders pipeline progress)

### Negative Checks

- Trigger a pipeline error (malformed document). Verify `pipeline_error` event is written.
- Delete `data/verification/` directory. Run an assessment. Verify directory is auto-created.

---

## Out of Scope

The following are explicitly NOT part of this sprint. Do not implement them.

- Gate enforcement (gates always `auto_proceed` in shadow mode)
- Verification layers (self-audit, cross-model, deterministic validators)
- Human review flow (ReviewPackageStore, resume tokens, resume API)
- Downstream invalidation
- Dashboard UI changes
- PostgreSQL backend
- Any changes to the `apps/dashboard/` directory

---

*Sprint 2 (Stage 2 Verification POC) and Sprint 3 (Shadow Mode Calibration) specs will be produced after Sprint 1 is implemented and validated. See `Research/impl/sprint-backlog.md` for the full roadmap.*
