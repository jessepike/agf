# Round 3 Deep Research Review of Agentic Primitives Reference Architecture

## Security Architecture Coherence

The architecture’s “single-owner” responsibility model is a **reasonable simplification**: it forces explicit accountability while still allowing defense-in-depth via supporting levels/primitives. The practical risk is that agentic threats routinely traverse multiple layers (context → tools → identity → data lifecycle), so the model needs explicit tie-breaker rules for cross-boundary cases. citeturn39view0

**Per-threat verification of the single-owner OWASP assignments (ASI01–ASI10)**

**ASI01 — Agent Goal Hijack** (document: Fabric → #15 Adversarial Robustness): **Mixed / needs tighter scoping.** OWASP frames this as hidden prompts/instructions that redirect an agent’s goal, often via external content and agentic surfaces. citeturn39view0  
If ASI01 is scoped primarily to *external prompt/context injection changing objectives*, Fabric/#15 ownership is defensible because it is an external threat-surface problem that should be blocked at the boundary before actions execute. citeturn39view0  
Where ownership becomes ambiguous is when “goal hijack” is enabled by *mutable instruction architecture or uncontrolled context composition*. The Feb 2026 AgentOS paper’s OS-style framing of context as a managed substrate (paging, interrupt cycles, synchronization) reinforces that the environment/instruction layer itself is a first-class control surface, not “just input validation.” citeturn34view0  
**Recommendation:** keep #15 as owner only for *external* hijack vectors; otherwise promote #19 (environment governance) to owning primitive (Governance), with #15 as enforcement/hardening.

**ASI02 — Tool Misuse & Exploitation** (document: Governance → #7 Bounded Agency): **Strong.** OWASP describes tool misuse as steering agents into unsafe use of legitimate capabilities. That’s primarily a question of *permitted actions under policy*, which Bounded Agency is designed to govern. citeturn39view0

**ASI03 — Identity & Privilege Abuse** (document: Fabric → #14 Identity & Attribution): **Strong.** This category is about how agents receive/hold/delegate privilege and how stale or inherited credentials expand blast radius. citeturn39view0  
NIST IR 8596 supports the “agents are privileged actors” framing by recommending unique identity/credentials for agents and treating them with privileged user-grade precautions. citeturn21view0

**ASI04 — Agentic Supply Chain Vulnerabilities** (document: Governance → #15 Adversarial Robustness): **Mixed; consider swapping the owning primitive.** OWASP highlights supply-chain poisoning in dynamic MCP/A2A ecosystems where runtime components can be poisoned. citeturn39view0  
At protocol granularity, OWASP’s MCP Top 10 includes Tool Poisoning and Supply Chain Attacks as distinct categories, supporting the importance of this risk class. citeturn7view0  
Governance ownership is plausible (admission policy), but #15 is not the most semantically direct owner for supply chain. In most mature security architectures, “supply chain” is owned by provenance + integrity + admission controls. citeturn7view0  
**Recommendation:** keep Governance as owning level, but strongly consider **#6 Provenance Chains** (or #19 for runtime tool admission) as the owning primitive, with #15 as supporting defense-in-depth.

**ASI05 — Unexpected Code Execution** (document: Fabric → #15 Adversarial Robustness): **Mostly strong; minor tuning suggested.** OWASP ties agentic RCE to natural-language execution paths. citeturn39view0  
NIST IR 8596 explicitly warns that agent systems may execute arbitrary code and states this should typically be curtailed, sandboxed, monitored, or disallowed. citeturn21view1  
That validates Fabric ownership: code execution safety is ultimately enforced out-of-process (sandboxing, OS policy, runtime constraints). citeturn36view3  
**Recommendation:** keep Fabric as owner; consider elevating #16 Transaction & Side-Effect Control as a prominent supporting primitive for reversibility and blast-radius limiting.

**ASI06 — Memory & Context Poisoning** (document: Intelligence → #12 Memory-Augmented Reasoning): **Mixed; defensible if ownership is defined as “detection + remediation authority.”** OWASP emphasizes that memory poisoning reshapes behavior long after initial interaction. citeturn39view0  
Intelligence/#12 can own if it is explicitly responsible for poisoning detection, memory integrity scoring, and rollback/repair workflows. AgentOS further supports the “memory as managed substrate” framing (hierarchy, semantic paging, drift). citeturn34view0  
But the poisoned artifact is still data; lifecycle controls (classification, retention, isolation) also matter, and NIST’s agent identity/logging framing implies memory artifacts must be traceable and attributable. citeturn21view0turn29view1  
**Recommendation:** keep Intelligence/#12 as owner only if rollback/repair is clearly in scope; otherwise shift ownership to #17 (internal data lifecycle) and treat #12 as the mechanism.

**ASI07 — Insecure Inter-Agent Communication** (document: Fabric → #14 Identity & Attribution): **Strong.** OWASP describes spoofed inter-agent messages that can misdirect clusters. citeturn39view0  
Authentication and channel integrity are root controls; without them, higher-level trust ladders collapse. NIST IR 8596 endorses binding identities/credentials with cryptographic signing and mutual authentication. citeturn21view0

**ASI08 — Cascading Failures** (document: Intelligence → #13 Error Handling & Recovery): **Strong.** OWASP frames this as false signals cascading through automation with escalating impact. citeturn39view0  
This is principally an observability + resilience + rollback problem (detect, degrade safely, contain, restore).  

**ASI09 — Human-Agent Trust Exploitation** (document: Intelligence → #11 Trust Ladders): **Strong.** OWASP highlights polished explanations that mislead humans into approving harmful actions. citeturn39view0  
Trust ladders (earned autonomy) plus governance gates is the correct control locus.

**ASI10 — Rogue Agents** (document: Intelligence → #7 Bounded Agency): **Mixed.** OWASP describes misalignment, concealment, and self-directed action. citeturn39view0  
Bounded agency is necessary but rarely sufficient; containment also needs immutable audit and rapid kill-switch/rollback. Recent academic work proposes a layered governance stack explicitly including execution sandboxing and immutable audit logging. citeturn36view0  
**Recommendation:** if single-owner must remain, consider whether #13 (recovery/rollback) or #18 (evaluation/assurance) is a better owner for containment and remediation, with #7 as core support.

**Boundary clarification (#15 external surface vs #17 internal lifecycle; Governance vs Fabric)**

The boundary language is directionally correct: Governance defines policy; Fabric enforces; internal data lifecycle controls sit with data governance; external injection/hardening sits with the threat-surface primitive. This mirrors how multiple regulatory/standards texts separate documentation/policy obligations from technical enforcement mechanisms. citeturn43view0turn32view2  
What’s still missing is an explicit edge-case rule-set for the most common ambiguous transitions:

- External prompt/context payloads becoming internal memory state (ASI01 ↔ ASI06). citeturn39view0  
- Runtime supply chain admission in MCP ecosystems (tool discovery + trust) blurring build-time vs run-time “supply chain.” citeturn7view0  
- Identity vs environment policy: authentication tells you “who,” but environment policy determines what an authenticated agent can reach/do; NIST’s NCCoE concept paper explicitly positions SPIFFE/SPIRE, OAuth/OIDC, and NGAC as standards for agent identification/authorization. citeturn29view1  

**Recommendation:** add 2–3 tie-breaker rules (e.g., “owner is where the last enforceable invariant exists,” plus explicit exceptions) and document them adjacent to the matrix.

**MCP integration technical accuracy**

MCP as a tool/context protocol is described correctly: it enables structured connections between AI clients and external tools/data sources. citeturn40search2turn40search8turn40search0  
Adoption evidence is strong: entity["company","OpenAI","ai company"] publishes MCP integration docs; entity["company","Cloudflare","internet infrastructure company"] publishes MCP docs and MCP servers; entity["company","Anthropic","ai company"] introduced MCP and later donated it to the entity["organization","Linux Foundation","nonprofit foundation"]’s entity["organization","Agentic AI Foundation","lf agentic ai org"]. citeturn40search0turn40search1turn40search2turn40search9  

The “53% static key” statistic is supportable as an external metric from entity["company","Astrix Security","security company"] research. citeturn5search0  
Correction: in #15 the document attributes the statistic to OWASP MCP Top 10 identifying it; OWASP MCP Top 10 defines threat categories but does not appear to be the origin of that percentage. citeturn7view0turn5search0  

OWASP MCP Top 10 categories, as of March 2026, are published as MCP01–MCP10 and include Tool Poisoning and Supply Chain Attacks. citeturn7view0  
The document’s MCP06 label (“Intent Flow Subversion”) does not match OWASP’s GitHub list, which labels MCP06 as “Prompt Injection via Contextual Payloads.” citeturn7view0  
Additionally, the OWASP Foundation page shows internal inconsistencies, suggesting the taxonomy is living/beta and pages may be out of sync. citeturn3view0turn7view0  

**#19 supporting role integration**

The responsibility mapping includes #19 as a supporting primitive for ASI01 (Goal Hijack), ASI04 (Supply Chain), and ASI06 (Memory & Context Poisoning). That is coherent: all three are strongly shaped by context composition, tool admission, and session/memory state. citeturn39view0turn7view0turn34view0

## Prior Art Accuracy

**entity["organization","OWASP Foundation","web app security nonprofit"] agentic and MCP taxonomies**

The OWASP Top 10 for Agentic Applications list (ASI01–ASI10) and its incident-driven framing (goal hijack, tool misuse, identity abuse, supply chain, unexpected code execution, memory poisoning, insecure inter-agent comms, cascading failures, trust exploitation, rogue agents) match the document’s threat naming. citeturn39view0  
OWASP’s MCP Top 10 exists as a separate taxonomy (MCP01–MCP10) that includes Tool Poisoning, Supply Chain Attacks, and Context Injection/Over-sharing. citeturn7view0  

**entity["organization","Infocomm Media Development Authority","singapore"] framework**

The IMDA Model AI Governance Framework for Agentic AI is correctly described as four dimensions: (1) assess and bound risks upfront, (2) make humans meaningfully accountable, (3) implement technical controls and processes, (4) enable end-user responsibility. citeturn41view1turn13view0  
The document’s phrasing differs slightly (“assurance/testing” vs “technical controls and processes”), but the substance is aligned. citeturn41view1  
Correction needed: the document claims the IMDA framework references “SAFE.” This is not supported by IMDA’s official framework PDF or IMDA press release materials. citeturn41view1turn13view0  

**entity["organization","National Institute of Standards and Technology","us standards agency"] IR 8596**

The “three focus areas” are accurately represented: Securing AI System Components (Secure), Conducting AI‑Enabled Cyber Defense (Defend), and Thwarting AI‑Enabled Cyber Attacks (Thwart). citeturn19view0turn19view1  
The document’s “agents as actors” framing is directionally supported: IR 8596 explicitly treats AI agents as first-class entities and recommends giving agents unique identities/credentials and treating them as privileged users. citeturn21view0  

**entity["organization","Cloud Security Alliance","cloud security org"] MAESTRO**

The document’s MAESTRO 7-layer names and descriptions are consistent with CSA’s MAESTRO architecture breakdown: Foundation Models, Data Operations, Agent Frameworks, Deployment and Infrastructure, Evaluation and Observability, Security and Compliance (vertical), and Agent Ecosystem. citeturn26view0turn25view1turn25view2  
Minor tuning: CSA commonly uses the label “Deployment and Infrastructure” for Layer 4; the document’s “Deployment Infrastructure” is a minor compression rather than a mismatch. citeturn26view1  

**entity["organization","NIST National Cybersecurity Center of Excellence","rockville, maryland, usa"] concept paper on agent identity**

The Feb 2026 concept paper exists and includes the standards list the document cites: it references MCP and notes MCP relies on OAuth and OIDC; it also lists OAuth 2.0/2.1, OpenID Connect, SPIFFE/SPIRE, SCIM, and NGAC as relevant standards/guidelines for identifying and authorizing software + AI agents. citeturn29view0turn29view1  

**EU AI Act article-level verification**

At a high level, the document’s descriptions of the cited articles are mostly aligned:  
- Art. 9 requires a lifecycle risk management system for high-risk AI. citeturn32view2  
- Art. 11 requires technical documentation for high-risk AI before market release, kept up to date, and tied to Annex IV elements. citeturn43view0  
- Art. 13 requires sufficient transparency for deployers to interpret outputs and use the system appropriately. citeturn44search12  
- Art. 15 requires appropriate accuracy, robustness, and cybersecurity, including resilience against attacks like poisoning/adversarial examples, and declaring accuracy metrics in instructions for use. citeturn44search1  
- Art. 50 creates transparency obligations for certain AI systems (including generative/interactive and deepfakes) and is accompanied by Commission guidance work. citeturn43view1turn43view2  

Correction needed: the document over-specifies Art. 12 (record-keeping). Art. 12 is more general—logs must enable recording of events relevant to risk/substantial modification, post‑market monitoring, and operation monitoring; minimum detailed fields are only mandated for specific remote biometric identification systems. citeturn32view0  

**AgentOS existence and description**

The Feb 24, 2026 “Architecting AgentOS” arXiv paper exists and does propose: an L1/L2/L3 cognitive memory hierarchy, semantic paging via a semantic memory management unit (S‑MMU), cognitive drift in asynchronous multi-agent orchestration, and “Cognitive Sync Pulses” as event-driven synchronization. citeturn34view0  

**Material missing prior art between Jan–Mar 2026**

A high-impact missing academic reference for a governance-oriented agent architecture is the March 2026 “Layered Governance Architecture (LGA)” paper proposing execution sandboxing, intent verification, zero-trust inter-agent authorization, and immutable audit logging, evaluated on an OpenClaw benchmark. citeturn36view0

## #19 Landscape Assessment

The document’s broad novelty claim (“AGF is the first to treat agent environment as a governance concern”) is **not defensible as written** because multiple 2025–2026 efforts explicitly frame the agent runtime environment and its policy as governed/auditable:

- entity["company","NVIDIA","gpu company"] OpenShell: out-of-process policy enforcement, granular sandbox policy (filesystem/network/process), live policy updates with approvals, and an audit trail of allow/deny decisions. citeturn36view3turn36view2turn36view1  
- entity["company","Microsoft","software company"] Agent 365: marketed as a “control plane” providing centralized governance, security, and observability for agents. citeturn35search1turn35search5  
- entity["company","Teradata","data platform company"] Enterprise AgentStack: explicitly claims governance via AgentOps and includes an “Enterprise MCP” component for secure, context-rich access to trusted enterprise data. citeturn35search2turn35search9turn35search12  
- NIST’s NCCoE concept paper: treats agent identity/authorization as the foundation for governing enterprise agent access and lists standards to implement it. citeturn29view1  
- Academic LGA: explicitly defines a governance stack including sandboxing and immutable audit. citeturn36view0  

**Practical revision:** Narrow the novelty claim to what is actually distinctive: #19’s unification of **context composition + instruction architecture + capability provisioning + workspace/session state + governed optimization loops** into a single governed, versioned, auditable artifact within a reference architecture.

**#19 vs OpenShell**  
OpenShell is closer to governance than “just engineering”: it externalizes policy from the agent process, supports a structured policy artifact, enables dynamic policy updates, and records allow/deny decisions. citeturn36view3turn36view2  
OpenShell’s strength is enforcement at the sandbox layer; #19’s opportunity is to define the wider governance artifact (including instruction/context composition and optimization workflow) and treat OpenShell-style enforcement as an implementation strategy for part of that artifact.

**#19 vs Agent 365**  
Agent 365’s public framing is organizational fleet governance (inventory, security, observability). citeturn35search5turn35search1  
It does not publicly specify how prompt/instruction stacks are governed as auditable artifacts; #19 can position itself as the technical “environment governance substrate” that a control plane would need to implement consistently across runtimes.

**#19 vs Teradata AgentStack**  
Teradata positions “govern” as a productized capability (AgentOps + Enterprise MCP). citeturn35search12turn35search2  
#19 should acknowledge this as competitive prior art and position itself as a vendor-neutral design pattern and evaluation rubric.

**Is AgentOS the strongest academic reference for #19?**  
AgentOS is strong for the conceptual framing of context as a managed substrate (memory hierarchy, semantic paging, drift, synchronization). citeturn34view0  
For governance positioning, LGA is a more direct academic anchor because it explicitly treats sandboxing, intent verification, authorization, and immutable audit as a governance stack and reports benchmarked outcomes. citeturn36view0  

## Factual Errors Found

- **MCP06 category name drift:** the document labels MCP06 as “Intent Flow Subversion,” while the OWASP MCP Top 10 GitHub list currently labels MCP06 as “Prompt Injection via Contextual Payloads.” citeturn7view0  
- **Misattribution of the “53% static key” statistic:** the 53% statistic is attributed to Astrix research; it is not clearly sourced from OWASP MCP Top 10 itself. citeturn5search0turn7view0  
- **EU AI Act Art. 12 over-specification:** the document states Art. 12 requires specific categories of logs (inputs/outputs/parameter changes/human intervention events); the entity["organization","European Commission","eu executive body"]’s text is more general and only mandates detailed minimum fields for certain remote biometric identification systems. citeturn32view0  
- **IMDA “SAFE” concept treated as part of the framework:** IMDA’s official materials present four dimensions; SAFE is not represented as a named framework element there. citeturn41view1turn13view0  
- **OWASP MCP Top 10 stability assumption:** OWASP’s own web page and GitHub list show signs of being out of sync, so the document should pin to a version/tag and cite the canonical list. citeturn3view0turn7view0  

## Top 5 Remaining Gaps

1) **Ownership tie-breaker rules for cross-boundary threats.** The “single owner” model needs explicit exception handling for external→internal transformations (context→memory) and for runtime supply chain admission in MCP ecosystems. citeturn39view0turn7view0  

2) **A concrete environment-policy artifact specification.** #19 will be far more implementable if it defines a canonical, versioned object that covers: instruction stack, context sources, tool admission, workspace scope, session state/memory governance, and a governed optimization loop—plus signing and promotion rules. OpenShell’s policy YAML demonstrates what “policy as artifact” looks like at the sandbox layer; #19 needs the cross-layer equivalent. citeturn36view2turn36view3  

3) **Normative control mappings for security and compliance.** Map primitives to commonly used control catalogs (e.g., NIST 800-53 / ISO) and to AI Act obligations, including what evidence is produced (technical documentation, logs, approvals). citeturn43view0turn32view2turn44search1turn43view1  

4) **A threat-driven evaluation harness with measurable outcomes.** The reference architecture needs a standard regression/red-team suite for: prompt/context poisoning, tool poisoning, privilege escalation, unexpected code execution, and rogue-agent behaviors—producing interception/false positive metrics. LGA demonstrates the beginnings of this benchmarked approach. citeturn36view0  

5) **Operational definition of governance recursion limits and audit strategy.** #19 calls out recursion (agents helping govern agents). The definitive architecture should specify (a) the finite recursion boundary and (b) a scalable audit model that remains intelligible to humans and regulators. citeturn29view0turn32view0  

Download this report as Markdown: [Agentic_Primitives_Round3_Review.md](sandbox:/mnt/data/Agentic_Primitives_Round3_Review.md)