# 06 — New Frameworks, Adjacent Frameworks, and Competitors

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** AGF positions itself as "Layer 0 substrate" beneath OWASP, CSA, ISO, NIST, and runtime references (`docs/relationship-to-frameworks.md`)

---

## Summary

The field AGF synthesizes grew by at least six significant frameworks since May. They fall into three groups:

1. **Certifiable control standards** with insurer and auditor pull (AIUC-1).
2. **Analyst and government control baselines** (Forrester AEGIS, Five Eyes guidance).
3. **Frontier-lab "AI control" frameworks** that treat agents as potential insider threats (Google DeepMind AI Control Roadmap).

Plus runtime specs (AARM, OWASP ACS) and an analyst category (Gartner "guardian agents"). Several now publish **their own crosswalks**, which erodes "the only synthesis layer" as a differentiator. None of them covers AGF's full span (verification and learning loops, gate vocabulary + decision record, deployment modes, tensions).

## Comparison table

| Framework | Owner | Type | Date / version | Openness | Overlap with AGF | Confidence |
|---|---|---|---|---|---|---|
| **AIUC-1** | AI Underwriting Co. + consortium (200+ security leaders) | Certifiable control standard: 51 requirements, 130 controls, 6 pillars | Quarterly. Q2 2026 effective 2026-04-15. July 2026 release shipped | Published standard. Accredited auditors (Schellman first) | Controls layer. MCP/A2A security, identity separated from access, third-party monitoring | Established |
| **Forrester AEGIS** | Forrester (Jeff Pollard) | Controls framework: 39 controls, 6 domains | Aug 2025. Procurement-method extension 2026-08-21 | Proprietary | "Least agency," approval gates, intent monitoring, governance board, 12–18 month phased rollout | Informed |
| **Five Eyes — Careful Adoption of Agentic AI Services** | CISA, NSA, NCSC-UK, CCCS, ASD ACSC, NCSC-NZ | Government guidance: 100+ recommendations, 5 risk categories | 2026-05-01 | Public | Very high. Validates #7, #8, #10, #14, #16 and the MVC posture (see `01`) | Established |
| **Google DeepMind AI Control Roadmap v0.1** | Google DeepMind | Internal-deployment control framework | 2026-06-18 | Public paper | Ring 1 verification and Security Intelligence. Capability-scaled monitoring | Established |
| **AARM** | CSA / CSAI Foundation (from Vanta) | Runtime action-management spec with conformance | Feb 2026 paper. CSA WG since Apr 2026 | Open | Gate Resolution + GDR near-isomorph (see `05`) | Established |
| **OWASP Agent Control Standard (ACS)** | OWASP (from Zenity) | Runtime hook-surface standard | v0.1.0. OWASP debut 2026-09-01 | MIT | Middleware/Interrupt deployment mode hook points (see `04`, `07`) | Informed |
| **Gartner Market Guide for Guardian Agents** | Gartner | Market category definition | 2026-02-25 | Paywalled | Ring 1/Ring 3 supervision products | Established |
| **CoSAI agentic workstream** | OASIS Coalition for Secure AI | Guidance papers | Jan–May 2026 | Open | MCP security, agentic IAM, shared responsibility | Established |
| **MITRE ATLAS agentic techniques** | MITRE | Adversary technique KB | Early 2026 | Open | Threat layer (AML.T0104, AML.T0110) | Informed |

## Detail

### AIUC-1 — the certifiable competitor
- Launched mid-2025 with input from 100+ Fortune 500 CISOs. Updated **quarterly**: Q1 2026 modified 26 requirements and added 40+ voice controls. **Q2 2026** (effective 2026-04-15) modified 14 requirements and added 23 controls, covering MCP/A2A authentication, transport, message integrity, and runtime containment; tool-call validation extended to MCP servers; **identity and access split into separate domains**; mandatory third-party access monitoring; and a move from screenshot evidence to verifiable documentation.
- Certifications include ElevenLabs (first), UiPath (first enterprise automation platform, Mar 2026), Intercom, and Sierra. Certification windows reported at 3–10 weeks. Co-publishes with OWASP AIVSS, and CSA AICM v1.1 maps to it.
- **Why it matters:** it is the first agent standard tied to **insurance underwriting**, which gives it commercial pull that reference architectures don't have. **Delta vs AGF:** AGF has no AIUC-1 crosswalk. AIUC-1 occupies "Layer 3 control catalog with certification" and is agent-native, unlike AICM.

### Forrester AEGIS
- 39 controls across GRC, IAM (agents as a "hybrid identity class"), Data Security & Privacy, AppSec/DevSecOps, Threat Management/SecOps, and Zero Trust. Every control maps to NIST AI RMF and ISO 42001, and 15 also map to EU AI Act, OWASP LLM Top 10, and MITRE ATLAS. Forrester says AEGIS "operationalizes" the Five Eyes guidance, which is Forrester's own claim.
- **Delta vs AGF:** AEGIS's "intent monitoring" (is behavior still within authorized purpose?) and AARM's "intent alignment" are the same idea. AGF has no named intent-drift construct. The nearest are Bounded Agency (#7) and Security Intelligence anomaly detection.

### Google DeepMind AI Control Roadmap
- Treats internal agents as potentially misaligned insiders. Threat model built on MITRE ATT&CK. **Detection levels D1–D4** keyed to the model's ability to evade oversight. **Prevention/response levels R1–R3** keyed to attack capability: asynchronous review for low-risk reversible actions, synchronous blocking for high-risk ones. Metrics: coverage, recall, time-to-response.
- Evidence: about 1M coding-agent trajectories, with most flagged events from over-eagerness or misinterpretation rather than malice. Feeds a live monitor for the Gemini Spark agent. Companion paper: *Three Layers of Agent Security*.
- **Delta vs AGF:** this is a capability-scaled version of AGF's tempo taxonomy (wire-speed vs near-realtime vs human-speed) and Producer-Verifier Separation. "Monitor independence" (CSA's proposed addition) is AGF Primitive #1 by another name. Strong external validation, but neither cites the other.

### Gartner "guardian agents"
- First Market Guide **2026-02-25**: "Guardian agents supervise AI agents, helping ensure agent actions align with goals and boundaries." Deployments are mostly pilots. Six delivery approaches: standalone oversight platforms, AI/MCP gateways, embedded runtime modules, orchestration-layer extensions, hybrid edge-cloud, and coordination mechanisms (standards, APIs, hooks), which Gartner calls immature because standard interfaces are lacking.
- **Delta vs AGF:** "guardian agent" is now the buyer-side term for what AGF calls Ring 1 verification plus Security Intelligence. Gartner's six approaches map loosely onto AGF's three deployment modes (gateway ≈ middleware; embedded ≈ graph-embedded; standalone ≈ wrapper/observer).

### CoSAI (OASIS)
- 2026 publications: *MCP Security* (Jan), *The Future of Agentic Security: From Chatbots to Autonomous Swarms* (Mar), *Agentic Identity and Access Management* (Apr), *AI Shared Responsibility Framework* (May). Upcoming: MCP Security Guidance v2 and Zero Trust for AI Systems. Workstream 4 runs SIGs on the agent development lifecycle and agent credentials.

### MITRE ATLAS
- The early-2026 agentic update added **AML.T0104 Publish Poisoned AI Agent Tool** and **AML.T0110 AI Agent Tool Poisoning**. AML.T0010 AI Supply Chain Compromise was also highlighted. ATT&CK-style adversary modeling of agents is also the basis of DeepMind's roadmap.

## What this means for AGF's positioning (observations, not roadmap)

- **Crowding at Layers 3–5.** AIUC-1 (certifiable controls), AARM and ACS (runtime specs), and vendor control planes (see `10`) now occupy space that AGF described as gaps. — Informed
- **Crosswalks are commoditizing.** OWASP, AICM, AIUC-1, and AEGIS each publish mappings. AGF's synthesis is distinctive only where it crosses consortium lines and adds architecture: rings, signals, GDR, and tensions. — Informed
- **Convergent vocabulary.** "Least agency," "intent alignment/monitoring," "guardian agents," "agentic control plane," "receipts." AGF uses none of these terms. — Established (term usage); Open (whether AGF should adopt them)

---

## Sources

- CSA Labs, AIUC-1 Q2 Refresh: MCP Security and Agent Identity Controls — https://labs.cloudsecurityalliance.org/research/csa-research-note-aiuc1-agentic-ai-security-standard-q2-2026/
- Drata, AIUC-1 Version Update: July 2026 — https://drata.com/updates/aiuc-1-version-update-july-2026
- Futurum, Sierra's AIUC-1 Certification — https://futurumgroup.com/?p=95694
- IT Brief Australia, UiPath secures AIUC-1 certification — https://itbrief.com.au/story/uipath-secures-landmark-aiuc-1-certification-for-ai-agents
- FourWeekMBA, AIUC's 3-to-10-Week Certification Window — https://fourweekmba.com/ai-aiuc-certification-timeline-insurable-ai/
- CSA Labs, Forrester's AEGIS Framework: A Controls Baseline for Agentic AI, 2026-08 — https://labs.cloudsecurityalliance.org/research/csa-research-note-forrester-aegis-agentic-ai-controls-202608/
- Forrester, Five Eyes … Guidance Operationalized By AEGIS — https://www.forrester.com/blogs/five-eyes-cybersecurity-agencies-careful-agentic-ai-adoption-guidance-operationalized-by-aegis/
- Google DeepMind, Securing the future of AI agents, 2026-06-18 — https://deepmind.google/blog/securing-the-future-of-ai-agents/
- Axios, Google DeepMind prepares for rogue AI agents, 2026-06-18 — https://axios.com/2026/06/18/google-deepmind-prepares-for-rogue-ai-agents
- The Hacker News, 5 Learnings from the First-Ever Gartner Market Guide for Guardian Agents, 2026-03-24 — https://thehackernews.com/2026/03/5-learnings-from-first-ever-gartner.html
- CoSAI, Year 2: The Future of Agentic Security — https://www.coalitionforsecureai.org/cosai-year-2-the-future-of-agentic-security/
- CoSAI, Unveils Agentic Identity and Security Research Following RSAC 2026 — https://www.coalitionforsecureai.org/announcements/cosai-unveils-agentic-identity-and-security-research-following-high-profile-sessions-at-rsac-2026/
- DEV, MITRE ATLAS Now Has Agentic Attack Techniques — https://dev.to/brennhill/mitre-atlas-now-has-agentic-attack-techniques-3815
- Zenity, MITRE ATLAS AI security — https://zenity.io/blog/mitre-atlas-ai-security
