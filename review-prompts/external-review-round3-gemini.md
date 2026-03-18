# External Review Prompt — Round 3 — Gemini (Deep Research)

**Target:** Gemini 3.1 Pro (deep research — implementability and practitioner perspective)
**Date:** 2026-03-18
**Document:** `agentic-primitives.md` (attach full contents)
**Context:** This is Round 3. The document has been expanded from 18 to 19 primitives. Your Round 2 review flagged several items; this review assesses the responses and evaluates the new material from a practitioner/implementer perspective.

---

## The Prompt

```
Conduct a targeted deep research review of the attached Agentic Primitives document — a reference architecture for governed agentic systems. This is Round 3; the document has been revised based on your Round 2 findings.

This round focuses on THREE areas: (1) whether the document is implementable by a platform engineering team, (2) whether the new Primitive #19 (Agent Environment Governance) maps to real-world patterns practitioners already use, and (3) structural quality after three rounds of expansion.

## Focus Area 1: Implementability Assessment

The document has grown significantly — from 14 primitives in Round 1 to 19 primitives, plus Security Architecture, Agent Environment Architecture, 7 tensions, cost model, and extensive prior art mappings.

**Assessment questions:**
- If a platform engineering team at a Series B startup wanted to implement "governed agentic systems" using this document as a reference, could they? What would they struggle with?
- Which primitives are immediately actionable (clear enough to implement this week) vs. aspirational (require further specification before building)?
- The Mode Selection Matrix now has 10 rows. Is it usable as a decision tool, or has it become too complex?
- The OWASP responsibility matrix has 10 threats, each with an owner level, owner primitive, and supporting list. Is this actionable for a security team doing threat modeling?
- The composition patterns (Minimum Viable Control Foundation → Full Governed Agentic System) — do they provide a credible implementation roadmap, or do they feel like a taxonomy exercise?
- The cost model includes empirical benchmarks (Microsoft AGT 0.43s, Bifrost 11μs, Reflexion 50x tokens). Are these sufficient to make investment decisions, or are they cherry-picked reference points?

## Focus Area 2: Primitive #19 — Practitioner Validation

Primitive #19 (Agent Environment Governance) describes the governed composition, scoping, provisioning, and optimization of an agent's operating environment — context, instructions, tools, workspace, memory.

**Practitioner questions:**
- Does #19 map to work that real engineering teams are already doing? Specifically: teams building on Claude Code, Cursor, Devin, or similar coding agents — are they already doing "environment governance" informally (CLAUDE.md files, tool configurations, workspace scoping, instruction optimization)?
- Does the 5-layer Environment Stack (Identity/Policy → Instructions → Capabilities → Retrieved Context → Session State) match how practitioners think about their agent configurations?
- Does the Environment Optimization Loop (Observe → Identify → Propose → Validate → Deploy) describe a real workflow, or is it an idealized model that no one actually runs?
- The trust boundary between L2 (human-authored, trusted) and L3 (runtime-composed, untrusted) — is this a real security boundary that practitioners respect, or is the line blurrier in practice?
- Does #19's "context as attack surface" framing (tool poisoning, context injection, memory poisoning, environment drift) describe real threats that practitioners worry about today?

## Focus Area 3: Structural Quality After 3 Rounds

Three rounds of expansion create structural debt. The document is now ~200KB and ~1,750 lines.

**Quality questions:**
- Is the document still coherent as a single artifact, or has it become too large? Should it be split?
- Are there sections that repeat information from other sections? (Redundancy check)
- Does the Table of Contents accurately reflect the document's actual structure?
- Is the Prior Art Mapping section (which now includes Standards Bodies, Government Frameworks, Security Frameworks, Academic Research, Industry Architecture References, Observability Standards, Protocol Standards, and Evaluation Frameworks) well-organized or sprawling?
- The document has 7 tensions, 5 known limitations, and 8+ open questions. Is this an honest accounting of uncertainty, or has the document become defensive (anticipating every critique)?
- After 3 rounds, does the document still maintain its synthesis positioning ("we connect dots"), or has it drifted toward claiming more originality than it has?

## Round 2 Response Spot-Check

Your Round 2 review specifically flagged:
- Missing prior art (Singapore IMDA, NIST IR 8596, CSA MAESTRO mapping, OWASP MCP)
- MCP as de facto middleware standard — needs integration
- Cost model needs empirical grounding
- Mode selection matrix needs additional criteria

For each: Was the response adequate? Did it address substance or just surface?

## Output Format

1. **Implementability Verdict** — Can a real team use this? What's the gap?
2. **#19 Practitioner Validation** — Does this match reality?
3. **Structural Quality** — Coherent or sprawling?
4. **Round 2 Response Scorecard** — FULLY / PARTIALLY / NOT ADDRESSED per item
5. **The "Would I Use This?" Test** — If you were a Head of AI Engineering at a company deploying agents, would you reference this document? What would make you more likely to?
6. **Top 5 Recommendations** — What would make this document 2x more useful?
```
