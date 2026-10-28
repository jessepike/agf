# 02 — EU AI Act and Global Regulation

**Research date:** 2026-10-28 · **Window:** May–Oct 2026 · **AGF baseline:** `docs/profiles/grc-profile.md` (EU AI Act timing "as of March 2026"), `docs/agentic-primitives.md` (EU AI Act table, Singapore table)

---

## Summary

The EU deferred high-risk obligations by 16–12 months through the Digital Omnibus, so AGF's GRC profile date ("high-risk obligations become applicable 2 August 2026") is now wrong. Enforcement nonetheless started, and it started against loss-of-control incidents involving frontier-model agents, not high-risk use cases. The first harmonised standard (QMS) is in the Official Journal. Outside the EU, China issued the first national policy framework written specifically for AI agents, Singapore updated its agentic framework to v1.5, and US state law moved toward narrower obligations under federal preemption pressure.

## European Union

### 1. Digital Omnibus on AI adopted: Regulation (EU) 2026/1744 — Established (multiple law-firm sources agree on dates)
- Provisional agreement 2026-05-06/07; Parliament vote 2026-06-16; Council adoption 2026-06-29; OJ publication 2026-07-24; in force **2026-07-27**.
- **New high-risk application dates:**
  - Annex III (stand-alone high-risk, e.g. employment, credit): **2027-12-02** (was 2026-08-02)
  - Annex I (AI in regulated products): **2028-08-02** (was 2027-08-02)
- **Unchanged:** Article 50 transparency obligations applied **2026-08-02**. Grace period for Art. 50(2) watermarking of systems already on the market ends **2026-12-02**.
- Other changes: AI literacy (Art. 4) softened to "support" rather than guarantee; new Art. 5 prohibition on non-consensual intimate imagery/CSAM generators (transition ends 2026-12-02); national sandboxes due 2027-08-02; special-category data processing for bias detection extended to all AI systems; narrower "safety component" definition; the AI Office gets exclusive competence over systems built on a provider's own GPAI models, with investigation and fining powers.
- **Delta vs AGF:** `docs/profiles/grc-profile.md:86` states high-risk obligations apply 2 August 2026. That needs a dated correction. AGF's article-by-article mapping (Art. 9–15) still holds. Only the timing moved.

### 2. First enforcement: GPAI systemic-risk RFIs after agent incidents — Informed (single secondary source; Commission release not fetched directly)
- **2026-10-14:** EVP Henna Virkkunen announced the Commission's first AI Act enforcement actions. The AI Office sent Requests for Information to providers of the most advanced models on **containment and compute-access security, external evaluation, and post-market monitoring**, with a further RFI on the summer's incidents to follow. Fines for bad replies run up to €15M or 3% of turnover.
- Stated principle: "AI must remain under human direction, oversight and control."
- **Delta vs AGF:** AGF's EU mapping explicitly *does not cover* Art. 51–56 (GPAI) or Art. 73 (serious incident reporting). The first live enforcement landed exactly in that gap, and on agentic loss of control. **Open:** whether downstream deployers inherit evidentiary expectations (containment logs, evaluation records) from these RFIs.

### 3. Draft high-risk classification guidelines address multi-agent systems — Established (law-firm summary of Commission draft)
- Published **2026-05-19**, consultation closed 2026-06-23 (non-binding).
- **Agentic point:** where multiple AI components interact and their *combined* output materially influences an Annex III decision, they are assessed **as a single system**, so a narrow-task component can be high risk. General-purpose systems are classified by *all* envisaged uses. Broad marketing without excluding high-risk uses makes those uses intended.
- **Delta vs AGF:** this supports AGF's "governance collapse rule" and ring-nesting treatment of multi-agent systems (outermost Ring 2 authoritative). It is worth citing in the GRC profile.

### 4. Harmonised standards: first one in the OJ — Established
- **EN 18286:2026**, *Quality management system for EU AI Act regulatory purposes*, published by CEN/CENELEC July 2026. Cited in the OJ by Implementing Decision (EU) 2026/2274, reported 2026-10-14. It gives a presumption of conformity with **Art. 17 (QMS)**. Annexes map it to ISO 9001 and ISO/IEC 42001.
- Still pending in JTC 21: risk management, logging, cybersecurity, conformity assessment, data governance, transparency, human oversight, accuracy, robustness. The standardisation request M/613 runs to **2027-02-28**.
- **Delta vs AGF:** AGF maps Art. 12 logging to Primitive #10/#6. The JTC 21 logging standard will be the concrete conformance target once cited. **Open:** its event model and whether it accommodates graph-embedded partial ordering (AGF open thread #3).

## China

### 5. National policy framework for AI agents — Established (NYU Shanghai RITS summary of the official text)
- *Implementation Opinions on the Standardized Application and Innovative Development of Intelligent Agents* (智能体规范应用与创新发展实施意见), issued **2026-05-08** by CAC, NDRC, and MIIT.
- Defines agents as a distinct class ("autonomous perception, memory, decision-making, interaction, and execution"), separate from the 2023 generative AI measures.
- **Three-tier decision authority:** user-only decisions, decisions requiring user authorization, and autonomous agent decisions. Users have the right to know about autonomous decisions and to make the final call.
- Tiered governance: high-risk sectors (healthcare, transport, media, public safety) face filing, testing, recall, and multi-regulator oversight. Consumer uses rely on platform governance and third-party evaluation.
- Secondary sources report enforceability from 2026-07-15 and quarterly reporting for the highest tier. — Open (lower-reliability sources; not confirmed against the official text)
- **Delta vs AGF:** AGF has no China coverage. The three-tier decision-authority model maps directly to Bounded Agency (#7) plus Governance Gates (#8) and to Trust Ladder levels. It is the first *regulation* that writes autonomy tiers into law.

## Singapore

### 6. IMDA Model AI Governance Framework for Agentic AI v1.5 — Established
- Released **2026-05-20**, with feedback from 60+ organizations. Four pillars unchanged.
- New content: systemic and multi-agent risks (agent sprawl, miscoordination, objective conflict, collusion, emergent behavior); third-party agent reliance as a risk factor; **automation-bias countermeasures** (track override rates and review response times, train reviewers on agentic failure modes); a stated preference for **system-level, rule-based controls over prompt-layer instructions**; runtime controls; change-management triggers; 10+ sector case studies.
- **Delta vs AGF:** AGF cites the Jan 2026 v1.0 throughout (`grc-profile.md`, `shared-vocabulary.md`, `agentic-primitives.md:1734`). The v1.5 automation-bias guidance strengthens AGF's honest constraint on Art. 14 oversight efficacy. The "rules over prompts" preference validates Policy as Code (#9) as deterministic enforcement.

## United States: states and federal preemption

### 7. Colorado AI Act repealed and re-enacted — Informed
- **SB 26-189** (passed 2026-05-14) repealed and re-enacted SB 24-205 with four narrower obligations, effective **2027-01-01**. Rulemaking comments closed around 2026-10-26. Separate reporting describes xAI litigation with DOJ intervention suspending enforcement of the original act. — Open (not verified in detail)

### 8. Federal preemption pressure without a statute — Informed
- **EO 14365** (2025-12-11), *Ensuring a National Policy Framework for AI*, created a DOJ AI Litigation Task Force and tied some funding to states dropping "onerous" rules.
- 2026-06-04: the bipartisan "Great American AI Act" discussion draft would preempt state *development* rules for three years, but not deployment or use rules. As of Sept 2026, there is no preemption statute and little momentum in the House.
- **California SB 53** (frontier transparency) remains in force, with public disputes over OpenAI's compliance. Its incident-reporting thresholds (>50 deaths or >$1B damage), like New York's RAISE Act, would likely not capture the July 2026 evaluation-containment incidents (TIME).
- **Delta vs AGF:** AGF's US coverage is federal (NIST). For deployers, the state layer is now *narrower* obligations on deployment and use, while frontier-developer transparency laws cover a different population than AGF's audience.

---

## Sources

- Gibson Dunn, EU AI Act Omnibus Agreement, 2026-05-27 — https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- AI Acto, Digital Omnibus Adopted: AI Act High-Risk Delayed to 2027 — https://www.aiacto.eu/en/blog/digital-omnibus-ai-act-report-2027
- Jones Walker, Yes, August 2 Still Matters — https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html
- CSA Labs, EU AI Act High-Risk Deadline Pushed to December 2027 — https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-omnibus-vii-deadline-delay-20260/
- Unite.AI, EU Announces First AI Act Enforcement Actions After AI Agent Incidents, 2026-10 — https://www.unite.ai/eu-announces-first-ai-act-enforcement-actions-after-ai-agent-incidents/
- Covington / Global Policy Watch, Commission Publishes Draft Guidelines on HRAIs, 2026-06-11 — https://www.globalpolicywatch.com/2026/06/eu-ai-act-update-the-european-commission-publishes-draft-guidelines-on-hrais/
- JTC21.eu, EN 18286 becomes the first harmonised standard under the EU AI Act, 2026-10-14 — https://jtc21.eu/en-18286-becomes-the-first-harmonised-standard-under-the-eu-ai-act/
- European Commission, First harmonised standard published in the OJ — https://digital-strategy.ec.europa.eu/en/library/first-harmonised-standard-supporting-ai-act-published-official-journal
- NYU Shanghai RITS, China Issues First National Policy Framework Dedicated to AI Agents — https://rits.shanghai.nyu.edu/ai/china-issues-first-national-policy-framework-dedicated-to-ai-agents/
- MachineBrief, China AI Agent Regulations Enforceable July 15, 2026 (lower reliability) — https://www.machinebrief.com/news/china-ai-agent-regulations-enforceable-july-15-2026
- Covington / Global Policy Watch, Singapore Updates MGF for Agentic AI, 2026-06-23 — https://www.globalpolicywatch.com/2026/06/singapore-updates-model-ai-governance-framework-for-agentic-ai/
- IMDA factsheet, Updated MGF for Agentic AI — https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/updated-model-ai-governance-framework-for-agentic-ai
- CASRAI, Federal AI Preemption Fight: Where It Stands, 2026-09-20 — https://casrai.org/news/federal-ai-moratorium-state-preemption-fight-2026
- Mondaq, The Colorado AI Law You Prepared For Is Gone — https://www.mondaq.com/unitedstates/technology/1859280/the-colorado-ai-law-you-prepared-for-is-gone-and-the-rulemaking-comment-window-closes-october-26
- Norton Rose Fulbright, xAI sues, DOJ intervenes — https://www.nortonrosefulbright.com/en-us/knowledge/publications/de3ad9de/xai-sues-doj-intervenes-enforcement-of-colorado-ai-act-suspended
- TIME, How OpenAI Lost Control of an AI Model, 2026-07-24 — https://time.com/article/2026/07/24/openai-hugging-face-attack/
