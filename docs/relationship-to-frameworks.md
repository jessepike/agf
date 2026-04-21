# AGF's Relationship to Existing Frameworks

**Last updated:** 2026-04-21
**Status:** Active
**Related decisions:** DECISIONS.md #3 (Positioning Pillars), #4 (Seven-Layer Stack), #5 (Gate-Boundary Dual-Form), #6 (Maturity Model), #7 (Harness Definition)

---

## Status Note — What Ships Today vs. What's Planned

AGF ships human-readable primitive forms today. Machine-readable primitive schemas (the dual-form artifacts described below), FAIR-CAM control-effectiveness templates, and the full maturity-level conformance criteria are planned for v0.2. Where this document describes AGF "operationalizing at machine speed," treat that as the architectural commitment — the dual-form artifacts and runtime adapters that make it real are the next major work product.

---

## Why This Doc Exists

Any organization deploying agentic systems in 2026 is looking at a crowded field:

- **Threat catalogs** from OWASP, MITRE ATLAS, and dozens of vendor advisories
- **Threat-modeling frameworks** from CSA (MAESTRO) and Microsoft (Failure Mode Taxonomy)
- **Control catalogs** from CSA (AICM), ISO (42001, 27001), NIST (800-53, AI 600-1), BSI (AIC4), the EU AI Act, and more
- **Operating models** from CSA (Agentic Trust Framework), NIST CSF, ISO 27001 Annex A
- **Runtime implementations** from Microsoft (Agent Governance Toolkit), AWS (Agentic AI Security Scoping Matrix), Google, and emerging open-source projects
- **Risk quantification methodologies** from FAIR, FAIR-CAM, ISO 31000

Each one is authoritative within its scope. None is sufficient alone. Together, they overlap, conflict, and leave gaps — particularly where agentic behavior diverges from the assumptions the frameworks were built under.

AGF's job is not to replace any of them. AGF's job is to provide the architectural substrate that explains how they compose, where they reinforce each other, and where they fail to cover agent-specific concerns. This document is the map.

---

## The Core Question

> "We already have NIST. We're evaluating AICM. Our CSO wants ISO 42001. Our security team is reading about MAESTRO. Microsoft is shipping the Agent Governance Toolkit. Do we need another framework?"

No. You need the architecture that makes the frameworks you already use work together for agentic systems. That is AGF.

AGF is **derived from the composition of existing frameworks, guidance, and standards.** AGF does not invent a new control catalog or threat taxonomy. It synthesizes existing work, unifies it on a shared architectural substrate, prescribes pathways for implementation, and is designed to operationalize at machine speed. Where AGF introduces novel architectural framing (Rings Model, OTAA invariant, Producer-Verifier Separation), it marks those as such with explicit confidence levels — see `DECISIONS.md` #3 (AGF Positioning Pillars).

---

## The Seven-Layer Stack (Six Layers + Risk Quantification Lens)

AGF sits inside a seven-layer conceptual stack. Six layers describe what an organization needs to know and do. A seventh, orthogonal layer — the risk quantification lens — cuts across the rest to produce investment and prioritization economics. When this document refers to the "seven-layer stack," Layer 6 is always orthogonal; the substrate-to-runtime progression is Layers 0 through 5.

```
┌────────────────────────────────────────────────────────────────────┐
│ 6. Risk quantification lens     FAIR, FAIR-CAM, ISO 31000,         │
│    (orthogonal, cross-cutting)  NIST AI RMF "Measure"              │
├────────────────────────────────────────────────────────────────────┤
│ 5. Runtime reference            Microsoft AGT (MIT, ATF-conformant)│
│                                 + Microsoft CAF + Agent 365        │
├────────────────────────────────────────────────────────────────────┤
│ 4. Operating model              CSA ATF (5 Qs, 4-tier maturity,    │
│                                 25 conformance requirements)       │
├────────────────────────────────────────────────────────────────────┤
│ 3. Control catalog              CSA AICM v1.0.3 (18 domains,       │
│                                 243 controls); ISO 42001/27001;    │
│                                 NIST 800-53; EU AI Act Annexes;    │
│                                 BSI AIC4                           │
├────────────────────────────────────────────────────────────────────┤
│ 2. Threat modeling              CSA MAESTRO (7 layers) +           │
│                                 Microsoft Failure Mode Taxonomy    │
│                                 (2×2, 28 named modes)              │
├────────────────────────────────────────────────────────────────────┤
│ 1. Threat baseline              OWASP Agentic Top 10 (ASI-01–10)   │
├────────────────────────────────────────────────────────────────────┤
│ 0. Reference architecture       AGF — 4 Rings + 19 Primitives +    │
│    (substrate)                  3 deployment modes + 3-level       │
│                                 security + 7 tensions + OTAA       │
└────────────────────────────────────────────────────────────────────┘
```

The layers are ordered from most concrete and specific (top) to most abstract and foundational (bottom). Risk quantification sits outside the stack because it is methodology, not content.

Each layer answers a distinct question. Organizations typically engage with several of them simultaneously, which is how gaps and duplicate work emerge. AGF, at Layer 0, is the shared vocabulary and architectural model that makes the layers resolve into one coherent system.

---

## What Each Layer Is For

### Layer 0 — AGF (Reference Architecture Substrate)

**Answers:** *"How do the pieces fit together, architecturally, for an agentic system?"*

AGF provides:
- **Rings Model** — four governance control loops (Execution, Verification, Governance, Learning) that frame where each concern lives in a running agent system
- **19 Primitives** — named, reusable architectural components (identity, memory, planning, tools, observability, etc.) that every agentic system contains in some form
- **Three deployment modes** — wrapper, middleware/interrupt, graph-embedded — describing where in the runtime governance controls are enforced
- **Three-level security model** — Fabric, Governance, Intelligence, with a Security Response Bus across them
- **Seven named tensions** — points where primitives conflict (autonomy vs. oversight, latency vs. verification, self-improvement vs. reproducibility), with architectural invariants for resolving each
- **OTAA invariant** — every primitive MUST be Observable, Traceable, Auditable, and Agent-operable
- **Dual-form principle** — every primitive exists in both human-readable and machine-readable form

AGF does not replicate content from the other layers. It provides the structural map onto which the other layers project.

**What AGF is not:** a control catalog, a certification regime, a product, a threat list, or a runtime. It is the architectural model sitting beneath all of those.

### Layer 1 — Threat Baseline (OWASP Agentic Top 10)

**Answers:** *"What are the most important things that can go wrong?"*

OWASP's Agentic AI Top 10 (ASI-01 through ASI-10) is AGF's primary threat baseline — a community-vetted, freely-available list of the most significant risk categories for agentic systems. It is the shortest artifact anyone evaluating agentic security should be familiar with. Like the original OWASP Top 10 for web applications, its value is in ruthless prioritization.

AGF cites OWASP Agentic Top 10 as its recommended threat baseline. Every AGF security discussion should be readable by someone whose only prior exposure is the Top 10.

### Layer 2 — Threat Modeling (MAESTRO + Microsoft Failure Mode Taxonomy)

**Answers:** *"What specifically can go wrong, by what mechanism, at what point in the system?"*

Where Layer 1 enumerates risk categories, Layer 2 provides structured frameworks for mapping threats to the components and flows of a specific agentic system.

- **CSA MAESTRO** (Multi-Agent Environments, Security, Threat, Risk, and Outcome) provides a seven-layer reference architecture for threat-analyzing agentic systems. Layers include Foundation Models, Data Operations, Agent Frameworks, Deployment and Infrastructure, Observability and Monitoring, Security and Compliance, and Agent Ecosystem.
- **Microsoft Failure Mode Taxonomy** (Ram Shankar Siva Kumar et al., Apr 2025) organizes 28 named failure modes into a 2×2 grid: Safety vs Security × Novel vs Existing. Ten modes are classified as "novel" to agentic systems.

These two frameworks are complementary, not competitive. MAESTRO is architectural. The Microsoft taxonomy is mode-by-mode. AGF cites both. Specific per-failure-mode-to-primitive mappings live in `docs/profiles/security-profile.md`.

### Layer 3 — Control Catalog (AICM, ISO 42001, NIST, EU AI Act, BSI AIC4)

**Answers:** *"What specific controls must we implement to satisfy regulators, auditors, and customers?"*

Control catalogs are enumerative. They tell you what to do, not why or how it fits together.

- **CSA AI Controls Matrix (AICM) v1.0.3** — 18 domains, 243 controls. Maps to ISO 42001, ISO 27001, NIST AI 600-1, BSI AIC4, EU AI Act. Five controls are explicitly agent-native as of v1.0.3: AIS-11 (Agents Security Boundaries), AIS-13 (AI Sandboxing), AIS-15 (Prompt Differentiation), IAM-19 (Agent Access Restriction), TVM-11 (Guardrails). The remaining 238 are AI-general or cloud-inherited. Expected to grow in future revisions.
- **ISO/IEC 42001:2023** — the AI Management System standard. Organizations seeking certification against 42001 need the AICM mapping (AICM maps to all 10 ISO 42001 domains, 39 controls).
- **ISO/IEC 27001:2022** — information security foundation; still relevant but doesn't cover AI-specific concerns.
- **NIST 800-53 + NIST AI RMF + NIST AI 600-1 (Generative AI Profile)** — the U.S. federal control and risk-management stack.
- **EU AI Act Annexes** — high-risk system requirements (Articles 9, 10, 12, 15, 16, 20, 26, 62 are the most commonly relevant).
- **BSI AIC4** — Germany's AI cloud service compliance criteria catalogue.

AGF primitives crosswalk to these catalogs. The crosswalks live in `docs/profiles/` (security, GRC, AI engineering, platform, observability). AGF does not replicate the catalogs; AGF provides the architectural map of how controls cluster.

**An important honest observation:** AICM's explicit agentic coverage is thin — 5 of 243 controls (the five listed above) are agent-native as of v1.0.3. This reflects the youth of the agentic field, not a flaw in AICM. AGF's gap analysis ("Agentic Compliance Blind Spots," forthcoming) surfaces the agent-specific failure modes that current control catalogs do not yet cover.

### Layer 4 — Operating Model (CSA Agentic Trust Framework)

**Answers:** *"How do we organize our team, policies, and decisions to actually run governed agents over time?"*

Where Layer 3 enumerates controls, Layer 4 provides the operating model — roles, decision cadence, maturity progression, conformance evidence.

**CSA Agentic Trust Framework (ATF) v1.0** — the current leading public operating-model artifact as of April 2026. Built around:
- **Five governance questions:** Who are you? What are you doing? What are you eating/serving? Where can you go? What if you go rogue?
- **Four-tier maturity model:** Intern → Junior → Senior → Principal, mapped 1:1 to AWS Agentic AI Security Scoping Matrix Scopes 1–4
- **Five promotion gates:** Performance, Security Validation, Business Value, Incident Record, Governance Sign-off
- **Twenty-five conformance requirements** with MUST/SHOULD/MAY precision per maturity level
- **Two-tier conformance program:** ATF-Compatible (self-attestation) and ATF-Certified (third-party audit)

ATF is open-source (CC-licensed) and co-developed with Microsoft. Microsoft's Agent Governance Toolkit (Layer 5) is formally ATF-conformant.

AGF primitives crosswalk to ATF's five elements and 25 requirements. The crosswalk lives in `docs/profiles/grc-profile.md` (and related).

**Relationship to AGF Primitive #11 (Trust Ladders).**
AGF's Trust Ladders primitive and ATF's four-tier maturity model are parallel expressions of the earned-autonomy pattern, operating at different scopes and cadences. AGF Primitive #11 governs per-agent, per-task runtime trust adjustment — promotion and demotion signals, asymmetric degradation, the mandatory-vs-adaptive control distinction. ATF's tiers specify organizational deployment-maturity stages with explicit promotion gates (Performance, Security Validation, Business Value, Incident Record, Governance Sign-off). Both draw on the same principle that autonomy should be earned, not assumed. Organizations adopting AGF typically implement both — the primitive at runtime, the tiers at program governance. See `docs/white-papers/trust-ladders.md` for the primitive specification.

**Relationship to AGF's maturity model (DECISIONS.md #6).**
AGF maintains its own five-level maturity model (L1 Non-existent → L2 Foundation → L3 Governed → L4 Adaptive → L5 Optimized) in `docs/agentic-governance-framework.md`. The AGF levels describe organizational progression across the full framework (Rings, primitives, observability, decision intelligence). ATF's four tiers describe per-deployment autonomy posture. These are complementary — AGF's L1–L5 is a program scale; ATF's Intern→Principal is a per-agent-cohort scale. A crosswalk will live in `docs/profiles/grc-profile.md`.

### Layer 5 — Runtime Reference (Microsoft AGT + CAF + Agent 365)

**Answers:** *"What does a production implementation of this look like in code and infrastructure?"*

Runtime references are working implementations. Today's most mature public reference is Microsoft's:

- **Agent Governance Toolkit (AGT)** — MIT-licensed open-source runtime reference implementing primitive-level control across identity, policy, isolation, observability, supply chain, and evaluation. Includes a policy kernel (Agent OS), identity platform (AgentMesh — DIDs, Ed25519, post-quantum crypto), privilege-ring execution runtime, compliance CI integration, and framework adapters for 20+ agent frameworks. AGT is formally ATF-conformant (see Layer 4). Detailed benchmarks, package-by-package architecture, and framework adapter list are documented in `docs/profiles/platform-profile.md`.
- **Azure Cloud Adoption Framework (CAF) for AI Agents** — a four-layer reference architecture (Data governance & compliance, Agent security, Agent observability, Agent development) with prescriptive controls per layer.
- **Microsoft Agent 365** — the enterprise control-plane SKU (announced, GA targeted May 2026 per Microsoft). Organizes governance around five capabilities: Registry, Access Control, Visualization, Interoperability, Security.

AGF cites Microsoft AGT as the current leading open-source runtime reference for primitive-level control. Other runtimes (AWS Agentic Scoping, Google ADK, open-source projects) are expected to mature into additional references; AGF is deliberately neutral about which runtime to use, and profile docs will expand coverage as other runtimes reach production maturity.

**A note on "Rings" terminology.** AGT uses "Ring 0–3" to describe CPU-style privilege tiers (Root/Trusted/Standard/Sandbox) that enforce execution isolation. AGF uses "R0–R3" to describe governance control loops (Execution/Verification/Governance/Learning). Same numbering, orthogonal concepts. AGT's privilege rings live inside AGF's R0 Execution ring.

### Layer 6 — Risk Quantification (FAIR, FAIR-CAM, ISO 31000, NIST AI RMF Measure)

**Answers:** *"Given our threats, controls, and posture, what's the quantified risk, and how should we prioritize investment?"*

This layer is orthogonal to the others. It does not tell you what to do; it tells you which things are worth doing, and how much to spend on them.

- **FAIR** (Factor Analysis of Information Risk, Jack Jones 2005) — calibrated probabilistic risk model: Loss Event Frequency × Loss Magnitude = Annualized Loss Expectancy, in dollar-denominated terms.
- **FAIR-CAM** (FAIR Controls Analytics Model, 2022) — extends FAIR to quantify control effectiveness, i.e., the rate at which a specific control reduces LEF or LM.
- **ISO 31000:2018** — generic enterprise risk management process.
- **NIST AI RMF's "Measure" function** — AI-specific risk measurement guidance, including evaluation methodology for model and system behavior.

FAIR is methodology, not primitive. AGF does not absorb FAIR into its architecture. Instead, AGF's **Decision Intelligence** capability layer (see `docs/decision-intelligence.md`) is the natural home for FAIR-style quantified reasoning — belief updating, probabilistic evidence integration, and explicit uncertainty modeling.

FAIR-CAM is particularly valuable to AGF because it measures whether specific controls actually reduce risk, not just whether they exist. AGF's prescriptive implementation pathways need empirical validation that the prescribed controls work; FAIR-CAM supplies the methodology.

Organizations should not choose between AGF and FAIR. They are complementary tools answering different questions.

---

## How AGF Plays Across the Layers

The four verbs from AGF's positioning pillars (DECISIONS.md #3) describe how AGF operates across this stack:

**Synthesize.** AGF pulls from every layer. It does not invent primitives; it composes them from patterns named across NIST, OWASP, CSA, ISO, Microsoft, EU AI Act, OpenTelemetry, and academic research. Every primitive carries attribution.

**Unify.** AGF places the synthesized material on a shared architectural substrate — the Rings Model, the 19 primitives, the three-level security model, the seven tensions. Readers can see the dozens of framework artifacts as one coherent system rather than a stack of independent specifications.

**Prescribe.** AGF converts synthesis into actionable implementation pathways per primitive. Rather than listing controls, AGF describes how to assess current state, define target state, and track progression. Primitive upgrades (like the current work on Primitive #14 Identity & Attribution) codify the prescriptive pathway: sub-capabilities to implement, reference implementations to consider, empirical grounding to anchor the recommendation.

**Operationalize.** AGF is designed to emit machine-readable forms of its primitives alongside human-readable forms (the dual-form principle — see DECISIONS.md #3 pillar 4). Each primitive's machine form, when implemented, will contain control mappings (to AICM, ISO, NIST, EU AI Act), MUST/SHOULD/MAY requirements (RFC 2119), evidence schemas, and test criteria. Agents will consume these schemas directly — parsing what the organization requires, reporting their own compliance state, and enforcing in real time. This is governance at wire speed (DECISIONS.md #3 pillar 5). Dual-form has teeth at every governance gate: each gate decision (PASS/REVISE/HALT/GATE/ERROR) emits both a human-readable rationale and a machine-readable artifact simultaneously — see DECISIONS.md #5. The machine-form schemas and runtime adapters are the next major work product; see Status Note above.

---

## How to Use This Document

Different roles approach this stack from different entry points. AGF's job is to make sure everyone ends up talking about the same system.

**If you are a security lead** starting from OWASP Agentic Top 10 or MAESTRO:
- You are at Layers 1–2.
- AGF's `docs/profiles/security-profile.md` maps each threat to AGF primitives, then down to specific controls and runtime implementations.
- Your primary AGF docs: security-profile, agentic-primitives, three-level security model.

**If you are a GRC or compliance lead** starting from AICM, ISO 42001, or EU AI Act:
- You are at Layer 3.
- AGF's `docs/profiles/grc-profile.md` maps AGF primitives to control-catalog entries and identifies gaps where the catalogs do not yet cover agentic concerns.
- Your primary AGF docs: grc-profile, agentic-governance-framework, shared-vocabulary.

**If you are an executive or board-level sponsor** starting from ATF, CxOtrust, or similar:
- You are at Layer 4.
- AGF provides the architectural model underneath the operating model. The CSF parallel (Rings → Primitives → Sub-capabilities → Control Mappings) is the fastest way in.
- Your primary AGF doc: this one.

**If you are a platform engineer or AI engineering lead** starting from Microsoft AGT, AWS Bedrock, or an open-source agent framework:
- You are at Layer 5.
- AGF's `docs/profiles/platform-profile.md` and `docs/profiles/ai-engineering-profile.md` show how runtime components implement AGF primitives.
- Your primary AGF docs: platform-profile, ai-engineering-profile, agentic-primitives, deployment modes.

**If you are a risk officer, CFO, or portfolio lead** starting from FAIR, ISO 31000, or internal risk programs:
- You are at Layer 6.
- AGF's Decision Intelligence capability layer is where quantified risk integrates.
- Your primary AGF docs: decision-intelligence, and FAIR-CAM-compatible loss-scenario templates (forthcoming).

---

## What AGF Commits To

AGF's relationship to every framework in this stack is governed by three commitments:

1. **Vendor neutrality.** AGF does not privilege one vendor's runtime, one consortium's operating model, or one regulator's control catalog. AGF's synthesis draws from all; implementations are illustrated via all; no single external artifact is positioned as required.

2. **Honest attribution.** Every primitive carries attribution to the prior work it synthesizes. Where a pattern originates with a specific author, consortium, or vendor (e.g., CSA ATF's five questions, Microsoft's Failure Mode Taxonomy, FAIR's Loss Event Frequency), AGF names the source. Where AGF introduces a novel framing (e.g., Producer-Verifier Separation, the Rings Model's four-loop structure, OTAA invariant), AGF marks it as such with explicit confidence level (see `docs/shared-vocabulary.md` on confidence levels).

3. **Gap disclosure.** Where existing frameworks leave agentic-specific failure modes uncovered, AGF surfaces the gap rather than papering over it. The "Agentic Compliance Blind Spots" analysis (forthcoming) enumerates the specific Microsoft-named agentic failure modes that current AICM controls do not cleanly address.

---

## What Sits Above This Stack

AGF's seven-layer stack describes the content frameworks (threat baseline, threat modeling, control catalog, operating model, runtime reference) and the risk-quantification lens relevant to an agentic system. It does not include the **enterprise architecture methods** that organizations use to develop, maintain, and integrate architecture artifacts into their broader business context.

These methods operate at a different abstraction and are deliberately out of scope for this document. They are noted here for future reference:

- **TOGAF** (The Open Group Architecture Framework) — enterprise architecture method with the Architecture Development Method (ADM) phases, Architecture Repository, and views/viewpoints. Organizations using TOGAF can adopt AGF as an architecture artifact within their Architecture Repository. AGF neither replaces nor competes with TOGAF.
- **SABSA** (Sherwood Applied Business Security Architecture) — security architecture method driven from business attributes through six layers (Contextual → Conceptual → Logical → Physical → Component → Operational). AGF's three-level security model (Fabric / Governance / Intelligence) can be expressed as inputs to SABSA's Logical and Component layers.
- **COBIT** — IT governance and management framework. AGF's operating-model primitives integrate with COBIT's governance and management objectives where agentic systems are part of the IT estate.

AGF-to-TOGAF, AGF-to-SABSA, and AGF-to-COBIT crosswalks are not currently prioritized. If organizational demand emerges, these will be addressed in future profile documents.

---

## What AGF Does Not Claim

To be honest about the limits of AGF's position in this stack:

- **AGF is not a runtime.** Do not install AGF. Install Microsoft AGT, or AWS-native agent governance, or whatever runtime your organization converges on. AGF is the architecture these runtimes implement.
- **AGF is not a certification.** CSA STAR for AI and ISO 42001 certification are the relevant assurance programs. AGF is the architecture assurance auditors can use to explain why specific controls meet specific primitive requirements.
- **AGF is not a control catalog.** AICM, NIST 800-53, and ISO 42001 are the catalogs. AGF maps to them.
- **AGF is not a threat list.** OWASP Agentic Top 10 is the canonical list. AGF uses it as a baseline.
- **AGF is not consensus.** AGF is synthesized by a single author, in public, with explicit confidence levels and acknowledged open questions. CSA, ISO, NIST, and OWASP produce consensus artifacts; AGF produces a coherent synthesis that consensus bodies can use as an architectural reference without having to reach consensus on it themselves.

---

## Maintenance and Updates

This document evolves when:

- A new major framework, standard, or runtime enters the landscape at any layer
- An existing framework ships a substantial update (e.g., AICM v1.1 with expanded agentic coverage)
- AGF's own positioning pillars evolve (tracked in `DECISIONS.md`)
- The seven-layer stack needs revision based on evidence from production AGF implementations

This document is the public orientation point for AGF's relationship to external frameworks. Per-primitive crosswalks live in `docs/profiles/`. Specific control-to-primitive mappings live in the security, GRC, and AI engineering profiles. Positioning decisions — including the seven-layer stack, the four verbs, OTAA, dual-form, tempo taxonomy, the maturity model, and harness terminology — live in `DECISIONS.md`.

---

## Related Documents

- **`agf-reference-architecture.md`** — the core AGF architecture (Rings, Primitives, deployment modes, security model, tensions)
- **`agentic-governance-framework.md`** — the top-level operating model
- **`agentic-primitives.md`** — the 19 primitives in depth
- **`decision-intelligence.md`** — the belief/decision capability layer where FAIR integrates
- **`agentic-observability.md`** — the observability capability layer
- **`shared-vocabulary.md`** — definitions, including OTAA, dual-form, tempo taxonomy, wire-speed
- **`profiles/security-profile.md`** — threat-to-primitive-to-control crosswalks, MAESTRO integration, Microsoft Failure Mode mapping
- **`profiles/grc-profile.md`** — AICM, ISO 42001, NIST AI RMF crosswalks
- **`profiles/platform-profile.md`** — runtime reference architecture mapping (Microsoft AGT, AWS, Google, open-source)
- **`profiles/ai-engineering-profile.md`** — agent framework integration guidance
- **`profiles/observability-profile.md`** — OpenTelemetry and telemetry schemas
- **`DECISIONS.md`** — positioning and terminology decisions, including #3 (positioning pillars), #4 (seven-layer stack), #5 (gate-boundary dual-form), #6 (maturity model), and #7 (harness definition)

---

*AGF is the architecture beneath the frameworks you already use. When the next one ships, AGF is the map that tells you where it fits.*
