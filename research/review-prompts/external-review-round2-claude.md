# External Review Prompt — Round 2 — Claude Opus

**Target:** Claude Opus (adversarial review)
**Date:** 2026-03-17
**Document:** `agentic-primitives.md` (attach full contents)
**Context:** This is Round 2. Round 1 review is at `review-prompts/opus-review-round1.md`. The document has been significantly expanded based on Round 1 findings from three independent reviewers (Opus, Gemini, GPT).

---

## The Prompt

```
You are an expert reviewer performing a Round 2 adversarial review of a concept framework document. You reviewed Round 1 of this document previously. The document has been significantly expanded since your last review — from 14 to 18 primitives, with major new sections on security architecture, deployment modes, prior art mapping, and governance economics.

This is a synthesis framework — it integrates NIST AI RMF, OWASP Top 10 for Agentic Applications, CSA Agentic Trust Framework, EU AI Act, OpenTelemetry GenAI conventions, and academic research into a composable reference architecture. The document explicitly positions itself as "named, not coined" — the contribution is the composition, not the individual patterns.

Your job is to stress-test whether the Round 1 feedback was adequately addressed, and whether the expansion introduced new problems.

## What Changed Since Round 1

1. **Core Thesis reframed** as synthesis framework ("named, not coined")
2. **Security Architecture section** — three-level model (Security Fabric, Security Governance, Security Intelligence) with Security Response Bus, OWASP threat mapping, CSA domain mapping
3. **Ring Deployment Modes expanded** — three equal-citizen modes (wrapper, middleware/interrupt, graph-embedded) with selection matrix, governance/latency tension
4. **4 new primitives:** #15 Adversarial Robustness, #16 Transaction & Side-Effect Control, #17 Data Governance & Confidentiality, #18 Evaluation & Assurance
5. **Composability Interface expanded** — execution budgets, DELEGATE signal, REVISE(context) transaction semantics, human interface requirements at gates
6. **Multi-Agent Coordination expanded** — governance collapse rule, cross-system trust, cross-ring concern routing
7. **Cost of Governance expanded** — real cost drivers, minimum viable ring stack
8. **Prior Art Mapping** — NIST AI RMF, EU AI Act, OWASP, CSA, OTel GenAI, MCP, A2A
9. **Self-Improving Cycles (#3) limitation acknowledged** — honest statement that this is the most likely primitive to be subsumed

## Review Dimensions

### 1. Round 1 Response Assessment
Your Round 1 flagged these as critical:
- No security/adversarial model → Security Architecture added
- No data governance primitive → #17 added
- Cross-ring iteration budget needed → execution_budget added to composability interface
- Missing tensions (Observability vs Privacy, Explainability vs Capability, etc.)
- Human interface requirements at gates → section added

For each: Was the response adequate? Did it address the substance of your concern, or just the surface?

### 2. Security Architecture
The three-level security model (Fabric/Governance/Intelligence) was pressure-tested against all 10 OWASP ASI threats and all 5 CSA ATF domains. Four additions were made based on that pressure test: Security Response Bus, objective attestation, semantic evaluation interface, introspection authority.

- Does the three-level decomposition hold? Where does it break?
- Is the Security Response Bus (pre-authorized fast-path) architecturally sound, or does it create a governance bypass vulnerability?
- Is the OWASP threat mapping honest? Are any threats under-addressed?
- Is "objective attestation" (cryptographic goal-state verification at ring boundaries) feasible or aspirational?

### 3. Deployment Modes
Three modes (wrapper, middleware, graph-embedded) with a governance/latency tension and dynamic mode escalation.

- Does the governance/latency tradeoff analysis hold?
- Is the "hybrid deployment" pattern (middleware overall, graph-embedded subsections) practical?
- The document claims "wrapper mode is the special case, not the default." Is this correct for the current market?
- Does the mode selection matrix miss any important system characteristics?

### 4. New Primitives
- **#17 Data Governance:** Is this sufficiently distinct from #15 (Adversarial Robustness) and Ring 2 (Governance)?
- **#18 Evaluation & Assurance:** This primitive explicitly operates "outside the ring pipeline." Is this architecturally clean or does it create a special case that weakens the ring model?
- **#16 Transaction & Side-Effect Control:** The REVISE(context) transaction semantics (idempotency across revisions, stale-approval invalidation, compensation) — are these complete? What's missing?

### 5. Prior Art Mapping
- Is the NIST AI RMF mapping accurate and fair?
- Is the EU AI Act mapping specific enough to be useful?
- Does the OTel mapping correctly identify where the framework extends OTel vs. depends on it?
- Are there major prior art references missing?

### 6. Remaining Gaps
- What would a CISO reading this document flag as missing?
- What would a platform engineer trying to implement this flag as under-specified?
- What would a regulator reviewing this for EU AI Act compliance flag as insufficient?

### 7. Durability Re-Assessment
Given the expansion, re-rank the 18 primitives by durability. Which are strongest? Which are most vulnerable to obsolescence? Has the expansion changed your Round 1 durability assessment?

## Output Format

Structure your review as:
1. **Round 1 Response Scorecard** — each Round 1 item scored as FULLY ADDRESSED / PARTIALLY ADDRESSED / NOT ADDRESSED with brief rationale
2. **New Issues Introduced** — problems created by the expansion that didn't exist in Round 1
3. **Security Architecture Deep Dive** — dedicated section
4. **Deployment Modes Assessment**
5. **Durability Re-Ranking** — all 18 primitives
6. **Top 5 Remaining Gaps** — prioritized
7. **Overall Verdict** — is this ready for publication as a reference architecture?
```
