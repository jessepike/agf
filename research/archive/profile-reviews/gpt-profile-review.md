# AGF Domain Profile Suite Deep Research Review for Factual Accuracy, Regulatory Precision, and Landscape Positioning

This review evaluates the *domain profiles* (GRC, Security, Observability, Platform, AI Engineering) and the meta/reference architecture document in the attached AGF suite (local files under `/mnt/data/`). The review date context is **March 18, 2026 (America/Los_Angeles)**.

Primary verification sources were: official EU AI Act implementation guidance from the entity["organization","European Commission","eu executive body"], primary NIST publications, OWASP primary project pages and PDFs, IMDA primary publication PDFs, OpenTelemetry semantic conventions documentation, and vendor/platform documentation where available. citeturn0search32turn3view1turn20view0turn6view0turn10view0turn9view1turn15search0

## Regulatory Accuracy Scorecard

### EU AI Act article mappings in the GRC Profile

The GRC Profile’s EU AI Act table (in `/mnt/data/grc-profile.md`) correctly targets the core **high-risk AI system requirements** cluster (Articles 9–15) and the **transparency obligations** (Article 50). The main accuracy risk is not “what these articles require,” but **when they become applicable** (staggered applicability) and that Article 50 is **under-scoped**. citeturn0search32

**Applicability reality check as of March 18, 2026:** the AI Act entered into force in 2024 and is **phased in**; the entity["organization","European Commission","eu executive body"] states that **(a)** prohibitions/definitions/AI literacy have applied since **2 Feb 2025**, **(b)** governance rules and **general-purpose AI obligations** have applied since **2 Aug 2025**, and **(c)** **high-risk AI system obligations** apply later (not yet as of March 2026). citeturn0search32turn0search36

**Per-article scorecard (GRC Profile vs. March 2026 reality)**

| EU AI Act article cited in GRC Profile | Requirement description accuracy (as written in `/mnt/data/grc-profile.md`) | Is it applicable as of 2026-03-18? | Notes / required correction |
|---|---|---|---|
| Art. 6 (high-risk classification) | Needs Correction | Transitional | Accurate *topic* (classification), but the profile should explicitly state it is in a phased regime and that high-risk obligations applying to Annex III uses start later; also clarify that classification is a legal test, not a “risk tier” choice. citeturn0search32turn1search2 |
| Art. 9 (risk management system) | Accurate | Transitional | Requirement framing matches the Act’s lifecycle risk management expectation. Add “not yet applicable” timing context and link to post-market monitoring linkage. citeturn1search3turn0search32 |
| Art. 10 (data governance) | Accurate | Transitional | Conceptually correct; profile should avoid implying this is only about “training data,” because the Act’s data governance expectations are broader (quality/representativeness, etc.). citeturn1search4turn0search32 |
| Art. 11 (technical documentation) | Accurate | Transitional | Correct linkage to Annex IV-style documentation expectations; note applicability timing. citeturn1search5turn0search32 |
| Art. 12 (record-keeping/logs) | Accurate | Transitional | Correct mapping to logs/record-keeping; add explicit timing and retention/field detail distinctions. citeturn0search1turn0search32 |
| Art. 13 (transparency to deployers/users) | Accurate | Transitional | Correct at a high level; profile should separate **provider-to-deployer “instructions for use”** style transparency from **public-facing “interacting with AI”** transparency (Art. 50). citeturn0search32 |
| Art. 14 (human oversight) | Accurate | Transitional | Correct mapping; add clarity that human oversight is an *obligation design requirement*, not a guarantee of human reviewing every output. citeturn0search32 |
| Art. 15 (accuracy/robustness/cybersecurity) | Accurate | Transitional | Correct mapping target. Strengthen by explicitly tying to security testing/monitoring and incident-handling expectations. citeturn0search32 |
| Art. 50 (transparency obligations) | Needs Correction | Transitional | The profile’s summary (“users informed they are interacting with AI”) is incomplete: Art. 50 also addresses disclosure/labelling for certain AI-generated content (e.g., deepfakes) and transparency duties around emotion recognition/biometric categorisation depending on the use case. citeturn0search6turn0search32 |

### Art. 12 “minimum field requirements apply primarily to remote biometric identification”

The claim in the question matches how official EU guidance is commonly summarized: **Art. 12 is a general high-risk logging requirement**, and **more granular log content expectations are particularly emphasized for remote biometric identification** in EU-facing summaries and guidance. citeturn0search1turn0search23  
Verdict: **Accurate**, but the GRC Profile should cite this nuance as “stronger/specificer obligations for certain biometric use cases” rather than implying logging details are *only* about biometrics.

### “What AGF does NOT cover” omissions in the EU AI Act mapping

The GRC Profile flags Art. 43 (conformity assessment) and Art. 62 (serious incident reporting) as out of scope (per `/mnt/data/grc-profile.md`). That framing is directionally reasonable for a runtime governance/evidence layer, but it is incomplete for “agentic systems” positioning because the AI Act ecosystem obligations that often matter operationally to agentic deployments include:

- **Governance + GPAI obligations** (already applicable since **2 Aug 2025**) that affect organizations building on foundation models and system providers. citeturn0search32  
- **Provider/deployer role obligations** (beyond the engineering requirements), which can become differentiators for “agent governance” claims.
- **Post-market monitoring system requirements** and **database/registration** obligations for high-risk, which AGF can support with evidence even if it doesn’t “perform” the legal process.

Because this review did not re-open the full legal text article-by-article (Eur-Lex access was blocked in-session), these are flagged as **high-likelihood missing coverage areas** rather than fully enumerated omissions. citeturn0search32turn0search36

### NIST AI RMF framing in the GRC Profile

**Claim in `/mnt/data/grc-profile.md`:** “AGF primitives are agentic specializations of NIST AI RMF functions.”

- **What NIST actually says:** the AI RMF functions can be applied flexibly “as best suits” the user; and **profiles** are implementations of AI RMF functions/categories/subcategories for a specific setting. citeturn3view1  
- **Verdict:** **Mostly accurate, but Needs Correction in phrasing.** “Agentic specialization” is a defensible *AGF interpretation* of how to build an AI RMF profile; it is not NIST’s wording. The GRC Profile should say “AGF is an AI RMF-style profile for agentic systems” rather than “specialization of NIST functions,” to avoid implying NIST endorsement.

### NIST IR 8596 “treats AI agents as actors”

The GRC Profile claims IR 8596 treats agents as “actors.” In the IR 8596 preliminary draft, NIST includes agent-centric security considerations such as giving each AI agent a unique identity/credentials and treating them with privileged-user-level precautions. citeturn4view0turn4view3  
- **Verdict:** **Substance is supported; wording Needs Correction.** The document treats agents as security-relevant entities, but “actors” appears to be an interpretive paraphrase rather than NIST terminology.

### Singapore IMDA publication date and 4-dimension structure

The IMDA Model AI Governance Framework for Agentic AI (Version 1.0) shows publication context in January 2026 and explicitly defines **four areas**: assess/bound risks, human accountability, technical controls/processes, end-user responsibility. citeturn6view0turn5search0  
- **Verdict:** **Accurate** (date and structure).

## Control Crosswalk Verification

This section verifies the GRC Profile’s “AGF → NIST 800-53 Rev. 5 → ISO 27001:2022 → EU AI Act” crosswalk table in `/mnt/data/grc-profile.md`.

### Verification of control identifiers and names

**NIST SP 800-53 Rev. 5 control catalog** is the authoritative source for control IDs and names. citeturn20view0turn22view0turn21view2turn22view3

**ISO/IEC 27001:2022 Annex A control numbering** is the A.5–A.8 structure; lists and mappings reflecting the 2022 control set are widely published by ISO ecosystem bodies and practitioners. citeturn23search17turn23search11turn23search12

**Per-row verification outcome (IDs/names, not “semantic correctness”):**

| Crosswalk row (AGF component) | NIST 800-53 control IDs correct? | NIST control names correct? | ISO 27001:2022 control IDs correct? | ISO control names correct? | EU AI Act column accuracy (high level) |
|---|---|---|---|---|---|
| #1 Separation of Producer/Verifier | Yes | Yes (CA-7, SI-4) | Yes | Yes | Mostly accurate (maps to robustness/accuracy expectations), but “Accuracy” alone is narrower than Art. 15 scope. citeturn22view0turn0search32 |
| #6 Provenance Chains | Yes | Needs Correction (AU-6 is abbreviated; full name includes “Analysis, and Reporting”) | Yes | Yes | Reasonable mapping to technical documentation + logs. citeturn21view2turn0search32 |
| #7 Bounded Agency | Yes | Yes | Yes | Mostly | ISO A.5.15 and A.8.2 are correct; keep naming consistent with Annex A capitalization. citeturn22view3turn23search17 |
| #8 Governance Gates | Yes | Yes | Yes | Yes | Reasonable mapping to human oversight design obligations, but clarify “gates” are AGF implementation, not an AI Act requirement artifact. citeturn0search32 |
| #9 Policy as Code | Yes | Yes | Yes | Yes | Plausible as an implementation of systematic risk management. citeturn0search32 |
| #10 Event-Driven Observability | Yes | Yes | Yes | Yes | Good mapping to record-keeping/logging, but add retention/accountability notes. citeturn0search1turn0search32 |
| #11 Trust Ladders | Yes | Yes | Yes | Yes | “Art. 9 risk management” is plausible; ensure this does not conflict with EU risk category terms. citeturn0search32turn25view0 |
| #14 Identity & Attribution | Yes | Yes | Yes | Yes | Needs Correction: Art. 50 is broader than “inform about interaction”; see Regulatory Scorecard. citeturn0search6turn0search32 |
| #15 Adversarial Robustness | Yes | Mostly | Yes | Yes | Appropriate but should explicitly cover cybersecurity dimension of Art. 15 (not just robustness). citeturn0search32 |
| #16 Transaction & Side-Effect Control | Yes | Yes | Yes | Yes | Might be better tied to human oversight + risk management in addition to Art. 15; current Art. 15-only mapping is arguably too narrow. citeturn0search32 |
| #17 Data Governance | Yes | Yes | Yes | Yes | Correct target (Art. 10); referencing GDPR is reasonable context but should not be treated as an “AI Act mapping.” citeturn0search32 |
| #18 Evaluation & Assurance | Yes | Yes | Yes | Needs Correction (A.8.8 should consistently be “Management of technical vulnerabilities,” not “Technical vulnerabilities”) | Reasonable tie to Art. 15 evidence generation (testing). citeturn23search17turn0search32 |
| #19 Agent Environment Governance | Yes | Yes | Yes | Yes | IMDA dimension reference is plausible; ensure EU AI Act mapping isn’t implied here if not stated. citeturn6view0 |
| Security Fabric | Yes | Yes | Yes | Needs Correction (A.8.20 is typically “Network security,” not “Networks Security”) | Reasonable for cybersecurity dimension. citeturn23search17turn0search32 |
| Security Response Bus | Yes | Yes | Yes | Mostly | ISO A.5.24 naming is often longer (planning & preparation). Minor, but fix for audit precision. citeturn23search17turn20view0 |

### Missing control opportunities (crosswalk completeness)

The crosswalk is intentionally compact (15 rows), but if it is positioned as audit-grade, two gaps stand out:

- **NIST 800-53:** additional controls commonly expected for agent runtime governance evidence include deeper audit protection/retention (AU family), supply chain risk management (SR family), and stronger configuration integrity controls (CM family) beyond what’s already listed. citeturn20view0  
- **ISO 27001:2022:** if the suite claims governance-grade observability, consider mapping more explicitly to controls around logging protection/analysis and event handling beyond the minimal set already cited (the 2022 Annex A control set is larger and more granular). citeturn23search17

## OWASP Threat Mapping Verification

### OWASP ASI threat names and descriptions (accuracy as of March 2026)

OWASP’s “Top 10 for Agentic Applications 2026” (published Dec 2025) lists and defines the ten ASI categories, including: Agent Goal Hijack; Tool Misuse and Exploitation; Identity and Privilege Abuse; Agentic Supply Chain Vulnerabilities; Unexpected Code Execution (RCE); Memory & Context Poisoning; Insecure Inter-Agent Communication; Cascading Failures; Human-Agent Trust Exploitation; Rogue Agents. citeturn10view0turn14view1  

**Verdict:** the Security Profile’s ASI category names and ordering (in `/mnt/data/security-profile.md`) appear aligned to the OWASP 2026 document.

### Defensibility of “Owner” assignments

Because “Owner” is an architectural judgment, the right test is whether a security architect would agree the chosen “primary owner” is defensible (even if not exclusive). Using OWASP’s taxonomy as the baseline, the AGF assignments in `/mnt/data/security-profile.md` are generally defensible **if** the profile clearly defines “Owner” as “primary control plane accountable for prevention” (not “only accountable team/primitive”).

The highest-risk owner ambiguities:

- **ASI01 Agent Goal Hijack:** primary owner can plausibly be “governance gates / bounded agency” as much as “adversarial robustness,” because preventing goal hijack is as much about **policy enforcement at execution time** as it is about robustness testing. OWASP emphasizes runtime validation and “intent gate” style controls. citeturn14view2turn14view3  
- **ASI06 Memory & Context Poisoning:** primary ownership is usually split between **data governance**, **retrieval/memory controls**, and **monitoring**. If AGF assigns this mostly to one primitive, it should explicitly state the supporting controls that must also exist (e.g., memory compartmentalization + provenance + anomaly detection). citeturn13view0turn10view0  
- **ASI09 Human-Agent Trust Exploitation:** this is fundamentally a socio-technical control problem (UX confirmations, oversight gating, explainability, approval workflows). Assigning it purely “security” misses the human factors OWASP calls out. citeturn14view1

### OWASP MCP Top 10 status and naming precision

The OWASP MCP Top 10 page explicitly describes itself as a **living document** and shows roadmap phases indicating it is currently in a **beta release** stage. citeturn9view1turn8search4  
**Verdict:** the Security Profile’s “living/beta taxonomy as of March 2026” note is **accurate**.

However, **category naming drift is visible even within OWASP materials** (e.g., “MCP06 Intent Flow Subversion” appears in the Top 10 list, while OWASP’s detail section references contextual prompt injection naming). citeturn9view1turn8search1  
**Verdict:** the Security Profile’s MCP table should pin to **a named version** (e.g., OWASP MCP Top 10 v0.1) and adopt the **Top-10-list canonical labels** to avoid audit disputes.

### Verification of the “53% insecure static API keys” statistic

The statistic is supported by Astrix research: “Over half (53%) rely on static API keys or Personal Access Tokens (PATs)…” in a 2025 MCP server security research write-up. citeturn11search0turn11search4  
**Verdict:** **Accurate**, but the Security Profile should carry the methodological qualifier: this was based on analysis of thousands of open-source MCP server implementations and may not represent enterprise-internal deployments.

## Red Team Scenario Plausibility

This section evaluates the three scenarios in `/mnt/data/security-profile.md` as *technical narratives*.

### Scenario 1 multi-agent lateral movement chain (ASI07 → ASI03 → ASI08) and “<3 seconds” execution speed

- **Chain plausibility:** The category chain is logically coherent: insecure inter-agent communication can enable identity/privilege abuse and lead to cascading failures under automation. OWASP’s ASI definitions explicitly cover forged inter-agent messages/trust, identity/privilege problems, and cascades as distinct but composable risk types. citeturn10view0turn14view1  
- **Timing claim plausibility (<3 seconds):** The scenario’s own timeline uses sub-second steps (e.g., T+0.2s, T+0.5s, T+0.8s, T+1.5s). This is plausible **if** (a) the system uses fast tool communications and cached/planned actions, and/or (b) the “lateral move” is dominated by message passing and policy evaluation rather than full LLM inference steps. It is less plausible if each hop requires fresh LLM calls with typical internet-latency API round trips.  
**Verdict:** **Technically plausible, but should be qualified** with assumptions about orchestration and inference latency.

### Scenario 2 slow memory poisoning over weeks (ASI06)

There is substantial support in the literature for persistent poisoning of memory/retrieval substrates in LLM-agent systems:

- Research explicitly frames “memory poisoning attacks” as intentional injection of malicious/misleading records into an agent’s long-term memory so future retrievals return incorrect information, including multi-step “bridging” interactions and stealth tactics. citeturn13view0  
- OWASP’s ASI06 category is explicitly “Memory & Context Poisoning,” establishing this as a mainstream, recognized agentic threat class. citeturn10view0  

**Verdict:** **Plausible and documented**.

### Scenario 3 trust ladder manipulation (ASI09 + ASI02)

OWASP’s ASI09 definition describes exploitation of user trust via authority bias/persuasive explainability and over-reliance on autonomous recommendations, especially when confirmation steps are missing. citeturn14view1  
**Verdict:** **Plausible and aligned to OWASP’s trust exploitation framing**, even if “trust ladder manipulation” is AGF’s internal term.

The key improvement needed is operational specificity: define the measurable trust signals being gamed (approval rates, gate relaxation thresholds, false “good behavior” metrics) and show how monitoring detects strategic manipulation distinct from genuine good performance.

## OTel Alignment Assessment

This section evaluates `/mnt/data/observability-profile.md` against OpenTelemetry GenAI semantic conventions (v1.40.0+ context).

### What OpenTelemetry covers natively vs. what AGF must extend

OpenTelemetry’s GenAI semantic conventions define spans/attributes/events for inference, agent operations, and (increasingly) tool/MCP-related telemetry. citeturn15search2turn15search5turn15search11  

**Native / near-native matches (AGF → OTel):**
- **Model identity, provider, operation name, usage/latency:** covered via GenAI spans/attributes/metrics. citeturn15search2turn15search4turn15search6  
- **Agent identity (name/version):** GenAI agent span conventions include agent naming/version attributes. citeturn15search5turn15search1  
- **Tool calls and MCP telemetry:** evidence of MCP-focused semantic convention work exists in semconv packages and project docs (including dedicated MCP conventions). citeturn15search11turn15search8  

**AGF fields that are governance-specific and require extension:**
- `ring`, `deployment_mode`, `policy_reference`, `gate_type` (explicitly listed in the AGF event envelope). These are not standard GenAI semantic fields today and would need custom attributes and/or a proposed semantic extension. citeturn15search0turn15search2  

### Is “custom extension within OTel, not native semantic compatibility” honest?

As written in `/mnt/data/observability-profile.md`, the statement is directionally honest: governance semantics are **not** universally standardized in OTel. But it is incomplete in two ways:

1. **OTel already provides substantial native compatibility for GenAI tracing**, including agent spans and tool-calls, so AGF should describe itself as “OTel-compatible base + governance extensions,” not “not compatible.” citeturn15search2turn15search5  
2. OTel GenAI conventions are still marked as **Development** (not stable), which makes “native semantic compatibility” a moving target; AGF should treat this as versioned interoperability work. citeturn15search0turn15search1  

### Could AGF governance semantics be proposed as OTel semantic convention extensions?

Yes, in principle: OpenTelemetry semantic conventions evolve via community proposals and working group adoption; the current GenAI work has demonstrated active iteration (agent attributes, tool capture improvements, MCP conventions). citeturn15search1turn15search11  
Practical recommendation: start by mapping AGF’s envelope to **existing** GenAI attributes and add a clear “AGF governance extension namespace” for ring/gate semantics, then pursue standardization only for the widely reusable pieces (policy decision events, gate outcomes, evidence/provenance pointers).

## Competitive Landscape Update

### New or newly-relevant frameworks and standards Jan–Mar 2026 not reflected strongly in the profiles

High-impact additions for the profiles’ reference set:

- A NIST NCCoE concept paper on **software and AI agent identity and authorization** (public comment period Feb–Apr 2026) explicitly scopes agentic architectures, MCP, OAuth/OIDC, SPIFFE/SPIRE, auditing, and non-repudiation. This is directly relevant to AGF Identity & Attribution, audit evidence, and MCP governance claims. citeturn19view0turn18search1  
- NIST’s AI agent standards initiative announcement (Feb 2026) signals accelerating standardization around agent interoperability/security (important to “landscape positioning”). citeturn2search21  
- IMDA’s Model AI Governance Framework for Agentic AI (Jan 2026) is a major global reference point and validates the “four areas” governance decomposition that overlaps with AGF. citeturn6view0turn5search0  
- OpenTelemetry’s accelerating GenAI + MCP semantic convention work in semconv releases and language packages (v1.40.0) changes what “canonical agent telemetry” means in 2026. citeturn15search1turn15search11  

### Cloud provider agent governance guidance that should be referenced

The profiles should explicitly cite major cloud-provider guidance that now overlaps with AGF themes:

- Microsoft’s Azure guidance on establishing governance/security practices for AI agents across an organization (Dec 2025). citeturn17search0  
- Google Cloud’s “enhanced tool governance” in Vertex AI Agent Builder via Cloud API Registry (Dec 2025), which is materially aligned to “approved tool registries” and “environment governance.” citeturn17search8  
- AWS’s Agentic AI Security Scoping Matrix (Nov 2025) provides a widely-cited scoping model for agent autonomy and security control application—relevant for AGF risk tiers/trust ladders positioning. citeturn17search10turn17search13  

### Enterprise platform shifts affecting competitive positioning

Two notable platform moves that impact “governance-aware observability” positioning:

- ServiceNow positioning around centralized AI governance (AI Control Tower) and agent connection governance (AI Gateway) indicates enterprise buyers will increasingly expect “governed connectivity” and oversight across agent ecosystems, including MCP-style tool access. citeturn16search2turn16search19turn16search15  
- Salesforce security/governance messaging for Agentforce and its shared responsibility framing indicates “agentic governance” is becoming a first-class platform concern, not just third-party tooling. citeturn16search9turn16search12  

## Factual Errors Found

These are *specific* correctness issues identified in the profile text, with corrections and supporting sources.

### EU AI Act Article 50 mapping is incomplete

- **Profile claim (GRC Profile, `/mnt/data/grc-profile.md`):** “Art. 50 — Transparency obligations — Users informed they are interacting with AI.”  
- **Correction:** Article 50 transparency obligations extend beyond “chatbot disclosure” and include other transparency duties (e.g., disclosures for certain AI-generated/manipulated content and specific transparency cases such as emotion recognition/biometric categorisation depending on the deployment). citeturn0search6turn0search31  

### EU AI Act timing/applicability is missing, creating regulatory precision risk

- **Profile behavior:** The GRC Profile summarizes Articles 6, 9–15, and 50 without stating that, as of March 2026, many obligations are still in phased implementation and not yet applicable.  
- **Correction:** The entity["organization","European Commission","eu executive body"] explicitly states phased applicability dates: prohibitions/definitions/AI literacy since 2 Feb 2025; governance rules + GPAI obligations since 2 Aug 2025; high-risk obligations later. citeturn0search32turn0search36  

### NIST AI RMF “agentic specializations of functions” overstates NIST’s framing

- **Profile claim (GRC Profile, `/mnt/data/grc-profile.md`):** “AGF primitives are agentic specializations of NIST AI RMF functions.”  
- **Correction:** NIST describes flexibility and user tailoring; and defines “profiles” as implementations for specific contexts. “Specialization” is reasonable as AGF language, but should be presented as AGF’s agentic profile interpretation, not NIST’s own characterization. citeturn3view1  

### NIST IR 8596 “agents as actors” is interpretive, not NIST wording

- **Profile claim (GRC Profile, `/mnt/data/grc-profile.md`):** IR 8596 treats agents as “actors.”  
- **Correction:** IR 8596 does treat agents as security-relevant entities (unique identity, privileged-user precautions), but “actors” appears to be paraphrase. Tighten wording and cite the agent-identity guidance within IR 8596. citeturn4view0turn4view3  

### OWASP MCP category naming in Security Profile is out of sync with the OWASP Top 10 list labels

- **Profile claim (Security Profile, `/mnt/data/security-profile.md`):** “MCP06 — Prompt Injection via Contextual Payloads.”  
- **Correction:** The OWASP MCP Top 10 list label shows MCP06 as “Intent Flow Subversion,” and the project is explicitly in beta/living state; pin to a version and use the canonical list labels. citeturn9view1  

### ISO 27001:2022 control-name precision issues in the crosswalk

- **Profile issues (GRC Profile crosswalk, `/mnt/data/grc-profile.md`):**  
  - “A.8.20 (Networks Security)” should be aligned to the commonly published control name “Network security.”  
  - “A.8.8 (Technical Vulnerabilities)” should be consistently “Management of technical vulnerabilities.”  
- **Correction:** Update Names to match published 27001:2022 Annex A control naming conventions and keep naming consistent across the table. citeturn23search17turn23search12  

## Top 10 Accuracy Issues

Prioritized by regulatory/audit impact and likelihood of causing downstream confusion.

1. **EU AI Act phased applicability is not stated in the GRC Profile**, risking readers believing Articles 6/9–15/50 are already enforceable as of March 2026. citeturn0search32turn0search36  
2. **EU AI Act Article 50 is materially under-scoped** (“chatbot disclosure” only), which can cause transparency compliance gaps. citeturn0search6turn0search31  
3. **EU AI Act coverage is incomplete for agentic systems positioning**, because GPAI obligations have been applicable since Aug 2025 and are relevant for many agentic deployments but are not clearly addressed as a mapping domain. citeturn0search32  
4. **Control crosswalk ISO naming inconsistencies** (A.8.20 wording; A.8.8 naming drift) reduce audit credibility even if the intent is correct. citeturn23search17turn23search12  
5. **OWASP MCP Top 10 category naming/version pinning** needs tightening; OWASP itself labels it living/beta, so compliance use requires version anchoring. citeturn9view1turn8search4  
6. **NIST AI RMF “agentic specialization” framing should be repositioned as an AGF profile interpretation**, supported by NIST’s “profiles” concept, not implied NIST terminology. citeturn3view1  
7. **NIST IR 8596 “agents as actors” should be rewritten as evidence-based paraphrase**, with explicit support from IR 8596 agent identity/privilege language. citeturn4view0turn4view3  
8. **AGF 4-tier risk classification vs EU AI Act 4-category risk model is not made explicit**, increasing the chance of category confusion (“Critical” ≠ “Unacceptable risk” by default). citeturn0search32  
9. **Observability Profile understates OTel native GenAI compatibility**: OTel already has agent/tool/MCP semantic work; AGF should reference and align, then extend. citeturn15search2turn15search5turn15search11  
10. **Competitive landscape references are missing key 2025–Q1 2026 “agent governance by platforms” moves**, especially cloud governance guidance and enterprise governance layers, which shifts positioning away from “no one else does this.” citeturn17search0turn17search8turn17search10turn16search19turn16search9