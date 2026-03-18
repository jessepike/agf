# AI Risk Tools — Verification Layer Sprint Backlog

**Created:** March 14, 2026
**Source:** Deep dive analysis session — research review, verification architecture design, spec v0.3 (2 rounds external review)
**Spec Reference:** `pipeline-verification-spec-v0.3.md` (build-ready)
**Analysis Reference:** `AI-Risk-Tools-Deep-Dive-Analysis.md` (Parts 1-7)

---

## Sprint 1: Shadow Mode Foundation (1 week)

Goal: Wire structured event logging into the existing pipeline. No gate enforcement. Capture baseline data for threshold calibration.

| # | Task | Files | Spec §  | Est | Notes |
|---|------|-------|---------|-----|-------|
| 1.1 | Add verification Zod schemas to shared-types | `packages/shared-types/src/verification.ts` | §3, §4 | 2h | Use `impl/verification-schemas.ts` as starting point. Export from index.ts. Rebuild package. |
| 1.2 | Implement EventSink interface + JSON file backend | `packages/pipeline-api/src/lib/event-sink.ts` | §11 (v0.2 §7) | 2h | Use `impl/event-sink.ts`. JSONL per assessment. Append-only. |
| 1.3 | Implement FindingStore interface + JSON file backend | Same file as 1.2 | §11 (v0.2 §7) | 1h | Included in event-sink.ts. Same JSONL pattern. |
| 1.4 | Build PipelineEventEmitter helper | `packages/pipeline-api/src/lib/pipeline-event-emitter.ts` | §10.1 | 2h | Use `impl/event-emitter-wiring.ts`. Manages run context, sequence numbering, event construction. |
| 1.5 | Wire event emission into pipeline-orchestrator.ts | `packages/pipeline-api/src/services/pipeline-orchestrator.ts` | §10.1 | 3h | Add emitter.stageStart/stageComplete/gateDecision at each existing SSE emission point. Follow wiring example in impl file. |
| 1.6 | Add VERIFICATION_DATA_DIR env var + data directory | Config + `.gitignore` | — | 0.5h | Default `./data/verification`. Add to .gitignore (JSONL files contain assessment data). |
| 1.7 | Add PipelineLifecycleState tracking to orchestrator | `pipeline-orchestrator.ts` | §3 | 1h | Track state transitions (queued → running_stage → completed/error). No paused_review yet. |
| 1.8 | Write unit tests for EventSink + FindingStore | `packages/pipeline-api/tests/lib/event-sink.spec.ts` | — | 2h | Test: emit → flush → read roundtrip, JSONL format, filtering by assessment/stage/run. |
| 1.9 | Write unit tests for PipelineEventEmitter | `packages/pipeline-api/tests/lib/pipeline-event-emitter.spec.ts` | — | 1.5h | Test: sequence numbering, event structure validation against Zod schema, flush behavior. |
| 1.10 | Run 5 assessments through pipeline, inspect JSONL output | Manual | — | 1h | Smoke test: verify events are being written, structure looks correct, no data loss. |

**Sprint 1 total estimate: ~16 hours**

---

## Sprint 2: Stage 2 Verification Proof of Concept (1 week)

Goal: Build the three verification layers for the extraction stage. Gate evaluates but does NOT enforce (shadow mode continues). Capture verification data for threshold calibration.

| # | Task | Files | Spec § | Est | Notes |
|---|------|-------|--------|-----|-------|
| 2.1 | Define field criticality map for Stage 2 extraction | `packages/pipeline-api/src/services/extraction/field-criticality.ts` | §11 (v0.2 §6.1) | 1.5h | Map every AssessmentContext field to required_material / required_supporting / optional. |
| 2.2 | Implement deterministic validators for Stage 2 | `packages/pipeline-api/src/services/extraction/validators/` | §8, §9 | 4h | completeness_check (required fields present), schema_conformance (Zod re-validation), grounding_quote_exists (two-pass with Jaccard). |
| 2.3 | Implement two-pass grounding quote verification | Part of 2.2 | §9 | 2h | Pass 1: exact substring (normalized). Pass 2: Jaccard token similarity ≥0.85. Log match_type and similarity. |
| 2.4 | Implement Stage 2 self-audit layer | `packages/pipeline-api/src/services/extraction/self-audit.ts` | §11 (v0.2 §6.2) | 4h | LLM call to verify its own extraction. Must return structured EvidenceReference objects. Prompt needs golden test cases (build lightweight eval in Sprint 3). |
| 2.5 | Build VerificationCoordinator | `packages/pipeline-api/src/lib/verification-coordinator.ts` | §10 | 3h | Runs layers in order (deterministic → self-audit → cross-model[skipped]). Returns VerificationBundle. Does NOT emit events (orchestrator does). |
| 2.6 | Build GateEvaluator with hard-stop rules | `packages/pipeline-api/src/lib/gate-evaluator.ts` | §8 | 3h | Implement all v0.3 hard-stop rules. Returns GateResult. Does NOT emit events. |
| 2.7 | Wire VerificationCoordinator + GateEvaluator into orchestrator for Stage 2 only | `pipeline-orchestrator.ts` | §10 | 2h | After extraction completes, run verification, evaluate gate, emit events. Shadow mode: override gate decision to auto_proceed regardless. |
| 2.8 | Write tests for deterministic validators | `tests/services/extraction/validators.spec.ts` | — | 2h | Test against known-good and known-bad extractions from existing test fixtures. |
| 2.9 | Write tests for GateEvaluator | `tests/lib/gate-evaluator.spec.ts` | — | 2h | Test each hard-stop rule fires correctly. Test Tier 2 (proceed_with_flags) logic. |
| 2.10 | Run 10 assessments, analyze verification event data | Manual | — | 2h | First look at false-positive rates, which rules fire, confidence distribution. |

**Sprint 2 total estimate: ~25.5 hours**

---

## Sprint 3: Shadow Mode Calibration + Prompt Quality (1–2 weeks)

Goal: Run 30-50 assessments through the full verification layer. Analyze results. Calibrate thresholds. Begin systematic prompt evaluation.

| # | Task | Spec § | Est | Notes |
|---|------|--------|-----|-------|
| 3.1 | Run 30-50 assessments across 3+ document types/sectors | §12 | 8h | Use existing test fixtures + new documents. Healthcare, fintech, government, retail, insurance, vague docs. |
| 3.2 | Build analysis script for shadow mode data | — | 4h | Parse JSONL files. Compute: false-positive rate on grounding quote check, hard-stop fire frequency, confidence score distribution, per-stage breakdown. |
| 3.3 | Calibrate grounding quote fuzzy match threshold (currently 0.85 Jaccard) | §9, §12 | 2h | If false-positive rate > 15%, lower threshold. If false-negative rate > 5%, raise it. |
| 3.4 | Calibrate required material grounding coverage threshold (currently 80%) | §8.1 | 1h | Based on shadow data distribution. |
| 3.5 | Build self-audit prompt eval suite | §12 | 6h | 5-10 test documents with known-correct extractions. Expected grounding results. Score self-audit accuracy against ground truth. |
| 3.6 | Systematic extraction prompt evaluation | discover-brief.md OQ#7 | 8h | Ground-truth corpus from test fixtures. Score extraction quality across dimensions (completeness, accuracy, confidence calibration). This is the #1 pipeline quality risk. |
| 3.7 | Document calibration results and threshold decisions | — | 2h | Capture rationale for final threshold values. Feed back into spec. |

**Sprint 3 total estimate: ~31 hours**

---

## Phase 1A+: Post-Calibration Build (2–3 weeks)

Enable gate enforcement. Build human review flow. Extend verification to remaining stages.

| # | Task | Spec § | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | Enable gate enforcement on Stage 2 | §8 | P0 | Remove shadow_mode override. Gates now halt pipeline on needs_review. |
| 4.2 | Implement ReviewPackageStore + resume token generation | §6 | P0 | Required for needs_review to work. Single-use tokens, 24hr TTL, 256-bit entropy. |
| 4.3 | Implement resume API endpoint (POST /assessments/{id}/resume) | §6.3 | P0 | 200/409/404/422 responses. Optimistic concurrency via version field. |
| 4.4 | Implement post-override re-validation | §10.2 | P1 | Re-run deterministic validators on human-revised artifacts before resuming. |
| 4.5 | Implement downstream invalidation flow | §7 | P1 | Override on material/supporting field → mark downstream stages stale → re-run. |
| 4.6 | Extend deterministic validators to Stages 1, 3, 5, 6 | §11 (v0.2 §9) | P1 | Each stage needs stage-specific validators. Stage 4 (framework) is deterministic — may need minimal verification. |
| 4.7 | Extend self-audit to Stages 3, 5, 6 | §11 (v0.2 §9) | P1 | Stage-specific audit prompts. Stage 3 (regulatory) is highest value after extraction. |
| 4.8 | Add verification summary to dashboard UI (collapsed by default) | §11 (v0.2 §8) | P2 | AssessmentVerificationSummary rendered as expandable panel. Express mode default. |

---

## Phase 2: Observatory + Advanced Verification (4–6 weeks)

| # | Task | Spec § | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | Cross-model verification on Stages 2, 3, 5, 6 | v0.3 deferred | P1 | Same-vendor different-model (Haiku extraction → Sonnet verification). |
| 5.2 | Observatory UI with expandable stage panels | v0.3 §11 (v0.2 §8) | P1 | Full pipeline observatory view. Toggle between Express and Observatory mode. |
| 5.3 | Human review gate UI | §6 | P1 | Review package presentation, override editor, resume flow. |
| 5.4 | Trust-confidence ladder with empirical thresholds | v0.3 deferred | P2 | Low → Medium → High trust. Based on shadow mode + production data. |
| 5.5 | PostgreSQL event + finding stores | v0.3 deferred | P2 | Replace JSONL backend. Indexed queries. Retention policies. |
| 5.6 | Self-audit prompt eval suite (automated) | §12 | P2 | CI-integrated eval that runs on prompt changes. |
| 5.7 | Observatory analytics queries | — | P2 | Aggregate stats across assessments: quality trends, common failure modes, confidence distributions. |
| 5.8 | SIEM-pattern playbooks | Analysis doc §7.5 | P3 | Codified response procedures for common verification failure patterns. |

---

## Non-Verification Backlog (from session analysis)

These are opportunities identified in the deep dive analysis that are outside the verification workstream but should be tracked.

| # | Task | Source | Priority | Notes |
|---|------|--------|----------|-------|
| 6.1 | Insurance vertical data layer: NAIC bulletin section mapping, carrier-specific risk taxonomy, Colorado Reg 10-1-1 extraction templates | Analysis §5.2, insurance research | P1 | 2-4 week sprint. Strongest near-term market opportunity. ~1,200 regional carriers, December 1 filing deadline. |
| 6.2 | ISO 42001 crosswalk output | discover-brief.md Phase 1.5 | P2 | Reference data + prompt addition. Enables EU AI Act buyers (Aug 2026 deadline). |
| 6.3 | Resolve discover-brief.md open questions #16-18 | discover-brief.md | P1 | Deck versioning strategy, E2E test status confirmation, NIST data count discrepancy (35 vs actual). |
| 6.4 | Resolve OQ#7: Systematic prompt quality evaluation | discover-brief.md | P0 | Existential risk. Run in parallel with Sprint 3. Ground-truth corpus + scoring rubric. |
| 6.5 | Auth + multi-tenancy | discover-brief.md Phase 2 | P2 | Required before external pilot users. |
| 6.6 | Database persistence / saved assessments | discover-brief.md Phase 2 | P2 | Currently in-memory with 24hr TTL. |
| 6.7 | Claude Remote Connector registration | discover-brief.md Phase 1B | P2 | Minimal effort after 1A deployment. Two MCP tools. |
| 6.8 | DecisionOS platform architecture decision | Analysis §4 | P3 | 2-3 year vision. Not Phase 1. Decision point: when does pipeline graduate into platform? |

---

## Implementation Files Produced This Session

| File | Location | Purpose |
|------|----------|---------|
| `verification-schemas.ts` | `Research/impl/` | Complete Zod schemas for verification layer. Drop into `shared-types`. |
| `event-sink.ts` | `Research/impl/` | EventSink + FindingStore interfaces and JSON file backends. Drop into `pipeline-api/src/lib/`. |
| `event-emitter-wiring.ts` | `Research/impl/` | PipelineEventEmitter helper + full orchestrator wiring example. Drop into `pipeline-api/src/lib/`. |
| `pipeline-verification-spec-v0.3.md` | `Research/` | Build-ready specification (2 rounds external review). |
| `pipeline-verification-spec-v0.2.md` | `Research/` | Preserved for audit trail. |
| `pipeline-verification-spec-v0.1.md` | `Research/` | Preserved for audit trail. |
| `AI-Risk-Tools-Deep-Dive-Analysis.md` | `Research/` | Master analysis (7 parts) with verification architecture vision. |

---

## Sprint Sequence Recommendation

```
Sprint 1 (Week 1)     Shadow Mode Foundation — event logging wired in
    ↓
Sprint 2 (Week 2)     Stage 2 Verification POC — three layers, shadow enforcement
    ↓
Sprint 3 (Weeks 3-4)  Calibration + Prompt Quality — data-driven threshold tuning
    ↓                  ← DECISION POINT: Are thresholds stable? Is prompt quality acceptable?
Phase 1A+ (Weeks 5-7) Gate enforcement, human review flow, multi-stage rollout
    ↓
Phase 2 (Weeks 8-13)  Observatory UI, cross-model, PostgreSQL, SIEM playbooks
```

**Parallel workstream:** Insurance vertical data layer (Sprint 6.1) can run independently alongside Sprints 1-3. It shares no code dependencies with the verification layer.

**Critical path item:** Prompt quality evaluation (6.4) should start in Sprint 1 and run continuously. Verification catches problems after they happen — prompt quality prevents them.
