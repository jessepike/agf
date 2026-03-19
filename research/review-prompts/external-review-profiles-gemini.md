# External Review Prompt — Profile Suite — Gemini (Deep Research)

**Target:** Gemini 3.1 Pro (deep research — practitioner usability, implementability, "would I use this?" test)
**Date:** 2026-03-18
**Documents:** Attach all 6 documents in this order:
1. `docs/agf-reference-architecture.md` (meta document — read first)
2. `profiles/security-profile.md`
3. `profiles/platform-profile.md`
4. `profiles/grc-profile.md`
5. `profiles/ai-engineering-profile.md`
6. `profiles/observability-profile.md`

**Context:** AGF (Agentic Governance Framework) is a synthesis framework for governed agentic systems. The core primitives document has been through 3 rounds of external review and is stable. These 5 domain profiles are first drafts (v0.1) that decompose the framework for different professional audiences. This review focuses on whether real practitioners in each audience would actually use these profiles.

---

## The Prompt

```
Conduct a deep research review of the attached AGF domain profile suite — 5 domain profiles plus a meta document for a governance framework for agentic systems. The core framework has been reviewed in prior rounds. This review focuses on PRACTITIONER USABILITY — would real people in each target audience actually use these documents?

## Focus Area 1: The "Would I Use This?" Test

For each profile, answer from the perspective of a specific practitioner:

### Security Profile → You are a CISO at a mid-market company (500-2000 employees) deploying coding agents and customer-facing chatbots.
- Would you hand this to your security team and say "use this for threat modeling our agent deployments"?
- Are the OWASP ASI threat-by-threat analyses actionable, or do they need more specificity (e.g., specific tool names, specific attack code, specific detection signatures)?
- The red team scenarios — would your red team find these useful as starting points? What's missing?
- The Security Assessment Checklist — could your team actually work through this? How long would it take? Is it a useful assessment tool or a compliance checkbox that nobody would fill out honestly?
- The incident response playbook structure (8 playbooks) — would your SOC adopt these, or are they too generic? What would they need to be production-ready?

### Platform Profile → You are a Head of Platform Engineering building agent infrastructure for your organization.
- Would you use the Mode Selection Matrix to choose a deployment topology? Or would you have already decided based on your system type before reading it?
- The Composability Interface (signal protocol, execution budgets, REVISE semantics) — is this a useful spec that your team could implement against? Or is it too abstract?
- The Agent Environment Stack (5 layers, trust boundary, composition patterns) — does this match how your team thinks about agent configuration? Or is it an academic model that doesn't map to how things work in practice?
- The MCP Integration Patterns section — does it add value beyond what the MCP specification itself provides? What's the unique governance perspective?
- The Infrastructure Checklist — would you use this to validate your platform? What's missing?

### GRC Profile → You are a Head of Compliance preparing for EU AI Act obligations for your organization's agent deployments.
- Would you hand this to your legal team and external auditor as evidence of a governance framework?
- The EU AI Act article mappings — are they precise enough for a compliance assessment? Or would a lawyer say "this is directional but not specific enough"?
- The control crosswalks (AGF → NIST 800-53 → ISO 27001) — would your ISO 27001 auditor accept these mappings? Are they too loose?
- The governance maturity model — would you use this for a board presentation on "where we are and where we're going"? Is Level 1-5 the right granularity?
- The risk classification decision tree — would you use this to classify your agent systems? What's missing for a real classification exercise?

### AI Engineering Profile → You are a Senior AI Engineer building governed agent pipelines.
- Would you use the 5-phase implementation priority to plan your team's roadmap? Is the ordering defensible?
- The primitive catalog (19 entries) — is it useful as a reference during implementation? Or is it too summary to be actionable and too long to be a quick reference?
- The composition patterns — do they describe how you'd actually build systems? Or are they theoretical groupings?
- The tensions section — would you reference this during architectural debates? Are the invariants useful design constraints?
- Trust Ladders — does the calibration signal table match how you'd actually implement trust scoring?

### Observability Profile → You are an SRE running agent systems in production.
- Would you use the event envelope schema as a starting point for your telemetry? What would you change?
- The correlation rules (15 rules across 3 domains) — are the thresholds realistic? Would you tune these differently?
- The dual-speed detection (sentinels + analysis) — does this match how your team thinks about real-time vs. batch detection?
- The observability maturity model — is it helpful for planning your observability roadmap? Is the progression realistic?
- The Known Limitations (privacy tension, event volume, baseline cold start) — do these match the operational challenges you'd actually face?

## Focus Area 2: Cross-Profile Navigation

Imagine a VP of Engineering at a company deploying agentic systems. They need to understand AGF and route the right content to the right teams.

- Starting from the meta document: can they successfully navigate to the right profile for each team?
- If they read only the meta document, do they understand enough to make a go/no-go decision on adopting AGF?
- How long would it take a busy VP to read the meta document? Is it the right length?
- Is the "For Business Owners and Executives" section sufficient, or does it feel like an afterthought?

## Focus Area 3: What's Missing

Across the entire profile suite:

- Is there a practitioner persona that would look for AGF content and NOT find a profile that speaks to them? (Consider: product managers, ML engineers focused on model training, data engineers, legal counsel specifically, procurement teams evaluating AI vendors)
- For each profile, what is the single most important thing that's missing — the thing that would make a practitioner say "oh, now I can actually use this"?
- Are there practical artifacts that should exist but don't? (e.g., templates, reference implementations, starter configs, evaluation rubrics, decision frameworks beyond what's already there)

## Focus Area 4: Structural Quality

- Is 5 profiles the right number? Should any be merged (e.g., Security + Observability)? Should any be split?
- Is the profile length appropriate for each audience? (Security and Observability audiences may prefer longer, more detailed documents. Executive audiences may prefer shorter.)
- Do the checklists at the end of each profile add value, or do they feel like appendices that nobody will use?
- The profiles all follow the same structure: Who This Is For → Challenge → Core Content → Primitives Reference → Checklist. Is this consistency helpful or monotonous?

## Output Format

1. **"Would I Use This?" Scorecard** — per-profile verdict (Yes, would use / Useful reference but gaps / Too abstract to use / No) with specific reasoning
2. **Navigation Assessment** — can a VP route content to teams effectively?
3. **Missing Personas** — who's left out?
4. **Per-Profile #1 Gap** — the single most impactful thing missing from each
5. **Structural Recommendations** — merge/split/length/format suggestions
6. **Top 10 Usability Issues** — prioritized by impact on adoption
7. **Overall Verdict** — would a Head of AI Engineering at a company deploying agents recommend this profile suite to their organization? What would tip the decision?
```
