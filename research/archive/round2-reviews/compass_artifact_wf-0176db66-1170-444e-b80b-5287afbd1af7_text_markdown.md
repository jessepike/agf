# Round 2 adversarial review of the Agentic Primitives framework

The framework has improved materially since Round 1, but the expansion from 14 to 18 primitives introduced new architectural contradictions, the prior art mapping undersells critical competing work, one key citation is verifiably wrong on venue, and the security architecture—while directionally sound—lacks the operational specificity a CISO or platform engineer would need to act on it. The document is not yet ready for publication as a reference architecture. What follows is a section-by-section accounting of where it succeeds, where it papers over gaps, and where new problems have emerged.

---

## 1. Round 1 response scorecard

**No security/adversarial model → Three-level security architecture added: PARTIALLY ADDRESSED.** The three-level decomposition (Fabric / Governance / Intelligence) is a reasonable novel synthesis drawing recognizable parallels to NIST SP 800-207's PEP/PDP/PIP architecture and established SOAR stack patterns. It is not, however, a recognized standard model from any established body. The document should acknowledge this novelty rather than presenting the decomposition as self-evident. More critically, the security architecture reads as a taxonomy of concerns rather than an implementable specification. There are no data-flow diagrams showing how a request traverses all three levels, no latency budget for security checks, and no failure-mode analysis for what happens when Level 3 Intelligence is itself compromised. The OWASP threat mapping (discussed below) covers breadth but not depth—several ASI threats get only one-sentence treatment.

**No data governance primitive → Primitive #17 added: PARTIALLY ADDRESSED.** The primitive exists but its boundaries are poorly drawn. Data governance overlaps with Primitive #15 (Adversarial Robustness, which must address data poisoning per ASI06), with Ring 2 governance gates (which enforce data-access policies), and with Primitive #6 (Provenance Chains, which track data lineage). The document does not define a clear "seam" between these overlapping concerns. A platform engineer reading #17 would struggle to determine which component owns data classification versus data lineage versus data access control. The EU AI Act Article 10 requires data governance practices covering collection, preparation, bias examination, and representativeness—#17 needs to explicitly map to these requirements.

**Cross-ring iteration budget → execution_budget added to composability interface: FULLY ADDRESSED.** The execution budget concept with token limits, time limits, and cost caps aligns with the emerging industry pattern of "budget contracts" now documented in FinOps literature. LangGraph implements recursion limits; the InfoWorld "FinOps for Agents" formalization (2026) describes five-dimensional guardrails (loop cap, tool-call cap, token budget, wall-clock timeout, tenant budgets). The framework's execution_budget correctly identifies this as a composability-layer concern. One gap: the budget should include a **tool-call cap** as a distinct dimension, since tool invocations carry wildly different costs and risk profiles than token generation.

**Missing tensions → Six named tensions with resolutions added: PARTIALLY ADDRESSED.** The Observability-vs-Privacy and Explainability-vs-Capability tensions are correctly identified as fundamental. The resolutions, however, read as wishlists ("use differential privacy," "use tiered explainability") rather than architectural decisions with concrete tradeoffs. A tension resolution should state: under condition X, we sacrifice Y amount of Z. Instead, the resolutions suggest both sides can be satisfied simultaneously, which undermines the point of naming the tension. The document should also add **Governance Latency vs. User Experience** as a seventh tension—Microsoft's Agent Governance Toolkit benchmarked deterministic governance at sub-millisecond overhead but LLM-based governance at **~500ms per decision**, which fundamentally changes system design.

**Human interface requirements at gates → Section added: PARTIALLY ADDRESSED.** Evidence presentation, rubber-stamping detection, timeout behavior, and cognitive load management are the right concerns. The gap is implementation specificity. "Rubber-stamping detection" is stated as a requirement but no mechanism is proposed. Research on automation bias (EU AI Act Article 14 explicitly requires humans to be able to "fully understand AI system capabilities/limitations") suggests this requires more than UI design—it requires randomized challenge questions, forced-delay mechanisms, and audit trails showing review duration. The section should cite the Akto survey finding that **79% of enterprises have blindspots** where agents invoke tools that security teams cannot fully observe, making human oversight at gates a visibility problem, not just a UX problem.

---

## 2. New issues introduced by the expansion

The jump from 14 to 18 primitives created problems that did not exist in Round 1.

**The primitive boundary problem is now acute.** With 18 primitives across 4 rings, the document faces a combinatorial explosion of interaction points. The original 14 primitives already had tension; adding #15 (Adversarial Robustness), #16 (Transaction & Side-Effect Control), #17 (Data Governance), and #18 (Evaluation & Assurance) creates at least three zones of unclear ownership. Adversarial Robustness (#15) must address prompt injection (ASI01), tool poisoning (ASI02), memory poisoning (ASI06), and rogue agents (ASI10)—but the Security Fabric (Level 1) also claims input sanitization, output scanning, and runtime containment. Who owns the detection of a tool poisoning attack: #15, the Security Fabric, or #17 (since the poisoned data flows through data governance)? The document needs a **responsibility assignment matrix** mapping each OWASP ASI threat to exactly one owning primitive and one owning security level.

**Primitive #18 breaks the ring model.** The document acknowledges that Evaluation & Assurance operates "outside the ring pipeline." This is not a minor architectural footnote—it is a structural contradiction. The Rings Model (Ring 0-3) is presented as the fundamental organizing principle. A primitive that operates outside it either (a) proves the ring model is incomplete and needs a fifth category, or (b) should be decomposed into ring-resident components. Evaluation during development belongs outside the pipeline, but runtime assurance checks (continuous monitoring, drift detection) belong in Ring 1 (Verification) or Ring 3 (Learning). Conflating pre-deployment evaluation with runtime assurance in a single primitive that floats outside the architecture weakens the ring model's claim to completeness.

**The governance collapse rule needs stress-testing against the Security Response Bus.** The multi-agent coordination patterns include a governance collapse rule (presumably collapsing distributed governance to a single authority under certain conditions). The Security Response Bus provides a pre-authorized fast-path from Intelligence to Fabric bypassing Governance. These are two separate bypass mechanisms for governance deliberation. The document does not address what happens when both activate simultaneously, or when the collapse rule would route to a governance authority that the Security Response Bus has already bypassed. This creates a potential **governance deadlock or double-bypass** scenario that must be specified.

**The "named, not coined" positioning is harder to sustain at 18 primitives.** At 14 primitives, the claim that the contribution is composition, not invention, was credible. At 18, with REVISE(context) transaction semantics, a Security Response Bus, and objective attestation—none of which appear as established named patterns in the literature—the document is doing more invention than it acknowledges. REVISE(context) is a novel formulation. The Security Response Bus is a named pattern for what SOAR platforms already do. Objective attestation is a frontier research concept. Owning the novelty would strengthen the document's credibility rather than weakening it.

---

## 3. Security architecture deep dive

### The three-level model: where it holds and where it breaks

The Fabric/Governance/Intelligence decomposition is architecturally defensible as a layered enforcement model. It maps cleanly to the PEP/PDP/PIP pattern in NIST SP 800-207 (Zero Trust Architecture) and to the Protect/Govern/Detect collapse of NIST CSF 2.0's six functions. It holds for the common case: a request enters Ring 0, Fabric enforces boundary checks, Governance evaluates policy, Intelligence monitors for anomalies.

It breaks in three places. First, **Level 3 Intelligence depends on Level 1 Fabric for its telemetry data**, but the document presents them as hierarchical (Intelligence above Fabric). In practice, if Fabric's logging is compromised, Intelligence is blind. This circular dependency is not addressed. Second, the model assumes **Governance can always be consulted synchronously**, but in graph-embedded deployment mode (concurrent/speculative execution), governance decisions may need to be made speculatively and reconciled later—the model doesn't specify how. Third, **semantic security evaluation** is listed under Level 2 (Governance) but requires the behavioral analysis capabilities of Level 3 (Intelligence). Determining whether an agent's output is semantically harmful requires exactly the kind of correlation and analysis that Intelligence provides.

### The Security Response Bus: sound concept, under-specified guardrails

The concept has strong precedent. AWS CloudWatch Events Bus routes GuardDuty findings directly to Lambda functions for automated containment. SOAR playbook automation does exactly what the Security Response Bus describes. SentinelOne's STAR system "connects layers with machine-speed playbooks." The concept is architecturally sound.

The under-specification is in the guardrails. The document must address: (1) Which specific threat classes qualify for fast-path response? The OWASP ASI list provides 10 categories—presumably not all warrant bypass. (2) What prevents an adversary from **triggering the fast-path to cause denial of service**—intentionally creating conditions that look like ASI08 (Cascading Failures) to shut down legitimate agent pipelines? (3) How are false-positive cascades prevented? Industry literature consistently warns that "when automation fires without investigation, speed increases, but confidence drops." (4) What audit trail records the bypass? (5) How frequently are fast-path playbooks reviewed? Without these specifications, the Security Response Bus is a governance vulnerability masquerading as a security feature.

### OWASP threat mapping: honest but incomplete at the per-threat level

The OWASP Top 10 for Agentic Applications (2026) is confirmed as a real document, published December 2025 by the OWASP GenAI Security Project with 100+ researchers and an Expert Review Board including NIST representatives. The ten threats (ASI01 through ASI10) are verified.

The mapping's honesty depends on depth. Several threats require dedicated treatment:

- **ASI04 (Agentic Supply Chain Vulnerabilities)** is particularly relevant given MCP's known tool poisoning and rug-pull vulnerabilities. The framework's supply chain coverage appears limited to "supply chain trust" in Level 2 Governance. MCP servers run locally with full host access, community-built servers undergo no security review, and the spec lacks mandatory tool integrity verification. The framework needs a dedicated supply chain control mapping, not a one-line entry.
- **ASI06 (Memory & Context Poisoning)** directly threatens Primitive #12 (Memory-Augmented Reasoning). The framework should specify how memory integrity is verified—the Gemini Memory Attack demonstrated real exploitation of persistent agent memory.
- **ASI07 (Insecure Inter-Agent Communication)** maps to the A2A protocol's known gaps: no token lifetime enforcement, coarse-grained scopes, no consent mechanisms. The framework should explicitly address what A2A does not provide.
- **ASI09 (Human-Agent Trust Exploitation)** connects to the human interface requirements but the document treats this as a UX concern rather than a security threat requiring active countermeasures.
- **ASI10 (Rogue Agents)** is the hardest to map because it encompasses goal misalignment, reward hacking, and self-replication—behaviors that may not be detectable by any of the three security levels until consequences manifest.

### Objective attestation: feasible but aspirational for 2026

The cryptographic primitives exist. TPM-based attestation, TEE-based attestation (Intel TDX, NVIDIA Hopper Confidential Compute), and hash chain verification are mature technologies. EQTY Lab's Verifiable Compute is a production system providing cryptographic attestation of AI workflow governance. A February 2026 paper on Authenticated Workflows proposes a WorkflowIntegrityVerifier with cryptographic integrity checks at step boundaries.

However, "cryptographic goal-state verification at ring boundaries" requires something beyond platform attestation—it requires formalizing what "goal state" means for an agentic system in a way that can be cryptographically verified. This is closer to formal verification of agent objectives than to hardware attestation of platform state. The document should distinguish between **platform attestation** (mature, implementable today) and **semantic goal attestation** (research frontier, not implementable at scale in 2026).

### Citation accuracy

| Citation | Verdict | Issue |
|---|---|---|
| SAGA (ACM CCS 2025) | **VENUE WRONG** | Actual venue is **NDSS 2026**, not ACM CCS 2025. Paper by Syros et al., Northeastern University. arXiv:2504.21034. |
| AgentSpec (ICSE 2026) | **Accurate** | Confirmed at ICSE 2026, Rio de Janeiro. Wang et al., SMU. |
| SentinelAgent | **Ambiguous** | Multiple papers exist (Gosmar & Dahl arXiv Sep 2025; graph-based anomaly detection arXiv May 2025). No single canonical paper at a top venue. Document must specify which. |
| AgentGuard | **Ambiguous** | Multiple papers (Koohestani at ASE 2025 workshop; Chen et al. Feb 2025). Must specify which. |
| DeepMind Intelligent AI Delegation (2602.11865) | **Accurate** | Confirmed. Tomašev, Franklin, Osindero at Google DeepMind. February 2026. |

The SAGA citation error is not trivial—it misattributes a paper to the wrong top venue, which undermines the document's credibility as a careful synthesis. This must be corrected.

---

## 4. Deployment modes assessment

**The governance/latency tradeoff holds and is well-supported.** Microsoft's Agent Governance Toolkit measured deterministic governance at **0.43 seconds total over 11 days and 7,000+ decisions** (sub-millisecond per decision), versus approximately one hour for LLM-based governance over the same period. Bifrost AI Gateway measured gateway-level enforcement at **11 microseconds** at 5,000 RPS. SHAP/LIME explainability tools can "easily double compute resources and latency." The tradeoff is real, but the document should distinguish between **deterministic governance** (negligible overhead) and **LLM-based governance** (significant overhead)—these are architecturally different choices with different latency profiles, not points on a single continuum.

**Hybrid deployment is practical and already in production.** LangGraph's state machine architecture is precisely a middleware/interrupt pattern with graph-embedded subsections. Microsoft's Agent Framework merges orchestration with event-driven multi-agent coordination. Salesforce Agentforce uses a supervisor agent (middleware) routing to specialists (which may internally use graph-embedded patterns). The document's hybrid claim is validated by market practice.

**"Wrapper mode is the special case" is directionally correct but overstates 2026 reality.** Anthropic's own guidance still recommends "finding the simplest solution possible." Deloitte reports only **11% of organizations** actively using agentic AI in production, with 42% still developing strategy. Among organizations in production, simpler patterns dominate. The trajectory toward middleware and graph-embedded modes is clear—Gartner expects a third of agentic AI deployments to be multi-agent by 2027—but for the 2026 market, wrapper mode remains the most common starting point. The document should say "wrapper mode is becoming the special case" rather than stating it as current fact.

**The mode selection matrix misses two important characteristics.** First, **regulatory classification**: EU AI Act high-risk systems (Articles 9-15 compliance deadline August 2, 2026) may be required to use wrapper or middleware mode to satisfy Article 14's human oversight requirements—graph-embedded mode's reduced governance clarity may be incompatible with demonstrating "effective human oversight." Second, **observability maturity**: organizations without OTel GenAI instrumentation cannot meaningfully operate in graph-embedded mode because they cannot trace concurrent governance decisions. The matrix should include regulatory tier and observability maturity as selection factors.

---

## 5. Durability re-ranking of all 18 primitives

Ranked from most durable (will remain relevant in 5-10 years) to most vulnerable to obsolescence, with rationale:

**Tier 1 — Bedrock (10+ year durability)**

1. **#1 Separation of Producer and Verifier** — Fundamental to any trustworthy system. Independent verification is a timeless principle from financial auditing to software testing. No foreseeable technology eliminates the need for it.
2. **#14 Identity & Attribution** — Agent identity management is only becoming more critical as agent populations grow. NIST's February 2026 AI Agent Standards Initiative has agent identity as a core pillar. The SAGA paper's core contribution is cryptographic agent identity.
3. **#7 Bounded Agency** — Least-privilege for agents is the zero-trust equivalent for AI. Every governance framework surveyed (CSA ATF, Singapore IMDA, KPMG TACO) includes agent scope limitation as foundational.
4. **#6 Provenance Chains** — EU AI Act Article 12 requires automatic logging and traceability. Data lineage requirements are expanding, not contracting. Blockchain-based provenance is being explored for agent action trails.
5. **#8 Governance Gates** — Human oversight requirements are codified in law (EU AI Act Article 14). Even as agents become more capable, decision checkpoints at risk boundaries will persist.

**Tier 2 — Durable with evolution (5-8 year durability)**

6. **#10 Event-Driven Observability** — OTel GenAI conventions are in Development status but backed by Microsoft, Cisco, and the OTel community. The signal format will evolve; the need for event-driven agent observability will not.
7. **#17 Data Governance & Confidentiality** — EU AI Act Article 10 mandates this. Data governance is permanent; the specific mechanisms will change as privacy-enhancing technologies mature.
8. **#9 Policy as Code** — OPA, Cedar, and Kyverno are establishing this pattern. The document's framing will persist even as policy languages evolve. Microsoft's AGT already uses YAML-based policy configuration.
9. **#16 Transaction & Side-Effect Control** — SagaLLM (VLDB 2025) validates that transaction semantics for agents is a real research area. As agents take more real-world actions, compensation and rollback become essential.
10. **#13 Error Handling & Recovery** — Cascading failures (ASI08) make this permanently necessary. The specific recovery patterns will evolve but the primitive persists.
11. **#2 Validation Loops with Convergence Gates** — Iterative refinement is fundamental to agent quality. The convergence mechanism may be subsumed into model capabilities but external validation loops remain necessary for governed systems.
12. **#11 Trust Ladders** — CSA ATF's promotion model (Intern → Junior → Senior → Principal) is essentially a trust ladder. Progressive autonomy based on demonstrated performance is becoming standard.
13. **#15 Adversarial Robustness** — MITRE ATLAS added 14 agentic AI techniques in October 2025. The threat landscape is expanding. However, as models become more robust natively, the external robustness primitive may be partially absorbed.

**Tier 3 — Vulnerable to transformation (3-5 year durability)**

14. **#18 Evaluation & Assurance** — UK AISI Inspect and METR evaluations validate the need, but evaluation methodology is evolving rapidly. This primitive's "outside the ring" positioning makes it architecturally unstable, and it may be decomposed into ring-resident components.
15. **#5 Structured Output Persistence** — As models improve at structured output generation natively (function calling, tool use), the need for external structured output enforcement diminishes. The persistence layer remains but the "structured output" framing may be absorbed.
16. **#4 Adversarial Critique** — Red-teaming and adversarial testing are important now but may be largely automated within model training pipelines. Constitutional AI and RLHF already internalize some of this.
17. **#12 Memory-Augmented Reasoning** — Currently critical for agent performance, but as context windows expand (already at 1M+ tokens) and models develop better native memory, this external primitive becomes less necessary. ASI06 (Memory & Context Poisoning) also makes external memory a growing attack surface.

**Tier 4 — Most vulnerable to obsolescence (1-3 years)**

18. **#3 Self-Improving Cycles** — The document correctly identifies this as most likely to be subsumed. As foundation models improve at meta-learning and self-correction, external self-improvement infrastructure becomes redundant. This is the first primitive that will be absorbed into model capabilities.

---

## 6. Top 5 remaining gaps

**Gap 1: No supply chain security model for the MCP/A2A ecosystem.** MCP tool poisoning, rug-pull attacks, and cross-server poisoning are documented, active vulnerabilities. A2A lacks consent mechanisms and has coarse-grained authorization. The framework mentions "supply chain trust" in Level 2 Governance but provides no operational model for how an organization should vet, monitor, and revoke MCP servers or A2A agent connections. The OWASP ASI04 (Supply Chain Vulnerabilities) threat deserves a dedicated architectural response, not a checkbox. The CSA MAESTRO framework's Layer 4 (Deployment & Infrastructure) and Layer 7 (Agent Ecosystem) provide more actionable threat modeling here.

**Gap 2: Major missing prior art undermines the "named, not coined" claim.** The document omits several frameworks that directly compete with or complement its architecture: **NIST IR 8596** (Cybersecurity AI Profile, December 2025), which maps AI agent security onto CSF 2.0; **Singapore IMDA's Model AI Governance Framework for Agentic AI** (January 2026), the world's first government framework specifically for agentic AI; **CSA MAESTRO** (February 2025), a seven-layer threat modeling framework for agentic AI that has been applied to OpenAI and Google APIs; **SagaLLM** (VLDB 2025), which formalizes the Saga pattern for multi-agent transactional systems—directly relevant to Primitive #16; **AGNTCY** (Cisco → Linux Foundation, July 2025), providing agent discovery, identity, messaging, and observability infrastructure; the **Agentic AI Foundation (AAIF)** under the Linux Foundation, which now houses MCP, A2A, AGNTCY, and AGENTS.md with gold members Anthropic, OpenAI, Google, Microsoft, and AWS; and NIST's **AI Agent Standards Initiative** (launched February 2026) with its NCCoE concept paper on agent identity. Omitting these makes the prior art mapping look incomplete and risks the document being perceived as insufficiently researched by informed readers.

**Gap 3: The composability interface lacks a responsibility assignment matrix.** Eighteen primitives, four rings, three security levels, three deployment modes, and a Security Response Bus create a combinatorial space that the document does not resolve into clear ownership boundaries. When an ASI01 (Agent Goal Hijack) attack occurs, which primitive detects it? Which security level contains it? Which ring processes the response? The document needs an OWASP-ASI-to-primitive mapping table showing exactly one owner per threat, with supporting and consulted roles. Without this, implementers will either duplicate controls (wasting resources) or leave gaps (creating vulnerabilities).

**Gap 4: No operational runbook or reference implementation path.** A CISO reading this document would flag the absence of: agent inventory requirements (what agents exist, what can they access), incident response procedures specific to agent compromise, compliance audit procedures for EU AI Act Articles 9-15 (deadline August 2, 2026), and integration guidance for existing SIEM/SOAR infrastructure. A platform engineer would flag: no API specifications for ring boundary interfaces, no schema for governance events in OTel format, no reference implementation for even one deployment mode, and no guidance on which existing tools (LangGraph, Temporal, OPA, OTel) map to which primitives. The document operates at the architectural level but provides no bridge to implementation. The Microsoft Agent Governance Toolkit—which is open-source, has sub-millisecond governance enforcement, and ships with YAML-based policy configuration—provides a concrete reference that this document should benchmark against.

**Gap 5: The economic model needs empirical grounding.** The "cost of governance" model is conceptually interesting but apparently lacks empirical validation. Published data exists and should be incorporated: Microsoft AGT's **0.43 seconds of governance overhead across 7,000 decisions**; Bifrost's **11 microseconds** for gateway-level enforcement; the finding that SHAP/LIME **double compute costs**; Stevens Institute's documentation that **10-cycle Reflexion loops consume 50x tokens** of a single pass; and Gartner's warning that **over 40% of agentic AI projects will be canceled by 2027** due to escalating costs. The economic model should use these data points to produce concrete cost curves rather than abstract formulas.

---

## 7. Overall verdict

**Not yet ready for publication as a reference architecture.** The framework demonstrates genuine architectural thinking and correctly identifies the composition problem—no single standard covers the full governance surface for agentic systems. The Rings Model is a useful organizing metaphor, the three deployment modes reflect real market patterns, and the execution budget mechanism addresses a genuine operational need. Several primitives (#1, #7, #8, #14) are well-defined and durable.

However, five issues must be resolved before publication. First, the **SAGA citation must be corrected** (NDSS 2026, not ACM CCS 2025) and ambiguous citations (SentinelAgent, AgentGuard) must be pinned to specific papers. Second, the **missing prior art**—particularly NIST IR 8596, Singapore IMDA, CSA MAESTRO, SagaLLM, and AGNTCY/AAIF—must be mapped, or the document will be seen as incomplete by anyone familiar with the 2025-2026 landscape. Third, the **primitive boundary problem** created by the expansion to 18 needs resolution through a responsibility assignment matrix and clearer seams between #15/#17/Security Fabric/Ring 2. Fourth, **Primitive #18's "outside the ring" status** must be resolved—either expand the model to accommodate it or decompose it into ring-resident components. Fifth, the document needs at minimum a **mapping table from OWASP ASI01-ASI10 to specific primitives and security levels**, demonstrating that the architecture actually covers the threat landscape it claims to address.

The framework is approximately **one revision away from publishable**. The architectural vision is sound; the execution on specificity, citations, and boundary definitions is not yet sufficient for a document that positions itself as a reference architecture. A reference architecture must be implementable. This document is currently a reference *taxonomy* with architectural aspirations.