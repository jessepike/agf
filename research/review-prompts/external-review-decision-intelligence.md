# External Review Prompt — Decision Intelligence Concept Doc

**Target:** Deep research reviewer (Claude Opus for adversarial + GPT or Gemini for fact-checking)
**Date:** 2026-03-18
**Document:** `docs/decision-intelligence.md` (attach full contents)
**Context:** First external review of the Decision Intelligence concept doc. The Agentic Primitives doc (foundation layer) has been through 3 review rounds. This doc describes a specific application of the primitives — governed decision flows for risk-bearing decisions. It includes the Risk Decision Graph, the Belief Layer, and a multi-agent decision pipeline.

---

## The Prompt

```
Conduct a deep research review of the attached Decision Intelligence concept document. This is a capability layer within the Agentic Governance Framework (AGF) — applying the framework's 19 primitives and Rings Model specifically to risk-bearing decision-making.

The document's core claim: current governance and risk tools are built for recordkeeping, not decision making. Decision Intelligence captures HOW decisions are made and WHY — not just what was decided — through structured, auditable, replayable artifacts.

## Review Dimensions

### 1. Belief Layer Novelty Assessment
The Belief Layer is presented as the most conceptually novel element. It separates claims (assertions), beliefs (governed stance toward assertions), and decisions (authorized outcomes).

- Is the claim/belief/decision separation genuinely novel in the context of AI governance? Or does prior art exist?
- How does this compare to: argumentation frameworks (IBIS, Toulmin), Bayesian belief networks, decision analysis frameworks (MCDA, AHP), deontic logic, legal reasoning systems?
- The revision cascade (evidence → claims → beliefs → policy tests → decisions → review trigger) — is this architecturally sound? Are there edge cases where it breaks?
- The belief states (unknown → under_review → plausible → provisionally_accepted → accepted, plus contested/insufficient_evidence/rejected/stale/superseded) — is this state machine complete? Are there missing transitions?

### 2. Risk Decision Graph Viability
The RDG is described as a "case-bound reasoning substrate" with 15 canonical node types.

- Is "case-bound first, cross-case intelligence later" the right design choice? What's the cost of this decision?
- Are 15 node types (Case, Entity, Claim, Counterclaim, Evidence, Belief, Method, PolicyTest, Score, Scenario, Simulation, DecisionOption, Decision, Approval, ReviewTrigger) the right decomposition? Are any redundant or missing?
- How does the RDG compare to existing decision graph approaches in the literature?
- Is the claim that "the provenance chain IS the product" defensible? Or is the product the decision quality, with provenance as evidence?

### 3. Multi-Agent Pipeline Architecture
9 agents across 3 rings. Orchestrated composition pattern.

- Is the agent decomposition (Intake, Entity Extraction, Evidence, Claim, Challenger, Belief Manager, Policy, Recommendation, Memo) defensible? Could any be merged? Should any be split?
- The Belief Manager operates at the Ring 0/Ring 1 boundary. Is this architecturally sound or is it a boundary violation?
- The Challenger Agent (Ring 1, adversarial mandate) — is the "structural mandate to find flaws" pattern validated in the literature for AI systems, or is it aspirational?

### 4. Competitive Landscape
- What products exist in the "governed decision-making" space as of March 2026?
- How does Decision Intelligence compare to: Palantir AIP decision workflows, IBM OpenPages AI governance, Archer IRM decision automation, ServiceNow GRC decision support?
- Is the "structured decision persistence" moat defensible, or are enterprise platforms converging on this?

### 5. Build Sequence Realism
5 phases from Assessment Pipeline through Portfolio Intelligence.

- Is "each phase should be funded by the previous phase's revenue or a funding event" realistic?
- Is the case type wedge strategy (AI governance → security architecture review → policy exception → vendor risk) the right sequence?
- What's the minimum viable product that would generate revenue?

### 6. What This Is NOT Assessment
The doc now includes positioning boundaries. Are they clear and defensible?

## Output Format
1. **Belief Layer Verdict** — genuinely novel / incremental / overclaimed, with prior art citations
2. **RDG Architecture Assessment** — sound / needs work / fundamental issues
3. **Multi-Agent Pipeline Review** — defensible / needs adjustment / over-engineered
4. **Competitive Landscape** — differentiated / crowded / already occupied
5. **Build Sequence Realism** — credible / optimistic / unrealistic
6. **Top 5 Issues** — prioritized for publication readiness
7. **The "Would I Build This?" Test** — if you were a CTO evaluating this as a product spec, what would you greenlight and what would you push back on?
```
