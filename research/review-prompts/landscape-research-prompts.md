# Landscape Research Prompts

Use these prompts with GPT Deep Research, Gemini Deep Research, and/or Claude Extended Thinking to map the current state of agentic governance, security, and risk management work across standards bodies, industry groups, and leading organizations.

The goal is NOT to reinvent. The goal is to understand what exists, identify the best thinking, and position our framework as a synthesis that shows how everything fits together.

---

## Prompt 1: Security & Governance Frameworks for Agentic AI (Standards Bodies)

```
Research the current state of security, governance, and risk management frameworks specifically targeting AI agents and agentic systems as of March 2026. Focus on:

1. OWASP:
   - OWASP Top 10 for LLM Applications (latest version)
   - OWASP Agentic AI security guidance (if any)
   - Any OWASP projects specifically addressing multi-agent security, agent-to-agent trust, or agentic workflow governance

2. Cloud Security Alliance (CSA):
   - CSA AI Safety Initiative
   - CSA guidance on AI agent security
   - Any CSA papers on zero trust for AI systems
   - CSA AI governance or risk management publications

3. NIST (beyond AI RMF 1.0):
   - NIST AI 600-1: Generative AI Profile
   - NIST AI 100-2e2025: Adversarial ML taxonomy
   - NIST CAISI RFI on AI Agent Security (Jan 2026)
   - NIST NCCoE Software and AI Agent Identity and Authorization concept paper (Feb 2026)
   - NIST SP 800-207 Zero Trust applied to AI
   - Any other NIST publications on agentic AI governance

4. ISO/IEC:
   - ISO/IEC 42001: AI Management Systems
   - ISO/IEC 23894: AI Risk Management
   - ISO/IEC 27001/27002 relevance to AI agents
   - Any ISO work on agentic AI specifically

5. EU AI Act:
   - High-risk AI system requirements (Articles 9-15) and how they apply to agentic systems
   - EU AI Office guidance on general-purpose AI models
   - CEN/CENELEC harmonized standards progress

6. Other relevant bodies:
   - MITRE ATLAS (Adversarial Threat Landscape for AI Systems)
   - IEEE standards for AI governance
   - Linux Foundation / CNCF work on agent protocols (A2A, MCP governance)
   - OpenTelemetry GenAI semantic conventions

For each source, capture:
- What it covers
- How mature it is (draft, published, widely adopted)
- What it says about agent identity, agent authorization, agent observability, agent-to-agent trust
- Key gaps — what it DOESN'T cover that agentic systems need
- How it relates to zero trust architecture principles

Synthesize: What is the current landscape of agentic governance and security standards? Where are the gaps? Where is consensus forming? What would a comprehensive framework need to address that no single existing standard covers?
```

## Prompt 2: Industry Implementations & Commercial Approaches

```
Research how leading technology companies and enterprise platforms are implementing governance, security, and observability for AI agents and agentic systems as of March 2026. Focus on:

1. Model providers:
   - Anthropic: Claude agent governance, usage policies, trust and safety approach
   - OpenAI: Agent governance in Agents SDK, ChatGPT actions governance, usage policies
   - Google: Gemini agent governance, Vertex AI agent management, AI Control Tower concepts
   - Meta: Llama agent governance guidance

2. Enterprise platforms:
   - ServiceNow: AI Control Tower, Agent Fabric
   - Salesforce: Agentforce governance, Einstein Trust Layer, determinism spectrum
   - Microsoft: Copilot governance, Semantic Kernel governance features, Purview AI governance
   - AWS: Bedrock agent governance, Bedrock Guardrails

3. Agent frameworks:
   - LangGraph: Human-in-the-loop, checkpointing, governance features
   - CrewAI: Role-based delegation, guardrails, observability
   - AutoGen: Multi-agent governance, group chat management
   - Semantic Kernel: Plugin governance, function call behavior controls

4. Observability platforms:
   - LangSmith: Agent tracing, evaluation, monitoring
   - Arize / Phoenix: LLM observability, agent tracing
   - Galileo: GenAI observability, guardrails
   - Fiddler AI: AI observability, governance
   - Datadog, Dynatrace, New Relic: GenAI monitoring capabilities

5. Security-specific:
   - Arthur AI: AI firewall, guardrails
   - Robust Intelligence / Protect AI: AI security platforms
   - Lakera: Prompt injection defense
   - Calypso AI: AI security testing

For each, capture:
- What governance capabilities they provide
- How they handle agent identity and authorization
- How they handle observability and audit trails
- How they address adversarial threats
- What's missing — what governance gaps exist in their approach?
- How mature is their agentic governance (vs. just LLM governance)?

Synthesize: What patterns are emerging across industry implementations? Where is consensus forming? What is everyone missing? What would a comprehensive governance framework need that no single vendor provides?
```

## Prompt 3: Academic & Research Landscape

```
Research the current academic and research work on governance, safety, and risk management for agentic AI systems as of March 2026. Focus on:

1. Agent safety and alignment:
   - DeepMind "Intelligent AI Delegation" paper (Tomašev, Franklin, Osindero — arXiv 2602.11865, 2026)
   - Stanford HAI work on AI governance
   - Berkeley CHAI agent safety research
   - Anthropic's published research on agent autonomy and measuring agent behavior
   - Any papers on multi-agent safety, agent coordination failure modes, or emergent behavior in agent swarms

2. Trust and delegation:
   - Research on human-AI delegation frameworks
   - Trust calibration in autonomous systems
   - Adaptive autonomy / adjustable autonomy research
   - Human oversight effectiveness studies

3. Agent architecture patterns:
   - Research on agent orchestration patterns
   - Multi-agent coordination and governance
   - Agent identity and authentication research
   - Zero trust applied to AI agent systems

4. Observability and monitoring:
   - Research on AI system monitoring
   - Provenance and traceability for AI systems
   - Runtime verification of AI systems
   - Anomaly detection in agent behavior

5. Risk assessment:
   - AI risk taxonomies relevant to agents
   - Threat modeling methodologies for agentic systems
   - Quantitative risk assessment for AI (FAIR-style approaches applied to AI)

For each paper/research area:
- Key findings
- How mature is the research (theoretical, empirical, deployed)?
- What practical guidance does it provide?
- How does it relate to zero trust, identity, observability, governance?

Synthesize: What is the academic community saying about governing agentic systems? Where is the research-practice gap? What insights from research should a practical governance framework incorporate?
```

---

## How to Use These

Run all three prompts through deep research agents (GPT, Gemini, Claude). Collect results in `concepts/research/landscape/`. The synthesis from all three will inform:

1. Whether our definitions (agents, models, agentic workflows) align with emerging consensus
2. What standards we should explicitly reference and map to
3. What gaps in the landscape our framework uniquely addresses
4. Whether our "specification applied to a model" framing is how others describe it
5. What we might be missing entirely
