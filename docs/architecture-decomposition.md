# AGF Architecture Decomposition — Design Spec

**Status:** Draft — Internal review complete (4→5 profiles, see below)
**Date:** 2026-03-18
**Purpose:** Define the hub-and-spoke document architecture for AGF: A Reference Architecture for Governed Agentic Systems

---

## The Problem

Governing agentic systems is a cross-functional challenge that no single team owns. Security teams need threat models and defensive architectures. Platform engineers need deployment patterns and infrastructure guidance. Compliance officers need regulatory mappings and audit evidence. AI engineers need implementation patterns and composition guidance. SREs need monitoring, detection, and response playbooks.

Today, these teams each stitch together fragments from NIST, OWASP, CSA, EU AI Act, and vendor documentation — often independently, often inconsistently, often missing the connections between their domains. A security architect's threat model doesn't reference the platform engineer's deployment mode. A compliance officer's EU AI Act mapping doesn't connect to the AI engineer's primitive implementation. An SRE's monitoring setup doesn't correlate with the security team's threat intelligence.

**The gap is not a lack of frameworks — it's a lack of a shared architecture that connects them.** AGF fills that gap. But to be useful across all five functions, it must be structured so that each team can go deep in their domain while seeing how their work connects to the whole.

This decomposition defines that structure.

## The Vision

**Hub and spoke.** One meta document (the hub) that shows the complete picture. Domain-specific profiles (the spokes) that give each audience exactly what they need. Deep-dive topics that can be consumed independently.

```
                    ┌──────────────────────────┐
                    │     THE META DOCUMENT     │
                    │                           │
                    │  AGF: A Reference         │
                    │  Architecture for         │
                    │  Governed Agentic Systems  │
                    │                           │
                    │  "The whole picture in     │
                    │   20 pages"               │
                    └────────┬─────────────────┘
                             │
          ┌──────────┬───────┼───────┬──────────┬──────────┐
          ▼          ▼       ▼       ▼          ▼          ▼
     ┌─────────┐ ┌──────┐ ┌─────┐ ┌──────┐ ┌─────────┐
     │Security │ │Plat- │ │ GRC │ │  AI  │ │Observ-  │
     │& Threat │ │form &│ │     │ │ Eng  │ │ability &│
     │Profile  │ │Infra │ │     │ │      │ │  Ops    │
     └─────────┘ └──────┘ └─────┘ └──────┘ └─────────┘
          │          │       │       │
          ▼          ▼       ▼       ▼
       Deep-dive  Deep-dive  ...   Deep-dive
       topics     topics           topics
```

---

## Layer 1: The Meta Document

**Title:** AGF: A Reference Architecture for Governed Agentic Systems
**Audience:** Everyone — executives, architects, newcomers, anyone who needs the whole picture
**Length target:** ~20 pages / ~8,000 words
**Tone:** Accessible but rigorous. A CTO and a compliance officer should both find it useful.

### Proposed Structure

#### 1. Why This Exists (1 page)
- The landscape is fragmented (NIST, OWASP, CSA, EU AI Act, OTel — all doing critical work, none connecting the dots)
- Agentic systems need purpose-built governance (not just AI governance applied to agents)
- This framework is a synthesis — we connect dots, we don't decree

#### 2. Core Concepts (2-3 pages)
- **The Rings Model** — the central architectural contribution
  - Ring 0 (Execution) → Ring 1 (Verification) → Ring 2 (Governance) → Ring 3 (Learning)
  - Cross-cutting Fabric
  - Environment Substrate (#19)
  - Ring Diagram (visual anchor — the image everyone remembers)
- **The 19 Primitives** — named, one-line descriptions, categorized
  - Runtime (#1-#17): the patterns that fire during agent execution
  - Lifecycle (#18): the gate before the gate
  - Substrate (#19): the operating environment beneath everything
- **Three-Level Security Model** — Fabric, Governance, Intelligence + Response Bus
- **Three Deployment Modes** — wrapper, middleware, graph-embedded (with the key insight: "the ring diagram is one mode, not THE architecture")

#### 3. How It Fits Together (2-3 pages)
- Composition patterns: Minimum Viable → Full Governed
- The self-improving loop: Ring 3 → Environment Optimization → validated by Ring 2 → deployed by #18
- Cost of governance: proportional activation, trust ladders as cost optimization
- The key tensions: governance vs. latency, optimization vs. integrity, oversight vs. autonomy

#### 4. Who Uses What (2 pages)
- Four domain profiles — overview of each, what they need, where to go for depth
- Profile selection guide: "I am a [role], I care about [concern], start with [profile]"
- Cross-profile touchpoints: where security and platform overlap, where GRC and AI engineering intersect

#### 5. Standards & Regulatory Alignment (2 pages)
- NIST AI RMF mapping (summary table)
- EU AI Act mapping (summary table)
- OWASP ASI + MCP mapping (summary table)
- CSA MAESTRO alignment (summary table)
- Singapore IMDA alignment (summary table)
- Full mappings live in the GRC Profile

#### 6. Existing Work & Positioning (1-2 pages)
- What we build on (NIST, OWASP, CSA, Anthropic, DeepMind, academic research)
- What we contribute (composition, rings, environment governance, tensions)
- Confidence levels: established / informed proposal / open question
- Living document commitment

#### 7. Where to Go Next (1 page)
- Profile index with audience and purpose
- Deep-dive topic index
- Community engagement (when ready)

---

## Layer 2: Domain Profiles

### Profile A: Security & Threat Modeling

**Title:** AGF Security Profile: Securing Governed Agentic Systems
**Audience:** CISOs, security architects, AppSec teams, red teams, SOC analysts
**Source material from primitives doc:**
- Three-level security model (full section)
- OWASP ASI threat mapping + responsibility matrix
- OWASP MCP Top 10 mapping
- Security Response Bus
- Zero trust posture + identity as control plane
- Context as attack surface (from #19 Agent Environment Architecture)
- Known Limitations (intelligence integrity, human oversight scaling)
- Adversarial Robustness (#15), Identity & Attribution (#14)

**Unique to this profile (not in meta):**
- Full threat-by-threat analysis with mitigations
- MCP-specific security patterns
- Red team scenarios and evaluation approach
- Incident response playbook structure
- Security monitoring correlation rules (from Observability doc)

**Format:** Threat model + architecture guide. Tables, matrices, decision trees.

**Key question for this audience:** "What are the threats to my agentic systems and how does this architecture defend against each one?"

---

### Profile B: Platform & Infrastructure

**Title:** AGF Platform Profile: Building and Deploying Governed Agent Infrastructure
**Audience:** Platform engineers, infrastructure architects, DevOps/MLOps, SREs
**Source material from primitives doc:**
- Ring Deployment Modes (full section — wrapper, middleware, graph-embedded)
- Mode Selection Matrix (the decision tool)
- Agent Environment Architecture (5-layer stack, composition patterns, optimization loop)
- Composability Interface (the contract)
- Cost of Governance + empirical benchmarks
- MCP integration patterns (middleware mode)
- Multi-agent coordination patterns
- Speculative execution bounds
- Checkpointing and recovery patterns

**Unique to this profile (not in meta):**
- Reference implementation patterns (how to wire MCP, how to implement gates)
- Environment-as-code patterns (GitOps for CLAUDE.md/instructions)
- Gateway configuration guidance (from Mode Selection Matrix)
- Operational runbooks: monitoring, scaling, incident response
- Performance budgets and latency analysis

**Format:** Architecture guide + implementation patterns. Diagrams, code-adjacent specs, decision matrices.

**Key question for this audience:** "How do I build and deploy this infrastructure?"

**Scope boundary:** Profile B covers build-time and deployment-time infrastructure. Runtime operations (monitoring, incident response, observability) belong to Profile E (Observability & Operations). The split mirrors Platform Engineering vs. SRE.

---

### Profile C: Governance, Risk & Compliance (GRC)

**Title:** AGF Compliance Profile: Regulatory Alignment and Governance Evidence
**Audience:** Compliance officers, risk managers, auditors, legal/privacy teams, DPOs
**Source material from primitives doc:**
- EU AI Act article mapping (full, tightened)
- NIST AI RMF function mapping (full, "agentic specializations of")
- NIST IR 8596 CSF 2.0 mapping
- Singapore IMDA alignment
- CSA MAESTRO layer mapping
- IEEE P2863 organizational governance bridge
- Governance Gates (#8) + human interface requirements
- Policy as Code (#9) + policy test harnesses
- Evaluation & Assurance (#18) + approval tiers
- Data Governance (#17) — PII, consent, retention, GDPR
- Provenance Chains (#6) — audit evidence
- Human oversight constraints (Engels et al. scaling principle)

**Unique to this profile (not in meta):**
- Control crosswalks: AGF primitive → NIST 800-53 control → ISO 27001 control → EU AI Act article
- Evidence generation guide: what audit artifacts does each primitive produce?
- Risk classification decision tree
- Governance maturity model with assessment criteria
- Template: "How to document your AGF compliance posture"

**Format:** Compliance crosswalk + evidence guide. Tables, checklists, assessment templates.

**Key question for this audience:** "How do I prove to a regulator/auditor that my agentic systems are governed?"

---

### Profile D: AI Engineering

**Title:** AGF Engineering Profile: Patterns for Building Governed Agents
**Audience:** AI engineers, ML engineers, prompt engineers, agent developers
**Source material from primitives doc:**
- All 19 primitives (full detailed patterns — this is where the primitives live in depth)
- Composition patterns (Minimum Viable → Full Governed)
- Primitive interaction tensions (all 7)
- Trust Ladders mechanics (#11)
- Agent Environment Governance (#19) — the practitioner's guide
- Environment Optimization Loop (the self-improving cycle)
- Existing work mapping (what to read, what tools to use)
- Open questions

**Unique to this profile (not in meta):**
- Implementation priority guide: which primitives to implement first
- Pattern catalog: each primitive as an implementable pattern with examples
- Anti-pattern catalog: common mistakes and how to avoid them
- Tool/framework mapping: which primitives are already implemented by MCP, AgentSpec, OpenShell, etc.
- Worked example: implementing a governed coding agent using AGF patterns

**Format:** Pattern catalog + implementation guide. Code-adjacent, example-driven.

**Key question for this audience:** "Which primitives do I implement first, and how?"

---

### Profile E: Observability & Operations

**Title:** AGF Observability Profile: Monitoring, Detecting, and Responding in Governed Agentic Systems
**Audience:** SREs, SOC analysts, detection engineers, platform reliability engineers, SecOps teams
**Source material:**
- Full `agentic-observability.md` (~33KB) — this is Profile E's primary source
  - SIEM-for-agents architectural concept
  - Event architecture (envelope, taxonomy, identity context)
  - Correlation engine (quality/security/governance rules)
  - Playbooks and response workflows
  - Zero trust monitoring
  - Observability maturity model
- From primitives doc:
  - Event-Driven Observability (#10) — the canonical primitive
  - Security Intelligence (Level 3 of the three-level model) — detection capabilities
  - Security Response Bus — the fast-path from detection to containment
  - Known Limitation #5: intelligence integrity

**Unique to this profile (not in meta):**
- The SIEM-for-agents concept — the unifying vision for agentic observability
- Canonical event architecture: envelope spec, event taxonomy, identity propagation
- Correlation engine: 18+ rules across quality, security, and governance domains
- Detection patterns: behavioral baselines, anomaly scoring, trust trajectory monitoring
- Operational playbooks: incident response, forensic investigation, containment workflows
- Observability maturity model with implementation tiers
- Sentinel architecture: fast-path (real-time anomaly) vs. slow-path (trend analysis)

**Format:** Operations guide + detection engineering reference. Correlation rules, playbook templates, maturity assessments.

**Key question for this audience:** "How do I see what my agents are doing and respond when they misbehave?"

**Scope boundary:** Profile E covers runtime operations — monitoring, detection, response, and continuous observability. Build-time infrastructure (deploying the observability stack) belongs to Profile B (Platform). Design-time threat modeling belongs to Profile A (Security). The boundaries mirror SOC analyst (E) vs. platform engineer (B) vs. security architect (A).

**Why this is a separate profile:** The event architecture is the single highest cross-cutting concern in AGF. Security, Platform, and GRC all consume the event stream. Without a canonical home for the event architecture, three profiles independently describe their piece of the stream, and the descriptions diverge within six months. Profile E owns the canonical event architecture; other profiles describe how they consume it.

---

## Cross-Cutting Content Rules

To prevent inconsistency across profiles, these topics have a single **canonical home** with cross-references everywhere else:

| Topic | Canonical Home | Other Profiles Reference It For |
|-------|---------------|-------------------------------|
| **Rings Model** | Meta document | All profiles — never re-explained, always linked |
| **19 Primitives** (detailed patterns) | AI Engineering Profile | Other profiles reference by number and name |
| **Trust Ladders** | AI Engineering (pattern mechanics) | Security (adversarial trust manipulation), Observability (trust trajectory detection), GRC (trust escalation audit evidence), Platform (trust infrastructure) |
| **MCP** | Security (MCP security), Platform (MCP integration), AI Engineering (MCP as protocol) | Each owns their angle; cross-reference the others |
| **Event Architecture** | Observability Profile (canonical spec) | Security (detection rules), GRC (compliance dashboards), Platform (operational monitoring) |
| **Provenance Chains** | AI Engineering (pattern), GRC (audit evidence), Security (tamper detection) | Each owns their angle with cross-reference |
| **Governance Gates** | AI Engineering (pattern), GRC (gate authority), Platform (gate infrastructure) | Each owns their dimension |

**Editorial rule:** If a profile needs to explain a cross-cutting concept for reader context, it provides a 2-3 sentence summary with an explicit link to the canonical home ("For the full treatment, see [X Profile], Section Y"). It does NOT reproduce the full explanation.

---

## Open Review Questions

### Resolved Questions

1. ~~Are four profiles the right number?~~ **Resolved: Five.** Internal review determined Observability & Operations is a legitimate 5th profile (distinct audience: SREs/SOC analysts; distinct question: "how do I see and respond"; owns the canonical event architecture). Business/Executive handled in meta document. Data/Privacy stays within GRC. Multi-Agent Coordination becomes a deep-dive topic off AI Engineering.

2. ~~Where does the Observability doc go?~~ **Resolved: Profile E.** The Agentic Observability doc becomes the primary source for Profile E (Observability & Operations). Security and Platform profiles cross-reference it for their consumption patterns.

### Open Questions

3. **Where does Decision Intelligence go?** It remains as its own deep-dive document, adjacent to AI Engineering (governed decision pattern) and GRC (decision audit trails). Not a profile.

4. **What's the right name for the meta document?** Working title: "AGF: A Reference Architecture for Governed Agentic Systems." Open for community feedback.

5. **Should the AI Engineering Profile contain the full primitives?** Or should the primitives remain as their own standalone document, with the AI Engineering Profile being a "how to implement" guide that references them? The risk of embedding: the primitives doc is the canonical reference, and embedding it in a profile makes the profile too long. The risk of referencing: AI engineers need the patterns inline, not behind a link. **Proposed resolution:** The AI Engineering Profile contains the full primitive catalog (it IS the primitives doc, refactored), with the meta document providing the summary-level primitive listing.

6. **Is "Agentic Governance Framework" the right brand?** Currently accepted as the working name. "Governance" is the differentiator. Open for external feedback — does the name attract or repel platform engineers?

7. **Profile naming convention** — Should profiles use a consistent naming pattern? Current proposals: "AGF [Domain] Profile" (e.g., "AGF Security Profile"). Alternative: "AGF for [Audience]" (e.g., "AGF for Security Teams"). The first is domain-oriented; the second is audience-oriented.

---

## Migration Path

This decomposition does NOT require rewriting from scratch. The content exists — it needs to be reorganized.

**Phase 1: Meta Document**
- Extract from: primitives doc (core concepts, composition patterns), framework doc (personas, lifecycle, governance functions)
- New content: profile selection guide, standards summary tables
- Outcome: the 20-page hub document

**Phase 2: First Profile (recommend Security)**
- Extract from: primitives doc (security architecture, OWASP mappings, MCP security)
- New content: threat-by-threat analysis, red team scenarios
- Reason to go first: security is the most self-contained domain, highest external demand, clearest audience

**Phase 3: Remaining Profiles**
- Extract + expand from primitives doc
- Each profile can be developed independently

**Phase 4: Primitives Doc Refactoring**
- Once profiles exist, the primitives doc becomes the AI Engineering Profile (or a referenced pattern catalog)
- Content that moved to profiles is replaced with cross-references
- The monolith shrinks to its natural scope

---

## What This Does NOT Change

- `intent.md` — still sacred, still the North Star
- The 19 primitives — still the shared vocabulary
- The Rings Model — still the central architecture
- The synthesis positioning — still "we connect dots"
- The review process — each profile gets its own review cycle
