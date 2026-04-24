# AGF GRC Profile: Regulatory Alignment and Governance Evidence

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Parent:** [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md)
**Terminology:** [Shared Vocabulary](../docs/shared-vocabulary.md)

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
11. [Governance Maturity Model](#governance-maturity-model)
12. [Control Crosswalks](#control-crosswalks)
13. [GRC Primitives Reference](#grc-primitives-reference)
14. [Compliance Assessment Checklist](#compliance-assessment-checklist)

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
| **Art. 50 — Transparency obligations** | Users informed they are interacting with AI; disclosure/labelling for certain AI-generated content (e.g., deepfakes); transparency duties for emotion recognition and biometric categorisation systems | Identity & Attribution (#14) — AI-system identification in identity context. Provenance Chains (#6) for content provenance. | AI identification disclosure records, content provenance records |

### General-Purpose AI Model Obligations (Articles 51–56)

Most agentic systems are built on general-purpose AI models (GPT, Claude, Gemini, etc.). GPAI obligations have applied since **2 August 2025** and are relevant to deployers of agentic systems:

| Article | Requirement | AGF Relevance |
|---------|------------|--------------|
| **Art. 53 — GPAI provider obligations** | Documentation, adversarial testing, copyright compliance | AGF does not address GPAI provider obligations directly. Organizations deploying agents on GPAI models should verify provider compliance and maintain evidence of provider documentation. |
| **Art. 55 — Systemic risk obligations** | Additional obligations for GPAI models with systemic risk (compute >10²⁵ FLOPs or Commission designation) | If your agent system uses a systemic-risk GPAI model, additional governance requirements apply. AGF's Evaluation & Assurance (#18) and Security Architecture support but do not fully satisfy these obligations. |

**Coverage boundary:** AGF governs how organizations deploy and operate agentic systems built on GPAI models. It does not govern the models themselves. Organizations have a dual compliance obligation: GPAI model compliance (provider responsibility, Art. 53-55) AND high-risk system compliance (deployer responsibility, Art. 6, 9-15) when the agent system qualifies as high-risk.

**What AGF does NOT cover:** Art. 43 (conformity assessment procedures), Art. 73 (serious incident reporting), Art. 72 (post-market monitoring system), Art. 26 (deployer obligations including log retention ≥6 months). These are organizational/regulatory processes above AGF's runtime architecture. AGF provides the technical evidence substrate these processes require.

**Applicability timing (as of March 2026):** The EU AI Act entered into force in 2024 with phased applicability. Prohibitions, definitions, and AI literacy (Art. 4) have applied since 2 February 2025. Governance rules and GPAI obligations have applied since 2 August 2025. High-risk system obligations (Art. 6, 9-15) become applicable 2 August 2026. Organizations should begin preparation now; the obligations in this profile are transitional as of this writing.

### Human Oversight: An Honest Constraint

Art. 14 requires effective human oversight. AGF's honest position: oversight is necessary but its efficacy degrades as the capability gap between overseer and system increases (Engels et al., NeurIPS 2025). AGF addresses this by investing in structural guarantees — rings, verification layers, automated policy enforcement — that function whether or not the human overseer catches every issue. Governance Gates (#8) provide human decision points where they matter most; the architecture ensures safety even when the overseer misses something.

For compliance purposes: document both the human oversight mechanisms (gates, review interfaces, override capabilities) AND the structural safeguards (automated verification, containment, policy enforcement) that supplement human oversight.

---

## NIST AI RMF Alignment

AGF primitives constitute an **agentic AI RMF-style profile** — runtime mechanisms that partially address aspects of NIST AI RMF functions in the agentic context. NIST describes its functions as flexibly applicable; AGF applies them to agentic systems specifically. AGF does not claim to cover the full breadth of each function.

| NIST Function | Scope (NIST) | AGF Covers | AGF Does NOT Cover |
|---------------|-------------|-----------|-------------------|
| **GOVERN** | Establish and maintain organizational AI risk governance (6 categories, 23 subcategories covering legal compliance, DEI, stakeholder engagement, supply chain governance, risk culture) | Ring 2 runtime governance: policy evaluation, gate decisions, delegation authority, Policy as Code (#9) | Organizational risk culture, legal compliance processes, external stakeholder engagement, DEI governance, supply chain governance beyond tool trust |
| **MAP** | Context framing, risk identification, categorization (understanding context, stakeholders, potential impacts) | Risk classification + ring activation intensity. Risk tier decision tree. | Broader stakeholder analysis, societal impact assessment, system context mapping beyond runtime classification |
| **MEASURE** | Quantify, monitor, assess AI risks (continuous measurement across AI lifecycle) | Evaluation & Assurance (#18) for pre-deployment. Ring 1 verification + Event-Driven Observability (#10) for runtime. | Organizational risk quantification, bias measurement, fairness metrics, broader AI lifecycle measurement beyond runtime |
| **MANAGE** | Allocate resources, plan responses, manage risks (incident response, recovery, communication, decommissioning) | Trust Ladders (#11) + Bounded Agency (#7) for runtime risk management. Error Handling (#13) for recovery. | Organizational response planning, resource allocation, stakeholder communication, appeal mechanisms, decommissioning processes |

### NIST IR 8596 (Cybersecurity AI Profile)

Maps AI agent security onto NIST CSF 2.0's six functions across three focus areas:

| IR 8596 Focus Area | AGF Mapping |
|-------------------|-------------|
| **Securing AI Systems** | Security Fabric + Identity & Attribution (#14) |
| **AI-Enabled Cyber Defense** | Security Intelligence + Security Response Bus with human oversight |
| **Thwarting AI-Enabled Attacks** | Adversarial Robustness (#15) |

Key alignment: IR 8596 treats AI agents as security-relevant entities requiring unique identity, privileged-user-level precautions, and agent-specific security controls — not just applications. This validates AGF's Identity primitive position that agent identity must be first-class.

### NIST NCCoE Agent Identity

The NCCoE published a concept paper (February 2026, public comment period Feb-Apr 2026) exploring agent identity and authorization. The paper identifies candidate protocols for Identity & Attribution (#14): SPIFFE/SPIRE for cryptographic workload identity, OAuth 2.1 for user-delegated agent authority, OIDC for federated identity, NGAC for attribute-based access control. Note: these are protocols under consideration for a potential NCCoE project, not formal NIST recommendations.

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

### Risk Tiers and Governance Response

| Risk Tier | Ring Configuration | Governance Intensity | Typical Use Cases |
|-----------|-------------------|---------------------|-------------------|
| **Low** | Ring 0 + minimal Ring 1 | Basic verification, no mandatory gates | Internal productivity tools, personal agents |
| **Medium** | Ring 0 + Ring 1 + adaptive Ring 2 gates | Full verification, gates on consequential actions | Customer-facing agents, workflow automation |
| **High** | All four rings, mandatory gates | Full verification, mandatory human oversight, adversarial testing | Regulated decisions, financial transactions, healthcare |
| **Critical** | All rings + enhanced monitoring + continuous evaluation | Full stack + Security Intelligence active monitoring + continuous red-teaming | Autonomous systems with irreversible real-world impact |

For EU AI Act: high-risk classification under Art. 6 implies full ring stack activation at minimum.

**AGF tiers vs. EU AI Act risk categories:** The EU AI Act uses four categories: unacceptable risk (prohibited), high-risk, limited risk, and minimal risk. AGF's tiers are operational governance levels, not legal categories. The mapping: EU "high-risk" → AGF Tier 3 (High) minimum. EU "limited risk" → AGF Tier 2 (Medium) minimum. EU "minimal risk" → AGF Tier 1 (Low). AGF "Critical" has no direct EU AI Act equivalent — it is an operational designation for systems with irreversible real-world impact that may or may not be classified as high-risk under the Act.

### Classification Dimensions

Five dimensions determine risk classification. Assess each independently; the highest-scoring dimension sets the floor.

| Dimension | Low | Medium | High | Critical |
|-----------|-----|--------|------|----------|
| **Consequence of error** | Inconvenience, easily corrected | Business impact, costly to correct | Regulatory violation, significant harm | Irreversible harm, legal liability |
| **Data sensitivity** | Public data | Internal data | Confidential / PII | Restricted / regulated data |
| **Autonomy level** | Human reviews every output | Human reviews exceptions | Human reviews escalations only | Autonomous action within scope |
| **Blast radius** | Affects one user | Affects one team/department | Affects one organization | Affects customers/public |
| **Reversibility** | All actions reversible | Most actions reversible | Some irreversible actions | Primarily irreversible actions |

### Risk Classification Decision Tree

Use this decision tree to determine the appropriate risk tier for an agentic system:

```
START: What is the worst realistic consequence of an unconstrained error?

  ├─ Inconvenience / easily corrected
  │   └─ Does the agent access sensitive data (PII, confidential, regulated)?
  │       ├─ No  → TIER 1: LOW
  │       └─ Yes → TIER 2: MEDIUM (data sensitivity elevates)
  │
  ├─ Business impact / costly to correct
  │   └─ Does the agent take irreversible actions?
  │       ├─ No  → TIER 2: MEDIUM
  │       └─ Yes → Does the blast radius extend beyond one team/department?
  │           ├─ No  → TIER 2: MEDIUM (with mandatory gates on irreversible actions)
  │           └─ Yes → TIER 3: HIGH
  │
  ├─ Regulatory violation / significant harm to individuals
  │   └─ TIER 3: HIGH (minimum)
  │       └─ Does the agent operate autonomously (minimal human-in-the-loop)?
  │           ├─ No  → TIER 3: HIGH
  │           └─ Yes → TIER 4: CRITICAL
  │
  └─ Irreversible harm / legal liability / public impact
      └─ TIER 4: CRITICAL
```

**Override rules:**

- Any system classified as high-risk under EU AI Act Art. 6 → **minimum Tier 3: HIGH**
- Any system with primarily irreversible actions affecting customers/public → **Tier 4: CRITICAL** regardless of other dimensions
- When classification dimensions point to different tiers, **use the highest tier indicated**

**Document the classification decision.** Record: which system, the assessment date, the assessor, the score per dimension (see [Classification Dimensions](#classification-dimensions) above), the resulting tier, and the rationale. This record is audit evidence (Art. 6 compliance).

---

## Governance Maturity Model

Organizations adopt governed agentic systems progressively. This maturity model provides a self-assessment framework and a roadmap for advancement.

### Level 1: Awareness

| Characteristic | Description |
|---------------|-------------|
| **Agent inventory** | Exists, even if incomplete. Shadow AI detection may be in early stages. |
| **Risk classification** | Basic classification applied — at least Low/Medium/High distinction. |
| **Observability** | Some agents have structured output and event logging. No correlation. |
| **Ring architecture** | None formal. Agents execute without structural governance. |
| **Policy** | Implicit — tribal knowledge, not codified. |
| **Evidence posture** | Minimal. Cannot produce audit packages on demand. |

**Regulatory risk:** High. No structural evidence of governance. Art. 9, 12, 14 requirements unmet.

### Level 2: Foundation

| Characteristic | Description |
|---------------|-------------|
| **Ring activation** | Ring 0 + Ring 1 operational for high-risk agents. |
| **Event capture** | Structured events flowing to basic dashboards. |
| **Policy** | Rules defined for critical governance domains. Not yet versioned as code. |
| **Gates** | Mandatory gates on highest-consequence actions. |
| **Testing** | Pre-deployment evaluation for new agents (Evaluation & Assurance #18). |
| **Identity** | Agent identity established. Delegation chains partially tracked. |
| **Evidence posture** | Partial. Can produce evidence for gated decisions. Cannot yet produce full provenance chains. |

**Regulatory posture:** Art. 14 (human oversight) partially met via gates. Art. 12 (record-keeping) partially met via events. Art. 15 (testing) partially met via pre-deployment evaluation.

### Level 3: Governed

| Characteristic | Description |
|---------------|-------------|
| **Ring activation** | Full Ring 0 + Ring 1 + Ring 2 operational. |
| **Observability** | Correlation-level — not just logging, but cross-event pattern detection. |
| **Trust Ladders** | Actively calibrating. Trust promotions/demotions documented. |
| **Policy** | Policy as Code (#9) — versioned, tested, auditable. |
| **Audit readiness** | Audit packages producible on demand. Full provenance chains. |
| **Integration** | Connected to existing GRC tooling and SIEM. |
| **Evidence posture** | Strong. All Art. 9-15 requirements met structurally. |

**Regulatory posture:** EU AI Act Art. 9-15 requirements met. NIST AI RMF functions operational. Can respond to regulator requests with evidence.

### Level 4: Adaptive

| Characteristic | Description |
|---------------|-------------|
| **Ring activation** | Ring 3 (Learning) operational. Self-improving cycles active. |
| **Monitoring** | Predictive quality and security monitoring. |
| **Intelligence** | Cross-agent and cross-case intelligence. Security Intelligence detecting behavioral drift. |
| **Response** | Automated playbook response for routine patterns. Security Response Bus operational. |
| **Efficiency** | Trust Ladders driving meaningful cost reduction. Governance overhead decreasing. |
| **Evidence posture** | Comprehensive. Proactive evidence generation, not just reactive. |

**Regulatory posture:** Exceeds current regulatory requirements. Prepared for regulatory evolution.

### Level 5: Optimized

| Characteristic | Description |
|---------------|-------------|
| **Governance scope** | Full framework operational across all agent types. |
| **Assurance** | Continuous assurance with minimal manual intervention. |
| **Onboarding** | New agents onboarded with appropriate governance in days, not months. |
| **Federation** | Cross-organizational intelligence — shared baselines, federated learning. |
| **Business value** | Governance is a competitive advantage and customer trust signal, not just a compliance cost. |

**Realistic timeline:** Most organizations reach Level 3 in 12-24 months. Level 4-5 requires operational data, organizational maturity, and likely 2-3 years.

**Assessment guidance:** Evaluate your organization honestly. Being at Level 1 is not a failure — it's a starting point. The maturity model is a roadmap, not a judgment.

---

## Control Crosswalks

This crosswalk maps AGF primitives to established security and compliance control frameworks. Use it to demonstrate that AGF governance mechanisms satisfy controls your organization is already assessed against.

### AGF → NIST 800-53 → ISO 27001 → EU AI Act

| AGF Primitive | NIST 800-53 Rev. 5 Controls | ISO 27001:2022 Controls | EU AI Act Articles |
|---------------|----------------------------|------------------------|-------------------|
| **#1 Separation of Producer/Verifier** | CA-7 (Continuous Monitoring), SI-4 (System Monitoring) | A.5.3 (Segregation of Duties), A.8.16 (Monitoring Activities) | Art. 15 (Accuracy) |
| **#6 Provenance Chains** | AU-3 (Content of Audit Records), AU-6 (Audit Record Review), AU-10 (Non-repudiation) | A.8.15 (Logging), A.5.33 (Protection of Records) | Art. 11 (Technical Documentation), Art. 12 (Record-keeping) |
| **#7 Bounded Agency** | AC-6 (Least Privilege), AC-3 (Access Enforcement), CM-7 (Least Functionality) | A.8.2 (Privileged Access Rights), A.5.15 (Access Control) | Art. 9 (Risk Management), IMDA Dim. 1 |
| **#8 Governance Gates** | AC-3 (Access Enforcement), CM-3 (Configuration Change Control) | A.8.32 (Change Management), A.5.1 (Policies for Information Security) | Art. 14 (Human Oversight) |
| **#9 Policy as Code** | PL-1 (Policy and Procedures), CM-3 (Configuration Change Control), CM-6 (Configuration Settings) | A.5.1 (Policies for Information Security), A.8.9 (Configuration Management) | Art. 9 (Risk Management) |
| **#10 Event-Driven Observability** | AU-2 (Event Logging), AU-3 (Content of Audit Records), AU-12 (Audit Record Generation), SI-4 (System Monitoring) | A.8.15 (Logging), A.8.16 (Monitoring Activities) | Art. 12 (Record-keeping) |
| **#11 Trust Ladders** | AC-2 (Account Management), AC-6 (Least Privilege) | A.5.18 (Access Rights), A.8.2 (Privileged Access Rights) | Art. 9 (Risk Management) |
| **#14 Identity & Attribution** | IA-2 (Identification and Authentication), IA-4 (Identifier Management), IA-8 (Identification and Authentication — Non-Org Users) | A.5.16 (Identity Management), A.8.5 (Secure Authentication) | Art. 13 (Transparency), Art. 50 |
| **#15 Adversarial Robustness** | SI-3 (Malicious Code Protection), SI-7 (Software/Firmware/Info Integrity), RA-5 (Vulnerability Monitoring and Scanning) | A.8.7 (Protection Against Malware), A.8.8 (Management of Technical Vulnerabilities) | Art. 15 (Robustness, Cybersecurity) |
| **#16 Transaction & Side-Effect Control** | CP-9 (System Backup), CP-10 (System Recovery and Reconstitution), SI-10 (Information Input Validation) | A.8.13 (Information Backup), A.8.14 (Redundancy of Information Processing Facilities) | Art. 15 (Accuracy) |
| **#17 Data Governance** | MP-2 (Media Access), PM-25 (Minimization of PII), PT-2 (Authority to Process PII), PT-3 (PII Processing Purposes) | A.5.34 (Privacy and Protection of PII), A.5.12 (Classification of Information) | Art. 10 (Data Governance), GDPR |
| **#18 Evaluation & Assurance** | CA-2 (Control Assessments), CA-8 (Penetration Testing), SA-11 (Developer Testing and Evaluation) | A.8.29 (Security Testing in Development and Acceptance), A.8.8 (Management of Technical Vulnerabilities) | Art. 15 (Accuracy, Robustness) |
| **#19 Agent Environment Governance** | CM-2 (Baseline Configuration), CM-6 (Configuration Settings), CM-8 (System Component Inventory) | A.8.9 (Configuration Management), A.5.9 (Inventory of Information and Other Associated Assets) | IMDA Dim. 1 (Operational Environments) |
| **Security Fabric** | SC-7 (Boundary Protection), SC-8 (Transmission Confidentiality/Integrity), SI-10 (Information Input Validation) | A.8.20 (Network Security), A.8.21 (Security of Network Services), A.8.24 (Use of Cryptography) | Art. 15 (Cybersecurity) |
| **Security Response Bus** | IR-4 (Incident Handling), IR-5 (Incident Monitoring), IR-6 (Incident Reporting) | A.5.24 (Information Security Incident Management Planning), A.5.26 (Response to Information Security Incidents) | Art. 15 (Robustness) |

### How to Use This Crosswalk

1. **Map your existing controls.** If your organization is already assessed against NIST 800-53 or ISO 27001, use the crosswalk to identify which AGF primitives satisfy existing control requirements. This reduces the compliance burden — you're extending existing controls to agentic systems, not starting from scratch.

2. **Identify gaps.** Controls in the crosswalk that your organization has not implemented represent governance gaps for agentic systems. Prioritize based on risk tier.

3. **Produce evidence.** For each control, the corresponding AGF primitive produces specific audit artifacts (see [Governance Evidence](#governance-evidence-what-each-primitive-produces) above). Map these artifacts to control evidence requirements.

4. **Support assessors.** Provide this crosswalk to auditors alongside AGF evidence artifacts. It translates AGF's architecture into the control language assessors already work with.

---

## GRC Primitives Reference

| Primitive | GRC Role |
|-----------|---------|
| **#6 Provenance Chains** | Audit evidence — full decision history for any output |
| **#8 Governance Gates** | Human oversight mechanism — where humans authorize agent actions |
| **#9 Policy as Code** | Governance rules as versioned, executable, testable artifacts |
| **#10 Event-Driven Observability** | Record-keeping — continuous structured event logging |
| **#11 Trust Ladders** | Risk management — graduated trust with documented calibration |
| **#14 Identity & Attribution** | Transparency — who did what, under whose authority |
| **#17 Data Governance** | Privacy compliance — classification, consent, PII, retention |
| **#18 Evaluation & Assurance** | Pre-deployment assurance — testing, red-teaming, regression |
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

### Governance Maturity Self-Assessment

- [ ] Current maturity level identified (Level 1-5)
- [ ] Gap analysis completed: current level vs. target level
- [ ] Regulatory posture at current level documented (which requirements are met, which are not)
- [ ] Advancement plan defined with milestones

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
