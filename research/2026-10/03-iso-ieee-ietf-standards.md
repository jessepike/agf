# 03 — ISO/IEC, IEEE, IETF, OpenID: Formal Standards Bodies

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** `docs/agentic-primitives.md` (ISO/IEC and IEEE table), `docs/governance-decision-record.md` (ISO 42001 clause mappings)

---

## Summary

ISO's AI management-system family is stable. 42001 has no revision, and there is still **no ISO agentic work item**. The new ISO content is the first AI security standard (27090) and a pipeline of oversight and logging standards that will matter for gate and GDR evidence. The real agent-specific standards action is at the **IETF**, which went from scattered individual drafts to an adopted WG document (AIMS in WIMSE) and a newly chartered agent-protocol working group in a single quarter.

## ISO/IEC

| Standard | Status (Oct 2026) | Confidence | Relevance to AGF |
|---|---|---|---|
| ISO/IEC 42001:2023 (AIMS) | Unchanged; no amendment registered. **EN ISO/IEC 42001:2026** approved by CEN 2026-03-13, text identical | Established | AGF's GDR maps to 42001 Clauses 7.5 and 8.1. No change needed |
| ISO/IEC 42005:2025 (AI system impact assessment) | Published 2025-05-28 | Established | Not cited by AGF. A natural anchor for AGF's Assess function |
| ISO/IEC 42006:2025 (requirements for AIMS certification bodies) | Published 2025-07-07 | Established | Tightens 42001 audits. Relevant to "evidence survives audit" claims |
| ISO/IEC DIS 42007 (conformity assessment schemes for AI systems) | DIS ballot (40.20) | Established | Future product-level conformity route |
| ISO/IEC AWI 42003 (42001 implementation guidance) | Preparatory (20.00) | Established | — |
| ISO/IEC 22989 Amd 1 / 23053 Amd 1 (generative AI) | Final draft (50.00). 22989 Amd text registered 2026-09-18 | Established | Vocabulary. Check whether "agent" is defined |
| **ISO/IEC 27090:2026** (AI security threats and compromises) | **Published** (reported Oct 2026). Guidance, not certifiable | Informed | First AI security standard: poisoning, evasion, inference, model theft, prompt/output injection mapped to CIA. AI-BOM and Zero Trust by design. Provider vs deployer roles. Not agent-specific |
| FDIS 42105 (human oversight), FDIS 24970 (AI system logging), TS 42119-3/-7/-8 (V&V, GenAI testing) | Final drafts | Informed | **42105 and 24970 are the likeliest future anchors for Governance Gates (#8) and GDR/observability evidence** |
| Agentic AI work item | **None found** | Informed | ISO has no agent-specific standard in its pipeline |

**Delta vs AGF:** AGF's "ISO/IEC and IEEE" table covers only 42001 and IEEE P2863. 27090 and the 42105/24970 pair are the material additions. AGF flagged Annex A controls as "not yet independently verified" (GEM-F02). That caveat still stands.

## IEEE

- **IEEE P2863** (organizational governance of AI) was listed as "finalizing 2026" in AGF. This research found no evidence of publication. — Open (not verified; check the IEEE SA status page)

## IETF: agent authentication and authorization

### 1. AIMS adopted as a WIMSE working-group document — Established
- `draft-ietf-wimse-aims-00` (2026-09-15), adopted by WIMSE 2026-09-09. "Best practices for authentication and authorization of AI agent interactions." It grew from `draft-klrc-aiagent-auth-00` (Mar 2026; Kasselman, Lombardo, Rosomakho, Campbell).
- Concepts: **agents as workloads** with their own identifiers, credentials, attestation, and lifecycle. Static API keys are an antipattern. Credentials are short-lived and rotated (SPIFFE as reference). There are three delegation models (user→agent, agent-on-own-behalf, agent→agent). **Transaction Tokens** carry downscoped per-operation authority. **Human-in-the-loop approval is treated as an authorization event via OpenID CIBA**, not a local UI click. Tamper-evident audit logs are a security control.
- **Delta vs AGF:** This is the closest standards-track analogue to AGF's identity-propagation and gate model. AGF Gate Resolutions (APPROVE/…/ESCALATE) and GDR authorization fields could reference CIBA-based approval and Transaction Tokens explicitly.

### 2. New working groups and BOFs — Established
- **`agentproto`** (Agent Communication Protocols): charter approved **2026-10-08**, no documents yet. Scope covers user-to-agent, agent-to-agent, and agent-to-tool interactions, including delegated authorization.
- **`dawn`** (Discovery of Agents With Names): proposed, charter in external review from 2026-10-09.
- **`audit`** (Agent Use of Delegation and Interaction Traceability): BOF approved 2026-10-08, no charter. **This is the first IETF effort aimed at agent delegation traceability, which is AGF's provenance (#6) and GDR territory.**
- **webbotauth:** `draft-ietf-webbotauth-httpsig-protocol-00` became a WG document 2026-09-01.
- OAuth WG: OAuth 2.1 still a WG draft (-16). Identity Chaining is in the RFC Editor queue. Transaction Tokens awaits write-up.
- 48 agent-titled individual drafts posted new versions in a single 10-day window (Sept 24–Oct 4). Notable: AAuth (-11), Mission-Bound Authorization, Delegate SD-JWT (adoption call closed 2026-10-12).

### 3. OpenID Foundation — Established
- **AuthZEN Authorization API 1.0** is Final. Working-group drafts include COAZ, a **COAZ-MCP binding**, an *Access Request and Approval Profile*, and a *Profile for Obligations*. The approval and obligations profiles are standards-track shapes for AGF's GATE→Gate Resolution flow and its MODIFY outcome.
- CAEP and RISC (Shared Signals) are Final (2025) and cited by AIMS for continuous revocation. This is relevant to Trust Ladder demotion and Security Response Bus containment.
- OIDF whitepaper *Identity Management for Agentic AI* (2025-10-07).

### 4. W3C — Informed
- Community groups on AI agent protocols and agent identity registries exist. They are not W3C Recommendations.

---

## Sources

- GAICC, ISO/IEC 42000 Series: Status of Each AI Standard in 2026 (status data 2026-10-05) — https://gaicc.org/blog/iso-42000-standards-family/
- ISO, ISO/IEC 42006:2025 — https://www.iso.org/standard/42006
- iTeh, EN ISO/IEC 42001:2026 — https://standards.iteh.ai/catalog/standards/cen/adc675e8-4669-4965-b4c1-c8f724832217/en-iso-iec-42001-2026
- PlayCISO, ISO 27090 Explained (2026), 2026-10-18 — https://playciso.com/blog/iso-iec-27090-ai-security-standard-what-ciso-should-do
- Hidekazu Konishi, Where AI Agent Authorization Standards Stand (statuses as of 2026-10-09) — https://hidekazu-konishi.com/entry/where_ai_agent_authorization_standards_stand.html
- IETF, draft-klrc-aiagent-auth-00 — https://www.ietf.org/archive/id/draft-klrc-aiagent-auth-00.html
- Khaled Zaky, The IETF is now working on agent authentication, 2026-03-07 — https://khaledzaky.com/blog/the-ietf-is-now-working-on-agent-authentication-here-is-what-that-means/
- IETF 126 WIMSE slides, AI Agent Authentication and Authorization — https://datatracker.ietf.org/meeting/126/materials/slides-126-wimse-aims-00
- IETF, draft-rosenberg-oauth-aauth-00 — https://www.ietf.org/archive/id/draft-rosenberg-oauth-aauth-00.html
- IETF, draft-oauth-ai-agents-on-behalf-of-user-02 — https://datatracker.ietf.org/doc/html/draft-oauth-ai-agents-on-behalf-of-user-02
- arXiv 2510.25819, Identity Management for Agentic AI (OpenID Foundation) — https://arxiv.org/abs/2510.25819
