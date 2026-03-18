# Implementation Spec: Pipeline Verification Layer — Sprint 2

**Project:** AI Risk Tools
**Sprint:** Stage 2 Verification Proof of Concept
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 15, 2026
**Status:** Ready for implementation (Codex handoff)
**Prerequisite:** Sprint 1 complete (verification schemas, EventSink, PipelineEventEmitter, orchestrator wiring — all passing)
**Architecture Spec:** `pipeline-verification-spec-v0.3.md` (Sections 8-10)

---

## Goal

Build the three verification layers for Stage 2 (extraction) only. The gate evaluates and produces real findings, but does NOT enforce — shadow mode continues. The orchestrator still overrides to `auto_proceed` regardless of what the gate decides. The purpose is to capture real verification data against production extractions so thresholds can be calibrated in Sprint 3.

After this sprint, every extraction stage run produces: structured verification findings from deterministic validators and LLM self-audit, a real gate decision (logged but not enforced), and the data needed to tune the grounding quote fuzzy match threshold and coverage threshold.

---

## Codebase Context

**Prerequisite state from Sprint 1:**

- `packages/shared-types/src/verification.ts` — All Zod schemas (PipelineEvent, VerificationFinding, GateDecision, FieldCriticality, EvidenceReference, etc.)
- `packages/pipeline-api/src/lib/event-sink.ts` — JsonFileEventSink + JsonFileFindingStore
- `packages/pipeline-api/src/lib/pipeline-event-emitter.ts` — PipelineEventEmitter
- `packages/pipeline-api/src/services/pipeline-orchestrator.ts` — Emitting shadow events at each stage
- 89 tests passing

**Existing extraction pipeline:**

- `packages/pipeline-api/src/services/extraction/extraction-service.ts` — LLM extraction (Haiku 4.5)
- `packages/pipeline-api/src/services/extraction/document-parser.ts` — PDF/Markdown parsing
- `packages/shared-types/src/index.ts` — `AssessmentContextSchema` with fields: `organization`, `ai_system`, `confidence`, `missing_fields`
- Extraction output is already Zod-validated against `AssessmentContextSchema`

**Key types from Sprint 1 (already in shared-types):**

```typescript
// Already available — do NOT redefine
VerificationFinding, EvidenceReference, FieldCriticality, FindingType,
VerificationLayer, VerifierStatus, ConfidenceLevel, GateDecision,
PipelineEvent, PipelineStage
```

---

## Task 1: Field Criticality Map for Stage 2

**Create:** `packages/pipeline-api/src/services/extraction/field-criticality.ts`
**Spec Reference:** v0.2 §6.1, v0.3 §11

### What to Do

Create a map from every `AssessmentContext` field path to its `FieldCriticality` value. This map is consumed by the deterministic validators and the gate evaluator to weight findings.

### Field Criticality Assignments

Read the actual `AssessmentContextSchema` in `packages/shared-types/src/index.ts` to get the exact field names. Map them according to this logic:

**`required_material`** — Fields that drive downstream stage logic. If these are wrong, everything downstream is wrong:

- Project/system name or identifier
- Description or summary of the AI system
- Sector / industry (drives regulatory applicability in Stage 3)
- Geography / jurisdiction (drives regulatory applicability in Stage 3)
- Use cases (drives risk identification in Stage 5)

**`required_supporting`** — Fields that influence downstream stages but are not primary drivers:

- Data types / data sensitivity (influences risk ranking)
- Lifecycle stage (drives framework filtering in Stage 4)
- Deployment model
- Model type

**`optional`** — Fields that add context but do not drive downstream logic:

- Stakeholders
- AI techniques / technology stack
- Any field not listed above

### Interface

```typescript
import { FieldCriticality } from '@airisktools/shared-types';

export const extractionFieldCriticality: Record<string, FieldCriticality> = {
  // Map actual field paths from AssessmentContextSchema here
  // e.g., 'context.sector': 'required_material',
};

/**
 * Look up criticality for a field path.
 * Returns 'optional' for unknown fields (safe default).
 */
export function getFieldCriticality(fieldPath: string): FieldCriticality {
  return extractionFieldCriticality[fieldPath] ?? 'optional';
}
```

### Implementation Notes

- The field paths must match the actual JSONPaths of the `AssessmentContext` output. Inspect the extraction service output to confirm the exact shape.
- If the schema uses nested objects (e.g., `context.organization.sector`), use dot notation matching those paths.
- Export both the map and the lookup function.

### Acceptance Criteria

- Every field in `AssessmentContextSchema` has an entry in the criticality map
- At least 3 fields are `required_material`, at least 3 are `required_supporting`
- `getFieldCriticality` returns `'optional'` for unknown paths
- File compiles with zero errors

---

## Task 2: Deterministic Validators for Stage 2

**Create:** `packages/pipeline-api/src/services/extraction/validators/` (directory with individual validator files)
**Test:** `packages/pipeline-api/tests/services/extraction/validators.spec.ts`
**Spec Reference:** v0.3 §8, §9

### 2.1 Validator Interface

All deterministic validators share this interface:

```typescript
import { VerificationFinding, EvidenceReference } from '@airisktools/shared-types';

export interface DeterministicValidator {
  id: string;
  description: string;
  check(
    output: unknown,                    // The extraction output (AssessmentContext)
    context: {
      source_document: { text: string; document_id: string };
    },
    selfAuditFindings?: VerificationFinding[],  // Only used by grounding_quote_exists
  ): VerificationFinding[];
}
```

### 2.2 Validators to Implement

Create each in a separate file under `validators/`, then re-export from `validators/index.ts`:

#### 2.2.1 `completeness-check.ts`

**ID:** `completeness_check`

**Logic:** For every field in the `extractionFieldCriticality` map, check whether the extraction output has a non-empty value. Empty string, null, undefined, empty array = missing.

**Finding production:**

- Missing `required_material` field → `{ finding_type: 'completeness_gap', severity: 'critical', field_criticality: 'required_material' }`
- Missing `required_supporting` field → `{ finding_type: 'completeness_gap', severity: 'warning', field_criticality: 'required_supporting' }`
- Missing `optional` field → `{ finding_type: 'completeness_gap', severity: 'info', field_criticality: 'optional' }`

#### 2.2.2 `schema-conformance.ts`

**ID:** `schema_conformance`

**Logic:** Re-validate the extraction output against `AssessmentContextSchema` using Zod's `.safeParse()`. This catches cases where the output was mutated or partially constructed after initial validation.

**Finding production:**

- Schema validation failure → `{ finding_type: 'rule_violation', severity: 'critical', description: Zod error message }`
- Schema passes → no findings

#### 2.2.3 `grounding-quote-check.ts`

**ID:** `grounding_quote_exists`

**This is the most important validator.** It verifies that quotes cited by the self-audit layer actually appear in the source document.

**Logic — Two-Pass Verification (v0.3 §9):**

```
For each self-audit finding that has evidence_refs with quotes:

  Pass 1: Exact substring match (normalized)
    - Normalize both quote and source: collapse whitespace, trim, lowercase
    - If normalizedSource.includes(normalizedQuote) → match_type: 'exact', quote_verified: true
    - Continue to next quote

  Pass 2: Fuzzy match (Jaccard token similarity)
    - Tokenize both quote and source (split on whitespace, filter tokens ≤ 2 chars)
    - Find best window match: slide a window of quote-token-count across source tokens,
      compute Jaccard similarity for each window, take the max
    - If similarity ≥ 0.85 → match_type: 'fuzzy', severity: 'info'
      (likely minor LLM rephrasing, not fabrication)
    - If similarity < 0.85 → match_type: 'none', severity: 'critical'
      (possible fabricated evidence)
```

**Utility functions to implement:**

```typescript
function normalizeForComparison(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(t => t.length > 2);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function bestWindowMatch(quoteTokens: string[], sourceTokens: string[]): Set<string> {
  const windowSize = quoteTokens.length;
  let bestSimilarity = 0;
  let bestWindow = new Set<string>();

  for (let i = 0; i <= sourceTokens.length - windowSize; i++) {
    const window = new Set(sourceTokens.slice(i, i + windowSize));
    const sim = jaccardSimilarity(new Set(quoteTokens), window);
    if (sim > bestSimilarity) {
      bestSimilarity = sim;
      bestWindow = window;
    }
  }
  return bestWindow;
}
```

**Finding production:**

- Fuzzy match (≥0.85): `{ finding_type: 'grounding_quote_missing', severity: 'info', description: 'Self-audit quote was rephrased (X% token overlap)...' }`
- No match (<0.85): `{ finding_type: 'grounding_quote_missing', severity: 'critical', description: 'Self-audit quoted "..." but text not found in source (X% best match). Possible hallucinated evidence.' }`

**Important:** This validator only runs if self-audit findings are provided (the `selfAuditFindings` parameter). If self-audit was skipped or failed, this validator produces no findings.

#### 2.2.4 `validators/index.ts`

Re-export all validators as an array:

```typescript
import { completenessCheck } from './completeness-check';
import { schemaConformance } from './schema-conformance';
import { groundingQuoteCheck } from './grounding-quote-check';
import type { DeterministicValidator } from './types';

export const extractionValidators: DeterministicValidator[] = [
  completenessCheck,
  schemaConformance,
  groundingQuoteCheck,
];

export type { DeterministicValidator };
```

### 2.3 Tests Required

Write tests in `packages/pipeline-api/tests/services/extraction/validators.spec.ts` using Vitest.

**completeness_check:**

1. All required fields present → no critical/warning findings
2. Missing `required_material` field → critical finding with correct field_path and field_criticality
3. Missing `required_supporting` field → warning finding
4. Missing `optional` field → info finding
5. Empty string treated as missing

**schema_conformance:**

6. Valid AssessmentContext → no findings
7. Invalid AssessmentContext (wrong type on a field) → critical finding with Zod error detail

**grounding_quote_check:**

8. Exact quote match → no finding (quote_verified = true)
9. Slightly rephrased quote (Jaccard ≥ 0.85) → info finding, match_type: 'fuzzy'
10. Fabricated quote (Jaccard < 0.85) → critical finding, match_type: 'none'
11. No self-audit findings provided → no findings produced
12. Self-audit finding without evidence_refs → skipped gracefully

**Utility functions:**

13. `normalizeForComparison` collapses whitespace and lowercases
14. `jaccardSimilarity` returns 1.0 for identical sets, 0.0 for disjoint sets
15. `bestWindowMatch` finds the highest-similarity window in source

### 2.4 Acceptance Criteria

- All 15 tests pass
- Each validator returns `VerificationFinding[]` (validates against the Zod schema)
- Every finding has a unique `finding_id`, a `check_id` matching the validator `id`, and the correct `field_criticality`
- Grounding quote check uses two-pass logic (exact then fuzzy)
- No LLM calls in deterministic validators — they are pure functions

---

## Task 3: Self-Audit Layer for Stage 2

**Create:** `packages/pipeline-api/src/services/extraction/self-audit.ts`
**Test:** `packages/pipeline-api/tests/services/extraction/self-audit.spec.ts`
**Spec Reference:** v0.2 §6.2

### 3.1 Purpose

The self-audit is an LLM call that reviews the extraction output against the source document. It checks whether each extracted field is grounded in (supported by) the source text. It returns structured `VerificationFinding` objects with `EvidenceReference` quotes that can then be verified by the deterministic grounding quote validator.

### 3.2 Interface

```typescript
import { VerificationFinding } from '@airisktools/shared-types';

export interface SelfAuditResult {
  findings: VerificationFinding[];
  duration_ms: number;
  model_id: string;
  status: 'completed' | 'timeout' | 'error';
  error_message?: string;
}

export async function runSelfAudit(opts: {
  extractionOutput: unknown;           // The AssessmentContext
  sourceText: string;                  // The original document text
  sourceDocumentId: string;            // Stable reference for evidence linking
  assessmentId: string;                // For finding context
  runId: string;                       // For finding context
  artifactVersion: string;             // For finding context
  llmClient: LLMClient;               // The existing Anthropic client
  timeoutMs?: number;                  // Default: 30000
}): Promise<SelfAuditResult>;
```

### 3.3 Prompt

Use the existing `llmClient` (the Anthropic SDK wrapper already in the codebase). The self-audit prompt:

```
You are a verification agent. You have been given:
1. A source document
2. A structured extraction produced from that document by another AI model

Your job is to verify whether each extracted field is supported by the source document.

For each field in the extraction, classify it as one of:
- GROUNDED: The field value is directly stated in the source document. Quote the exact passage (≤100 chars) that supports it.
- INFERRED: The field value is not directly stated but can be reasonably inferred. Explain what in the document supports this inference.
- CONTRADICTED: The document contains information that contradicts this field value. Quote the contradicting passage.
- UNSUPPORTED: The field value has no basis in the source document. This may indicate hallucination.
- MISSING: There is relevant information in the source document that was not captured in any extraction field.

For GROUNDED and CONTRADICTED classifications, provide the approximate character offset range where the supporting/contradicting text appears in the source.

Source document:
---
{sourceText}
---

Extraction output:
---
{JSON.stringify(extractionOutput, null, 2)}
---

Return a JSON array of findings. Each finding must have:
- field_path: string (dot notation, e.g., "context.sector")
- classification: "GROUNDED" | "INFERRED" | "CONTRADICTED" | "UNSUPPORTED" | "MISSING"
- quote: string | null (the exact passage from source, ≤100 chars, for GROUNDED/CONTRADICTED)
- char_start: number | null (approximate character offset in source)
- char_end: number | null
- explanation: string (why this classification was chosen)
```

### 3.4 Response Parsing

Parse the LLM response JSON array and convert to `VerificationFinding[]`:

| Classification | finding_type | severity |
|---------------|-------------|----------|
| GROUNDED | (no finding produced — this is the success case) | — |
| INFERRED | `ungrounded` | `info` |
| CONTRADICTED | `consistency_error` | `critical` |
| UNSUPPORTED | `ungrounded` | `critical` |
| MISSING | `missing_extraction` | `warning` |

For GROUNDED and CONTRADICTED findings, create `EvidenceReference` objects:

```typescript
evidence_refs: [{
  document_id: sourceDocumentId,
  page: undefined,                    // Not available from text extraction
  char_start: finding.char_start,
  char_end: finding.char_end,
  quote: finding.quote?.slice(0, 100),
  quote_verified: undefined,          // Set later by deterministic grounding_quote_check
}]
```

### 3.5 Error Handling

- **LLM timeout:** Return `{ findings: [], status: 'timeout', duration_ms }`. The VerificationCoordinator will mark this layer as `timeout`.
- **LLM error (API failure, rate limit):** Return `{ findings: [], status: 'error', error_message }`. The VerificationCoordinator will mark this layer as `error`.
- **Invalid JSON response:** Attempt one retry. If still invalid, return `{ findings: [], status: 'error', error_message: 'Invalid JSON response from self-audit' }`.
- **Do not throw.** Always return a `SelfAuditResult`. Let the coordinator and gate handle failure modes.

### 3.6 Implementation Notes

- Use the same `llmClient` and model configuration pattern as the existing extraction service. Look at how `extraction-service.ts` calls the LLM and follow the same pattern.
- The self-audit model should be the same model that did the extraction (Haiku 4.5 by default). The spec allows same-vendor different-model in Phase 1, but same-model is fine for now.
- Add a `SELF_AUDIT_MODEL` environment variable (default: same as extraction model) for future flexibility.
- Set a hard timeout. The self-audit must not block the pipeline indefinitely.
- Every finding must include `assessment_id`, `run_id`, `stage: 'extraction'`, and `artifact_version` (the v0.3 storage context fields).

### 3.7 Tests Required

Write tests in `packages/pipeline-api/tests/services/extraction/self-audit.spec.ts` using Vitest. **Mock the LLM client** — do not make real API calls.

1. **Successful audit:** Mock LLM returns valid JSON with mix of GROUNDED/INFERRED/CONTRADICTED findings → verify correct VerificationFinding objects produced with correct types and severities
2. **GROUNDED fields produce no findings:** Mock LLM returns all GROUNDED → verify empty findings array
3. **EvidenceReference construction:** Mock LLM returns GROUNDED with quote and offsets → verify EvidenceReference has document_id, char_start, char_end, quote, quote_verified=undefined
4. **LLM timeout:** Mock LLM throws timeout error → verify status='timeout', findings=[]
5. **LLM error:** Mock LLM throws API error → verify status='error', error_message set
6. **Invalid JSON response + retry:** Mock LLM returns invalid JSON first, valid JSON second → verify retry succeeded
7. **Invalid JSON response + retry fails:** Mock LLM returns invalid JSON twice → verify status='error'
8. **Finding context fields:** Verify every finding has assessment_id, run_id, stage='extraction', artifact_version

### 3.8 Acceptance Criteria

- All 8 tests pass
- Self-audit never throws — always returns SelfAuditResult
- LLM calls use the existing client pattern from the codebase
- Timeout is configurable and defaults to 30 seconds
- Every finding validates against the VerificationFinding Zod schema

---

## Task 4: VerificationCoordinator

**Create:** `packages/pipeline-api/src/lib/verification-coordinator.ts`
**Test:** `packages/pipeline-api/tests/lib/verification-coordinator.spec.ts`
**Spec Reference:** v0.3 §10

### 4.1 Purpose

The VerificationCoordinator runs applicable verification layers in order and produces a `VerificationBundle`. It does NOT emit events — the orchestrator does that based on the bundle contents. Single responsibility: verify and report.

### 4.2 Interface

```typescript
import {
  VerificationFinding, VerificationLayer, VerifierStatus,
  ConfidenceLevel, PipelineStage
} from '@airisktools/shared-types';

export interface LayerResult {
  layer: VerificationLayer;
  status: VerifierStatus;
  confidence: ConfidenceLevel;
  confidence_score: number;
  findings: VerificationFinding[];
  duration_ms: number;
}

export interface VerificationBundle {
  layers_run: LayerResult[];
  layers_skipped: { layer: VerificationLayer; reason: string }[];
  all_findings: VerificationFinding[];
}

export interface VerificationCoordinatorOpts {
  stage: PipelineStage;
  stageOutput: unknown;
  sourceText: string;
  sourceDocumentId: string;
  assessmentId: string;
  runId: string;
  artifactVersion: string;
  llmClient: LLMClient;
  fieldCriticalityMap: Record<string, FieldCriticality>;
}

export async function runVerification(
  opts: VerificationCoordinatorOpts,
): Promise<VerificationBundle>;
```

### 4.3 Execution Order

For Stage 2 (extraction), the coordinator runs layers in this order:

1. **Self-audit (Layer 1):** Call `runSelfAudit()`. If it succeeds, pass its findings to the deterministic validators.
2. **Deterministic (Layer 3):** Run all `extractionValidators`. The `grounding_quote_check` validator receives self-audit findings so it can verify quotes. Other validators run independently.
3. **Cross-model (Layer 2):** Skip with reason `'Deferred to Phase 2'`.

**Why this order:** Deterministic validators need self-audit findings (specifically the grounding quotes) to run the quote verification check. Self-audit must complete first.

### 4.4 Layer Result Construction

For each layer that runs:

```typescript
const layerResult: LayerResult = {
  layer: 'self_audit',
  status: selfAuditResult.status === 'completed' ? 'completed'
        : selfAuditResult.status === 'timeout' ? 'timeout'
        : 'error',
  confidence: deriveConfidence(selfAuditResult.findings),
  confidence_score: computeLayerScore(selfAuditResult.findings),
  findings: selfAuditResult.findings,
  duration_ms: selfAuditResult.duration_ms,
};
```

**Confidence derivation:**

- No critical findings → `'high'`
- Has critical findings → `'low'`
- Has warnings but no criticals → `'medium'`
- Layer failed (status not completed) → `'unverified'`

**Score computation:**

```typescript
function computeLayerScore(findings: VerificationFinding[]): number {
  let score = 1.0;
  for (const f of findings) {
    switch (f.severity) {
      case 'info': score -= 0.01; break;
      case 'warning': score -= 0.05; break;
      case 'critical': score -= 0.15; break;
    }
  }
  return Math.max(0, Math.round(score * 100) / 100);
}
```

### 4.5 Bundle Assembly

```typescript
return {
  layers_run: [selfAuditLayerResult, deterministicLayerResult],
  layers_skipped: [{ layer: 'cross_model', reason: 'Deferred to Phase 2' }],
  all_findings: [
    ...selfAuditLayerResult.findings,
    ...deterministicLayerResult.findings,
  ],
};
```

### 4.6 Failure Modes

- **Self-audit fails (timeout/error):** Still run deterministic validators, but skip `grounding_quote_check` (it needs self-audit findings). Mark self-audit layer as `timeout` or `error`.
- **Deterministic validator throws:** Catch the error. Mark deterministic layer as `error`. This is an internal control plane failure — the gate will trigger `halt_error`.
- **Never throw from the coordinator.** Always return a `VerificationBundle`, even if degraded.

### 4.7 Tests Required

Write tests in `packages/pipeline-api/tests/lib/verification-coordinator.spec.ts` using Vitest. Mock `runSelfAudit` and the validator functions.

1. **Full success path:** Self-audit returns findings, deterministic validators return findings → bundle has both layers, all_findings is union
2. **Self-audit timeout:** Self-audit returns status='timeout' → self-audit layer marked timeout, deterministic still runs (without grounding quote check)
3. **Self-audit error:** Self-audit returns status='error' → self-audit layer marked error, deterministic still runs
4. **Deterministic validator throws:** One validator throws → deterministic layer marked error, bundle still returned
5. **Cross-model always skipped:** Verify layers_skipped contains cross_model with reason
6. **Layer confidence derivation:** Findings with criticals → low, warnings only → medium, no findings → high
7. **Score computation:** 3 criticals → score = 0.55, 2 warnings → score = 0.90

### 4.8 Acceptance Criteria

- All 7 tests pass
- Coordinator never throws
- Execution order is: self-audit → deterministic (using self-audit findings) → skip cross-model
- All findings in bundle validate against VerificationFinding Zod schema
- No event emission from coordinator (orchestrator responsibility)

---

## Task 5: GateEvaluator

**Create:** `packages/pipeline-api/src/lib/gate-evaluator.ts`
**Test:** `packages/pipeline-api/tests/lib/gate-evaluator.spec.ts`
**Spec Reference:** v0.3 §8

### 5.1 Interface

```typescript
import {
  GateDecision, ConfidenceLevel, VerificationFinding,
  FieldCriticality
} from '@airisktools/shared-types';
import type { LayerResult, VerificationBundle } from './verification-coordinator';

export interface GateResult {
  decision: GateDecision;
  reasons: string[];
  reason_codes: string[];
  hard_stops_triggered: string[];
  confidence: ConfidenceLevel;
  confidence_score: number;
}

export function evaluateGate(
  bundle: VerificationBundle,
  fieldCriticalityMap: Record<string, FieldCriticality>,
): GateResult;
```

### 5.2 Hard-Stop Rules

Implement these 8 rules. Evaluate in order. If any `halt_error` rule fires, return immediately. Otherwise, collect all `needs_review` triggers.

| # | ID | Code | Triggers | Condition |
|---|---|---|---|---|
| 1 | `critical_on_required_material` | `GATE_CRIT_MATERIAL` | `needs_review` | Any finding with `severity: 'critical'` AND `field_criticality: 'required_material'` |
| 2 | `missing_required_material` | `GATE_MISSING_MATERIAL` | `needs_review` | Any finding with `finding_type: 'completeness_gap'` AND `field_criticality: 'required_material'` |
| 3 | `grounding_quote_fabricated` | `GATE_QUOTE_FABRICATED` | `needs_review` | Any finding with `finding_type: 'grounding_quote_missing'` AND `severity: 'critical'` (i.e., not the info-level fuzzy matches) |
| 4 | `critical_on_required_supporting` | `GATE_CRIT_SUPPORTING` | `needs_review` | Any finding with `severity: 'critical'` AND `field_criticality: 'required_supporting'` |
| 5 | `contradiction_on_any_required` | `GATE_CONTRADICTION` | `needs_review` | Any finding with `finding_type: 'consistency_error'` AND `field_criticality` is NOT `'optional'` |
| 6 | `required_material_grounding_coverage` | `GATE_LOW_COVERAGE` | `needs_review` | Fewer than 80% of `required_material` fields have grounded status. See computation below. |
| 7 | `deterministic_verifier_failure` | `GATE_DETERMINISTIC_FAIL` | `halt_error` | Any layer_run with `layer: 'deterministic'` AND status is `'error'` or `'timeout'` |
| 8 | `mandatory_llm_verifier_failure` | `GATE_LLM_VERIFY_FAIL` | `needs_review` | Any layer_run with `layer: 'self_audit'` AND status is `'error'`, `'timeout'`, or `'unavailable'` |

**Rule 6 — Coverage computation:**

```typescript
// Get all required_material field paths from the criticality map
const materialFields = Object.entries(fieldCriticalityMap)
  .filter(([_, c]) => c === 'required_material')
  .map(([path]) => path);

// A field is "grounded" if:
// - It has no findings at all (no problems found), OR
// - Its only findings are info-level (fuzzy matches, inferences)
const groundedFields = materialFields.filter(path => {
  const fieldFindings = bundle.all_findings.filter(f => f.field_path === path);
  return fieldFindings.length === 0
    || fieldFindings.every(f => f.severity === 'info');
});

const coverage = groundedFields.length / materialFields.length;
// Rule fires if coverage < 0.80
```

### 5.3 Tier 2 Logic (No Hard Stops Triggered)

If no hard-stop rules fire:

```typescript
const hasCriticalsOnOptional = bundle.all_findings.some(f =>
  f.severity === 'critical' && f.field_criticality === 'optional'
);
const hasWarnings = bundle.all_findings.some(f => f.severity === 'warning');
const optionalLayerDegraded = bundle.layers_run.some(r =>
  r.layer === 'cross_model' && r.status !== 'completed' && r.status !== 'skipped'
);

if (hasCriticalsOnOptional || hasWarnings || optionalLayerDegraded) {
  return {
    decision: 'proceed_with_flags',
    reasons: [...],  // describe which conditions triggered
    reason_codes: ['GATE_FLAGS'],
    hard_stops_triggered: [],
    confidence: 'medium',
    confidence_score: computeSecondaryScore(bundle),
  };
}

// All clean
return {
  decision: 'auto_proceed',
  reasons: ['All checks passed'],
  reason_codes: ['GATE_CLEAR'],
  hard_stops_triggered: [],
  confidence: 'high',
  confidence_score: computeSecondaryScore(bundle),
};
```

### 5.4 Secondary Score

```typescript
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

### 5.5 Tests Required

Write tests in `packages/pipeline-api/tests/lib/gate-evaluator.spec.ts` using Vitest. Construct `VerificationBundle` objects with specific findings to test each rule.

1. **All checks pass:** No findings → `auto_proceed`, confidence `high`
2. **Critical on required_material:** → `needs_review`, `GATE_CRIT_MATERIAL` in reason_codes
3. **Missing required_material:** completeness_gap finding → `needs_review`, `GATE_MISSING_MATERIAL`
4. **Fabricated grounding quote:** grounding_quote_missing with severity critical → `needs_review`, `GATE_QUOTE_FABRICATED`
5. **Critical on required_supporting:** → `needs_review`, `GATE_CRIT_SUPPORTING`
6. **Contradiction on required field:** consistency_error on non-optional field → `needs_review`, `GATE_CONTRADICTION`
7. **Low grounding coverage:** 2 of 5 material fields grounded → `needs_review`, `GATE_LOW_COVERAGE`
8. **Deterministic verifier failure:** deterministic layer status error → `halt_error`, `GATE_DETERMINISTIC_FAIL`
9. **LLM verifier failure:** self_audit layer status timeout → `needs_review`, `GATE_LLM_VERIFY_FAIL`
10. **Multiple hard stops:** Two rules fire → both appear in hard_stops_triggered, decision is `needs_review`
11. **halt_error takes precedence:** Both deterministic failure and critical finding → `halt_error` (immediate return)
12. **Warnings only (no hard stops):** Warning findings on optional fields → `proceed_with_flags`
13. **Critical on optional (no hard stop):** Critical on optional field → `proceed_with_flags`
14. **Score computation:** Verify secondary score decreases correctly with findings

### 5.6 Acceptance Criteria

- All 14 tests pass
- Gate never throws
- `halt_error` causes immediate return (no further rule evaluation)
- `needs_review` rules accumulate before returning
- Gate does NOT emit events (orchestrator responsibility)
- GateResult validates against expected shape

---

## Task 6: Wire into Orchestrator (Stage 2 Only)

**Modify:** `packages/pipeline-api/src/services/pipeline-orchestrator.ts`

### 6.1 What to Change

Replace the Sprint 1 shadow gate for Stage 2 (extraction) with real verification. All other stages keep their Sprint 1 shadow gates unchanged.

### 6.2 After Extraction Completes

Where the orchestrator currently has:

```typescript
// Sprint 1 shadow gate for extraction
await emitter.gateDecision('extraction', {
  decision: 'auto_proceed',
  confidence: 'medium',
  confidenceScore: 0.7,
  reasons: ['Shadow mode - verification not yet active'],
  reasonCodes: ['SHADOW_PASS'],
  hardStopsTriggered: [],
});
```

Replace with:

```typescript
import { runVerification } from '../lib/verification-coordinator';
import { evaluateGate } from '../lib/gate-evaluator';
import { extractionFieldCriticality } from './extraction/field-criticality';

// Run real verification on extraction output
const verificationBundle = await runVerification({
  stage: 'extraction',
  stageOutput: context,             // The AssessmentContext from extraction
  sourceText: parsed.text,          // The original document text
  sourceDocumentId: assessmentId,   // Or however the doc is identified
  assessmentId,
  runId,
  artifactVersion: generateArtifactVersion(), // ULID or UUID
  llmClient,                        // The existing Anthropic client
  fieldCriticalityMap: extractionFieldCriticality,
});

// Persist findings
await findingStore.persist(verificationBundle.all_findings);

// Emit verification events (orchestrator is the emitter, per v0.3 §10.1)
for (const layerResult of verificationBundle.layers_run) {
  await emitter.emit({
    category: 'verification_result',
    stage: 'extraction',
    verification_layer: layerResult.layer,
    duration_ms: layerResult.duration_ms,
    verifier_status: layerResult.status,
    confidence: layerResult.confidence,
    confidence_score: layerResult.confidence_score,
    finding_count: {
      info: layerResult.findings.filter(f => f.severity === 'info').length,
      warning: layerResult.findings.filter(f => f.severity === 'warning').length,
      critical: layerResult.findings.filter(f => f.severity === 'critical').length,
    },
    finding_ids: layerResult.findings.map(f => f.finding_id),
  });
}

// Evaluate gate
const gateResult = evaluateGate(verificationBundle, extractionFieldCriticality);

// SHADOW MODE: Log real gate result but override to auto_proceed
await emitter.gateDecision('extraction', {
  decision: 'auto_proceed',          // OVERRIDE — still shadow mode
  confidence: gateResult.confidence,
  confidenceScore: gateResult.confidence_score,
  reasons: gateResult.reasons,
  reasonCodes: gateResult.reason_codes,
  hardStopsTriggered: gateResult.hard_stops_triggered,
  findingIds: verificationBundle.all_findings.map(f => f.finding_id),
  findingCount: {
    info: verificationBundle.all_findings.filter(f => f.severity === 'info').length,
    warning: verificationBundle.all_findings.filter(f => f.severity === 'warning').length,
    critical: verificationBundle.all_findings.filter(f => f.severity === 'critical').length,
  },
});

// Log what the gate WOULD have decided (for calibration data)
console.log(JSON.stringify({
  event: 'shadow_gate_result',
  stage: 'extraction',
  actual_decision: gateResult.decision,
  overridden_to: 'auto_proceed',
  reasons: gateResult.reasons,
  reason_codes: gateResult.reason_codes,
  hard_stops: gateResult.hard_stops_triggered,
  confidence_score: gateResult.confidence_score,
  finding_count: verificationBundle.all_findings.length,
}));
```

### 6.3 FindingStore Initialization

Add the FindingStore to the module-level initialization (alongside the EventSink from Sprint 1):

```typescript
import { JsonFileFindingStore } from '../lib/event-sink';

const findingStore = new JsonFileFindingStore({
  baseDir: process.env.VERIFICATION_DATA_DIR ?? './data/verification',
});
```

### 6.4 Emitter Method for Verification Events

The PipelineEventEmitter from Sprint 1 may need a new method or you may need to use a lower-level emit. The verification events need the `verification_layer` field which the Sprint 1 methods don't expose. Options:

**Option A:** Add a `verificationResult()` method to PipelineEventEmitter:

```typescript
async verificationResult(stage: PipelineStage, layerResult: LayerResult): Promise<string> {
  return this.emit({
    category: 'verification_result',
    stage,
    verification_layer: layerResult.layer,
    duration_ms: layerResult.duration_ms,
    verifier_status: layerResult.status,
    confidence: layerResult.confidence,
    confidence_score: layerResult.confidence_score,
    finding_count: {
      info: layerResult.findings.filter(f => f.severity === 'info').length,
      warning: layerResult.findings.filter(f => f.severity === 'warning').length,
      critical: layerResult.findings.filter(f => f.severity === 'critical').length,
    },
    finding_ids: layerResult.findings.map(f => f.finding_id),
  });
}
```

**Option B:** Expose the low-level `emit()` method as public and construct the event in the orchestrator.

Either option is fine. Option A is cleaner.

### 6.5 What NOT to Change

- All other stages (parse, regulatory, framework, risk_identification, action_plan) keep their Sprint 1 shadow gates
- SSE behavior unchanged
- Return type unchanged
- Gate decision in JSONL events is STILL `auto_proceed` (shadow mode override)
- The real gate decision is logged separately for calibration analysis

### 6.6 Acceptance Criteria

- All existing tests still pass
- Extraction stage now produces verification events in the JSONL output (verification_result events for each layer)
- The gate_decision event for extraction contains real reasons/reason_codes/hard_stops from the gate evaluator (not shadow placeholders) but decision remains `auto_proceed`
- Findings are persisted in `data/verification/findings/` JSONL files
- The `shadow_gate_result` log line appears with the actual gate decision
- Other 5 stages still emit Sprint 1 shadow gates (unchanged)

---

## Task 7: Generate Finding IDs

**Create or modify:** Utility function for generating unique finding IDs

### What to Do

Add a `generateFindingId()` function used by all validators and the self-audit layer. Use the same ID generation pattern as PipelineEventEmitter's event IDs (timestamp + random).

```typescript
export function generateFindingId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomUUID().replace(/-/g, '').slice(0, 12);
  return `f-${timestamp}-${random}`;
}
```

Place this in `packages/pipeline-api/src/lib/id-generation.ts` or add to an existing utilities file. Import from validators and self-audit.

---

## File Manifest

### Files to Create

| File | Purpose |
|------|---------|
| `packages/pipeline-api/src/services/extraction/field-criticality.ts` | Field criticality map |
| `packages/pipeline-api/src/services/extraction/validators/types.ts` | DeterministicValidator interface |
| `packages/pipeline-api/src/services/extraction/validators/completeness-check.ts` | Completeness validator |
| `packages/pipeline-api/src/services/extraction/validators/schema-conformance.ts` | Schema re-validation |
| `packages/pipeline-api/src/services/extraction/validators/grounding-quote-check.ts` | Two-pass quote verification |
| `packages/pipeline-api/src/services/extraction/validators/index.ts` | Validator barrel export |
| `packages/pipeline-api/src/services/extraction/self-audit.ts` | LLM self-audit layer |
| `packages/pipeline-api/src/lib/verification-coordinator.ts` | Layer orchestration |
| `packages/pipeline-api/src/lib/gate-evaluator.ts` | Gate decision logic |
| `packages/pipeline-api/src/lib/id-generation.ts` | ID generation utilities |
| `packages/pipeline-api/tests/services/extraction/validators.spec.ts` | Validator tests |
| `packages/pipeline-api/tests/services/extraction/self-audit.spec.ts` | Self-audit tests |
| `packages/pipeline-api/tests/lib/verification-coordinator.spec.ts` | Coordinator tests |
| `packages/pipeline-api/tests/lib/gate-evaluator.spec.ts` | Gate evaluator tests |

### Files to Modify

| File | Change |
|------|--------|
| `packages/pipeline-api/src/services/pipeline-orchestrator.ts` | Replace extraction shadow gate with real verification (Task 6) |
| `packages/pipeline-api/src/lib/pipeline-event-emitter.ts` | Add `verificationResult()` method (Task 6.4) |
| `.env.example` | Add `SELF_AUDIT_MODEL` |

---

## Validation Checklist

### Build Checks

```bash
cd packages/shared-types && pnpm build       # Zero TS errors
cd packages/pipeline-api && pnpm build       # Zero TS errors
cd packages/pipeline-api && pnpm test        # All tests pass (89 existing + ~44 new)
```

### Functional Checks (requires LLM credentials)

- Run one assessment through the pipeline
- Verify JSONL events file contains `verification_result` events for the extraction stage (one for self_audit layer, one for deterministic layer)
- Verify the extraction `gate_decision` event has real `reason_codes` (not `SHADOW_PASS`) but decision is still `auto_proceed`
- Verify findings JSONL file contains verification findings with correct structure
- Verify `shadow_gate_result` log line shows the actual gate decision
- Verify stages 1, 3, 4, 5, 6 still have shadow gates (unchanged from Sprint 1)

### Negative Checks

- Run an assessment with a very short/vague document → verify completeness_gap findings are produced for missing required fields
- Kill the LLM during self-audit (or mock a timeout) → verify self-audit layer marked as timeout, deterministic validators still run, gate fires `GATE_LLM_VERIFY_FAIL`

---

## Out of Scope

- Gate enforcement (gates still override to `auto_proceed`)
- Human review flow (ReviewPackageStore, resume tokens)
- Verification on stages 1, 3, 4, 5, 6
- Cross-model verification (Layer 2)
- Dashboard UI changes
- Threshold calibration (Sprint 3)

---

*Sprint 3 (Shadow Mode Calibration) spec will be produced after Sprint 2 is implemented and 10+ assessments have been run with the verification layer active. See `Research/impl/sprint-backlog.md` for the full roadmap.*
