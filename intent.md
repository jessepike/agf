# Concepts — Intent

**Status:** Active
**Last updated:** 2026-03-17

---

## What This Is

This directory contains the **Agentic Governance Framework** — a comprehensive reference architecture and operating model for organizations developing safe, secure, reliable, auditable, and observable agentic systems.

The landscape of agentic governance is fragmented. NIST provides risk management frameworks. OWASP provides threat taxonomies. CSA provides trust frameworks. ISO provides management systems. OpenTelemetry provides observability standards. Model providers ship their own governance features. Enterprise platforms build their own control planes. Security vendors build point solutions.

**We pull it all together.** We synthesize the best thinking from across the landscape — standards bodies, industry leaders, academic research — and compose it into a coherent, implementable playbook. We connect the dots so organizations don't have to stitch together 15 different frameworks on their own.

---

## Why We Do This

This is how human knowledge advances. We keep putting the next rung on the ladder.

Every institution in this space is playing a critical role. CSA is doing essential security work. OWASP is building the threat taxonomies that protect real systems. ISO and IEEE are establishing the management and organizational governance standards. NIST is defining the risk management frameworks and leading the charge on agent identity. OpenTelemetry is standardizing observability. Singapore published the world's first government agentic governance framework. DeepMind and Anthropic are producing the empirical research that grounds theory in reality. Dozens of academic labs are formalizing the patterns that practitioners depend on.

All of this extraordinary work — these are the dots. The puzzle pieces are on the table.

**Our role is to help see what the picture looks like.** We are trying to connect those dots, fill the gaps between the pieces, and propose a coherent view of how organizations should think about governing agentic systems. We do this with deep respect and gratitude for the communities, institutions, and researchers whose work makes our synthesis possible.

We are not claiming to have everything figured out. Some of what we propose here, we hold with high confidence — patterns that are established across multiple domains, validated by empirical evidence, and proven in production. Other parts are informed proposals — our best current thinking based on everything we can understand, but genuinely open to challenge. And there are areas where we simply don't have great answers yet, and we say so.

What we can promise is rigor. We have read extensively, synthesized carefully, sought adversarial critique from multiple independent reviewers, and revised honestly when we were wrong. Where our understanding evolves — because new research emerges, new technologies shift the landscape, or community feedback challenges our assumptions — we will update this work. This is a living framework, not a monument.

**At the end of the day, we are trying to help organizations build safe, secure, reliable, and durable agentic systems.** We are trying to play our part in helping the world move into this new era of extraordinarily powerful autonomous technologies in a proactive and responsible manner. We feel grateful to be in a position to contribute.

This is not one standard that will fit every organization's needs. It is a starting place — a reference that organizations can adopt, adapt, challenge, and build upon. Our hope is that this work serves the community: that it gives practitioners a better foundation for their day-to-day work, and that it connects enough dots for the industry to see further and build further than any of us could alone.

**This philosophy is the North Star for everything this project does.** Every decision — what to include, how to position it, where to acknowledge uncertainty — is governed by this intent: lead with humility, lead with rigor, serve the community, and help the world build agentic systems that are worthy of the trust placed in them.

---

## What We're Building Toward

This work produces multiple outcomes:

1. **The Playbook** — A reference architecture and practical guide (white paper series, potentially a book) that shows organizations how to govern agentic systems by integrating NIST, OWASP, CSA, ISO, OTel, EU AI Act, and industry best practices into a single coherent approach.

2. **Community products** — Open-source reference implementations, agent specification templates, event schemas, policy-as-code libraries, trust calibration tools. Things the community can use directly.

3. **Commercial products** — AI Risk Tools (assessment pipeline), Agentic Observability platform, Decision Intelligence platform, and governance consulting engagements built on the framework.

4. **Thought leadership** — White papers on specific areas (Trust Ladders, the Rings Model, Belief Layer), conference talks, NIST RFI responses, industry working group participation, published architecture guides.

The framework itself is the thought leadership and community contribution. The implementations — products, tools, and consulting built on the framework — are the commercial layer.

---

## What Lives Here

| Artifact Type | Purpose | Key Files |
|--------------|---------|-----------|
| **Agentic Governance Framework** | Top-level operating model — the umbrella that everything sits under | `agentic-governance-framework.md` |
| **Capability layers** | Detailed concept documents for each capability area within the framework | `agentic-primitives.md`, `decision-intelligence.md`, `agentic-observability.md` |
| **Architectural diagrams** | Visual reference models for the framework and capability layers | `diagrams/` |
| **Research** | Source material, competitive analysis, market research, session transcripts | `research/` |
| **Review artifacts** | External review prompts, review results, cross-review synthesis | `review-prompts/` |
| **Backlog** | Prioritized list of concept development work | `BACKLOG.md` |

**Future additions as concepts mature:**
- White papers (publishable deep-dives on specific primitives or patterns)
- Concept briefs (condensed, shareable summaries for external audiences)
- Regulatory mapping appendices (EU AI Act, NIST AI RMF, ISO 42001)

---

## How Concepts Relate to Build Work

```
  Concepts (North Star)
      │
      │  inform direction
      ▼
  Project Decisions (what to build next)
      │
      │  implement selectively
      ▼
  Implementation (code, product, pipeline)
      │
      │  teach us what's real
      ▼
  Concepts (updated with learnings)
```

**The loop:**
1. **Concepts inform projects.** When deciding what to build next on a project like the risk tools MVP, we ask: "Which primitives are we implementing? Which ring are we building toward? Does this move us in the direction of the North Star?"
2. **Projects don't implement concepts wholesale.** We pick the next primitive or pattern that delivers value NOW for the current project. Not everything. Not all at once. The concept doc says "here are 12 primitives" — the project says "we're implementing validation loops this sprint."
3. **Implementation teaches us.** Building real systems against these concepts reveals what's solid, what's aspirational, and what's wrong. That feedback updates the concepts.
4. **Concepts evolve.** They're living documents. They get pressure-tested through internal review, external review, and implementation experience. They get sharper over time, not stale.

**What this is NOT:**
- A waterfall plan where concepts must be "finished" before building starts
- A constraint that prevents building things not yet covered by a concept doc
- A requirement to implement all primitives in every project
- Academic theory disconnected from build reality

---

## Framework Structure

### Agentic Governance Framework (`agentic-governance-framework.md`)
The top-level operating model. Five governance functions (Discover, Assess, Govern, Monitor, Evolve), agent lifecycle management, risk classification, persona model, enterprise integration points, maturity model. This is the umbrella — read this first.

### Capability Layer: Agentic Primitives (`agentic-primitives.md`)
The foundational layer. Eighteen proven patterns for governed agentic systems, organized into concentric rings (Execution → Verification → Governance → Learning) with a three-level security architecture (Fabric, Governance, Intelligence), zero trust overlay, and three deployment modes (wrapper, middleware, graph-embedded). Includes prior art mapping to NIST AI RMF, EU AI Act, OWASP, CSA, and OTel. This is the shared vocabulary that all capability layers build on.

### Capability Layer: Decision Intelligence (`decision-intelligence.md`)
Governed decision-making systems. Structured decision persistence, belief revision, policy-as-code, decision provenance. A Governed Decision Flow (Ring 0 + Ring 1 + Ring 2) applied to risk-bearing decisions.

### Capability Layer: Agentic Observability (`agentic-observability.md`)
The unified monitoring, detection, and response layer. Three roles: quality monitoring (Ring 3 intelligence), security detection and response, governance compliance. The SIEM pattern applied to agentic workflows.

---

## How to Use This in a Project Session

When working on a specific project (e.g., risk tools MVP):

1. **Don't read every concept doc at session start.** That's waste. Read the relevant concept when you're making an architectural decision.
2. **Reference concepts by name.** "We're implementing Primitive #2 (Validation Loops) in this sprint" is useful. "We're building toward the full agentic primitives vision" is too vague.
3. **When implementation contradicts a concept, update the concept.** The concept was wrong, or incomplete, or the real-world constraint wasn't anticipated. That's learning. Capture it.
4. **When a project teaches you something new about a primitive, note it.** Add a "Current expression" line to the primitive, or update an open question with a partial answer.

---

## Review & Evolution Process

**Internal review:** Run concept docs through the internal review process to catch structural gaps, unclear reasoning, and missing perspectives. Do this early and often.

**External review:** After internal sharpening, run concepts past external reviewers for adversarial critique. They'll push on: prior art you missed, failure modes you didn't consider, real-world constraints you haven't accounted for.

**Publication pipeline:** Mature concept areas become publishable assets — white papers, posts, architectural diagrams. The concepts directory is the source material; published content is derived from it.

**Feedback loop from builds:** Every project that implements a concept primitive should feed learnings back. "We implemented Trust Ladders in the pipeline — here's what worked, here's what we'd change." That feedback makes the concept doc better.

---

## Principles

- **Humility before authority.** We synthesize, we don't decree. Acknowledge what came before. Credit the work we build on. Admit what we don't know.
- **Rigor before opinion.** Every claim should be grounded in evidence, prior art, or clearly marked as a proposal. If we can't ground it, we say so.
- **Directionally accurate > precisely specified.** These concepts describe where things are going, not exactly how to get there.
- **First principles that endure > implementation details that change.** Focus on the "why it endures" reasoning, not the specific tech stack.
- **Iterate > perfect.** Ship the concept, pressure test it, update it. Don't wait for completeness.
- **Build informs theory, theory informs build.** Neither is upstream of the other. They're a loop.
- **One concept doc, many implementations.** A single primitive (e.g., Validation Loops) may be implemented differently across different systems. The concept is the constant; the implementations vary.
- **Community > credit.** If this framework helps one organization build a safer agentic system, it has served its purpose — regardless of whether we get credit for it.
