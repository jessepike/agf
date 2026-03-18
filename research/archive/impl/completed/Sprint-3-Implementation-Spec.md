# Implementation Spec: Pipeline Verification Layer — Sprint 3

**Project:** AI Risk Tools
**Sprint:** Shadow Mode Calibration + Prompt Quality Evaluation
**Author:** Jess Pike (concept) + Claude (specification)
**Date:** March 15, 2026
**Status:** Ready for implementation (Codex handoff)
**Prerequisite:** Sprint 2 complete (134 tests passing, Stage 2 verification running in shadow mode)
**Architecture Spec:** `pipeline-verification-spec-v0.3.md` (Section 12, Open Questions 5 + 11)

---

## Goal

Sprint 3 is structurally different from Sprints 1 and 2. It is data collection, analysis, and calibration — not feature build. The outputs are: calibrated threshold values for the grounding quote fuzzy match (currently 0.85 Jaccard) and required material coverage (currently 80%), a self-audit prompt eval suite with golden test cases, a systematic extraction prompt quality evaluation, and a calibration report documenting all decisions.

After this sprint, the team has empirical evidence for whether the thresholds are too aggressive (too many false positives blocking good assessments) or too lenient (letting bad extractions through). This data gates the decision to enable gate enforcement in Phase 1A+.

---

## Codebase Context

**Prerequisite state from Sprint 2:**

- Stage 2 (extraction) runs real verification: deterministic validators + LLM self-audit
- Gate evaluates 8 hard-stop rules, logs actual decision, overrides to `auto_proceed`
- Findings persisted in `data/verification/findings/{assessment_id}.jsonl`
- Events persisted in `data/verification/events/{assessment_id}.jsonl`
- `shadow_gate_result` JSON log line shows actual gate decision per assessment
- 134 tests passing

**Existing test fixtures:**

```
packages/pipeline-api/tests/fixtures/
  scenario-01-retail-content-tool.md        # Retail, content generation
  scenario-02-healthcare-diagnostic.md      # Healthcare, PHI, diagnostic AI
  scenario-03-fintech-credit-scoring.md     # Fintech, credit scoring, ECOA/FCRA
  scenario-04-gov-hr-screening.md           # Government, HR screening, EEOC
  scenario-05-vague-startup-pitch.md        # Vague document, missing fields
  scenario-06-insurance-claims-ai.md        # Insurance, claims AI, NAIC
```

**Scoring rubric:** `docs/test-protocol.md` — 6 dimensions, 0-3 scale per scenario

---

## Task 1: Run Shadow Mode Assessments

**This is a manual task requiring LLM credentials.**

### 1.1 Minimum Assessment Count

Run **30-50 assessments** through the pipeline with the Sprint 2 verification layer active. The goal is sufficient data volume to compute reliable false-positive rates and threshold sensitivity.

### 1.2 Document Diversity Requirements

Assessments must cover at least 3 sectors and include a range of document quality:

| Category | Count | Source | Purpose |
|----------|-------|--------|---------|
| Existing test fixtures (scenarios 01-06) | 6 | `tests/fixtures/` | Baseline — known documents with expected outputs in test protocol |
| Healthcare sector variations | 4-6 | New documents or variations | Sector depth — PHI, HIPAA, diagnostic AI |
| Fintech sector variations | 4-6 | New documents or variations | Sector depth — credit scoring, ECOA, FCRA |
| Insurance sector | 4-6 | New documents or variations | Target vertical — NAIC, claims AI |
| Government / public sector | 3-4 | New documents or variations | Multi-regulation complexity |
| Retail / general | 3-4 | New documents or variations | Lower-regulation baseline |
| Vague / low-quality documents | 3-5 | New documents with intentionally sparse info | Stress test — should trigger completeness gaps and low confidence |
| PDF documents | 3-5 | Convert some markdown fixtures to PDF | PDF parse path — OCR artifacts may affect grounding |

### 1.3 How to Run

```bash
# Option A: Dashboard upload (for PDF and UI path testing)
cd apps/dashboard && pnpm dev
# Upload each document through the dashboard UI

# Option B: API direct (faster for batch runs)
curl -X POST http://localhost:8080/api/v1/assessments \
  -F "document=@path/to/document.md" \
  -H "Accept: text/event-stream"

# Option C: Quick assessment (for variations without full documents)
curl -X POST http://localhost:8080/api/v1/assessments/quick \
  -H "Content-Type: application/json" \
  -d '{"description":"[AI system description here]"}'
```

### 1.4 Data Produced Per Assessment

Each assessment run creates:

- `data/verification/events/{assessment_id}.jsonl` — Pipeline events including `verification_result` and `gate_decision` events for extraction stage
- `data/verification/findings/{assessment_id}.jsonl` — Verification findings from deterministic validators and self-audit
- Console log line: `shadow_gate_result` with actual gate decision

### 1.5 Acceptance Criteria

- At least 30 assessments completed
- At least 3 distinct sectors represented
- At least 3 vague/low-quality documents included
- At least 3 PDF documents included
- All JSONL files present and parseable

---

## Task 2: Shadow Mode Analysis Script

**Create:** `packages/pipeline-api/scripts/analyze-shadow-mode.ts`
**Output:** Console report + `data/verification/calibration-report.json`

### 2.1 Purpose

Parse all JSONL files from shadow mode runs and compute the metrics needed to calibrate thresholds.

### 2.2 Script Interface

```bash
# Run from pipeline-api directory
npx tsx scripts/analyze-shadow-mode.ts

# Or with custom data directory
npx tsx scripts/analyze-shadow-mode.ts --data-dir ./data/verification

# Output options
npx tsx scripts/analyze-shadow-mode.ts --format json > calibration-data.json
npx tsx scripts/analyze-shadow-mode.ts --format console  # default: human-readable
```

### 2.3 Metrics to Compute

#### Gate Decision Distribution

```
Total assessments: N
Gate decisions:
  auto_proceed:       X (Y%)
  proceed_with_flags: X (Y%)
  needs_review:       X (Y%)
  halt_error:         X (Y%)
```

#### Hard-Stop Rule Fire Frequency

For each of the 8 hard-stop rules, count how many assessments triggered it:

```
Hard-stop triggers:
  GATE_CRIT_MATERIAL:      X of N (Y%)
  GATE_MISSING_MATERIAL:   X of N (Y%)
  GATE_QUOTE_FABRICATED:   X of N (Y%)
  GATE_CRIT_SUPPORTING:    X of N (Y%)
  GATE_CONTRADICTION:      X of N (Y%)
  GATE_LOW_COVERAGE:       X of N (Y%)
  GATE_DETERMINISTIC_FAIL: X of N (Y%)
  GATE_LLM_VERIFY_FAIL:    X of N (Y%)
```

#### Grounding Quote Verification Breakdown

```
Grounding quote checks:
  Total quotes checked:    N
  Exact matches:           X (Y%)
  Fuzzy matches (≥0.85):   X (Y%)  — match_type: 'fuzzy'
  No match (<0.85):        X (Y%)  — match_type: 'none'

Fuzzy match similarity distribution:
  0.85-0.90:  X
  0.90-0.95:  X
  0.95-1.00:  X

No-match similarity distribution (these are the potential false positives):
  0.00-0.50:  X  (likely genuine fabrication)
  0.50-0.70:  X  (uncertain)
  0.70-0.85:  X  (possible threshold issue — inspect manually)
```

#### Completeness Gap Distribution

```
Completeness findings:
  required_material missing:   X findings across Y assessments
  required_supporting missing: X findings across Y assessments
  optional missing:            X findings across Y assessments

Most commonly missing required_material fields:
  context.sector:     X times
  context.geography:  X times
  context.use_cases:  X times
  ...
```

#### Confidence Score Distribution

```
Gate confidence scores (0.0 - 1.0):
  Mean:   X.XX
  Median: X.XX
  Min:    X.XX
  Max:    X.XX
  Std:    X.XX

Distribution:
  0.0-0.3 (low):    X assessments
  0.3-0.6 (medium): X assessments
  0.6-0.8 (decent): X assessments
  0.8-1.0 (high):   X assessments
```

#### Self-Audit Layer Health

```
Self-audit status:
  completed: X (Y%)
  timeout:   X (Y%)
  error:     X (Y%)

Self-audit duration (ms):
  Mean:   XXXX
  Median: XXXX
  P95:    XXXX
  Max:    XXXX
```

#### Per-Sector Breakdown

For each sector observed in the data, compute gate decision distribution and average confidence score.

### 2.4 Implementation Details

```typescript
// Read all JSONL files
const eventsDir = path.join(dataDir, 'events');
const findingsDir = path.join(dataDir, 'findings');

// For each assessment:
// 1. Parse events JSONL → find verification_result and gate_decision events for stage='extraction'
// 2. Parse findings JSONL → all VerificationFinding objects
// 3. From shadow_gate_result log (or from gate_decision event metadata): extract actual_decision
// 4. From findings: categorize by finding_type, severity, field_criticality
// 5. From findings with check_id='grounding_quote_exists': extract match_type and match_similarity

// For grounding quote analysis, look at evidence_refs on findings:
// - finding_type: 'grounding_quote_missing' with severity 'info' → fuzzy match
// - finding_type: 'grounding_quote_missing' with severity 'critical' → no match
// - Absence of grounding_quote_missing finding for a quote → exact match
```

### 2.5 JSON Output Format

```typescript
interface CalibrationReport {
  generated_at: string;
  assessment_count: number;
  sectors_observed: string[];
  gate_decisions: Record<string, number>;
  hard_stop_triggers: Record<string, number>;
  grounding_quotes: {
    total: number;
    exact_match: number;
    fuzzy_match: number;
    no_match: number;
    fuzzy_similarity_distribution: Record<string, number>;  // bucketed
    no_match_similarity_distribution: Record<string, number>;
  };
  completeness: {
    required_material_gaps: number;
    required_supporting_gaps: number;
    most_missing_fields: Record<string, number>;
  };
  confidence_scores: {
    mean: number;
    median: number;
    min: number;
    max: number;
    std: number;
    distribution: Record<string, number>;  // bucketed
  };
  self_audit: {
    status_distribution: Record<string, number>;
    duration_ms: { mean: number; median: number; p95: number; max: number };
  };
  per_sector: Record<string, {
    count: number;
    gate_decisions: Record<string, number>;
    avg_confidence: number;
  }>;
}
```

### 2.6 Acceptance Criteria

- Script runs without errors against the shadow mode data
- Console output is human-readable with clear section headers
- JSON output validates against CalibrationReport interface
- All metrics above are computed correctly
- Script handles edge cases: empty data directory, single assessment, missing findings files

---

## Task 3: Threshold Calibration

**Output:** Updated threshold constants + calibration rationale document

### 3.1 Grounding Quote Fuzzy Match Threshold

**Current value:** 0.85 Jaccard similarity
**File:** `packages/pipeline-api/src/services/extraction/validators/grounding-quote-check.ts`

**Calibration logic:**

Look at the `no_match_similarity_distribution` from the calibration report. The 0.70-0.85 bucket is the critical zone — these are quotes that failed the threshold but might be legitimate minor rephrasings.

**Decision rules:**

- If more than 15% of all quote checks land in the 0.70-0.85 "no match" bucket → **lower threshold to 0.80**. Too many false positives — the LLM is paraphrasing more than expected and the threshold is catching legitimate quotes.
- If fewer than 5% of all quote checks produce false negatives (quotes manually verified as legitimate that scored below threshold) → **keep threshold at 0.85**. It's working.
- If the 0.50-0.70 bucket has significant volume → investigate. These should almost all be genuine fabrications. If some are legitimate, there's a deeper quote normalization issue.

**What to change:**

Extract the threshold to a named constant (if not already):

```typescript
// In grounding-quote-check.ts
export const GROUNDING_QUOTE_FUZZY_THRESHOLD = 0.85; // Calibrated from shadow mode data
```

Update the value based on the calibration analysis. Document the rationale in a comment:

```typescript
// Threshold calibrated on [DATE] from [N] shadow mode assessments.
// [X]% of quotes matched exactly, [Y]% fuzzy-matched at ≥0.85.
// [Z] quotes in 0.70-0.85 range manually inspected: [N] were legitimate rephrasings, [M] were genuine fabrications.
// Decision: [KEEP 0.85 / LOWER TO 0.80] because [reason].
export const GROUNDING_QUOTE_FUZZY_THRESHOLD = 0.85;
```

### 3.2 Required Material Grounding Coverage Threshold

**Current value:** 80%
**File:** `packages/pipeline-api/src/lib/gate-evaluator.ts`

**Calibration logic:**

Look at how often `GATE_LOW_COVERAGE` fires. Compute the actual coverage distribution across all assessments.

**Decision rules:**

- If `GATE_LOW_COVERAGE` fires on more than 40% of assessments → **lower threshold to 70%**. The bar is too high for the current self-audit reliability.
- If `GATE_LOW_COVERAGE` fires on fewer than 10% of assessments → **consider raising to 85%**. The self-audit is grounding well and the threshold has room to tighten.
- If the coverage distribution is bimodal (most assessments either >90% or <60%) → keep threshold at 80%. The bimodal distribution suggests the threshold is correctly separating good extractions from bad ones.

**What to change:**

```typescript
// In gate-evaluator.ts
export const REQUIRED_MATERIAL_COVERAGE_THRESHOLD = 0.80; // Calibrated from shadow mode data
```

### 3.3 Acceptance Criteria

- Both thresholds are extracted to named, exported constants (not magic numbers)
- Each constant has a calibration comment documenting the data, date, and rationale
- If thresholds changed, relevant tests are updated to use the new constants
- All tests still pass after threshold changes

---

## Task 4: Self-Audit Prompt Eval Suite

**Create:** `packages/pipeline-api/tests/eval/self-audit-eval.ts`
**Create:** `packages/pipeline-api/tests/eval/golden-extractions/` (directory with golden test cases)
**Spec Reference:** v0.3 §12, Open Question 5

### 4.1 Purpose

Build a lightweight eval that scores the self-audit prompt's ability to correctly classify extraction fields as GROUNDED, INFERRED, CONTRADICTED, or UNSUPPORTED. This eval runs against golden test cases where the correct classification for each field is known.

### 4.2 Golden Test Cases

Create 5-10 golden test cases. Each consists of:

```typescript
interface GoldenTestCase {
  id: string;
  name: string;
  description: string;                    // What this test case exercises
  source_document: string;                // The source document text
  extraction_output: Record<string, unknown>;  // The AssessmentContext (or a subset)
  expected_classifications: Record<string, {
    classification: 'GROUNDED' | 'INFERRED' | 'CONTRADICTED' | 'UNSUPPORTED';
    note?: string;                         // Why this classification is correct
  }>;
}
```

**Required test cases:**

| # | Case | Source | Exercises |
|---|------|--------|-----------|
| 1 | scenario-01 with correct extraction | Use actual fixture + a known-good extraction | All GROUNDED — happy path |
| 2 | scenario-01 with hallucinated sector | Correct fixture, extraction has wrong sector | Self-audit should catch CONTRADICTED |
| 3 | scenario-05 (vague doc) with inferred fields | Vague fixture, extraction infers sector from context | INFERRED classification accuracy |
| 4 | scenario-02 with fabricated detail | Healthcare fixture, extraction adds detail not in doc | UNSUPPORTED detection |
| 5 | scenario-03 with missing extraction | Fintech fixture, extraction omits a stated detail | MISSING detection |
| 6 | Mixed case | Document with explicit, inferred, and contradicted fields | Multi-classification accuracy |

**How to produce golden extractions:** Run the extraction service on each fixture, then manually review and annotate the correct classification for each field. Save the extraction output and annotations as JSON files in `tests/eval/golden-extractions/`.

### 4.3 Eval Runner

```typescript
// tests/eval/self-audit-eval.ts

interface EvalResult {
  test_case: string;
  total_fields: number;
  correct_classifications: number;
  incorrect_classifications: number;
  accuracy: number;                    // correct / total
  misclassifications: Array<{
    field_path: string;
    expected: string;
    actual: string;
    note: string;
  }>;
}

interface EvalSummary {
  total_cases: number;
  overall_accuracy: number;
  per_case: EvalResult[];
  per_classification_accuracy: Record<string, { correct: number; total: number; accuracy: number }>;
  worst_cases: string[];              // Cases with accuracy < 0.7
}
```

**Scoring logic:**

1. For each golden test case, call `runSelfAudit()` with the fixture document and golden extraction
2. Map the self-audit findings back to field classifications (using the same mapping from Sprint 2 Task 3.4)
3. Compare against expected classifications
4. Score: exact classification match = correct, anything else = incorrect

### 4.4 Execution

```bash
# Run eval (requires LLM credentials)
npx tsx tests/eval/self-audit-eval.ts

# Output: console summary + tests/eval/results/self-audit-eval-{timestamp}.json
```

This is NOT a Vitest test — it requires live LLM calls and should not run in CI. It is a manual eval script.

### 4.5 Acceptance Criteria

- At least 5 golden test cases created with manual annotations
- Eval runner produces structured results with per-field accuracy
- Overall accuracy target: ≥70% correct classifications across all cases (this is the baseline — will improve with prompt iteration)
- If accuracy is below 70%, document which classification types are failing and recommendations for prompt improvement
- Results saved as JSON for tracking over time

---

## Task 5: Extraction Prompt Quality Evaluation

**Create:** `packages/pipeline-api/tests/eval/extraction-eval.ts`
**Create:** `packages/pipeline-api/tests/eval/golden-extractions/` (reuse directory from Task 4)
**Spec Reference:** discover-brief.md Open Question #7

### 5.1 Purpose

This is the #1 pipeline quality risk. The verification layer catches problems after they happen — this eval scores whether the extraction prompts produce good output in the first place. If extraction quality is poor, no amount of verification makes the product trustworthy.

### 5.2 Ground Truth Corpus

Use the 6 existing test fixtures. For each, manually create a golden AssessmentContext with the expected extraction output. The test-protocol.md scoring rubric (Dimension 1: Extraction Quality) defines what "correct" means.

Each golden extraction file:

```typescript
// tests/eval/golden-extractions/scenario-01-expected.json
{
  "scenario": "scenario-01-retail-content-tool",
  "source_fixture": "tests/fixtures/scenario-01-retail-content-tool.md",
  "expected_extraction": {
    // The correct AssessmentContext fields
    "organization": { /* ... */ },
    "ai_system": { /* ... */ },
    // etc.
  },
  "field_expectations": {
    "context.sector": { "expected": "retail", "tolerance": "exact" },
    "context.geography": { "expected": "United States", "tolerance": "contains" },
    "context.use_cases": { "expected": ["content_generation"], "tolerance": "subset" },
    // ...
  }
}
```

### 5.3 Scoring Dimensions

Score each extraction across these dimensions (aligned with test-protocol.md Dimension 1):

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| **Completeness** | 30% | % of expected fields present and non-empty |
| **Accuracy** | 30% | % of present fields matching expected values (exact or within tolerance) |
| **Confidence calibration** | 20% | Correlation between confidence scores and actual accuracy |
| **Missing field detection** | 10% | Does the pipeline correctly flag fields it couldn't extract? |
| **No hallucination** | 10% | Are all extracted fields grounded in the source document? |

### 5.4 Eval Runner

```typescript
interface ExtractionEvalResult {
  scenario: string;
  completeness_score: number;      // 0.0 - 1.0
  accuracy_score: number;          // 0.0 - 1.0
  confidence_calibration: number;  // 0.0 - 1.0
  missing_field_detection: number; // 0.0 - 1.0
  no_hallucination: number;        // 0.0 - 1.0
  weighted_score: number;          // Composite
  field_details: Array<{
    field_path: string;
    expected: unknown;
    actual: unknown;
    match: boolean;
    confidence: number;
    notes: string;
  }>;
}

interface ExtractionEvalSummary {
  total_scenarios: number;
  overall_weighted_score: number;
  per_scenario: ExtractionEvalResult[];
  weakest_dimension: string;
  worst_scenario: string;
  recommendations: string[];
}
```

### 5.5 Execution

```bash
# Run eval (requires LLM credentials)
npx tsx tests/eval/extraction-eval.ts

# Output: console summary + tests/eval/results/extraction-eval-{timestamp}.json
```

### 5.6 Pass / Fail Criteria

| Metric | Target | Action if below |
|--------|--------|-----------------|
| Overall weighted score | ≥ 0.75 | Prompt iteration required before gate enforcement |
| Completeness per scenario | ≥ 0.80 | Investigate: is the document too vague, or is the prompt missing extraction patterns? |
| Accuracy per scenario | ≥ 0.70 | Review extraction prompt for the failing sector/use case |
| Worst scenario score | ≥ 0.60 | Targeted prompt fix for that scenario type |
| No hallucination | ≥ 0.90 | Critical — hallucinated fields in a governance product are unacceptable |

### 5.7 Acceptance Criteria

- Golden extractions created for all 6 test fixtures
- Eval runner produces structured results per the interface above
- Results saved as JSON with timestamp for tracking
- If scores are below targets, document specific failure patterns and prompt improvement recommendations

---

## Task 6: Calibration Report

**Create:** `Research/impl/calibration-report.md`

### 6.1 Purpose

A human-readable document capturing all calibration decisions, the data behind them, and the rationale. This document is the input for the Phase 1A+ decision: "Are thresholds stable? Is prompt quality acceptable? Ready to enable gate enforcement?"

### 6.2 Required Sections

```markdown
# Shadow Mode Calibration Report

## Data Summary
- Assessment count: N
- Date range: [first] to [last]
- Sectors: [list]
- Document types: [markdown: N, pdf: N, quick: N]

## Gate Decision Distribution
[From analysis script output]

## Grounding Quote Threshold Calibration
- Current threshold: 0.85
- Quotes in 0.70-0.85 range: N (X%)
- Manual inspection results: [N legitimate, M fabricated]
- Decision: [KEEP / LOWER TO X]
- Rationale: [explanation]

## Coverage Threshold Calibration
- Current threshold: 80%
- GATE_LOW_COVERAGE fire rate: X%
- Coverage distribution: [percentiles]
- Decision: [KEEP / LOWER TO X / RAISE TO X]
- Rationale: [explanation]

## Self-Audit Prompt Quality
- Overall accuracy: X%
- Worst classification type: [type]
- Recommendations: [list]

## Extraction Prompt Quality
- Overall weighted score: X.XX
- Weakest dimension: [dimension]
- Worst scenario: [scenario]
- Recommendations: [list]

## Gate Enforcement Readiness
- [ ] Grounding quote threshold calibrated
- [ ] Coverage threshold calibrated
- [ ] Self-audit accuracy ≥ 70%
- [ ] Extraction quality ≥ 0.75 weighted score
- [ ] No hallucination rate ≥ 90%
- [ ] False positive rate on gate decisions < 20%

## Decision: Ready for gate enforcement?
[YES / NO — with explanation and any remaining blockers]
```

### 6.3 Acceptance Criteria

- All sections populated with actual data
- Threshold decisions have explicit rationale tied to the metrics
- Gate enforcement readiness checklist completed
- Clear YES/NO recommendation with explanation

---

## File Manifest

### Files to Create

| File | Purpose |
|------|---------|
| `packages/pipeline-api/scripts/analyze-shadow-mode.ts` | Analysis script for JSONL data |
| `packages/pipeline-api/tests/eval/self-audit-eval.ts` | Self-audit prompt eval runner |
| `packages/pipeline-api/tests/eval/extraction-eval.ts` | Extraction prompt eval runner |
| `packages/pipeline-api/tests/eval/golden-extractions/` | Directory for golden test case JSON files |
| `packages/pipeline-api/tests/eval/golden-extractions/scenario-01-expected.json` | Golden extraction for retail scenario |
| `packages/pipeline-api/tests/eval/golden-extractions/scenario-02-expected.json` | Golden extraction for healthcare scenario |
| `packages/pipeline-api/tests/eval/golden-extractions/scenario-03-expected.json` | Golden extraction for fintech scenario |
| `packages/pipeline-api/tests/eval/golden-extractions/scenario-04-expected.json` | Golden extraction for gov/HR scenario |
| `packages/pipeline-api/tests/eval/golden-extractions/scenario-05-expected.json` | Golden extraction for vague doc scenario |
| `packages/pipeline-api/tests/eval/golden-extractions/scenario-06-expected.json` | Golden extraction for insurance scenario |
| `Research/impl/calibration-report.md` | Calibration decisions and rationale |

### Files to Potentially Modify

| File | Change |
|------|--------|
| `packages/pipeline-api/src/services/extraction/validators/grounding-quote-check.ts` | Extract threshold to named constant, update value if calibration indicates |
| `packages/pipeline-api/src/lib/gate-evaluator.ts` | Extract coverage threshold to named constant, update value if calibration indicates |

---

## Validation Checklist

### Build Checks

```bash
cd packages/pipeline-api && pnpm build      # Zero TS errors (if any source files changed)
cd packages/pipeline-api && pnpm test       # All 134 tests still pass
```

### Analysis Script Checks

```bash
# After running 30+ assessments:
npx tsx scripts/analyze-shadow-mode.ts --format console  # Human-readable output
npx tsx scripts/analyze-shadow-mode.ts --format json > calibration-data.json  # Machine-readable
```

- Verify all metric sections are populated
- Verify per-sector breakdown shows at least 3 sectors
- Verify grounding quote distribution accounts for all checked quotes

### Eval Checks (require LLM credentials)

```bash
npx tsx tests/eval/self-audit-eval.ts      # Self-audit accuracy report
npx tsx tests/eval/extraction-eval.ts      # Extraction quality report
```

- Results JSON saved in `tests/eval/results/`
- Console output shows per-case and overall scores

### Calibration Report Check

- `Research/impl/calibration-report.md` exists with all sections filled
- Gate enforcement readiness checklist has a clear recommendation

---

## Out of Scope

- Gate enforcement (still shadow mode)
- Prompt iteration / prompt engineering changes (Sprint 3 identifies what needs fixing; fixing is a separate workstream)
- Verification on stages 1, 3, 4, 5, 6
- Human review flow
- Dashboard UI changes
- Cross-model verification

---

## Decision Gate

At the end of Sprint 3, the calibration report answers: **"Ready to enable gate enforcement?"**

If YES → proceed to Phase 1A+ (enable gates, build human review flow, extend to other stages)

If NO → the report identifies specific blockers: threshold too aggressive (lower), prompt quality too low (iterate prompts), self-audit unreliable (improve prompt or switch model). Address blockers before enabling enforcement.

---

*Phase 1A+ spec will be produced after Sprint 3 calibration data confirms readiness for gate enforcement. See `Research/impl/sprint-backlog.md` for the full roadmap.*
