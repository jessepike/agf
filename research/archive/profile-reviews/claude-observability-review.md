# Deep review of the Agentic Observability concept document

**The Agentic Observability & Governance concept document articulates a genuine and defensible market gap — the unified quality-security-governance monitoring layer for agentic AI systems — but faces three urgent challenges: a narrowing competitive window (Microsoft Agent 365 announced March 9, 2026), significant gaps in its correlation rules versus the OWASP Agentic AI Top 10, and a structural mismatch between its event-oriented schema and the span-oriented OpenTelemetry model it claims compatibility with.** The SIEM analogy is approximately 70% sound and serves well as an anchor framing, but the document describes something more ambitious than a SIEM. Below is a dimension-by-dimension assessment with specific findings and recommendations.

---

## 1. The SIEM analogy holds but needs qualification

**Verdict: Partially holds — strong for the security/governance/compliance dimensions, weak for the quality/observability dimensions.**

The structural mapping from traditional SIEM to agentic observability is technically sound across six of eight dimensions. Multi-source data collection, schema normalization, centralized correlation, compliance reporting, investigation forensics, and tiered storage all map cleanly. The concept is novel — no competitor currently uses the "SIEM for agents" framing. Searches confirm the market uses "agentic SIEM" to mean the opposite: AI agents inside existing SIEMs to improve SOC operations, not SIEMs for monitoring AI agents.

The analogy breaks in four specific places. First, **event discreteness**: SIEM deals primarily with discrete events (login attempts, firewall blocks) with clear boundaries, but agentic systems produce both discrete events (tool calls, gate checks) and continuous signals (quality drift, reasoning degradation, latency trends). IBM frames agent observability around MELT data (Metrics, Events, Logs, Traces) — a broader telemetry model than SIEM's event-centric approach. Second, **detection methodology**: the document's example correlation rule ("agent bypassed mandatory gate 3 times") maps cleanly to SIEM-style pattern matching, but detecting quality degradation or hallucination spikes requires statistical and semantic evaluation (KL divergence, embedding drift, LLM-as-judge) that goes beyond SIEM correlation. Third, **response action granularity**: SIEM playbook actions are binary and well-defined (isolate endpoint, revoke credentials), while "degrade trust" is a graduated, continuous response without a clean SIEM parallel. Fourth, the **"AI governance lead" persona** the document targets is emerging but immature — there's no equivalent of the SOC analyst career ladder, standardized workflows, or 20 years of tooling.

The "SIEM is dead" discourse presents a reputational risk. Enterprise security practitioners widely consider legacy SIEM implementations inadequate — alert fatigue (4,484 alerts daily on average, **83% false positives**), cost overruns, and deployment failures are well-documented. Anyone who has suffered through a SIEM deployment will bring skepticism. The document should acknowledge these known failure modes and explain how the design avoids them.

**A composite framing would be stronger**: "Combining the real-time detection and response patterns of SIEM, the continuous observability of APM, and the audit rigor of a flight data recorder — purpose-built for agentic AI workflows." The term the market is gravitating toward is "agentic observability" (used by Datadog, Dynatrace, IBM, LogicMonitor, Microsoft), which the document should consider as primary terminology while preserving the SIEM analogy as an explanatory anchor.

---

## 2. Correlation rules have critical gaps against OWASP Agentic Top 10

**Verdict: The 18 rules are a useful threat taxonomy but miss 6 critical and 7 high-priority threat categories. They operate 2–3 abstraction levels above production detection rules.**

The most significant finding is that the OWASP Top 10 for Agentic Applications was released in December 2025, establishing the industry's definitive agentic threat framework — and the document's 18 rules have **zero coverage** of three of the top five risks. Agent Goal Hijacking (ASI01, the #1 risk) has no corresponding detection rule. Tool Misuse & Exploitation (ASI02, the #2 risk) is only partially addressed by the "unauthorized scope expansion" rule. Supply Chain Vulnerabilities (ASI04) are completely absent despite being the #3 risk on both the OWASP LLM and OWASP Agentic lists, with real-world incidents already documented (malicious MCP servers on npm, PhantomRaven slopsquatting of 126 packages). Cascading Failures (ASI08) and Human-Agent Trust Exploitation (ASI09) are also uncovered.

Against MITRE ATLAS (expanded to 15 tactics, 66 techniques, and 46 sub-techniques including 14 agentic-specific techniques added October 2025), the rules miss model extraction/theft, training data extraction, adversarial evasion, and ML supply chain compromise entirely. The existing security rules are **heavily biased toward internal governance architecture** (ring bypass, trust manipulation, evidence tampering) and underrepresent external adversarial threats.

The abstraction level is also a concern. Production SIEM correlation rules (Sigma, Splunk ES, Microsoft Sentinel) specify concrete log fields, event IDs, threshold counts, and time windows — for example, "alert if 5 failed logins from same IP within 15 minutes followed by successful login." The document's rules describe threat categories, not implementable detections. **Each conceptual rule likely decomposes into 3–10 production-level detection rules**, meaning the 18 categories would yield 60–150+ concrete rules in practice. This is not inherently wrong — MITRE ATT&CK tactics are also high-level — but the document should explicitly acknowledge it is presenting a threat taxonomy, not a detection rule set.

The quality rules need operationalization. "Quality degradation" requires specific metrics (F1 score drop thresholds, output distribution KL divergence), statistical methods (ADWIN, Population Stability Index), and time windows to be implementable. Missing quality rules include hallucination rate anomaly, output safety/toxicity monitoring, latency degradation, input data quality violations, and cost anomaly detection.

The governance rules have regulatory gaps. EU AI Act Article 10 requires data governance and quality monitoring (no corresponding rule). Article 13 requires transparency (no explainability violation detection). Article 73 requires serious incident reporting (no incident severity classification rule). NIST AI RMF MEASURE 2.5 requires bias monitoring (absent). These are not optional for high-risk AI systems after August 2026.

**Priority additions**: Supply chain integrity, agent goal hijacking, cascading failure detection, tool misuse/abuse, data exfiltration via agents, resource exhaustion/denial-of-wallet, bias and fairness monitoring, and sensitive information disclosure. Each should reference the corresponding OWASP ASI identifier and MITRE ATLAS technique ID, following the pattern Sigma rules use with ATT&CK tags.

---

## 3. Event architecture needs structural realignment with OpenTelemetry

**Verdict: The OTel compatibility claim is directionally correct but structurally misleading. The schema is event-oriented; OTel is span-oriented. This is the single largest technical gap.**

The document's claim that "OTel GenAI conventions (Development maturity, v1.40.0) already cover agent spans, tool calls, model identity" is factually accurate. The OTel GenAI semantic conventions at v1.40.0 do cover `create_agent`, `invoke_agent`, `execute_tool` operations with attributes for model name, agent ID/name/version, token usage, and MCP-specific conventions (new in v1.40.0). Custom attributes within the OTel data model using a namespace prefix like `agf.*` are a supported extensibility mechanism.

However, the event envelope schema defines a flat event structure (`event_id` + `timestamp` + attributes), while OTel is fundamentally **span-oriented** — operations with start time, end time, duration, and parent-child trace trees. This mismatch affects collection, correlation, storage, and querying. The document needs to explicitly classify which taxonomy events map to which OTel signals:

- **OTel Spans** (start/end operations): `agent_started/completed`, `tool_called/returned`, `verification_started/completed`, `gate_triggered/resolved`
- **OTel Span Events** (point-in-time within a span): `finding_produced`, `adversarial_critique`, `output_validated_schema`
- **OTel Log Records** (standalone occurrences): `trust_level_changed`, `sentinel_triggered`, `boundary_violation_detected`
- **OTel Metrics** (aggregations): token usage, policy evaluation counts, quality scores

The correlation context uses `case_id`, `run_id`, `session_id`, `parent_event_id` — but OTel uses `trace_id`, `span_id`, `parent_span_id`. The mapping (`run_id` → `trace_id`, `parent_event_id` → `parent_span_id`, `session_id` → `gen_ai.conversation.id`) should be made explicit, with `case_id` acknowledged as having no direct OTel equivalent (requires OTel Baggage or custom resource attribute).

**Missing high-priority fields** include `trace_id` and `span_id` (core OTel concepts), `duration_ms` (essential for performance monitoring), `token_usage` with input/output/cached breakdown (OTel already has `gen_ai.usage.*`), `cost` (no OTel standard yet but critical for governance), `error_type`/`error_details` (the schema has no error context at all), `data_classification`/`sensitivity_level` (regulatory requirement), `input_hash`/`output_hash` (integrity verification without storing content), and `schema_version` (backward compatibility).

**Missing event types** include agent delegation/handoff events (critical for multi-agent systems and the `delegation_chain` field the schema already defines), RAG/retrieval operations (OTel now has a `retrieval` operation type), guardrail evaluation events (OpenInference defines a dedicated GUARDRAIL span kind), MCP-specific tool interactions, streaming events, and cost/budget threshold events.

The document should also reference competing and complementary specifications: **OpenInference** (Arize/Phoenix, which defines GUARDRAIL and EVALUATOR span kinds directly relevant to the verification layer), **CloudEvents** (CNCF graduated specification for event transport), **W3C Trace Context** (required for distributed agent tracing), and **OTel GenAI Agentic Systems Proposal #2664** (active GitHub proposal covering Tasks, Actions, Agents, Teams, Artifacts, and Memory — a future alignment target).

---

## 4. Market position is under significant pressure from Q1 2026 announcements

**Verdict: Still differentiated but the window is narrowing fast. Three major developments since the document was drafted demand immediate acknowledgment.**

The most urgent competitive development is **Microsoft Agent 365**, announced March 9, 2026 (GA May 1, 2026). It is explicitly framed as "the control plane for agents" — a unified platform to "observe, govern, and secure" AI agents. Its three pillars (Observability, Security, Governance) are remarkably similar to the document's quality/security/governance framing. It includes an Agent Registry (catalogs all agents including third-party), Agent ID (Microsoft Entra identity with conditional access and audit trails), and integration with Microsoft Defender, Purview, and Sentinel. Tens of millions of agents appeared in the registry within two months of preview. Priced at $15/user/month standalone. This is the most direct competitive threat to the document's gap claim.

**AWS Bedrock AgentCore** reached significant maturity with AgentCore Policy going GA on March 3, 2026. It provides fine-grained, centralized controls for agent-tool interactions operating outside agent code, using Cedar policy language. AgentCore Evaluations (preview) offer continuous real-time quality monitoring with built-in evaluators for correctness, helpfulness, tool selection accuracy, safety, and goal success. It is framework-agnostic (CrewAI, LangGraph, LlamaIndex, Strands Agents). This is the most comprehensive cloud-native agent platform as of March 2026.

**Zenity**, named 2025 Gartner Cool Vendor in Agentic AI TRiSM, is the closest purpose-built startup competitor. Its tagline — "unified observability, governance, and threat protection for any agent on any platform" — directly mirrors the document's positioning. It is platform-agnostic, covering Microsoft 365 Copilot, Salesforce Agentforce, AWS Bedrock, and GitHub Copilot. It has Fortune 500 customers and Forrester recognition. However, it is security-focused (CISO buyer) with limited deep LLM quality observability.

**Where the gap still exists**: No single product genuinely covers all three domains (quality + security + governance) for arbitrary, platform-agnostic agent systems using a unified event correlation architecture. Cloud platforms (AWS, Azure, GCP) offer strong coverage but are platform-locked. ServiceNow and Salesforce are strong on governance/security but weak on LLM quality metrics and ecosystem-dependent. Datadog and Arize are strong on quality but lack governance. Zenity is strong on security/governance but weak on quality. Cross-cloud, cross-platform correlation — the SIEM analogy's core value proposition — does not yet exist.

The document must be **updated immediately** to acknowledge Microsoft Agent 365, AWS AgentCore Policy GA, and Zenity. The differentiation should sharpen around four axes: true platform-agnosticism (not Microsoft/AWS/GCP-native with an SDK), deep LLM quality observability (not just operational metrics), cross-system event correlation (the SIEM value), and open-standards-native architecture (OpenTelemetry, not proprietary telemetry).

Analyst data supports urgency: Gartner projects AI governance platform spending at **$492M in 2026, exceeding $1B by 2030**. Organizations with AI governance platforms are 3.4x more likely to achieve high governance effectiveness. But Gartner also predicts over 40% of agentic AI projects will be canceled by 2027 due to costs and governance failures — validating the problem the document addresses.

---

## 5. Maturity model is well-structured but needs calibration and completeness

**Verdict: Structurally sound, maps almost 1:1 to the HPE Security Operations Maturity Model. Timeline claims need tightening.**

The 5-level progression (Event Capture → Dashboards → Correlation → Automated Response → Predictive Governance) matches established security maturity models closely. HPE's SOMM uses nearly identical levels (Minimal → Basic → Documented/Repeatable → Measured/Managed → Optimized/Adaptive). The SOC-CMM, Gartner SOC maturity model, and Splunk SOAR Adoption Maturity Model all validate this trajectory.

**"Months to reach Level 3"** is ambiguous and leans optimistic. SIEM deployment data shows self-managed SIEM deployments take 6–12 months, with a subsequent 30–60 day tuning period before detection rules are reliable. Cross-industry average security maturity is **2.75 out of 5** — most organizations hover at Level 2–3 even after years of investment. SOCs with fewer than 7 FTE staff rarely progress beyond Level 2. The document should specify **"6–12 months for Level 3 under favorable conditions; 12–18 months typical."**

Agentic observability has both accelerants and decelerants versus SIEM. Levels 1–2 could be significantly faster (days-to-weeks versus weeks-to-months) because AI agents can emit structured telemetry by design and modern cloud-native tooling makes dashboards deployable quickly. But Level 3 will likely match SIEM timelines (6–12 months) because behavioral baselines for AI agents are a nascent discipline with no equivalent of established SIEM correlation rule libraries. Levels 4–5 may be **slower** for early adopters because the playbook for "safe automated response to agent anomalies" doesn't exist yet. Splunk's data shows that Level 4 automated response is achieved by the **top 5% of SOCs**. Level 5 should be described as aspirational, likely 3–5+ years, and unattainable for smaller organizations.

**Four structural gaps** in the maturity model need addressing. First, it is purely technology-focused and lacks people/process dimensions — every established maturity model (SOC-CMM, SOMM, NIST CSF) measures maturity across people, process, and technology. Second, it lacks explicit metrics at each level (MTTD/MTTR equivalents, false positive rates, coverage percentages). Third, it should include a Level 0 (no structured observability) to help organizations self-identify. Fourth, it should document **known blockers** at each level — particularly alert fatigue at Level 3, which is the dominant SIEM challenge (organizations without ongoing tuning see a 40% increase in false positives within 6 months).

---

## 6. Open questions assessment and missing critical questions

The two resolved questions are reasonable. The OTel-compatible base + governance extensions direction is correct, though the implementation requires the spans-vs-events mapping work described above. The privacy resolution (log governance events with redacted content) is sensible and aligns with industry practice.

The remaining open questions are legitimate, but **five critical questions are missing**:

- **How does the architecture handle multi-cloud/multi-platform event ingestion?** This is the core competitive differentiator versus platform-locked solutions (AWS, Azure, GCP). Without a concrete answer, the platform-agnostic claim is aspirational.
- **How does the framework align with OWASP Agentic AI Top 10?** This December 2025 release is now the industry benchmark with 100+ contributors and endorsement from AWS, Microsoft, and NVIDIA. The correlation rules should map directly to ASI01–ASI10.
- **How does the system mitigate alert fatigue?** SIEM's dominant failure mode. If the document invokes the SIEM analogy, it inherits this challenge and must address it explicitly.
- **What is the competitive response to Microsoft Agent 365?** The most direct competitive threat. The document needs a clear differentiation strategy.
- **What talent/skills are required to operate the platform?** The SOC-CMM 2025 report found the intersection of "understands AI agent behavior" and "understands operational monitoring" is an extremely thin talent pool. This affects adoption timelines at every maturity level.

---

## Top 5 issues prioritized for publication readiness

1. **Missing OWASP Agentic and ATLAS alignment (Critical):** The correlation rules miss 3 of the top 5 agentic AI risks, including the #1 risk (Agent Goal Hijacking). No supply chain rules exist despite documented real-world attacks. This is the most significant credibility gap for security-literate readers. The rules should be explicitly tagged with OWASP ASI and MITRE ATLAS identifiers.

2. **Microsoft Agent 365 and Q1 2026 market shifts unaddressed (Critical):** The market positioning section is stale as of the March 9, 2026 announcement. Microsoft's "observe, govern, secure" framing directly mirrors the document's thesis. Zenity's platform-agnostic agent governance is a proven startup competitor. The document must acknowledge these and sharpen its differentiation.

3. **OTel data model mismatch (High):** The event-oriented schema conflicts with OTel's span-oriented model. Without resolving this (explicitly mapping events to spans, span events, log records, and metrics), the "OTel-compatible" claim will not survive technical scrutiny from observability engineers.

4. **Quality detection needs operationalization (High):** Quality rules like "quality degradation" are too vague for implementation. They need specific metrics, statistical methods, threshold definitions, and time windows. Missing entirely: hallucination detection, output safety/toxicity, cost anomalies, and data quality monitoring (required by EU AI Act Article 10).

5. **Maturity model lacks people/process dimensions and blocker documentation (Medium):** The technology-only focus and ambiguous timelines weaken credibility with enterprise buyers. Every established SOC maturity model measures people, process, and technology. Alert fatigue at Level 3 — SIEM's dominant failure mode — must be acknowledged with a mitigation strategy.

---

## Overall verdict: Needs targeted iteration, not fundamental rework

The core thesis is sound and the market gap remains defensible as of March 2026 — no single product covers quality, security, and governance observability for arbitrary, platform-agnostic agentic systems with cross-system event correlation. The SIEM framing is useful as an explanatory anchor and the architectural pattern translates well. The maturity model maps closely to validated security operations maturity frameworks. The document demonstrates genuine architectural thinking and identifies a real problem.

However, **the competitive window is closing measurably**. Microsoft Agent 365 (GA May 1, 2026), AWS AgentCore Policy (GA March 3, 2026), and Zenity collectively cover much of the described capability space within their respective ecosystems. The document needs targeted updates: align correlation rules with OWASP Agentic and MITRE ATLAS, resolve the OTel data model mismatch, update market positioning for Q1 2026 developments, operationalize quality detection rules, and add people/process dimensions to the maturity model. With these updates — estimated 1–2 weeks of focused work — the document would be publication-ready as a credible, differentiated architecture for a market Gartner values at nearly $500M in 2026 spending.