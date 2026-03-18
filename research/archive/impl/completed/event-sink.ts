/**
 * EventSink + FindingStore — JSON File Backend (Phase 1)
 *
 * Drop into: packages/pipeline-api/src/lib/event-sink.ts
 *
 * Phase 1 implementation writes JSONL (one JSON object per line) to disk.
 * One file per assessment for events, one file per assessment for findings.
 * The interface is stable — swap to PostgreSQL in Phase 2 without changing
 * any calling code.
 *
 * Spec reference: pipeline-verification-spec-v0.3.md, Section 11 (v0.2 §7)
 */

import { mkdir, appendFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type {
  PipelineEvent,
  PipelineStage,
  VerificationFinding,
} from '@airisktools/shared-types';

// ─── Interfaces ────────────────────────────────────────────────

export interface EventSink {
  /** Persist a single event. Append-only. */
  emit(event: PipelineEvent): Promise<void>;

  /** Flush any buffered writes to disk. */
  flush(): Promise<void>;

  /** All events for an assessment (across all runs). */
  getEvents(assessment_id: string): Promise<PipelineEvent[]>;

  /** Events for a specific stage within an assessment. */
  getEventsByStage(
    assessment_id: string,
    stage: PipelineStage,
  ): Promise<PipelineEvent[]>;

  /** All events for a specific run. */
  getEventsByRun(run_id: string): Promise<PipelineEvent[]>;
}

export interface FindingStore {
  /** Persist a batch of findings. */
  persist(findings: VerificationFinding[]): Promise<void>;

  /** Load specific findings by ID. */
  getFindings(finding_ids: string[]): Promise<VerificationFinding[]>;

  /** All findings for an assessment (across all runs). */
  getFindingsByAssessment(
    assessment_id: string,
  ): Promise<VerificationFinding[]>;

  /** All findings for a specific stage + run. */
  getFindingsByStageRun(
    assessment_id: string,
    run_id: string,
    stage: PipelineStage,
  ): Promise<VerificationFinding[]>;
}

// ─── JSON File EventSink ───────────────────────────────────────

export class JsonFileEventSink implements EventSink {
  private baseDir: string;
  private buffer: PipelineEvent[] = [];
  private flushIntervalMs: number;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(opts: {
    baseDir: string;
    flushIntervalMs?: number;
  }) {
    this.baseDir = opts.baseDir;
    this.flushIntervalMs = opts.flushIntervalMs ?? 1000;
  }

  async emit(event: PipelineEvent): Promise<void> {
    this.buffer.push(event);

    // Auto-flush on buffer size or timer
    if (this.buffer.length >= 10) {
      await this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushIntervalMs);
    }
  }

  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.buffer.length === 0) return;

    // Group by assessment_id for file-per-assessment writes
    const byAssessment = new Map<string, PipelineEvent[]>();
    for (const event of this.buffer) {
      const existing = byAssessment.get(event.assessment_id) ?? [];
      existing.push(event);
      byAssessment.set(event.assessment_id, existing);
    }

    this.buffer = [];

    for (const [assessmentId, events] of byAssessment) {
      const dir = path.join(this.baseDir, 'events');
      await mkdir(dir, { recursive: true });

      const filePath = path.join(dir, `${assessmentId}.jsonl`);
      const lines = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
      await appendFile(filePath, lines, 'utf-8');
    }
  }

  async getEvents(assessment_id: string): Promise<PipelineEvent[]> {
    // Flush buffer first to ensure we read latest
    await this.flush();
    return this.readEventsFile(assessment_id);
  }

  async getEventsByStage(
    assessment_id: string,
    stage: PipelineStage,
  ): Promise<PipelineEvent[]> {
    const all = await this.getEvents(assessment_id);
    return all.filter((e) => e.stage === stage);
  }

  async getEventsByRun(run_id: string): Promise<PipelineEvent[]> {
    // Note: This requires scanning all assessment files in Phase 1.
    // Acceptable at low volume. PostgreSQL Phase 2 uses an indexed query.
    await this.flush();

    const eventsDir = path.join(this.baseDir, 'events');
    if (!existsSync(eventsDir)) return [];

    const { readdir } = await import('fs/promises');
    const files = await readdir(eventsDir);
    const results: PipelineEvent[] = [];

    for (const file of files) {
      if (!file.endsWith('.jsonl')) continue;
      const assessmentId = file.replace('.jsonl', '');
      const events = await this.readEventsFile(assessmentId);
      results.push(...events.filter((e) => e.run_id === run_id));
    }

    return results;
  }

  private async readEventsFile(
    assessment_id: string,
  ): Promise<PipelineEvent[]> {
    const filePath = path.join(this.baseDir, 'events', `${assessment_id}.jsonl`);
    if (!existsSync(filePath)) return [];

    const content = await readFile(filePath, 'utf-8');
    return content
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line) as PipelineEvent);
  }
}

// ─── JSON File FindingStore ────────────────────────────────────

export class JsonFileFindingStore implements FindingStore {
  private baseDir: string;

  constructor(opts: { baseDir: string }) {
    this.baseDir = opts.baseDir;
  }

  async persist(findings: VerificationFinding[]): Promise<void> {
    if (findings.length === 0) return;

    // Group by assessment_id
    const byAssessment = new Map<string, VerificationFinding[]>();
    for (const finding of findings) {
      const existing = byAssessment.get(finding.assessment_id) ?? [];
      existing.push(finding);
      byAssessment.set(finding.assessment_id, existing);
    }

    for (const [assessmentId, batch] of byAssessment) {
      const dir = path.join(this.baseDir, 'findings');
      await mkdir(dir, { recursive: true });

      const filePath = path.join(dir, `${assessmentId}.jsonl`);
      const lines = batch.map((f) => JSON.stringify(f)).join('\n') + '\n';
      await appendFile(filePath, lines, 'utf-8');
    }
  }

  async getFindings(finding_ids: string[]): Promise<VerificationFinding[]> {
    // Phase 1: scan all finding files. Acceptable at low volume.
    const findingsDir = path.join(this.baseDir, 'findings');
    if (!existsSync(findingsDir)) return [];

    const { readdir } = await import('fs/promises');
    const files = await readdir(findingsDir);
    const idSet = new Set(finding_ids);
    const results: VerificationFinding[] = [];

    for (const file of files) {
      if (!file.endsWith('.jsonl')) continue;
      const assessmentId = file.replace('.jsonl', '');
      const all = await this.readFindingsFile(assessmentId);
      results.push(...all.filter((f) => idSet.has(f.finding_id)));
      if (results.length === finding_ids.length) break;
    }

    return results;
  }

  async getFindingsByAssessment(
    assessment_id: string,
  ): Promise<VerificationFinding[]> {
    return this.readFindingsFile(assessment_id);
  }

  async getFindingsByStageRun(
    assessment_id: string,
    run_id: string,
    stage: PipelineStage,
  ): Promise<VerificationFinding[]> {
    const all = await this.readFindingsFile(assessment_id);
    return all.filter((f) => f.run_id === run_id && f.stage === stage);
  }

  private async readFindingsFile(
    assessment_id: string,
  ): Promise<VerificationFinding[]> {
    const filePath = path.join(
      this.baseDir,
      'findings',
      `${assessment_id}.jsonl`,
    );
    if (!existsSync(filePath)) return [];

    const content = await readFile(filePath, 'utf-8');
    return content
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line) as VerificationFinding);
  }
}
