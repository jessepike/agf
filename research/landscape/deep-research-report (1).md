# Governance, Security, and Observability for AI Agents and Agentic Systems in March 2026

[Download the governance scorecard template (Markdown)](sandbox:/mnt/data/agentic_governance_scorecard_template_2026-03-17.md)

## Scope and definitions

This research focuses on how major vendors and platforms are **implementing (not merely describing)** governance, security, and observability for *agentic systems*—systems that can **plan and execute multi-step work**, typically via tool calls (APIs), retrieval, and external actions, sometimes with memory, handoffs, and long-running sessions. The key shift vs. classic LLM apps is that “bad output” becomes “bad action,” and therefore **authorization, traceability, and containment** become first-class controls. citeturn11search10turn9search0turn28view0

**Agentic governance vs. LLM governance (working definition used here).**  
LLM governance covers policies, content filtering, data handling, and model risk evaluation. Agentic governance adds: a governed tool surface (approved tools only), action authorization (who can do what, when), human approval gates for high-impact steps, durable audit trails across multi-step workflows, and runtime containment (kill switch / quarantine) for compromised agents. This lines up with the industry’s evolving posture: prompt injection and unsafe tool use are treated as top-tier security risks, and standards bodies are now treating “agent security” as its own problem space. citeturn9search0turn24search2

**Threat model emphasized in this report.**  
Across vendors, the most repeatedly addressed adversarial threats include:
- **Prompt injection** (direct and indirect), which can hijack tool-using agents. citeturn9search0turn5search2turn19view0  
- **Insecure output handling / tool misuse** (agent outputs causing unsafe downstream actions). citeturn9search0turn1search3turn8search0  
- **Supply-chain and “tool supply-chain” risks** (compromised connectors, MCP servers, dependencies). citeturn9search0turn17search0turn28view0  
- **Denial-of-wallet / model DoS** (cost blowups driven by unbounded agent loops or adversarial prompts). citeturn9search0turn7search0

## Model providers

### entity["company","Anthropic","ai model provider"]

**Governance capabilities.** Anthropic positions model governance around a formal **Usage Policy** and an internal “Safeguards” function that designs policy, detection, and enforcement mechanisms (including monitoring and enforcement actions). Their public writing explicitly frames usage policy as the “framework that defines how Claude should and shouldn’t be used,” and ties this to operational domains like child safety, elections, and cybersecurity. citeturn0search0turn20search10turn20search14  
Anthropic also publishes “constitution” style guidance as a canonical articulation of intended model behavior (a governance input to training and evaluation rather than an enterprise control plane). citeturn0search12

**Agent identity and authorization.** On the enterprise side, Anthropic provides **roles and permissions** for Team/Enterprise plans and an **Admin API** designed for provisioning and managing organization members, workspaces, invites, and API keys. This is conventional SaaS “tenant governance,” not agent-run authorization, but it’s a key prerequisite for enterprise controls such as onboarding/offboarding and least-privilege administrative operations. citeturn20search3turn20search11

**Observability and audit trails.** Anthropic provides a programmatic **Usage & Cost Admin API** for historical usage/cost monitoring. This is good for cost attribution and high-level monitoring, but it is distinct from immutable, queryable per-run agent audit records that many regulated environments require. citeturn20search0

**Adversarial threats.** Anthropic’s agent/security posture is notable for explicitly treating **agentic use** as an escalated risk class, calling out threats like scaled abuse and cyberattack enablement. citeturn0search4  
In technical guidance, Anthropic recommends layered defenses against jailbreaks and prompt injection: pre-screening with lightweight “harmlessness screens,” input validation, prompt engineering, abuse throttling/bans, and continuous monitoring for jailbreak signatures. citeturn19view0  
They also disclose that tool-use prompt injection evaluation is part of their evaluation suite in system cards (evidence that tool-use threats are tested directly, not treated as a purely downstream app problem). citeturn8search6

**What’s missing and maturity assessment.** Anthropic is strong on *provider-side* trust & safety (policy definition, evaluation, enforcement, transparency reporting), but offers comparatively less “agent-fleet governance” out of the box (cross-agent inventory, action authorization, and enterprise-grade audit evidence at the agent-run level tend to be left to the platform layer). **Maturity: high LLM governance; moderate agentic governance primitives** (mostly guidance + tenant admin controls rather than an end-to-end agent control plane). citeturn0search0turn20search11turn19view0

### entity["company","OpenAI","ai model provider"]

**Governance capabilities.** OpenAI’s practical “agent governance” story in 2025–2026 is increasingly **SDK- and platform-driven**, not just policy-driven. The Agents SDK explicitly ships “guardrails” as a first-class feature: **tool guardrails** can validate or block tool calls pre/post execution and run every time a tool is invoked. citeturn8search0  
The SDK also supports **tool enable/disable controls** (including runtime conditional enabling) explicitly framed as a mechanism for feature gating by user permissions and environment constraints—i.e., governance of the tool surface. citeturn8search16  
OpenAI also publishes enterprise-facing guidance on “governed AI agents” and “agentic scaffolding” (policy + process + technical guardrails) aimed at production deployments. citeturn0search5turn17search11

**Agent identity and authorization.**
- At the platform level, OpenAI provides **RBAC** for organizations/projects (“decide who can do what… through the API and in the Dashboard”). citeturn17search6  
- For **ChatGPT apps / tool integrations**, OpenAI’s Apps SDK guidance emphasizes **per-tool auth policies** via `securitySchemes` and encourages explicit OAuth configuration discovery (`.well-known/oauth-protected-resource`)—a concrete governance mechanism for “actions” and tool invocation authorization. citeturn17search0  
- For agent runs, the Agents SDK’s context mechanism explicitly supports carrying **user identifiers** and run metadata in a local context object, and exposes approval state controls (approve/reject tool calls) as runtime governance hooks. citeturn18view0  
- For ChatGPT Enterprise connectors/actions, OpenAI release notes state that admins govern access using **RBAC**, and admins can review Actions and connector information in workspace settings. citeturn8search21

**Observability and audit trails.**
- The Agents SDK includes **built-in tracing** capturing agent-run events (LLM generations, tool calls, handoffs, guardrails, and custom events), usable for debugging and monitoring. citeturn8search4  
- Separately, OpenAI offers an **Audit Logs API** described as an immutable, auditable log of organization events (e.g., API key lifecycle, invitations), which supports security/compliance governance at the org/control plane level. citeturn0search1turn0search9  
- OpenAI also references a “Compliance API” for exporting detailed activity logs for audit workflows (marketed as governance support). citeturn0search16

**Adversarial threats.** OpenAI’s **Preparedness Framework** (v2) explicitly includes cybersecurity risk classes (dual-use enablement concerns) and is used to gate model deployment decisions—provider-side risk governance that matters directly for agentic capabilities. citeturn11search1turn11search4  
OpenAI also published an explicit threat model for “ChatGPT agent” deployments, distinguishing agentic tasks from non-agentic tasks (useful for defining what actions require stricter governance). citeturn11search10  
At the tool layer, SDK guardrails and tool gating function as direct mitigations for tool misuse, but the strongest defense against indirect prompt injection still depends on the developer enforcing trust boundaries around retrieved content and tool outputs (the SDK provides hooks, not a complete policy engine). citeturn8search0turn18view0

**What’s missing and maturity assessment.** OpenAI’s shipping pieces—RBAC, audit logs, tracing, tool guardrails, and OAuth-based tool authorization—are a credible “agent governance kit.” The main gap is that **fleet governance** (inventory, risk classification, continuous policy compliance across many deployed agents) is only partially solved inside OpenAI’s surfaces; enterprises typically still need an external control plane and SIEM-grade log pipelines to unify evidence across apps, tools, and clouds. **Maturity: high agent-run primitives; medium fleet governance** (strong “inside the SDK/platform,” weaker “across the enterprise”). citeturn17search6turn8search4turn0search1turn8search21

### entity["company","Google","ai model provider"]

**Governance capabilities.** Google’s approach splits across (a) Gemini API safety controls and (b) Google Cloud’s agent platform governance.
- For Gemini API usage, Google provides configurable **safety settings** across harm categories, explicitly described as adjustable filtering for an application. citeturn11search2turn11search5  
- On Google Cloud, Vertex AI Agent Builder is positioned as an enterprise platform to “build, scale, and govern… agents,” and Agent Engine is positioned as handling production infrastructure including “security and monitoring.” citeturn8search7turn29search4  
- A concrete, agent-specific governance mechanism shipped in late 2025 is **tool governance via Cloud API Registry**: Google describes this as a private registry where administrators can curate and govern approved tools for developers, including managed tools and MCP-based tools. citeturn0search2turn29search1

**Agent identity and authorization.** Google Cloud’s agent stack is tightly coupled to **Cloud IAM** and service accounts:
- Vertex AI Agent Engine requires specific project roles (e.g., “Vertex AI User”), reinforcing IAM as the baseline control plane for access. citeturn29search7  
- Deployed agents use a **Reasoning Engine Service Agent** service account with a defined role providing default permissions required for deployed agents—this is effectively the “agent identity” used to access resources in production. citeturn29search3  
- For Vertex AI Search / Agent Builder components, Google provides IAM roles and permissions and frames IAM as the mechanism to prevent unwanted access to resources. citeturn29search2turn29search0

**Observability and audit trails.**
- Google Cloud services generate **Cloud Audit Logs**; Google provides audited method lists for Vertex AI Agent Builder components (evidence that admin/access events are covered by standard cloud audit logging). citeturn8search3  
- Agent Engine management includes explicit logging guidance (view agent logs in the console; agent dashboard visibility). citeturn8search11  
- For tool-using “computer use” scenarios on Vertex AI, Google explicitly recommends allowlists/blocklists and **detailed logging**—including prompts, screenshots, model-suggested actions (function calls), safety responses, and actions executed by the client—framing this as necessary for debugging, auditing, and incident response. citeturn11search14

**Adversarial threats.** In practice, Google’s agent governance guidance heavily emphasizes **tool surface restriction** (allowlists) and robust logging for incident response, which directly targets prompt injection and tool misuse threats, especially for browsing/desktop-control agents. citeturn11search14turn0search2

**What’s missing and maturity assessment.** Google Cloud’s strengths are that it reuses mature cloud primitives (IAM + audit logs) and is moving toward centralized tool approval (Cloud API Registry). The remaining gap is that “agent governance” still often looks like **a set of platform capabilities** rather than a unified “control tower” experience that inventories agents, tools, policies, approvals, and risk classification across business apps. **Maturity: strong enterprise primitives; uneven end-to-end agent governance UX** (particularly across multi-vendor agent fleets). citeturn29search3turn0search2turn8search3turn11search14

### entity["company","Meta","open models provider"]

**Governance capabilities.** Meta’s “agent governance” is primarily delivered as **guidance + safety components** for an open-model ecosystem, rather than a managed enterprise control plane:
- Meta Llama 3 has an explicit **Acceptable Use Policy** (AUP) enumerating prohibited uses and placing responsibility on deployers to enforce safe use. citeturn0search3  
- Meta’s Llama ecosystem emphasizes system-level safety layers, such as **Llama Guard** models for safety classification and other “protections” intended to be orchestrated around the base model. Llama Guard 3’s model card explicitly frames it as usable for both input/prompt classification and response classification. citeturn23search20turn23search2  
- Meta also describes a broader “protections” portfolio (e.g., a “LlamaFirewall” concept as a guardrail tool orchestrating guard models), which is closer to an agentic runtime gating approach than a pure policy document. citeturn23search5

**Agent identity and authorization.** In the open-model context, identity and authorization are **not provided by the model vendor**; Meta’s posture pushes these responsibilities to the hosting platform and enterprise IAM layer. The AUP is a governance input, but it’s not an authorization mechanism. citeturn0search3

**Observability and audit trails.** Meta does not ship a native enterprise logging/audit plane for Llama deployments because the deployment surface is heterogeneous (self-hosting, clouds, partners). Governance therefore depends on the platform layer (cloud logs, application traces, SIEM pipelines), plus whatever telemetry wrappers a deployer builds. This is a structural feature of open models rather than a product omission. citeturn0search3turn23search12

**Adversarial threats.** Meta discloses its evaluation posture in model documentation, including cybersecurity safety evaluation (e.g., referencing CyberSecEval and MITRE ATT&CK-aligned definitions for cyberattack requests). This demonstrates that adversarial risk is measured on the model side, but runtime protection is expected to be layered on by deployers using guard models and system design. citeturn23search8turn23search20turn23search5

**What’s missing and maturity assessment.** Meta’s approach is *strong for open safety building blocks*, but it is not “agent governance as a service.” If you’re an enterprise, you don’t get identity, approvals, fleet inventory, or audit logs from Meta; you must assemble those from cloud/IAM/observability/tooling vendors. **Maturity: strong safety components for LLM governance; low-to-medium agentic governance as an integrated product** (by design, given open deployment models). citeturn0search3turn23search20turn23search5

## Enterprise platforms

### entity["company","ServiceNow","enterprise workflow platform"]

**Governance capabilities.** ServiceNow is one of the clearest examples of an enterprise vendor pushing toward a centralized **AI governance control plane**. Its AI Control Tower is described as a centralized workspace/workspace package that includes AI discovery and inventory, AI asset lifecycle management, AI risk and compliance management, and AI case management (i.e., governance workflows, not just runtime filters). citeturn10search10turn1search21turn0search10  
Importantly, ServiceNow’s documentation shows that the inventory model is not limited to “models”; it includes **AI systems, prompts, datasets, and MCP servers**, plus lifecycle fields and risk classification. That is closer to agentic governance than many competitors’ “LLM governance” offerings. citeturn28view0

**Agent identity and authorization.** ServiceNow’s agent security guidance explicitly frames security controls for agents and agentic workflows as implemented through **ACLs and user identities**, aligning agent operations to the platform’s established identity model. citeturn10search9

**Observability and audit trails.** AI Control Tower is designed to “manage and monitor AI,” and the asset inventory model includes fields to support governance (managed by, lifecycle phase, state, risk classification). This is foundational for audit evidence, though the quality of per-run execution evidence depends on integrations and how deeply tool execution is instrumented in runtime systems. citeturn28view0turn1search21turn12search6

**Adversarial threats.** ServiceNow’s primary “platform-native” posture is governance workflows and access-model alignment; dedicated adversarial runtime defenses (prompt injection, tool misuse) often require specialized controls at the agent runtime/connector layer (either ServiceNow features or security partner ecosystems). This mirrors the broader market split between “governance workflow suites” and “runtime AI firewalls.” citeturn10search9turn12search6turn9search0

**What’s missing and maturity assessment.** ServiceNow is relatively mature at **fleet-level governance** (inventory + lifecycle + risk + approvals). The main missing piece is an industry-standard, portable execution trace schema (so audit evidence is interoperable across all external agent runtimes) and stronger runtime containment primitives across non-ServiceNow agents. **Maturity: high agent-fleet governance; medium runtime enforcement** (depending on integrations). citeturn28view0turn12search6turn9search0

### entity["company","Salesforce","enterprise crm platform"]

**Governance capabilities.** Salesforce frames Agentforce governance as a combination of:
- A “trust layer” mindset (governance, safety, and compliance “across the stack,” auditable and aligned to enterprise standards). citeturn1search1turn10search15  
- An explicit **determinism spectrum** concept: Salesforce argues that agent success requires balancing autonomy/creativity with enterprise constraints and reliable business outcomes (this is governance language aimed at defining when an agent must behave deterministically vs. generatively). citeturn1search18turn1search1  
- Native data governance for the “agentic landscape” in Data Cloud: policy-based governance and AI tagging/classification, plus dynamic data masking, positioned as controls that apply across Agentforce and related surfaces. citeturn25view0

**Agent identity and authorization.** Salesforce’s Data Cloud governance guidance explicitly calls out **ABAC** as a mechanism to ensure a user (humans or agents) only views data they’re entitled to, and frames policy-based governance as applying across the places data is used (including agent experiences). citeturn25view0  
Salesforce also emphasizes that its agent security approach includes policy-driven controls and sensitive data protection (masking) before the prompt is sent outward. citeturn10search15

**Observability and audit trails.** Salesforce’s public messaging stresses agents being auditable; however, the depth of “agent run traces” (model calls, tool calls, handoffs) is more variable depending on whether the agent runs entirely within Salesforce’s runtime vs. federates to external models/tools. Data governance and classification capabilities help provide evidence about data access and masking, which becomes part of the audit story in regulated contexts. citeturn25view0turn10search15

**Adversarial threats.** Salesforce highlights prompt masking, policy-driven controls, and “zero data retention” language in the context of reducing leakage risk when interacting with external LLMs—this addresses a major attack surface: inadvertent disclosure of PII/IP through prompts. citeturn10search15turn25view0  
That said, prompt injection and tool misuse defenses still depend on whether tools/actions are tightly governed and whether untrusted retrieval is clearly separated from instructions—an area where enterprises often need explicit “untrusted content” handling patterns beyond masking alone. citeturn9search0turn25view0

**What’s missing and maturity assessment.** Salesforce is strong on **data-governance-centric agent controls** (ABAC, masking, classification, determinism framing). The main gap is a universally exposed, exportable execution trace/audit stream that security teams can treat like CloudTrail-scale evidence across all agent actions, especially when tools span non-Salesforce systems. **Maturity: high data governance for agents; medium cross-system “action governance.”** citeturn25view0turn10search15turn9search0

### entity["company","Microsoft","enterprise software provider"]

**Governance capabilities.** Microsoft’s 2025–2026 posture is moving toward an explicit **agent control plane** model:
- Microsoft describes **Agent 365** as “the control plane for AI agents,” and the Microsoft 365 admin center supports enabling/disabling, assigning, blocking, and removing agents, plus a submission/approval workflow before agents become available to users. It also explicitly mentions lifecycle controls, the ability to view shared agents and block unsafe/noncompliant agents, and differentiates agent types (internal, external partner, frontier/experimental). citeturn26view0turn1search19turn1search5  
- Microsoft’s Copilot Control System explicitly includes a “security and governance” pillar plus measurement/reporting components, indicating that governance is not just policies but operational telemetry and admin controls. citeturn1search5turn1search9  
- Microsoft Purview positions “DSPM for AI” as an umbrella for discovering AI usage, applying compliance controls, and using existing information protection/compliance mechanisms as AI accelerators. citeturn27view0

**Agent identity and authorization.** Microsoft’s governance model fundamentally leans on its identity ecosystem:
- Purview notes that “enterprise AI apps… connected… through Entra registration” are in scope, and that (for Agent 365 in preview) “agent instances are identified and managed like other users,” which is a direct statement about agent identity being mapped into the enterprise identity model rather than treated as an opaque runtime process. citeturn27view0  
- The Microsoft 365 admin center page also emphasizes using least-privilege admin roles (AI Admin vs. Global Admin) for governing agents. citeturn26view0

**Observability and audit trails.** Microsoft’s strongest differentiation is that it binds AI governance to its compliance/audit infrastructure:
- Purview states that prompts and responses are **captured in the unified audit log**, and that these events can include references to files accessed during the interaction (plus label metadata). This is unusually explicit and directly useful for audit evidence. citeturn27view0  
- Purview also describes DLP controls for blocking/warning on sensitive data being pasted into third-party GenAI sites, and a “risky AI usage” policy template that includes prompt injection attacks. That ties governance, data loss prevention, and threat detection together. citeturn27view0  
- Agent 365 is described as delivering unified observability via telemetry/dashboards/alerts and helping eliminate blind spots across the agent fleet. citeturn1search19turn26view0

**Adversarial threats.** Microsoft explicitly frames prompt injection detection and risky AI usage as monitorable policy events inside Purview/Insider Risk (depending on configuration). This is an example of “posture management + detection” rather than only prompt filtering. citeturn27view0

**What’s missing and maturity assessment.** Microsoft is among the most mature vendors on **enterprise-grade auditability** (unified audit log + DLP + compliance workflows) plus an emerging agent control plane (Agent 365). The remaining gap is portability: evidence and policy controls are strongest inside the Microsoft ecosystem; heterogeneous agent fleets still need cross-vendor telemetry normalization and standardized “action semantics.” **Maturity: high fleet governance and audit; medium interoperability across ecosystems.** citeturn26view0turn27view0turn1search19

### entity["company","Amazon Web Services","cloud provider"]

**Governance capabilities.** AWS implements agent governance primarily as **cloud-native primitives + Bedrock-specific controls**:
- Amazon Bedrock Guardrails are positioned as configurable safeguards with “safety and privacy controls” to filter undesirable content and protect sensitive information, with a consistent experience across foundation models. citeturn1search3turn1search6  
- AWS also introduced IAM-policy-based enforcement for Guardrails (so guardrail application can be enforced via IAM), signaling movement from “optional app-level filtering” to “enforceable control.” citeturn1search8  
- Bedrock agents are governed via explicit action-group definition (OpenAPI schemas) and versioning/aliases, which provides a governance handle for “what actions can this agent take” and “which version is in production.” citeturn16search1turn16search11turn16search0

**Agent identity and authorization.**
- Bedrock Agents use IAM: AWS provides guidance for creating a **service role** for agents and ties agent capabilities to that role’s permissions. citeturn16search4turn1search20  
- AWS documentation is explicit that interacting with agent/knowledge base resources requires an IAM identity with the appropriate permissions. citeturn10search8  
- AWS’s service authorization reference enumerates actions/resources/condition keys for Bedrock, which is the foundation for least-privilege enforcement. citeturn10search5

**Observability and audit trails.**
- Amazon Bedrock integrates with **CloudTrail** for API call logging (actions taken by a user/role/service), and AWS explicitly documents monitoring Bedrock calls using CloudTrail. citeturn1search10turn16search2  
- Importantly, AWS notes that to monitor certain high-volume “data events,” you may need to enable them explicitly (a common governance foot-gun: you don’t get full evidence unless you turn the right knobs). citeturn16search15turn16search2  
- AWS also positions CloudWatch metrics/alarms as the baseline monitoring substrate for Bedrock application health/performance. citeturn10search20  
- Bedrock sessions APIs provide a structured way to store/retrieve conversation history and state, with APIs such as ListInvocations/GetInvocationStep supporting retrieval of interaction checkpoints (useful for auditability and replay/forensics). citeturn16search7turn16search10

**Adversarial threats.** Guardrails are AWS’s primary “runtime safety” answer; the IAM enforcement capability indicates recognition that “guardrails must be enforceable,” not simply suggested. citeturn1search8turn1search3  
However, defending against indirect prompt injection and tool misuse still depends on action group design, schema validation, and least privilege on the agent role—governance that must be engineered, not just configured. citeturn16search1turn16search4turn9search0

**What’s missing and maturity assessment.** AWS is strong on **authorization and audit** (IAM + CloudTrail) and is shipping enforceable runtime guardrails. The biggest gap is a unified “agent governance UX” across heterogeneous agent frameworks (many customers build agents outside Bedrock) and higher-level “policy workflows” (approvals, risk classification) that are more commonly found in enterprise governance suites than in cloud primitives. **Maturity: high foundational controls; medium governance workflows.** citeturn1search8turn1search10turn16search7turn9search0

## Agent frameworks

Agent frameworks reliably provide **agent runtime primitives** (orchestration, state, HITL checkpoints), but most do **not** provide enterprise identity, centralized policy management, or compliance-grade audit storage by default. In other words: frameworks are where governance hooks are implemented, but they are rarely where governance is *owned*. citeturn2search0turn2search3turn9search0

**LangGraph (governance primitives).** The LangGraph documentation explicitly treats “persistence” and checkpointers as enabling **human-in-the-loop workflows** by allowing humans to inspect/interrupt/approve steps and resume execution later. It also supports “time travel” via checkpoints (replay/fork) to resume from prior state without re-executing earlier steps, which is valuable for audit/debug and controlled remediation after a failed step. citeturn2search0turn2search4turn2search16  
**Gaps:** identity/authorization and durable compliance evidence still depend on external systems (IAM, DLP, SIEM, trace stores); HITL is a governance mechanism, but “who is allowed to approve” is typically not enforced by the framework alone. citeturn2search0turn9search0

**CrewAI (governance primitives).** CrewAI’s documentation markets “guardrails, memory, knowledge, and observability baked in,” and it provides explicit **task guardrails** for validating/transforming outputs before passing them onward. For enterprise, it also describes a “hallucination guardrail” that validates task outputs against reference context to detect likely hallucinated content. citeturn2search1turn2search5turn2search17  
**Gaps:** as with most frameworks, role-based delegation inside the agent system is not the same as enterprise authorization; the framework can express roles, but it typically doesn’t integrate with enterprise ABAC/RBAC or provide immutable audit retention on its own. citeturn2search5turn9search0

**AutoGen (governance primitives).** AutoGen’s group chat architecture centers on a group chat manager that routes messages; it also supports tool use and human participation through multi-agent conversation. This is useful for multi-agent control and “governance by orchestration,” but policy enforcement (tool allowlists, approvals, and evidence exports) must be layered on. citeturn2search2turn2search10  
**Gaps:** there is no built-in enterprise control plane; teams commonly rely on external tracing/telemetry and internal policy engines. citeturn2search2turn9search0

**Semantic Kernel (governance primitives).** Semantic Kernel ships “filters” explicitly framed as enhancing security by providing control and visibility over how/when functions run (i.e., hooks to enforce responsible AI and tool governance). citeturn2search3  
However, Microsoft’s own public discussion indicates gaps: a GitHub proposal notes that Semantic Kernel “currently lacks a built-in governance policy layer for enforcing safety constraints on agent actions at the kernel level,” i.e., the ecosystem recognizes the need for a centralized policy layer beyond hooks. citeturn2search7  
**Gaps:** policy-as-code, consistent approvals, and enterprise audit evidence are not “solved” by filters alone; they require an opinionated governance layer and integration with IAM and compliance tooling. citeturn2search3turn2search7

## Observability platforms

A clear 2025–2026 trend is that agent observability is converging on: **distributed tracing concepts applied to LLM calls, retrieval, tool calls, and handoffs**, with growing standardization pressure via OpenTelemetry semantic conventions for GenAI. citeturn9search3turn7search3turn7search14

image_group{"layout":"carousel","aspect_ratio":"16:9","query":["LangSmith trace view screenshot","Arize Phoenix LLM tracing UI screenshot","Datadog LLM Observability agent monitoring dashboard","New Relic AI Agent Monitoring UI"],"num_per_query":1}

### entity["company","LangChain","llm tools company"] LangSmith

**Governance capabilities.** LangSmith is positioned as a platform to develop/debug/deploy agents with integrated monitoring and evaluations, including managing datasets, offline and online evals, and comparing experiments with trace linkage. citeturn4search10turn4search3turn4search15turn4search22

**Identity and authorization.** LangSmith has enterprise deployment/security considerations documented (deployment options, access control, privacy, cost controls). It also maintains a public trust center and references SOC 2 Type II and HIPAA posture for the service, which impacts governance suitability for regulated contexts. citeturn4search2turn4search4turn4search20turn4search12

**Observability and audit trails.** LangSmith’s core value is trace capture and project grouping; it emphasizes trace visibility for agent workflows and evaluation linkage across experiments. citeturn4search1turn4search8turn4search15

**Adversarial threats.** LangSmith is not an “AI firewall” by default; it supports detection/analysis via traces and evals, but runtime enforcement for prompt injection/tool misuse is generally implemented in the agent runtime, not the observability layer. citeturn4search0turn9search0

**Maturity.** Very strong on agent observability/evals; weaker on enforceable governance (it’s visibility-first). citeturn4search10turn4search3

### entity["company","Arize AI","ml observability company"] Phoenix

**Governance capabilities.** Phoenix is explicitly described as a tracing & evaluation platform where traces capture model calls, retrieval, tool use, and custom logic. It accepts traces over OTLP and provides auto-instrumentation for popular frameworks/providers, which makes it a pragmatic foundation for enterprise-grade evidence pipelines. citeturn3search0turn3search14

**Identity and authorization.** Phoenix itself is infrastructure; identity governance depends on how the organization deploys it (self-hosted vs managed) and how they integrate authentication/authorization around the trace store. citeturn3search3turn3search0

**Observability and audit trails.** Phoenix frames tracing as capturing every LLM call/tool execution/retrieval operation with inputs/outputs/latency/token usage, plus sessions for tracking conversations. This is the “audit backbone” pattern in agent engineering. citeturn3search14turn3search0

**Adversarial threats and maturity.** Like LangSmith, Phoenix largely enables detection and debugging; runtime threat blocking is typically upstream (agent runtime / firewall layer). citeturn3search0turn9search0

### entity["company","Galileo AI","ai observability company"]

**Governance capabilities.** Galileo’s GenAI Studio is described as modular (Evaluate, Observe, Protect) and “powered by a centralized Guardrail Store,” which is an explicit governance design: guardrails are treated as centrally managed assets, not ad hoc code. citeturn3search7turn3search4

**Identity and authorization.** As with most observability vendors, enterprise identity is usually handled through its SaaS controls/SAML/SSO and internal RBAC; the key governance question is whether guardrails and policies are versioned, approved, and tied to deployments in CI/CD. Galileo’s public docs highlight the guardrail store concept but don’t, by themselves, guarantee enterprise-grade authorization semantics for agent actions. citeturn3search7turn9search0

**Observability and audit trails.** Galileo Observe focuses on production monitoring; Galileo Guardrail Metrics emphasize policy/quality scoring as a structured layer for enforcement and evaluation. citeturn3search1turn3search4

**Adversarial threats and maturity.** Galileo has an explicit “Protect” module for real-time request/response interception (closer to runtime governance than pure observability). A recent industry report describes Galileo releasing “Agent Control” as open source, signaling that the field is moving toward control-plane primitives, not just dashboards. citeturn3search7turn3search15

### entity["company","Fiddler AI","ai observability company"]

**Governance capabilities.** Fiddler explicitly markets an “AI control plane” framing: centralized governance and oversight for agents and predictive models, recording agent behavior/action/decisions and generating audit evidence trails for regulatory needs. citeturn3search2turn3search5

**Identity and authorization.** Fiddler’s governance value is strongest once it is integrated into enterprise workflows (ownership, approvals, and evidence). Like other vendors, the hard part is tying “who triggered this” and “who approved this” to enterprise IAM consistently across toolchains. citeturn3search2turn9search0

**Observability and audit trails.** Fiddler emphasizes root cause analysis and full execution context/decision lineage across an “agentic hierarchy,” which is aligned with agent governance needs (chain-of-custody for decisions). citeturn3search5turn3search8

**Adversarial threats and maturity.** Fiddler positions guardrails + governance as part of its platform; compared with pure APM vendors, it is more explicitly oriented toward “audit evidence” and policy-driven control for AI systems. citeturn3search2turn3search8

### entity["company","Datadog","observability company"], entity["company","Dynatrace","observability company"], entity["company","New Relic","observability company"]

**Governance capabilities.** The large APM/observability vendors are converging on LLM/agent monitoring features, often framed as “full-stack visibility” rather than governance workflows.
- Datadog markets “end-to-end tracing across AI agents” with visibility into inputs/outputs/latency/token usage and quality/security evaluations. citeturn7search0turn7search4  
- Dynatrace markets monitoring/optimizing/securing GenAI and “agentic workflows,” including compliance and explainability framing. citeturn7search1turn7search9  
- New Relic describes “AI Agent Monitoring,” capturing full execution across agent invocations, tool calls, and handoffs; it also documents support for monitoring popular agent frameworks. citeturn7search2turn7search17  

**Identity and authorization.** These platforms typically inherit identity from APM deployment context (service identities, app instrumentation) rather than providing agent-native identity models. As a result, they are excellent at correlating agent execution with infrastructure and app traces, but weaker at enforcing “who is allowed to approve/execute an action.” citeturn7search10turn9search0

**Observability and audit trails.** The common pattern is adopting distributed tracing semantics for GenAI, and industry standardization is emerging via OpenTelemetry’s GenAI semantic conventions for spans/metrics/events (including agent spans). citeturn7search3turn9search3turn7search14

**Adversarial threats and maturity.** These tools help detect anomalies (latency/cost/spikes/errors) and provide forensics through traces, but they do not replace runtime AI security layers or governance workflows. **Maturity: high operational observability; low-to-medium governance enforcement.** citeturn7search0turn7search17turn9search0

## Security-specific vendors and AI security testing

This segment is growing because enterprises want enforcement that looks like “security controls,” not just “prompt guidelines.” The pattern: **intercept** prompts/responses/tool calls, apply detection/classification/policy, and generate actionable evidence. citeturn5search2turn6search3turn9search0

### entity["company","Arthur AI","ai governance company"]

**Governance capabilities.** Arthur positions an “AI firewall / guardrails” layer that fits into the LLM architecture as a middleware between application and deployment layers, validating prompts and model responses. citeturn5search8turn5search4

**Identity and authorization.** Arthur’s docs focus on policy enforcement at the content boundary; identity/authorization typically relies on the upstream app to supply identity context and on integration patterns to route traffic through the guardrails layer. citeturn5search8turn9search0

**Observability and audit trails.** Arthur’s guardrails configuration docs demonstrate a rules-based system (e.g., prompt injection rule classification), which supports audit evidence at least at the “policy evaluation decision” level. citeturn5search0turn5search12

**Adversarial threats.** Arthur explicitly supports prompt-injection detection and blocking (and markets hallucination detection and other protections as well). citeturn5search16turn5search12

**Maturity.** Strong for runtime enforcement; does not solve fleet governance workflows on its own. citeturn5search8turn9search0

### entity["company","Cisco Systems","network security company"] / Robust Intelligence

**Governance capabilities.** Cisco describes Robust Intelligence as foundational to Cisco AI Defense and Cisco Foundation AI, noting Robust Intelligence pioneered “algorithmic red teaming” and an “AI Firewall.” Cisco AI Defense markets discovery of AI assets and real-time mitigation of threats such as prompt injection, data leakage, and denial of service. citeturn6search1turn6search3turn6search7

**Identity and authorization.** The product framing emphasizes discovering AI workloads and risks in distributed environments; authorization is positioned as part of “misconfiguration” and security posture management, but the detailed “agent identity” model is likely to depend on integration into enterprise IAM and telemetry sources (cloud accounts, APIs, and app gateways). citeturn6search3turn9search0

**Observability and audit trails.** The core promise is continuous validation/protection across lifecycle “from development to production” (a governance claim), but evidence quality depends on how much action-level telemetry (tool calls, prompt lineage) is normalized and retained in a tamper-evident way. citeturn6search7turn6search3

**Adversarial threats and maturity.** Strong posture against runtime prompt injection and related threats; closer to “security control plane” than most observability vendors, but still not a complete enterprise governance workflow suite. citeturn6search3turn6search7turn9search0

### entity["company","Palo Alto Networks","cybersecurity company"] / Protect AI

**Governance capabilities.** Palo Alto Networks states it completed acquisition of Protect AI (July 22, 2025), framing AI security as lifecycle-wide. Protect AI markets a unified platform with products spanning model scanning, adversarial testing, and runtime security (positioned as end-to-end AI security coverage). citeturn6search4turn6search6turn6search10

**Identity and authorization.** This category tends to treat identity as an integration surface (CI/CD, registries, inference gateways). The key governance deliverable is policy enforcement in pipelines and runtime—not typically being the system of record for enterprise IAM. citeturn6search2turn6search10turn9search0

**Observability and audit trails.** Runtime interception products (e.g., “Layer” described as runtime security with scanners and threat detection for RAG and agents) can generate audit artifacts around blocked/allowed decisions, but they still need to be integrated into enterprise audit log retention and SIEM correlation to become compliance-grade. citeturn6search10turn9search0

**Adversarial threats and maturity.** Strong on supply-chain and runtime threat surfaces; maturity is highest when integrated into pipeline gates and inference gateways, less so as an enterprise-wide agent governance workflow layer. citeturn6search10turn6search2turn9search0

### entity["company","Lakera","ai security company"]

**Governance capabilities.** Lakera documents “prompt defense” as real-time detection of prompt attacks, with configurable actions (block/warn/flag). This is a runtime governance mechanism around prompt/tool interface boundaries. citeturn5search2

**Identity and authorization.** Lakera’s typical pattern is integration as a security layer; identity/authorization remains in the upstream app, but the defense layer can enrich decisions with security signals for incident response. citeturn5search2turn9search0

**Observability and audit trails.** Lakera’s threat write-ups emphasize that agents introduce new observable attack patterns (prompt leakage, indirect injection), implying that telemetry and monitoring are part of the defensive posture; however, enterprise audit retention and correlation still require SIEM integration. citeturn5search10turn5search2

**Adversarial threats and maturity.** Strong specialization in prompt injection and agent-specific threats; not a full governance control plane. citeturn5search10turn9search0

### entity["company","CalypsoAI","ai security company"]

**Governance capabilities.** CalypsoAI is positioned around **adversarial testing / red teaming** and model risk benchmarking; F5 describes “F5 AI Red Team” (previously Inference Red-Team) as an agent-powered adversarial testing platform designed to simulate real-world threats prior to launch. citeturn5search7turn5search19  
CalypsoAI also markets “security leaderboards” and “agentic signature attack packs” that quantify model security degradation under attack, which is directly useful for governance programs that require measurable risk reporting. citeturn5search11turn5search15

**Identity and authorization.** Testing platforms focus on pre-deploy assurance; identity is less about runtime authorization and more about ensuring access to endpoints and safe test execution context. citeturn5search7turn9search0

**Observability and audit trails.** The deliverable is an auditable assessment artifact (test results, risk scores, attack reproduction), which helps with governance evidence, but does not provide runtime monitoring unless paired with runtime guardrail products. citeturn5search11turn5search7

**Adversarial threats and maturity.** High value for continuous assurance and red team workflows; incomplete as a runtime governance layer by itself. citeturn5search7turn9search0

## Synthesis of patterns, consensus, gaps, and a comprehensive governance framework

### Patterns emerging across industry implementations

A few patterns are now consistently visible across model providers, clouds, enterprise platforms, and tooling:

**Control planes and inventories are becoming the “real product.”** The market is shifting from “use an LLM safely” to “operate an agent fleet safely.” ServiceNow’s asset inventory explicitly tracks prompts, datasets, MCP servers, lifecycle stage, and risk classification. Microsoft pushes Agent 365 as a control plane with agent registry and admin controls. These are governance workflows, not just safety filters. citeturn28view0turn26view0turn1search19

**Tool governance is replacing “prompt-only” thinking.** Google’s Cloud API Registry integration is expressly about curating/approving tools. OpenAI’s Agents SDK includes tool guardrails and tool gating; Anthropic recommends chained safeguards and continuous monitoring for tool-using use cases. AWS formalizes actions with OpenAPI schemas (action groups) and adds IAM enforceability for guardrails. citeturn0search2turn8search0turn19view0turn16search1turn1search8

**MCP is turning “connectors” into a supply-chain governance problem.** Multiple stacks treat MCP servers as first-class tool connectors:
- OpenAI’s Apps SDK guidance explicitly describes per-tool auth policies (`securitySchemes`) for tool endpoints. citeturn17search0  
- ServiceNow inventories MCP servers and even describes MCP server approval request workflow in its documentation tree (an indicator that MCP governance is now operational). citeturn28view0  
- Google explicitly mentions MCP support for tools in its tool governance announcements. citeturn0search2  

This creates a new governance surface: you need to manage not only *models* but also *tool servers*—their owners, scopes, auth, and approval lifecycle.

**Observability is converging on OpenTelemetry semantics.** Agent observability platforms and APM vendors are increasingly aligned with GenAI tracing semantics (spans/metrics/events), and OpenTelemetry now publishes GenAI semantic conventions, including agent spans. This is the first real “consensus substrate” for interoperable audit/telemetry across vendors. citeturn9search3turn7search8turn7search3turn7search14

### Where consensus is forming

**Prompt injection is treated as the #1 practical exploit class, and “defense-in-depth” is mandatory.** OWASP’s LLM Top 10 places prompt injection at LLM01 and continues to treat it as a top risk. Major vendor guidance increasingly centers around allowlists, tool gating, guardrails, and audit trails. citeturn9search0turn11search14turn8search0turn5search2

**Audit evidence is becoming non-negotiable.** Microsoft explicitly captures prompts/responses in unified audit logs; AWS emphasizes CloudTrail logging and session history APIs; OpenAI provides audit logs and adds agent-run tracing; toolchain vendors emphasize trace capture. This is a strong signal that enterprises are treating agent interactions as auditable security events, not just UX artifacts. citeturn27view0turn16search2turn8search4turn0search1turn3search0

### What most vendors are still missing

Despite progress, there are structural governance gaps that show up across nearly every stack:

**A portable, non-spoofable “agent identity” standard that works across ecosystems.** Vendors increasingly map agent instances to existing identity systems (e.g., “managed like users”), but agent identity across tools/MCP servers/clouds remains fragmented. This gap is now important enough that standards organizations are launching initiatives specifically on AI agent interoperability and secure operation. citeturn27view0turn24search2

**Action semantics and risk classification that are enforceable end-to-end.** Tool allowlists exist, but “actions” often lack a standardized risk taxonomy that controls approvals, logging depth, escalation, and rollback across platforms. ServiceNow is moving in this direction with risk classification fields in inventory, but cross-vendor interoperability is immature. citeturn28view0turn9search0

**Continuous authorization (“can the agent still do this right now?”), not just static permissioning.** IAM and RBAC/ABAC exist, but agent risk often depends on context (data sensitivity, destination system, user intent, tool output trust). Few vendors provide formal continuous authorization decisions per agent step with provable policy evaluations.

**Transactionality and rollback for agent actions.** Humans get approvals; agents need *transaction boundaries*. If an agent partially executes a workflow across systems, enterprises need a way to guarantee consistency or roll back. Current offerings rarely provide a generalized “agent transaction” model.

**Unified incident response for agents.** Most vendors can block content or disable a connector/agent. Fewer provide a full incident workflow: isolate agent, revoke tokens, invalidate sessions, preserve evidence, replay safely, patch prompts/tools, and redeploy with policy gates—across heterogeneous stacks.

### What a comprehensive governance framework needs that no single vendor provides

A practical “complete” agentic governance framework (what enterprises actually need, beyond marketing) is the integration of five layers:

**A governed inventory and ownership graph** (agents, tools/MCP servers, models, data sources, environments, owners, risk class, lifecycle stage). ServiceNow and Microsoft are closest at the “control plane UX” level; others are partial. citeturn28view0turn26view0turn1search19

**Policy-as-code + governance workflows** (approvals, change management, risk acceptance, exception handling) tied to deployments. Most vendors provide pieces, but consistent “policy-to-runtime enforcement” across clouds/apps remains fragmented. citeturn8search0turn1search8turn25view0

**Agent identity + authorization model that spans ecosystems** (enterprise IAM + delegated OAuth for tools + scoped tokens + continuous authorization). Many vendors support OAuth/RBAC/ABAC in their own contexts, but cross-ecosystem standardization is in early stages. citeturn17search0turn25view0turn27view0turn24search2

**Evidence-grade observability** (OTel-aligned traces, immutable audit stores, correlation IDs, replayability, redaction/PII strategy, export to SIEM). OpenTelemetry’s GenAI conventions make this feasible, but most enterprises still have to stitch together multiple vendors for full coverage. citeturn9search3turn7search14turn3search0turn8search4turn16search2

**Security assurance and runtime enforcement** (red teaming + continuous evals + runtime AI firewall/guardrails). Security vendors and platform guardrails solve chunks, but the “closed loop” (attack → detection → containment → patch → validated redeploy) is still usually custom-built. citeturn5search7turn5search2turn1search3turn6search3turn9search0