# 05 — Cloud Security Alliance: AICM, ATF, MAESTRO, AARM, CSAI Foundation

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** `docs/relationship-to-frameworks.md` Layers 2–4 (MAESTRO, AICM v1.0.3 with 243 controls, ATF v1.0 as the operating model)

---

## Summary

CSA is consolidating into a **layered agentic governance stack of its own**. The pieces are a reference architecture, an "Agentic Control Plane" (ACP), ATF as the zero-trust operating model, MAESTRO for threats, AICM for controls, **AARM for runtime action management**, and STAR for AI for assurance, all housed under a new **CSAI Foundation**. The layering resembles AGF's seven-layer stack, but under one consortium. AICM's agent coverage did *not* grow in v1.1.

## Findings

### 1. AICM v1.1 — Established
- Detailed **2026-07-14**: **247 control objectives** across 18 domains (was 243). The four additions and refined wording come from syncing with CCM v4.1, in CCM-derived domains rather than AI-specific ones. AI-CAIQ grew to **320 questions**. IVS was renamed Infrastructure Security (I&S).
- **No new agent-specific controls** were identified (CSA Labs, 2026-07-30). Model Security (MDS-01–13) is unchanged.
- New **AIUC-1 mapping**, alongside EU AI Act, NIST AI RMF/600-1, ISO 42001, and BSI AIC4. "No gap" counts: BSI AIC4 210 (85%), ISO 42001 145 (59%), AIUC-1 70 (28%), EU AI Act 50 (20%), NIST AI RMF/600-1 18 (7%).
- **STAR for AI**: Level 1 is self-assessment to the registry. **Level 2 (third-party certification) is now available.**
- **Delta vs AGF:** `relationship-to-frameworks.md:57,125,134` cite AICM v1.0.3, 243 controls, and "5 of 243 agent-native." Update to v1.1/247. The thin-agentic-coverage observation **still holds and is now 5 of 247**. (The 5 named controls should be rechecked against the v1.1 text, since control IDs may have shifted.) — Open on control-ID stability

### 2. CSAI Foundation launched — Established
- Announced **2026-04-29** at the CSA Agentic AI Security Summit. A 501(c)(3) with the 2026 mission "Securing the Agentic Control Plane."
- Milestones:
  - **STAR for AI Catastrophic Risk Annex**: extends AICM/STAR to loss of human oversight and uncontrolled behavior. Four phases, June 2026 to Dec 2027.
  - **CVE Numbering Authority** status (initial scope: CSA's own tools). An AI Risk Observatory organizes agentic vulnerability coordination.
  - **AARM spec contributed** by Vanta (chair Herman Errico).
  - **ATF stewardship transferred** from Josh Woodruff (MassiveScale.AI), who continues leading development.

### 3. AARM — Autonomous Action Runtime Management — Established (existence and requirements via multiple sources); Informed (details)
- Open, vendor-neutral spec for **securing agent actions before they reach target systems** (arXiv 2602.09433, Feb 2026). Now a CSA working group (co-chairs Errico, Loomba, Kelley, Hughes).
- **Requirements:** R1 pre-execution interception (no fail-open) · R2 append-only hash-chained context accumulation (unclassified data defaults to highest sensitivity) · R3 policy evaluation with **intent alignment** (semantic drift from the original request) · R4 authorization decisions · R5 **tamper-evident signed receipts** · R6 identity binding (human, service, agent, session, role). R1–R6 are required for conformance. R7–R9 cover "comprehensive" runtime security.
- **Decision vocabulary:** `ALLOW · DENY · MODIFY · STEP-UP (human confirmation) · DEFER`.
- **Receipt fields:** action, context, identity, decision (result, matched policy, reason), approval (approver, decision, timestamp), deferral (reason, resolution), outcome, signature (Ed25519/ECDSA P-256/RSA-2048, offline-verifiable).
- Four implementation approaches: protocol gateway, SDK instrumentation, kernel eBPF (cannot reach full conformance alone, since it lacks semantic context), vendor integration.
- At least one vendor (Airia) claims AARM conformance. — Informed
- **Delta vs AGF (important):** AARM is the closest external analogue to AGF's **Gate Resolution enum + GDR**. AGF: `APPROVE / REJECT / MODIFY / DEFER / ESCALATE` with a GDR serializing decision, subject, inputs, rationale, authorization, and audit. AARM: `ALLOW / DENY / MODIFY / STEP-UP / DEFER` with a signed receipt over nearly the same fields. AARM is narrower (action-time only, no verification/learning rings) but **conformance-testable and consortium-backed**. AGF's GDR is not cited by AARM, and AARM is not cited by AGF. The two vocabularies are near-isomorphic (see `12`).

### 4. Agentic Control Plane (ACP) and ATF integration — Informed
- CSA artifact *Operationalizing the Agentic Control Plane: Integrating the Agentic Trust Framework*. Peer review closed **2026-07-10**, final document forthcoming. A sibling artifact integrates the AARM specification.
- Stack: CSA reference architecture (structure) → ACP (governance direction) → ATF (zero-trust operating model; Intern→Junior→Senior→Principal) → MAESTRO (risks ATF controls must address).
- ATF's GitHub home (massivescale-ai/agentic-trust-framework) remains public. No ATF v2 was found. — Open
- **Delta vs AGF:** AGF positions ATF as Layer 4 and itself as Layer 0. CSA's ACP now claims the "how the layers compose" role inside CSA's own family. AGF's differentiation narrows to cross-consortium synthesis (NIST, ISO, EU, OWASP, IETF), plus the Rings Model, verification/learning loops, and GDR.

### 5. MAESTRO — Informed
- No new MAESTRO version found. CSA (2026-10-15) published an open letter proposing MAESTRO as the "architecture axis" for Google DeepMind's AI Control Roadmap. That would yield a 3D control model (behavior × capability × architecture) with memory as a named control domain, explicit delegation semantics, monitor independence, and the CSA/OWASP 12 red-team categories as a minimum test catalog.

### 6. CSA research output volume — Informed
- CSA Labs publishes frequent research notes on agentic topics (NIST, Five Eyes, AEGIS, AIUC-1, EU AI Act, AISI incidents). Many are useful secondary sources, but they are not peer-reviewed standards. This research leans on several of them and labels those facts **Informed** unless corroborated.

---

## Sources

- CSA, AI Controls Matrix v1.1, 2026-07-14 — https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai
- CSA Labs, AICM v1.1: What Actually Changed for Model Security, 2026-07-30 — https://labs.cloudsecurityalliance.org/research/csa-research-note-aicm-v1-1-update-20260730-csa-styled/
- CSA, CSAI Foundation Announces Key Milestones to Secure the Agentic Control Plane, 2026-04-29 — https://cloudsecurityalliance.org/articles/csai-foundation-announces-key-milestones-to-secure-the-agentic-control-plane
- Redmond Magazine, CSA broadens agentic AI security work, 2026-05-05 — https://redmondmag.com/articles/2026/05/05/csa-broadens-agentic-ai-security-work-with-new-risk.aspx
- arXiv 2602.09433, Autonomous Action Runtime Management (AARM) — https://arxiv.org/abs/2602.09433
- CSA, AARM Working Group — https://cloudsecurityalliance.org/research/working-groups/autonomous-action-runtime-management-aarm
- Resilient Cyber (Chris Hughes), AARM and the case for standardizing, 2026-05-13 — https://resilientcyber.beehiiv.com/p/aarm-and-the-case-for-standardizing
- Vanta, Vanta donates AARM to CSA — https://vanta.com/resources/vanta-donates-aarm-to-csa
- Airia, Airia achieves AARM conformance — https://airia.com/blog/airia-achieves-aarm-conformance/
- CSA, Operationalizing the Agentic Control Plane: Integrating the ATF — https://cloudsecurityalliance.org/artifacts/operationalizing-the-agentic-control-plane-integrating-the-agentic-trust-framework
- CSA, Operationalizing the Agentic Control Plane: Integrating the AARM Specification — https://cloudsecurityalliance.org/artifacts/operationalizing-the-agentic-control-plane-integrating-the-aarm-specification
- CSA, MAESTRO Strengthens AI Security Roadmap (open letter to Google), 2026-10-15 — https://cloudsecurityalliance.org/blog/2026/10/15/i-love-google-s-agentic-ai-security-roadmap-adding-maestro-will-make-it-more-powerful-an-open-letter-to-google
- GitHub, massivescale-ai/agentic-trust-framework — https://github.com/massivescale-ai/agentic-trust-framework
