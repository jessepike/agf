# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Agentic Governance Framework (AGF)** — a synthesis framework that integrates NIST AI RMF, OWASP, CSA, ISO/IEEE, OTel, EU AI Act, Singapore IMDA, and academic research into a unified reference architecture for governing agentic AI systems. This is a research/concept project, not a software codebase. There is no build system, test suite, or package manager. There is no git repository.

## Agent Roles

- **CPO** is the primary operator — owns product direction, content development, review cycles, backlog prioritization, and publication pipeline.
- **CTO** operates in advisory mode — architecture reviews, technology evaluations, cross-system integration, responsibility matrices.
- All sessions should read `BACKLOG.md` on startup to understand current priorities and what's been resolved.

## Session Protocol

- **Git is available** (remote: `github.com/jessepike/agf.git`). Commit meaningful milestones. Use conventional commits: `type(scope): description`.
- **No status.md.** Use `BACKLOG.md` as the live work queue. Use memory MCP (`write_memory`) for cross-session handoffs.
- **Check `inbox/` on session start.** If items exist, triage them: extract findings into BACKLOG.md or concept docs, then move processed files to `.archive/`.
- **Large files:** `agentic-primitives.md` is ~150KB (~1500 lines). Read selectively by section — use grep to find specific sections, don't attempt to read the whole file at once.

## Context Map

| File | Load When | Size | Why |
|------|-----------|------|-----|
| `intent.md` | **Always** | ~12KB | North Star, philosophy, principles, document hierarchy. Sacred — never edit without human approval. Ensures every session maintains alignment with project soul. |
| `BACKLOG.md` | **Always** | ~17KB | Live work queue, priorities, what's resolved vs. open. Single source of truth for session direction. |
| `strategic-positioning.md` | Writing/revising concept docs, processing review feedback, publication work | ~18KB | Landscape gaps, differentiators, market context. Ensures content maintains positioning discipline. |
| `agentic-governance-framework.md` | Working on framework-level structure, governance functions, lifecycle | ~38KB | Top-level operating model. Read when touching the umbrella, not for primitives-level work. |
| `agentic-primitives.md` | Working on primitives, security architecture, deployment modes, prior art | ~150KB | **Read selectively.** Grep for section headers. Never load whole file. |
| `agentic-observability.md` | Working on observability, event architecture, SIEM pattern | ~33KB | Capability layer. References primitives by number. |
| `decision-intelligence.md` | Working on decision systems, belief layer, RDG | ~25KB | Capability layer. References primitives by number. |
| `review-prompts/cross-review-synthesis.md` | Processing review findings, adding to backlog | varies | Synthesized findings from all external reviewers. |

## Architecture: How the Documents Relate

```
intent.md                          ← North Star. Sacred. Never edit without human approval.
    │
agentic-governance-framework.md    ← Top-level operating model (umbrella)
    │
    ├── agentic-primitives.md      ← Foundation layer: 19 primitives, Rings Model,
    │                                 security architecture, deployment modes, prior art
    │
    ├── decision-intelligence.md   ← Capability layer: governed decision flows,
    │                                 belief revision, Risk Decision Graph
    │
    └── agentic-observability.md   ← Capability layer: unified monitoring/detection/response,
                                      SIEM pattern for agentic systems

strategic-positioning.md           ← Market landscape, differentiators, gaps analysis
BACKLOG.md                         ← Prioritized work queue (P0 through Parking Lot)
```

**Precedence:** `intent.md` > `agentic-primitives.md` > `agentic-governance-framework.md` > capability layer docs > `strategic-positioning.md`

The primitives doc (`agentic-primitives.md`, ~160KB) is the most substantial artifact and the shared vocabulary all other docs reference.

## Key Concepts to Understand

- **Rings Model:** Concentric logical architecture — Ring 0 (Execution) → Ring 1 (Verification) → Ring 2 (Governance) → Ring 3 (Learning). Cross-cutting fabric connects them.
- **19 Primitives:** Named patterns (not invented) for governed agentic systems. Each maps to specific rings. #1-#17 are runtime, #18 is lifecycle, #19 is substrate.
- **Three-Level Security Model:** Security Fabric + Security Governance + Security Intelligence, with a Security Response Bus for fast-path containment.
- **Ring Deployment Modes:** Wrapper, middleware/interrupt, graph-embedded — with a selection matrix and hybrid patterns.
- **Composability Interface:** Standard contract (PASS/REVISE/HALT/GATE/ERROR signals) with execution budgets, delegation, and human interface requirements.
- **Confidence Levels:** Established pattern / Informed proposal / Open question — used throughout to mark certainty.
- **Synthesis positioning:** This framework connects dots from existing standards; it does not claim to invent new governance concepts.

## Directory Structure

| Path | Purpose |
|------|---------|
| `inbox/` | **Single triage queue.** Drop research, reviews, artifacts here. Agents review, extract findings, then move to `.archive/` or `research/archive/`. Check on session start. No other inbox locations. |
| `.archive/` | Processed inbox items. Moved here after triage — retained for reference, excluded from active work. |
| `diagrams/` | Architecture diagrams (PNG). Rings model, deployment modes, security model, environment stack, composition patterns. |
| `research/landscape/` | Active landscape research (standards, security frameworks, industry analysis) |
| `research/archive/` | Historical research, specs, vision docs, and processed external reviews. Subdirectories by review round (`round2-reviews/`). |
| `review-prompts/` | External review prompts (Opus, GPT, Gemini — 3 rounds). Review RESULTS go in `inbox/` for triage, then `research/archive/` after processing. |
| `data/` | SQLite memory DB (session context) |

## Working Conventions

### Document Editing
- **intent.md is sacred.** Never edit without explicit human approval.
- All concept docs are "living documents" — update timestamps when making substantive changes.
- Use confidence levels (Established/Informed proposal/Open question) when adding new claims.
- Lead with humility: "we synthesize, we don't decree." Position as building on prior art, not inventing.
- When adding prior art references, include specific document names, dates, and how they relate (not just that they exist).

### Review Process
- Two rounds of external review are complete (Opus, GPT 5.4, Gemini 3.1 Pro).
- Review results live in `review-prompts/`. Cross-review synthesis is in `cross-review-synthesis.md`.
- BACKLOG.md tracks all findings by priority. P0 structural decisions are resolved. P0.5 items are next.

### Backlog Management
- BACKLOG.md is the single source of truth for work queue.
- Items move from unchecked `- [ ]` to checked `- [x]` with a brief resolution note.
- New findings from reviews get added under the appropriate priority section.

### Cross-Reference Integrity
- Observability and Decision Intelligence docs reference the primitives by number (#1-#19). When primitives are added, renumbered, or restructured, these docs must be updated.
- Current count: 19 primitives (17 runtime + 1 lifecycle + 1 substrate). All downstream docs updated to 19.
- The framework doc (`agentic-governance-framework.md`) references the primitives doc for the Rings Model, security architecture, and deployment modes.

## Current State

See `BACKLOG.md` for the live work queue — it is always more current than this section. P0 structural decisions are all resolved. Active work is in P0.5 (Round 2 external review findings).

## Standards Referenced Throughout

| Standard | Primary Mapping |
|----------|----------------|
| NIST AI RMF (Govern/Map/Measure/Manage) | Rings Model, governance functions |
| OWASP Top 10 for Agentic Apps | Security architecture threat mapping |
| CSA Agentic Trust Framework / MAESTRO | Trust model, security domain mapping |
| ISO/IEC 42001 | Management system integration |
| OpenTelemetry GenAI Conventions | Observability event architecture |
| EU AI Act (Articles 6, 9-15, 50) | Regulatory compliance mapping |
| Singapore IMDA Agentic Governance | Government framework reference |
| MCP / A2A / AGNTCY (Linux Foundation AAIF) | Protocol governance |
