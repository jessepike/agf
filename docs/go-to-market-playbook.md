# AGF Go-to-Market Playbook

**Date:** 2026-03-19
**Author:** Jesse Pike
**Status:** Draft — strategic direction

---

## The Goal

Make AGF the reference architecture that practitioners cite when they talk about governing agentic systems. Not the only framework — the one people reach for first.

---

## Phase 1: Make It Citable (Next 30 Days)

### 1.1 GitHub Repo Goes Public
- Clean README ✅ (done)
- CC BY 4.0 license ✅ (done)
- Enable GitHub Discussions (not Issues — Discussions for community, Issues for defects)
- Add topics/tags: `agentic-ai`, `governance`, `nist-ai-rmf`, `owasp`, `eu-ai-act`, `security-architecture`

### 1.2 Doc Site Live
- agf.jessepike.dev on Vercel
- Fumadocs (or GeistDocs if access opens) with all content converted
- Diagrams prominently featured — the Rings Model is the signature visual

### 1.3 Publish the White Papers
- **Trust Ladders** and **Rings Model** as standalone posts on jessepike.dev
- Cross-post to LinkedIn with the hero diagrams
- Submit to newsletters: The Batch, AI Snake Oil, Simon Willison's blog, Latent Space, The Pragmatic Engineer
- Tag OWASP, CSA, NIST on social — they'll see their frameworks cited positively

### 1.4 NIST CAISI RFI Response
- NIST's AI Agent Standards Initiative is actively soliciting public comment
- AGF directly addresses their questions about agent governance architecture
- A well-written response puts AGF in front of the standards body
- Creates a citable public record ("as submitted to NIST CAISI, March 2026")
- **This is the single highest-leverage action for institutional credibility**

### 1.5 EU AI Act Practitioner Push
- August 2026 high-risk deadline is 5 months away
- The GRC Profile with article-level mappings and control crosswalks is immediately useful
- Post in EU AI Act compliance communities, LinkedIn GRC groups
- Offer the maturity self-assessment as a free tool

---

## Phase 2: Make It Usable (60 Days)

### 2.1 Quick Assessment Tool
A single-page web tool on the doc site:
- 10 questions about your agentic system
- Output: current governance maturity level, recommended primitives, risk tier
- No auth, no backend — client-side only
- **This is the viral loop.** People take the assessment, share their score, link back to AGF.
- Mirrors the Vanta playbook: free assessment → gap visibility → framework adoption

### 2.2 Diagram Assets
- High-res PNG downloads for all 21 diagrams
- "Cite as" snippet with each diagram
- Embeddable versions for presentations
- People will use the Rings Model in their own decks and link back

### 2.3 OWASP Cross-Reference
- AGF maps every ASI threat to defense architecture
- Propose to OWASP to list AGF as a "related framework" on their Agentic Applications page
- Same strategy: ATT&CK got initial distribution through cross-references from existing frameworks

### 2.4 Contribution Guide
- How to propose a new primitive
- How to submit a regulatory mapping (new jurisdiction)
- How to report an accuracy issue
- Templates for each contribution type
- Clear review process

---

## Phase 3: Make It Collaborative (90 Days)

### 3.1 "Adopt and Report" Program
- Invite 5-10 organizations to adopt AGF for one agentic system
- They report back: what worked, what didn't, what's missing
- Their implementation experiences become case studies
- This is how NIST CSF grew — voluntary adoption with feedback

### 3.2 Conference Talks
- **RSA Conference** — "The Rings Model: A Concentric Architecture for Governing AI Agents"
- **BSides** — Red team scenarios from the Security Profile
- **AI Engineer Summit** — "19 Primitives: What Every AI Engineer Should Know About Governance"
- **GRC conferences** — EU AI Act compliance with AGF crosswalks
- **NIST workshops** — If the CAISI RFI response gets traction

### 3.3 Academic Collaboration
- The "Premise Governance" paper (Airbnb/Intuit, Feb 2026) independently validates the Belief Layer
- Reach out to those researchers for co-citation or collaboration
- Academic validation is how frameworks become canonical

### 3.4 Standards Body Engagement
- NIST CAISI: participate in working groups, not just submit comments
- OWASP: propose AGF alignment as supplementary guidance
- CSA: Trust Ladders alignment with ATF is a natural collaboration point
- OpenTelemetry: propose governance extensions as a SIG or semantic convention

---

## The AGF ↔ AI Risk Tools Connection

### How They Relate

```
AGF (Reference Architecture)          AI Risk Tools (Commercial Product)
"Here's how to govern agents"    →    "Here's a tool that does the governing"

Framework / Thought Leadership         Product / Revenue
Open source, CC BY 4.0                Commercial license
Community adoption                     Paying customers
Credibility + citation                 Revenue + customer data
```

**AGF is the standard. AI Risk Tools is the implementation.**

This is the same relationship as:
- NIST CSF (framework) → CrowdStrike/Palo Alto (products)
- OWASP Top 10 (framework) → Snyk/Veracode (products)
- TOGAF (architecture) → Sparx/Archi (tools)

### The Flywheel

```
AGF published → Practitioners discover it →
They need tools to implement it → AI Risk Tools is the natural answer →
Customer implementations validate AGF → AGF gets stronger →
More practitioners discover it → More customers
```

### Specific Connection Points

| AGF Concept | AI Risk Tools Implementation |
|-------------|------------------------------|
| Risk Classification (4 tiers) | The assessment intake classifies systems into AGF risk tiers |
| Regulatory Mapping (EU AI Act, NIST) | The pipeline maps to the same frameworks AGF references |
| Governance Evidence | The assessment output IS the evidence AGF says primitives should produce |
| Maturity Assessment | The Quick Assessment tool shows where you are on AGF's maturity model |
| Composition Patterns | The tool recommends which AGF primitives to implement based on your risk tier |

### The GRC Manager Agent Opportunity

Your idea for a "Head of GRC" agent with composable workflows is the natural next step:

**What it would do:**
- Continuous compliance monitoring (not point-in-time assessments)
- Maps to AGF primitives: Event-Driven Observability (#10), Policy as Code (#9), Trust Ladders (#11)
- Composable workflows: regulatory change monitoring, control attestation, evidence collection, audit readiness
- Integrates with the assessment engine as the "how you got here" and provides "where you go next"

**How it ties to AGF:**
- The GRC Manager Agent IS a governed agentic system — it should be governed by AGF's own architecture
- Ring 0: the agent performs GRC workflows
- Ring 1: verification of compliance determinations
- Ring 2: governance gates for material findings (human-in-the-loop for high-stakes determinations)
- Ring 3: learns from audit outcomes, regulatory changes, organizational context
- **AGF governs the tool that implements AGF** — this is the recursive proof point

### Other Opportunities

| Opportunity | AGF Anchor | Revenue Model |
|-------------|-----------|---------------|
| **Assessment-as-a-Service** | Risk classification + maturity model | Per-assessment ($74) or subscription ($399/mo) |
| **GRC Manager Agent** | Full governed decision flow (Ring 0-2) | SaaS subscription |
| **Consulting playbooks** | AGF profiles as engagement frameworks | Consulting IP (packaged assessments) |
| **Training/certification** | AGF maturity model as curriculum | Course fees, certification |
| **Audit readiness packages** | GRC Profile crosswalks + evidence guide | Per-engagement |
| **Agent governance review** | Security Profile red team scenarios | Advisory engagement |
| **Implementation guidance** | AI Engineering Profile 5-phase roadmap | Consulting retainer |

### Sequencing Recommendation

1. **Now:** Assessment engine (already built) + AGF published (credibility)
2. **Month 1-3:** Assessment-as-a-Service live + consulting playbooks using AGF profiles
3. **Month 3-6:** GRC Manager Agent (composable workflows, continuous monitoring)
4. **Month 6-12:** Training/certification on AGF + expanded agent fleet

The assessment engine is the wedge. AGF is the credibility. The GRC Manager Agent is the platform play. Each step funds the next.

---

## What Makes This World-Class

1. **Living proof.** AGF's repo demonstrates the rigor it preaches — open commit history, public review process, transparent decisions, versioned with changelogs.

2. **Implementation evidence.** The assessment pipeline is the first AGF implementation. Publish the results: latency, quality improvement, cost. The framework graduates from theory to evidence.

3. **Community velocity.** Stars, forks, discussions. External PRs adding regulatory mappings for jurisdictions you haven't covered. The framework becomes a living standard when the community contributes faster than you alone.

4. **Institutional recognition.** One NIST citation, one OWASP cross-reference, one CSA acknowledgment changes the credibility calculus for every enterprise evaluator.

5. **The recursive proof.** The GRC Manager Agent governed by AGF, implementing AGF, for customers who adopted AGF. The framework governs its own implementation. That's the story that makes people pay attention.

---

*This playbook is a living document. Review and update quarterly as market conditions and traction data evolve.*
