# External Review Prompt — Agentic Primitives

Use this prompt with external models for adversarial review of the Agentic Primitives concept document. Attach or paste the full contents of `agentic-primitives.md` as context.

---

## The Prompt

```
You are an expert reviewer performing an adversarial, investor-grade review of a concept framework document. The document proposes 14 architectural primitives for governed agentic systems, organized into a concentric "rings" model with a composability interface.

This is a North Star vision document — not a product spec. It describes enduring patterns that the author believes will survive technology change over the next 3-5 years. Your job is to stress-test that claim.

Review the attached document across these dimensions:

### 1. Completeness
- Are the 14 primitives a sufficient set for governed agentic systems? What's missing?
- Are there primitives that are redundant or should be collapsed?
- Does the framework cover the full lifecycle: design-time, runtime, post-execution, cross-system?

### 2. Durability
- For each primitive, evaluate the "why it endures" argument. Which are strongest? Which are most vulnerable to being invalidated by:
  - Models that are 100x more capable
  - New regulatory frameworks (EU AI Act evolution, US federal AI law)
  - New infrastructure (native agent platforms from cloud providers)
  - New standards (OpenTelemetry GenAI, emerging agent protocol standards)
- Are there primitives that are actually implementation patterns disguised as enduring principles?

### 3. The Rings Model
- Does the concentric ring architecture hold up under real-world scenarios? Describe a scenario where it breaks.
- Is the time horizon framing (ms/min → sec/min → min/hr → days/weeks) accurate?
- Does the "rings are fractal" claim for multi-agent coordination hold, or does it create infinite governance recursion?
- Is the Ring 2 REVISE(context) mechanism sound, or does it create dangerous re-execution paths?

### 4. Composability Interface
- Is the PASS/REVISE/HALT/GATE/ERROR contract sufficient for real-world agent systems?
- Are the signal restrictions by ring (Ring 1: quality, Ring 2: context) clean, or are there edge cases that break them?
- Is "ring-compatible pipeline" well-enough defined to be implementable?
- Is git-as-versioning-primitive a strength or a limitation? What breaks at scale?

### 5. Tensions
- Are the 6 tensions the right ones? What tensions are missing?
- Are the resolutions convincing? Which resolution is weakest?
- Are the invariants ("the box can get smarter but cannot grow itself," "memory is curated not accumulated," etc.) defensible?

### 6. Prior Art & Landscape
- How does this framework relate to existing work?
  - Agent frameworks: LangGraph, CrewAI, AutoGen, Semantic Kernel
  - Observability: OpenTelemetry, LangSmith, Arize, Galileo
  - Governance: NIST AI RMF (Govern function), EU AI Act requirements, ISO 42001
  - Academic: DeepMind's "Intelligent AI Delegation," Stanford HAI work on AI governance
  - Industry: ServiceNow AI Control Tower, Salesforce Agentforce governance
- Is this framework genuinely novel, or is it naming things that already exist under different names?
- What existing work should this framework explicitly engage with (even if to differentiate)?

### 7. Practical Viability
- Could a team actually implement this? What's the minimum viable ring stack?
- What's missing for someone to go from this document to a working system?
- Is the "Cost of Governance" section realistic, or does it underestimate the overhead?

### 8. Weaknesses & Blind Spots
- What is the single strongest objection to this framework?
- What audience would reject this, and why?
- What real-world failure mode is this framework least prepared for?

### Output Format
Structure your review as:
- **Executive summary** (3-5 sentences: overall assessment)
- **Strongest elements** (what holds up best under scrutiny)
- **Critical gaps** (what's missing or wrong — be specific)
- **Durability assessment** (rank the 14 primitives from most to least durable, with reasoning for top 3 and bottom 3)
- **Prior art conflicts** (where this overlaps with or contradicts existing frameworks)
- **Recommended changes** (prioritized list)
- **Overall verdict**: Is this framework a credible contribution to the discourse on governed agentic systems, or is it reinventing existing ideas?
```

---

## Model-Specific Notes

### For GPT Deep Research
Add to the prompt: "Use your research capabilities to find the most current work on agentic system governance, agent observability standards, and multi-agent coordination frameworks. Compare this document against what's actually being built and published in 2025-2026."

### For Gemini Deep Research
Add to the prompt: "Search for recent publications, standards, and industry implementations related to agentic system governance. Pay particular attention to OpenTelemetry GenAI semantic conventions, EU AI Act implementing acts on AI system monitoring requirements, and any emerging agent protocol standards."

### For Claude Opus Extended Thinking
Add to the prompt: "Take your time with this. Think through each primitive carefully. I want you to find the weak points — the places where the framework's claims about durability are most likely wrong, where the rings model breaks down, and where the tensions have resolutions that sound good but wouldn't survive implementation. Be the hardest reviewer this document has faced."
