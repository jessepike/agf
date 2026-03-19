# Concepts — Intent

**Status:** Active
**Last updated:** 2026-03-17

---

## What This Is

This directory contains the **Agentic Governance Framework** — a comprehensive reference architecture and operating model for organizations developing safe, secure, durable, auditable, and observable agentic systems.

The landscape of agentic governance is fragmented. NIST provides risk management frameworks. OWASP provides threat taxonomies. CSA provides trust frameworks. ISO provides management systems. OpenTelemetry provides observability standards. Model providers ship their own governance features. Enterprise platforms build their own control planes. Security vendors build point solutions.

**We pull it all together.** We synthesize the best thinking from across the landscape — standards bodies, industry leaders, academic research — and compose it into a coherent, implementable playbook. We sort the pieces so organizations don't have to stitch together 15 different frameworks on their own.

---

## Why We Do This

This is how human knowledge advances. We keep putting the next rung on the ladder.

Every institution in this space is playing a critical role. CSA is doing essential security work. OWASP is building the threat taxonomies that protect real systems. ISO and IEEE are establishing the management and organizational governance standards. NIST is defining the risk management frameworks and leading the charge on agent identity. OpenTelemetry is standardizing observability. Singapore published the world's first government agentic governance framework. DeepMind and Anthropic are producing the empirical research that grounds theory in reality. Dozens of academic labs are formalizing the patterns that practitioners depend on.

All of this extraordinary work — these are the dots. The puzzle pieces are on the table.

**Our role is to help see what the picture looks like.** We are sorting the pieces, showing where they fit together, and proposing a coherent view of how organizations should think about governing agentic systems. We do this with deep respect and gratitude for the communities, institutions, and researchers whose work makes our synthesis possible.

We are not claiming to have everything figured out. Some of what we propose here, we hold with high confidence — patterns that are established across multiple domains, validated by empirical evidence, and proven in production. Other parts are informed proposals — our best current thinking based on everything we can understand, but genuinely open to challenge. And there are areas where we simply don't have great answers yet, and we say so.

What we can promise is rigor. We have read extensively, synthesized carefully, sought adversarial critique from multiple independent reviewers, and revised honestly when we were wrong. Where our understanding evolves — because new research emerges, new technologies shift the landscape, or community feedback challenges our assumptions — we will update this work. This is a living framework, not a monument.

**At the end of the day, we are trying to help organizations build safe, secure, durable, auditable, and observable agentic systems.** We are trying to play our part in helping the world move into this new era of extraordinarily powerful autonomous technologies in a proactive and responsible manner. We feel grateful to be in a position to contribute.

This is not one standard that will fit every organization's needs. It is a starting place — a reference that organizations can adopt, adapt, challenge, and build upon. Our hope is that this work serves the community: that it gives practitioners a better foundation for their day-to-day work, and that it shows enough of the picture for the industry to see further and build further than any of us could alone.

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

## Framework Structure

### Agentic Governance Framework (`agentic-governance-framework.md`)
The top-level operating model. Five governance functions (Discover, Assess, Govern, Monitor, Evolve), agent lifecycle management, risk classification, persona model, enterprise integration points, maturity model. This is the umbrella — read this first.

### Capability Layer: Agentic Primitives (`agentic-primitives.md`)
The foundational layer. Nineteen proven patterns for governed agentic systems — runtime primitives (#1-#17), a lifecycle primitive (#18: Evaluation & Assurance), and a substrate primitive (#19: Agent Environment Governance) — organized into concentric rings (Execution → Verification → Governance → Learning) with a three-level security architecture (Fabric, Governance, Intelligence), zero trust overlay, and three deployment modes (wrapper, middleware, graph-embedded). Includes existing work mapping to NIST AI RMF, EU AI Act, OWASP, CSA, OTel, and context engineering research. This is the shared vocabulary that all capability layers build on.

### Capability Layer: Decision Intelligence (`decision-intelligence.md`)
Governed decision-making systems. Structured decision persistence, belief revision, policy-as-code, decision provenance. A Governed Decision Flow (Ring 0 + Ring 1 + Ring 2) applied to risk-bearing decisions.

### Capability Layer: Agentic Observability (`agentic-observability.md`)
The unified monitoring, detection, and response layer. Three roles: quality monitoring (Ring 3 intelligence), security detection and response, governance compliance. The SIEM pattern applied to agentic workflows.

---

## Principles

- **Humility before authority.** We synthesize, we don't decree. Acknowledge what came before. Credit the work we build on. Admit what we don't know.
- **Rigor before opinion.** Every claim should be grounded in evidence, existing work, or clearly marked as a proposal. If we can't ground it, we say so.
- **Directionally accurate > precisely specified.** These concepts describe where things are going, not exactly how to get there.
- **First principles that endure > implementation details that change.** Focus on the "why it endures" reasoning, not the specific tech stack.
- **Iterate > perfect.** Ship the concept, pressure test it, update it. Don't wait for completeness.
- **Build informs theory, theory informs build.** Neither is upstream of the other. They're a loop.
- **One concept doc, many implementations.** A single primitive (e.g., Validation Loops) may be implemented differently across different systems. The concept is the constant; the implementations vary.
- **Community > credit.** If this framework helps one organization build a safer agentic system, it has served its purpose — regardless of whether we get credit for it.
