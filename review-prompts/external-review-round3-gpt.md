# External Review Prompt — Round 3 — GPT (Deep Research)

**Target:** GPT 5.4 (deep research — security architecture coherence and prior art validation)
**Date:** 2026-03-18
**Document:** `agentic-primitives.md` (attach full contents)
**Context:** This is Round 3. The document has been expanded from 18 to 19 primitives. Major revisions to security architecture, prior art mappings, and deployment modes since your Round 2 review.

---

## The Prompt

```
Conduct a targeted deep research review of the attached Agentic Primitives document — a reference architecture for governed agentic systems. This is Round 3; the document has been revised based on your Round 2 findings and expanded with a new primitive (#19: Agent Environment Governance).

This round focuses on THREE areas: (1) security architecture coherence after the OWASP responsibility matrix restructuring and MCP integration, (2) prior art accuracy after significant enrichment, and (3) the new Agent Environment Governance primitive's landscape positioning.

## Focus Area 1: Security Architecture Coherence

The OWASP threat mapping table has been restructured with a RACI-style ownership model — each threat now has exactly one owning security level and one owning primitive, with supporting levels/primitives for defense-in-depth. A boundary clarification was added: #15 = external threat surface, #17 = internal data lifecycle, Governance = policy authority, Fabric = enforcement mechanism.

Additionally, MCP has been integrated as a first-class concern: middleware deployment mode includes MCP as canonical implementation with 4 governance concerns (dynamic tool discovery, server trust chain, context-as-attack-surface, session isolation); Security Architecture includes MCP-specific supply chain trust enforcement; and the OWASP MCP Top 10 threats have been mapped to specific primitives.

**Research questions:**
- Is the single-owner OWASP responsibility assignment defensible? For each of the 10 ASI threats, verify that the assigned owning level and owning primitive are the most appropriate choices.
- Is the #15/#17/Fabric/Ring 2 boundary clarification accurate and complete? Are there edge cases where ownership is ambiguous?
- Is the MCP integration technically accurate? Does the document correctly describe MCP's security model, the 53% static key statistic, tool poisoning vectors, and the OWASP MCP Top 10?
- Has the document correctly integrated #19 (Agent Environment Governance) as a supporting primitive for ASI01 (Goal Hijack), ASI04 (Supply Chain), and ASI06 (Memory Poisoning)?
- The document now includes the OWASP MCP Top 10 mapped to primitives. Verify: are these 10 categories accurate as of March 2026? Has OWASP updated or revised the MCP Top 10 since the document was written?

## Focus Area 2: Prior Art Accuracy

The prior art section has been significantly enriched:
- **IMDA** — 4 governance dimensions mapped to primitives, SAFE concept noted
- **NIST IR 8596** — 3 focus areas mapped to security architecture, "agents as actors" framing
- **CSA MAESTRO** — 7-layer primitive mapping table with cross-layer analysis
- **NIST AI RMF** — "agentic specializations of" language for all 4 functions
- **NIST NCCoE** — SPIFFE/SPIRE, OAuth 2.1, NGAC integrated into Identity #14
- **EU AI Act** — Articles 6, 9-15, 50 with specific legal hooks
- **New for #19:** AgentOS (arXiv, Feb 2026), Anthropic context engineering, LangChain, Microsoft MAR, NVIDIA OpenShell, Google ADK

**Research questions:**
- Verify the IMDA framework's 4 dimensions as described. Does the document accurately represent Singapore's framework?
- Verify the NIST IR 8596 three focus areas. Are "Securing AI Systems," "AI-Enabled Cyber Defense," and "Thwarting AI-Enabled Attacks" accurately described?
- Verify the MAESTRO 7-layer names and descriptions match the actual CSA MAESTRO framework.
- For each EU AI Act article cited: is the requirement description accurate? Are there any mischaracterizations of what the articles require?
- Verify that AgentOS (arXiv Feb 2026) actually proposes the architecture described (L1/L2/L3 memory hierarchy, semantic paging, cognitive drift, sync pulses). Does the paper exist? Is the description accurate?
- Are there any significant prior art references published between Jan-March 2026 that are NOT in the document and should be?

## Focus Area 3: Agent Environment Governance Landscape

Primitive #19 claims that existing work treats the agent operating environment as an engineering concern, and that AGF is the first to treat it as a governance concern.

**Research questions:**
- Search for any published framework, standard, or paper (as of March 2026) that explicitly treats context composition, instruction architecture, or agent environment configuration as a governed, auditable artifact. If found, the document's novelty claim needs revision.
- How does #19 compare to NVIDIA OpenShell's policy engine (per-binary, per-endpoint, per-method control)? Is OpenShell closer to "governance" than the document acknowledges?
- How does #19 compare to Microsoft Agent 365's "control plane for agents"? Does Microsoft's framing include governance of the agent environment?
- How does #19 compare to Teradata Enterprise AgentStack's AgentOps governance component?
- Is the AgentOS paper the strongest academic reference for #19, or are there better ones?

## Output Format

1. **Security Architecture Coherence** — per-threat verification of the responsibility matrix, MCP integration accuracy, #19 supporting role assessment
2. **Prior Art Accuracy** — per-source verification with corrections needed (if any)
3. **#19 Landscape Assessment** — novelty claim verdict, missing references, competitive positioning accuracy
4. **Factual Errors Found** — specific claims that are incorrect, with corrections
5. **Top 5 Remaining Gaps** — what would you flag as missing for a definitive reference architecture?
```
