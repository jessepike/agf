# Full Session Handoff: Verification Layer Architecture + Implementation

**Date:** March 14-15, 2026
**Project:** AI Risk Tools — Pipeline Verification Layer
**Owner:** Jess Pike (jesse@keatingpike.com)
**Repo:** `airisktools-mvp` monorepo (pnpm, TypeScript, Node 20, Vitest)
**Key packages:** `packages/shared-types`, `packages/pipeline-api`, `apps/dashboard`

---

## What AI Risk Tools Is

A 6-stage headless pipeline that produces Zod-validated governance assessments from uploaded documents (PDF/Markdown):

```
Input: PDF/Markdown → Parse → Extraction → Regulatory → Framework → Risk ID → Action Plan → GovernanceAssessment
```

The pipeline runs LLM calls at each stage, extracts information about AI systems from governance documents, identifies applicable regulations, maps to risk frameworks (NIST AI RMF, MIT AIRISK, OWASP), identifies risks, and produces action plans. Target users are GRC professionals at enterprises deploying AI.

---

## What We Built This Session

### The Problem

The pipeline has no verification layer — it trusts LLM output at every stage. For a governance product, this is an existential trust gap. LLMs can hallucinate regulatory findings, fabricate quotes from source documents, and produce confidently wrong risk assessments.

### The Solution: Shadow Mode Verification

We designed and implemented a multi-layer verification system that runs alongside the existing pipeline without enforcing gates (shadow mode). It captures baseline data to calibrate thresholds before turning on enforcement.

### Architecture Overview

Three verification layers per stage:
1. **Deterministic validators** — completeness checks (required fields present), schema conformance (Zod re-validation), two-pass grounding quote verification (exact substring match → Jaccard token similarity fallback at 0.85 threshold)
2. **Self-audit** — LLM call where the model verifies its own extraction, classifying each field as GROUNDED/INFERRED/CONTRADICTED/UNSUPPORTED
3. **Cross-model** — deferred to Phase 2 (different model verifies the output)

**Gate evaluator** applies 8 hard-stop rules:
- `GATE_CRIT_MATERIAL` — critical finding on required_material field
- `GATE_MISSING_MATERIAL` — required_material field empty/absent
- `GATE_QUOTE_FABRICATED` — grounding quote not found in source document
- `GATE_CRIT_SUPPORTING` — critical finding on required_supporting field
- `GATE_CONTRADICTION` — self-audit found CONTRADICTED classification
- `GATE_LOW_COVERAGE` — less than 80% of required_material fields grounded
- `GATE_DETERMINISTIC_FAIL` — deterministic validator returned halt_error
- `GATE_LLM_VERIFY_FAIL` — self-audit layer failed/timed out

**Shadow mode behavior:** Gate evaluates and logs the real decision but overrides to `auto_proceed` every time. Events and findings are persisted to JSONL for post-hoc analysis.

---

## Sprint History & Current State

### Sprint 1: Shadow Mode Foundation ✅ (89 tests)
- Verification Zod schemas in `packages/shared-types/src/verification.ts`
- EventSink + FindingStore (JSONL per assessment, append-only) in `packages/pipeline-api/src/lib/event-sink.ts`
- PipelineEventEmitter in `packages/pipeline-api/src/lib/pipeline-event-emitter.ts`
- Wired into `pipeline-orchestrator.ts` alongside existing SSE flow
- `VERIFICATION_DATA_DIR` env var, data directory, gitignore entries
- **Spec:** `Research/impl/Sprint-1-Implementation-Spec.md`

### Sprint 2: Stage 2 Verification POC ✅ (134 tests)
- Field criticality map for extraction stage in `src/services/extraction/field-criticality.ts`
- Three deterministic validators under `src/services/extraction/validators/`:
  - completeness_check
  - schema_conformance
  - grounding_quote_exists (two-pass: exact substring → Jaccard ≥0.85)
- Self-audit layer in `src/services/extraction/self-audit.ts`
- VerificationCoordinator in `src/lib/verification-coordinator.ts`
- GateEvaluator with 8 hard-stop rules in `src/lib/gate-evaluator.ts`
- Wired into orchestrator for Stage 2 (extraction) only
- Gate evaluates but overrides to `auto_proceed` (shadow mode)
- `SELF_AUDIT_MODEL` env var added
- **Spec:** `Research/impl/Sprint-2-Implementation-Spec.md`

### Sprint 3: Calibration Scaffolding ✅ (138 tests)
- Analysis script: `scripts/analyze-shadow-mode.ts` — parses JSONL, computes false-positive rates, gate decision distribution, grounding quote breakdown, confidence distributions, per-sector stats. Outputs console report + `calibration-report.json`
- Self-audit eval runner: `tests/eval/self-audit-eval.ts`
- Extraction eval runner: `tests/eval/extraction-eval.ts`
- Golden corpus structure: `tests/eval/golden-extractions/`
- Calibration constants exported: `GROUNDING_QUOTE_FUZZY_THRESHOLD` (0.85) in `grounding-quote-check.ts`, `REQUIRED_MATERIAL_COVERAGE_THRESHOLD` (0.80) in `gate-evaluator.ts`
- Parse/extraction events carry document format + sector metadata
- Self-audit events carry raw classification counts + quote-candidate counts
- **Spec:** `Research/impl/Sprint-3-Implementation-Spec.md`
- **Status:** Code scaffolding complete. Live calibration run NOT done yet (requires LLM credentials + test documents).

### Sprint 3a: Synthetic Document Generator ✅ (tests passing)
- Deterministic document generator: `scripts/generate-scenarios.ts`
- 5 sector templates (healthcare, fintech, insurance, government, education) under `scripts/scenario-templates/`
- Each sector has 3 quality tiers: complete (400-800 words, documented disparities), partial (200-400 words), vague (80-200 words)
- Produces 15 markdown documents + `expected-outcomes.json` manifest
- Calibration runner: `scripts/run-calibration.sh` — generates docs, POSTs each to pipeline, runs fixtures ×2, runs analysis
- `--with-pdf` flag for PDF variant generation (currently broken — see below)
- **Spec:** `Research/impl/Sprint-3a-Implementation-Spec.md`

---

## Current Blocker

The document generator crashes on startup with `ERR_MODULE_NOT_FOUND` for `md-to-pdf`. The `md-to-pdf` import is supposed to be lazy (dynamic `await import()` inside `convertMarkdownToPdf()`, gated behind `options.withPdf`), but it's failing even without the `--with-pdf` flag. This needs to be fixed before the calibration run can proceed.

**Detailed fix instructions:** See `Research/impl/HANDOFF-run-calibration.md`

---

## What's Next (in order)

### Immediate: Fix Generator + Run Calibration
1. Fix the `md-to-pdf` import issue in `generate-scenarios.ts`
2. Run the generator: `npx tsx scripts/generate-scenarios.ts --output-dir ./data/synthetic-scenarios`
3. Start the pipeline API with Anthropic key
4. Run `./scripts/run-calibration.sh` (~27-32 assessments, ~30-40 min)
5. Review `calibration-report.json`
6. Run `npx tsx tests/eval/self-audit-eval.ts` and `npx tsx tests/eval/extraction-eval.ts`
7. Make threshold decisions based on data:
   - Grounding quote threshold (0.85): lower to 0.80 if false-positive rate >15%
   - Coverage threshold (0.80): lower to 0.70 if `GATE_LOW_COVERAGE` fires on >40% of assessments
8. Write `Research/impl/calibration-report.md` documenting decisions

### After Calibration: Phase 1A+ Spec (not yet written)
- Enable gate enforcement on Stage 2 (remove shadow_mode override)
- ReviewPackageStore + resume token generation (single-use, 24hr TTL, 256-bit entropy)
- Resume API endpoint: `POST /assessments/{id}/resume` (200/409/404/422)
- Post-override re-validation (re-run deterministic validators on human-revised artifacts)
- Downstream invalidation flow (material field override → mark downstream stages stale → re-run)
- Extend verification to Stages 1, 3, 5, 6
- Dashboard verification summary panel

### Phase 2 (future)
- Cross-model verification (Haiku extraction → Sonnet verification)
- Observatory UI with expandable stage panels
- Human review gate UI
- PostgreSQL event/finding stores (replace JSONL)
- SIEM-pattern playbooks

---

## Key Artifacts

### Architecture & Design (in `Research/`)

| File | What It Is |
|------|-----------|
| `pipeline-verification-spec-v0.3.md` | **The authoritative spec.** 793 lines, 2 rounds external review. Event envelope schema, lifecycle state machine, gate logic (8 hard-stops), grounding quote verification (two-pass), middleware architecture, review package schema, downstream invalidation. |
| `pipeline-verification-spec-v0.2.md` | Base schemas that v0.3 builds on. Contains complete PipelineEvent Zod schema (lines 80-288), EventSink/FindingStore interfaces (lines 818-838), Stage 2 reference implementation (lines 715-806). |
| `pipeline-verification-spec-v0.1.md` | First draft. Preserved for audit trail. |
| `AI-Risk-Tools-Deep-Dive-Analysis.md` | 7-part master analysis: product positioning, pipeline architecture, verification vision, competitive landscape, insurance vertical opportunity, prompt quality risk assessment. |

### Implementation Specs (in `Research/impl/`)

| File | What It Is |
|------|-----------|
| `Sprint-1-Implementation-Spec.md` | Shadow mode foundation. ✅ Implemented (89 tests). |
| `Sprint-2-Implementation-Spec.md` | Stage 2 verification POC. ✅ Implemented (134 tests). |
| `Sprint-3-Implementation-Spec.md` | Calibration scaffolding. ✅ Scaffolded (138 tests). Live run pending. |
| `Sprint-3a-Implementation-Spec.md` | Synthetic document generator. ✅ Implemented. Import bug pending fix. |
| `sprint-backlog.md` | Full roadmap: Sprints 1-3, Phase 1A+, Phase 2, non-verification backlog. |
| `HANDOFF-run-calibration.md` | Immediate task: fix generator and run calibration. |

### Reference Implementations (in `Research/impl/`)

These were starting-point files used during Sprint 1. The actual implementations in the repo may have diverged.

| File | What It Is |
|------|-----------|
| `verification-schemas.ts` | Complete Zod schemas (18 schemas). Adapted into `packages/shared-types/src/verification.ts`. |
| `event-sink.ts` | EventSink + FindingStore interfaces + JSONL backends. Adapted into `packages/pipeline-api/src/lib/event-sink.ts`. |
| `event-emitter-wiring.ts` | PipelineEventEmitter + orchestrator wiring example. Adapted into `packages/pipeline-api/src/lib/pipeline-event-emitter.ts`. |

### Project Context (in `docs/`)

| File | What It Is |
|------|-----------|
| `discover-brief.md` | v0.9 product brief. 6-step pipeline description, competitive landscape, pricing, open questions. |
| `test-protocol.md` | E2E test protocol. 6 test fixtures, 6-dimension scoring rubric (0-3 scale), pass/fail criteria, per-scenario expected outcomes. |

---

## Implementation Corrections from Specs

Codex made a few deviations from the specs during implementation. These are correct and intentional:

1. **Multipart field name:** The assessment upload route uses `file` (not `document` as the spec assumed). The calibration runner was updated to match.
2. **Gitignore:** Root `.gitignore` updated instead of `packages/pipeline-api/.gitignore` for synthetic scenario files.
3. **Test count progression:** 75 (pre-Sprint 1) → 89 (Sprint 1) → 134 (Sprint 2) → 138 (Sprint 3). Sprint 3a generator tests are separate.

---

## Decisions Made This Session

1. **Shadow mode first, enforcement later.** Capture baseline data before turning on gates. Prevents false positives from blocking real users on day one.
2. **Stage 2 (extraction) as the verification POC.** Extraction is the highest-value verification target — all downstream stages depend on it.
3. **Two-pass grounding quote verification.** Exact substring match first (fast, precise), then Jaccard token similarity fallback (handles LLM rephrasings). Threshold 0.85 pending calibration.
4. **JSONL backend for Phase 1.** Simple, append-only, debuggable. PostgreSQL deferred to Phase 2.
5. **Deterministic document generator (not LLM-powered).** Reproducible, fast, no API dependency. Template fragments, not generated text.
6. **Calibration target: ~32 assessments.** 15 synthetic markdown + 5 PDF variants + 6 fixtures × 2 runs. Statistically sufficient for threshold sensitivity analysis.
7. **No insurance vertical work in this sprint cycle.** Focus on verification pipeline only.
8. **Specs in markdown only.** User explicitly rejected .docx format for implementation specs.

---

## Non-Verification Backlog (tracked but not in scope)

- Insurance vertical data layer (P1 — December 2026 filing deadline)
- Prompt quality evaluation (P0 — existential risk, partially addressed by Sprint 3 eval suites)
- ISO 42001 crosswalk output (P2 — EU AI Act Aug 2026 deadline)
- Auth + multi-tenancy (P2 — required before external pilots)
- Database persistence (P2 — currently in-memory with 24hr TTL)
- Claude Remote Connector registration (P2)

Full backlog in `Research/impl/sprint-backlog.md`.
