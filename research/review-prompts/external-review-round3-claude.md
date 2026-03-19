# External Review Prompt — Round 3 — Claude Opus

**Target:** Claude Opus (adversarial review — #19 novelty and integration coherence)
**Date:** 2026-03-18
**Document:** `agentic-primitives.md` (attach full contents)
**Context:** This is Round 3. Rounds 1-2 reviews are complete. The document has been expanded from 18 to 19 primitives with a new "substrate primitive" (#19: Agent Environment Governance) and significant revisions to prior art mappings, security architecture, and deployment modes.

---

## The Prompt

```
You are an expert reviewer performing a Round 3 targeted review of a concept framework document. You have reviewed two previous rounds of this document. This round is NOT a full-document review — it is focused on specific changes made since Round 2.

This is a synthesis framework for governed agentic systems — it integrates NIST AI RMF, OWASP, CSA, EU AI Act, OTel, and academic research into a composable reference architecture. The document positions itself as "named, not coined" — the contribution is the composition, not the individual patterns.

## What Changed Since Round 2

1. **Primitive #19 added: Agent Environment Governance** — a "substrate primitive" governing the agent's operating environment (context composition, instruction architecture, capability provisioning, workspace scoping, session state management, environment optimization loop). Includes a full architectural companion section (Agent Environment Architecture) with a 5-layer environment stack, 3 composition patterns, optimization loop, context-as-attack-surface mapping, and recursive governance resolution.

2. **Taxonomy expanded to three categories:** runtime primitives (#1-#17), lifecycle primitive (#18), substrate primitive (#19).

3. **Tension 7 added:** Environment Optimization vs. Governance Integrity — with an optimizable/inviolable split.

4. **16 Round 2 review findings resolved**, including:
   - Prior art enriched (IMDA 4-dimension mapping, NIST IR 8596 3 focus areas, CSA MAESTRO 7-layer primitive mapping, OWASP MCP Top 10 threat mapping)
   - MCP integrated into Middleware deployment mode + Security Architecture
   - OWASP responsibility matrix restructured with single owner per threat + boundary clarification (#15/#17/Fabric/Ring 2)
   - NIST NCCoE identity protocols (SPIFFE/SPIRE, OAuth 2.1, NGAC) integrated into Identity #14
   - Human oversight 51.7% limit elevated to Core Thesis as architectural constraint
   - Speculative execution formal bounds added (Informed proposal)
   - Intelligence integrity added as Known Limitation #5

## Review Dimensions

### 1. Primitive #19 — Novelty Assessment

The document claims that existing work (Anthropic context engineering, AgentOS, LangChain, Microsoft MAR, NVIDIA OpenShell) treats the agent operating environment as an engineering/infrastructure concern, and that AGF is the first to treat it as a governance concern.

- **Is this claim accurate?** Is there prior work that treats context composition, instruction architecture, or capability provisioning as a governed, auditable artifact rather than just a performance optimization?
- **Is the primitive well-bounded?** Does #19 have clear, defensible boundaries with #7 (Bounded Agency), #12 (Memory-Augmented Reasoning), #9 (Policy as Code), and #15 (Adversarial Robustness)?
- **Is the "substrate primitive" taxonomy justified?** Is this genuinely a different category from runtime and lifecycle primitives, or is it a forced distinction to avoid the "design-time mixed with runtime" problem that reviewers flagged for #18?
- **Does the 5-layer environment stack hold?** Are the layers distinct? Is the trust boundary between L2 (human-authored) and L3 (runtime-composed) architecturally sound?
- **Is the recursive governance resolution complete?** The document claims the recursion terminates at "human-authored root configuration." Does this hold, or is there a bootstrap problem?

### 2. Primitive #19 — Integration Coherence

- Does #19 create any contradictions with existing primitives?
- The document added #19 to the Cross-Cutting Fabric section, Ring Diagram, OWASP matrix, MAESTRO mapping, and composition patterns. **Are these integrations consistent?** Does #19 appear where it should and not where it shouldn't?
- The Environment Optimization Loop is described as "Ring 3 applied to the substrate." Does this create any tension with Ring 3's existing scope (learning applied to pipeline outputs)?
- **Is #19 truly a primitive?** Or is it a higher-order concern that should be an architectural section (like Security Architecture) rather than a numbered primitive?

### 3. Round 2 Response Assessment

Your Round 2 review flagged these items in the "Important — To Address in Next Iteration" category. For each that was addressed, assess: was the response adequate?

- Missing prior art (Singapore IMDA, NIST IR 8596, OWASP MCP, AGNTCY/AAIF, etc.)
- MCP integration into deployment modes
- Responsibility assignment matrix
- Human oversight 51.7% limit treatment
- Speculative execution bounds
- Intelligence integrity limitation

### 4. Positioning Discipline

- Did the addition of #19 introduce any overclaiming? The document says "What this primitive adds is the governance perspective" — does it maintain synthesis positioning?
- Did the 51.7% elevation to Core Thesis cross from "honest architectural constraint" into "overstating the evidence"?
- Are the speculative execution bounds (labeled "Informed proposal") appropriately hedged?

### 5. Remaining Gaps

After all changes:
- What would you flag as the top 3 remaining gaps for publication readiness?
- Is #19's prior art mapping complete, or are there significant academic/industry references missing?
- Does the document now have any structural debt from 3 rounds of expansion?

## Output Format

Structure your review as:
1. **#19 Novelty Verdict** — genuinely new contribution, incremental addition, or overclaimed?
2. **#19 Integration Assessment** — clean, minor issues, or significant problems?
3. **Round 2 Response Scorecard** — each item scored FULLY / PARTIALLY / NOT ADDRESSED
4. **Positioning Discipline** — clean or violations detected?
5. **Top 5 Remaining Gaps** — prioritized for publication readiness
6. **Durability Assessment for #19** — where does it rank relative to #1-#18?
7. **Overall Verdict** — is the document closer to or further from publication readiness vs. Round 2?
```
