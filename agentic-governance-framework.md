# Agentic Governance Framework

**Status:** Living concept document
**Last updated:** 2026-03-16
**Purpose:** Top-level operating model for governing agentic systems across the full lifecycle. This is the umbrella framework — the three concept areas (Agentic Primitives, Decision Intelligence, Agentic Observability) are capability layers within it.

---

## Contents

1. [Why This Framework Exists](#why-this-framework-exists)
2. [Key Definitions](#key-definitions) — Agents, agentic workflows, models, and how they relate
3. [Framework Overview](#framework-overview)
4. [Governance Functions](#governance-functions) — The five things any organization must do
5. [Personas & Responsibilities](#personas--responsibilities)
6. [Agent Lifecycle](#agent-lifecycle) — From discovery through retirement
7. [Risk Classification](#risk-classification) — How risk level determines governance intensity
8. [Capability Layers](#capability-layers) — How the concept areas fit
9. [Integration with Enterprise Governance](#integration-with-enterprise-governance)
10. [Framework Maturity Model](#framework-maturity-model)
11. [Standards & Regulatory Alignment](#standards--regulatory-alignment)
12. [Open Questions](#open-questions)

---

## Why This Framework Exists

Agentic systems — AI systems capable of autonomous decision-making and action with limited human supervision — represent a fundamental shift in how organizations operate. These systems don't just generate content or answer questions. They take actions that affect real-world systems, data, and outcomes: processing documents, making assessments, executing transactions, managing infrastructure, interacting with customers.

Any system that acts autonomously on behalf of humans and organizations requires a structured process to govern its behavior, assess its risks, and ensure it operates as a safe, reliable, and trustworthy system. This is true whether the system is a single agent performing a focused task or a complex multi-agent workflow coordinating across organizational boundaries.

The governance principles required are not new. Separation of duties, least privilege, audit trails, zero trust architecture, policy as code, risk-based controls — these patterns have governed critical infrastructure for decades. Every consequential technology wave has required adapting established governance frameworks to new contexts:

- Cloud adoption adapted security models (zero trust replaced perimeter defense)
- DevOps adapted change management (CI/CD replaced change advisory boards)
- Data proliferation adapted privacy models (GDPR formalized data handling)

Agentic systems require the same adaptation. The principles endure. Their application to autonomous AI systems that reason, act, and interact across tools, data sources, and organizational boundaries is what this framework addresses.

This framework does not invent new governance principles. It adapts proven principles to the agentic context, organizes them into an operating model, and composes them into a system that organizations can implement progressively — starting with what matters most and building toward comprehensive governance as systems mature.

---

## Key Definitions

Clear terminology matters. These definitions align with emerging standards from NIST, industry, and the broader AI ecosystem.

### Models

A **model** (or foundation model, large language model) is a general-purpose AI system trained on broad data to perform reasoning, generation, and analysis tasks. Models are provided by model providers (Anthropic, OpenAI, Google, open-source communities) and accessed via APIs or local deployment.

A model by itself is not an agent. It is a reasoning capability — powerful but undirected.

### Agents

An **agent** is a runtime system that combines a foundation model with an **agent specification** — the instructions, constraints, tools, identity, and goals that direct the model's reasoning toward a defined purpose. Per NIST, an AI agent system consists of "at least one generative AI model and scaffolding software that equips the model with tools to take a range of discretionary actions" (NIST CAISI RFI, Jan 2026). The NCCoE further characterizes agentic architectures as systems that "take in some set of instructions, dynamically acquire additional context from other resources, process the results, potentially take some sort of action, and return a response" (NCCoE Concept Paper, Feb 2026).

Two components, distinct roles:

**The model** provides general-purpose reasoning capability — the ability to understand context, generate responses, and make inferences. Models are provided by model providers (Anthropic, OpenAI, Google, open-source communities) and are general-purpose by design.

**The agent specification** provides direction, boundaries, and authority:
- **Role and purpose:** What the agent is for
- **Constraints and boundaries:** What it can and cannot do (Bounded Agency)
- **Tools and data access:** What external capabilities and data sources it has
- **Output contracts:** What structured artifacts it produces
- **Identity:** Who it is and under what authority it acts

The model is the reasoning engine. The specification is the governance contract. Together, they form an agent — a system capable of autonomous decision-making and action within its declared scope.

An agent specification without a model is inert — a definition waiting to be instantiated. A model without a specification is undirected — capable but without purpose or boundaries. The agent is what emerges when both are combined and running, much like a container image becomes a process only when instantiated.

This distinction matters for governance because different aspects of the system require different governance approaches:
- **Model governance:** Model selection, version management, provider trust, training data provenance — these are properties of the model, not the specification
- **Specification governance:** Boundaries, tool access, output contracts, identity, authority delegation — these are properties of the specification
- **Runtime governance:** Whether the running agent actually operates within its specification — this is what the Agentic Primitives framework's rings address

### Agentic Workflows

An **agentic workflow** is a coordinated system of one or more agents, orchestration logic, tools, data sources, and human-in-the-loop checkpoints designed to accomplish a business objective. Agentic workflows are the unit of deployment and governance.

Examples:
- A document assessment pipeline (multiple agents processing a document through extraction, analysis, and reporting stages)
- A coding agent workflow (an agent that reads requirements, writes code, runs tests, and submits for review)
- A decision support workflow (agents gathering evidence, evaluating policy, recommending decisions for human approval)
- An operations automation workflow (agents monitoring systems, detecting anomalies, executing remediation playbooks)

### What This Framework Governs

This framework governs **agentic workflows** — the complete systems that take action. This includes:
- The agents within the workflow (their specifications, boundaries, identities)
- The orchestration logic (how agents coordinate, sequence, and resolve conflicts)
- The runtime behavior (what happens during execution — verification, authorization, learning)
- The lifecycle (from design through deployment through operation through retirement)

Systems that only use a model for generation without discretionary action — such as basic RAG (Retrieval-Augmented Generation) systems or simple chatbots — are outside the primary scope. The governance need scales with the system's **autonomy level and consequence of action**.

---

## Framework Overview

---

## Framework Overview

The Agentic Governance Framework operates across six layers:

```
┌──────────────────────────────────────────────────────────────┐
│  1. Governance Strategy & Policy                             │
│     Risk appetite, regulatory requirements, accountability,  │
│     operating policies, organizational model                 │
├──────────────────────────────────────────────────────────────┤
│  2. Agent Lifecycle Management                               │
│     Discovery, risk assessment, deployment gates,            │
│     runtime governance, continuous assurance, retirement     │
├──────────────────────────────────────────────────────────────┤
│  3. Runtime Governance (The Rings)                           │
│     Execution → Verification → Authorization → Learning     │
│     Three deployment modes: wrapper, middleware, graph       │
├──────────────────────────────────────────────────────────────┤
│  4. Observability & Security                                 │
│     Event fabric, correlation engine, detection & response,  │
│     audit packages, security monitoring, forensics           │
├──────────────────────────────────────────────────────────────┤
│  5. Decision Intelligence                                    │
│     Structured decisions with provenance, belief revision,   │
│     policy-as-code evaluation, decision replay               │
├──────────────────────────────────────────────────────────────┤
│  6. Primitives & Architecture                                │
│     16 proven patterns, zero trust, identity, composability  │
│     interface, versioned control-plane state                 │
└──────────────────────────────────────────────────────────────┘
```

**Layer 6 (Primitives)** is the foundation — the reusable building blocks.
**Layers 3-5** are the runtime capability areas — built on the primitives.
**Layer 2 (Lifecycle)** manages agents from cradle to grave.
**Layer 1 (Strategy)** sets the direction — what matters, what's required, who's accountable.

Organizations implement **bottom-up** (start with primitives, build capabilities) but govern **top-down** (strategy sets policy, lifecycle enforces it, runtime implements it).

---

## Governance Functions

Five functions that any organization governing agentic systems must perform. These are intentionally modeled on established governance frameworks (NIST CSF's Identify/Protect/Detect/Respond/Recover, NIST AI RMF's Map/Measure/Manage/Govern) but adapted for the agentic context.

### 1. DISCOVER

**Question:** "What agentic systems do we have, and what do they do?"

Before you can govern agents, you need to know they exist. This is the shadow AI problem — and it's the same problem shadow IT was a decade ago.

**Activities:**
- Agent inventory: what agentic systems are deployed, where, by whom
- Capability mapping: what can each agent do, what tools does it have, what data can it access
- Risk profiling: what's the blast radius if this agent goes wrong
- Dependency mapping: what other systems does this agent interact with
- Authority mapping: who authorized this agent, under what delegation chain

**Why most organizations skip this:** They don't think of agents as assets to be governed. They think of them as tools to be used. Discovery is the first governance function because everything else depends on knowing what you're governing.

### 2. ASSESS

**Question:** "What are the risks, and what governance does each agent need?"

Not every agent needs four rings of governance. A personal productivity agent has different risk characteristics than an autonomous trading system. Assessment determines the governance intensity.

**Activities:**
- Risk classification: categorize agents by consequence level (see Risk Classification below)
- Regulatory mapping: which regulations apply to this agent's domain (EU AI Act, state AI laws, industry regulations)
- Threat modeling: what could go wrong, what's the adversarial profile, what's the blast radius
- Control selection: which primitives, which rings, which deployment mode, which gate types
- Pre-deployment testing: evaluation suites, red-teaming, simulation, adversarial testing
- Approval gate: governance sign-off before deployment

**Connection to existing GRC:** This maps directly to traditional risk assessment processes. The difference is the subject — instead of assessing a vendor or a system, you're assessing an agentic workflow. The methodology (likelihood, impact, risk rating, control selection) is the same.

### 3. GOVERN

**Question:** "How do we ensure agents operate within boundaries during execution?"

This is where the Agentic Primitives framework lives — the runtime governance engine.

**Activities:**
- Ring activation: configure which rings operate for this agent at what intensity
- Policy deployment: load the applicable policy rules (Primitive #9)
- Gate configuration: set mandatory and adaptive gates (Primitive #8)
- Trust initialization: set the starting trust level based on assessment (Primitive #11)
- Identity binding: establish agent identity, model provenance, delegation chain (Primitive #14)
- Transaction boundaries: define which actions are reversible vs. irreversible (Primitive #16)

**The Rings (Layer 3) are the runtime implementation of this function:**
- Ring 0: Execution within declared boundaries
- Ring 1: Independent verification of output quality
- Ring 2: Policy evaluation and authorization
- Ring 3: Learning and trust evolution

**Deployment mode** depends on the agent type: wrapper for batch processing, middleware for multi-step agents, graph-embedded for real-time systems.

### 4. MONITOR

**Question:** "Are our agents behaving as expected, and can we detect when they're not?"

This is where Agentic Observability (Layer 4) lives — the unified monitoring, detection, and response layer.

**Activities:**
- Event ingestion: capture structured events from all rings, all agents
- Quality monitoring: track verification pass rates, convergence speed, human override patterns
- Security monitoring: detect ring bypass, trust manipulation, evidence tampering, memory poisoning
- Governance monitoring: track policy compliance, gate activation, provenance completeness
- Correlation: detect cross-event patterns that individual events don't reveal
- Alerting and response: trigger playbooks when patterns match rules
- Trust calibration: adjust trust levels based on empirical performance data

**Three detection domains from one event stream:** quality, security, governance. Traditional approaches separate these into different tools. Agentic Observability unifies them because the event evidence is shared.

### 5. EVOLVE

**Question:** "How do we get better at governing agents over time?"

Governance is not a one-time implementation. It's a continuous cycle. Agents change. Regulations change. Threats change. The governance system must learn and adapt.

**Activities:**
- Policy review: are existing policies still appropriate? Which rules produce false positives? Which gaps have been exposed?
- Trust evolution: are agents earning trust appropriately? Are trust ladders calibrated correctly?
- Cross-case learning: what patterns across many agent executions inform better governance?
- Incident review: when something goes wrong, what do we learn? What changes?
- Framework maturity: are we ready to advance to the next maturity level?
- Regulatory tracking: have requirements changed? Do we need to adjust?

**Ring 3 (Learning) is the runtime implementation of this function.** But EVOLVE also includes organizational learning that goes beyond what Ring 3 automates — policy workshops, incident retrospectives, regulatory analysis, governance program reviews.

### Function Cycle

The five functions are not sequential — they're a continuous cycle:

```
    DISCOVER → ASSESS → GOVERN → MONITOR → EVOLVE
        ↑                                      │
        └──────────────────────────────────────┘
```

New agents are discovered. Existing agents are re-assessed when context changes. Governance configuration evolves based on monitoring data. Monitoring feeds back into evolution. Evolution triggers re-assessment.

---

## Personas & Responsibilities

Four personas operate the framework. In small organizations, one person may wear multiple hats. In large organizations, these are distinct teams.

### Workflow Developers

**Who they are:** Engineers, developers, and technical builders who design, build, test, and deploy agentic workflows. This includes AI engineers, software engineers building agent specifications, prompt engineers, and teams integrating agents into business processes.

**What they do:** Define agent specifications (role, constraints, tools, output contracts), build orchestration logic, integrate with data sources and external systems, test and validate workflow behavior.

**What they need from the framework:**
- Clear guardrails: what their agents must do (structured output, bounded agency, identity)
- Testing tools: evaluation suites, adversarial test harnesses, simulation environments
- Deployment gates: clear criteria for "this workflow is ready for production"
- Ring-compatible pipeline requirements: what their pipeline must support for governance to attach
- Agent specification standards: how to define boundaries, identity, output contracts

**Framework touchpoints:** ASSESS (pre-deployment testing), GOVERN (ring-compatible pipeline requirements)

### Platform / Infrastructure Teams

**What they do:** Operate the agent infrastructure, observability, and governance runtime.

**What they need from the framework:**
- Observability infrastructure: event ingestion, correlation engine, dashboards
- Incident response tools: playbooks, forensic investigation, containment
- Trust management: trust ladder calibration, sentinel monitoring
- Ring infrastructure: verification layers, policy engines, gate UX

**Framework touchpoints:** GOVERN (ring infrastructure), MONITOR (observability operation), EVOLVE (trust calibration, system improvement)

### Governance / Risk / Compliance (GRC)

**What they do:** Set policy, assess risk, produce audit evidence, ensure regulatory compliance.

**What they need from the framework:**
- Policy management: author, version, deploy, and review governance rules
- Risk assessment tools: classify agents, model threats, select controls
- Audit packages: on-demand governance evidence for any scope
- Regulatory mapping: how the framework satisfies EU AI Act, NIST AI RMF, ISO 42001, industry-specific requirements
- Decision review: ability to inspect any decision's full provenance chain

**Framework touchpoints:** DISCOVER (agent inventory), ASSESS (risk classification), GOVERN (policy setting), MONITOR (compliance dashboards), EVOLVE (policy review)

### Business Owners, Team Leads & Product Managers

**Who they are:** The people accountable for what agents do in their domain. Business owners bear the consequences of agent actions. Team leads manage the people and processes around agentic workflows. Product managers define what agents should accomplish and why.

**What they do:** Authorize agent deployment, define business requirements, review and approve material decisions, set risk appetite for their domain, own the outcomes.

**What they need from the framework:**
- Trust visibility: are the agents in my domain performing reliably?
- Decision review: can I see what my agents decided and why?
- Override capability: can I intervene when something looks wrong?
- Risk dashboard: what's the current risk posture of my agentic workflows?
- Approval authority: I authorize deployment and I authorize material decisions

**Framework touchpoints:** ASSESS (authorize deployment), GOVERN (mandatory gate authority), MONITOR (trust and risk dashboards), EVOLVE (business requirement changes)

---

## Agent Lifecycle

Every agentic workflow moves through a lifecycle. The framework provides governance at each stage.

### Stage 1: Discovery & Registration

- Agent is identified (or discovered via shadow AI detection)
- Registered in agent inventory with: purpose, owner, domain, capabilities, data access
- Initial classification (see Risk Classification)

### Stage 2: Risk Assessment & Design

- Threat modeling: what could go wrong, what's the adversarial profile
- Regulatory mapping: which regulations apply
- Control selection: which rings, which deployment mode, which gates, which verification layers
- Architecture review: does this agent's design meet governance requirements

### Stage 3: Pre-Deployment Testing

- Evaluation suites: does the agent produce correct output on known test cases
- Adversarial testing: does the agent resist prompt injection, manipulation, edge cases
- Policy testing: do the configured policy rules produce appropriate results
- Integration testing: does the agent work within the ring infrastructure
- Approval gate: governance sign-off for production deployment

### Stage 4: Deployment & Trust Initialization

- Deploy with governance configuration (rings, policies, gates, trust level)
- Trust starts at LOW — full verification, all gates active
- Identity established: agent ID, model provenance, delegation chain bound
- Event emission confirmed: events flowing to observability layer
- Shadow mode optional: full governance, all gates auto-pass, calibrate before enforcing

### Stage 5: Runtime Governance

- Rings active: execution → verification → authorization → learning
- Events flowing to observability layer
- Trust evolving based on empirical performance
- Policy evaluated on every relevant action
- Human gates functioning at material decision points

### Stage 6: Continuous Assurance

- Ongoing monitoring via observability layer
- Periodic re-assessment: has the risk profile changed?
- Trust ladder reviews: is trust calibrated correctly?
- Policy reviews: are rules still appropriate?
- Regression testing: does the agent still perform on evaluation suites after configuration changes?
- Model change management: when the underlying model is updated, re-verify

### Stage 7: Retirement / Decommissioning

- Orderly shutdown: complete in-flight work, close open transactions
- Archive: preserve provenance chains, decision records, audit evidence
- Inventory update: mark agent as retired
- Access revocation: revoke agent identity, tool access, data access
- Post-retirement audit: was anything left in an inconsistent state?

---

## Risk Classification

Not every agent needs the same governance intensity. Risk classification determines which rings activate and at what level.

### Classification Dimensions

| Dimension | Low | Medium | High | Critical |
|-----------|-----|--------|------|----------|
| **Consequence of error** | Inconvenience, easily corrected | Business impact, costly to correct | Regulatory violation, significant harm | Irreversible harm, legal liability |
| **Data sensitivity** | Public data | Internal data | Confidential / PII | Restricted / regulated data |
| **Autonomy level** | Human reviews every output | Human reviews exceptions | Human reviews escalations only | Autonomous action within scope |
| **Blast radius** | Affects one user | Affects one team/department | Affects one organization | Affects customers/public |
| **Reversibility** | All actions reversible | Most actions reversible | Some irreversible actions | Primarily irreversible actions |

### Risk Tiers and Governance Response

| Risk Tier | Example | Ring Activation | Gate Types | Trust Start |
|-----------|---------|----------------|------------|-------------|
| **Tier 1: Low** | Personal productivity agent, internal content drafting | Ring 0 + minimal Ring 1 | Adaptive only | Medium |
| **Tier 2: Medium** | Document processing pipeline, code review agent | Ring 0 + Ring 1 + adaptive Ring 2 | Adaptive + selective mandatory | Low |
| **Tier 3: High** | Customer-facing agent, financial analysis, compliance assessment | Ring 0 + Ring 1 + full Ring 2 | Mandatory on material actions | Low |
| **Tier 4: Critical** | Autonomous trading, medical decision support, regulatory filing | All rings, full verification, full governance | Mandatory on all actions | Lowest (full human oversight) |

**Ring 3 (Learning) activates at all tiers** — every agent should improve over time. The difference is the autonomy Ring 3 has to apply improvements: Tier 1 may auto-apply; Tier 4 requires human approval for every configuration change.

**Trust Ladders operate within the tier.** A Tier 3 agent can earn reduced Ring 1 verification, but it cannot earn the right to skip mandatory Ring 2 gates. The tier sets the floor; trust ladders optimize within it.

---

## Capability Layers

The three concept areas are capability layers within the framework:

### Layer 6: Agentic Primitives (`agentic-primitives.md`)

**What it provides:** The 16 proven patterns, the rings model, the composability interface, the zero trust overlay, the deployment modes, the interaction tensions.

**Framework role:** Foundation. Everything else is built on these patterns. The primitives are the shared vocabulary across all layers.

**Governance functions served:** GOVERN (runtime implementation), EVOLVE (self-improving cycles)

### Layer 5: Decision Intelligence (`decision-intelligence.md`)

**What it provides:** Structured decision persistence, belief revision, policy-as-code evaluation, decision provenance, adversarial critique, decision replay.

**Framework role:** The mechanism for making and governing consequential decisions. A Governed Decision Flow (Ring 0 + Ring 1 + Ring 2) applied to risk-bearing decisions.

**Governance functions served:** GOVERN (decision authorization), MONITOR (decision quality), EVOLVE (cross-case learning)

### Layer 4: Agentic Observability (`agentic-observability.md`)

**What it provides:** Event fabric, correlation engine, quality/security/governance detection, playbooks and response, audit packages, trust calibration, forensics.

**Framework role:** The unified monitoring, detection, and response layer. Three roles: quality monitoring (Ring 3 intelligence), security detection and response, governance compliance.

**Governance functions served:** MONITOR (all three detection domains), EVOLVE (empirical trust calibration, improvement signals)

### Layers 1-3: This Document

**What it provides:** Governance strategy, agent lifecycle management, risk classification, persona model, governance functions.

**Framework role:** The organizational and operational context that the technical layers serve.

---

## Integration with Enterprise Governance

Organizations aren't greenfield. They have existing governance infrastructure. The Agentic Governance Framework integrates, not replaces.

### Integration Points

| Existing System | Integration Pattern | What Flows |
|----------------|-------------------|------------|
| **GRC Platform** (OneTrust, Archer, ServiceNow GRC) | Agentic Observability exports audit packages and compliance evidence | Policy compliance data, audit trails, risk assessments |
| **SIEM** (Splunk, Chronicle, Elastic) | Agentic Observability sends security alerts upstream | Security events, ring bypass detection, adversarial indicators |
| **IAM** (Okta, Azure AD, CyberArk) | Identity & Attribution (#14) integrates with existing identity infrastructure | Agent identity, delegation chains, human authorizer identity |
| **CMDB** (ServiceNow, BMC) | Agent inventory integrates with existing asset management | Agent registry, capability mapping, dependency mapping |
| **Change Management** (ServiceNow, Jira) | Agent lifecycle deployment gates integrate with existing change processes | Deployment approvals, configuration change records |
| **Incident Management** (PagerDuty, ServiceNow) | Observability playbooks escalate to existing incident workflows | Security incidents, governance violations, critical quality failures |
| **Data Governance** (Collibra, Alation, Purview) | Data identity in the framework connects to existing data classification | Data classification, PII handling rules, consent scope, retention policy |

### What the Framework Owns vs. What It Integrates With

**The framework owns:**
- Agent-specific governance logic (rings, primitives, composability)
- Agentic event semantics (the event envelope, ring signals, governance events)
- Trust ladders and verification calibration
- Decision provenance and belief revision
- Agentic-specific correlation rules

**The framework integrates with:**
- Enterprise identity (IAM)
- Enterprise security monitoring (SIEM)
- Enterprise risk management (GRC)
- Enterprise asset management (CMDB)
- Enterprise change management
- Enterprise data governance

The boundary is clear: the framework governs **agents specifically**. It connects to existing systems that govern **the enterprise broadly**.

---

## Framework Maturity Model

Organizations adopt the framework progressively. Trying to implement everything at once is a recipe for failure.

### Level 1: Awareness

- Agent inventory exists (even if incomplete)
- Basic risk classification applied
- Some agents have structured output and event logging
- No formal ring architecture
- **Most organizations are here or below**

### Level 2: Foundation

- Ring 0 + Ring 1 operational for high-risk agents
- Structured event capture flowing to basic dashboards
- Policy rules defined for critical governance domains
- Mandatory gates on highest-consequence actions
- Pre-deployment testing for new agents
- Agent identity established

### Level 3: Governed

- Full Ring 0 + Ring 1 + Ring 2 operational
- Agentic Observability at correlation level (not just logging)
- Trust ladders actively calibrating
- Audit packages producible on demand
- Policy-as-code with version management
- Integration with existing GRC and SIEM
- Governance functions (DISCOVER through EVOLVE) operating as a cycle

### Level 4: Adaptive

- Ring 3 (Learning) operational
- Self-improving cycles with regression detection
- Predictive quality and security monitoring
- Cross-agent and cross-case intelligence
- Automated playbook response for routine patterns
- Trust ladders driving meaningful efficiency gains
- Governance overhead decreasing as the system matures

### Level 5: Optimized

- Full framework operational across all agent types
- Continuous assurance with minimal manual intervention
- Governance is a competitive advantage, not just a compliance cost
- New agents onboarded with appropriate governance in days, not months
- Cross-organizational intelligence (federated learning, shared baselines)
- Governance posture is a trust signal for customers, regulators, and partners

**Realistic timeline:** Most organizations will take 12-24 months to reach Level 3. Level 4-5 requires operational data, organizational maturity, and likely 2-3 years.

---

## Standards & Regulatory Alignment

This framework is designed to complement and integrate with existing standards, not replace them. The governance principles are drawn from established frameworks; their application to agentic systems is the contribution.

### NIST AI Risk Management Framework (AI RMF)

The NIST AI RMF provides the foundational risk management structure. This framework's governance functions map to the AI RMF's four functions:

| AI RMF Function | AGF Governance Function | Relationship |
|----------------|------------------------|--------------|
| **GOVERN** | Governance Strategy & Policy (Layer 1) | AI RMF GOVERN establishes organizational AI risk governance. AGF Layer 1 implements it for agentic systems specifically. |
| **MAP** | DISCOVER + ASSESS | AI RMF MAP identifies AI system context and risks. AGF DISCOVER inventories agents; ASSESS classifies their risks. |
| **MEASURE** | MONITOR | AI RMF MEASURE quantifies AI risks. AGF MONITOR provides the observability infrastructure to measure agentic system behavior empirically. |
| **MANAGE** | GOVERN + EVOLVE | AI RMF MANAGE addresses risks. AGF GOVERN implements runtime controls; EVOLVE iterates based on findings. |

**Key NIST references:**
- NIST AI 100-1: AI Risk Management Framework (core framework)
- NIST AI 600-1: Generative AI Profile (GenAI-specific risks and mitigations)
- NIST AI 100-2e2025: Taxonomy of Attacks and Mitigations for Adversarial ML
- NIST AI 800-1: Managing Misuse Risk for Dual-Use Foundation Models
- NIST SP 800-218: Secure Software Development Framework

### NIST Agent Security & Identity

NIST is actively developing guidance specific to AI agent security and identity:

- **CAISI RFI on Security Considerations for AI Agents (Jan 2026):** Identifies three categories of agent-specific security risk: (1) adversarial attacks at training/inference time, (2) intentionally placed model backdoors, (3) uncompromised models exhibiting specification gaming. Recognizes three levels of security controls — model-level, agent system-level, and human oversight — which map to this framework's rings.

- **NCCoE Concept Paper on Software and AI Agent Identity and Authorization (Feb 2026):** Defines six areas for agent identity governance: identification, authentication, authorization, access delegation, logging/transparency, and data flow tracking. Evaluates standards including OAuth 2.0/2.1, OpenID Connect, SPIFFE/SPIRE, SCIM, NGAC, and MCP. Directly validates this framework's Identity & Attribution primitive (#14) and the zero trust overlay.

### NIST SP 800-207: Zero Trust Architecture

The framework's zero trust overlay is grounded in NIST SP 800-207, which defines zero trust principles for enterprise networks. This framework applies those same principles to agent-to-agent and agent-to-resource interactions: never trust, always verify; least privilege; assume breach.

### EU AI Act

The EU AI Act establishes requirements for high-risk AI systems (Articles 9-15) that map to framework capabilities:

| EU AI Act Requirement | AGF Coverage |
|----------------------|--------------|
| Risk management system (Art. 9) | ASSESS function, Risk Classification, Trust Ladders |
| Data governance (Art. 10) | Integration with enterprise data governance (planned) |
| Technical documentation (Art. 11) | Provenance Chains (#6), audit packages |
| Record-keeping (Art. 12) | Event-Driven Observability (#10), event architecture |
| Transparency (Art. 13) | Identity & Attribution (#14), decision memos |
| Human oversight (Art. 14) | Governance Gates (#8), mandatory gate class |
| Accuracy, robustness, cybersecurity (Art. 15) | Validation Loops (#2), Adversarial Robustness (#15), zero trust |

### ISO 42001: AI Management Systems

ISO 42001 establishes organizational requirements for responsible AI. This framework is more technical than ISO 42001 (which focuses on management systems), but the technical capabilities here support ISO 42001 compliance — particularly Annex A controls related to AI system monitoring, risk assessment, and human oversight.

### Emerging Agent-Specific Standards

| Standard | Status | Relevance |
|----------|--------|-----------|
| **OpenTelemetry GenAI Semantic Conventions** | In development | Standardizing agent event tracing. The framework's event architecture should align with OTel semantics for interoperability. |
| **Model Context Protocol (MCP)** | Active | Protocol for agent-to-tool interaction. MCP relies on OAuth/OIDC for authorization — aligns with Identity & Attribution (#14). |
| **Agent-to-Agent Protocol (A2A)** | Early | Protocol for inter-agent communication. Relevant to Multi-Agent Coordination and cross-pipeline governance. |
| **SPIFFE/SPIRE** | Mature | Workload identity for agents. A candidate implementation for agent identity verification at ring boundaries. |
| **Next Generation Access Control (NGAC)** | Standard | Attribute-based access control for fine-grained agent authorization. Supports policy-as-code (#9) and bounded agency (#7). |

---

## Open Questions

- **Enterprise adoption path:** What's the minimum viable implementation? Which governance function do you start with? (Likely: DISCOVER + ASSESS for inventory and risk classification, then GOVERN with Ring 0 + Ring 1 for highest-risk agents.)
- **Tooling landscape:** Which parts of this framework need new tooling vs. can be served by existing tools with agentic extensions? Ring infrastructure and agentic observability likely need new tooling. Risk assessment and lifecycle management could extend existing GRC platforms.
- **Personal vs. enterprise:** The framework is written for organizations. What's the "personal governance" version? Likely: DISCOVER (know what agents you run), ASSESS (understand what they can do), GOVERN (Ring 0 + basic Ring 1), MONITOR (basic trust visibility). Simplified but structurally the same.
- **Framework positioning:** Is this framework IP, or is it thought leadership? If IP: how do you protect it? If thought leadership: how do you monetize it? The framework itself is likely thought leadership and community contribution. The implementations — products built on the framework — are the commercial layer.
- **NIST engagement:** The CAISI RFI and NCCoE concept paper are both seeking public comment. This framework directly addresses many of their questions. Consider submitting a response.
