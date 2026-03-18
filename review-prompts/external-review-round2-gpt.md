# External Review Prompt — Round 2 — GPT 5.4 Deep Research

**Target:** GPT 5.4 (deep research mode)
**Date:** 2026-03-17
**Document:** `agentic-primitives.md` (attach full contents)
**Context:** Round 2. Round 1 was a deep research review. The document has been significantly expanded based on Round 1 findings. GPT's Round 1 contributions were among the most impactful: Transaction/Side-Effect Control, deployment modes, minimum viable ring stack, and the "synthesis not invention" framing.

---

## Deep Research Prompt

```
Conduct a deep research review of the attached Agentic Primitives document — a reference architecture for governed agentic systems. This is Round 2; the document has been expanded from 14 to 18 primitives based on three independent Round 1 reviews.

The document positions itself as a synthesis framework integrating NIST AI RMF, OWASP Top 10 for Agentic Applications (2026), CSA Agentic Trust Framework, EU AI Act, OpenTelemetry GenAI conventions, MCP, A2A, and academic research (DeepMind, Anthropic, Berkeley CHAI, ICSE 2026).

## Research Tasks

### 1. Landscape Validation (March 2026)
Since the Round 1 research, the agentic governance landscape has continued evolving. Research and report on:

- **Any new standards, frameworks, or significant publications** since February 2026 that the document should reference or integrate
- **NIST AI Agent Standards Initiative** — any progress since the February 2026 RFI? New publications?
- **OWASP ASI** — any updates to the Top 10 for Agentic Applications since the February 2026 publication?
- **OpenTelemetry GenAI SIG** — any new semantic conventions relevant to agent governance?
- **Linux Foundation AAIF** — any progress on MCP/A2A governance standards?
- **Commercial landscape** — any new entrants in the agentic governance/security space?

### 2. Prior Art Mapping Audit
The document now includes a Prior Art Mapping section covering NIST AI RMF, EU AI Act, OWASP, CSA, OTel, MCP, and A2A.

- **Accuracy check:** Are the NIST AI RMF function mappings correct? Does MAP really map to risk classification? Does MANAGE really map to Trust Ladders + Bounded Agency?
- **EU AI Act specificity:** The Article 9-15 mapping — is it specific enough? Are there Articles being claimed that don't actually align? Are there relevant Articles missing (e.g., Article 6 classification, Article 52 transparency)?
- **Missing prior art:** What major frameworks, standards, or academic work should be referenced but isn't? Consider: Singapore ARC Framework, FAIR-AIR Playbook, METR evaluation methodology, UK AISI Inspect, ISO/IEC 42001, IEEE P2863.
- **"What We Add" claims:** For each prior art entry, the document claims what the framework adds beyond the standard. Are these claims defensible?

### 3. Security Architecture Research Validation
The document introduces a three-level security model (Security Fabric, Security Governance, Security Intelligence) with a Security Response Bus and OWASP/CSA threat mappings.

Research and evaluate:
- **Does the three-level decomposition align with how leading security architectures handle similar problems?** Compare to: defense-in-depth in NIST SP 800-53, CSA MAESTRO layers, MITRE D3FEND, and any new agent security architectures published since February 2026.
- **The Security Response Bus** — pre-authorized containment bypassing governance deliberation. Is there prior art for this pattern in traditional security (SOAR platforms, automated incident response)? Is the claimed sub-second response realistic?
- **Objective attestation** — cryptographic goal-state verification at ring boundaries. Is there any deployed system doing this? What are the technical feasibility constraints?

### 4. Round 1 Response Assessment
Your Round 1 identified these gaps. Assess whether they were addressed:

- **Transaction / Side-Effect Control** → Primitive #16 added
- **Evaluation & Assurance** → Primitive #18 added
- **Rings as deployment modes** → Three modes with selection matrix
- **REVISE(context) transaction semantics** → Idempotency, stale-approval, compensation added
- **Minimum viable ring stack** → Ring 0 + R1 + thin R2 + fabric + R3 advisory
- **Cross-system trust** → Federated trust, protocol identity, capability discovery
- **Position as synthesis framework** → Core Thesis rewrite
- **Identity + Bounded Agency + Provenance = minimum viable control** → Composition patterns updated

For each: adequate response, partial response, or inadequate response?

### 5. Implementation Feasibility
The document is a reference architecture, not an implementation spec. But:

- **Which parts are immediately implementable** with current technology (LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, Claude Code)?
- **Which parts require technology that doesn't exist yet?** (e.g., objective attestation, real-time semantic security evaluation, cross-system trust federation)
- **What is the realistic timeline** for the full architecture to be implementable?

### 6. Competitive Positioning
Given the current landscape (March 2026):

- **Who is closest to building something like this?** ServiceNow AI Control Tower? Salesforce Agentforce? Google Vertex AI Agent Builder?
- **Is the "integrator" positioning credible?** The document claims nobody else is pulling the standards together. Is that still true?
- **Market timing:** Is this framework ahead of the market, behind it, or right on time?

## Output Format

Structure your research report as:
1. **Landscape Update** — what's new since February 2026
2. **Prior Art Audit** — accuracy, gaps, defensibility of "What We Add" claims
3. **Security Architecture Validation** — research-backed assessment
4. **Round 1 Response Scorecard**
5. **Implementation Feasibility Matrix** — each major component rated
6. **Competitive Positioning Assessment**
7. **Top 5 Research-Backed Recommendations**
```
