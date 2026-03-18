# Implementation Spec: Confidence Recalibration + Re-Calibration Run — Sprint 5

**Project:** AI Risk Tools
**Sprint:** Confidence Recalibration + Calibration Infrastructure Hardening
**Author:** CTO (Opus 4.6) for Codex 5.4 implementation
**Date:** March 16, 2026
**Status:** Ready for implementation (Codex handoff)
**Branch:** `codex/sprint-5-confidence-recal`
**Prerequisite:** Sprint 4 merged to main. 150+ tests passing.

---

## Goal

Fix the broken confidence scoring system (mean 0.25 when extraction quality is 0.88) and harden the calibration infrastructure so re-runs are reliable. After this sprint, confidence scores reflect actual extraction quality, and the calibration runner can be executed without manual babysitting.

---

## Codebase Context

**Working directory:** `packages/pipeline-api/`
**Test command:** `npx vitest run` (must pass all tests after changes)

**Key files you will modify:**

| File | What It Does |
|------|-------------|
| `src/services/extraction/extraction-service.ts` | Contains `computeOverallConfidence()` — the broken function |
| `src/services/extraction/extraction-service.test.ts` | Tests for confidence computation |
| `scripts/run-calibration.sh` | Calibration runner — needs rate limiting |
| `scripts/analyze-shadow-mode.ts` | Analysis script — needs to handle incomplete assessments |

---

## Task 1: Recalibrate Confidence Scoring

**File:** `src/services/extraction/extraction-service.ts`

### Problem:

`computeOverallConfidence()` produces a mean confidence of 0.25 across 19 assessments. The function:
1. Starts with a base score driven entirely by document word count (short docs = low base)
2. Multiplies by field population ratio with a 0.4 floor (`0.4 + 0.6 * fieldRatio`)
3. Subtracts a penalty for every missing_field entry (`0.04 * count, max 0.30`)

The missing_field penalty is the killer — the extraction prompt is designed to aggressively populate missing_fields (short missing_fields list = extraction failure). A well-behaved extraction of a vague document has 5-8 missing fields → 0.20-0.30 penalty, which crushes the score.

### Current implementation (lines 44-80):

```typescript
export function computeOverallConfidence(
  context: AssessmentContext,
  documentWordCount: number,
): number {
  let base: number;
  if (documentWordCount >= 1500) { base = 0.9; }
  else if (documentWordCount >= 800) { base = 0.8; }
  else if (documentWordCount >= 400) { base = 0.65; }
  else if (documentWordCount >= 150) { base = 0.5; }
  else { base = 0.35; }

  const criticalFields = [
    context.organization.name,
    context.organization.sector,
    context.organization.geography,
    context.ai_system.description,
    context.ai_system.data_sensitivity,
    context.ai_system.use_cases,
    context.ai_system.lifecycle_stage,
    context.ai_system.is_autonomous,
    context.ai_system.deployment_context,
  ];
  const populatedCount = criticalFields.filter(isPopulated).length;
  const fieldRatio = populatedCount / criticalFields.length;
  const missingCount = context.missing_fields?.length ?? 0;
  const missingPenalty = Math.min(missingCount * 0.04, 0.3);
  const raw = base * (0.4 + 0.6 * fieldRatio) - missingPenalty;
  return Math.max(0.1, Math.min(0.98, Math.round(raw * 100) / 100));
}
```

### New implementation:

Replace the entire function body with:

```typescript
export function computeOverallConfidence(
  context: AssessmentContext,
  documentWordCount: number,
): number {
  // Base score from document richness (word count is a proxy for information density)
  let base: number;
  if (documentWordCount >= 1500) { base = 0.92; }
  else if (documentWordCount >= 800) { base = 0.82; }
  else if (documentWordCount >= 400) { base = 0.70; }
  else if (documentWordCount >= 150) { base = 0.55; }
  else { base = 0.40; }

  // Material fields (from field-criticality.ts) — these drive downstream correctness
  const materialFields = [
    context.ai_system.name,
    context.ai_system.description,
    context.ai_system.data_sensitivity,
  ];

  // Supporting fields — useful but not critical
  const supportingFields = [
    context.organization.sector,
    context.organization.geography,
    context.ai_system.model_type,
    context.ai_system.lifecycle_stage,
    context.ai_system.use_cases,
    context.ai_system.deployment_context,
  ];

  const materialPopulated = materialFields.filter(isPopulated).length;
  const supportingPopulated = supportingFields.filter(isPopulated).length;

  // Material fields are weighted 2x supporting fields
  const materialRatio = materialFields.length > 0
    ? materialPopulated / materialFields.length
    : 1;
  const supportingRatio = supportingFields.length > 0
    ? supportingPopulated / supportingFields.length
    : 1;
  const weightedFieldScore = (materialRatio * 0.6 + supportingRatio * 0.4);

  // Explicit evidence bonus: check how many confidence records have evidence_basis "explicit"
  let explicitCount = 0;
  let totalConfidenceRecords = 0;
  for (const section of [context.organization.confidence, context.ai_system.confidence]) {
    if (section && typeof section === "object") {
      for (const record of Object.values(section)) {
        if (record && typeof record === "object" && "evidence_basis" in record) {
          totalConfidenceRecords += 1;
          if ((record as { evidence_basis: string }).evidence_basis === "explicit") {
            explicitCount += 1;
          }
        }
      }
    }
  }
  const explicitRatio = totalConfidenceRecords > 0
    ? explicitCount / totalConfidenceRecords
    : 0.5; // No confidence records = neutral

  // Missing fields: mild penalty, not the crusher it was before.
  // A good extraction with 5 missing fields on a vague doc should NOT tank confidence.
  const missingCount = context.missing_fields?.length ?? 0;
  const missingPenalty = Math.min(missingCount * 0.015, 0.12);

  // Combine: base * field_quality - missing_penalty, boosted by explicit evidence
  const raw = base * (0.3 + 0.7 * weightedFieldScore) * (0.8 + 0.2 * explicitRatio) - missingPenalty;

  return Math.max(0.1, Math.min(0.98, Math.round(raw * 100) / 100));
}
```

### Key changes:
- Material fields (name, description, data_sensitivity) weighted 2x vs supporting fields
- Missing field penalty reduced from `0.04 * count (max 0.30)` to `0.015 * count (max 0.12)`
- Explicit evidence bonus: if the LLM reports `evidence_basis: "explicit"`, confidence gets a boost
- Base scores slightly increased (the old base penalized short docs too aggressively)

### Expected outcomes:
- Complete-quality docs (1500+ words): confidence 0.75-0.92 (was 0.25-0.50)
- Partial-quality docs (400-800 words): confidence 0.55-0.75 (was 0.15-0.35)
- Vague docs (80-200 words): confidence 0.35-0.50 (was 0.10-0.20)

### Tests to update

**File:** `src/services/extraction/extraction-service.test.ts`

Find these test assertions and update:

1. The test at line ~154 that asserts `value > 0.85` for confidence values — this tests per-field confidence records, not overall confidence. It should still pass because `ensureConfidenceRecords` uses `computeOverallConfidence` to set per-field defaults, and the new function produces higher scores. **Leave this test as-is; verify it still passes.**

2. The test at line ~222 that asserts `computeOverallConfidence(context, 1500) > 0.85` — this should still pass with the new formula (1500-word doc with all fields populated should score > 0.85). **Leave as-is; verify it passes.**

3. **Add one new test:**

```typescript
it("does not over-penalize documents with many missing_fields", () => {
  const context = {
    organization: {
      name: "Test Corp",
      sector: "healthcare" as const,
    },
    ai_system: {
      name: "TestAI",
      description: "An AI system for testing",
      data_sensitivity: ["pii" as const],
    },
    missing_fields: [
      { field: "organization.size", reason: "Not stated" },
      { field: "organization.geography", reason: "Not stated" },
      { field: "ai_system.model_type", reason: "Not stated" },
      { field: "ai_system.lifecycle_stage", reason: "Not stated" },
      { field: "ai_system.is_autonomous", reason: "Not stated" },
      { field: "ai_system.deployment_context", reason: "Not stated" },
    ],
  } as AssessmentContext;

  // 6 missing fields on a short doc should still produce reasonable confidence
  const confidence = computeOverallConfidence(context, 200);
  expect(confidence).toBeGreaterThan(0.30);
  expect(confidence).toBeLessThan(0.65);
});
```

### What NOT to do:
- Do NOT change `ensureConfidenceRecords` or `buildMinimalConfidence` — they use `computeOverallConfidence` and will get the improved scores automatically.
- Do NOT change the extraction prompt (that's Sprint 4).
- Do NOT change the `sanitizeLLMOutput` function.
- Do NOT change the `extractContext` function signature or return type.

---

## Task 2: Add Rate Limiting to Calibration Runner

**File:** `scripts/run-calibration.sh`

### Problem:

The calibration runner submits all 29 assessments in rapid fire (2-second sleep between each). The pipeline API processes them asynchronously. When 29 assessments hit the Anthropic API simultaneously, 10+ fail from rate limiting (429 errors). The analysis script then runs before assessments finish processing.

### Changes:

#### 2a. Add a wait-for-completion function

After the `run_assessment()` function definition (after line 24), add:

```bash
wait_for_completion() {
  local max_wait=600  # 10 minutes max
  local interval=15
  local elapsed=0

  while [ $elapsed -lt $max_wait ]; do
    local counts
    counts=$(curl -s "${PIPELINE_URL}/api/v1/assessments" | \
      python3 -c "
import sys, json
data = json.load(sys.stdin)
processing = sum(1 for a in data.get('assessments', []) if a.get('status') == 'processing')
complete = sum(1 for a in data.get('assessments', []) if a.get('status') == 'complete')
error = sum(1 for a in data.get('assessments', []) if a.get('status') == 'error')
print(f'{processing} {complete} {error}')
" 2>/dev/null)

    local processing complete error
    processing=$(echo "$counts" | awk '{print $1}')
    complete=$(echo "$counts" | awk '{print $2}')
    error=$(echo "$counts" | awk '{print $3}')

    echo "  Waiting: ${processing} processing, ${complete} complete, ${error} error (${elapsed}s elapsed)"

    if [ "${processing:-0}" -eq 0 ]; then
      echo "  All assessments finished processing."
      return 0
    fi

    sleep $interval
    elapsed=$((elapsed + interval))
  done

  echo "  WARNING: Timed out waiting for assessments to complete."
  return 1
}
```

#### 2b. Increase sleep between assessments

Change the `sleep 2` at the end of `run_assessment()` to `sleep 5`. This gives the Anthropic API more breathing room.

```bash
# Before:
  sleep 2

# After:
  sleep 5
```

#### 2c. Add wait-for-completion before analysis

Before the `=== Running shadow mode analysis ===` line, add:

```bash
echo "=== Waiting for all assessments to complete ==="
wait_for_completion
```

### What NOT to do:
- Do NOT change the analysis script invocations.
- Do NOT add any new npm dependencies.
- Do NOT change the `--max-time 120` on curl.

---

## Task 3: Handle Incomplete Assessments in Analysis Script

**File:** `scripts/analyze-shadow-mode.ts`

### Problem:

The analysis script counts all JSONL event files regardless of whether the assessment completed or errored. Errored assessments may have partial event data that skews statistics (e.g., events but no findings, gate decisions counted as absent when the assessment just crashed).

### Changes:

In the main analysis logic, after reading all JSONL files, filter to only include assessments that have both event AND finding files. Add a `skipped_incomplete` counter to the output.

Find where assessments are collected (the loop that reads event files). Add this filter:

```typescript
// After collecting all assessment IDs from event files:
const findingIds = new Set(
  (await readdir(path.join(dataDir, "findings")))
    .filter(f => f.endsWith(".jsonl"))
    .map(f => f.replace(".jsonl", ""))
);

// Filter to only assessments with both events and findings
const completeAssessmentIds = assessmentIds.filter(id => findingIds.has(id));
const skippedIncomplete = assessmentIds.length - completeAssessmentIds.length;

if (skippedIncomplete > 0) {
  console.log(`Skipped ${skippedIncomplete} incomplete assessments (events but no findings)`);
}
```

Then use `completeAssessmentIds` instead of `assessmentIds` for all subsequent analysis.

Add `"skipped_incomplete": skippedIncomplete` to the JSON report output alongside `"assessment_count"`.

### What NOT to do:
- Do NOT change the JSONL parsing logic.
- Do NOT change the report structure beyond adding the `skipped_incomplete` field.
- Do NOT change the console output format (just add the skip message).

---

## Validation

After all changes:

```bash
cd packages/pipeline-api
npx vitest run
```

**Expected:** All tests pass (150+, likely 151 with the new confidence test).

```bash
pnpm build:types && pnpm typecheck:graph
```

**Expected:** Clean typecheck.

---

## Files Changed Summary

| File | Change Type | What Changed |
|------|-----------|-------------|
| `src/services/extraction/extraction-service.ts` | Edit | Rewrote `computeOverallConfidence()` |
| `src/services/extraction/extraction-service.test.ts` | Edit | Added missing_fields penalty test |
| `scripts/run-calibration.sh` | Edit | Added `wait_for_completion()`, increased sleep, added wait step |
| `scripts/analyze-shadow-mode.ts` | Edit | Filter incomplete assessments, add `skipped_incomplete` |
