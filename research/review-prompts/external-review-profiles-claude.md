# External Review Prompt — Profile Suite — Claude Opus

**Target:** Claude Opus (adversarial review — positioning discipline, cross-profile coherence, audience targeting)
**Date:** 2026-03-18
**Documents:** Attach all 6 documents in this order:
1. `docs/agf-reference-architecture.md` (meta document — read first)
2. `profiles/security-profile.md`
3. `profiles/platform-profile.md`
4. `profiles/grc-profile.md`
5. `profiles/ai-engineering-profile.md`
6. `profiles/observability-profile.md`

**Context:** AGF (Agentic Governance Framework) is a synthesis framework for governed agentic systems. It integrates NIST AI RMF, OWASP, CSA, EU AI Act, OTel, and academic research into a composable reference architecture. The core framework (19 primitives, Rings Model, three-level security model, deployment modes) has been through 3 rounds of external review and is stable. These 5 domain profiles decompose the framework for different buyer personas. They are first drafts (v0.1). The meta document is the entry point that routes readers to the appropriate profile.

---

## The Prompt

```
You are an expert reviewer performing an adversarial review of a domain profile suite for a governance framework. The core framework (Agentic Primitives) has already been reviewed in 3 prior rounds. This review focuses on the PROFILES — how the framework is decomposed and presented to different professional audiences.

The Agentic Governance Framework (AGF) is a synthesis framework — it integrates existing standards (NIST, OWASP, CSA, ISO, OTel, EU AI Act, academic research) into a composable reference architecture for governed agentic systems. It positions itself as "named, not coined" — the contribution is the composition, not the individual patterns. The framework includes 19 primitives organized into the Rings Model (Execution → Verification → Governance → Learning) with a three-level security model and three deployment modes.

The 5 domain profiles decompose this framework for:
- **Security Profile** — CISOs, security architects, red teams
- **Platform Profile** — Platform engineers, infrastructure architects
- **GRC Profile** — Compliance officers, auditors, DPOs
- **AI Engineering Profile** — AI engineers, agent developers
- **Observability Profile** — SREs, SOC analysts, detection engineers

## Review Dimensions

### 1. Cross-Profile Coherence

The same concepts (Rings Model, primitives, security model, deployment modes) appear across multiple profiles from different angles. This creates coherence risk.

- **Consistency check:** Do the profiles describe the same architecture? Are there contradictions between how the Security Profile describes the three-level security model and how the Platform or Observability profiles reference it?
- **Boundary clarity:** Each profile declares a scope boundary (what belongs here vs. elsewhere). Are these boundaries clean? Is there material overlap where two profiles cover the same ground? Is there a gap where no profile covers something important?
- **Cross-reference integrity:** Profiles link to each other. Do the cross-references make sense? Would a reader following a link find what they expect?
- **Primitive coverage:** All 19 primitives should be reachable from at least one profile. Are any primitives orphaned — not covered meaningfully by any profile?

### 2. Audience Targeting

Each profile claims to serve a specific professional audience. Test whether each profile actually speaks to that audience.

- **Security Profile:** Would a CISO or security architect recognize this as their document? Does it think in threats, defenses, and risk posture — or does it read like a general architecture document with security vocabulary?
- **Platform Profile:** Would a platform engineer find this actionable for building infrastructure? Or is it too abstract — describing what should exist without enough detail on how to build it?
- **GRC Profile:** Would a compliance officer be able to hand this to an auditor? Are the regulatory mappings precise enough, or are they at the "we map to Art. 9" level without enough detail?
- **AI Engineering Profile:** Would an agent developer know what to implement next after reading this? Is the implementation priority ordering defensible? Would a practitioner agree with Phase 1 vs. Phase 5 placement?
- **Observability Profile:** Would an SRE recognize the event architecture as implementable? Is the correlation engine realistic — would these rules actually work in a production SIEM?

### 3. Positioning Discipline

The framework positions itself with humility: "we synthesize, we don't decree." Test whether the profiles maintain this positioning.

- Does any profile overclaim? Specific areas to probe:
  - The control crosswalks in the GRC Profile (AGF → NIST 800-53 → ISO 27001). Are these mappings defensible, or are some stretches?
  - The red team scenarios in the Security Profile. Are the "where AGF holds" assessments honest, or do they oversell the defense?
  - The implementation priority in the AI Engineering Profile. Is this ordering presented as a recommendation (appropriate) or as the only valid approach (overclaiming)?
  - The correlation rules in the Observability Profile. Are the thresholds (>15%, >25%, 2σ, etc.) justified, or are they made-up numbers presented with false precision?
- Does any profile drift from synthesis positioning toward "AGF invented this" territory?
- Are the "Known Limitations" and "What This Is NOT" sections honest, or do they feel defensive?

### 4. Meta Document as Entry Point

The meta document (`agf-reference-architecture.md`) routes readers to profiles.

- Does the meta document accurately describe what each profile contains?
- Would a reader — specifically, a CTO or VP of Engineering trying to figure out where to start — successfully navigate to the right profile?
- Does the meta document stand alone as a useful overview, or does it feel like a table of contents?
- The "For Business Owners and Executives" section — is it sufficient, or do executives need their own profile?

### 5. Publication Readiness

If these profiles were published as a white paper series:

- Which profile is closest to publication-ready? Why?
- Which profile needs the most work? What specifically?
- Is the 5-profile structure the right decomposition? Should any profiles be merged or split?
- What's missing from the suite entirely? Is there a professional audience that would look for AGF content and not find a profile that speaks to them?

## Output Format

1. **Cross-Profile Coherence** — contradictions found, boundary issues, orphaned primitives
2. **Audience Targeting Scorecard** — per-profile verdict (Speaks to Audience / Partially / Misses)
3. **Positioning Violations** — specific instances of overclaiming, with evidence
4. **Meta Document Assessment** — navigation effectiveness, standalone value
5. **Publication Readiness Ranking** — profiles ranked #1-5 with rationale
6. **Top 10 Issues** — prioritized by severity, specific enough to act on
7. **Overall Verdict** — is this profile suite a credible decomposition of a governance framework, or does it need fundamental restructuring?
```
