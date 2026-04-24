# AGF Observability Profile: Monitoring, Detection, and Response for Agentic Systems

**Version:** 0.1 Draft
**Last updated:** 2026-03-18
**Parent:** [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md)
**Terminology:** [Shared Vocabulary](../docs/shared-vocabulary.md)

---

## Who This Is For

SREs, SOC analysts, detection engineers, platform reliability engineers, and anyone responsible for monitoring, detecting threats in, and responding to incidents involving autonomous AI agents in production.

**The key question this profile answers:** *How do I see what my agents are doing and respond when they misbehave?*

**Scope boundary:** This profile covers runtime operations — monitoring, detection, correlation, and response. Infrastructure deployment belongs to the [Platform Profile](platform-profile.md). Threat modeling belongs to the [Security Profile](security-profile.md). Primitive implementation belongs to the [AI Engineering Profile](ai-engineering-profile.md). Regulatory evidence generation belongs to the [GRC Profile](grc-profile.md).

**Prerequisites:** Familiarity with the [Rings Model and core concepts](../docs/agf-reference-architecture.md#core-concepts) in the AGF meta document.

---

## Contents

1. [The Observability Challenge](#the-observability-challenge)
2. [The SIEM Pattern for Agents](#the-siem-pattern-for-agents)
3. [Three Detection Domains, One Event Stream](#three-detection-domains-one-event-stream)
4. [Event Architecture](#event-architecture)
5. [Correlation Engine](#correlation-engine)
6. [Operational Playbooks](#operational-playbooks)
7. [Zero Trust Monitoring](#zero-trust-monitoring)
8. [Observability Maturity Model](#observability-maturity-model)
9. [What This Is NOT](#what-this-is-not)
10. [Known Limitations and Operational Realities](#known-limitations-and-operational-realities)
11. [Observability Primitives Reference](#observability-primitives-reference)
12. [Operations Checklist](#operations-checklist)

---

## The Observability Challenge

Agent systems are not applications. Applications do what they're told. Agents reason, choose tools, take actions, delegate to other agents, and modify their own behavior over time. Every one of these capabilities introduces failure modes and attack vectors that infrastructure observability — latency, errors, throughput — cannot see.

The observability challenge for agentic systems has three dimensions:

1. **Agent events are not infrastructure events.** Infrastructure observability tells you if the system is running. Agent observability tells you if the system is *behaving within governance boundaries*. "Ring 0 executed in 3 seconds" is infrastructure. "Ring 1 verified the output, Ring 2 authorized the action, and the provenance chain is complete" is agent observability.

2. **Three detection domains share one event stream.** Quality failures, security incidents, and governance violations often share the same event evidence. A quality degradation pattern might be a security attack. A compliance anomaly might indicate a compromised agent. Separating these into different tools loses critical correlation signal.

3. **Correlation, not just collection.** Raw event collection is necessary but not sufficient. The value is in correlation: three agents all bypassing quality gates in the same week. A gradual trust escalation followed by an anomalous high-stakes output. Cost per execution trending up 40% over a month. The correlation engine transforms a log store into an intelligence system.

---

## The SIEM Pattern for Agents

Traditional SIEM (Security Information and Event Management) ingests security events from infrastructure — firewalls, endpoints, identity systems — and applies correlation rules, playbooks, and forensic investigation to detect and respond to threats.

Agentic Observability applies the same pattern, but the event sources are different:

| Traditional SIEM | Agentic Observability |
|-----------------|----------------------|
| Firewall logs, endpoint events | Ring boundary events, tool calls, gate decisions |
| Network authentication | Agent identity verification, delegation chains |
| File integrity monitoring | Provenance chain integrity, evidence tampering |
| User behavior analytics | Agent behavioral baselines, trust trajectories |
| Incident response playbooks | Governance response playbooks (quarantine, trust degradation, containment) |

The threats are different too. Not unauthorized network access — but **ungoverned autonomous action, adversarial manipulation, quality degradation, policy violations, and trust manipulation.**

The architecture is the same: **structured event ingestion → correlation rules → detection → response playbooks → forensic investigation.**

---

## Three Detection Domains, One Event Stream

The unified event stream feeds three detection domains:

### Quality Detection (Ring 3 Intelligence)

**Monitors:**

- Verification pass/fail rates by agent, task type, document type
- Human override patterns (which fields, which directions, which agents)
- Convergence speed (validation loop iterations to pass)
- Quality score distributions and trends
- Cost and latency per ring, per agent, per task type

**Produces:**

- Trust ladder adjustments (empirical, data-driven)
- Prompt improvement recommendations (from override patterns)
- Threshold recalibration signals (from false positive analysis)
- Anomaly alerts (sentinel fast path for immediate trust degradation)

### Security Detection (Cross-cutting)

**Monitors:**

- Ring bypass attempts (outputs without expected verification events)
- Trust manipulation trajectories (building trust on low-stakes for high-stakes exploitation)
- Evidence integrity anomalies (source authentication failures, provenance tampering)
- Memory poisoning indicators (compromised data entering Ring 3)
- Prompt injection patterns (adversarial content altering behavior)
- Identity anomalies (delegation chain inconsistencies, unexpected model changes)
- Cross-pipeline poisoning (compromised Pipeline A output feeding Pipeline B)

**Produces:**

- Immediate trust degradation on anomaly detection (sentinel fast path)
- Quarantine of affected outputs pending investigation
- Forensic investigation packages (event timeline, provenance walkback, identity trace)
- Incident response playbook triggers
- Security posture dashboards

### Governance Detection (Compliance)

**Monitors:**

- Policy compliance rates across all Ring 2 evaluations
- Mandatory gate activation (was every required gate triggered?)
- Transaction lifecycle completeness (pre-commit → commit → confirm)
- Approval freshness (stale approvals relative to context changes)
- Provenance chain completeness (gaps in the evidence → decision trace)

**Produces:**

- Audit packages: complete governance evidence for a scope (time range, agent, case type)
- Regulatory evidence: documentation for EU AI Act, NIST AI RMF, ISO 42001
- Compliance dashboards: policy violation rates, gate compliance, provenance coverage
- "What if" analysis: policy change impact simulation

---

## Event Architecture

### The Event Envelope

Every material agent action emits an event with a common schema. The envelope is the atomic unit.

```
Event Envelope:
  event_id:           Unique event identifier
  timestamp:          When the event occurred

  # Identity context (#14 — travels with every event)
  actor_type:         agent | human | system
  actor_id:           Specific agent instance or human
  actor_version:      Agent configuration version / config hash
  model_id:           Which model, version, provider
  delegation_chain:   Who authorized this actor, under what authority
  tenant_id:          Whose data scope

  # Action context
  action_type:        What happened (from event taxonomy)
  target_type:        What was acted upon
  target_id:          Specific target
  previous_state:     State before the action
  new_state:          State after the action

  # Governance context
  ring:               Which ring (R0, R1, R2, R3)
  deployment_mode:    wrapper | middleware | graph_embedded
  policy_reference:   Which policy rule was evaluated
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

Events classified by ring, mapping to the three detection domains:

**Execution events (Ring 0):**

- `agent_started`, `agent_completed`, `agent_failed`
- `tool_called`, `tool_returned`, `tool_failed`
- `output_produced`, `output_validated_schema`

**Verification events (Ring 1):**

- `verification_started`, `verification_completed`
- `validation_loop_iteration`, `validation_loop_converged`, `validation_loop_exhausted`
- `adversarial_critique_started`, `adversarial_critique_completed`
- `finding_produced` (severity, field, finding_type)
- `revise_quality_issued`

**Governance events (Ring 2):**

- `policy_evaluated`, `policy_passed`, `policy_violated`
- `gate_triggered` (gate_type: mandatory | adaptive)
- `gate_resolved` (resolution: approve | reject | modify | defer | escalate)
- `provenance_recorded`
- `revise_context_issued`
- `transaction_pre_commit`, `transaction_committed`, `transaction_confirmed`
- `approval_granted`, `approval_expired`, `approval_invalidated`

**Learning events (Ring 3):**

- `trust_level_changed` (direction: increased | decreased | reset)
- `sentinel_triggered` (fast path anomaly detection)
- `improvement_recommended`, `improvement_applied`, `improvement_rolled_back`
- `memory_written`, `memory_queried`, `memory_pruned`

**Environment events (#19):**

- `environment_composed` (layers assembled, context budget allocated)
- `environment_optimization_proposed`, `environment_optimization_applied`, `environment_optimization_rejected`
- `tool_provisioned`, `tool_revoked` (capability set changes)
- `instruction_version_changed` (L2 instruction update deployed)

**Security events (cross-cutting):**

- `identity_verified`, `identity_failed`
- `boundary_violation_detected` (agent exceeded declared scope)
- `ring_bypass_detected` (output without expected ring events)
- `evidence_integrity_failed` (tampering or authentication failure)
- `trust_manipulation_suspected` (anomalous trust trajectory)
- `memory_poisoning_suspected` (compromised data entering Ring 3)

### OTel Integration

AGF is an **OTel-compatible base + governance extensions** architecture. OTel GenAI semantic conventions (Development maturity, v1.40.0) already provide substantial native compatibility — agent spans, tool-call capture, model identity, token usage, and emerging MCP conventions.

**OTel Signal Mapping:**

| AGF Event Category | OTel Signal Type | Examples |
|-------------------|-----------------|---------|
| Operations with duration | **Spans** | `agent_started/completed`, `tool_called/returned`, `verification_started/completed`, `gate_triggered/resolved` |
| Point-in-time within an operation | **Span Events** | `finding_produced`, `adversarial_critique`, `output_validated_schema` |
| Standalone occurrences | **Log Records** | `trust_level_changed`, `sentinel_triggered`, `boundary_violation_detected` |
| Aggregations | **Metrics** | Token usage (`gen_ai.usage.*`), policy evaluation counts, quality scores |

**Correlation context mapping:** `run_id` → OTel `trace_id`, `parent_event_id` → `parent_span_id`, `session_id` → `gen_ai.conversation.id`, `case_id` → OTel Baggage (no direct equivalent).

Governance-specific extensions (`ring`, `deployment_mode`, `policy_reference`, `gate_type`) use custom attributes within the OTel data model under an `agf.*` namespace. These could be proposed as OTel semantic convention extensions for reusable pieces (policy decision events, gate outcomes, provenance pointers).

**Complementary specifications:** OpenInference (Arize/Phoenix — GUARDRAIL and EVALUATOR span kinds), CloudEvents (CNCF — event transport), W3C Trace Context (distributed agent tracing), OTel GenAI Agentic Systems Proposal #2664.

---

## Correlation Engine

The correlation engine consumes the event stream and applies rules across the three detection domains. Rules are versioned, explicit, and auditable — the same principle as Policy as Code (#9) applied to detection logic.

**Note on abstraction level:** The rules below are a **detection strategy taxonomy**, not production-level detection rules. Each conceptual rule decomposes into 3-10 implementable detections with specific log fields, thresholds, and time windows. Rules are tagged with OWASP ASI identifiers where applicable. For the full rule set, see the [Agentic Observability concept doc](../docs/agentic-observability.md#correlation-engine).

### Quality Correlation Rules

| Rule | Pattern | Response | Ref |
|------|---------|----------|-----|
| **Quality regression** | Ring 1 pass rate drops >15% over rolling 7-day window | Alert, investigate, consider trust demotion | — |
| **Convergence degradation** | Average validation loop iterations trending up >25% | Alert, investigate prompt/model degradation | — |
| **Override clustering** | Human overrides clustering on same field type across agents | Alert, flag for prompt improvement | — |
| **Cost / resource anomaly** | Per-execution cost >2σ above baseline, or token runaway / recursive loop | Budget circuit breaker + alert | ASI02 |
| **Trust-quality divergence** | Trust level increasing while Ring 1 pass rate is flat or declining | Alert, investigate calibration | — |
| **Hallucination spike** | Output claims not grounded in source evidence (grounding check failure rate up) | Alert + verification intensity increase | — |

### Security Correlation Rules

| Rule | Pattern | Response | Ref |
|------|---------|----------|-----|
| **Agent goal hijacking** | Behavioral divergence from authorized objectives, instruction drift | Containment + investigation | ASI01 |
| **Tool misuse** | Permitted tools used in anomalous parameter combinations or sequences | Alert + scope review | ASI02 |
| **Lateral movement** | Privilege escalation in Agent A → coordinated behavior change in Agent B within 60s | Response Bus containment, critical alert | ASI07 |
| **Trust manipulation** | Trust level increase >2 tiers in <7 days followed by novel high-stakes action | Immediate trust reset, quarantine, investigate | ASI09 |
| **Memory drift** | Memory store embedding distribution shifts >threshold from baseline | Alert, memory introspection, quarantine | ASI06 |
| **Identity anomaly** | Delegation chain inconsistency OR unexpected model version | Critical alert, halt pipeline, investigate | ASI03 |
| **Ring bypass** | Output released without Ring 1 or Ring 2 events in provenance chain | Critical alert, quarantine all outputs since bypass | — |
| **Supply chain compromise** | MCP server integrity failure, tool schema mutation, untrusted server | Quarantine tool + isolate agents + alert | ASI04 |
| **Cascading failure** | Error rate >3× baseline across ≥2 agents within 30s | Circuit breakers + Response Bus | ASI08 |
| **Data exfiltration** | Abnormal cross-boundary data flows or classification-violating output | Block data flows + isolate + critical alert | ASI03 |

### Governance Correlation Rules

| Rule | Pattern | Response | Ref |
|------|---------|----------|-----|
| **Gate bypass** | Mandatory gate not triggered for action that should have triggered it | Critical alert, halt pipeline, quarantine outputs | — |
| **Stale approval** | Active approval granted >24 hours ago AND context has materially changed | Invalidate approval, re-gate | — |
| **Policy drift** | Policy evaluation running against outdated policy version | Alert, flag for policy sync | — |
| **Provenance gap** | Gap in provenance chain (event N → event N+3, no N+1 or N+2) | Alert, investigate, flag affected outputs | Art. 12 |
| **Transaction violation** | Side effect committed without pre-commit event OR confirmation timeout | Alert, trigger compensation evaluation | — |
| **Missing required telemetry** | Expected governance event not observed within time window | Alert + flag for audit | — |
| **Data governance violation** | PII processed without classification, consent exceeded, unauthorized cross-boundary flow | Halt data flow + alert | Art. 10 |

### Dual-Speed Detection

Detection operates at two speeds:

- **Fast path (sentinels):** Sub-second. Known-pattern anomaly detection. Triggers immediate trust degradation, quarantine, or Response Bus containment. For patterns where delay means damage.
- **Slow path (analysis):** Hours to days. Cross-execution pattern analysis, behavioral drift, memory evolution tracking, trend detection. For patterns that only emerge over time.

---

## Operational Playbooks

Operational playbooks define response actions when correlation rules trigger. For incident response playbooks covering specific attack scenarios (lateral movement, memory poisoning, trust manipulation, etc.), see the [Security Profile](security-profile.md#incident-response-playbook-structure).

### Response Actions

| Action | Description | When Used |
|--------|-------------|-----------|
| **Alert** | Notify human, continue operation | Low-severity quality or governance patterns |
| **Degrade trust** | Lower trust level, increase verification intensity | Quality anomalies, sentinel triggers |
| **Pause** | Halt workflow pending human review | Medium-severity governance violations |
| **Quarantine** | Isolate affected outputs pending investigation | Security events, evidence integrity failures |
| **Contain** | Restrict agent scope, revoke tool access | Boundary violations, compromised agent indicators |
| **Roll back** | Execute compensation for committed side effects | Transaction lifecycle violations with downstream impact |
| **Escalate** | Route to higher authority (governance lead, CISO) | Critical security events, mandatory gate bypasses |
| **Investigate** | Generate forensic package | Any security correlation trigger |

### Forensic Investigation

When an investigation is triggered, the observability layer produces:

1. **Event timeline** — complete event sequence for the affected scope, with ring attribution
2. **Provenance walkback** — full provenance chain from the anomalous output back to original inputs
3. **Identity trace** — every actor, model, and delegation chain involved
4. **Behavioral comparison** — current behavior vs. established baseline, highlighting deviations
5. **Impact assessment** — downstream effects: which decisions, which side effects, which users affected

The forensic package is itself a governed artifact — it carries identity context, is append-only, and is preserved per retention policy.

---

## Zero Trust Monitoring

The Security Fabric (#15) provides prevention within each ring. The observability layer provides **detection, correlation, and response across the entire system** — where the zero trust posture is monitored and enforced at scale.

### What Zero Trust Monitoring Looks Like

| Zero Trust Principle | What the Observability Layer Monitors |
|---------------------|--------------------------------------|
| **Never trust, always verify** | Are identity verification events present at every ring boundary? Any gaps in the verification chain? |
| **Least privilege** | Is any agent accessing tools or data outside its declared scope? Any privilege escalation patterns? |
| **Assume breach** | Are containment mechanisms functioning? If an agent were compromised right now, how much damage before detection? |
| **Verify explicitly** | Is full identity context (agent, model, delegation, data, human) present on every event? Any events with incomplete identity? |
| **Microsegmentation** | Is tenant isolation holding? Any cross-tenant data leakage in events? Cross-pipeline trust boundary violations? |

### Security Posture Scoring

The observability layer maintains a continuous security posture score across:

| Dimension | What It Measures | Healthy Signal |
|-----------|-----------------|----------------|
| **Ring integrity** | All rings functioning with proper verification | 100% of expected ring events present |
| **Identity completeness** | Events carrying full identity context | >99% complete identity on all events |
| **Gate compliance** | Mandatory gates triggered and resolved | 100% mandatory gate activation rate |
| **Trust hygiene** | Trust levels earned empirically, not configured statically | Trust changes correlated with performance data |
| **Containment readiness** | System can contain a breach within one ring/pipeline | Response Bus tested, pre-authorized classes current |

---

## Observability Maturity Model

Agentic Observability matures through five levels, mirroring the maturity path of traditional SIEM:

### Level 1: Event Capture

- Structured event emission at ring boundaries
- Event persistence (append-only, immutable)
- Basic event browsing and search
- **Value:** "We can see what happened"
- **Effort:** Low — instrument ring boundaries with structured event emission

### Level 2: Dashboards & Alerting

- Real-time dashboards (quality, governance, cost)
- Threshold-based alerts (quality below X, cost above Y)
- Trust level visualization
- **Value:** "We know when something is wrong"
- **Effort:** Medium — dashboard infrastructure, alert routing, on-call integration

### Level 3: Correlation & Detection

- Cross-event pattern detection (quality, security, governance rules)
- Temporal correlation (trends over time)
- Agent-level behavioral baselines
- Anomaly detection against baselines
- **Value:** "We can detect patterns that individual events don't reveal"
- **Effort:** High — correlation engine, baseline computation, rule authoring

### Level 4: Automated Response

- Playbook-driven response (trust degradation, quarantine, containment, escalation)
- Automated trust ladder calibration
- Sentinel fast path for real-time anomaly response
- Self-improving cycle automation (Ring 3 changes with regression detection)
- **Value:** "The system responds to detected patterns without waiting for humans"
- **Effort:** High — playbook automation, Response Bus integration, regression gates

### Level 5: Predictive Governance

- Predictive quality degradation (before it happens, based on leading indicators)
- Proactive trust adjustment (environments that historically produce failures)
- Policy impact simulation ("if we change this rule, what happens?")
- Cross-system intelligence (patterns from one deployment inform another)
- **Value:** "The system anticipates governance needs before they become problems"
- **Effort:** Very high — predictive models, simulation infrastructure, cross-system data sharing

**Realistic timeline:** Most organizations start at Level 1-2 and take months to reach Level 3. Level 4-5 require significant operational data and maturity.

---

## What This Is NOT

- **Not LLM observability.** Tools like LangSmith, Arize, Helicone, and Galileo track model performance (latency, token usage, hallucination rates). Agentic Observability asks whether the agent *system* — models + tools + orchestration + human loops + governance — operated within governance and security boundaries. LLM observability is one event source feeding this layer.

- **Not APM.** Application performance monitoring (Datadog, New Relic) tracks whether the system is up and fast. Agentic Observability tracks whether the system is governed, secure, and trustworthy.

- **Not a GRC platform.** Traditional GRC (OneTrust, Archer, ServiceNow GRC) manages controls and compliance workflows. Agentic Observability is the telemetry layer that feeds governance evidence INTO those platforms.

- **Not traditional SIEM.** Splunk, Chronicle, Elastic SIEM don't understand agentic event semantics — ring signals, governance gates, trust ladders, decision provenance. Agentic Observability speaks the language of governed agentic systems. It may integrate with traditional SIEM (sending security alerts upstream), but it doesn't replace infrastructure SIEM.

---

## Known Limitations and Operational Realities

1. **Observability vs. Privacy.** Event-driven observability says "log everything material." Privacy regulations and data minimization principles say "minimize what you collect." This tension is real. Resolution pattern: log governance events (ring signals, gate decisions, trust changes, identity context) with **redacted content** — the event records *that* an action happened, *who* did it, and *what the governance outcome was*, without persisting the full content of inputs/outputs. Full content is available only in investigation mode with access controls and audit trail. For GDPR contexts, this means event retention policies must account for data subject rights.

2. **Event volume at scale.** A governed agentic system with full ring instrumentation produces significantly more events than traditional applications. At scale (hundreds of agents, thousands of executions per day), event storage is a real infrastructure cost. Operations teams must design for this:
   - **Sampling:** Low-stakes, high-trust agents can use statistical sampling rather than exhaustive logging (Level 1 events only). High-stakes and critical-tier agents require full event capture.
   - **Tiered storage:** Hot storage for recent events (days-weeks), warm storage for correlation windows (weeks-months), cold/archive for audit retention (months-years).
   - **Retention policies:** Define per risk tier. Critical-tier events retained for system lifetime or regulatory requirement. Low-tier events may age off after 90 days.

3. **Correlation rule authoring.** Who writes and maintains correlation rules? Quality rules need domain expertise (the team that understands what good output looks like). Security rules need security expertise (SOC, red team). Governance rules need compliance expertise (GRC team). In practice, this means rule authoring is a cross-functional responsibility — shared infrastructure, domain-specific rules.

4. **Baseline cold start.** Behavioral baselines require historical data. New agents have no baseline — anomaly detection doesn't work until enough execution data accumulates. During the cold start period, agents should run at maximum governance intensity (all gates, full verification) regardless of risk tier.

5. **OTel compatibility is extension, not native.** AGF's governance, security, and ring-level event semantics are custom extensions within the OTel data model, not native OTel semantic conventions. This means OTel tooling (Jaeger, Grafana Tempo, Honeycomb) can ingest and display AGF events, but won't understand the governance semantics without custom dashboards and correlation rules.

---

## Observability Primitives Reference

The following AGF primitives are directly relevant to observability and operations. For full pattern descriptions, see the [AI Engineering Profile](ai-engineering-profile.md) or the [AGF Primitives catalog](../docs/agentic-primitives.md).

| Primitive | Observability Role |
|-----------|-------------------|
| **#3 Self-Improving Cycles** | The learning engine that consumes observability data to improve |
| **#6 Provenance Chains** | The audit trail — what the forensic investigation follows |
| **#10 Event-Driven Observability** | The core primitive. This profile IS the operational expression of #10 |
| **#11 Trust Ladders** | Calibrated by observability data. Trust changes are observability events. |
| **#13 Error Handling & Recovery** | Failure modes are observability events. Recovery actions are playbook triggers. |
| **#14 Identity & Attribution** | Identity context on every event — the foundation for forensic investigation |
| **#15 Adversarial Robustness** | Security detection and response lives in the observability layer |

---

## Operations Checklist

### Level 1: Event Capture (Start Here)

- [ ] Structured events emitted at every ring boundary
- [ ] Event envelope schema implemented with full identity context
- [ ] Events persisted to append-only, immutable store
- [ ] Basic event search and browsing operational
- [ ] Event retention policy defined

### Level 2: Dashboards & Alerting

- [ ] Quality dashboard: pass rates, convergence speed, cost, human override patterns
- [ ] Governance dashboard: gate compliance, policy violation rates, provenance coverage
- [ ] Security dashboard: identity completeness, boundary violations, trust trajectories
- [ ] Threshold alerts configured and routed to on-call
- [ ] Trust level visualization operational

### Level 3: Correlation & Detection

- [ ] Quality correlation rules active (regression, convergence, override clustering, hallucination, resource exhaustion)
- [ ] Security correlation rules active (goal hijacking, tool misuse, lateral movement, trust manipulation, supply chain, cascading failure, data exfil)
- [ ] Governance correlation rules active (gate bypass, stale approvals, provenance gaps, missing telemetry, data governance violations)
- [ ] Behavioral baselines established per agent
- [ ] Anomaly detection against baselines configured

### Level 4: Automated Response

- [ ] Playbooks defined for all critical and high-severity patterns
- [ ] Response Bus operational (pre-authorized containment for critical threats)
- [ ] Automated trust ladder calibration active
- [ ] Sentinel fast path for sub-second anomaly response
- [ ] Forensic investigation package generation automated

### Integration

- [ ] OTel integration: events emitted as OTel spans/events where applicable
- [ ] SIEM integration: security alerts forwarded to organizational SIEM
- [ ] GRC integration: audit packages exportable to GRC platforms
- [ ] Alerting integration: connected to organizational incident management (PagerDuty, OpsGenie, etc.)

---

*This is the AGF Observability Profile — one of five domain profiles in the AGF reference architecture. For the complete framework, see [AGF: A Reference Architecture for Governed Agentic Systems](../docs/agf-reference-architecture.md). For incident response playbooks covering specific attack scenarios, see the [Security Profile](security-profile.md#incident-response-playbook-structure).*
