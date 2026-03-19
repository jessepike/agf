# External Review Prompt — Agentic Observability Concept Doc

**Target:** Deep research reviewer (GPT or Gemini)
**Date:** 2026-03-18
**Document:** `docs/agentic-observability.md` (attach full contents)
**Context:** This is the first external review of the Agentic Observability concept doc. The Agentic Primitives doc has been through 3 review rounds. The Observability Profile (a buyer-facing derivative) has been externally reviewed. This review focuses on the source concept doc — the deeper treatment that the profile draws from.

---

## The Prompt

```
Conduct a deep research review of the attached Agentic Observability concept document. This is a capability layer within the Agentic Governance Framework (AGF) — a synthesis framework for governed agentic systems with 19 primitives, a Rings Model, and a three-level security architecture.

The concept doc positions Agentic Observability as "the SIEM pattern applied to agentic workflows" — a unified monitoring, detection, and response layer covering quality, security, and governance compliance in a single event-driven architecture.

## Review Dimensions

### 1. SIEM Analogy Viability
- Is the SIEM analogy technically sound? Does the mapping from traditional SIEM concepts (event sources, correlation rules, playbooks, investigation) to agentic concepts hold under scrutiny?
- Where does the analogy break? What aspects of agentic observability don't map cleanly to SIEM patterns?
- Is there a better analogy or framing that would resonate more with the target audience (SREs, SOC analysts, detection engineers)?

### 2. Correlation Rule Completeness
- The doc defines 18 correlation rules across quality, security, and governance domains. Are these the right rules? What's missing?
- Are the rule patterns realistic — would they actually detect the threats and quality issues they claim to catch?
- How do these compare to correlation rules in production SIEM/SOAR systems? Are they at the right abstraction level?

### 3. Event Architecture Accuracy
- The event envelope schema includes identity context, action context, governance context, quality context, and correlation context. Is this schema complete for governed agentic systems?
- The event taxonomy classifies events by ring (execution, verification, governance, learning, security). Are there event types missing?
- The doc claims OTel-compatible base + governance extensions. Is this technically accurate? What would actual OTel integration look like?

### 4. Market Positioning
- The "What This Is NOT" section differentiates from LLM observability, APM, GRC, and traditional SIEM. Is this positioning defensible?
- Are there products or frameworks (published Jan-March 2026) that have moved into this space since the doc was written?
- ServiceNow AI Control Tower, Salesforce Einstein Trust Layer, AWS agent governance — have any of these evolved to cover "SIEM for agents"?

### 5. Maturity Model Realism
- The 5-level maturity model (Event Capture → Dashboards → Correlation → Automated Response → Predictive Governance). Is this progression realistic?
- Is the timeline estimate ("months to reach Level 3, 2-3 years for Level 4-5") calibrated correctly?
- How does this compare to actual SIEM maturity trajectories in enterprises?

### 6. Open Questions Assessment
- The doc lists open questions (event schema standardization, ingestion breadth vs depth, standalone vs layer, correlation rule authoring, relationship to DI, personal vs enterprise, privacy tension, pricing). Two are marked as resolved. Are the remaining open questions the right ones?

## Output Format
1. **SIEM Analogy Verdict** — holds / partially holds / breaks down
2. **Correlation Rule Assessment** — complete / gaps identified / fundamentally wrong
3. **Event Architecture Review** — per-field accuracy, missing fields, OTel alignment
4. **Market Position Check** — still differentiated / competitors closing / already occupied
5. **Maturity Model Calibration** — realistic / optimistic / pessimistic
6. **Top 5 Issues** — prioritized for publication readiness
7. **Overall Verdict** — ready for publication / needs iteration / needs fundamental rework
```
