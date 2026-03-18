# Implementation Spec: Verification Quality Tuning — Sprint 4

**Project:** AI Risk Tools
**Sprint:** Verification Quality Tuning (Field Criticality + Extraction Prompt + Eval Harness)
**Author:** CTO (Opus 4.6) for Codex 5.4 implementation
**Date:** March 16, 2026
**Status:** Ready for implementation (Codex handoff)
**Branch:** `codex/sprint-4-quality-tuning`
**Prerequisite:** Sprints 1-3a complete. 150 tests passing. Calibration run data in `Research/impl/calibration-report.md`.

---

## Goal

Fix the three root causes that make gate enforcement unusable:
1. **Field criticality map over-classifies** — 55% of assessments trigger `GATE_CRIT_MATERIAL` because too many fields are `required_material`
2. **Extraction prompt doesn't instruct verbatim quoting** — 30% of grounding quotes fail because the LLM paraphrases instead of quoting
3. **Eval harness has false mismatches** — geography (ISO codes vs full names) and use-case (narrow vs broad) comparisons are too strict

This sprint is pure code — no LLM calls, no calibration runs. The goal is to ship the fixes so a follow-up calibration run can validate the improvements.

---

## Codebase Context

**Monorepo:** pnpm workspaces, TypeScript 5, Node 20, Vitest
**Working directory:** `packages/pipeline-api/`
**Test command:** `npx vitest run` (must pass 150+ tests after all changes)

**Key files you will modify:**

| File | What It Does |
|------|-------------|
| `src/services/extraction/field-criticality.ts` | Maps extraction fields to criticality levels |
| `src/prompts/extraction.ts` | Extraction prompt + tool schema sent to LLM |
| `tests/eval/_helpers.ts` | Eval comparison utilities |
| `tests/eval/golden-extractions/*.json` | Golden test cases for extraction eval |
| `src/services/extraction/self-audit.ts` | Self-audit prompt (function `buildSelfAuditPrompt`) |
| `tests/services/extraction/validators.spec.ts` | Validator tests |
| `tests/lib/gate-evaluator.spec.ts` | Gate evaluator tests |

---

## Task 1: Revise Field Criticality Map

**File:** `src/services/extraction/field-criticality.ts`

### Current state (causes 55% GATE_CRIT_MATERIAL rate):

```typescript
export const extractionFieldCriticality: Record<string, FieldCriticality> = {
  "organization.name": "optional",
  "organization.sector": "required_material",        // PROBLEM
  "organization.size": "optional",
  "organization.geography": "required_material",      // PROBLEM
  "ai_system.name": "required_material",
  "ai_system.description": "required_material",
  "ai_system.model_type": "required_supporting",
  "ai_system.lifecycle_stage": "required_supporting",
  "ai_system.is_autonomous": "optional",
  "ai_system.data_sensitivity": "required_supporting",
  "ai_system.use_cases": "required_material",         // PROBLEM
  "ai_system.deployment_context": "required_supporting",
  missing_fields: "optional",
};
```

### Target state:

```typescript
export const extractionFieldCriticality: Record<string, FieldCriticality> = {
  "organization.name": "optional",
  "organization.sector": "required_supporting",       // CHANGED: sector is often inferred, not stated
  "organization.size": "optional",
  "organization.geography": "required_supporting",    // CHANGED: geography triggers false positives on ISO vs full name
  "ai_system.name": "required_material",              // KEEP: system name is core identity
  "ai_system.description": "required_material",       // KEEP: description is the primary extraction target
  "ai_system.model_type": "required_supporting",
  "ai_system.lifecycle_stage": "required_supporting",
  "ai_system.is_autonomous": "optional",
  "ai_system.data_sensitivity": "required_material",  // PROMOTED: data sensitivity drives regulatory analysis
  "ai_system.use_cases": "required_supporting",       // CHANGED: use cases are broad, often inferred
  "ai_system.deployment_context": "required_supporting",
  missing_fields: "optional",
};
```

**Rationale:**
- `organization.sector` demoted: self-audit consistently marks this INFERRED because documents describe what they do, not what sector they're in. Inference is correct behavior here.
- `organization.geography` demoted: the LLM returns ISO codes ("US") while grounding quotes match full names ("United States"). This is a normalization gap, not a quality gap.
- `ai_system.use_cases` demoted: the LLM correctly extracts more specific use cases than a human might label. Broad extraction is a feature.
- `ai_system.data_sensitivity` promoted: data sensitivity drives the entire regulatory analysis. If this is wrong, everything downstream is wrong.

### Tests to update

In `tests/lib/gate-evaluator.spec.ts`, find any test that hardcodes criticality expectations for the changed fields and update them. Specifically:
- If any test creates mock findings with `field_criticality: "required_material"` for `organization.sector`, `organization.geography`, or `ai_system.use_cases`, change to `"required_supporting"`.
- If any test checks `data_sensitivity` as `"required_supporting"`, change to `"required_material"`.

In `tests/services/extraction/validators.spec.ts`, same pattern — update any hardcoded criticality values for the changed fields.

---

## Task 2: Add Verbatim Quoting Instruction to Extraction Prompt

**File:** `src/prompts/extraction.ts`, function `buildExtractionPrompt`

### Current extraction prompt (lines 152-174):

The prompt says "Only extract a field value if the document provides specific, verifiable information" but does NOT instruct the LLM to include verbatim quotes. The `source_quote` field exists in the confidence schema but the prompt doesn't emphasize using it.

### Changes:

Add these two rules to the `CRITICAL RULES:` section, after rule 8:

```
9. source_quote: For EVERY field you extract, include a source_quote in the confidence record. The source_quote MUST be an EXACT substring copied from the source document — do not paraphrase, summarize, or rephrase. If you cannot find an exact passage to quote, set evidence_basis to "inferred" and omit source_quote.
10. geography: Use ISO 3166-1 alpha-2 country codes (US, GB, DE, FR, etc). If the document says "United States", extract "US". If it says "European Union", extract "EU".
```

### Before (extract from buildExtractionPrompt, rules section):

```typescript
8. Per-field confidence: For each field you DO extract, mentally assess:
   - "explicit" = the document directly states this fact
   - "inferred" = you derived this from context but it's not directly stated
   Report this via the confidence records.
```

### After:

```typescript
8. Per-field confidence: For each field you DO extract, mentally assess:
   - "explicit" = the document directly states this fact
   - "inferred" = you derived this from context but it's not directly stated
   Report this via the confidence records.
9. source_quote: For EVERY field you extract, include a source_quote in the confidence record. The source_quote MUST be an EXACT substring copied verbatim from the source document — do not paraphrase, summarize, or rephrase. Copy-paste the relevant passage (up to 120 characters). If you cannot find an exact passage to quote, set evidence_basis to "inferred" and omit source_quote.
10. geography: Always use ISO 3166-1 alpha-2 country codes (US, GB, DE, FR, IE, etc). If the document says "United States", extract "US". If it says "European Union", extract "EU".
```

### What NOT to do:
- Do NOT change the tool schema in `extractContextTool`. The `source_quote` field already exists in the confidence schema.
- Do NOT change the `buildCorrectionPrompt` function.
- Do NOT change any other prompt files.
- Do NOT modify the extraction service logic — only the prompt text.

---

## Task 3: Fix Eval Harness Geography and Use-Case Comparisons

**File:** `tests/eval/_helpers.ts`

### Problem:

The `compareWithTolerance` function uses `subset` tolerance for geography and use_cases, but:
- Geography: golden expects `["United States"]`, LLM returns `["US"]`. Subset check fails.
- Use-cases: golden expects `["credit"]`, LLM returns `["credit_scoring", "credit_decisioning"]`. Substring containment would pass but exact subset fails.

### Changes:

Add a geography normalization map and a `fuzzy_subset` tolerance mode.

#### 3a. Add ISO country code normalization

Add this constant to `_helpers.ts`:

```typescript
const GEOGRAPHY_ALIASES: Record<string, string> = {
  "united states": "US",
  "usa": "US",
  "united kingdom": "UK",
  "great britain": "GB",
  "germany": "DE",
  "france": "FR",
  "netherlands": "NL",
  "ireland": "IE",
  "canada": "CA",
  "australia": "AU",
  "japan": "JP",
  "china": "CN",
  "india": "IN",
  "brazil": "BR",
  "european union": "EU",
};

function normalizeGeo(value: string): string {
  return GEOGRAPHY_ALIASES[value.toLowerCase()] ?? value.toUpperCase();
}
```

#### 3b. Update EvalTolerance type

```typescript
// Before:
export type EvalTolerance = "exact" | "contains" | "subset" | "present";

// After:
export type EvalTolerance = "exact" | "contains" | "subset" | "subset_geo" | "subset_fuzzy" | "present";
```

#### 3c. Add comparison branches in compareWithTolerance

Add handling for the new tolerance types. For `subset_geo`: normalize both expected and actual arrays through the geography alias map, then do subset comparison. For `subset_fuzzy`: check if any actual value contains any expected value as a substring (case-insensitive).

```typescript
case "subset_geo": {
  if (!Array.isArray(expected) || !Array.isArray(actual)) return false;
  const normalizedActual = (actual as string[]).map(normalizeGeo);
  return (expected as string[]).every(exp =>
    normalizedActual.includes(normalizeGeo(exp))
  );
}
case "subset_fuzzy": {
  if (!Array.isArray(expected) || !Array.isArray(actual)) return false;
  const actualLower = (actual as string[]).map(s => s.toLowerCase());
  return (expected as string[]).every(exp =>
    actualLower.some(act => act.includes(exp.toLowerCase()))
  );
}
```

#### 3d. Update golden test case files

Update ALL 6 `scenario-*-expected.json` files in `tests/eval/golden-extractions/`:

For every `field_expectations` entry where `field_path` is `organization.geography`:
- Change `"tolerance": "subset"` to `"tolerance": "subset_geo"`

For every `field_expectations` entry where `field_path` is `ai_system.use_cases`:
- Change `"tolerance": "subset"` to `"tolerance": "subset_fuzzy"`

The specific files:
- `scenario-01-retail-content-tool-expected.json`
- `scenario-02-healthcare-diagnostic-expected.json`
- `scenario-03-fintech-credit-scoring-expected.json`
- `scenario-04-gov-hr-screening-expected.json`
- `scenario-05-vague-startup-pitch-expected.json`
- `scenario-06-insurance-claims-ai-expected.json`

### What NOT to do:
- Do NOT change the expected values in the golden files. Only change the tolerance type.
- Do NOT modify `self-audit-eval.ts` or the self-audit golden cases.
- Do NOT add new golden test cases in this sprint.

---

## Task 4: Refine Self-Audit Prompt (GROUNDED vs INFERRED boundary)

**File:** `src/services/extraction/self-audit.ts`, function `buildSelfAuditPrompt`

### Problem:

The self-audit over-classifies GROUNDED fields as INFERRED. Example: if the document says "we operate in the healthcare space", the self-audit marks `organization.sector = "healthcare"` as INFERRED because it wasn't a verbatim extraction. This is too conservative — reasonable interpretation of explicit statements should count as GROUNDED.

### Current prompt (lines 44-75):

```
For each field in the extraction, classify it as one of:
- GROUNDED: The field value is directly stated in the source document. Quote the exact passage (<=100 chars) that supports it.
- INFERRED: The field value is not directly stated but can be reasonably inferred.
```

### Updated prompt:

Replace the classification definitions (the bulleted list starting with "- GROUNDED:" through "- MISSING:") with:

```
- GROUNDED: The field value is directly supported by the source document. This includes:
  - Exact matches: The document says "healthcare" and the field is "healthcare"
  - Obvious mappings: The document says "we operate in the United States" and the field is "US"
  - Direct interpretation: The document says "we provide AI-powered medical imaging analysis" and the field sector is "healthcare"
  A value is GROUNDED if any reasonable reader would extract the same value from the document. Quote the supporting passage (<=100 chars).
- INFERRED: The field value requires significant interpretation or domain knowledge beyond what the document states. Examples:
  - The document describes features but the model_type classification requires domain knowledge about ML architectures
  - The lifecycle_stage is guessed from deployment language ("pilot program" → "pilot")
  If a single step of reasoning connects the document to the value, it is GROUNDED not INFERRED.
- CONTRADICTED: The document contains information that directly contradicts this field value. Quote the contradicting passage.
- UNSUPPORTED: The field value has no basis in the source document and cannot be inferred from any stated information. This indicates potential hallucination.
- MISSING: There is relevant information in the source document that was NOT captured in any extraction field. Only use this for information the extraction SHOULD have captured but didn't.
```

### What NOT to do:
- Do NOT change the function signature or return type of `buildSelfAuditPrompt`.
- Do NOT change the JSON array structure the prompt requests.
- Do NOT change `convertFinding`, `createGroundingCandidate`, or any other function in this file.
- Do NOT change the self-audit golden test cases (`self-audit-*.json`).
- Do NOT change the `runSelfAudit` function.
- Do NOT modify any timeout values.

---

## Validation

After all changes, run:

```bash
cd packages/pipeline-api
npx vitest run
```

**Expected:** All 150+ tests pass. No new tests are required for this sprint — the changes are prompt text, criticality map values, and eval tolerance types. Existing test coverage validates the mechanics.

**Also run typecheck:**

```bash
pnpm build:types && pnpm typecheck:graph
```

**Expected:** Clean typecheck. The new `EvalTolerance` union members and `normalizeGeo` function should type-check without issue.

---

## Files Changed Summary

| File | Change Type | What Changed |
|------|-----------|-------------|
| `src/services/extraction/field-criticality.ts` | Edit | 3 fields demoted, 1 promoted |
| `src/prompts/extraction.ts` | Edit | Added rules 9-10 to extraction prompt |
| `tests/eval/_helpers.ts` | Edit | Added `normalizeGeo`, `subset_geo`, `subset_fuzzy` |
| `tests/eval/golden-extractions/scenario-01-*.json` | Edit | geography → subset_geo, use_cases → subset_fuzzy |
| `tests/eval/golden-extractions/scenario-02-*.json` | Edit | Same |
| `tests/eval/golden-extractions/scenario-03-*.json` | Edit | Same |
| `tests/eval/golden-extractions/scenario-04-*.json` | Edit | Same |
| `tests/eval/golden-extractions/scenario-05-*.json` | Edit | Same |
| `tests/eval/golden-extractions/scenario-06-*.json` | Edit | Same |
| `src/services/extraction/self-audit.ts` | Edit | Refined GROUNDED/INFERRED classification definitions |
| `tests/lib/gate-evaluator.spec.ts` | Edit (if needed) | Update hardcoded criticality values |
| `tests/services/extraction/validators.spec.ts` | Edit (if needed) | Update hardcoded criticality values |
