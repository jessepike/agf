# AGF GRC Profile: Regulatory Alignment and Governance Evidence

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Parent:** [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md)

---

## Who This Is For

Compliance officers, risk managers, auditors, legal/privacy teams, Data Protection Officers (DPOs), and anyone responsible for demonstrating that agentic systems are governed in accordance with regulatory requirements.

**The key question this profile answers:** *How do I prove to a regulator or auditor that my agentic systems are governed?*

**Prerequisites:** Familiarity with the [Rings Model and core concepts](../docs/agf-reference-architecture.md#core-concepts) in the AGF meta document.

---

## Contents

1. [The Compliance Challenge](#the-compliance-challenge)
2. [EU AI Act Alignment](#eu-ai-act-alignment)
3. [NIST AI RMF Alignment](#nist-ai-rmf-alignment)
4. [Singapore IMDA Alignment](#singapore-imda-alignment)
5. [CSA MAESTRO Alignment](#csa-maestro-alignment)
6. [Governance Evidence: What Each Primitive Produces](#governance-evidence-what-each-primitive-produces)
7. [Governance Gates and Human Oversight](#governance-gates-and-human-oversight)
8. [Policy as Code: Governance Rules as Auditable Artifacts](#policy-as-code)
9. [Data Governance and Privacy](#data-governance-and-privacy)
10. [Risk Classification and Ring Activation](#risk-classification-and-ring-activation)
11. [GRC Primitives Reference](#grc-primitives-reference)
12. [Compliance Assessment Checklist](#compliance-assessment-checklist)

---

## The Compliance Challenge

Regulatory frameworks were designed for traditional AI — static models making predictions with human decision-makers in the loop. Agentic AI breaks these assumptions. Agents select tools, take actions, delegate to other agents, modify their own behavior, and operate at speeds that exceed human oversight capacity.

The compliance challenge for agentic systems has three dimensions:

1. **Accountability is distributed.** When an agent delegates to another agent, which made a tool call that produced a side effect — who is accountable? The deployer? The model provider? The tool provider? Regulatory frameworks demand clear accountability chains that agentic architectures often lack.

2. **Evidence must be structural, not anecdotal.** "We reviewed 50 outputs and they looked fine" is not compliance evidence. Regulators need: continuous logging, traceable decision provenance, testable policy rules, and reproducible governance behavior.

3. **The regulatory landscape is converging but not aligned.** The EU AI Act, NIST AI RMF, Singapore IMDA, CSA frameworks, and ISO standards all address agentic governance from different angles with different vocabularies. Organizations operating globally need a unified architecture that satisfies multiple regulatory frameworks simultaneously.

AGF addresses all three: clear accountability via Identity & Attribution (#14) and Provenance Chains (#6), structural evidence via Event-Driven Observability (#10) and auditable gates, and multi-framework alignment through explicit regulatory mappings.

---

## EU AI Act Alignment

The EU AI Act provides the most comprehensive regulatory framework for AI systems. AGF maps to its requirements at the article level.

### High-Risk System Requirements (Articles 6, 9–15)

| Article | Requirement | AGF Mapping | Evidence Produced |
|---------|------------|-------------|-------------------|
| **Art. 6 — Classification** | Rules for classifying AI systems as high-risk | Risk classification → ring activation intensity. High-risk = full ring stack activation. | Classification decision record, ring activation policy |
| **Art. 9 — Risk management** | Risk management system throughout lifecycle | Three-level security model + risk-based ring activation | Security architecture documentation, ring configuration records |
| **Art. 10 — Data governance** | Data collection, preparation, bias examination, representativeness | Data Governance & Confidentiality (#17) — classification, lineage, consent, retention | Data classification records, consent logs, lineage traces |
| **Art. 11 — Technical documentation** | Complete documentation enabling conformity assessment | Provenance Chains (#6) + versioned control-plane state | Full provenance chain for any output, configuration version history |
| **Art. 12 — Record-keeping** | Automatic recording of events relevant to risk identification, substantial modification, and monitoring | Event-Driven Observability (#10) + Provenance Chains (#6) — structured event emission from all rings. Note: Art. 12's specific minimum field requirements apply primarily to remote biometric identification; for other high-risk AI, requirements are more general. | Structured event logs, ring boundary events, gate decision records |
| **Art. 13 — Transparency** | Sufficient transparency for deployers to interpret output and detect anomalies | Identity & Attribution (#14) — full identity context on every action. Provenance chains, confidence signals, gate decision explanations. | Identity context records, decision explanation artifacts |
| **Art. 14 — Human oversight** | Ability to understand capabilities/limitations, monitor operation, intervene/interrupt/halt in safe state | Governance Gates (#8) with human interface requirements — evidence presentation, counterfactual framing, rubber-stamping detection. Security Response Bus safe-halt mechanics. | Gate decision logs, human intervention records, halt/containment records |
| **Art. 15 — Accuracy, robustness, cybersecurity** | Resilience against data poisoning, adversarial examples, model manipulation, supply chain exploitation | Adversarial Robustness (#15) + Security Architecture + Evaluation & Assurance (#18) | Security test results, red team reports, evaluation suite outcomes |
| **Art. 50 — Transparency obligations** | Users informed they are interacting with AI | Identity context at gates includes AI-system identification | AI identification disclosure records |

**What AGF does NOT cover:** Art. 43 (conformity assessment procedures), Art. 62 (serious incident reporting), and ongoing post-market monitoring obligations. These are organizational/regulatory processes above AGF's runtime architecture. AGF provides the technical evidence substrate these processes require.

### Human Oversight: An Honest Constraint

Art. 14 requires effective human oversight. AGF's honest position: oversight is necessary but its efficacy degrades as the capability gap between overseer and system increases (Engels et al., NeurIPS 2025). AGF addresses this by investing in structural guarantees — rings, verification layers, automated policy enforcement — that function whether or not the human overseer catches every issue. Governance Gates (#8) provide human decision points where they matter most; the architecture ensures safety even when the overseer misses something.

For compliance purposes: document both the human oversight mechanisms (gates, review interfaces, override capabilities) AND the structural safeguards (automated verification, containment, policy enforcement) that supplement human oversight.

---

## NIST AI RMF Alignment

AGF primitives are **agentic specializations of** NIST AI RMF functions — runtime mechanisms within broader organizational functions. AGF does not claim to cover the full breadth of each function.

| NIST Function | Scope | AGF Mapping |
|---------------|-------|-------------|
| **GOVERN** | Establish and maintain organizational AI risk governance | Ring 2 instantiates runtime governance — policy evaluation, gate decisions, delegation authority — within the broader organizational governance that GOVERN defines. |
| **MAP** | Context framing, risk identification, categorization | Risk classification + ring activation intensity. MAP includes understanding the system's context, stakeholders, and potential impacts — broader than classification alone. |
| **MEASURE** | Quantify, monitor, assess AI risks | Evaluation & Assurance (#18) for pre-deployment measurement. Ring 1 verification + Event-Driven Observability (#10) for continuous runtime measurement. |
| **MANAGE** | Allocate resources, plan responses, manage risks | Trust Ladders (#11) + Bounded Agency (#7) — calibrating autonomy levels and enforcing boundaries as risk management. MANAGE is broader; it includes organizational response planning above our runtime architecture. |

### NIST IR 8596 (Cybersecurity AI Profile)

Maps AI agent security onto NIST CSF 2.0's six functions across three focus areas:

| IR 8596 Focus Area | AGF Mapping |
|-------------------|-------------|
| **Securing AI Systems** | Security Fabric + Identity & Attribution (#14) |
| **AI-Enabled Cyber Defense** | Security Intelligence + Security Response Bus with human oversight |
| **Thwarting AI-Enabled Attacks** | Adversarial Robustness (#15) |

Key alignment: IR 8596 treats AI agents as *actors* (entities that make decisions at machine speed), not just applications. This validates AGF's Identity primitive position that agent identity must be first-class.

### NIST NCCoE Agent Identity

Implementation protocols for Identity & Attribution (#14): SPIFFE/SPIRE for cryptographic workload identity, OAuth 2.1 for user-delegated agent authority, OIDC for federated identity, NGAC for attribute-based access control.

---

## Singapore IMDA Alignment

The IMDA Model AI Governance Framework for Agentic AI (January 2026) — the world's first government-published governance framework specifically for agentic AI.

| IMDA Dimension | Description | AGF Mapping |
|---------------|-------------|-------------|
| **1. Risk Assessment & Bounding** | Restrict tool access, sandbox environments, fine-grained permissions | Bounded Agency (#7) + Security Fabric + Agent Environment Governance (#19) workspace scoping |
| **2. Accountability & Human Oversight** | Defined roles across agent lifecycle, HITL for high-stakes/irreversible actions, automation bias safeguards | Governance Gates (#8) + human interface requirements (evidence presentation, rubber-stamping detection) |
| **3. Technical Controls & Testing** | Output accuracy, tool usage validation, policy compliance, workflow reliability, gradual rollout with anomaly monitoring | Evaluation & Assurance (#18) + Ring 1 verification |
| **4. End-User Responsibility** | User training, transparency on agent permissions, active stewardship | Identity & Attribution (#14) transparency requirements |

IMDA explicitly includes "operational environments" as a governance dimension — directly validating Agent Environment Governance (#19).

---

## CSA MAESTRO Alignment

The MAESTRO 7-layer threat model mapped to AGF primitives:

| MAESTRO Layer | AGF Primary Primitives | Ring Mapping |
|---------------|----------------------|--------------|
| L1: Foundation Models | Adversarial Robustness (#15), Evaluation & Assurance (#18) | Ring 0 |
| L2: Data Operations | Data Governance (#17), Memory-Augmented Reasoning (#12) | Ring 0 + Fabric |
| L3: Agent Frameworks | Composability Interface, Bounded Agency (#7), Policy as Code (#9), Agent Environment Governance (#19) | Ring 1 + Ring 2 |
| L4: Deployment Infrastructure | Identity & Attribution (#14), Transaction Control (#16), Agent Environment Governance (#19) | Security Fabric |
| L5: Evaluation & Observability | Event-Driven Observability (#10), Validation Loops (#2), Evaluation & Assurance (#18) | Ring 1 + Ring 3 |
| L6: Security & Compliance | Governance Gates (#8), Policy as Code (#9), Trust Ladders (#11) | Ring 2 |
| L7: Agent Ecosystem | Multi-Agent Coordination, Cross-System Trust, DELEGATE signal | Ring 2 + Cross-cutting |

---

## Governance Evidence: What Each Primitive Produces

For auditors: every AGF primitive produces specific, auditable artifacts.

| Primitive | Evidence Artifact | Regulatory Mapping |
|-----------|------------------|-------------------|
| **#1 Separation of Producer/Verifier** | Verification decision records (pass/revise/fail per output) | Art. 15 (accuracy), NIST MEASURE |
| **#6 Provenance Chains** | Full decision history for any output — every agent, model, decision, input, context | Art. 11 (documentation), Art. 12 (record-keeping) |
| **#7 Bounded Agency** | Scope definition records, boundary enforcement logs, escalation records | Art. 9 (risk management), IMDA Dim. 1 |
| **#8 Governance Gates** | Gate trigger records, evidence packages, human decision records, override logs | Art. 14 (human oversight), IMDA Dim. 2 |
| **#9 Policy as Code** | Versioned policy rules, policy test results, policy change audit trail | Art. 9, NIST GOVERN |
| **#10 Event-Driven Observability** | Structured event logs from all rings, correlation records | Art. 12 (record-keeping), NIST MEASURE |
| **#11 Trust Ladders** | Trust level history, promotion/demotion records, calibration justifications | NIST MANAGE, CSA ATF |
| **#14 Identity & Attribution** | Agent identity records, delegation chains, authentication logs | Art. 13 (transparency), Art. 50 |
| **#17 Data Governance** | Data classification records, consent logs, PII handling logs, retention/deletion records | Art. 10 (data governance), GDPR |
| **#18 Evaluation & Assurance** | Pre-deployment test results, red team reports, regression suite outcomes, configuration change approvals | Art. 15 (accuracy/robustness), NIST MEASURE |
| **#19 Agent Environment Governance** | Environment composition records, instruction version history, tool provisioning logs, optimization loop decisions | IMDA Dim. 1 (operational environments) |

---

## Governance Gates and Human Oversight

Governance Gates (#8) are the primary mechanism for human-in-the-loop oversight in AGF.

### How Gates Work

1. Execution reaches a defined decision point (Ring 2 determines a gate is required)
2. Execution **pauses** — the output, context, and evidence are frozen
3. A human reviewer sees: the output, the provenance chain, the policy evaluation, and the risk classification
4. The reviewer decides: **APPROVE**, **REJECT**, **MODIFY**, **DEFER**, or **ESCALATE**
5. The decision is recorded with full provenance (who decided, when, what evidence was presented, what they decided)

### Human Interface Requirements

AGF specifies requirements for how gates present information to human reviewers:

- **Evidence presentation** — the reviewer sees structured evidence, not raw data
- **Counterfactual framing** — "what would happen if you approve vs. reject"
- **Rubber-stamping detection** — if a reviewer approves too quickly or too uniformly, Intelligence flags it
- **Timeout behavior** — fail-closed by default (if no decision within the window, execution halts)
- **Cognitive load management** — batch approval rules for routine decisions, escalation for novel ones
- **Cooling-off periods** — rate limits on approval requests to prevent fatigue exploitation

---

## Policy as Code

Policy as Code (#9) makes governance rules versioned, executable, and testable — not implicit tribal knowledge.

**For compliance teams, this means:**
- Every governance rule is a versioned artifact with an audit trail
- Policy changes go through the same review process as code changes
- Policy test harnesses verify rules behave as expected before deployment
- Policy behavior is deterministic and reproducible for audit

**Configuration vs. Policy distinction:**
- **Configuration** (can be adjusted by the self-improving loop): quality thresholds, verification intensity, trust levels
- **Policy** (requires human authorization to change): access control rules, mandatory gate definitions, compliance constraints, data classification rules

---

## Data Governance and Privacy

Data Governance & Confidentiality (#17) addresses GDPR, EU AI Act Art. 10, and organizational data protection requirements.

**For DPOs specifically:**
- **Data classification at ingestion** — every data input is classified before processing
- **PII detection and handling** — automated detection with configurable handling rules (redact, mask, exclude)
- **Consent and purpose binding** — data used only for consented purposes, tracked through the provenance chain
- **Data lineage** — every data transformation is traceable from input to output
- **Memory privacy** — Memory-Augmented Reasoning (#12) respects retention policies; session state is governed by Agent Environment Governance (#19)
- **Retention and deletion** — automated retention policies with verifiable deletion
- **Cross-boundary controls** — data leaving organizational boundaries requires explicit governance approval

---

## Risk Classification and Ring Activation

AGF uses risk-proportional governance — higher stakes trigger more intensive ring activation.

| Risk Classification | Ring Configuration | Governance Intensity | Typical Use Cases |
|-------------------|-------------------|---------------------|-------------------|
| **Low** | Ring 0 + minimal Ring 1 | Basic verification, no mandatory gates | Internal productivity tools, personal agents |
| **Medium** | Ring 0 + Ring 1 + adaptive Ring 2 gates | Full verification, gates on consequential actions | Customer-facing agents, workflow automation |
| **High** | All four rings, mandatory gates | Full verification, mandatory human oversight, adversarial testing | Regulated decisions, financial transactions, healthcare |
| **Critical** | All rings + enhanced monitoring + continuous evaluation | Full stack + Security Intelligence active monitoring + continuous red-teaming | Autonomous systems with irreversible real-world impact |

For EU AI Act: high-risk classification under Art. 6 implies full ring stack activation at minimum.

---

## GRC Primitives Reference

| Primitive | GRC Role |
|-----------|---------|
| **#6 Provenance Chains** | Audit evidence — full decision history for any output |
| **#8 Governance Gates** | Human oversight mechanism — where humans authorize agent actions |
| **#9 Policy as Code** | Governance rules as versioned, executable, testable artifacts |
| **#10 Event-Driven Observability** | Record-keeping — continuous structured event logging |
| **#17 Data Governance** | Privacy compliance — classification, consent, PII, retention |
| **#18 Evaluation & Assurance** | Pre-deployment assurance — testing, red-teaming, regression |
| **#14 Identity & Attribution** | Transparency — who did what, under whose authority |
| **#11 Trust Ladders** | Risk management — graduated trust with documented calibration |
| **#19 Agent Environment Governance** | Operational environment governance — composition audit trail |

---

## Compliance Assessment Checklist

### EU AI Act Readiness
- [ ] Risk classification completed (Art. 6) → ring activation level determined
- [ ] Risk management system documented (Art. 9) → three-level security model deployed
- [ ] Data governance controls in effect (Art. 10) → #17 classification, consent, lineage active
- [ ] Technical documentation complete (Art. 11) → provenance chains #6 producing full audit trail
- [ ] Record-keeping active (Art. 12) → Event-Driven Observability #10 logging at all ring boundaries
- [ ] Transparency measures in place (Art. 13) → Identity #14 context on every action
- [ ] Human oversight functional (Art. 14) → Governance Gates #8 with interface requirements
- [ ] Accuracy/robustness/security validated (Art. 15) → Evaluation #18 + Security Architecture
- [ ] Transparency obligations met (Art. 50) → AI system identification in place

### NIST AI RMF Alignment
- [ ] GOVERN → Ring 2 governance policy defined and operational
- [ ] MAP → Risk classification and ring activation rules documented
- [ ] MEASURE → Evaluation #18 pre-deployment + Ring 1 continuous verification + Observability #10
- [ ] MANAGE → Trust Ladders #11 calibrated + Bounded Agency #7 enforced

### Audit Evidence Availability
- [ ] Full provenance chain retrievable for any output (who, what, when, why, under what authority)
- [ ] Gate decisions recorded with evidence packages
- [ ] Policy rules versioned with change audit trail
- [ ] Environment composition records available (instructions, tools, context at time of action)
- [ ] Trust level history and calibration justifications documented
- [ ] Data classification, consent, and retention records accessible
- [ ] Evaluation and red-team results archived

---

*This is the AGF GRC Profile — one of five domain profiles in the AGF reference architecture. For the complete framework, see [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md).*
