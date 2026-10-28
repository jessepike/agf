# 04 — OWASP GenAI Security Project

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** OWASP Agentic Top 10 (ASI01–ASI10) as Layer 1 threat baseline in `docs/relationship-to-frameworks.md`. OWASP MCP Top 10 noted as "living/beta as of March 2026" in `docs/agentic-primitives.md`

---

## Summary

The **Agentic Top 10 itself is unchanged.** The Dec 2025 edition (ASI01–ASI10) is still current, so AGF's Layer 1 baseline is intact. Around it, OWASP shipped a revised LLM Top 10 for 2026, took in a **runtime control standard (ACS)** that competes directly with AGF's deployment-mode and gate territory, published a Top 10 for **agent skills**, advanced AIVSS scoring, and started a quarterly exploit roundup that maps real incidents to ASI categories.

## Findings

### 1. Top 10 for Agentic Applications (2026 edition) — Established
- Published 2025-12-09. No revision found through Oct 2026. Categories: ASI01 Agent Goal Hijack · ASI02 Tool Misuse & Exploitation · ASI03 Identity & Privilege Abuse · ASI04 Agentic Supply Chain · ASI05 Unexpected Code Execution · ASI06 Memory & Context Poisoning · ASI07 Insecure Inter-Agent Communication · ASI08 Cascading Failures · ASI09 Human-Agent Trust Exploitation · ASI10 Rogue Agents. It introduces the "least agency" principle.
- "Least agency" is now echoed by Forrester AEGIS and Five Eyes guidance (see `06`). The term is becoming industry vocabulary.

### 2. Top 10 for LLM Applications 2026 — Established
- Released **2026-09-01/02**, with updated rankings based on "thousands of real-world AI security incidents." **Excessive Agency is now #3.** It maps to NIST, MITRE ATLAS, CWE, and the Agentic Top 10. Full list not retrieved for this research.
- OWASP also released a *GenAI Security Industry Framework Crosswalk* that maps OWASP guidance to security, risk, and compliance frameworks. — Established
- **Delta vs AGF:** OWASP now publishes its own crosswalk, which overlaps AGF's synthesis role for the OWASP slice. **Open:** how AGF's crosswalks should reference or reuse it.

### 3. Agent Control Standard (ACS) joins OWASP — Established (existence); Informed (details)
- Originally built by **Zenity**, launched May 2026 under MIT, and donated to OWASP. It debuted under the GenAI Security Project on **2026-09-01**. Pillar Security contributed to ACS v0.1.0.
- Purpose: make agents "inspectable, traceable and instrumentable." It defines **how agent platforms expose middleware hooks** and how declarative, portable safety policies are enforced at runtime across frameworks.
- **Delta vs AGF:** ACS standardizes the hook surface that AGF's Middleware/Interrupt deployment mode assumes but does not specify. Where AGF defines *what* signals cross the boundary (PASS/REVISE/HALT/GATE/DELEGATE/ERROR) and *what* gets recorded (GDR), ACS defines *where* the interception points are. These are complementary. See `07` and `12`.

### 4. Agentic Skills Top 10 v1.0 — Informed
- Released **2026-08-17** (post-Black Hat/DEF CON). AST01 Malicious Skills · AST02 Supply Chain Compromise · AST03 Over-Privileged Skills · AST04 Insecure Metadata · AST05 Untrusted External Instructions · AST06 Weak Isolation · AST07 Update Drift · AST08 Poor Scanning · AST09 No Governance · AST10 Cross-Platform Reuse.
- Context: Agent Skills became an AAIF-hosted open standard on 2026-10-22 (see `08`).
- **Delta vs AGF:** skills are an L3 Capability Set component in AGF's Environment Stack (#19). AGF covers MCP tool poisoning (MCP03) and context injection (MCP10) but not skills as a distinct supply-chain surface.

### 5. AIVSS v0.8 — Informed
- Announced **2026-03-19**, co-published with AIUC-1. An updated quantitative model scores **agentic risk amplification** from autonomy, tool use, dynamic identity, and persistent memory. An SSVC-style qualitative decision tree is in draft. Includes an official AIVSS↔AIUC-1 crosswalk.
- **Delta vs AGF:** relevant to AGF's Layer 6 (risk quantification) and to risk-tiered ring activation. AGF does not cite AIVSS.

### 6. MCP Top 10 — Open
- No v1.0 release found. AGF's "living/beta" caveat still applies. The MCP spec itself changed substantially in July (see `08`), so some categories may need re-reading against 2026-07-28 semantics.

### 7. GenAI and Agentic AI Exploit Roundup, Q3 2026 — Established (as an OWASP publication); individual incident details vary in confidence
- Published **2026-10-08**. Nine connected incidents mapped to ASI categories, dominated by ASI02/ASI03/ASI10 (tool misuse, privilege abuse, rogue agents) from frontier-model evaluation containment failures, plus ASI04/ASI06 supply-chain and memory-poisoning cases (Mini Shai-Hulud/Miasma npm worms, Deadbugz malicious MCP campaign, CoSnitch Copilot memory poisoning CVE-2026-24301). Details are in `10-incidents-and-industry-shifts.md`.
- **Delta vs AGF:** ASI10 Rogue Agents moved from theoretical to the most frequently mapped category in real incidents. AGF's threat mapping should weight it accordingly.

### 8. Community scale — Informed
- 30,000+ LinkedIn members. F5 and WitnessAI Gold sponsors. The AI Security Solutions Directory added Agentic Security and Agentic Red Teaming lenses.

---

## Sources

- OWASP GenAI, Releases Top 10 Risks and Mitigations for Agentic AI Security, 2025-12-09 — https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security/
- OWASP GenAI, Unveils 2026 Top 10 for LLM Applications, New Agent Control Standard…, 2026-09-01 — https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/
- OWASP GenAI, Agent Control Standard (ACS) — https://genai.owasp.org/resource/agent-control-standard/
- Pillar Security, Standardizing the control plane for AI agents: Pillar's role in ACS v0.1.0 — https://www.pillar.security/blog/standardizing-the-control-plane-for-ai-agents-pillars-role-in-acs-v0-1-0
- CSA Labs, OWASP's 2026 LLM Top 10 and New Agent Control Standard — https://labs.cloudsecurityalliance.org/research/csa-research-note-owasp-genai-top10-2026-agent-control-stand/
- Forkast, Three standards bodies are writing the rules for agent infrastructure, 2026-09-09 — https://forkast.news/three-standards-bodies-are-writing-the-rules-for-agent-infrastructure-and-theyre-not-waiting-for-the-market/
- Ken Huang, OWASP Publishes Agentic Skills Top 10 v1.0, 2026-08-17 — https://kenhuangus.substack.com/p/for-immediate-release-owasp-publishes
- Ken Huang, OWASP AIVSS v0.8, 2026-03-19 — https://kenhuangus.substack.com/p/owasp-aivss-project-announces-the
- OWASP GenAI, GenAI and Agentic AI Exploit Roundup Q3 2026, 2026-10-08 — https://genai.owasp.org/2026/10/08/genai-and-agentic-ai-exploit-roundup-q3-2026/
- LLM Works, Mapping the AI Agent Governance Landscape (Aug 2026) — https://www.llm-works.ai/blog/agent-governance-landscape-aug-2026/
