# AGF Cross-Concept Relationship Model

**Last updated:** 2026-03-18

---

## The Question

AGF produces three major concept areas: Agentic Primitives, Decision Intelligence, and Agentic Observability. How do they relate? Are they one product? Two? Three? A platform? Adjacent offerings?

---

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   AGF Reference Architecture                     │
│                   (19 Primitives, Rings Model)                   │
│                                                                  │
│  The shared foundation. Every capability layer builds on this.   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┼────────────────┐
              │            │                │
              ▼            ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────────┐
│   Decision       │ │   Agentic    │ │   Commercial         │
│   Intelligence   │ │ Observability│ │   Implementations    │
│                  │ │              │ │                      │
│ Governed Decision│ │ SIEM for     │ │ Risk Tools, Consulting│
│ Flows for risk-  │ │ Agents —     │ │ Custom governance     │
│ bearing decisions│ │ monitoring,  │ │ systems built on      │
│                  │ │ detection,   │ │ the framework         │
│ Ring 0+1+2       │ │ response     │ │                      │
│ applied to       │ │              │ │                      │
│ decisions        │ │ Event fabric │ │                      │
│                  │ │ + Ring 3     │ │                      │
│                  │ │ intelligence │ │                      │
└────────┬─────────┘ └──────┬───────┘ └──────────────────────┘
         │                  │
         │    ┌─────────────┘
         │    │
         ▼    ▼
    ┌──────────────┐
    │  Symbiotic    │
    │  Relationship │
    │              │
    │  DI produces  │
    │  decisions    │
    │  and emits    │
    │  events       │
    │              │
    │  AO consumes  │
    │  events for   │
    │  monitoring,  │
    │  security,    │
    │  and learning │
    └──────────────┘
```

---

## Relationship Types

### 1. AGF Primitives → Everything (Foundation)

The 19 primitives and Rings Model are the **shared vocabulary and architectural foundation** that all capability layers build on. They are not a product — they are the reference architecture.

- Decision Intelligence references primitives by number (#5, #6, #7, #8, #9, #14, etc.)
- Agentic Observability implements primitives (#10, #11, #15) and monitors all others
- Any commercial implementation selectively implements primitives appropriate to its use case

**Analogy:** The primitives are like TCP/IP — the protocol layer everything else runs on.

### 2. Decision Intelligence ↔ Agentic Observability (Symbiotic)

These are **distinct but symbiotic capability layers:**

| Dimension | Decision Intelligence | Agentic Observability |
|-----------|----------------------|-----------------------|
| **Core question** | How was this decision made? Was it governed? | Is this agent system behaving within governance boundaries? |
| **Ring focus** | Ring 0 + Ring 1 + Ring 2 (Governed Decision Flow) | Event fabric + Ring 3 intelligence + security monitoring |
| **Primary output** | Structured decision artifacts, provenance chains, decision memos | Event streams, correlation signals, audit packages, playbook triggers |
| **Value proposition** | Structured persistence of how decisions are made and why | Unified monitoring, detection, and response for governed agent systems |
| **Data relationship** | DI **produces** decisions and emits events | AO **consumes** those events for quality, security, and governance monitoring |

**The symbiosis:**
- Decision Intelligence is a primary **event source** for Agentic Observability
- Agentic Observability is the **security and quality monitoring layer** for Decision Intelligence
- DI needs AO to detect trust manipulation, evidence poisoning, and quality degradation in its decision pipeline
- AO needs DI-style structured events to correlate decision quality patterns across cases

**Key principle:** They are independently valuable. An organization can deploy Agentic Observability without Decision Intelligence (to monitor any agentic system). An organization can deploy Decision Intelligence without a dedicated Agentic Observability product (using the event fabric built into the primitives). But together, they are significantly more powerful.

### 3. Commercial Implementations (Applied Layer)

Products and services built on the framework:

| Implementation | Primary Composition Pattern | Primitives Used |
|---------------|---------------------------|----------------|
| **AI Risk Tools** (assessment pipeline) | Governed Decision Flow (DI, Ring 0+1+2) | #1, #2, #5, #6, #7, #8, #9, #10, #13, #14 |
| **Governance consulting** | Framework + profiles applied to client context | All primitives as assessment criteria |
| **Agent monitoring product** | Agentic Observability (event fabric + Ring 3) | #10, #11, #15, #3 |
| **Custom governance systems** | Variable — depends on client need | Selective primitives per use case |

---

## Product Strategy Implications

### One Platform vs. Separate Products

**The framework is one thing.** AGF — the reference architecture, the primitives, the profiles — is a unified publication. It is thought leadership and community contribution.

**The implementations may be separate products.** Decision Intelligence (a governed decision platform) and Agentic Observability (a monitoring/detection platform) serve different buyers, have different sales motions, and solve different problems. They share architecture but not necessarily packaging.

**The recommended approach:**
1. **Publish the framework as one unified body of work** — the reference architecture, primitives, profiles, and white papers. This is the thought leadership layer.
2. **Build products selectively** — each implementation focuses on one composition pattern and serves one buyer. The AI Risk Tools pipeline is a Decision Intelligence product. A pipeline observatory would be an Agentic Observability product.
3. **Let the framework create cross-sell** — an organization that adopts DI for risk decisions will naturally want AO for monitoring those decisions. The shared vocabulary and architecture make the bridge obvious.

### What They Share

| Shared Element | How It Manifests |
|---------------|-----------------|
| **Primitives vocabulary** | Both reference the same 19 patterns by number |
| **Rings Model** | Both use the same ring architecture |
| **Event envelope** | DI emits events in the same schema AO consumes |
| **Identity model** | Same identity context (#14) across both |
| **Policy as Code** | Same policy evaluation model (#9) |
| **Trust Ladders** | DI earns trust for decision agents; AO calibrates that trust |
| **Security posture** | Same three-level security model, same zero trust principles |

### What's Different

| Dimension | Decision Intelligence | Agentic Observability |
|-----------|----------------------|-----------------------|
| **Buyer** | Risk managers, compliance officers, governance leads | Platform engineering, SRE, SOC, CISO |
| **Problem** | "Our risk decisions are manual, slow, and poorly documented" | "We can't see what our agents are doing or prove they're governed" |
| **Moat** | Structured decision persistence — the accumulated graph of how an organization makes decisions | SIEM-for-agents intelligence — correlation across quality, security, and governance domains |
| **Revenue model** | Per-decision or per-case | Per-event-volume or per-agent |
| **Build complexity** | Higher (belief layer, RDG, multi-agent pipeline) | Medium (event ingestion, correlation, dashboards, playbooks) |

---

## The Relationship to the Governance Framework Doc

The top-level governance framework doc (`agentic-governance-framework.md`) describes the organizational operating model — five governance functions (Discover, Assess, Govern, Monitor, Evolve), agent lifecycle management, risk classification, persona model, enterprise integration.

**This sits above both DI and AO.** The governance framework is the organizational wrapper. DI and AO are capability layers that implement parts of it:

- **Discover + Assess** → informed by AO (what agents exist, what are they doing) and DI (risk assessment decisions)
- **Govern** → implemented by DI (governed decision flows) and the primitives (Ring 2, policy, gates)
- **Monitor** → implemented by AO (event-driven monitoring, detection, response)
- **Evolve** → implemented by Ring 3 (learning), Trust Ladders, and the environment optimization loop

---

*This document captures the architectural relationship between AGF's concept areas. For the reference architecture, see [AGF: A Reference Architecture](agf-reference-architecture.md). For the primitives foundation, see [Agentic Primitives](agentic-primitives.md).*
