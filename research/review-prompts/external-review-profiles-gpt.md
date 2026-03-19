# External Review Prompt — Profile Suite — GPT (Deep Research)

**Target:** GPT 5.4 (deep research — regulatory accuracy, control crosswalk verification, prior art validation)
**Date:** 2026-03-18
**Documents:** Attach all 6 documents in this order:
1. `docs/agf-reference-architecture.md` (meta document — read first)
2. `profiles/security-profile.md`
3. `profiles/platform-profile.md`
4. `profiles/grc-profile.md`
5. `profiles/ai-engineering-profile.md`
6. `profiles/observability-profile.md`

**Context:** AGF (Agentic Governance Framework) is a synthesis framework for governed agentic systems. The core primitives document has been through 3 rounds of external review. These 5 domain profiles are first drafts (v0.1) that decompose the framework for different professional audiences. This review focuses on factual accuracy, regulatory precision, and competitive landscape validation.

---

## The Prompt

```
Conduct a deep research review of the attached AGF domain profile suite — 5 domain profiles plus a meta document that decompose a governance framework for agentic systems. The core framework has been reviewed in prior rounds. This review focuses on the PROFILES — specifically their factual accuracy, regulatory precision, and landscape positioning.

## Focus Area 1: GRC Profile — Regulatory Accuracy

The GRC Profile contains article-level EU AI Act mappings, NIST AI RMF function mappings, Singapore IMDA dimension mappings, CSA MAESTRO layer mappings, and a control crosswalk (AGF → NIST 800-53 Rev. 5 → ISO 27001:2022 → EU AI Act).

**Research questions:**

### EU AI Act
- For each article cited (Art. 6, 9, 10, 11, 12, 13, 14, 15, 50): is the requirement description accurate as of March 2026? The EU AI Act came into force in stages — are the cited articles currently in effect or still in transitional periods?
- Art. 12 includes a note that "specific minimum field requirements apply primarily to remote biometric identification." Is this accurate?
- The "What AGF does NOT cover" section lists Art. 43 (conformity assessment), Art. 62 (serious incident reporting). Are there other articles relevant to agentic systems that the profile should address but doesn't?

### NIST AI RMF
- The profile says AGF primitives are "agentic specializations of" NIST functions. Is this framing accurate? Does NIST itself describe its functions as extensible in this way?
- The NIST IR 8596 section says it "treats AI agents as actors." Verify this framing against the actual IR 8596 document.

### Singapore IMDA
- The profile says the IMDA MGF for Agentic AI was published "January 2026." Verify this date. Is this the correct publication date for the agentic-specific version (not the earlier Generative AI version from 2024)?
- The 4-dimension mapping (Risk Bounding, Accountability, Technical Controls, End-User Responsibility) — does this accurately represent the IMDA framework's structure?

### Control Crosswalk
- The crosswalk maps 15 AGF components to NIST 800-53 Rev. 5 controls, ISO 27001:2022 controls, and EU AI Act articles. For each row:
  - Are the NIST 800-53 control numbers and names correct?
  - Are the ISO 27001:2022 control numbers and names correct? (Note: ISO 27001:2022 uses the A.5-A.8 numbering from Annex A, not the older A.5-A.18 structure)
  - Is the EU AI Act column accurate?
- Are there NIST 800-53 or ISO 27001 controls that should be mapped but are missing?

### Risk Classification
- The GRC Profile introduces a 4-tier risk classification (Low, Medium, High, Critical) with a decision tree. Does this classification align with EU AI Act risk categories? The EU AI Act uses: unacceptable, high-risk, limited risk, minimal risk. Is the mapping between AGF's 4 tiers and the EU AI Act's categories clear and accurate?

## Focus Area 2: Security Profile — Threat Mapping Accuracy

The Security Profile maps all 10 OWASP Top 10 for Agentic Applications (ASI) threats and all 10 OWASP MCP Top 10 threats to AGF's defense architecture.

**Research questions:**

### OWASP ASI
- Are the 10 ASI threat names and descriptions accurate as of March 2026? Has OWASP updated, renamed, or reordered any of these since publication?
- For each ASI threat, the profile assigns an "Owner" (which security level and primitive is primarily responsible). Verify that these assignments are defensible — would a security architect agree?

### OWASP MCP Top 10
- The profile includes a note: "The OWASP MCP Top 10 is a living/beta taxonomy as of March 2026." Is this status accurate? Has the MCP Top 10 been promoted to a stable release?
- Are the 10 MCP threat names and descriptions accurate?
- The profile cites "53% of community MCP servers use insecure static API keys (Astrix Security research, 2025)." Verify this statistic and its source.

### Red Team Scenarios
- Scenario 1 describes a multi-agent lateral movement attack chain (ASI07→ASI03→ASI08). Is this attack chain technically plausible? Could it realistically cascade in under 3 seconds as claimed?
- Scenario 2 describes slow memory poisoning over weeks. Is this attack vector documented in the literature? Are there published examples or research demonstrating memory poisoning in agent systems?
- Scenario 3 describes trust ladder manipulation. Is trust gaming a recognized attack pattern in the agentic security literature?

## Focus Area 3: Observability Profile — Event Architecture and OTel Alignment

The Observability Profile defines a canonical event envelope, event taxonomy, and OTel integration approach.

**Research questions:**
- The event envelope includes fields for ring, deployment_mode, policy_reference, gate_type. How does this compare to OpenTelemetry's GenAI semantic conventions (v1.40.0+)? What fields does OTel cover natively vs. what AGF needs to extend?
- The profile describes OTel integration as "custom extension within OTel, not native semantic compatibility." Is this honest? Could AGF's governance semantics be proposed as OTel semantic convention extensions?
- Are there any existing observability products (LangSmith, Arize, Helicone, Fiddler, Galileo, Arthur AI, ServiceNow AI Control Tower) that have moved toward governance-aware observability since the framework was drafted? Has the competitive landscape shifted?

## Focus Area 4: Competitive Landscape Gaps

Across all profiles:
- Are there significant frameworks, products, or standards published between January-March 2026 that are NOT referenced in any profile and should be?
- Has any major cloud provider (AWS, Azure, GCP) published agentic governance guidance that the profiles should reference?
- Has any enterprise platform (ServiceNow, Salesforce, SAP) published agent governance features that change the competitive positioning?

## Output Format

1. **Regulatory Accuracy Scorecard** — per-article, per-standard accuracy (Accurate / Needs Correction / Unverified)
2. **Control Crosswalk Verification** — per-row accuracy of NIST 800-53 and ISO 27001 mappings
3. **OWASP Threat Mapping Verification** — ASI and MCP threat accuracy, assignment defensibility
4. **Red Team Scenario Plausibility** — per-scenario technical plausibility assessment
5. **OTel Alignment Assessment** — what's native, what needs extension, what's wrong
6. **Competitive Landscape Update** — new references to add, positioning shifts
7. **Factual Errors Found** — specific claims that are incorrect, with corrections
8. **Top 10 Accuracy Issues** — prioritized by severity
```
