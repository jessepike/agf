# 01 — US Federal: NIST, CAISI/CAISSI, CISA/NSA

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** `docs/agentic-primitives.md` (NIST table), `docs/agentic-governance-framework.md` §NIST Agent Security & Identity

Confidence labels follow AGF's gradient: **Established** (primary source or multiple agreeing sources), **Informed** (single or secondary source), **Open** (speculative or unresolved).

---

## Summary

The federal agent-standards picture moved from "initiative announced" (AGF's Feb 2026 snapshot) to "first outputs, no binding standard." NIST published its RFI analysis, the agent identity work found its first implementation use case, and the agent-specific SP 800-53 overlays still have no draft. Two developments change how AGF should *cite* NIST: an executive order renamed "AI" to "Super Intelligence" across executive-branch documents, and the COSAiS overlay project and CAISI itself appear under new names. Separately, the Five Eyes agencies published the first multi-government agentic AI security guidance, which is now the most quotable government baseline for deployers.

## Findings

### 1. RFI analysis published as NIST 800-5 — Established
- *Summary Analysis of Responses to the Request for Information Regarding Security Considerations for AI Agents*, **NIST 800-5** (Trustworthy and Responsible AI series), published **2026-05-18**. Authors: Riggs, Hamin, Perry, Edelman, Cihon.
- Findings: agents bring new threats that slow adoption; "fundamental cybersecurity principles and practices remain relevant" but need adjusting; respondents want implementation guidance, information sharing, and standards promotion from government.
- **Delta vs AGF:** AGF cites the Jan 2026 RFI and the Feb 2026 initiative launch. The RFI's outcome reinforces AGF's "extend existing controls, don't invent a parallel stack" posture.

### 2. Agent-specific SP 800-53 overlays: still no draft — Established
- The COSAiS project lists five use cases, including **Single Agent** and **Multi-Agent** overlays. Only the Predictive AI annotated outline (Jan 2026) has been published. No date for the agent overlays.
- Secondary analysis (CSA, Forkast) expects finalized agent-specific standards **no earlier than 2027**. — Informed
- **Rename:** on **2026-10-20** the project page was renamed **COSIS — Control Overlays for Super Intelligence Systems**, citing the Sept 29 executive order. Existing publications are unchanged. — Established (NIST project page)

### 3. Executive Order 14434, "Inaugurating the Era of Super Intelligence" — Established
- Signed **2026-09-29**. Directs executive agencies to use "Super Intelligence"/"SI" instead of "Artificial Intelligence"/"AI" in non-statutory documents. The Assistant to the President for Science and Technology must propose a federal definition (CSA reads §3(b) as due ~2026-11-28) and assess whether it should modify the statutory AI definition (15 U.S.C. § 9401(3)).
- It creates no private-sector obligations and does not revise the AI RMF.
- NIST pages now reference the **Center for Advancing Innovation and Standards for Super Intelligence (CAISSI)**, apparently the former CAISI. CSA found no formal rename announcement. — Informed
- **Delta vs AGF:** AGF cites "CAISI" and "AI RMF" by landing-page names. Citations should pin versioned document numbers (AI 100-1, AI 600-1, NIST 800-5, IR 8596) rather than program names that are now unstable. **Open:** whether the §3(b) definition diverges from the statutory one and changes which systems federal programs cover.

### 4. NCCoE agent identity: first implementation use case — Established
- The Feb 2026 concept paper (*Accelerating the Adoption of Software and AI Agent Identity and Authorization*) names OAuth 2.0/2.1, OIDC, SPIFFE/SPIRE, SCIM, NGAC, and MCP as the building blocks.
- Sept 2026: the NCCoE DevSecOps project and the Agent Identity team plan a **joint implementation**, with DevSecOps (Build 3, agentic code development) as the **first use case** for agent identity. Webinar 2026-10-28; DevSecOps live-document comments open until **2026-11-09**. No draft SP or timeline yet.
- **Delta vs AGF:** Primitive #14 (Identity & Attribution) already cites the concept paper. Nothing to change in the claims, but the coding-agent use case is new and relevant to AGF's hooks/middleware-mode material (see `07-runtime-control-hooks-guardrails.md`).

### 5. Listening sessions (healthcare, finance, education) — Informed
- Virtual sessions began April 2026. No published findings as of this research.

### 6. NSA/NIST/CISA incident readiness for "SI" training and evaluation — Informed
- *Key Practices for Incident Readiness and Response in Super Intelligence Training and Evaluation*: 10 practices across preparation, detection, response, recovery, and reporting, aimed at developers testing capable models with reduced safeguards. Excludes adversarial attacks (prompt injection, malware) from its incident definition. Reported 2026-10-26; issue date not confirmed from a primary source.
- Context: written after the summer's evaluation-containment incidents (see `10-incidents-and-industry-shifts.md`).

### 7. Five Eyes: *Careful Adoption of Agentic AI Services* — Established
- Published **2026-05-01** by CISA, NSA, NCSC-UK, Canadian Centre for Cyber Security, ASD's ACSC, and NCSC-NZ. ~30 pages, 100+ recommendations, organized across design, develop, deploy, operate.
- **Five risk categories:** privilege, design and configuration, behavioral, structural, accountability.
- Key positions: assume agents will behave unexpectedly (favor reversibility and containment); a distinct cryptographic identity per agent with short-lived credentials; task-scoped least privilege with quarterly review; human approval for persistent, irreversible, or sensitive actions *defined in advance by designers, not by the agent*; log the full decision and tool-call sequence; prompt injection as the most persistent threat; a **named human owner per agent**; incremental rollout; extend existing zero-trust and identity programs instead of building parallel governance.
- **Delta vs AGF:** AGF doesn't cite it yet. It is close to a one-to-one validation of Bounded Agency (#7), Governance Gates (#8; mandatory gates on irreversible actions), Identity & Attribution (#14), Event-Driven Observability (#10), Transaction & Side-Effect Control (#16), and the MVC "start small" composition pattern. Its "build on existing programs" line matches AGF's synthesis stance. This is the strongest government anchor available for AGF's crawl-stage guidance.

### 8. Financial-sector model risk: SR 11-7 superseded, agentic AI carved out — Informed
- **SR 26-2** (Federal Reserve), OCC Bulletin 2026-13, and FDIC FIL-15-2026 replaced SR 11-7 (and SR 21-8) effective **2026-04-17**.
- Footnote 3 puts **generative and agentic AI out of scope** as "novel and rapidly evolving" and leaves governance of those tools to each bank's own risk-management practices. The agencies said an RFI on model risk management, including AI, would follow. None had appeared as of Sept 2026.
- **Delta vs AGF:** Any AGF or adopter material that assumes agentic systems are classified under SR 11-7 model-risk tiers is stale. Banks now have a regulatory vacuum for agents, which raises the value of a self-standing governance architecture and lowers the value of "fits your existing MRM tiering" arguments. **Open:** what the promised RFI covers.

---

## Sources

- NIST, Summary Analysis of Responses to the RFI Regarding Security Considerations for AI Agents (NIST 800-5), 2026-05-18 — https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai
- NIST CSRC, COSAiS/COSIS project page (accessed 2026-10-28) — https://csrc.nist.gov/projects/cosais
- White House, Fact Sheet: Inaugurating the Era of Super Intelligence, 2026-09 — https://www.whitehouse.gov/fact-sheets/2026/09/fact-sheet-president-donald-j-trump-inaugurates-the-era-of-super-intelligence/
- White House, Presidential action — https://www.whitehouse.gov/presidential-actions/2026/09/inaugurating-the-era-of-super-intelligence/
- CSA Labs, EO 14434 and CAISSI: Mostly a Rebrand, With One Provision to Watch, 2026-10-07 — https://labs.cloudsecurityalliance.org/research/csa-research-note-eo14434-super-intelligence-caissi-20261007/
- Arnold & Porter, What's in a Name?, 2026-10 — https://www.arnoldporter.com/en/perspectives/blogs/enforcement-edge/2026/10/whats-in-a-name
- CSA Labs, NIST AI Agent Standards: Listening Sessions and Emerging Controls, 2026-04-16 (mod. 2026-05-20) — https://labs.cloudsecurityalliance.org/research/csa-research-note-nist-ai-agent-standards-20260416-csa-style/
- Forkast, Three Months to NIST, 2026-09-27 — https://forkast.news/three-months-to-nist-the-federal-ai-agent-standards-deadline-arrives-with-no-enforceable-framework/
- NIST, New NCCoE Resources on DevSecOps and October 28 Webinar on Agentic AI, 2026-09 — https://www.nist.gov/news-events/news/2026/09/new-nist-nccoe-resources-devsecops-and-october-28-webinar-agentic-ai
- Paubox, NSA, NIST, and CISA Issue Guidance for Managing Rogue AI Agents, 2026-10-26 — https://paubox.com/blog/nsa-nist-and-cisa-issue-guidance-for-managing-rogue-ai-agents
- CSA Labs, Five Eyes Agentic AI Guidance: Enterprise Compliance Baseline, 2026-05 — https://labs.cloudsecurityalliance.org/research/csa-whitepaper-five-eyes-agentic-ai-guidance-analysis-202605/
- Mayer Brown, Multi-Agency Guidance on Securing Agentic AI Systems, 2026-06-10 — https://www.mayerbrown.com/en/insights/publications/2026/06/multi-agency-guidance-on-securing-agentic-ai-systems
- Govern365, SR 11-7 and AI: The Words That Changed in April 2026 — https://govern365.ai/blogs/model-risk-management/
