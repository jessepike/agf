# Cross-Model Coordination: Opus ↔ Codex Workflow

**Project:** AI Risk Tools — Verification Layer
**Updated:** March 16, 2026

---

## Workflow Model

```
Opus 4.6 (1M context)          Codex 5.4
┌─────────────────────┐        ┌─────────────────────┐
│ Thinks, designs,    │        │ Implements from      │
│ specs, reviews,     │ ──────>│ specs. Pure code.    │
│ calibration runs,   │        │ No design decisions. │
│ threshold decisions │ <──────│ Returns branch.      │
└─────────────────────┘        └─────────────────────┘
        │                              │
        │   Shared state (repo)        │
        ▼                              ▼
   status.md              Sprint-N-Codex-Spec.md
   calibration-report.md  COORDINATION.md (this file)
   sprint-backlog.md      HANDOFF-*.md (per-task context)
```

## Handoff Protocol

### Opus → Codex (spec handoff)
1. Spec goes in `Research/impl/Sprint-N-Codex-Spec.md`
2. Spec contains: exact file paths, before/after code blocks, "What NOT to Do" section per task
3. All design decisions are made IN the spec — Codex never decides, only implements
4. Branch name specified in spec header
5. Validation commands specified (test, typecheck)

### Codex → Opus (implementation handoff)
1. Codex creates branch, commits, pushes
2. Opus reviews diff, runs tests, merges to main
3. If Codex work requires calibration/LLM calls, Opus runs them manually
4. Results feed into next sprint spec

### What each model owns

| Concern | Owner | Why |
|---------|-------|-----|
| Architecture decisions | Opus | Needs full context, trade-off reasoning |
| Threshold values | Opus | Data-driven decisions from calibration |
| Prompt text content | Opus (via spec) | Prompt engineering requires iterative evaluation |
| Code structure/patterns | Codex (within spec) | Codex is better at consistent code generation |
| Test implementation | Codex | Mechanical, well-defined |
| Calibration runs | Opus (manual) | Requires live LLM calls + analysis |
| Eval interpretation | Opus | Judgment calls on quality |

## Sprint Execution Order

```
Sprint 4: Quality Tuning          ← Codex implements, Opus merges
    ↓
Sprint 5: Confidence + Infra      ← Codex implements, Opus merges
    ↓
Re-calibration Run                 ← Opus runs manually (requires LLM key)
    ↓
Go/No-Go Decision                  ← Opus evaluates calibration data
    ↓
Sprint 6: Gate Enforcement         ← Codex implements (ONLY if calibration passes)
```

## Current Sprint Status

| Sprint | Status | Spec | Notes |
|--------|--------|------|-------|
| 1 | DONE | `completed/Sprint-1-Implementation-Spec.md` | Shadow mode foundation. 89 tests. |
| 2 | DONE | `completed/Sprint-2-Implementation-Spec.md` | Stage 2 verification POC. 134 tests. |
| 3 | DONE | `completed/Sprint-3-Implementation-Spec.md` | Calibration scaffolding. 138 tests. |
| 3a | DONE | `Sprint-3a-Implementation-Spec.md` | Synthetic generator + calibration run. 150 tests. |
| 4 | READY | `Sprint-4-Codex-Spec.md` | Quality tuning. No blockers. |
| 5 | READY | `Sprint-5-Codex-Spec.md` | Confidence recal. Depends on Sprint 4. |
| 6 | BLOCKED | `Sprint-6-Codex-Spec.md` | Gate enforcement. Blocked on re-calibration. |

## Key Metrics to Track Across Sprints

These numbers come from calibration runs. Updated by Opus after each run.

| Metric | Sprint 3a (baseline) | Target (Sprint 6 go/no-go) |
|--------|---------------------|---------------------------|
| GATE_CRIT_MATERIAL rate | 55.2% | < 25% |
| GATE_QUOTE_FABRICATED rate | 51.7% | < 30% |
| GATE_LOW_COVERAGE rate | 31.0% | < 15% |
| Self-audit accuracy | 0.79 | > 0.80 |
| Extraction weighted score | 0.88 | > 0.85 |
| Confidence mean | 0.25 | > 0.60 |
| Tests passing | 150 | 150+ |
