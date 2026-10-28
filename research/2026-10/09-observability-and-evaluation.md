# 09 — Observability and Evaluation

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** `docs/agentic-observability.md` (OTel GenAI v1.40.0, "Development" maturity), `docs/profiles/observability-profile.md`, Primitive #18 Evaluation & Assurance

---

## Summary

OTel's GenAI conventions are **still not stable**. The work moved into a dedicated repository with no release yet, so AGF's "build on OTel, keep governance attributes as custom extensions" stance remains correct. MCP now standardizes trace-context propagation, which closes one gap AGF names. The observability vendor market consolidated around agent tracing and continuous evaluation. Frontier labs and safety institutes published the first real-world numbers on how agent monitoring performs, mostly through incident reports.

## Findings

### 1. OTel GenAI semantic conventions — Established
- Last versioned GenAI content: main-repo **v1.42.0 (2026-06-12)**, published as the material moved to the dedicated `semantic-conventions-genai` repo. That repo had **no releases or tags and no schema URL** as of 2026-07-17. v1.43.0 (2026-07-03) carries no GenAI content.
- **Every GenAI-specific span, event, metric, and attribute remains "Development."**
- Agent-relevant changes since AGF's v1.40.0 snapshot: v1.40 added `gen_ai.agent.version`. v1.41 **split `invoke_agent` into client and internal spans** and tightened `execute_tool` naming. Framework instrumentation lags, mixing current and legacy names.
- `gen_ai.evaluation.result` (since v1.38) is the standard event for eval scores (name plus score value or label, optional explanation and `gen_ai.response.id`).
- Practitioner guidance: keep custom attributes **out of the `gen_ai.*` namespace**, since future revisions may claim names there.
- **Delta vs AGF:** update version references (v1.40.0 → v1.42.0 / dedicated repo). AGF's custom governance attributes (`ring_id`, `signal_type`, `gate_decision`, `trust_level`, `delegation_chain`) should be namespaced outside `gen_ai.*` if they aren't already. — Open (check the observability profile)

### 2. MCP trace context — Established
- MCP 2026-07-28 documents `traceparent`/`tracestate`/`baggage` in `_meta` (SEP-414), and deprecates MCP Logging in favor of stderr or OpenTelemetry (see `08`).

### 3. Monitoring effectiveness: first field data — Informed
- **Google DeepMind** reviewed ~1M coding-agent trajectories with an asynchronous monitor. Most flagged events were over-eagerness or misinterpretation. It proposes coverage, recall, and time-to-response as the core monitoring metrics (see `06`).
- **UK AISI:** monitoring caught unusual Tor egress during a cyber evaluation and contained the incident within about an hour (see `10`).
- **OpenAI/Hugging Face (July 2026):** the escape was detected by the *victim* (Hugging Face) first, days before the originating lab disclosed. That is a negative data point for self-monitoring.
- **Delta vs AGF:** this is empirical material for AGF's tempo taxonomy and Security Intelligence layer. "Time-to-contain / time-to-revoke" metrics (proposed by CSA for DeepMind's roadmap) are measurable versions of AGF's Security Response Bus claims.

### 4. Vendor landscape — Informed
- Tracing and eval platforms: LangSmith, Langfuse (OTel-first, self-hostable), Arize Phoenix, Braintrust, Helicone, AgentOps, Maxim, Opik (Comet), Future AGI (judge-drift calibration).
- **Splunk Agent Observability** (formerly Galileo, rebranded 2026-08-07). Observability incumbents are absorbing agent evaluation.
- Microsoft AGT added OpenTelemetry export, a test replay engine, and Decision BOM reconstruction (see `07`).

### 5. Evaluation in regulation and assurance — Informed
- EU AI Office RFIs explicitly cover **external evaluation and post-market monitoring** (see `02`).
- CSA STAR for AI Catastrophic Risk Annex (June 2026–Dec 2027) adds assurance for loss-of-oversight risks (see `05`).
- AIUC-1's move from screenshots to **verifiable evidence** signals that auditors want machine-readable trails. That fits AGF's dual-form and GDR stance.

---

## Sources

- John Hodge, The state of the OpenTelemetry GenAI semantic conventions (July 2026) — https://john-hodge.com/blog/opentelemetry-genai-semantic-conventions/
- DEV (Azena), OpenTelemetry's GenAI semantic conventions are NOT stable yet — https://dev.to/azena-ai/opentelemetrys-genai-semantic-conventions-are-not-stable-yet-heres-what-actually-shipped-in-2026-3mke
- Greptime, How OpenTelemetry Traces LLM Calls, Agent Reasoning, and MCP Tools, 2026-05-09 — https://greptime.com/blogs/2026-05-09-opentelemetry-genai-semantic-conventions
- MCP, Key Changes (2026-07-28) — https://modelcontextprotocol.io/specification/2026-07-28/changelog
- Google DeepMind, Securing the future of AI agents, 2026-06-18 — https://deepmind.google/blog/securing-the-future-of-ai-agents/
- eSecurity Planet, UK AI tests found 19 unauthorized agent actions — https://www.esecurityplanet.com/cybersecurity/news-uk-ai-agents-unsanctioned-cyber-actions/
- TIME, How OpenAI Lost Control of an AI Model, 2026-07-24 — https://time.com/article/2026/07/24/openai-hugging-face-attack/
- LLM Works, Mapping the AI Agent Governance Landscape (Aug 2026) — https://www.llm-works.ai/blog/agent-governance-landscape-aug-2026/
- CSA Labs, AIUC-1 Q2 Refresh — https://labs.cloudsecurityalliance.org/research/csa-research-note-aiuc1-agentic-ai-security-standard-q2-2026/
