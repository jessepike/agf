/**
 * Pipeline Event Emitter — Orchestrator Wiring
 *
 * This file provides:
 * 1. PipelineEventEmitter: Helper that manages run context, sequence numbering,
 *    and event construction so the orchestrator doesn't deal with boilerplate.
 * 2. Wiring example: Shows exactly how to integrate with the existing
 *    pipeline-orchestrator.ts runAssessment() function.
 *
 * Drop into: packages/pipeline-api/src/lib/pipeline-event-emitter.ts
 *
 * SHADOW MODE: In Phase 1A, this emits events alongside the existing SSE stream.
 * No gate enforcement. No verification layers. Pure structured logging of what
 * the pipeline already does — capturing the baseline data needed to calibrate
 * thresholds before verification has teeth.
 *
 * Spec reference: pipeline-verification-spec-v0.3.md, Section 10.1
 */

import { randomUUID } from 'crypto';
import { createHash } from 'crypto';
import type {
  PipelineEvent,
  PipelineStage,
  EventCategory,
  PipelineLifecycleState,
  ConfidenceLevel,
  GateDecision,
  PipelineError,
} from '@airisktools/shared-types';
import type { EventSink } from './event-sink';

// ─── ULID-like ID generator (swap for real ULID lib if preferred) ──
function generateEventId(): string {
  // timestamp prefix + random suffix for sortable uniqueness
  const timestamp = Date.now().toString(36);
  const random = randomUUID().replace(/-/g, '').slice(0, 16);
  return `${timestamp}-${random}`;
}

function hashContent(content: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(content))
    .digest('hex')
    .slice(0, 16); // truncated for readability; full hash in production
}

// ─── Pipeline Event Emitter ────────────────────────────────────

export class PipelineEventEmitter {
  private sink: EventSink;
  private assessmentId: string;
  private runId: string;
  private attemptNo: number;
  private sequenceNo: number = 0;
  private pipelineVersion: string;
  private pipelineState: PipelineLifecycleState = 'queued';

  constructor(opts: {
    sink: EventSink;
    assessmentId: string;
    runId: string;
    attemptNo?: number;
    pipelineVersion: string;
  }) {
    this.sink = opts.sink;
    this.assessmentId = opts.assessmentId;
    this.runId = opts.runId;
    this.attemptNo = opts.attemptNo ?? 1;
    this.pipelineVersion = opts.pipelineVersion;
  }

  // ── Lifecycle events ───────────────────────────────────────────

  async pipelineStart(): Promise<string> {
    this.pipelineState = 'running_stage';
    return this.emit({
      category: 'pipeline_start',
      pipeline_state: this.pipelineState,
    });
  }

  async pipelineComplete(opts: {
    totalDurationMs: number;
    overallConfidence?: ConfidenceLevel;
    overallConfidenceScore?: number;
  }): Promise<string> {
    this.pipelineState = 'completed';
    return this.emit({
      category: 'pipeline_complete',
      pipeline_state: this.pipelineState,
      duration_ms: opts.totalDurationMs,
      confidence: opts.overallConfidence,
      confidence_score: opts.overallConfidenceScore,
    });
  }

  async pipelineError(error: PipelineError): Promise<string> {
    this.pipelineState = 'error';
    return this.emit({
      category: 'pipeline_error',
      pipeline_state: this.pipelineState,
      error,
    });
  }

  // ── Stage events ───────────────────────────────────────────────

  async stageStart(stage: PipelineStage, opts?: {
    inputHash?: string;
    modelId?: string;
    promptVersion?: string;
  }): Promise<string> {
    return this.emit({
      category: 'stage_start',
      stage,
      pipeline_state: 'running_stage',
      input_hash: opts?.inputHash,
      model_id: opts?.modelId,
      prompt_version: opts?.promptVersion,
    });
  }

  async stageComplete(stage: PipelineStage, opts: {
    durationMs: number;
    output: unknown;
    modelId?: string;
    artifactVersion?: string;
    promptVersion?: string;
    taxonomyVersion?: string;
    frameworkVersion?: string;
  }): Promise<string> {
    return this.emit({
      category: 'stage_complete',
      stage,
      pipeline_state: 'running_stage',
      duration_ms: opts.durationMs,
      output_hash: hashContent(opts.output),
      model_id: opts.modelId,
      prompt_version: opts.promptVersion,
      taxonomy_version: opts.taxonomyVersion,
      framework_version: opts.frameworkVersion,
      metadata: opts.artifactVersion
        ? { artifact_version: opts.artifactVersion }
        : undefined,
    });
  }

  // ── Gate events (shadow mode: always auto_proceed) ─────────────

  async gateDecision(stage: PipelineStage, opts: {
    decision: GateDecision;
    confidence: ConfidenceLevel;
    confidenceScore: number;
    reasons: string[];
    reasonCodes: string[];
    hardStopsTriggered: string[];
    findingIds?: string[];
    findingCount?: { info: number; warning: number; critical: number };
  }): Promise<string> {
    return this.emit({
      category: 'gate_decision',
      stage,
      pipeline_state: this.pipelineState,
      gate_decision: opts.decision,
      confidence: opts.confidence,
      confidence_score: opts.confidenceScore,
      gate_reasons: opts.reasons,
      gate_reason_codes: opts.reasonCodes,
      finding_ids: opts.findingIds,
      finding_count: opts.findingCount,
      metadata: {
        hard_stops_triggered: opts.hardStopsTriggered,
        shadow_mode: true, // Phase 1A flag — remove when gate enforcement enabled
      },
    });
  }

  // ── Low-level emit ─────────────────────────────────────────────

  private async emit(
    partial: Partial<PipelineEvent> & { category: EventCategory },
  ): Promise<string> {
    const eventId = generateEventId();

    const event: PipelineEvent = {
      event_id: eventId,
      assessment_id: this.assessmentId,
      run_id: this.runId,
      attempt_no: this.attemptNo,
      sequence_no: this.sequenceNo++,
      timestamp: new Date().toISOString(),
      pipeline_version: this.pipelineVersion,
      schema_version: '0.3',
      ...partial,
    };

    await this.sink.emit(event);
    return eventId;
  }

  /** Flush remaining buffered events to disk. Call at end of pipeline. */
  async flush(): Promise<void> {
    await this.sink.flush();
  }
}

// ════════════════════════════════════════════════════════════════
// WIRING EXAMPLE
//
// Shows exactly how PipelineEventEmitter integrates with the existing
// pipeline-orchestrator.ts runAssessment() function.
//
// The existing SSE stream (sendSSE / progressCallback) is UNCHANGED.
// The event emitter runs alongside it as a parallel structured log.
// ════════════════════════════════════════════════════════════════

/*

// ──────────────────────────────────────────────────────────────
// In pipeline-orchestrator.ts — BEFORE (existing code, simplified)
// ──────────────────────────────────────────────────────────────

async function runAssessment(
  documentBuffer: Buffer,
  filename: string,
  config: PipelineConfig,
  progressCallback: (event: SSEEvent) => void
): Promise<GovernanceAssessment> {

  progressCallback({ event: 'step_start', data: { step: 1, name: 'parse' } });
  const parsed = await parseDocument(documentBuffer, filename);
  progressCallback({ event: 'step_complete', data: { step: 1, name: 'parse', duration_ms: 120 } });

  progressCallback({ event: 'step_start', data: { step: 2, name: 'extraction' } });
  const context = await extractContext(parsed.text, config);
  progressCallback({ event: 'step_complete', data: { step: 2, name: 'extraction', duration_ms: 3200 } });

  // ... stages 3-6 follow same pattern ...

  return assembleAssessment(context, regulatory, frameworks, risks, actions);
}

// ──────────────────────────────────────────────────────────────
// In pipeline-orchestrator.ts — AFTER (with event emitter wired in)
// ──────────────────────────────────────────────────────────────

import { PipelineEventEmitter } from '../lib/pipeline-event-emitter';
import { JsonFileEventSink } from '../lib/event-sink';
import { randomUUID } from 'crypto';

// Initialize once at module level or in server startup
const eventSink = new JsonFileEventSink({
  baseDir: process.env.VERIFICATION_DATA_DIR ?? './data/verification',
  flushIntervalMs: 1000,
});

async function runAssessment(
  documentBuffer: Buffer,
  filename: string,
  config: PipelineConfig,
  progressCallback: (event: SSEEvent) => void
): Promise<GovernanceAssessment> {

  const assessmentId = randomUUID();
  const runId = randomUUID();

  // Create event emitter for this assessment run
  const emitter = new PipelineEventEmitter({
    sink: eventSink,
    assessmentId,
    runId,
    pipelineVersion: process.env.PIPELINE_VERSION ?? '1.0.0',
  });

  const pipelineStart = Date.now();
  await emitter.pipelineStart();

  try {
    // ── Stage 1: Parse ──────────────────────────────────────────
    progressCallback({ event: 'step_start', data: { step: 1, name: 'parse' } });
    await emitter.stageStart('parse');

    const t1 = Date.now();
    const parsed = await parseDocument(documentBuffer, filename);
    const d1 = Date.now() - t1;

    progressCallback({ event: 'step_complete', data: { step: 1, name: 'parse', duration_ms: d1 } });
    await emitter.stageComplete('parse', {
      durationMs: d1,
      output: { wordCount: parsed.wordCount, filename },
    });

    // Shadow mode gate: log what WOULD happen, always proceed
    await emitter.gateDecision('parse', {
      decision: 'auto_proceed',
      confidence: 'high',
      confidenceScore: 1.0,
      reasons: ['Shadow mode — parse stage has no verification layer yet'],
      reasonCodes: ['SHADOW_PASS'],
      hardStopsTriggered: [],
    });

    // ── Stage 2: Extraction ─────────────────────────────────────
    progressCallback({ event: 'step_start', data: { step: 2, name: 'extraction' } });
    await emitter.stageStart('extraction', {
      inputHash: hashContent(parsed.text),
      modelId: config.extractionModel ?? 'claude-haiku-4-5-20251001',
      promptVersion: config.extractionPromptVersion ?? '1.0',
    });

    const t2 = Date.now();
    const context = await extractContext(parsed.text, config);
    const d2 = Date.now() - t2;

    progressCallback({
      event: 'step_complete',
      data: { step: 2, name: 'extraction', duration_ms: d2, fields_extracted: Object.keys(context).length },
    });
    await emitter.stageComplete('extraction', {
      durationMs: d2,
      output: context,
      modelId: config.extractionModel ?? 'claude-haiku-4-5-20251001',
      promptVersion: config.extractionPromptVersion ?? '1.0',
    });

    // Shadow mode gate: log confidence from existing field-level scores
    const fieldConfidences = Object.values(context.field_confidence ?? {});
    const avgConfidence = fieldConfidences.length > 0
      ? fieldConfidences.reduce((a, b) => a + b, 0) / fieldConfidences.length
      : 0;

    await emitter.gateDecision('extraction', {
      decision: 'auto_proceed', // Shadow mode: always proceed
      confidence: avgConfidence > 0.8 ? 'high' : avgConfidence > 0.5 ? 'medium' : 'low',
      confidenceScore: avgConfidence,
      reasons: ['Shadow mode — verification layers not yet active'],
      reasonCodes: ['SHADOW_PASS'],
      hardStopsTriggered: [],
    });

    // ── Stage 3: Regulatory ─────────────────────────────────────
    progressCallback({ event: 'step_start', data: { step: 3, name: 'regulatory' } });
    await emitter.stageStart('regulatory', {
      modelId: config.regulatoryModel ?? 'claude-sonnet-4-6',
    });

    const t3 = Date.now();
    const regulatory = await analyzeRegulatory(context, config);
    const d3 = Date.now() - t3;

    progressCallback({ event: 'step_complete', data: { step: 3, name: 'regulatory', duration_ms: d3 } });
    await emitter.stageComplete('regulatory', {
      durationMs: d3,
      output: regulatory,
      modelId: config.regulatoryModel ?? 'claude-sonnet-4-6',
    });

    await emitter.gateDecision('regulatory', {
      decision: 'auto_proceed',
      confidence: 'medium',
      confidenceScore: 0.7,
      reasons: ['Shadow mode — regulatory verification not yet active'],
      reasonCodes: ['SHADOW_PASS'],
      hardStopsTriggered: [],
    });

    // ── Stage 4: Framework ──────────────────────────────────────
    progressCallback({ event: 'step_start', data: { step: 4, name: 'framework' } });
    await emitter.stageStart('framework');

    const t4 = Date.now();
    const frameworks = await filterFrameworks(context, regulatory, config);
    const d4 = Date.now() - t4;

    progressCallback({ event: 'step_complete', data: { step: 4, name: 'framework', duration_ms: d4 } });
    await emitter.stageComplete('framework', {
      durationMs: d4,
      output: frameworks,
      frameworkVersion: config.frameworkDataVersion ?? '1.0',
    });

    await emitter.gateDecision('framework', {
      decision: 'auto_proceed',
      confidence: 'high',
      confidenceScore: 1.0,
      reasons: ['Deterministic stage — no LLM verification needed'],
      reasonCodes: ['DETERMINISTIC_PASS'],
      hardStopsTriggered: [],
    });

    // ── Stage 5: Risk Identification ────────────────────────────
    progressCallback({ event: 'step_start', data: { step: 5, name: 'risk_identification' } });
    await emitter.stageStart('risk_identification', {
      modelId: config.riskModel ?? 'claude-sonnet-4-6',
      taxonomyVersion: config.riskTaxonomyVersion ?? 'mit-airisk-1.0',
    });

    const t5 = Date.now();
    const risks = await identifyRisks(context, frameworks, config);
    const d5 = Date.now() - t5;

    progressCallback({ event: 'step_complete', data: { step: 5, name: 'risk_identification', duration_ms: d5 } });
    await emitter.stageComplete('risk_identification', {
      durationMs: d5,
      output: risks,
      modelId: config.riskModel ?? 'claude-sonnet-4-6',
      taxonomyVersion: config.riskTaxonomyVersion ?? 'mit-airisk-1.0',
    });

    await emitter.gateDecision('risk_identification', {
      decision: 'auto_proceed',
      confidence: 'medium',
      confidenceScore: 0.7,
      reasons: ['Shadow mode — risk verification not yet active'],
      reasonCodes: ['SHADOW_PASS'],
      hardStopsTriggered: [],
    });

    // ── Stage 6: Action Plan ────────────────────────────────────
    progressCallback({ event: 'step_start', data: { step: 6, name: 'action_plan' } });
    await emitter.stageStart('action_plan', {
      modelId: config.actionPlanModel ?? 'claude-sonnet-4-6',
    });

    const t6 = Date.now();
    const actions = await generateActionPlan(context, regulatory, frameworks, risks, config);
    const d6 = Date.now() - t6;

    progressCallback({ event: 'step_complete', data: { step: 6, name: 'action_plan', duration_ms: d6 } });
    await emitter.stageComplete('action_plan', {
      durationMs: d6,
      output: actions,
      modelId: config.actionPlanModel ?? 'claude-sonnet-4-6',
    });

    await emitter.gateDecision('action_plan', {
      decision: 'auto_proceed',
      confidence: 'medium',
      confidenceScore: 0.7,
      reasons: ['Shadow mode — action plan verification not yet active'],
      reasonCodes: ['SHADOW_PASS'],
      hardStopsTriggered: [],
    });

    // ── Assemble & Complete ─────────────────────────────────────
    const result = assembleAssessment(context, regulatory, frameworks, risks, actions);
    const totalDuration = Date.now() - pipelineStart;

    await emitter.pipelineComplete({
      totalDurationMs: totalDuration,
      overallConfidence: 'medium', // Shadow mode default
      overallConfidenceScore: avgConfidence,
    });

    progressCallback({
      event: 'assessment_complete',
      data: { assessment_id: assessmentId, total_duration_ms: totalDuration },
    });

    await emitter.flush();
    return result;

  } catch (error) {
    await emitter.pipelineError({
      error_code: 'PIPELINE_UNHANDLED',
      error_class: 'internal',
      retryable: false,
      message: error instanceof Error ? error.message : String(error),
      failed_component: 'pipeline-orchestrator',
    });
    await emitter.flush();
    throw error;
  }
}

*/
