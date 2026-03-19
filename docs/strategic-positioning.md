# Strategic Positioning — Agentic Governance Framework

**Last updated:** 2026-03-16
**Purpose:** Captures what makes our approach distinct, how we relate to the landscape, and what outcomes we're building toward.

---

## What We're Doing

We are building the **playbook** — the reference architecture and practical guide for organizations developing safe, secure, reliable, auditable, and observable agentic systems.

The landscape is fragmented. NIST is doing risk management frameworks. OWASP is doing threat taxonomies. CSA is doing trust frameworks. ISO is doing management systems. OTel is doing observability standards. Model providers ship their own governance features. Enterprise platforms build their own control planes. Security vendors build point solutions for specific threats.

Nobody is pulling it all together.

**That's what we do.** We synthesize the best thinking from across the landscape — standards bodies, industry leaders, academic research — and compose it into a coherent, implementable operating model. We connect the dots. We give organizations a single reference they can follow to govern their agentic systems, rather than stitching together 15 different frameworks, standards, and vendor-specific guidance.

The framework is the synthesis. The white papers, architecture guides, and tooling are the deliverables. The consulting engagements are the implementation support.

---

## The Landscape (As of March 2026)

### What exists and who's doing it

| Domain | Key Players | What They Provide |
|--------|------------|-------------------|
| **Threat taxonomy** | OWASP (Agentic Top 10), MITRE ATLAS | What can go wrong — 10+ specific agent attack vectors |
| **Risk management** | NIST AI RMF, NIST AI 600-1 (GenAI Profile) | How to frame and manage AI risk — Govern, Map, Measure, Manage |
| **Agent security** | NIST CAISI RFI, NIST AI 100-2e2025 | Agent-specific security considerations, adversarial ML taxonomy |
| **Agent identity** | NIST NCCoE, OpenID Foundation, SPIFFE/SPIRE | How agents prove who they are — OAuth, OIDC, cryptographic identity |
| **Zero trust for agents** | CSA Agentic Trust Framework, NIST SP 800-207 | Applying zero trust principles to non-human AI identities |
| **Observability standards** | OpenTelemetry GenAI Semantic Conventions | Standardized agent tracing — create_agent, invoke_agent, execute_tool spans |
| **Protocol governance** | Linux Foundation AAIF (MCP, A2A, AgentGateway) | How agents connect to tools and to each other |
| **Management systems** | ISO/IEC 42001, IEEE P2863 | Organizational requirements for responsible AI |
| **Regulatory requirements** | EU AI Act, US state AI laws, NAIC bulletin | What the law requires — Articles 9-15 for high-risk systems |
| **Compliance frameworks** | AIUC-1 (Cisco/UiPath) | Operational compliance for AI agent risk |
| **Enterprise platforms** | ServiceNow AI Control Tower, Salesforce Agentforce, Microsoft Agent 365 | Vendor-specific agent governance within their ecosystems |
| **LLM observability** | LangSmith, Arize, Galileo, Fiddler | Model performance monitoring — latency, tokens, hallucination rates |
| **AI security vendors** | Arthur AI, Robust Intelligence, Lakera, CalypsoAI, Protect AI | Point solutions for specific threats — firewalls, guardrails, red-teaming |
| **Agent threat modeling** | CSA MAESTRO | Multi-agent system threat modeling methodology |

### What's missing — the gaps nobody fills

Both GPT and Gemini research independently identified the same structural gaps:

1. **No unified operating model.** Standards bodies provide pieces. Vendors provide platform-specific solutions. Nobody provides the integrated playbook that shows how NIST + OWASP + CSA + OTel + ISO + EU AI Act fit together for a specific organization.

2. **No composable runtime governance architecture.** Vendor control planes are monolithic and ecosystem-specific. There's no vendor-neutral architecture for how governance attaches to arbitrary agent pipelines.

3. **No cross-ecosystem agent identity.** Identity works within platforms but not across them. NIST NCCoE is working on this but it's early.

4. **No transaction boundaries for agent actions.** GPT research: "Humans get approvals; agents need transaction boundaries." This is operationally dangerous and almost nobody addresses it.

5. **No unified quality + security + governance detection.** The landscape separates security monitoring (SIEM), quality monitoring (LLM observability), and compliance monitoring (GRC) into different tools with different event streams.

6. **No progressive governance architecture.** The landscape has maturity models but not architectural composition patterns that show what you build at each level.

---

## Our Differentiators — What We Uniquely Contribute

### 1. The Integrated Playbook

**What it is:** A single reference that synthesizes NIST, OWASP, CSA, ISO, OTel, EU AI Act, and industry practices into a coherent operating model with governance functions, lifecycle management, risk classification, and personas.

**Why it's needed:** Organizations don't have time to read 15 different frameworks and figure out how they fit together. They need someone to say: "Here's how you do this. Here's the approach. Use this from NIST. Apply that from OWASP. Structure your observability like this. Classify your risks like that."

**Why nobody else does it:** Standards bodies stay in their lane. Vendors optimize for their ecosystem. Consulting firms deliver custom engagements, not reusable playbooks. The integrator role is vacant.

### 2. The Rings Model — Composable Runtime Governance

**What it is:** A vendor-neutral logical architecture (Execution → Verification → Authorization → Learning) with a standard composability interface (PASS/REVISE/HALT/GATE/ERROR) and three deployment modes (wrapper, middleware, graph-embedded).

**What makes it different:**
- CSA has trust frameworks. OWASP has threat taxonomies. NIST has risk functions. **Nobody has a composable runtime governance architecture** that adapts its physical topology to the system type.
- The rings attach to any pipeline that meets ring-compatible requirements — not locked to any vendor or framework.
- Three deployment modes mean the same governance logic works for batch processing, coding agents, AND real-time conversational agents.

**Landscape comparison:** ServiceNow AI Control Tower, Salesforce Agentforce, and Microsoft Agent 365 all provide governance control planes — but they're ecosystem-specific. The rings model is ecosystem-neutral.

### 3. Composition Patterns — Progressive Build-Up

**What it is:** A five-level architecture composition from Minimum Viable Control Foundation through Full Governed Agentic System, showing exactly which capabilities to add at each level and why.

**What makes it different:** The landscape has maturity models (CSA ATF has "earned autonomy" tiers). But maturity models describe *organizational readiness*. Composition patterns describe *what to build architecturally*. "You're at Level 2 maturity" tells you where you are. "Build the Validation Pipeline next by adding these primitives" tells you what to do.

### 4. Primitive Interaction Tensions with Structural Resolutions

**What it is:** Explicit naming of conflicts between governance mechanisms (self-improvement vs. reproducibility, trust vs. gates, bounded agency vs. self-improvement, validation vs. cost, memory vs. noise, policy vs. learning) with architectural invariants that resolve them.

**What makes it different:** Every other framework presents its recommendations as harmonious. We name where they conflict and show how to resolve the conflicts. "The box can get smarter but cannot grow itself" is a design constraint no other framework articulates.

### 5. Decision Intelligence with Belief Revision

**What it is:** A governed decision-making architecture with structured decision persistence, the Belief Layer (governed epistemic state with revision cascades), adversarial self-critique, and decision replay.

**What makes it different:** CSA and NIST govern agent *actions*. Decision Intelligence governs agent *epistemic state* — what the system believes, how confident it is, and how beliefs revise when evidence changes. No framework or product in the landscape has anything like the Belief Layer.

### 6. Unified Observability (Quality + Security + Governance)

**What it is:** A single event-driven architecture that provides quality monitoring, security detection and response, AND governance compliance from one event stream.

**What makes it different:** The landscape separates these:
- Security monitoring → SIEM (Splunk, Chronicle)
- Quality monitoring → LLM observability (LangSmith, Arize)
- Compliance monitoring → GRC (OneTrust, Archer)

We unify them because in agentic systems, a quality degradation pattern might be a security attack. A governance violation might indicate a compromised agent. The event evidence is shared — separating detection domains loses critical correlation signal.

### 7. Zero Trust Applied Architecturally (Not Just as Policy)

**What it is:** Zero trust principles (never trust/always verify, least privilege, assume breach, verify explicitly, microsegmentation) applied as an architectural overlay that informs how every primitive is implemented and how every ring operates.

**What makes it different:** CSA's Agentic Trust Framework applies zero trust at the policy/identity level. We apply it architecturally — Ring 1 doesn't trust Ring 0's output. Ring 2 doesn't trust Ring 1's verification. No ring trusts any other ring by default. Zero trust is not just about agent-to-resource access control — it's about inter-ring trust within the governance architecture itself.

---

## Relationship to Existing Standards

We don't compete with standards. We integrate them.

| Standard | Our Relationship |
|----------|-----------------|
| **NIST AI RMF** | Our governance functions (Discover, Assess, Govern, Monitor, Evolve) map to AI RMF functions (Govern, Map, Measure, Manage). We implement AI RMF for agentic systems specifically. |
| **OWASP Agentic Top 10** | Our Adversarial Robustness primitive (#15) addresses these threats. Our observability layer detects them. We map our security detection to OWASP's threat taxonomy. |
| **CSA Agentic Trust Framework** | Our Trust Ladders and zero trust overlay align with CSA ATF. We extend it with architectural implementation (rings) and composition patterns. |
| **NIST NCCoE Agent Identity** | Our Identity & Attribution primitive (#14) implements the NCCoE's six identity governance areas. We reference SPIFFE/SPIRE, OAuth, OIDC as implementation paths. |
| **OpenTelemetry GenAI** | Our event architecture aligns with OTel semantic conventions for agent tracing. We extend with governance, security, and ring-level event semantics that OTel doesn't cover. |
| **ISO 42001** | Our framework provides the technical implementation that supports ISO 42001 management system requirements. ISO 42001 is organizational; we are architectural. |
| **EU AI Act** | Our capabilities map to Articles 9-15 high-risk requirements. We provide the technical mechanisms that produce the compliance evidence the Act demands. |
| **MITRE ATLAS** | Our threat model aligns with ATLAS agent-focused techniques. Our observability correlation rules detect ATLAS-cataloged attack patterns. |

**The positioning:** We are the integration layer. We don't replace any of these. We show how they compose into a working system.

---

## Outcomes We're Building Toward

### 1. The Playbook (White Paper / Reference Architecture)

A comprehensive guide that pulls together NIST, OWASP, CSA, ISO, OTel, EU AI Act, and industry practices into an actionable reference for organizations building governed agentic systems. This is the flagship deliverable.

**Format:** Starts as a white paper series. May evolve into a book or a formal reference architecture publication.

### 2. Community Products / Open Source

- Reference implementations of the ring architecture
- Agent specification templates with governance contracts built in
- Event envelope schemas aligned with OTel GenAI conventions
- Policy-as-code libraries for common governance rules
- Trust ladder calibration tools

### 3. Commercial Products

- AI Risk Tools assessment pipeline (current — evolving toward Governed Decision Flow)
- Agentic Observability platform (quality + security + governance detection)
- Decision Intelligence platform (belief revision, policy evaluation, decision provenance)
- Governance consulting engagements based on the framework

### 4. Thought Leadership

- White papers on specific framework areas (Trust Ladders, Rings Model, Belief Layer)
- Conference talks and workshops
- NIST RFI/RFC responses (CAISI, NCCoE)
- Industry working group participation (OWASP ASI, CSA, Linux Foundation AAIF)
- Blog posts and architecture write-ups

---

## Key Findings from Landscape Research (March 2026)

Three independent deep-research reports (Gemini, GPT, Claude/Compass) converge on the following:

### Landscape Consensus — What Everyone Agrees On

1. **Identity is the perimeter.** Cryptographic, workload-specific agent identity governed by zero trust is the required baseline. (NIST NCCoE, CSA ATF, OpenID Foundation, CyberArk, Microsoft Entra Agent ID)
2. **Agentic AI is categorically different** from static model deployment. It requires purpose-built governance, not extensions of LLM safety. (OWASP, NIST, CSA, DeepMind, Anthropic)
3. **Human oversight alone is insufficient.** Defense-in-depth combining human, AI-assisted, and automated oversight is necessary. Best protocols achieve ~52% oversight success. (DeepMind, Anthropic, scalable oversight research)
4. **Observability converging on OpenTelemetry.** GenAI semantic conventions are becoming the interoperable substrate. (OTel SIG, Datadog, Arize, LangSmith)
5. **Build now, don't wait.** Gartner projects 40% enterprise agent penetration by end of 2026. NIST agent-specific standards won't finalize before 2027. Sufficient building blocks exist today.

### Landscape Gaps — What Nobody Fills

1. **No unified operating model** that integrates all the pieces (confirmed by all three reports)
2. **No portable agent identity standard** across ecosystems — 53% still use static API keys (CSA survey)
3. **No generalized transaction model** for agent actions — rollback across systems is custom-built
4. **No quantitative risk assessment** connecting agent-specific factors (autonomy, tool access, irreversibility) to probabilistic loss estimates
5. **No production-ready agent provenance system** at enterprise scale
6. **Multi-agent governance** at 41-87% failure rates with no deployed framework addressing it (MAST study, 1,642 traces)

### Specific Research That Validates Our Architecture

| Research | What It Validates in Our Framework |
|----------|----------------------------------|
| **Anthropic's "Measuring AI Agent Autonomy"** | Trust Ladders — empirical data on how trust evolves (20%→40% auto-approval, sophisticated trust calibration) |
| **CSA Agentic Trust Framework** | Zero trust overlay + earned autonomy (Intern→Principal progression ≈ our Trust Ladders) |
| **OWASP Top 10 for Agentic Applications** | Adversarial Robustness (#15) — 10 specific threat vectors to map our security model against |
| **AgentSpec (ICSE 2026)** | Policy as Code (#9) — "a lightweight DSL for specifying runtime constraints on LLM agents" with 90%+ prevention rates |
| **SentinelAgent** | Our observability correlation engine — 92% accuracy in identifying harmful agent behaviors using OTel |
| **DeepMind "Intelligent AI Delegation"** | Rings model + Trust Ladders — 9-component delegation framework with 11-axis task taxonomy |
| **MAST multi-agent failure study** | Multi-agent coordination section — 14 failure modes, inter-agent misalignment at 36.9% of all failures |
| **SAGA security architecture** | Identity & Attribution (#14) — first fully implemented cryptographic access control for agent systems |
| **NIST NCCoE Identity Paper** | Identity as control plane — six governance areas mapping directly to our Identity primitive |
| **AgentGuard** | Trust Ladders + Ring 1 — probabilistic runtime verification suited to nondeterministic systems |
| **Singapore ARC Framework** | Risk Classification — 46 risks, 88 controls with risk-to-control mappings |

### Novel Concepts We Should Incorporate

From the Claude research report specifically:
- **Five-level autonomy model** (L1 Operator → L5 Observer) from University of Washington — could map to our Risk Tiers
- **AgentSpec as policy-as-code** — validates our primitive and provides a specific implementation reference
- **Trajectory-level explainability** — our provenance chains should think about temporal dynamics, not just point-in-time attribution
- **"Deployment overhang"** — models are capable of more autonomy than users grant. Trust, not capability, is the bottleneck. Confirms our Trust Ladders thesis.
- **PROV-AGENT** extending W3C PROV for agents — our provenance chains should reference this standard

---

## Where We Are Today

| Artifact | Status |
|----------|--------|
| Agentic Governance Framework (top-level) | First draft complete. Needs diagrams and review cycle. |
| Agentic Primitives (19 primitives, rings, zero trust) | Advanced. 3 external reviews, multiple iterations. P0.5 findings resolved. #19 (Agent Environment Governance) added. |
| Decision Intelligence | Updated. Mapped to primitives and rings. Needs diagrams and review. |
| Agentic Observability | Updated. Three roles, 18 correlation rules, maturity model. Needs diagrams and review. |
| Landscape Research | Gemini + GPT complete. Claude pending. Need synthesis. |
| Architectural Diagrams | 5 primitives diagrams complete. Framework, DI, AO diagrams needed. |
| Strategic Positioning | This document. |
