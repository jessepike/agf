# AGF Security Profile: Securing Governed Agentic Systems

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Parent:** [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md)

---

## Who This Is For

CISOs, security architects, application security teams, red teams, SOC analysts, and anyone responsible for the security posture of systems that include autonomous AI agents.

**The key question this profile answers:** *What are the threats to my agentic systems, and how does AGF's architecture defend against each one?*

**Prerequisites:** Familiarity with the [Rings Model and core concepts](../docs/agf-reference-architecture.md#core-concepts) in the AGF meta document. This profile does not re-explain the ring architecture — it shows how security operates within it.

---

## Contents

1. [The Security Challenge](#the-security-challenge)
2. [The Three-Level Security Model](#the-three-level-security-model)
3. [The Security Response Bus](#the-security-response-bus)
4. [Zero Trust for Agentic Systems](#zero-trust-for-agentic-systems)
5. [Threat Analysis: OWASP Top 10 for Agentic Applications](#threat-analysis-owasp-top-10-for-agentic-applications)
6. [Threat Analysis: OWASP MCP Top 10](#threat-analysis-owasp-mcp-top-10)
7. [The Agent Environment as Attack Surface](#the-agent-environment-as-attack-surface)
8. [CSA Agentic Trust Framework Alignment](#csa-agentic-trust-framework-alignment)
9. [Security Primitives Reference](#security-primitives-reference)
10. [Known Limitations and Open Questions](#known-limitations-and-open-questions)
11. [Security Assessment Checklist](#security-assessment-checklist)

---

## The Security Challenge

Agentic systems introduce a fundamentally different threat surface from traditional software. An autonomous agent doesn't just process data — it reasons, selects tools, executes actions, communicates with other agents, and modifies its own behavior over time. Every one of these capabilities is an attack vector.

The traditional security stack — firewalls, WAFs, SAST/DAST, IAM — was built for deterministic software that does what it's told. Agentic systems are non-deterministic, autonomous, and capable of taking actions their developers never explicitly programmed. A compromised agent doesn't just leak data — it can manipulate decisions, escalate its own privileges, coordinate with other compromised agents, and gradually poison the systems that govern it.

**Why a unified security architecture matters:** The landscape fragments agentic security into separate silos — quality monitoring (LLM observability platforms), security monitoring (SIEM), and compliance monitoring (GRC tools). AGF argues this fragmentation is itself a vulnerability. A quality degradation pattern might be a security attack. A compliance anomaly might indicate behavioral drift. A performance issue might mask a privilege escalation. The three-level security model unifies these domains because agentic threats don't respect domain boundaries.

---

## The Three-Level Security Model

Security in AGF is not a single ring, layer, or feature. It is a pervasive architectural concern operating at three distinct levels — each with different temporal characteristics, enforcement mechanisms, and failure modes.

### Level 1: Security Fabric — Enforcement

**What it is:** The embedded security substrate active at every ring boundary. Always on, synchronous, wire-speed.

**What it does:**

| Capability | Description | Temporal |
|-----------|-------------|----------|
| **Input sanitization** | Every input to any ring is treated as potentially adversarial. Prompt injection detection, context boundary enforcement, payload validation. | Per-interaction (μs–ms) |
| **Output scanning** | Every output inspected before crossing a ring boundary. Known pattern detection, classification markers, integrity assertions. | Per-interaction (μs–ms) |
| **Runtime containment** | Sandboxing, resource limits, execution isolation. Compromised agents have bounded blast radius. | Always active |
| **Ring integrity verification** | Each ring verifies its configuration matches its authorized state (signed manifest). | Per-interaction (μs–ms) |
| **Identity enforcement** | Per-interaction cryptographic identity verification at every boundary. No ring trusts another's output by origin alone. Aligned with SAGA's per-interaction access control (NDSS 2026). | Per-interaction (μs–ms) |
| **Configuration attestation** | Control-plane configuration verified against signed deployment manifest. Divergence triggers containment. Analogous to TPM/TEE platform attestation. | Per-interaction (μs–ms) |

**What it is NOT:** The fabric does not make semantic judgments. A carefully worded adversarial prompt that is syntactically clean passes the fabric. Semantic threats require Level 2 evaluation.

**Implementation references:** SAGA per-interaction OTK tokens (NDSS 2026), NVIDIA OpenShell kernel-level isolation, NIST SP 800-207 PEP architecture.

### Level 2: Security Governance — Policy Evaluation

**What it is:** Security policy evaluation. Lives in Ring 2, evaluated by Policy as Code (#9), enforced through Governance Gates (#8). Makes the decisions that the fabric enforces.

**What it does:**

| Capability | Description | Temporal |
|-----------|-------------|----------|
| **Access control policy** | Who can do what under what conditions. Agents, models, humans × tools, data, actions × trust level, risk classification, context. | Per-decision (ms–min) |
| **Data classification** | PII rules, consent scope, data residency, retention, redaction. What data enters persistent stores, what crosses organizational boundaries. | Per-decision |
| **Irreversible-action authorization** | Any action classified as irreversible must pass a mandatory gate regardless of trust level. Security Governance defines which actions are irreversible. | Per-decision (may pause for human review) |
| **Supply chain trust policy** | Approved sources, version pins, trust tiers. For MCP: server identity verification, tool schema integrity, authorized registries, dynamic discovery governance. | Per-decision |
| **Semantic security evaluation** | When the fabric flags syntactically-clean-but-potentially-adversarial content, Governance evaluates against security policy. The defined interface between fast (fabric) and slower (semantic) evaluation. | Per-decision (ms–min) |

**Implementation references:** AgentSpec deterministic runtime constraints (ICSE 2026, 90%+ prevention), CSA ATF segmentation and data governance domains.

### Level 3: Security Intelligence — Detection & Response

**What it is:** The SIEM pattern applied to agentic systems. Consumes the event stream from all rings, runs security-specific correlation rules, triggers response playbooks.

**What it does:**

| Capability | Description | Temporal |
|-----------|-------------|----------|
| **Behavioral anomaly detection** | Baseline agent behavior, detect divergence. Trust manipulation patterns. Behavioral drift over time. | Dual-speed |
| **Cross-pipeline correlation** | Detect attacks spanning multiple agents. Lateral movement, coordinated behavior changes, cascading failures. | Slow path (hours–days) |
| **Memory & state introspection** | Read access to agent internal state — memory stores, context windows, embedding stores, tool registries, loaded manifests. The EDR pattern for agents. | Slow path |
| **Human-agent interaction analysis** | Approval cadence, framing analysis, fatigue indicators. Detect agents exploiting human cognitive biases (OWASP ASI09). | Dual-speed |
| **Response playbooks** | Quarantine, trust degradation, blast radius containment, human escalation, forensic preservation. | On trigger |

**Dual-speed operation:**
- **Fast path (sentinels):** Sub-second. Known-pattern anomaly-triggered responses.
- **Slow path (analysis):** Hours to days. Cross-execution pattern analysis, behavioral drift, memory evolution tracking.

**The detection spectrum:** Deterministic enforcement (AgentSpec → Fabric) → Probabilistic verification (AgentGuard → Intelligence behavioral analysis) → Proactive prediction (Pro2Guard → Intelligence anticipatory detection). Mature implementations move left to right.

**Implementation references:** SentinelAgent graph analysis (92% accuracy, OTel-based), AgentGuard MDP-based probabilistic verification, Pro2Guard proactive enforcement via Markov chains.

---

## The Security Response Bus

**The problem:** A multi-agent lateral movement attack (ASI07 → ASI03 → ASI08) cascades across three agents in under 3 seconds. Full governance deliberation takes minutes. By the time Intelligence detects, Governance authorizes, and Fabric contains — the attack has already completed.

**The solution:** Pre-authorized fast-path from Intelligence directly to Fabric, bypassing normal Governance deliberation for defined threat classes.

```
Normal path (seconds–minutes):
  Intelligence detects → Governance evaluates → Fabric contains

Response Bus path (sub-second):
  Intelligence detects → [pre-authorized match] → Fabric contains
                                                    ↓
                                           Governance notified post-facto
```

**How it works:**
1. **Governance pre-authorizes response classes.** "If Intelligence detects lateral movement pattern X, Fabric may immediately isolate affected agents." Pre-authorizations are versioned policy, recorded in the provenance chain, auditable.
2. **Intelligence triggers pre-authorized responses.** Detection matches a pre-authorized class → containment signal sent directly to Fabric.
3. **Fabric executes containment.** Circuit breakers fire, agents isolated, blast radius bounded.
4. **Governance notified post-facto.** Response recorded, evidence preserved, Governance validates or escalates.

**What this is NOT:** A governance bypass. Governance defines and pre-authorizes the response classes. Intelligence cannot trigger containment for patterns Governance hasn't pre-authorized. The fast-path is constrained, not unbounded.

**Known limitation:** A compromised Intelligence layer with Response Bus access can trigger false containment — denial-of-service by halting legitimate operations. Mitigations: cryptographic proof required for activation, pre-authorized classes limit blast radius, Governance dead-man's-switch overrides excessive containment rates, and Intelligence itself is subject to Ring 1 verification. This is a recursive trust problem mitigated by defense-in-depth, not eliminated.

---

## Zero Trust for Agentic Systems

Zero trust is not a feature — it is the architectural assumption that runs through everything. No ring trusts another ring's output by default. Trust is earned through demonstrated performance (Trust Ladders #11), not assumed.

### Principles Applied

| Zero Trust Principle | Agentic Application |
|---------------------|-------------------|
| **Never trust, always verify** | Ring 1 independently verifies Ring 0. Ring 2 independently evaluates policy. No implicit trust between rings. |
| **Least privilege** | Bounded Agency (#7). Agents have only the tools, data access, and authority they need. |
| **Assume breach** | Adversarial Robustness (#15). Limit damage when — not if — a component is compromised. |
| **Verify explicitly** | Identity & Attribution (#14). Every action carries authenticated identity. |
| **Microsegmentation** | Ring isolation. Tenant scoping. Cross-pipeline interactions require mutual authentication. |

### Identity as the Control Plane

In agentic zero trust, identity is richer than traditional identity:

- **Agent identity:** agent_id, version, configuration hash
- **Model identity:** model, version, provider, fine-tune
- **Delegation chain:** who authorized this agent, under what authority, with what scope
- **Execution identity:** run ID, context, inputs, checkpoint
- **Data identity:** whose data, classification level, consent scope
- **Human identity:** who is in the governance loop, what authority do they hold

These bind into an **identity context** that travels with every action through every ring. Implementation protocols (per NIST NCCoE, Feb 2026): SPIFFE/SPIRE for cryptographic workload identity (SVIDs), OAuth 2.1 for user-delegated agent authority, OIDC for federated identity, NGAC for attribute-based access control, JWT for per-interaction authorization.

---

## Threat Analysis: OWASP Top 10 for Agentic Applications

Each of the 10 OWASP ASI threats is analyzed below with AGF's defense architecture. For each threat: what it is, who owns the defense, how AGF addresses it, and what gaps remain.

### ASI01 — Agent Goal Hijack

**What it is:** Hidden prompts or instructions that redirect an agent's goals via external content, context manipulation, or environment drift.

**AGF defense:**
- **Owner:** Fabric / Adversarial Robustness (#15)
- **Primary mechanism:** Configuration integrity attestation — Fabric verifies control-plane configuration (system instructions, tool allowlists, policy versions) against a signed manifest at every ring boundary. Divergence triggers containment.
- **Supporting:** Intelligence detects behavioral divergence from authorized objectives over time. Agent Environment Governance (#19) verifies instruction integrity — environment-layer manipulation is a hijack vector.
- **Defense depth:** Fabric catches configuration tampering (fast). Intelligence catches semantic goal drift (slow). #19 catches environment composition manipulation.

**Gap:** Full semantic goal-state attestation — cryptographically verifying that an agent is pursuing its authorized goals — remains a research frontier. Text-level safety behavior does not reliably transfer to tool-call behavior (Mind the GAP, Feb 2026).

### ASI02 — Tool Misuse & Exploitation

**What it is:** Steering agents into unsafe use of legitimate capabilities — using permitted tools in unintended ways.

**AGF defense:**
- **Owner:** Governance / Bounded Agency (#7)
- **Primary mechanism:** Governance defines permitted tool parameters and action scopes via policy. Bounded Agency enforces the operating envelope.
- **Supporting:** Fabric enforces containment at runtime. Intelligence detects anomalous tool-use patterns.
- **Defense depth:** Policy defines what's allowed (Governance). Boundaries enforce it (Fabric). Anomaly detection catches novel misuse (Intelligence).

### ASI03 — Identity & Privilege Abuse

**What it is:** Agents receiving, holding, or delegating privilege improperly. Stale or inherited credentials expanding blast radius.

**AGF defense:**
- **Owner:** Fabric / Identity & Attribution (#14)
- **Primary mechanism:** Cryptographic identity verification at every ring boundary. SPIFFE/SPIRE SVIDs — short-lived, automatically rotated. No static credentials.
- **Supporting:** Governance evaluates authorization. Intelligence detects lateral movement and privilege escalation.

### ASI04 — Supply Chain Vulnerabilities

**What it is:** Poisoned tools, plugins, models, or connectors in dynamic MCP/A2A ecosystems.

**AGF defense:**
- **Owner:** Governance / Adversarial Robustness (#15)
- **Primary mechanism:** Governance defines approved sources, version pins, trust tiers. For MCP: server identity verification, tool schema integrity checks, authorized registries.
- **Supporting:** Fabric verifies integrity hashes at load time. Intelligence detects behavioral changes post-load. Agent Environment Governance (#19) controls which tools/servers enter the agent's environment.
- **Key data point:** 53% of community MCP servers use insecure static API keys (Astrix Security research, 2025). Supply chain policy must enforce short-lived, scoped credentials and reject servers that cannot prove identity.

### ASI05 — Unexpected Code Execution

**What it is:** Agents constructing and executing code from untrusted input without adequate sandboxing.

**AGF defense:**
- **Owner:** Fabric / Adversarial Robustness (#15)
- **Primary mechanism:** Execution isolation, input sanitization, environment hardening. NVIDIA OpenShell-style kernel-level sandboxing.
- **NIST guidance:** IR 8596 explicitly recommends curtailing, sandboxing, monitoring, or disallowing agent code execution.

### ASI06 — Memory & Context Poisoning

**What it is:** Slow corruption of agent memory or context through individually-benign inputs that reshape behavior over time.

**AGF defense:**
- **Owner:** Intelligence / Memory-Augmented Reasoning (#12)
- **Primary mechanism:** Memory-state introspection — Intelligence has read access to agent internal state for drift analysis. The EDR pattern applied to agent memory.
- **Supporting:** Fabric sanitizes per-interaction inputs. Agent Environment Governance (#19) governs the session state lifecycle — what persists, what's compacted, what's discarded.
- **Key insight:** Slow poisoning is invisible to per-boundary checks. Only longitudinal analysis (Intelligence slow path) catches it.

### ASI07 — Insecure Inter-Agent Communication

**What it is:** Spoofed messages between agents that misdirect agent clusters.

**AGF defense:**
- **Owner:** Fabric / Identity & Attribution (#14)
- **Primary mechanism:** Mutual authentication and message signing at every inter-agent boundary.
- **Supporting:** Intelligence detects spoofing and anomalous communication patterns.

### ASI08 — Cascading Failures

**What it is:** False signals cascading through automation with escalating impact across agent systems.

**AGF defense:**
- **Owner:** Intelligence / Error Handling & Recovery (#13)
- **Primary mechanism:** Cross-pipeline correlation detects amplification loops. Error propagation boundaries and circuit breakers contain cascades.
- **Supporting:** Security Response Bus triggers pre-authorized circuit breakers.

### ASI09 — Human-Agent Trust Exploitation

**What it is:** Agents structuring requests to exploit human cognitive biases — polished explanations that mislead approvers.

**AGF defense:**
- **Owner:** Intelligence / Trust Ladders (#11)
- **Primary mechanism:** Approval cadence monitoring, framing analysis, fatigue indicators. Trust calibration detects anomalous trust escalation.
- **Supporting:** Governance enforces cooling-off periods and rate limits on approval requests.
- **Honest limitation:** This targets human cognition, which is outside the system boundary. Oversight efficacy degrades as the capability gap widens (Engels et al., NeurIPS 2025). The best defense is structural — reduce dependence on human approval for routine decisions while preserving it for consequential ones.

### ASI10 — Rogue Agents

**What it is:** Misaligned agents that conceal their true objectives, take self-directed action, or resist governance.

**AGF defense:**
- **Owner:** Intelligence / Bounded Agency (#7)
- **Primary mechanism:** Behavioral baselines detect misalignment. Bounded Agency defines the operating envelope.
- **Supporting:** Governance sets parameters. Fabric enforces kill switches. Security Response Bus ensures sub-second containment for pre-authorized rogue-agent patterns.

---

## Threat Analysis: OWASP MCP Top 10

The Model Context Protocol has become the de facto standard for agent-tool integration. Its security surface requires dedicated analysis.

> **Note:** The OWASP MCP Top 10 is a living/beta taxonomy as of March 2026. Pin to a specific version for compliance purposes.

| MCP Threat | Description | AGF Defense |
|-----------|-------------|-------------|
| **MCP01 — Token Mismanagement** | Credentials stored insecurely in model memory or logs | Identity #14 + Fabric authentication. SPIFFE/SPIRE SVIDs — short-lived, scoped, auto-rotated. |
| **MCP02 — Privilege Escalation via Scope Creep** | Permissions expand over time, granting excessive capabilities | Bounded Agency #7 scope enforcement. Automated scope expiry. |
| **MCP03 — Tool Poisoning** | Compromised tools inject malicious context. Rug pulls, schema poisoning, tool shadowing. | Adversarial Robustness #15 supply chain trust. Tool schema integrity verification. |
| **MCP04 — Supply Chain Attacks** | Malicious components in open-source packages or connectors | Signed components, dependency monitoring, provenance tracking. Governance-defined trust tiers. |
| **MCP05 — Command Injection** | Agents construct system commands from untrusted input | Fabric input sanitization + execution isolation. |
| **MCP06 — Prompt Injection via Contextual Payloads** | Malicious instructions embedded in context hijack agent goals | Fabric input sanitization + Governance semantic evaluation. #19 treats tool descriptions as untrusted input. |
| **MCP07 — Insufficient Auth** | MCP servers fail to verify identities or enforce access controls | Identity #14 + Fabric identity enforcement at every MCP tool invocation boundary. |
| **MCP08 — Lack of Audit/Telemetry** | Limited logging impedes investigation and incident response | Event-Driven Observability #10. Immutable audit trails. |
| **MCP09 — Shadow MCP Servers** | Unapproved instances outside organizational governance | Security Governance policy enforcement. Authorized server registries. |
| **MCP10 — Context Injection & Over-Sharing** | Shared context windows expose sensitive information between tasks/users | Data Governance #17 compartmentalization. #19 session isolation governance. |

**MCP governance in AGF's architecture:** MCP operates primarily in the Middleware/Interrupt deployment mode. Ring 2 policy defines which servers and tools are authorized. The Security Fabric verifies tool integrity at each `execute_tool` invocation. Four MCP-specific governance concerns are addressed: dynamic tool discovery, server trust chains, context window as attack surface, and session isolation. See the [Platform Profile](platform-profile.md) for MCP integration patterns.

---

## The Agent Environment as Attack Surface

Agent Environment Governance (#19) identifies the agent's operating environment as simultaneously the primary optimization target and the primary attack surface. For security teams, this means:

| Attack Vector | Environment Layer Targeted | Detection & Defense |
|--------------|---------------------------|-------------------|
| **Prompt injection** | L2 (Instruction Architecture) | Fabric input sanitization + instruction integrity verification |
| **Tool poisoning** (MCP03) | L3 (Capability Set) | Supply chain trust policy + tool schema verification |
| **Context injection** (MCP10) | L4 (Retrieved Context) | Data Governance #17 classification + Fabric content scanning |
| **Memory poisoning** (ASI06) | L5 (Session State) | Intelligence memory introspection + compaction-time integrity checks |
| **Environment drift** | All layers | Environment optimization loop observation + baseline comparison |

**The trust boundary:** Layers 1-2 (Identity/Policy substrate and Instruction Architecture) are human-authored, version-controlled, and trusted. Layers 3-5 (Capability Set, Retrieved Context, Session State) are dynamic, runtime-composed, and treated as untrusted input. The Security Fabric must enforce this boundary — particularly when MCP tool responses (L3/L4) are injected into the agent's context alongside trusted instructions (L2).

---

## CSA Agentic Trust Framework Alignment

| CSA ATF Domain | AGF Primary Level | Supporting Levels |
|----------------|------------------|-------------------|
| **Identity** | Fabric (cryptographic verification at every boundary) | Governance (identity policy), Intelligence (anomaly detection) |
| **Behavior** | Intelligence (behavioral baselines, anomaly detection) | Fabric (event emission), Governance (boundary policy) |
| **Data Governance** | Governance (classification, PII, consent) | Fabric (validation, scanning), Intelligence (leakage detection) |
| **Segmentation** | Governance (boundary policy, least privilege) | Fabric (enforcement), Intelligence (violation detection) |
| **Incident Response** | Intelligence + Fabric via Response Bus | Governance (pre-authorization, post-incident review) |

Trust Ladders (#11) align with CSA ATF's earned autonomy maturity model (Intern → Associate → Senior → Staff → Principal). The ATF's promotion gates — requiring time-at-level, performance thresholds, security validation, and governance sign-off — provide operational specificity for trust ladder implementation.

---

## Security Primitives Reference

The following AGF primitives are directly relevant to security. For full pattern descriptions, see the [AI Engineering Profile](ai-engineering-profile.md) or the [AGF Primitives catalog](../docs/agentic-primitives.md).

| Primitive | Security Role |
|-----------|--------------|
| **#6 Provenance Chains** | Full decision history. Tamper-evident audit trail. |
| **#7 Bounded Agency** | Defines what agents CAN DO. The operating envelope. |
| **#10 Event-Driven Observability** | The event stream that Intelligence consumes. |
| **#11 Trust Ladders** | Trust earned through performance. Anomaly detection on trust trajectories. |
| **#14 Identity & Attribution** | Answers WHO did this. Authenticated, inspectable identity on every action. |
| **#15 Adversarial Robustness** | The security posture: assume breach, defense in depth, verify explicitly. |
| **#16 Transaction & Side-Effect Control** | Irreversible action management. Pre-commit/commit/post-commit. |
| **#17 Data Governance** | Owns the internal data lifecycle: classification, consent, PII, retention. |
| **#19 Agent Environment Governance** | The environment IS the attack surface: context composition, tool provisioning, instruction integrity. |

---

## Known Limitations and Open Questions

1. **Fabric/Governance boundary for semantic threats.** Syntactic threats → Fabric. Semantic threats → Governance. The interface is defined but performance implications of synchronous semantic evaluation at wire speed need empirical testing.

2. **Intelligence introspection scope.** How deep does memory introspection go? Full memory contents? Embedding distributions? Context snapshots? The right scope varies by threat model and classification.

3. **Pre-authorized response completeness.** Novel attack patterns not matching pre-authorized classes fall back to full Governance deliberation — which may be too slow. The pre-authorization library must evolve with the threat landscape.

4. **Human cognitive vulnerability scope.** ASI09 targets cognition outside the system boundary. Oversight efficacy degrades as the capability gap widens (Engels et al., NeurIPS 2025). Best defense: structural guarantees that don't depend on human attention.

5. **Intelligence integrity.** Compromised Intelligence + Response Bus = denial-of-service. Mitigated by: cryptographic proof, pre-authorized class limits, dead-man's-switch override, independent verification. Defense-in-depth, not elimination.

6. **OWASP MCP Top 10 stability.** The taxonomy is living/beta as of March 2026. Category definitions may evolve. Pin to a version for compliance.

---

## Security Assessment Checklist

Use this checklist to evaluate the security posture of an agentic system against AGF's security architecture.

### Level 1: Security Fabric
- [ ] Input sanitization active at every ring boundary
- [ ] Output scanning before every cross-ring transition
- [ ] Runtime containment (sandboxing, resource limits) configured
- [ ] Configuration attestation against signed deployment manifest
- [ ] Per-interaction identity verification (SPIFFE/SPIRE or equivalent)
- [ ] Ring integrity verification active

### Level 2: Security Governance
- [ ] Access control policy defined (agents × tools × data × conditions)
- [ ] Data classification rules in effect (PII, consent, retention)
- [ ] Irreversible actions identified and gated
- [ ] Supply chain trust policy defined (approved sources, version pins, trust tiers)
- [ ] MCP server authorization policy in effect (if applicable)
- [ ] Semantic security evaluation interface defined between Fabric and Governance

### Level 3: Security Intelligence
- [ ] Behavioral baselines established for agents
- [ ] Cross-pipeline correlation rules active
- [ ] Memory/state introspection configured (scope defined per threat model)
- [ ] Human-agent interaction monitoring active (approval cadence, framing)
- [ ] Response playbooks defined for known threat patterns

### Security Response Bus
- [ ] Response classes pre-authorized by Governance
- [ ] Pre-authorized responses documented and version-controlled
- [ ] Containment signals tested end-to-end (Intelligence → Fabric)
- [ ] Governance post-facto notification configured
- [ ] Dead-man's-switch threshold set for excessive containment rates

### Agent Environment Security
- [ ] Trust boundary enforced between L2 (trusted) and L3 (untrusted)
- [ ] MCP tool descriptions treated as untrusted input
- [ ] Session state isolation verified for multi-tenant deployments
- [ ] Instruction integrity verification active
- [ ] Environment drift monitoring configured

### OWASP ASI Coverage
- [ ] ASI01 (Goal Hijack): Configuration attestation + behavioral drift detection
- [ ] ASI02 (Tool Misuse): Bounded agency + anomaly detection
- [ ] ASI03 (Identity Abuse): Cryptographic identity + lateral movement detection
- [ ] ASI04 (Supply Chain): Trust policy + integrity verification + provisioning governance
- [ ] ASI05 (Code Execution): Sandboxing + input sanitization
- [ ] ASI06 (Memory Poisoning): Memory introspection + session state governance
- [ ] ASI07 (Inter-Agent Comms): Mutual authentication + spoofing detection
- [ ] ASI08 (Cascading Failures): Circuit breakers + cross-pipeline correlation
- [ ] ASI09 (Trust Exploitation): Approval monitoring + rate limits
- [ ] ASI10 (Rogue Agents): Behavioral baselines + kill switches + Response Bus

---

*This is the AGF Security Profile — one of five domain profiles in the AGF reference architecture. For the complete framework, see [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md).*
