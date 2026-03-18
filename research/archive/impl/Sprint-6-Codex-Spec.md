# Implementation Spec: Gate Enforcement + Expanded Golden Corpus — Sprint 6

**Project:** AI Risk Tools
**Sprint:** Enable Gate Enforcement on Stage 2 + Expand Eval Corpus
**Author:** CTO (Opus 4.6) for Codex 5.4 implementation
**Date:** March 16, 2026
**Status:** BLOCKED — requires Sprint 4 + Sprint 5 merged and a successful re-calibration run
**Branch:** `codex/sprint-6-gate-enforcement`
**Prerequisite:** Sprint 5 merged. Re-calibration run shows `GATE_CRIT_MATERIAL` < 25% and `GATE_QUOTE_FABRICATED` < 30%. 150+ tests passing.

---

## Goal

Turn on gate enforcement for the extraction stage. When the gate evaluator decides `needs_review`, the pipeline halts and returns a structured error with verification findings. Also expand the golden test corpus from 6 to 12 self-audit cases to improve eval reliability.

**This sprint is BLOCKED until a re-calibration run validates that Sprint 4 + Sprint 5 brought false-positive rates below the enforcement thresholds.** The re-calibration run is a manual task (requires LLM credentials):

```bash
cd packages/pipeline-api
# Clear old verification data
rm -f data/verification/events/*.jsonl data/verification/findings/*.jsonl
# Start the API server (in another terminal)
source .env && pnpm dev
# Run calibration
./scripts/run-calibration.sh
# Check results
cat data/verification/calibration-report.json
```

**Go/no-go criteria:**
- `GATE_CRIT_MATERIAL` < 25% (was 55%)
- `GATE_QUOTE_FABRICATED` < 30% (was 52%)
- `GATE_LOW_COVERAGE` < 15% (was 31%)
- Self-audit accuracy > 0.80 on re-run of eval suite

If these thresholds aren't met, iterate on Sprint 4/5 changes before proceeding.

---

## Codebase Context

**Working directory:** `packages/pipeline-api/`
**Test command:** `npx vitest run`

**Key files you will modify:**

| File | What It Does |
|------|-------------|
| `src/services/pipeline-orchestrator.ts` | Contains shadow mode override — the line that forces `auto_proceed` |
| `src/lib/gate-evaluator.ts` | Gate evaluator — needs to expose structured halt response |
| `tests/eval/golden-extractions/` | Golden corpus — add 6 new self-audit cases |
| `src/services/extraction/self-audit.ts` | Self-audit timeout — may need adjustment |

---

## Task 1: Remove Shadow Mode Override

**File:** `src/services/pipeline-orchestrator.ts`

### Problem:

The orchestrator currently overrides every gate decision to `auto_proceed` regardless of what the gate evaluator recommends. This is the shadow mode behavior. We need to honor the real gate decision.

### Changes:

Find the shadow mode override. It will be a line that looks like one of these patterns:

```typescript
// Pattern A: Direct override
gateResult.decision = "auto_proceed";

// Pattern B: Conditional override
if (shadowMode) { gateResult.decision = "auto_proceed"; }

// Pattern C: Config-based
const decision = process.env.SHADOW_MODE === "true" ? "auto_proceed" : gateResult.decision;
```

Replace with logic that:
1. If gate decision is `auto_proceed` or `proceed_with_flags`: continue the pipeline
2. If gate decision is `needs_review`: set assessment status to `"halted"`, emit a `gate_halt` event, and return early with the verification findings

### New behavior when gate decides `needs_review`:

```typescript
if (gateResult.decision === "needs_review") {
  // Set assessment status to halted
  store.updateStatus(assessmentId, "halted");

  // Emit halt event through SSE so the dashboard knows
  emitSSE(assessmentId, {
    type: "gate_halt",
    stage: "extraction",
    decision: gateResult.decision,
    triggered_rules: gateResult.triggered_rules,
    finding_count: gateResult.all_findings.length,
    message: "Assessment halted: extraction verification failed. Review required.",
  });

  // Emit verification event
  emitter.gateDecision(gateResult);

  return; // Stop pipeline execution
}
```

### Assessment store changes:

If the assessment store (`src/store/assessment-store.ts`) doesn't already support a `"halted"` status, add it. Check the `AssessmentStatus` type — if it only has `"processing" | "complete" | "error"`, add `"halted"`.

### What NOT to do:
- Do NOT remove the event emission for the gate decision. The gate decision event MUST still be emitted for both `auto_proceed` AND `needs_review`.
- Do NOT change the gate evaluator logic itself — only how the orchestrator responds to its decision.
- Do NOT add a resume endpoint (that's Phase 1A+, not this sprint).
- Do NOT change the dashboard (it will show "halted" assessments as a future task).

---

## Task 2: Add Structured Halt Response to Assessment API

**File:** `src/routes/assessments.ts` (or wherever the GET `/api/v1/assessments/:id` handler is)

### Changes:

When an assessment has status `"halted"`, the API response should include the verification findings so a caller can understand why it was halted.

Add to the assessment detail response:

```typescript
if (assessment.status === "halted") {
  // Read findings from JSONL
  const findingsPath = path.join(
    process.env.VERIFICATION_DATA_DIR ?? "./data/verification",
    "findings",
    `${assessment.id}.jsonl`
  );

  let haltFindings: unknown[] = [];
  try {
    const content = await readFile(findingsPath, "utf8");
    haltFindings = content.trim().split("\n")
      .filter(Boolean)
      .map(line => JSON.parse(line))
      .filter((f: any) => f.severity === "critical" || f.severity === "error");
  } catch {
    // No findings file — include empty array
  }

  response.halt_reason = {
    stage: "extraction",
    finding_count: haltFindings.length,
    critical_findings: haltFindings.slice(0, 10), // Cap at 10 to keep response reasonable
    message: "Assessment halted by verification gate. Critical findings require review.",
  };
}
```

### What NOT to do:
- Do NOT expose the full JSONL file contents — only critical/error findings, capped at 10.
- Do NOT add a resume endpoint.
- Do NOT modify the POST assessment creation endpoint.

---

## Task 3: Expand Self-Audit Golden Corpus

**Directory:** `tests/eval/golden-extractions/`

### Problem:

The self-audit eval has only 6 test cases. The UNSUPPORTED and MISSING classifications have 1 test each (0% accuracy on both). We need more edge cases to get reliable accuracy measurements.

### Add 6 new golden test cases:

Create these files in `tests/eval/golden-extractions/`:

#### `self-audit-07-all-grounded.json`

A complete, well-documented extraction where every field is explicitly stated in the source. All classifications should be GROUNDED. This tests that the self-audit doesn't over-flag clean extractions.

```json
{
  "id": "self-audit-07-all-grounded",
  "name": "All fields explicitly grounded",
  "description": "Every extracted field is directly and unambiguously stated in the source document.",
  "source_fixture": "tests/fixtures/scenario-01-retail-content-tool.md",
  "extraction_output": {
    "organization": {
      "name": "BrightShelf",
      "sector": "retail"
    },
    "ai_system": {
      "name": "ShelfWriter",
      "description": "AI-powered product description generator for e-commerce listings",
      "use_cases": ["content_generation"]
    }
  },
  "expected_classifications": {
    "organization.name": { "classification": "GROUNDED" },
    "organization.sector": { "classification": "GROUNDED" },
    "ai_system.name": { "classification": "GROUNDED" },
    "ai_system.description": { "classification": "GROUNDED" },
    "ai_system.use_cases": { "classification": "GROUNDED" }
  }
}
```

#### `self-audit-08-unsupported-fabrication.json`

An extraction that includes fabricated fields not present in the source document. Tests UNSUPPORTED detection.

```json
{
  "id": "self-audit-08-unsupported-fabrication",
  "name": "Fabricated fields detection",
  "description": "Extraction includes fields that have no basis in the source document.",
  "source_fixture": "tests/fixtures/scenario-05-vague-startup-pitch.md",
  "extraction_output": {
    "organization": {
      "name": "NeuralPath",
      "sector": "finance",
      "geography": ["US", "UK", "Singapore"]
    },
    "ai_system": {
      "name": "PathfinderAI",
      "model_type": "agent",
      "data_sensitivity": ["phi", "biometric"],
      "is_autonomous": true
    }
  },
  "expected_classifications": {
    "organization.name": { "classification": "GROUNDED" },
    "organization.sector": { "classification": "UNSUPPORTED", "note": "The vague startup pitch does not specify a sector" },
    "organization.geography": { "classification": "UNSUPPORTED", "note": "No geography is mentioned in the document" },
    "ai_system.data_sensitivity": { "classification": "UNSUPPORTED", "note": "PHI and biometric data are not mentioned" },
    "ai_system.is_autonomous": { "classification": "UNSUPPORTED", "note": "Autonomy is not discussed" }
  }
}
```

#### `self-audit-09-missing-critical-info.json`

Source document contains important information that the extraction missed entirely. Tests MISSING detection.

```json
{
  "id": "self-audit-09-missing-critical-info",
  "name": "Missing critical information",
  "description": "Source document contains important details about data sensitivity and deployment that were not extracted.",
  "source_fixture": "tests/fixtures/scenario-02-healthcare-diagnostic.md",
  "extraction_output": {
    "organization": {
      "name": "MedVision Analytics",
      "sector": "healthcare"
    },
    "ai_system": {
      "name": "DiagAssist",
      "description": "AI diagnostic assistance tool"
    }
  },
  "expected_classifications": {
    "organization.name": { "classification": "GROUNDED" },
    "organization.sector": { "classification": "GROUNDED" },
    "ai_system.name": { "classification": "GROUNDED" },
    "ai_system.description": { "classification": "GROUNDED" },
    "ai_system.data_sensitivity": { "classification": "MISSING", "note": "Source discusses PHI extensively but extraction omitted data_sensitivity" },
    "ai_system.deployment_context": { "classification": "MISSING", "note": "Source describes multi-hospital deployment but extraction omitted deployment_context" }
  }
}
```

#### `self-audit-10-mixed-iso-geography.json`

Extraction uses ISO codes where source uses full country names. Tests that GROUNDED is applied to reasonable mappings (post-Sprint 4 self-audit prompt improvement).

```json
{
  "id": "self-audit-10-mixed-iso-geography",
  "name": "ISO code geography mapping",
  "description": "Extraction uses ISO codes where source document uses full country names. Should be GROUNDED, not INFERRED.",
  "source_fixture": "tests/fixtures/scenario-03-fintech-credit-scoring.md",
  "extraction_output": {
    "organization": {
      "name": "QuantLend",
      "sector": "finance",
      "geography": ["UK", "IE"]
    },
    "ai_system": {
      "name": "CreditEngine",
      "description": "AI-powered credit scoring and decisioning platform"
    }
  },
  "expected_classifications": {
    "organization.name": { "classification": "GROUNDED" },
    "organization.sector": { "classification": "GROUNDED" },
    "organization.geography": { "classification": "GROUNDED", "note": "UK and IE are standard ISO mappings of explicitly stated UK and Ireland" },
    "ai_system.name": { "classification": "GROUNDED" },
    "ai_system.description": { "classification": "GROUNDED" }
  }
}
```

#### `self-audit-11-inferred-model-type.json`

Model type requires domain knowledge to classify. Tests the INFERRED boundary.

```json
{
  "id": "self-audit-11-inferred-model-type",
  "name": "Model type requires domain inference",
  "description": "The extraction classifies model_type as 'prediction' based on described behavior, but the source document doesn't use that term.",
  "source_fixture": "tests/fixtures/scenario-06-insurance-claims-ai.md",
  "extraction_output": {
    "organization": {
      "name": "GuardianClaims",
      "sector": "insurance"
    },
    "ai_system": {
      "name": "ClaimsIQ",
      "model_type": "prediction",
      "use_cases": ["claims_triage", "fraud_detection"]
    }
  },
  "expected_classifications": {
    "organization.name": { "classification": "GROUNDED" },
    "organization.sector": { "classification": "GROUNDED" },
    "ai_system.name": { "classification": "GROUNDED" },
    "ai_system.model_type": { "classification": "INFERRED", "note": "Document describes predictive behavior but doesn't use the term 'prediction' for model type" },
    "ai_system.use_cases": { "classification": "GROUNDED" }
  }
}
```

#### `self-audit-12-contradicted-autonomy.json`

Extraction says `is_autonomous: true` but source explicitly states human oversight is required.

```json
{
  "id": "self-audit-12-contradicted-autonomy",
  "name": "Contradicted autonomy claim",
  "description": "Extraction claims autonomous operation but source document explicitly requires human oversight.",
  "source_fixture": "tests/fixtures/scenario-04-gov-hr-screening.md",
  "extraction_output": {
    "organization": {
      "name": "Federal Workforce Agency",
      "sector": "government"
    },
    "ai_system": {
      "name": "TalentScreen",
      "is_autonomous": true,
      "description": "AI-powered resume screening and candidate ranking system"
    }
  },
  "expected_classifications": {
    "organization.name": { "classification": "GROUNDED" },
    "organization.sector": { "classification": "GROUNDED" },
    "ai_system.name": { "classification": "GROUNDED" },
    "ai_system.is_autonomous": { "classification": "CONTRADICTED", "note": "Source states human review is required for all final decisions" },
    "ai_system.description": { "classification": "GROUNDED" }
  }
}
```

### What NOT to do:
- Do NOT modify existing golden test cases (self-audit-01 through self-audit-06).
- Do NOT modify the self-audit eval runner (`tests/eval/self-audit-eval.ts`).
- Do NOT modify the self-audit prompt (that was Sprint 4).
- Do NOT modify the extraction eval golden cases or runner.

---

## Validation

```bash
cd packages/pipeline-api
npx vitest run
```

**Expected:** All tests pass.

**Manual validation after merge (requires LLM credentials):**

```bash
# Verify gate enforcement works
source .env && pnpm dev
# In another terminal:
curl -X POST http://localhost:8080/api/v1/assessments \
  -F "file=@tests/fixtures/scenario-05-vague-startup-pitch.md"
# Poll until complete/halted:
curl http://localhost:8080/api/v1/assessments/<id>
# Expect: status may be "halted" if verification gate fires
```

---

## Files Changed Summary

| File | Change Type | What Changed |
|------|-----------|-------------|
| `src/services/pipeline-orchestrator.ts` | Edit | Removed shadow mode override, added halt behavior |
| `src/store/assessment-store.ts` | Edit (maybe) | Added `"halted"` to AssessmentStatus if needed |
| `src/routes/assessments.ts` | Edit | Added halt_reason to GET response for halted assessments |
| `tests/eval/golden-extractions/self-audit-07-*.json` | Create | All-grounded test case |
| `tests/eval/golden-extractions/self-audit-08-*.json` | Create | Fabrication detection test case |
| `tests/eval/golden-extractions/self-audit-09-*.json` | Create | Missing info detection test case |
| `tests/eval/golden-extractions/self-audit-10-*.json` | Create | ISO geography mapping test case |
| `tests/eval/golden-extractions/self-audit-11-*.json` | Create | Inferred model type test case |
| `tests/eval/golden-extractions/self-audit-12-*.json` | Create | Contradicted autonomy test case |
