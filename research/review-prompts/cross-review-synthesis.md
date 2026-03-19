# Cross-Review Synthesis — Agentic Primitives

**Date:** 2026-03-16
**Reviews completed:** Claude Opus (adversarial), Gemini 3.1 Pro (deep research), GPT 5.4 (deep research)

---

## Convergence: Where All Three Reviewers Agree

These findings appeared independently across all three reviews. Highest-confidence gaps.

| Finding | Opus | Gemini | GPT | Priority |
|---------|------|--------|-----|----------|
| **No security/adversarial model** | Critical #1 | Critical | Critical #6 | **Address now** |
| **No data governance primitive** | Critical #2 | Mentioned | Critical #2 | **Address now** |
| **Sequential processing limitation** | Breaks for real-time | "Sequential bottleneck" | "Too pipeline-shaped" | **Address now** |
| **Git is implementation, not primitive** | Important | Critical | Important | **Reframe** |
| **Primitives are organized, not invented** | "Named, not invented" | "Reinventing under proprietary names" | "More synthesis than invention" | **Reframe** |
| **OTel / standards alignment needed** | Reference/differentiate | Adopt standards | Map via protocol appendix | **Reference** |
| **Fractal rings need termination** | Governance recursion | Deadlock scenario | Multi-agent cascade | **Add rule** |
| **Cost section too optimistic** | Not flagged | Understated | "Not safe general planning assumption" | **Expand** |

## Divergence: Where Reviewers Disagree

| Finding | Opus | Gemini | GPT | My Assessment |
|---------|------|--------|-----|---------------|
| **Validation Loops (#2)** | Durable as pattern | "Implementation detail" | Durable but limited for ambiguous tasks | Keep. Convergence-gated iteration with budgets is a design pattern, not a while loop. |
| **Structured Output (#5)** | Downgrade to requirement | Essential but standard | Durable (#5 in ranking) | Keep as primitive. GPT validates it. |
| **Trust Ladders (#11)** | Durable, best empirical backing | "Fundamentally flawed" | "Ladder framing too coarse — will evolve to richer risk scoring" | Keep but acknowledge it evolves into context-specific risk scoring. |
| **Self-Improving Cycles (#3)** | Least durable | "Vulnerable to subsuming" | Least durable (#14 in ranking) | All three agree it's weakest. Reframe or acknowledge limitation. |
| **Adversarial Critique (#4)** | Fragile — collapses into verification | Not directly flagged | "Tactic, not primitive — replaced by eval suites" | Two of three say it's a tactic. Consider reframing as a variation of #1 rather than standalone primitive. |
| **Framework scope** | Credible concept vision | "Theoretical brochure" | "Credible contribution if positioned as synthesis" | GPT has the right framing. Position as synthesis framework. |

## Unique Findings by Reviewer

### Opus only:
- Cross-ring iteration budget needed (Ring 0→1→2→0 oscillation)
- Tension 6 (Policy vs Self-Improvement) weakest resolution — config/policy boundary blurs
- Missing tensions: Observability vs Privacy, Multi-Agent Autonomy vs Global Coherence, Learning Speed vs Governance Stability, Explainability vs Capability
- Human interface requirements at gates (rubber-stamping, cognitive load, timeout)
- "Unknown unknown" problem — no ring architecture addresses a novel failure mode outside validation criteria

### Gemini only:
- DELEGATE/ESCALATE_TO_PEER signal missing from composability contract
- Determinism spectrum (LLM for understanding, deterministic for execution)
- Dynamic capability assessment — runtime evaluation of agent readiness before delegation
- Control plane vs data plane separation (some primitives are design-time, others runtime)

### GPT only:
- **Missing primitive: Transaction / Side-Effect Control** — pre-commit/commit/post-commit, reversibility, compensation, duplicate prevention, stale-approval invalidation. Distinct from error handling. Most operationally dangerous omission.
- **Missing primitive: Evaluation & Assurance** — pre-deployment testing, regression, simulation, adversarial testing, policy test harnesses. "Not follow-on work — it is core."
- **Rings as control planes, not mandatory wrappers** — three deployment modes: wrapper mode (staged processing), middleware/interrupt mode (coding agents, ops), graph-embedded control mode (streaming, swarms). Best answer to the sequential bottleneck.
- **REVISE(context) needs transaction semantics** — no blind re-execution after side effects, idempotency keys, stale-approval checks, compensation for partial execution, approval expiration on material context change
- **Identity + Bounded Agency + Provenance = minimum viable control foundation** — the cluster you need even if you have nothing else
- **Minimum viable ring stack** — Ring 0 + Ring 1 + thin Ring 2 + fabric + Ring 3 advisory only
- **Cross-system trust under-specified** — federated trust, protocol-level identity, capability discovery, cross-tenant delegation, policy translation across org boundaries
- **Position as synthesis framework** — "These are the enduring primitives" → "This is a synthesis framework combining enduring control concerns with current implementation patterns"

## Durability Consensus

All three reviewers ranked the 14 primitives. Here's where they converge:

**Consensus most durable (top 3-4 across all reviews):**
- Bounded Agency (#7) — all three rank #1 or #2
- Provenance Chains (#6) — all three rank top 4
- Identity & Attribution (#14) — Opus mid-tier, GPT #2, Gemini #5
- Event-Driven Observability (#10) — all three rank top 5

**Consensus least durable (bottom 3 across all reviews):**
- Self-Improving Cycles (#3) — all three rank bottom 3
- Adversarial Critique (#4) — Opus and GPT flag as tactic, not primitive
- Trust Ladders (#11) — GPT says "too coarse," Gemini says "flawed," Opus says "durable but conditional"

**The durable core cluster:** Bounded Agency + Identity + Provenance + Observability. This is the minimum viable control foundation.

---

## Top Actions (Prioritized)

### Structural decisions (make before next rewrite)
1. **Security dimension** — new ring, fabric, or both? Jess leaning toward security ring + fabric.
2. **Ring deployment modes** — adopt GPT's wrapper/middleware/graph-embedded framing to address sequential bottleneck.
3. **Framing** — position as synthesis framework, not novel architecture. All three agree.

### New primitives to add
4. **Transaction / Side-Effect Control** — GPT-only finding but most operationally dangerous gap
5. **Data Governance / Confidentiality** — all three flagged
6. **Security / Adversarial Robustness** — all three flagged
7. **Evaluation & Assurance** (pre-deployment) — GPT-only but valid

### Fixes to existing content
8. **Cross-ring iteration budget** — global execution budget
9. **REVISE(context) + transaction semantics** — idempotency, stale-approval, compensation
10. **Reframe git** — primitive is versioned auditable control-plane state, git is reference impl
11. **Governance collapse rule** — termination for fractal rings
12. **Prior art mapping** — NIST AI RMF, EU AI Act, OTel GenAI, MCP, A2A
13. **Missing tensions** — at minimum: Observability vs Privacy, Explainability vs Capability
14. **Cost section** — expand with real cost drivers, not just multipliers
15. **Minimum viable ring stack** — adopt GPT's concrete spec
