# Deep Research Review of Agentic Primitives Reference Architecture

Download this report in Markdown: [agentic-primitives-round2-deep-research-review.md](sandbox:/mnt/data/agentic-primitives-round2-deep-research-review.md)

This review assesses the Round 2 “Agentic Primitives” document (expanded to 18 primitives) as a synthesis reference architecture for governed agentic systems, with particular focus on: (a) landscape validation as of March 2026, (b) accuracy of prior-art mappings, (c) validation of the proposed security architecture patterns, and (d) implementation and competitive realities. fileciteturn0file0

## Landscape update

### What is meaningfully new since February 2026

The most important “new since February 2026” additions are not a long list of new standards, but a handful of high-signal empirical and academic publications that directly strengthen (or constrain) your claims.

Anthropic published a large-scale empirical study of “millions of human-agent interactions” (Feb 18, 2026) spanning Claude Code and their public API. Key findings relevant to your “trust ladders / bounded agency / oversight” primitives include: (a) extreme autonomy duration in Claude Code (99.9th percentile turn duration) nearly doubled over a three-month window, and (b) oversight strategies evolve: experienced users enable full auto-approve more often (roughly ~20% of sessions for <50 sessions rising to 40%+ at ~750 sessions) while interruption rates also rise, indicating a shift from step-by-step approvals to “monitor + intervene” supervision. citeturn31view0

A February 2026 arXiv paper (“Mind the GAP”) introduces a benchmark and reports that text-only safety behavior does not reliably transfer to tool-call safety in LLM agents, including cases where the model refuses in text while still executing forbidden tool calls. It also reports that runtime “governance contracts” can reduce information leakage but show no detectable deterrent effect on forbidden tool-call attempts in their experiments. This is high-leverage prior art for your security model and a strong external justification for why tool-call governance and measurement must be first-class. citeturn32search0

A February 2026 arXiv paper (“Intelligent AI Delegation”) proposes an adaptive delegation framework incorporating explicit transfer of authority, responsibility, accountability, stable role boundaries, and trust mechanisms in delegation networks. Because your architecture elevates DELEGATE as an explicit governance signal and positions “bounded agency + identity + provenance” as a control foundation, this work is directly relevant supporting prior art and should be cited in the multi-agent and cross-system trust sections. citeturn30search1turn0file0

### NIST AI Agent Standards Initiative

NIST’s AI Agent Standards Initiative was announced as a focal organizing signal for “agent standards” work and includes a formal Request for Information process. This belongs in your “Landscape / Prior Art” section as a first-class anchor rather than a peripheral mention because it directly supports the thesis that “standards are converging toward agentic systems.” citeturn4view0turn4view1

The most concrete, governance-relevant artifact surfaced during March 2026 is NIST entity["organization","National Cybersecurity Center of Excellence","nist center | gaithersburg md"]’s concept paper on AI agent identity and authorization (open for public comment into early April 2026). This is unusually well aligned with your Identity / Bounded Agency / protocol-identity primitives: it provides a standards-adjacent, identity/authorization-focused artifact that can be referenced as the emerging “official” thread to watch. citeturn5view0turn6view0turn7view0

### OWASP ASI and “Top 10 for Agentic Applications” status

As of March 17, 2026, the OWASP “Top 10 for Agentic Applications 2026” publication remains the (December 2025) Top 10 document, and I did not find an official OWASP “updated version” of the Top 10 itself released after February 2026. citeturn11search0turn10view0

What did change, and should be incorporated, is the availability of tightly related OWASP guidance that is directly applicable to your MCP / tool interface threat surface and to your evaluation recommendations. OWASP published, in February 2026, a “Practical Guide for Secure MCP Server Development” and “Vendor Evaluation Criteria for AI Red Teaming Providers & Tooling v1.0,” both of which directly support your Security Intelligence and Evaluation & Assurance primitives. citeturn12view0turn12view1

### OpenTelemetry GenAI SIG and semantic conventions

OpenTelemetry’s GenAI semantic conventions are now a substantial spec covering spans/events/metrics for GenAI model and agent operations and even MCP-specific conventions. The spec explicitly defines agent spans (e.g., create_agent, invoke_agent) and includes attributes such as `gen_ai.agent.id`, `gen_ai.agent.name`, and `gen_ai.conversation.id` (conversation/session identifier), plus opt-in capture for system instructions and tool definitions. This is directly relevant to your provenance and observability primitives (i.e., what can and should be logged in a standardized way). citeturn16view0turn16view3turn14view0

OpenTelemetry also includes MCP semantic conventions and warns that MCP does not define a standard trace context propagation mechanism; instrumentations are advised to propagate trace context in MCP request metadata (e.g., `params._meta`) and to expect potential changes pending MCP guidance. This matters because trace continuity is a prerequisite for governance evidence across tool boundaries. citeturn15view0turn16view4

A concrete recent release milestone: OpenTelemetry semantic conventions v1.40.0 (Feb 19, 2026) includes a GenAI addition (`gen_ai.conversation.id`). Even a single stable “conversation id” attribute is disproportionately important for governance because it enables durable correlation of tool calls, approvals, and interventions at the “session” level rather than per-call only. citeturn14view3turn16view0

### Linux Foundation AAIF and MCP/A2A governance progression

The Linux Foundation’s Agentic AI Interoperability Forum (AAIF) positions itself as building open interoperability standards and best practices for agentic AI. This should remain in your landscape section as a governance/standardization signal, but today it is more directional than prescriptive. citeturn2view2turn0file0

More concretely, MCP’s public roadmap (Mar 9, 2026) includes “Governance Maturation” (contributor ladder, delegation model, transparent public artifacts/releases) and “Enterprise Readiness” goals including “audit trails” and “SSO integrated auth.” This provides evidence that “enterprise governance requirements” are now entering protocol roadmaps (not just application-layer discussions). citeturn3view0turn0file0

### Commercial landscape signals in early 2026

Enterprise platforms are now marketing agent governance (tool governance, audit readiness, lifecycle control) explicitly, meaning baseline “governance” messaging is no longer a unique differentiator—but it also validates that a market category is forming.

ServiceNow positions “AI Control Tower” as lifecycle governance and compliance/audit readiness for AI deployments. citeturn41search0turn41search13

Google’s Vertex AI Agent Builder has published “enhanced tool governance” capability updates including a curated/private registry of approved tools (via Cloud API Registry) and references MCP support for Google services, which overlaps your bounded tool access governance patterns. citeturn41search2

Salesforce communications increasingly frame Agentforce as being orchestrated atop a “secure and governed foundation” (including MuleSoft Agent Fabric language). citeturn41search4

These offerings cover important subsets (tool curation, audit logs, dashboards), but they typically do not publish explicit governance semantics (e.g., PASS/REVISE/HALT/GATE/DELEGATE) and transaction semantics the way your document does. This remains your most credible differentiator. citeturn41search0turn41search2turn0file0

## Prior art audit

### NIST AI RMF mapping accuracy

Your “Prior Art Mapping” table maps NIST AI RMF’s four functions to your ring/primitives model. fileciteturn0file0

The mappings are directionally reasonable, but several are over-compressed in ways that domain experts may push back on.

MAP in AI RMF is not primarily “risk classification.” NIST’s own summary frames MAP as: “Context is recognized and risks related to context are identified,” and the MAP section explicitly describes establishing context to frame risks, including how early purpose/objective decisions shape behavior and impacts. Risk classification can be an output, but “MAP = risk classification” is too narrow and should be reworded as “MAP = context framing + risk identification/classification.” citeturn28view1turn28view0turn0file0

MANAGE in AI RMF is framed as “risks are prioritized and acted upon based on projected impact.” Mapping MANAGE to trust ladders and bounded agency can work as an agentic specialization of how you “act upon risk,” but MANAGE is broader and also subsumes incident handling, operational response, and continuous improvement. To avoid misrepresentation, your row should read as “MANAGE includes trust ladders/bounded agency as runtime mechanisms,” not as the entirety of MANAGE. citeturn28view1turn0file0

MEASURE is about assessing, analyzing, and tracking identified risks over time. Your mapping to “Evaluation & Assurance (#18) + Ring 1 (Verification)” is a solid specialization if you explicitly call out that AI RMF MEASURE spans both pre-deployment evaluation and post-deployment monitoring. OpenTelemetry GenAI conventions reinforce the feasibility of post-deployment measurement for agents and tool calls. citeturn28view1turn16view0turn0file0

GOVERN as cross-cutting is consistent with NIST’s depiction that GOVERN is infused throughout the other three functions; your mapping to Ring 2 plus policy-as-code is defensible as a runtime instantiation if you clearly distinguish runtime governance from program governance. citeturn28view1turn27view0turn0file0

### EU AI Act mapping specificity and accuracy

Your EU AI Act mapping focuses on Articles 9–15 (high-risk AI system requirements) and maps them to primitives. fileciteturn0file0

The conceptual mapping is mostly defensible, but it needs two critical corrections/upgrades:

Article 6 (classification rules for high-risk AI systems) should be included explicitly. Your “cost-of-governance / ring activation intensity” concept depends on risk classification, and the AI Act’s classification logic is anchored in Article 6. citeturn23view1turn0file0

Your transparency mapping should be expanded to include Article 50. In the final AI Act text, Article 50 is titled “Transparency obligations for providers and deployers of certain AI systems” and contains the general transparency obligations (e.g., informing users they are interacting with AI, deepfake disclosure rules). Article 52 is not a transparency article; it is a “Procedure” in the general-purpose AI model systemic-risk section. If your document references “Article 52 transparency,” that is incorrect and should be fixed. citeturn24view0turn20view3turn0file0

Within Articles 9–15, several of your strongest alignments are worth tightening with explicit language ties:

Article 12 requires that high-risk AI systems “allow for the automatic recording of events (logs) over the lifetime of the system,” which is a direct legal hook for your “event-driven observability + provenance” design. citeturn22view5turn0file0

Article 14 includes an explicit human-oversight requirement to be able to “interrupt the system through a ‘stop’ button or a similar procedure that allows the system to come to a halt in a safe state,” supporting your stop/containment semantics (and strengthening the case that governance gates require a safe-halt mechanic). citeturn23view2turn0file0

Article 15 explicitly calls out resilience against AI-specific attacks including data poisoning, adversarial examples/model evasion, confidentiality attacks, and model flaws. This is a strong legal anchor for your adversarial robustness and security architecture sections. citeturn23view2turn0file0

### Missing prior art you should integrate

Several major governance and assurance artifacts should be integrated explicitly in your prior-art section because they are strongly aligned with your primitives and strengthen your “synthesis” positioning.

Singapore’s Model AI Governance Framework for Agentic AI (published by entity["organization","Infocomm Media Development Authority","singapore government agency"]) (Jan 22, 2026) is a government-published agentic governance framework and a major external validation point that should not be omitted. citeturn17search0turn0file0

entity["organization","GovTech Singapore","singapore government agency"]’s “Agentic Risk & Capability (ARC) Framework” (Dec 2025) is explicitly a technical governance framework for assessing and mitigating agentic AI risks. It can be used to triangulate your “rings” and “risk-based activation” ideas against a separately developed taxonomy. citeturn17search17turn0file0

ISO/IEC 42001 defines requirements for an AI management system (AIMS) and is a practical bridge between enterprise governance programs and runtime enforcement architectures like yours. citeturn18search0turn0file0

IEEE P2863 is a governance criteria and process recommended practice; it can anchor your “organizational governance” narrative when communicating to audit/compliance stakeholders. citeturn18search9turn0file0

UK AISI’s Inspect is a practical and agent-capable evaluation framework; it is a strong concrete anchor for Primitive 18 beyond “evaluate the system.” citeturn17search2turn0file0

### “What we add” claim defensibility

Your “What We Add” claims are most defensible when they emphasize operational semantics and composability rather than re-labeling.

The strongest unique contribution is the explicit control-plane semantics (PASS/REVISE/HALT/GATE/DELEGATE) and the detailed transaction semantics for side effects and approvals. Standards and threat lists rarely define this level of runtime behavior. fileciteturn0file0

Where credibility is at risk is where “What We Add” reads like equivalence claims (e.g., “MAP = risk classification” or “MANAGE = trust ladders”) rather than a specialization mapping. Tightening the language to “agentic specialization of” will substantially improve audit-grade defensibility. citeturn28view1turn0file0

## Security architecture validation

### Alignment of the three-level decomposition with established security patterns

Your decomposition into Security Fabric (enforcement), Security Governance (policy evaluation), and Security Intelligence (detection/correlation/response) aligns with widely used security architecture patterns: enforce/contain quickly at boundary points, decide policy centrally, and continuously observe and respond. fileciteturn0file0

Your explicit “zero trust” posture also tracks well with NIST’s zero trust framing (shifting from static perimeter to focus on users/assets/resources with continuous evaluation). In practice, your Security Fabric resembles enforcement points, Security Governance resembles policy decision logic, and Security Intelligence resembles continuous diagnostics and risk-response functions. citeturn29search5turn0file0

The CSA MAESTRO threat-modeling framework is another strong point of comparison because it treats agentic AI threats as multi-layered across a stack. CSA’s MAESTRO is explicitly designed as an agentic AI threat modeling framework and continues to be applied to real systems (e.g., CSA’s Feb 2026 MAESTRO analysis posts), supporting your “no single layer is sufficient” thesis. citeturn18search1turn18search5turn0file0

A gap you can close with minimal effort: explicitly map each of the three levels to recognizable control families from standard security catalogs (e.g., NIST SP 800-53 control families like Access Control, Audit and Accountability, Incident Response). This will reduce the cognitive translation burden for enterprise security architects. citeturn29search0turn0file0

### Security Response Bus prior art and whether “sub-second” is realistic

Your Security Response Bus is a pre-authorized fast path for containment that triggers without governance deliberation, then notifies governance post facto. fileciteturn0file0

This has direct prior art in conventional cyber incident response automation: modern incident response practice uses pre-approved playbooks (often implemented in SOAR + EDR) to execute rapid containment actions (e.g., isolate an endpoint, disable a credential) when certain high-confidence triggers fire. NIST SP 800-61 Rev.3 is explicit about integrating incident response into broader risk management and provides current guidance used by many organizations to design IR life cycles and containment strategies. citeturn29search2turn0file0

The sub-second claim is realistic for a narrow class of controls: inline enforcement at execution boundaries (e.g., tool-call gate, network egress gate, sandbox gate) triggered by deterministic signals. It is not realistic for correlated, cross-system detection requiring multi-source joins or LLM-based semantic interpretation at scale. You can preserve the concept by explicitly defining “fast path” (local, deterministic triggers) and “slow path” (correlated intelligence). citeturn0file0turn16view4

To make this proposal operationally credible, add explicit guidance for false-positive handling and post-containment recovery patterns. The faster the containment, the higher the operational cost of false positives; this is a known SOAR/IR tradeoff and should be acknowledged directly. citeturn29search2turn0file0

### Objective attestation feasibility constraints

Your framework proposes “objective attestation” (cryptographic goal-state verification) at ring boundaries. fileciteturn0file0

Today, what is realistically implementable is *configuration integrity attestation* (signed manifests of system instructions/templates/tool allowlists/policy versions/model identifiers) plus correlated provenance evidence that the runtime enforced those manifests. OpenTelemetry’s GenAI conventions anticipate capturing system instructions and tool definitions as opt-in telemetry, which is helpful as an “evidence substrate,” but telemetry is not the same as cryptographic enforcement. citeturn16view3turn14view0turn0file0

What is not realistically implementable with current technology is a cryptographic proof of the semantic “goal state” of an LLM’s internal deliberation. Recent research emphasizes precisely why this is hard: tool-call behavior can diverge from text refusal behavior under different prompts and conditions, meaning “objective integrity” cannot be inferred from a single surface. If you keep objective attestation in the architecture, it should be explicitly framed as a roadmap item and re-scoped to “signed control-plane config + evidence,” not “proof of semantic goal-state.” citeturn32search0turn0file0

## Round 1 response scorecard

This section grades whether Round 2 addressed the Round 1 gaps listed in your prompt by checking whether the corresponding capabilities are now present and sufficiently specified in the updated document. fileciteturn0file0

| Round 1 gap | Evidence now present in Round 2 | Assessment |
|---|---|---|
| Transaction / side-effect control | Primitive 16 added with explicit transaction lifecycle framing (idempotency, compensation, irreversible classifications) and governance-aware semantics. | **Adequate** fileciteturn0file0 |
| Evaluation & assurance | Primitive 18 added, emphasizing pre-deployment testing, regression testing, and gating configuration changes before deploy. | **Adequate** fileciteturn0file0 |
| Rings as deployment modes | “Ring Deployment Modes” section includes wrapper/middleware/graph-embedded modes and a mode selection matrix. | **Adequate** fileciteturn0file0 |
| REVISE(context) transaction semantics | “REVISE(context) transaction semantics” section includes no blind re-execution after side effects, stale-approval invalidation, compensation, and approval expiration. | **Adequate** fileciteturn0file0 |
| Minimum viable ring stack | “Minimum Viable Ring Stack” defines a minimal stack including Ring 0, Ring 1, thin Ring 2, core security fabric requirements, and Ring 3 advisory. | **Adequate** fileciteturn0file0 |
| Cross-system trust | Multi-agent section includes federated trust concept, protocol-level identity, and capability discovery ideas. | **Partial** (conceptually strong; needs tighter linkage to real standards workstreams and threat models). fileciteturn0file0turn5view0turn3view0 |
| Position as synthesis framework | “Core Thesis” and “Prior Art Mapping” explicitly position the framework as synthesis + operational semantics. | **Adequate** fileciteturn0file0 |
| “Identity + bounded agency + provenance” as minimum viable control | Minimum viable control section and composition patterns emphasize identity, bounded agency, and provenance as foundations. | **Partial** (present, but could be tightened into an explicit baseline with measurable requirements). fileciteturn0file0 |

## Implementation feasibility matrix

The document is a reference architecture; the ratings below are feasibility assessments for implementation with current agent frameworks and tooling as of March 2026.

Legend: **Now** = implementable with current tech; **Near-term** = implementable but high integration cost; **R&D** = prototypes exist but not broadly productionized; **Not yet** = missing key standards or requires breakthroughs.

| Component | What “done” looks like | Feasibility | Grounding |
|---|---|---:|---|
| Typed structured outputs + validation loops | Schemas, repair loops, rejection routing | **Now** | Core software pattern; directly described as foundational in the primitives. fileciteturn0file0 |
| Explicit governance signals at runtime | PASS/REVISE/HALT/GATE/DELEGATE semantics implemented at tool/action boundaries | **Near-term** | Feasible in modern graph-based orchestrators and agent frameworks with explicit tool nodes and state. citeturn40search2turn40search3turn0file0 |
| Ring deployment modes | Wrapper/middleware/graph-embedded implementations | **Now** | Engineering pattern; supported by graph-based frameworks and middleware interception. citeturn40search2turn40search16turn0file0 |
| Agent observability “evidence plane” | OTel traces/spans/events with stable session identifiers and tool-call correlations | **Near-term** | OTel GenAI conventions already define agent spans and MCP semantics; maturity is improving but still “Development.” citeturn14view0turn16view0turn15view0 |
| Record keeping aligned to EU AI Act | Automatic event/log capture over system lifetime | **Near-term** | EU AI Act Article 12 provides a strong compliance driver; OTel provides how-to schema direction. citeturn22view5turn14view0 |
| Transaction & side-effect control | Idempotency keys, compensation, stale approvals, irreversible-action gates | **Near-term** | Standard distributed systems techniques; explicitly specified in Primitive 16 and REVISE(context) semantics. fileciteturn0file0 |
| Pre-deployment evaluation & assurance | Regression suites; gating changes before deploy; targeted red-team | **Now / Near-term** | Concrete frameworks exist (e.g., Inspect) and industry best practices are emerging; integration effort is the bottleneck. citeturn17search2turn17search7turn0file0 |
| Runtime enforcement for unsafe executions | Intercept unsafe actions; apply policies; keep latency low | **R&D → Near-term** | AgentSpec reports high prevention rates with low overhead in evaluations, but production integration patterns vary by environment. citeturn30search2turn0file0 |
| Tool-call safety measurement | Dedicated measurement beyond text refusal; GAP-like harnesses by domain | **R&D** | “Mind the GAP” demonstrates why this measurement is necessary and non-trivial; tooling will mature but is early. citeturn32search0 |
| Security Response Bus | Pre-authorized containment actions; post-facto governance review | **Near-term** | Strong prior art from IR automation; the key is tight scoping + false-positive mitigation. citeturn29search2turn0file0 |
| Cross-system trust federation | Inter-org identity, capability discovery, policy translation, trust contracts | **R&D / Not yet** | Emerging workstreams (NIST AI agents initiative, protocol governance maturation) exist, but standard federation isn’t settled. citeturn5view0turn3view0turn0file0 |
| Objective attestation as “cryptographic goal proof” | Cryptographic proof of “goal-state integrity” across dynamic contexts | **Not yet (as stated)** | Feasible as signed config manifests and evidence capture, not as semantic goal-proof; must be reframed as roadmap. citeturn16view3turn32search0turn0file0 |

### Realistic timeline to implement the full architecture

A pragmatic timeline for a serious engineering team:

Within ~6 months, a minimum viable governed stack (Ring 0 + Ring 1 + thin Ring 2) with structured outputs, explicit governance signals at tool boundaries, initial OTel GenAI traces, and evaluation gating for config changes is realistic. citeturn40search2turn40search0turn14view0turn0file0

Within ~6–18 months, hardening transaction/side-effect logic, incident-response-grade containment playbooks, and domain-specific tool-call safety evaluation is realistic, with MCP context propagation and MCP semantic conventions integrated where relevant. citeturn16view4turn12view0turn29search2turn0file0

Beyond ~18–36 months, cross-system federation becomes realistic only if standards and enterprise implementations converge (NIST and LF/AAIF workstreams are signals here). “Objective attestation” beyond signed configuration remains uncertain without advances in runtime integrity and standardization. citeturn5view0turn2view0turn0file0

## Competitive positioning assessment

### Who is closest to building something like this?

Several vendors are close to shipping large subsets of the architecture, though typically as platform features rather than a published cross-standard reference architecture with explicit control semantics.

ServiceNow’s AI Control Tower is strongly aligned with lifecycle governance and audit-readiness as a product category. citeturn41search0turn41search13

Google Vertex AI Agent Builder is close on tool governance specifically (curated/approved tool registry, governance integrated into the cloud control plane, MCP support references). citeturn41search2

Salesforce’s Agentforce ecosystem is close on enterprise “governed agent” messaging and orchestration and is explicitly using “secure and governed foundation” language. citeturn41search4

Microsoft’s agent ecosystem is close on runtime orchestration and middleware/telemetry integration (e.g., Agent Framework combining agent abstractions with middleware/telemetry and graph-based workflows). citeturn40search16turn40search3

### Is the “integrator” positioning still credible?

It is credible if the differentiator is framed precisely: your document provides operational semantics (control signals and transaction semantics) plus a standards-to-runtime synthesis that is implementable across vendors and protocols, not a single-platform “governance dashboard.”

OpenTelemetry’s GenAI semantic conventions provide a neutral evidence substrate (agent spans, MCP conventions, conversation IDs) that strengthens the case for an integrator architecture that can normalize telemetry across implementations. citeturn14view0turn15view0turn16view0

However, broad claims like “nobody is doing governance” are no longer tenable: major vendors now explicitly claim governance, tool curation, and audit-readiness. Your positioning should therefore shift from “governance exists” to “governance semantics + composability + audit-grade interoperability across standards and protocols.” citeturn41search0turn41search2turn0file0

### Market timing

This framework is “right on time” for enterprise demand (governance and oversight infrastructure is now a visible need), while being ahead of the market on a few ambitious elements.

Anthropic’s empirical data indicates agent autonomy and oversight behaviors are already evolving in production (longer autonomy, shifted oversight styles), which supports your claim that post-deployment monitoring and governance infrastructure is required. citeturn31view0turn0file0

Recent research showing text safety does not transfer to tool-call safety sharply validates your emphasis on tool governance, action boundaries, and runtime enforcement rather than prompt-only guardrails. citeturn32search0turn0file0

Cross-system federation and “objective attestation” remain ahead of the market and should be positioned as a roadmap with incremental milestones rather than as near-term expectations. citeturn5view0turn0file0

## Top research-backed recommendations

### Tighten NIST AI RMF mappings to be audit-grade

Rewrite the NIST mapping so it reflects NIST’s actual framing: MAP = context recognition and risk identification (with classification as one output), MEASURE = assess/analyze/track risk (pre + post), MANAGE = prioritize/act on risk (including incident response and runtime controls), GOVERN = cross-cutting program + runtime governance components. citeturn28view0turn28view1turn0file0

### Correct and expand EU AI Act references

Include Article 6 explicitly (high-risk classification rules) and Article 50 explicitly (general transparency obligations). Ensure the document does not imply that Article 52 is “transparency” (it is a procedure in the systemic-risk GPAI model section). Tie your record-keeping mapping explicitly to Article 12’s “automatic recording of events (logs).” citeturn23view1turn24view0turn20view3turn22view5turn0file0

### Integrate Singapore agentic governance as first-class prior art

Add Singapore’s Model AI Governance Framework for Agentic AI and GovTech’s ARC Framework into the Prior Art Mapping section. This materially strengthens the “synthesis” thesis because it triangulates your framework against a governmental agentic governance framework and an independent technical taxonomy. citeturn17search0turn17search17turn0file0

### Upgrade Evaluation & Assurance using tool-call safety evidence

In Primitive 18, explicitly incorporate the “tool-call safety does not follow from text safety” finding and treat tool-call safety evaluation as a first-class evaluation dimension (benchmarking across regulated domains where relevant). Use the “runtime governance contracts reduce leakage but don’t deter forbidden tool calls” finding as a warning against over-reliance on “contracts-only” governance patterns. citeturn32search0turn0file0

### Re-scope “objective attestation” into an implementable roadmap

Reframe objective attestation as a staged path:

Stage 1: signed control-plane manifests (system instructions/templates/tool allowlists/policy versions/model identifiers) plus evidence capture.

Stage 2: hardened runtime enforcement (ensure execution is actually bound to the attested configuration).

Stage 3: stronger integrity guarantees only if/when trusted runtime enforcement and standard federation mature.

This keeps the architectural vision while avoiding an overclaim that could undermine technical credibility. citeturn16view3turn14view0turn0file0