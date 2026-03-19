# AGF reference architecture: Round 2 adversarial review

**The AGF framework demonstrates strong technical competence in its control crosswalks and threat mappings, but contains several factual errors, systematically overstates regulatory coverage, and misses critical prior art.** The most significant findings are an incorrect EU AI Act article number (Art. 62 vs. Art. 73), fabricated CSA trust maturity levels, a mischaracterized Microsoft AGT performance figure, and the omission of MITRE ATLAS — the de facto adversarial AI threat taxonomy. The framework's OWASP and MAESTRO mappings hold up well, but its NIST mappings compress broad functions into narrow primitives in ways that risk misleading adopters about compliance coverage. Below is a claim-by-claim accounting across all 15 validation areas.

---

## 1. OWASP standards hold up with naming gaps and one significant rename

### OWASP Top 10 for Agentic Applications (ASI)

The ASI list was released December 9, 2025, as version 1.0 under the OWASP GenAI Security Project, reviewed by a board including NIST, the Alan Turing Institute, and Microsoft AI Red Team. All 10 numberings (ASI01–ASI10) are correct. **Seven of ten threat names are exact matches.** Two are truncated: ASI02 should be "Tool Misuse **and Exploitation**" and ASI04 should be "**Agentic** Supply Chain **Vulnerabilities**." These truncations omit meaningful scope — ASI04's "Agentic" qualifier distinguishes it from generic supply chain risks, and ASI02's "Exploitation" signals active attack, not just accidental misuse.

The AGF's single-owner assignments are reasonable but undersell the cross-cutting nature of several threats. ASI01 (Goal Hijack) assigned solely to Adversarial Robustness ignores the governance dimension — human-in-the-loop and policy enforcement are primary defenses. ASI04 (Supply Chain) assigned to Adversarial Robustness is questionable; supply chain is fundamentally about provenance, SBOMs, and registry controls — governance concerns, not input-level robustness. **ASI10 (Rogue Agents) assigned to Bounded Agency alone misses the monitoring, kill-switch, and behavioral auditing capabilities needed to detect and contain rogue behavior.** At least five of ten threats (ASI01, ASI04, ASI05, ASI07, ASI10) would benefit from explicit multi-owner responsibility rather than single-primitive assignment.

### OWASP MCP Top 10

The MCP Top 10 remains in **Phase 3 (Beta Release and Pilot Testing)** as of March 2026, version v0.1, classified as an OWASP Incubator Project. All numberings are correct. However, **MCP06 has been renamed from "Prompt Injection via Contextual Payloads" to "Intent Flow Subversion"** — the AGF uses the outdated name. This rename is substantive: the new name distinguishes in-flow context hijacking from generic prompt injection. Four additional threat names are truncated: MCP01 omits "& Secret Exposure," MCP04 omits "Software" and "& Dependency Tampering," MCP05 omits "& Execution," and MCP07 abbreviates "Insufficient Authentication & Authorization." The framework's characterization of the list as "living/beta" is confirmed accurate. Between January–February 2026, researchers filed 30+ CVEs targeting MCP infrastructure, validating the taxonomy's relevance.

---

## 2. EU AI Act mapping contains one major error and several significant gaps

The framework's article-level characterizations are substantively accurate for Articles 6, 9, 10, 11, 13, 14, and 15. Article descriptions match the official regulation text in Regulation (EU) 2024/1689.

**The most serious error is the Art. 62 citation.** The framework states it "does NOT cover Art. 62 (serious incident reporting)." In the final regulation, **Art. 62 covers SME support measures, not incident reporting.** Serious incident reporting is covered by **Art. 73**. This appears to be a numbering error carried from an earlier draft of the Act. Any compliance mapping referencing Art. 62 for incident reporting is incorrect.

The Art. 12 biometric caveat is technically defensible but **misleadingly framed**. Art. 12(3)'s enumerated minimum field requirements do apply specifically to remote biometric identification systems (Annex III, point 1(a)). However, Art. 12(1) mandates automatic event logging for *all* high-risk AI systems. Readers could conclude Art. 12 is mostly about biometrics, when the general logging obligation applies broadly.

Art. 15 is characterized only as "robustness" but actually covers three distinct obligations: **accuracy, robustness, and cybersecurity**. Art. 15(5) explicitly mentions adversarial attacks including data poisoning and adversarial examples. The framework's mapping misses two-thirds of this article's scope.

The **August 2026 deadline is confirmed correct** — 2 August 2026 is when the bulk of the Act becomes applicable, including high-risk system requirements (Art. 9–15), conformity assessment, Art. 50 transparency obligations, post-market monitoring, and incident reporting.

Several articles highly relevant to agentic AI are entirely unmapped:

- **Art. 5 (Prohibited Practices)**: Bans subliminal/manipulative/deceptive AI techniques — directly relevant to autonomous goal-pursuing agents
- **Art. 51–56 (GPAI Model Obligations)**: Since most agentic systems are built on general-purpose AI models, this chapter's documentation, adversarial testing, and systemic risk requirements apply
- **Art. 26 (Deployer Obligations)**: Requires monitoring operations, maintaining logs for ≥6 months, and informing individuals subject to AI decisions
- **Art. 72 (Post-Market Monitoring)**: Requires systematic performance data collection throughout the system's lifetime
- **Art. 4 (AI Literacy)**: Already applicable since February 2025, requires staff training

The omission of the GPAI chapter is the most significant gap. Any agentic AI system built on models like GPT-4 or Claude inherits GPAI provider obligations under Art. 53, and potentially systemic risk obligations under Art. 55.

---

## 3. NIST mappings are structurally correct but systematically overstate coverage

### NIST AI RMF 1.0

The four functions — GOVERN, MAP, MEASURE, MANAGE — are confirmed exactly. The AGF's mappings touch real aspects of each function but **capture only narrow slices of their actual scope**. GOVERN encompasses 6 categories and 23 subcategories spanning legal compliance, DEI processes, external stakeholder engagement, supply chain governance, and organizational risk culture. Mapping this to a single "Ring 2" dramatically understates its breadth. MANAGE covers incident response/recovery/communication, appeal mechanisms, decommissioning, and continual improvement — far broader than Trust Ladders + Bounded Agency.

The claim that AGF primitives are "agentic specializations of" NIST functions is **generous characterization that borders on misleading**. A more accurate framing would be "AGF primitives that partially address aspects of NIST AI RMF functions in agentic contexts." The term "specialization" implies systematic narrowing and deepening of each function; the actual mapping is selective extraction of compatible elements.

### NIST IR 8596

The document exists as **"Cybersecurity Framework Profile for Artificial Intelligence (Cyber AI Profile)"** — an Initial Preliminary Draft published December 16, 2025. It is structured around CSF 2.0's six functions (Govern, Identify, Protect, Detect, Respond, Recover), not the AI RMF's four functions. The three focus areas are confirmed, with minor naming discrepancies: NIST says "Securing AI **System Components**," "**Conducting** AI-Enabled Cyber Defense," and "Thwarting AI-Enabled **Cyber** Attacks." The AGF mappings compress 97+ pages of detailed, cross-functional guidance into 2–3 primitives per focus area — a compression that substantially underrepresents scope.

### NIST NCCoE Agent Identity

A concept paper titled "Accelerating the Adoption of Software and Artificial Intelligence Agent Identity and Authorization" was published **February 5, 2026** — the date matches. However, the AGF **significantly overstates this document's authority**. It is a concept paper soliciting stakeholder feedback on whether to even launch a project, not published guidance or recommendations. The four protocols (SPIFFE/SPIRE, OAuth 2.1, OIDC, NGAC) are listed as standards "being considered" for a potential future project, not formal recommendations. The concept paper also lists MCP, SCIM, SP 800-207 (Zero Trust), SP 800-63-4 (Digital Identity), and NISTIR 8587 (Protecting Tokens) — all omitted by the AGF. Saying the NCCoE "recommends" these protocols inaccurately elevates exploratory candidates to formal recommendations.

---

## 4. Control crosswalks are excellent; Singapore and CSA mappings contain errors

### NIST 800-53 Rev. 5 and ISO 27001:2022

**All 10 NIST 800-53 controls and all 6 ISO 27001:2022 controls are correctly titled, correctly numbered, and semantically appropriate.** The ISO 27001:2022 numbering correctly reflects the 2022 restructuring from 14 domains to 4 themes (Organizational A.5, People A.6, Physical A.7, Technological A.8). This is the strongest section of the framework's compliance mapping — it demonstrates genuine GRC expertise.

Recommended additions: **IA-3 (Device Identification and Authentication)** for Identity, since agents are non-human entities; **AU-6 (Audit Record Review, Analysis, and Reporting)** for Observability to close the analysis loop; and **AC-4 (Information Flow Enforcement)** for Bounded Agency to control data flow participation.

### Singapore IMDA MGF

Published 22 January 2026 at Davos — confirmed. The framework correctly identifies four dimensions, but **the dimension names are paraphrases, not verbatim**. The actual names are action-oriented phrases: "Assess and bound the risks upfront," "Make humans meaningfully accountable," "Implement technical controls and processes," and "Enable end-user responsibility." The claim that IMDA "explicitly includes operational environments as a governance dimension" is **incorrect** — operational environments appear as a factor *within* Dimension 1 (bounding risks through sandbox environments), not as a standalone governance dimension.

### CSA Agentic Trust Framework

The ATF exists (published February 2, 2026) and does feature an earned autonomy maturity model. However, **the maturity level names are wrong**. The AGF claims five levels: Intern → Associate → Senior → Staff → Principal. The actual framework has **four levels: Intern → Junior → Senior → Principal**. "Associate" and "Staff" do not exist in the specification. This is a factual error that introduces two fabricated trust levels. The thematic alignment between Trust Ladders and ATF's earned autonomy concept remains valid.

### CSA MAESTRO

All seven layer names are **exact matches**: Foundation Models, Data Operations, Agent Frameworks, Deployment Infrastructure, Evaluation & Observability, Security & Compliance, Agent Ecosystem. Published February 6, 2025. This mapping is accurate and well-executed.

---

## 5. Academic citations mostly verify, with three significant mischaracterizations

All 13 cited works were found. Venues are correct for the peer-reviewed papers (Engels et al. at NeurIPS 2025, SAGA at NDSS 2026, AgentSpec at ICSE 2026, MAST at NeurIPS 2025 D&B). **AgentGuard appeared at the AgenticSE 2025 *workshop* co-located with ASE 2025, not as a main-conference paper** — a meaningful distinction for credibility assessment.

Three performance claims require correction:

- **Microsoft AGT's "0.43s across 7,000+ decisions"** is mischaracterized. The 0.43 seconds is the **total cumulative overhead** across all 7,000+ decisions over 11 days, not per-evaluation latency. Per-decision latency is sub-millisecond (~0.06ms). If cited as per-evaluation cost, this reverses the finding: 0.43s total is a *strength* claim showing negligible overhead, not a latency concern. The source is a blog post, not a peer-reviewed paper.

- **Bifrost's "11μs per check"** is the AI gateway routing overhead at 5,000 RPS, not specifically a "security fabric" latency. Bifrost is primarily an LLM gateway (routing, load balancing, failover) with governance features. Describing it as a "security fabric" mischaracterizes the product. The 11μs figure is accurate for gateway overhead but not for security evaluation specifically.

- **Reflexion's "~50× tokens"** claim does not appear in the original Shinn et al. (NeurIPS 2023) paper. The paper describes multi-trial iterative learning, and 50× is plausible as derived extrapolation, but this figure needs a direct source citation. As stated, it is unverifiable from the primary source.

Notable missing academic work includes: **OpenAI's "Practices for Governing Agentic AI Systems"** (influential industry white paper), Meta's **"Agents Rule of Two"** (a concrete, widely-cited security design principle), Google DeepMind's **"Towards a Science of Scaling Agent Systems"** (documenting 17× error amplification in multi-agent networks), and **ACE** (NDSS 2026, a sister paper to SAGA addressing LLM-integrated app security).

---

## 6. The Security Response Bus has clear SOAR precedent and known failure modes

The Security Response Bus pattern — pre-authorized automated containment bypassing governance deliberation — is **not novel**. It has extensive, well-documented precedent across three domains:

- **SOAR playbooks** implement precisely this pattern: pre-defined automated sequences that isolate endpoints, block IPs, revoke credentials, and quarantine emails without human approval for defined threat classes. Major platforms (Palo Alto Cortex XSOAR, Splunk SOAR, Rapid7 InsightConnect) have deployed this at scale for years.
- **Zero Trust Architecture** automated enforcement includes automated session termination, microsegmentation policy updates, and device quarantine upon anomaly detection.
- **XDR/EDR platforms** automatically isolate compromised endpoints and block C2 communications based on detected threat signatures.

The timing claim — "multi-agent attacks cascade in seconds while governance deliberation takes minutes" — is **well-supported**. Research on the CrowdStrike 2024 incident found cascade amplification factors of 1.2–1.8× at each system level, and organizations with proper isolation showed 45-minute containment versus 180 minutes without.

Known failure modes are well-documented and should be acknowledged by the framework: **49% of security tool alerts are false positives** (Ponemon Institute), making automated containment risky without tuning. The SentinelOne outage (caused by an internal automation issue, affecting 13,000 customers for ~6 hours), the Cloudflare November 2025 outage (caused by an auto-generated threat configuration file), and SANS Institute warnings about automated OT shutdowns all demonstrate that **pre-authorized automated response can amplify incidents rather than contain them**. The framework should cite SOAR as prior art and explicitly address false-positive containment and response amplification risks.

---

## 7. Deployment mode claims are partially supported but oversimplified

**MCP adoption is genuinely strong**: 97 million monthly SDK downloads, 10,000+ active servers, support from OpenAI, Google, Microsoft, Amazon, and governance transfer to the Linux Foundation's Agentic AI Foundation. The characterization of MCP as dominant for agent-tool communication is supported.

However, the claim that "middleware/interrupt is the most common deployment pattern" is **oversimplified**. The evidence shows a fragmented ecosystem:

- **LangGraph** (one of the most popular frameworks) uses **graph-embedded** governance with state machines, conditional routing, and checkpoint-based human-in-the-loop
- **CrewAI** uses **workflow checkpoint** governance with role-based human review
- **OpenAI Agents SDK** uses **interceptor/middleware** guardrails (closest to the claimed pattern)
- **Amazon Bedrock AgentCore** uses **external policy enforcement** at the gateway layer
- **AutoGen** uses **conversational participant** governance via UserProxyAgent

No single pattern dominates. A Galileo 2026 report notes **only 20% of organizations have mature governance models**, suggesting the ecosystem is too early-stage for any pattern to claim dominance.

The characterization of **MCP as "the canonical implementation of middleware/interrupt mode"** conflates a connectivity protocol with a governance mechanism. MCP standardizes how agents connect to tools; governance layers are built on top of or alongside MCP. Amazon's AgentCore Gateway sits in front of MCP connections, and OpenAI's guardrails operate within the Agents SDK separately from MCP transport.

The claim that **ChatGPT uses "graph-embedded" governance is inaccurate**. ChatGPT uses an orchestrated pipeline with interceptor guardrails. "Graph-embedded" more accurately describes LangGraph's explicit state-machine approach. OpenAI's Agent Builder does use visual workflow graphs, but this is a development tool, not ChatGPT's production architecture.

---

## 8. OpenTelemetry characterization is accurate and honest

The OTel GenAI semantic conventions are at **"Development" maturity** (not yet stable) as of conventions version 1.40.0. They cover model spans (chat completion, embeddings, retrieval), agent spans (create_agent, invoke_agent, execute_tool), token usage metrics, content events, and provider-specific conventions for Anthropic, Azure, AWS Bedrock, and OpenAI.

The conventions cover **zero governance, security, or compliance semantics**. There are no native conventions for policy enforcement events, permission violations, ring-level trust boundaries, risk assessment events, or human-in-the-loop approval workflows. The framework's statement that "AGF's governance, security, and ring-level event semantics are custom extensions within the OTel data model, not native OTel semantic conventions" is **precisely correct**. This is one of the most honest self-assessments in the framework.

---

## 9. Critical missing prior art the framework must address

Two omissions rise to the level of critical gaps:

- **MITRE ATLAS** is the de facto standard for AI adversarial threat modeling, modeled after ATT&CK and widely adopted in enterprise security. As of October 2025, it includes **15 tactics, 66 techniques, 46 sub-techniques, and 33 real-world case studies**. A October 2025 update added **14 new techniques specifically focused on AI Agents and Generative AI systems**, developed with Zenity Labs. Any agentic security framework that omits MITRE ATLAS lacks the most widely-adopted adversarial threat taxonomy.

- **Anthropic's specific agent safety publications** should be cited beyond general acknowledgment. The Responsible Scaling Policy v3.0 (February 2026), ASL-3 safeguards (May 2025), computer use safety evaluations, the Sabotage Risk Report (Summer 2025), and multi-agent governance recommendations contain directly relevant technical findings — including Claude Opus 4's 89% prompt injection prevention rate.

Additional recommended citations include Google DeepMind's browser agent security model (described as the most detailed production agentic security architecture from any major company), Meta's "Agents Rule of Two" principle, the WEF Agentic AI Framework (November 2025), OpenAI's Agents SDK governance patterns, **ISO/IEC 42001** (now a procurement requirement for enterprise AI), **ISO/IEC 23894** (AI-specific risk management), IEEE P7009 (fail-safe autonomous system design), and ENISA's Framework for AI Cybersecurity Practices (FAICP).

---

## Top 10 gaps, errors, and overstatements by severity

1. **EU AI Act Art. 62 numbering error** — Cites Art. 62 for serious incident reporting; the correct article is Art. 73. Art. 62 covers SME support. Direct factual error affecting compliance mapping credibility.

2. **CSA ATF trust levels fabricated** — Claims five levels (Intern → Associate → Senior → Staff → Principal); actual framework has four (Intern → Junior → Senior → Principal). Two levels are invented.

3. **Microsoft AGT latency mischaracterized** — 0.43s is total cumulative overhead across 7,000+ decisions, not per-decision cost. Per-decision latency is ~0.06ms. Citing this as evaluation latency inverts the finding.

4. **NIST NCCoE authority overstated** — A concept paper soliciting feedback is characterized as published guidance with recommended protocols. The protocols are candidates being considered, not recommendations.

5. **MITRE ATLAS omitted** — The most widely adopted AI adversarial threat taxonomy, with agent-specific techniques, is entirely absent from the framework's source base.

6. **NIST AI RMF coverage overstated** — "Agentic specializations of" NIST functions implies comprehensive derivation; actual mappings capture narrow slices. GOVERN's 23 subcategories are compressed to a single ring.

7. **OWASP MCP06 uses outdated name** — "Prompt Injection via Contextual Payloads" has been renamed to "Intent Flow Subversion." The rename is substantive, not cosmetic.

8. **EU AI Act GPAI chapter unmapped** — Art. 51–56 covering general-purpose AI model obligations apply to virtually all agentic systems built on foundation models. This is a structural compliance gap.

9. **Bifrost mischaracterized as security fabric** — Bifrost is an AI gateway with governance features; 11μs is routing overhead, not security evaluation latency. The category and measurement are both inaccurate.

10. **Deployment mode claims oversimplified** — Middleware/interrupt is one of several coequal patterns. Characterizing it as dominant and MCP as its canonical implementation conflates connectivity with governance and doesn't reflect the fragmented ecosystem reality.

---

## Conclusion

The AGF framework is a serious synthesis effort with genuine technical depth in several areas. Its NIST 800-53/ISO 27001 crosswalks are excellent, its MAESTRO layer mapping is exact, and its OpenTelemetry characterization is admirably honest. The "named, not coined" positioning is appropriate — this is composition, not invention.

However, Round 2 review reveals a pattern of **systematic edge-rounding** that inflates coverage claims. Threat names are truncated to look like cleaner mappings. Broad regulatory functions are compressed into narrow primitives without acknowledging the compression. A concept paper becomes "recommendations." Five trust levels are cited where four exist. These individually minor distortions compound into a credibility risk: adopters may believe they have more regulatory coverage than they actually do. The framework would benefit from explicit "coverage boundary" annotations on each regulatory mapping — stating not just what is covered, but what aspects of each standard remain outside AGF's scope. The factual errors (Art. 62/73, CSA trust levels, AGT latency) must be corrected before publication, and the omission of MITRE ATLAS is a gap that undermines the security model's completeness.