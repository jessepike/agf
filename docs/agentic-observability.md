# Agentic Observability & Governance

**Status:** Living concept document
**Last updated:** 2026-03-16
**Terminology:** [Shared Vocabulary](shared-vocabulary.md)
**Relationship:** The **event fabric + Ring 3 intelligence + security monitoring layer** of the Agentic Primitives framework. Consumes the event stream from all rings, provides detection/correlation/response for both quality and security concerns, and feeds Ring 3 learning.
**Origin material:** `research/AI-Risk-Tools-Deep-Dive-Analysis.md` (Part 7, Section 7.5 — "Pipeline Observatory: The SIEM Pattern"), `research/pipeline-verification-spec-v0.3.md` (event envelope architecture)

---

## Contents

1. [Core Thesis](#core-thesis)
2. [First Principles](#first-principles)
3. [The Three Roles](#the-three-roles) — Quality monitoring, security detection, governance intelligence
4. [Mapping to Agentic Primitives](#mapping-to-agentic-primitives)
5. [The SIEM Analogy](#the-siem-analogy)
6. [Event Architecture](#event-architecture) — Envelope, taxonomy, identity context
7. [Correlation Engine](#correlation-engine) — Quality rules, security rules, governance rules
8. [Playbooks & Response](#playbooks--response) — From detection to action
9. [Zero Trust Monitoring](#zero-trust-monitoring) — Security detection for agentic systems
10. [Maturity Model](#maturity-model) — From logging to predictive governance
11. [What This Is NOT](#what-this-is-not)
12. [Market Context](#market-context)
13. [Threads to Current Work](#threads-to-current-work)
14. [Open Questions](#open-questions)

---

## Core Thesis

Organizations are deploying agentic systems with essentially zero observability infrastructure purpose-built for the problem. They're using generic logging (CloudWatch, Datadog), LLM-specific observability tools (LangSmith, Arize, Helicone), or traditional GRC platforms — none of which understand the semantics of governed agentic action.

The gap: **nobody owns the layer between "the agents ran" and "we can prove to auditors, regulators, and boards that the agents ran within governance boundaries."**

This is the SIEM pattern applied to agentic workflows. Traditional SIEM ingests security events from infrastructure and applies correlation rules, playbooks, and forensic investigation to detect and respond to threats. Agentic Observability does the same — but the event sources are agent orchestrators, LLM APIs, tool calls, governance gates, and human-in-the-loop checkpoints. The threats are not unauthorized access — they are **ungoverned autonomous action, adversarial manipulation, quality degradation, policy violations, and trust manipulation.**

The Agentic Primitives framework established that security detection and response lives in the observability layer — not in a dedicated security ring. This means Agentic Observability is not just a quality monitoring system. It is the **unified monitoring, detection, and response layer** for governed agentic systems — covering quality, security, and governance compliance in a single event-driven architecture.

The moat is the same as Decision Intelligence: **structured persistence of how consequential automated actions were governed.** The content is different. The architectural pattern is the same.

---

## First Principles

### 1. You cannot govern what you cannot see

Observability is not a feature — it's a prerequisite. Without structured event capture, there are no audit trails, no pattern detection, no trust ladders, no accountability. Every other governance mechanism in the Agentic Primitives framework depends on the ability to see what agents are doing. Primitive #10 (Event-Driven Observability) is cross-cutting fabric — it makes every other primitive possible.

### 2. Agent events are not infrastructure events

Infrastructure observability (latency, errors, throughput) tells you if the system is running. Agent observability tells you if the system is **behaving within governance boundaries**. These are different questions requiring different event schemas, correlation rules, and response patterns.

What matters for agent governance:
- Did the agent stay within its declared scope? (Bounded Agency #7)
- Did the agent's output pass verification? (Ring 1)
- Did the governance gate function when it should have? (Governance Gates #8)
- Did the agent's reasoning trace back to evidence? (Provenance Chains #6)
- Is someone gaming the trust ladder? (Trust Ladders #11 + Adversarial Robustness #15)
- Did a side effect execute within transaction boundaries? (Transaction Control #16)
- Is the identity context intact at every boundary? (Identity & Attribution #14)

### 3. The event stream is the source of truth

Not the agent's self-report. Not the orchestrator's summary. The structured, immutable, append-only event stream — emitted at every material boundary — is the canonical record of what happened. Everything else (dashboards, alerts, correlation, audit packages, learning) is derived from this stream.

Every event carries full identity context (Primitive #14): which agent, which model, which configuration, which delegation chain, which data scope. This is what makes forensic investigation possible — when something goes wrong, you can trace exactly who did what, when, under what authority.

### 4. Three detection domains, one event stream

The event stream feeds three detection domains from a single source:

- **Quality detection:** Is the system producing correct outputs? Quality score trends, extraction accuracy, verification pass rates, human override patterns.
- **Security detection:** Is the system under adversarial pressure? Ring bypass attempts, trust manipulation trajectories, evidence tampering, memory poisoning, prompt injection patterns.
- **Governance detection:** Is the system operating within policy? Policy violation rates, stale approval usage, mandatory gate bypasses, unauthorized scope expansion, transaction lifecycle violations.

Traditional approaches separate these into different systems (quality tools, security tools, compliance tools). Agentic Observability unifies them because in agentic systems, quality failures, security incidents, and governance violations often share the same event evidence. A quality degradation pattern might be a security attack. A governance violation might indicate a compromised agent.

### 5. Correlation, not just collection

Raw event collection is necessary but not sufficient. The value is in correlation: detecting patterns that individual events don't reveal. Three agents all bypassing quality gates in the same week. Cost per execution trending up 40% over a month. Human overrides clustering on the same field type. A gradual trust escalation followed by a high-stakes anomalous output. The correlation engine is what transforms a log store into an intelligence system.

### 6. Playbooks close the loop

Detection without response is just logging. Playbooks define what happens when a pattern is detected: pause the workflow, escalate to human, roll back the action, flag for audit, adjust trust levels. Initially manual triggers; evolves toward automated response — just like SIEM matured from alerting to SOAR (Security Orchestration, Automation, and Response).

---

## The Three Roles

Agentic Observability serves three distinct roles in the Agentic Primitives architecture:

### Role 1: Quality Monitoring (Ring 3 Intelligence)

The learning layer. Consumes execution data from all rings and feeds Ring 3's Self-Improving Cycles (#3), Trust Ladders (#11), and Memory-Augmented Reasoning (#12).

**What it monitors:**
- Verification pass/fail rates by agent, task type, document type
- Human override patterns (which fields, which directions, which agents)
- Convergence speed (how many validation loop iterations to pass)
- Quality score distributions and trends
- Cost and latency per ring, per agent, per task type

**What it produces:**
- Trust ladder adjustments (empirical, not configured)
- Prompt improvement recommendations (from override patterns)
- Threshold recalibration signals (from false positive analysis)
- Anomaly alerts (sentinel fast path for immediate trust degradation)

### Role 2: Security Detection & Response

The security monitoring layer. Implements Primitive #15 (Adversarial Robustness) at the detection and response level. This is where the zero trust posture is monitored and enforced at scale.

**What it monitors:**
- Ring bypass attempts (agent outputs appearing without Ring 1 verification events)
- Trust manipulation trajectories (agent performing well on low-stakes to build trust for high-stakes exploitation)
- Evidence integrity anomalies (document modifications, source authentication failures)
- Memory poisoning indicators (execution data ingested into Ring 3 that originated from a compromised agent)
- Prompt injection patterns (adversarial content in inputs that alters agent behavior)
- Identity anomalies (delegation chain inconsistencies, unexpected model version changes)
- Cross-pipeline poisoning (compromised Pipeline A output feeding Pipeline B)

**What it produces:**
- Immediate trust degradation on anomaly detection (sentinel fast path)
- Quarantine of affected outputs pending investigation
- Forensic investigation packages (event timeline, provenance walkback, identity trace)
- Incident response playbook triggers
- Security posture dashboards for CISOs and governance leads

### Role 3: Governance Intelligence

The compliance and audit layer. Provides the evidence that organizations need to demonstrate governed operation to regulators, auditors, and boards.

**What it monitors:**
- Policy compliance rates across all Ring 2 evaluations
- Mandatory gate activation (was every required gate actually triggered?)
- Transaction lifecycle completeness (did every side effect go through pre-commit/commit/confirm?)
- Approval freshness (are any active approvals stale relative to context changes?)
- Provenance chain completeness (any gaps in the evidence → decision trace?)

**What it produces:**
- Audit packages: complete governance evidence for a scope (time range, agent, case type, policy domain)
- Regulatory evidence: documentation of governed operation for EU AI Act, NIST AI RMF, ISO 42001
- Compliance dashboards: policy violation rates, gate compliance, provenance coverage
- "What if" analysis: if we adopt this new policy, how many existing decisions would need review?

---

## Mapping to Agentic Primitives

Agentic Observability consumes events from all 19 primitives and provides the detection/response infrastructure for the entire framework.

### Primitives it directly implements

| Primitive | How Agentic Observability implements it |
|-----------|----------------------------------------|
| **#10 Event-Driven Observability** | This IS the product. Agentic Observability is what you build when you make event-driven observability a product. |
| **#15 Adversarial Robustness (detection/response)** | Security detection and response lives here. The security fabric (prevention) lives in each ring. Detection and forensic response live in the observability layer. |
| **#11 Trust Ladders (empirical calibration)** | Trust is earned and degraded based on data from this layer. The observability layer provides the empirical signal that drives trust decisions. |
| **#3 Self-Improving Cycles (data source)** | The execution data that Ring 3 learns from is collected, structured, and analyzed here. |

### Primitives it monitors

| Primitive | What Agentic Observability watches for |
|-----------|---------------------------------------|
| **#7 Bounded Agency** | Did the agent stay within declared scope? Any boundary violations? |
| **#8 Governance Gates** | Did mandatory gates fire? Were adaptive gates appropriately calibrated? Any bypasses? |
| **#9 Policy as Code** | Did policy evaluation run against the correct policy version? Any violations? |
| **#6 Provenance Chains** | Is the chain complete? Any gaps? Any tampered nodes? |
| **#14 Identity & Attribution** | Is identity context intact at every boundary? Any delegation chain anomalies? |
| **#16 Transaction Control** | Did side effects follow the pre-commit/commit/confirm lifecycle? Any stale approvals? |
| **#1 Separation of Producer/Verifier** | Did verification actually run independently? Or was it bypassed? |
| **#2 Validation Loops** | How many iterations to convergence? Trending up (degradation) or down (improvement)? |
| **#13 Error Handling** | What failure modes are occurring? Retry rates? Graceful degradation frequency? |
| **#17 Data Governance** | Is data classification enforced at every boundary? PII leakage detection? Cross-boundary data flow monitoring? |
| **#18 Evaluation & Assurance** | Are pre-deployment evaluations running before configuration changes reach production? Regression detection? |
| **#19 Agent Environment Governance** | Is the environment composed by policy? Are optimization loop proposals logged? Environment drift detection? |

---

## The SIEM Analogy

| Dimension | Traditional SIEM | Agentic Observability |
|-----------|-----------------|----------------------|
| **Event sources** | Firewalls, endpoints, cloud infra, identity systems | Agent orchestrators, LLM APIs, tool calls, governance gates, human checkpoints, model outputs, memory/KB reads and writes |
| **What's monitored** | Unauthorized access, lateral movement, data exfiltration | Quality degradation, policy violations, adversarial manipulation, scope drift, trust manipulation, ungoverned action |
| **Event schema** | CEF, LEEF, syslog, cloud audit logs | Agent event envelope: actor identity (#14), action, target, state change, policy reference, confidence, provenance link, ring, deployment mode |
| **Correlation rules** | "Failed login from 5 IPs in 10 min" | "Agent bypassed mandatory gate 3 times this week" / "Trust escalation followed by anomalous high-stakes output" / "Quality score below threshold for 5 consecutive runs" |
| **Playbooks** | Isolate endpoint, revoke credentials, alert SOC | Pause workflow, degrade trust, quarantine outputs, escalate to human, roll back side effects, trigger re-validation |
| **Investigation** | Timeline reconstruction, lateral movement tracing | Decision replay, provenance chain walkback, agent action timeline, identity trace, evidence integrity audit |
| **Compliance output** | SOC reports, incident timelines, forensic packages | AI governance audit trails, decision provenance exports, regulatory evidence packages (EU AI Act, NIST AI RMF) |
| **Consumers** | SOC analysts, incident responders, CISOs | AI governance leads, CISOs, compliance officers, risk managers, ML engineers, platform teams |
| **Maturity path** | Log collection → alerting → correlation → SOAR → threat intelligence | Event capture → dashboards → correlation → automated response → predictive governance |

---

## Event Architecture

### The Event Envelope

Every material agent action emits an event with a common schema. The envelope is the atomic unit — everything else is built on top of it.

```
Event Envelope:
  event_id:           Unique event identifier
  timestamp:          When the event occurred

  # Identity context (Primitive #14 — travels with every event)
  actor_type:         agent | human | system
  actor_id:           Specific agent instance or human
  actor_version:      Agent configuration version / config hash
  model_id:           Which model, version, provider
  delegation_chain:   Who authorized this actor, under what authority
  tenant_id:          Whose data scope

  # Action context
  action_type:        What happened
  target_type:        What was acted upon
  target_id:          Specific target
  previous_state:     State before the action
  new_state:          State after the action

  # Governance context
  ring:               Which ring this event belongs to (R0, R1, R2, R3)
  deployment_mode:    wrapper | middleware | graph_embedded
  policy_reference:   Which policy rule was evaluated (if applicable)
  gate_type:          mandatory | adaptive | none

  # Quality context
  confidence:         Confidence score (if applicable)
  provenance_link:    Link to the provenance chain node

  # Correlation context
  case_id:            Decision case / assessment / workflow
  run_id:             Specific execution run
  session_id:         Session context
  parent_event_id:    Causal link to triggering event
```

### Event Taxonomy

Events are classified into categories that map to the three detection domains:

**Execution events (Ring 0):**
- `agent_started`, `agent_completed`, `agent_failed`
- `tool_called`, `tool_returned`, `tool_failed`
- `output_produced`, `output_validated_schema`

**Verification events (Ring 1):**
- `verification_started`, `verification_completed`
- `validation_loop_iteration`, `validation_loop_converged`, `validation_loop_exhausted`
- `adversarial_critique_started`, `adversarial_critique_completed`
- `finding_produced` (with severity, field, finding_type)
- `revise_quality_issued`

**Governance events (Ring 2):**
- `policy_evaluated`, `policy_passed`, `policy_violated`
- `gate_triggered` (with gate_type: mandatory | adaptive)
- `gate_resolved` (with resolution: approve | reject | modify | defer | escalate)
- `provenance_recorded`
- `revise_context_issued`
- `transaction_pre_commit`, `transaction_committed`, `transaction_confirmed`
- `approval_granted`, `approval_expired`, `approval_invalidated`

**Learning events (Ring 3):**
- `trust_level_changed` (with direction: increased | decreased | reset)
- `sentinel_triggered` (fast path anomaly detection)
- `improvement_recommended`, `improvement_applied`, `improvement_rolled_back`
- `memory_written`, `memory_queried`, `memory_pruned`

**Security events (cross-cutting):**
- `identity_verified`, `identity_failed`
- `boundary_violation_detected` (agent exceeded declared scope)
- `ring_bypass_detected` (output appeared without expected ring events)
- `evidence_integrity_failed` (source authentication or tampering detection)
- `trust_manipulation_suspected` (anomalous trust trajectory)
- `memory_poisoning_suspected` (compromised data entering Ring 3)

---

## Correlation Engine

The correlation engine consumes the event stream and applies rules across the three detection domains. Rules are versioned, explicit, and auditable — the same principle as Policy as Code (#9) applied to detection logic.

### Quality Correlation Rules

| Rule | Pattern | Response |
|------|---------|----------|
| Quality degradation | Quality score below threshold for N consecutive runs | Alert + sentinel trust degradation |
| Extraction drift | Specific field types producing more human overrides over time | Prompt improvement recommendation |
| Convergence slowdown | Average validation loop iterations trending up | Threshold recalibration signal |
| Model regression | Quality drop correlated with model version change | Alert + investigation |
| Document type failure | Consistent failures on a specific document format | New document profile needed |

### Security Correlation Rules

| Rule | Pattern | Response |
|------|---------|----------|
| Ring bypass | Output without corresponding Ring 1 verification events | Quarantine output + alert |
| Trust manipulation | Low-stakes high-performance streak followed by high-stakes anomaly | Immediate trust reset + investigation |
| Evidence tampering | Document hash mismatch or source authentication failure | Halt processing + quarantine evidence |
| Memory poisoning | Ring 3 ingesting data from an agent with recent security events | Block ingestion + investigation |
| Identity anomaly | Delegation chain inconsistency or unexpected model version in production | Alert + identity re-verification |
| Cross-pipeline poisoning | Downstream pipeline processing output from flagged upstream pipeline | Quarantine downstream + trace upstream |
| Prompt injection | Input patterns matching known injection signatures + anomalous output | Halt + quarantine + investigation |

### Governance Correlation Rules

| Rule | Pattern | Response |
|------|---------|----------|
| Mandatory gate bypass | Decision output without mandatory gate resolution event | Critical alert + halt |
| Stale approval usage | Action executed on approval older than policy-defined TTL | Invalidate + re-gate |
| Policy drift | Increasing rate of policy violations on a specific rule | Policy review recommendation |
| Provenance gap | Decision chain with missing intermediate events | Investigation + flag for audit |
| Transaction lifecycle violation | Side effect without pre-commit/commit/confirm sequence | Alert + compensation check |
| Unauthorized scope expansion | Agent accessing tools or data outside declared Bounded Agency | Immediate containment + alert |

---

## Playbooks & Response

Playbooks define the automated or semi-automated response when correlation rules trigger. They evolve through the maturity model from manual to automated.

### Response Actions

| Action | Description | When used |
|--------|-------------|-----------|
| **Alert** | Notify human, continue operation | Low-severity quality or governance patterns |
| **Degrade trust** | Lower trust level, increase verification intensity | Quality anomalies, sentinel triggers |
| **Pause** | Halt workflow pending human review | Medium-severity governance violations |
| **Quarantine** | Isolate affected outputs pending investigation | Security events, evidence integrity failures |
| **Contain** | Restrict agent scope, revoke tool access | Boundary violations, compromised agent indicators |
| **Roll back** | Execute compensation for committed side effects | Transaction lifecycle violations with downstream impact |
| **Escalate** | Route to higher authority (governance lead, CISO) | Critical security events, mandatory gate bypasses |
| **Investigate** | Generate forensic package (event timeline, provenance walkback, identity trace) | Any security correlation trigger |

### Playbook Examples

**Trust Manipulation Detection Playbook:**
```
Trigger: trust_manipulation_suspected
Steps:
  1. Immediately reset trust to LOW for affected agent
  2. Quarantine the anomalous high-stakes output
  3. Re-verify all outputs from this agent in the trust escalation window
  4. Generate investigation package (full event timeline, trust trajectory, output comparison)
  5. Alert governance lead with investigation package
  6. Block Ring 3 from ingesting any data from this agent until investigation resolves
```

**Mandatory Gate Bypass Playbook:**
```
Trigger: mandatory_gate_bypass detected
Steps:
  1. Immediately halt all processing in the affected pipeline
  2. Quarantine all outputs produced after the bypass point
  3. Generate provenance walkback from bypass point to current state
  4. Alert CISO and governance lead (critical severity)
  5. If side effects were committed: trigger compensation evaluation
  6. Do not resume until human authorization with justification recorded
```

---

## Zero Trust Monitoring

Agentic Observability is where the zero trust posture is **monitored and enforced at scale**. The security fabric (Primitive #15) provides prevention within each ring. The observability layer provides detection, correlation, and response across the entire system.

### What zero trust monitoring looks like

| Zero Trust Principle | What the observability layer monitors |
|---------------------|--------------------------------------|
| **Never trust, always verify** | Are identity verification events present at every ring boundary? Any gaps in the verification chain? |
| **Least privilege** | Is any agent accessing tools or data outside its declared scope? Any privilege escalation patterns? |
| **Assume breach** | Are containment mechanisms functioning? If an agent were compromised right now, how much damage could it do before detection? |
| **Verify explicitly** | Is full identity context (agent, model, delegation, data, human) present on every event? Any events with incomplete identity? |
| **Microsegmentation** | Is tenant isolation holding? Any cross-tenant data leakage in events? Any cross-pipeline trust boundary violations? |

### Security posture scoring

The observability layer maintains a continuous security posture score across:
- **Ring integrity:** Are all rings functioning with proper verification?
- **Identity completeness:** What percentage of events carry full identity context?
- **Gate compliance:** Are all mandatory gates being triggered and resolved?
- **Trust hygiene:** Are trust levels being earned empirically, not configured statically?
- **Containment readiness:** If a breach is detected, can the system contain it within one ring/pipeline?

---

## Maturity Model

Agentic Observability matures through five levels, mirroring the maturity path of traditional SIEM:

### Level 1: Event Capture
- Structured event emission at ring boundaries
- Event persistence (append-only, immutable)
- Basic event browsing and search
- **Value:** "We can see what happened"

### Level 2: Dashboards & Alerting
- Real-time dashboards (quality, governance, cost)
- Threshold-based alerts (quality below X, cost above Y)
- Trust level visualization
- **Value:** "We know when something is wrong"

### Level 3: Correlation & Detection
- Cross-event pattern detection (quality rules, security rules, governance rules)
- Temporal correlation (trends over time)
- Agent-level behavioral baselines
- Anomaly detection against baselines
- **Value:** "We can detect patterns that individual events don't reveal"

### Level 4: Automated Response
- Playbook-driven response (trust degradation, quarantine, containment, escalation)
- Automated trust ladder calibration
- Sentinel fast path for real-time anomaly response
- Self-improving cycle automation (Ring 3 configuration changes with regression detection)
- **Value:** "The system responds to detected patterns without waiting for humans"

### Level 5: Predictive Governance
- Predictive quality degradation (before it happens, based on leading indicators)
- Proactive trust adjustment (detect environments that historically produce failures)
- Policy impact simulation ("if we change this rule, what happens to the pipeline?")
- Cross-system intelligence (patterns from one deployment inform another)
- **Value:** "The system anticipates governance needs before they become problems"

Most organizations will start at Level 1-2 and take months to reach Level 3. Level 4-5 require significant operational data and maturity.

---

## What This Is NOT

- **Not LLM observability.** Tools like LangSmith, Arize, Helicone, and Galileo track model performance (latency, token usage, hallucination rates, evaluation scores). Valuable, but different question. Agentic Observability asks whether the agent *system* — models + tools + orchestration + human loops + governance — operated within governance and security boundaries. LLM observability feeds into Agentic Observability as one event source among many.

- **Not APM.** Application performance monitoring (Datadog, New Relic, Dynatrace) tracks whether the system is up and fast. Agentic Observability tracks whether the system is governed, secure, and trustworthy. APM tells you Ring 0 executed in 3 seconds. Agentic Observability tells you Ring 1 verified the output, Ring 2 authorized the action, and the provenance chain is complete.

- **Not a GRC platform.** Traditional GRC (OneTrust, Archer, ServiceNow GRC) manages controls, questionnaires, and compliance workflows. Agentic Observability is the telemetry layer that feeds governance evidence INTO those platforms — or operates as the governance layer for organizations that don't have a GRC platform yet.

- **Not traditional SIEM.** Splunk, Chronicle, Elastic SIEM, and Sentinel monitor infrastructure security events. They don't understand agentic event semantics — ring signals, governance gates, trust ladders, belief revisions, decision provenance. Agentic Observability speaks the language of governed agentic systems. It may integrate with traditional SIEM (sending security alerts upstream), but it is not a replacement for infrastructure SIEM.

---

## Market Context

**Current state of play:**
- Companies deploying agentic systems are duct-taping observability from generic tools that don't understand governance semantics
- LLM observability tools (LangSmith, Arize, Helicone, Fiddler, Galileo) cover model performance, not governance or security
- Traditional SIEM vendors (Splunk, Chronicle, Elastic) haven't extended to agentic event semantics
- GRC platforms (OneTrust, Archer, ServiceNow GRC) can't ingest agentic event streams
- ServiceNow AI Control Tower is the closest enterprise play — centralized command center for AI agents — but scoped to ServiceNow's ecosystem
- Salesforce Agentforce has governance features (Einstein Trust Layer) but scoped to Salesforce agents
- OpenTelemetry GenAI semantic conventions are standardizing LLM-level tracing — but don't cover governance, security, or ring-level semantics

**The gap:** No product purpose-built to ingest, correlate, and govern the event stream from arbitrary agentic systems across quality, security, and governance domains. The "SIEM for agents" doesn't exist yet.

**Who needs this:**
- **Enterprises deploying agentic workflows** — customer service, coding, document processing, decision support. They need to prove governed operation.
- **Regulated industries** — insurance, financial services, healthcare. AI governance audit trails are legally required (EU AI Act, state AI laws, NAIC bulletin).
- **AI platform teams** — responsible for the reliability, security, and governance of agent infrastructure across the organization.
- **Decision Intelligence deployments** — the observability layer IS the security and quality monitoring layer for decision systems.
- **Eventually: individuals** — running personal agent systems who want visibility into what their agents are doing and trust calibration for their workflows.

---

## Threads to Current Work

| Current Work | Connection | Status |
|-------------|-----------|--------|
| Agentic Primitives framework | Agentic Observability implements #10 (Event-Driven Observability), provides detection/response for #15 (Adversarial Robustness), calibrates #11 (Trust Ladders), feeds #3 (Self-Improving Cycles). Monitors all other primitives. | Defined (19 primitives, rings, zero trust) |
| Pipeline verification spec (v0.3) | The event envelope schema, verification middleware, gate logic, and observatory vision are a working implementation of Level 1-2 for one specific pipeline. | Specified |
| Pipeline Observatory concept | Section 7.5 of the Deep Dive Analysis names the SIEM pattern explicitly. The first concrete implementation of Agentic Observability, scoped to the assessment pipeline. | Conceptualized |
| Decision Intelligence concept | Decision Intelligence produces decisions and emits events. Agentic Observability consumes those events for quality monitoring, security detection, and governance compliance. Complementary layers — DI governs decisions, AO monitors the agents making them. | Updated |
| AI Risk Tools assessment pipeline | The pipeline's event system is the first Agentic Observability implementation. Verification events, gate decisions, human review outcomes — all Level 1 event capture. | Built (Level 1) |

---

## Open Questions

- **Event schema standardization:** ~~OpenTelemetry GenAI semantic conventions are standardizing LLM-level tracing. Build on OTel or separate?~~ **Resolved:** OTel-compatible base + governance extensions. OTel GenAI conventions (Development maturity, v1.40.0) already cover agent spans, tool calls, model identity. AGF adds governance-specific extensions (ring, deployment_mode, policy_reference, gate_type) as custom attributes within the OTel data model. Pursue standardization of reusable governance extensions through OTel community process.
- **Ingestion breadth vs. depth:** Start with deep observability for one agent framework (LangGraph, CrewAI, custom) or broad but shallow ingestion from many? Deep-first is likely — prove the value, then broaden.
- **Standalone vs. layer:** Start standalone, integrate over time — same path as cloud SIEM. Feed audit packages into existing GRC platforms. Feed security alerts into existing SIEM. But own the agentic intelligence.
- **Correlation rule authoring:** Who writes correlation rules? Security team? Governance team? Platform team? Likely all three — domain-specific rule authoring with shared infrastructure.
- **Relationship to Decision Intelligence:** Shared primitives, distinct products, eventual convergence. AO is the monitoring layer for DI. DI is a primary event source for AO. They are symbiotic but independently valuable.
- **Personal vs. enterprise:** Is there a "personal agent governance" product? Lightweight trust ladders, basic quality monitoring, simple audit trail. The Level 1-2 maturity model could map to personal use. Level 3+ is enterprise.
- **Privacy tension:** ~~Event-driven observability says "log everything." Privacy regulations say "minimize data."~~ **Resolved (pattern):** Log governance events (ring signals, gate decisions, trust changes, identity context) with **redacted content** — the event records *that* an action happened, *who* did it, and *what the governance outcome was*, without persisting full input/output content. Full content available only in investigation mode with access controls and audit trail. For GDPR contexts, retention policies must account for data subject rights. See Observability Profile Known Limitations for operational details.
- **Pricing model:** Per event volume? Per agent monitored? Per audit package generated? Platform fee? Likely: platform fee + event volume tier — same model as SIEM (Splunk charges by data ingestion volume).

---

*This is an AGF capability layer document. For the framework overview, see [AGF: A Reference Architecture for Governed Agentic Systems](agf-reference-architecture.md). For the practitioner-facing view, see the [Observability Profile](../profiles/observability-profile.md). For the foundational primitives, see [Agentic Primitives](agentic-primitives.md).*
