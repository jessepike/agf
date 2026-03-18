

**AI RISK TOOLS**

STRATEGIC RESEARCH MEMORANDUM

**Insurance Vertical Deep-Dive**

AI Governance Requirements, Buyer Landscape,and Go-to-Market Validation

Prepared for:

**Jess Pike, Founder — AI Risk Tools, Inc. / DecisionOS**

March 2026  |  Confidential

| BLUF:  Bottom line up front: Insurance is the most structurally compelling first vertical for AI Risk Tools. Compliance mandates are already in force across 25+ states, 88–92% of insurers use AI, enforcement scrutiny is accelerating, and the current solution landscape is dominated by Big 4 consulting and enterprise platforms priced out of reach for the mid-market. The gap is real. The question is channel strategy and output format fit. |
| :---- |

# **1\. Insurance AI Governance — Compliance Requirements**

## **1A. NAIC Model Bulletin — AIS Program Requirements**

The NAIC Model Bulletin, adopted December 4, 2023, establishes the current national framework. As of March 2026, 24 states plus DC have adopted it with minimal changes. It does not create new law — it operates through existing unfair trade practice and market conduct statutes — but it is now the de facto national standard for insurer AI governance.

### **What the AIS Program Must Include**

* Written, documented AI governance program covering the full AI lifecycle (design → retirement)

* Governance framework: Board/senior management accountability, cross-functional committee structure (actuarial, data science, underwriting, compliance, legal), defined authority chains

* Risk management and internal controls: Risk identification per system, data lineage and bias analysis, model inventory with version control, validation/testing/retesting procedures, model drift monitoring

* Third-party oversight: Due diligence on AI vendors, contractual audit rights, cooperation with regulatory inquiries, ongoing vendor monitoring

* Consumer notice protocols: Disclosure that AI is in use, proportionate to the insurance lifecycle phase

* Internal audit function: Independent audit of AIS Program compliance

* Documentation: Compliance records sufficient to produce during market conduct examination

### **What Regulators Will Request in an Examination**

Section 4 of the Bulletin is the operative document for AI Risk Tools product design. Regulators may request:

* The written AIS Program document and evidence of adoption

* Scope documentation: which AI systems are covered, which are excluded and why

* Policies, procedures, training materials for each phase of AI lifecycle

* AI system inventory and descriptions (Predictive Models and GenAI separately)

* Data governance records: lineage, quality, bias analysis, data currency

* Validation and testing records: methodologies, thresholds, test results, Model Drift evaluations

* Third-party vendor due diligence records and contract terms

* Audit records and monitoring logs

| → PRODUCT NOTE:  Product implication: The NAIC Section 4 documentation checklist is essentially a requirements specification for what a compliant AI governance assessment needs to produce. AI Risk Tools output should map directly to these categories — not to NIST AI RMF in isolation. |
| :---- |

### **NIST AI RMF Alignment**

The Bulletin explicitly permits reliance on NIST AI RMF (Section 1.5): 'The AIS Program may adopt, incorporate, or rely upon, in whole or in part, a framework or standards developed by an official third-party standard organization, such as the National Institute of Standards and Technology (NIST) Artificial Intelligence Risk Management Framework.' This is AI Risk Tools' current primary framework — it maps directly to what insurance regulators accept.

### **Templates and Published Guidance**

No official state DOI has published a sample AIS Program template as of March 2026\. The NAIC developed an AI Systems Evaluation Tool (questionnaire/checklist format) in 2025, currently in pilot phase with early 2026 rollout. This tool standardizes what examiners will ask — it is a critical reference document for AI Risk Tools output design. The absence of official templates is a market gap: there is no standard artifact that a compliance officer can download and complete.

## **1B. Colorado SB 21-169 — The Most Mature Enforcement Regime**

Colorado is the most advanced state for insurance AI enforcement. Regulation 10-1-1 (effective November 14, 2023\) implements SB 21-169 with specific documentation requirements and hard filing deadlines. As of October 15, 2025, it expanded from life insurers to also cover private passenger auto and health benefit plan insurers.

### **What the Colorado DOI Expects**

The Regulation requires life, auto, and health insurers using ECDIS (external consumer data and information sources) to maintain:

* Written governing principles to prevent unfair discrimination in AI use

* Cross-functional governance group with board/senior management oversight

* Up-to-date inventory of all ECDIS, algorithms, and predictive models with version control

* Documented testing methodology for detecting unfair discrimination

* Ongoing monitoring and drift detection for all models

* Third-party vendor selection and oversight process

* Annual review and update of the governance framework

### **Annual Reporting Requirements (The December 1 Deadline)**

| Insurer Type | Filing Requirement | Deadline |
| :---- | :---- | :---- |
| Using ECDIS/models | Annual narrative compliance report summarizing GRM framework, responsible personnel (title \+ qualifications), attestation by officer | December 1 annually (began 2024\) |
| Not using ECDIS/models | Attestation of non-use signed by officer | December 1 annually |
| New ECDIS adopters | Compliance report prior to first use | Before deployment |

| ⚠ ENFORCEMENT WATCH:  Enforcement status: No major public enforcement actions have been taken under SB 21-169 as of March 2026\. However, regulators have 'begun market conduct exams and civil exam inquiries, assessing insurers on AIS Program compliance' per Baker Tilly. Colorado DOI Director Jason Lapham was publicly quoted that 'some carriers have fairly little to no governance around use of this information or around use of these AI tools.' The enforcement ramp is underway. |
| :---- |

## **1C. Colorado AI Act (SB24-205) — Insurance Intersection**

SB24-205, signed May 2024, is the broader Colorado AI Act targeting high-risk AI systems. For insurers, the interaction with SB 21-169 creates overlapping but not redundant requirements:

* SB 21-169 / Regulation 10-1-1 \= insurance-specific, ECDIS-focused, Colorado DOI enforcement

* SB24-205 \= cross-industry, high-risk AI systems, Attorney General enforcement

* Insurers are subject to both simultaneously — they do not substitute for each other

* SB24-205 adds: risk management programs, consumer impact assessments, consumer notification of adverse AI decisions, and an appeal mechanism

* The 'rebuttable presumption of reasonable care' (via NIST AI RMF / ISO 42001 compliance) applies to SB24-205 but Regulation 10-1-1 has its own compliance standard; NIST alignment satisfies the former but not automatically the latter

## **1D. State-by-State Landscape Beyond Colorado**

As of March 2026, 24 states and DC have adopted the NAIC Model Bulletin. Key additional jurisdictions with independent requirements:

| State | Regime | Key Distinctions |
| :---- | :---- | :---- |
| New York | NYDFS Circular Letter 2024-7 (Insurance) | Requires proof AI/external data don't proxy for protected classes; insurers must allow DFS to review vendor tools; mandates vendor audit rights |
| California | Health & Safety Code §1367.01 \+ Insurance Code §10123.135 | Prohibits sole reliance on AI for health care decisions; adverse determination requires licensed clinician review; disclosure when AI contributes; California also has broader privacy/CCPA requirements |
| Colorado | SB 21-169 \+ Regulation 10-1-1 \+ SB24-205 | Most mature: life/auto/health insurers, ECDIS testing, annual December 1 reports, ECDIS inventory required |
| Illinois | NAIC Bulletin (Company Bulletin 2024-08) | Full adoption March 2024; no independent insurance AI law yet but considering additional requirements |
| Connecticut | Bulletin No. MC-25 | Full adoption Feb 2024; proposed legislation for quantitative testing in 2025 |
| Pennsylvania | Considering additional requirements | NAIC adoption plus proposed insurance-specific AI legislation flagged by Baker Tilly |

| ⚠ REGULATORY DIRECTION:  NAIC 2025 pilot: The AI Systems Evaluation Tool pilot (early 2026\) is expected to drive toward a comprehensive AI Model Law. This signals the next enforcement wave — principle-based bulletins are transitioning toward prescriptive model law. Insurers who haven't built AIS Programs are running out of runway. |
| :---- |

# **2\. Insurance AI Use Cases and Risk Patterns**

## **2A. Where AI Is Deployed and Where Governance Risk Lives**

NAIC survey data (2025): 92% of health insurers, 88% of auto insurers, 70% of home insurers, and 58% of life insurers report current or planned AI use. Adoption is near-universal; governance is not.

| Line of Business | High-Risk AI Use Cases | Primary Governance Risk | Enforcement Attention |
| :---- | :---- | :---- | :---- |
| Health | Claims adjudication, prior authorization, utilization review, Medicare Advantage coverage | Algorithmic denial without clinical review; disparate impact on protected classes; override of physician judgment | HIGHEST — active litigation (UHG, Cigna), congressional scrutiny, CMS rules, CA state law |
| P\&C / Auto | Underwriting scoring, pricing algorithms, claims triage, FNOL automation | Rating discrimination via proxy variables (credit, zip code); unfair pricing disparities | HIGH — Colorado auto coverage now under Reg 10-1-1; NY DFS proxy-variable scrutiny |
| Life | Underwriting acceleration, mortality prediction, ECDIS-based scoring (social media, purchasing habits) | Protected class discrimination via ECDIS; alternative data proxies for race/gender | HIGH — Colorado Regulation 10-1-1 first applied here; quantitative bias testing incoming |
| Workers' Comp | Claims fraud detection, return-to-work prediction, medical necessity review | Bias in fraud flagging (disproportionate targeting of protected classes); inaccurate RTW predictions | MEDIUM — less regulatory attention currently but trajectory toward higher scrutiny |

## **2B. The Enforcement Cases — What Regulators Are Watching**

The UnitedHealth / Cigna litigation is the defining case pattern for insurance AI governance risk:

* UnitedHealth (nH Predict): AI algorithm with \~90% appeal-reversal rate used to deny Medicare Advantage post-acute care. Class action proceeding on breach of contract and breach of good faith claims. UHG's denial rate for post-acute care doubled after algorithm implementation.

* Cigna (PXDX): Algorithm enabled batch denial of thousands of claims without individual physician review. Sued in Eastern District of California. Cigna denied it was 'AI' but ProPublica documented the system enabling 300K+ claims rejected in two months.

* Both cases turn on the same governance failure: the insurer's own policy language promised human clinical review, while the algorithm effectively replaced it. The documentation gap is what created liability.

| → PRODUCT NOTE:  Governance lesson for AI Risk Tools: The failure mode isn't 'we used AI.' It's 'we used AI without documenting that AI was used, and without establishing whether the AI decision aligned with our stated decision process.' Auditable documentation of AI decision authority — exactly what AI Risk Tools produces — is the mitigation. |
| :---- |

## **2C. Insurance-Specific Risk Taxonomy**

The NAIC FACTS framework (Fairness, Accountability, Compliance, Transparency, Security) is the operative risk taxonomy for insurance AI. Regulators consistently focus on:

* Unfair discrimination: Use of proxy variables that correlate with protected classes in underwriting, rating, or claims

* Model drift: Degradation of model performance over time causing increasingly inaccurate or biased outcomes

* Third-party accountability: Insurers remain responsible for vendor AI systems — 'we bought it from a vendor' is not a defense

* Lack of explainability: Inability to explain adverse decisions to consumers or regulators

* Coverage delegation: AI making coverage decisions that policy language assigns to human clinicians or adjusters

* Data currency: Use of stale or unrepresentative training data

The actuarial profession (SOA, CAS, AAA) additionally flags: model validation gaps, lack of sensitivity analysis, inappropriate use of correlational models for causal decisions, and insufficient out-of-time testing.

# **3\. Buyer Landscape**

## **3A. Who Owns AI Governance in Insurance**

AI governance in insurance is structurally multi-owner — no single clean buyer. The organizational pattern:

| Role | Ownership | Budget Authority? |
| :---- | :---- | :---- |
| Chief Risk Officer (CRO) | Enterprise risk, AIS Program overall accountability, board reporting | Yes — enterprise risk budget |
| Chief Compliance Officer | Regulatory compliance, state DOI filings, market conduct exam prep | Yes — compliance budget |
| Chief Actuary | Model risk, predictive model governance, bias testing methodology | Yes — actuarial budget |
| Chief AI Officer / CAIO | Emerging role at larger carriers; AI CoE leadership, AI strategy | Yes — at larger carriers; rare at regional carriers |
| CTO / Chief Data Officer | Technical governance, model registry, data lineage | Yes — IT/data budget |
| Compliance Manager | Day-to-day AIS Program maintenance, December 1 filings | No — reports to CCO or CRO |
| Model Risk Manager | Model validation, drift monitoring, testing documentation | No — reports to CRO or Actuary |

At Tier 1 insurers (State Farm, Allstate, UnitedHealth), dedicated AI governance teams exist and report to CAIO or CRO. At regional and specialty carriers, AI governance is typically absorbed by the compliance function or actuarial department — often a single person wearing multiple hats. This is the sweet spot for AI Risk Tools.

## **3B. Current Tooling — What Insurers Are Using Today**

The tooling landscape is fragmented and predominantly manual at the regional carrier level:

| Tool / Approach | Who Uses It | Fit for Insurance AI Governance |
| :---- | :---- | :---- |
| Spreadsheets / Word documents | Most regional/specialty carriers | Current state — the status quo AI Risk Tools replaces |
| GRC platforms (ServiceNow, Archer) | Tier 1 insurers already on enterprise GRC | Not AI-specific; requires heavy customization; expensive |
| Credo AI | Enterprises in financial services, government, healthcare | Strong for large enterprises; policy packs include NIST AI RMF; not insurance-specific; no NAIC bulletin mapping; contract-based pricing |
| IBM watsonx.governance | IBM ecosystem large enterprises | Enterprise-grade; steep learning curve; requires IBM infrastructure; Credo AI powers its compliance content |
| OneTrust AI Governance | Large enterprises with global GRC needs | GRC workflow automation; not insurance-specific; expensive |
| Holistic AI | Enterprises needing full AI inventory | Broad lifecycle governance; not insurance-specific |
| ValidMind | Insurance-focused model risk | Targets CRO/CDO/compliance; insurance-focused; strong on model validation |
| Baker Tilly NAIC AI Governance Engagement | Mid-to-large P\&C, life, health carriers | Consulting engagement: structured assessment \+ road map aligned to NAIC bulletin; this is the comparison point |

| ✓ OPPORTUNITY:  Key finding: No off-the-shelf tool is specifically mapped to NAIC Model Bulletin Section 4 documentation requirements. ValidMind comes closest for model risk but is not a regulatory assessment tool. The $74/assessment price point is competing with consulting fees and spreadsheets — not with Credo AI or watsonx.governance, which serve a different buyer. |
| :---- |

## **3C. Consulting Channel — Insurance Specialty**

The consulting channel is active and credentialed in insurance AI governance. Key players:

* Baker Tilly: Most active and publicly documented insurance AI governance practice. Published a P\&C case study (\>$2B premium carrier) of NAIC bulletin alignment \+ AI maturity assessment \+ road map. They do documentation review, stakeholder interviews, gap analysis, and benchmarking. This is the closest analog to what AI Risk Tools produces. Engagement cost: not published, but Baker Tilly mid-market consulting engagements typically run $50K–$250K.

* Deloitte / EY / PwC: Insurance practices with AI governance capabilities. Deloitte \+ Databricks partnership explicitly targets insurance AI governance. These are $200K+ engagements. Primarily serve Tier 1 carriers.

* Milliman / Towers Watson: Actuarial firms increasingly involved in AI model risk and bias testing. Natural channel for quantitative testing requirements under Colorado Reg 10-1-1.

* Cherry Bekaert, RSM: Regional accounting/consulting firms serving mid-market insurers; newer to AI governance but following client demand.

| ✓ CHANNEL INSIGHT:  Channel opportunity: Baker Tilly, Cherry Bekaert, RSM, and similar regional consulting firms don't want to spend 40 hours manually producing a gap assessment from scratch. AI Risk Tools can be the assessment engine they white-label or recommend — generating the structured documentation artifact that their engagement then interprets and acts on. This is the consulting channel play. |
| :---- |

## **3D. Budget and Procurement Dynamics**

Budget line: AI governance falls under Compliance at most regional/specialty insurers, with actuarial or IT funding for technology components. At Tier 1 carriers, it has a dedicated line item under the AI CoE or enterprise risk budget.

Procurement for $74/assessment or $9K/year:

* Below most formal procurement thresholds at regional carriers — this can often be expensed or approved by a department head without IT or legal review

* Likely sits in compliance budget or outside counsel budget (compared to $50K consulting engagement)

* Annual December 1 deadline creates a natural renewal trigger and urgency window

* If framed as 'regulatory filing support,' it maps to existing compliance spend categories

Tier segmentation is real but the gap is different than assumed:

* Tier 1 carriers (State Farm, Allstate, UnitedHealth, Progressive): Have internal teams; are already spending on enterprise platforms; not the target

* Regional carriers ($500M–$5B written premium): Have compliance staff but no dedicated AI governance tooling; currently spreadsheet-based; this is the primary target

* Specialty/niche carriers (\<$500M): Similar to regional but may be further behind; earlier in governance maturity; potentially through a consulting channel rather than direct

# **4\. Product-Market Fit Signals**

## **4A. What a Compliance Officer Expects in the Output**

Based on NAIC Section 4, Colorado Regulation 10-1-1, and the NAIC AI Systems Evaluation Tool structure, an audit-ready insurance AI governance assessment needs:

| Output Section | Regulatory Mapping | Current AI Risk Tools Coverage |
| :---- | :---- | :---- |
| AI System Inventory Entry | NAIC §4.1.3.c.i — inventory and descriptions | Risk Mapper / use case intake — needs insurance-specific field set |
| Regulatory Applicability Matrix | NAIC bulletin, Colorado Reg 10-1-1, NY DFS 2024-7, applicable state adoption | FrameworkMapper — needs insurance vertical regulatory data layer |
| NIST AI RMF Alignment Map | NAIC §1.5 explicit safe harbor | NIST AI RMF — current primary framework, strong fit |
| Risk Assessment (by use case) | NAIC §3.0, §3.3, §3.4; Colorado GRM rubric | RiskMapper — needs insurance-specific risk categories (bias, drift, proxy discrimination, coverage delegation) |
| Data Governance Assessment | NAIC §3.2; Colorado §4.B — data lineage, bias, currency | Not explicit in current pipeline — gap to address |
| Third-Party Vendor Assessment | NAIC §4.0; Colorado §4.F — vendor oversight | Partially covered — needs insurance-specific vendor risk framing |
| Compliance Action Plan | NAIC §4 exam readiness; Colorado December 1 report content | Prioritized action plan — current output; needs to map to filing deadlines |
| Board/Management Accountability Summary | NAIC §2.3; Colorado board oversight requirement | Not explicit — gap to address |

| ⚠ CRITICAL GAP:  The most important gap: the output does not currently reference NAIC Model Bulletin section numbers, Colorado Regulation 10-1-1 article numbers, or state-specific adoption dates. A compliance officer reading the output should see 'NAIC Model Bulletin §3.3.3.c — Model Drift' not just 'NIST AI RMF GOVERN 1.4.' Both are needed. The insurance buyer speaks in regulatory citation. |
| :---- |

## **4B. Competitive Positioning in Insurance**

None of the major AI governance platforms (Credo AI, OneTrust, Holistic AI, watsonx.governance) market specifically to insurance as a first vertical or map explicitly to NAIC bulletin sections. Credo AI includes NIST AI RMF and EU AI Act policy packs but no NAIC-specific content published. ValidMind is the closest competitor for the insurer-specific use case but targets model risk management rather than regulatory assessment.

What makes a $74/assessment tool beat a $50K consulting engagement:

* Speed: A compliance officer under a December 1 deadline needs output in hours, not weeks

* On-demand iteration: They can re-run an assessment as they update their AI program — something no consulting engagement allows

* Per-system granularity: A carrier with 15 AI systems can assess each one independently for $74 vs. one monolithic engagement covering everything at high cost

* Consistent documentation format: The output is always structured the same way, making it easier to aggregate into the annual compliance report

* Audit trail: The source attribution in the assessment is itself a governance artifact

## **4C. The Three Burning Pain Points**

Based on regulatory documentation, practitioner commentary, and consulting case studies, the top three pain points for insurance AI governance professionals right now:

| Pain Point | Evidence | AI Risk Tools Fit |
| :---- | :---- | :---- |
| 'We have no idea what AI systems we're running' — inventory and documentation gap | Colorado DOI's Jason Lapham: 'some carriers have fairly little to no governance.' NAIC survey: \~1/3 of health insurers don't regularly test models for bias. | ProfileBuilder \+ Risk Mapper: intake and inventory function |
| 'The December 1 deadline is coming and we don't have the report' — annual filing pressure | Colorado Regulation 10-1-1 annual reports are due December 1 each year; compliance is attestation-grade (officer signature) | Structured output designed for annual compliance reporting; per-system assessment maps directly to GRM framework documentation |
| 'We don't know if our third-party vendor AI systems create liability' — vendor governance | NAIC §4.0 explicitly holds insurers responsible for third-party AI; class actions against UHG and Cigna both involve third-party or internal AI without adequate governance | Third-party AI system assessment pathway; FrameworkMapper can classify vendor-provided AI |

### **What Makes a Regional Insurer Compliance Officer Say 'I Need This'**

| TRIGGER SCENARIO:  The trigger conversation: 'I need to file my annual AI compliance report with Colorado by December 1\. I have 8 predictive models deployed in underwriting and claims. I need to document each one against the governance framework — what it does, what data it uses, what testing we've done, what the risks are, and what we're doing about them. My actuary and my compliance counsel are both telling me what it needs to contain, but nobody has a tool that actually produces the document. I'm looking at a blank Word template and a stack of vendor documentation.' |
| :---- |

# **5\. Implications for AI Risk Tools**

## **5A. Should Insurance Be the First Vertical?**

| VERDICT:  Verdict: Yes, with a critical caveat. Insurance is structurally the strongest first vertical, but the product must have insurance-specific regulatory data baked in before the first pilot conversation. Showing up with a generic NIST AI RMF output and asking an insurance compliance officer to evaluate it is a credibility-destroying first impression. The NAIC bulletin, Colorado Regulation 10-1-1, and NY DFS circular letter mappings need to be in the product. |
| :---- |

The case for insurance as vertical \#1:

* Regulatory mandate is already active — this is not 'you should do this,' it's 'you are required to do this and regulators are beginning to examine it'

* Annual recurring trigger (December 1\) creates predictable renewal demand

* 92% AI adoption rate \+ 1/3 lacking regular testing \= large pool of non-compliant buyers with genuine urgency

* No purpose-built low-cost tool exists for this use case — the market is consulting engagements and spreadsheets

* The UHG/Cigna litigation has made AI governance viscerally real for insurance executives in a way that no regulation alone achieves

* NIST AI RMF alignment is already an accepted safe-harbor pathway, directly matching existing product

## **5B. What Would Need to Change in the Pipeline**

Required product changes for insurance vertical fit:

* Regulatory data layer: Add NAIC Model Bulletin (section-by-section), Colorado Regulation 10-1-1, NY DFS Circular Letter 2024-7, and major state adoptions as selectable regulatory frameworks. Output citations should reference these directly.

* Insurance use case taxonomy: Add insurance-specific use case categories to ProfileBuilder — health claims adjudication, prior authorization, auto underwriting, life ECDIS scoring, fraud detection, etc. — with pre-mapped risk profiles.

* Insurance risk vocabulary: Add insurance-specific risks — proxy discrimination, ECDIS exposure, model drift under SB 21-169, coverage delegation, unfair trade practice exposure — to RiskMapper.

* Annual report output template: Create a December 1 compliance report output format that mirrors what Colorado DOI expects: GRM framework summary, responsible personnel section, testing documentation summary.

* Third-party AI pathway: Explicitly support 'we are assessing a vendor-provided AI system' as a first-class intake type with vendor-specific due diligence questions.

* NAIC AI Systems Evaluation Tool alignment: As NAIC pilots this examination tool in early 2026, map product output to its questionnaire structure — this is the future standard for what examiners will ask.

## **5C. Go-to-Market Recommendation**

Two viable paths, not mutually exclusive:

### **Path 1: Direct to Regional Insurer (Compliance Function)**

Target the compliance officer or director of actuarial at regional P\&C and health carriers ($500M–$5B written premium). Outreach trigger: 'Are you ready for your December 1 Colorado/NAIC compliance filing? Here's what an AI governance assessment for your underwriting model looks like.' First sale is a pilot assessment on one system, not a platform subscription.

* Pros: Direct feedback loop, faster iteration on output format, validates product-market fit without channel dependency

* Cons: Cold outreach to compliance officers is hard; no existing brand presence in insurance; may require insurance-specific credentialing or case study

### **Path 2: Through Insurance Consulting Channel (Baker Tilly, Cherry Bekaert, RSM)**

Position AI Risk Tools as the assessment engine that consulting firms use to deliver NAIC AI governance engagements faster and at lower cost. Baker Tilly has documented exactly this engagement type — they interviewed stakeholders, reviewed documentation, and produced a road map aligned to the NAIC bulletin. AI Risk Tools can compress the documentation review and gap assessment phase from weeks to hours.

* Pros: Faster credibility establishment (partner with known insurance brand), bypasses cold outreach, channel handles procurement and buyer relationship

* Cons: Channel dependency, potential margin compression, slower product feedback loop, risk of being commoditized as the 'document parser'

| RECOMMENDATION:  Recommended path: Start with 2–3 direct regional insurer pilots to validate output format and refine insurance-specific risk vocabulary, then pursue a consulting channel partnership (Baker Tilly or Cherry Bekaert are the natural targets) once the output can demonstrably compress their assessment workflow. The consulting engagement is the anchor client's alternative — the product should be positioned as 'what their consulting firm uses.' |
| :---- |

## **5D. Recommended Insurance-Specific Data to Add**

* Regulatory reference data: NAIC Model Bulletin full text (Section 4 especially), Colorado Reg 10-1-1, NY DFS Circular Letter 2024-7, CA Health & Safety Code §1367.01, state adoption tracker

* Insurance AI use case library: \~20–30 pre-defined insurance AI use cases with default risk profiles, applicable regulations, and typical documentation requirements

* ECDIS data type taxonomy: List of common ECDIS types (credit scores, social media, purchasing habits, court records, biometric data) with default risk classifications

* NAIC AI Systems Evaluation Tool questionnaire structure: Map product output to evaluation tool questions as they are finalized in 2026

* December 1 filing checklist: Interactive checklist of documentation required for Colorado annual compliance report

* Bias testing methodology brief: Reference guidance on quantitative bias testing requirements for life/auto/health under Colorado pending quantitative testing regulation

**Summary Scorecard**

| Factor | Assessment | Signal |
| :---- | :---- | :---- |
| Regulatory mandate active | 25+ states NAIC adoption; Colorado annual filings already required | ✅ Strong |
| Market size (target segment) | \~1,200 regional/specialty carriers in US; each with 5–30 AI systems to assess | ✅ Strong |
| Current solution gap | Consulting-only or spreadsheets; no purpose-built low-cost tool | ✅ Strong |
| Product fit (current build) | NIST AI RMF maps to NAIC safe harbor; core pipeline is correct | ⚠ Moderate — needs insurance data layer |
| Output format fit | Current output is NIST-centric; needs NAIC/Colorado citation layer | ⚠ Gap — fixable |
| Buyer accessibility | Compliance officers at regional carriers; reachable through associations (PLUS, NAMIC, RIMS) | ⚠ Moderate — requires domain credibility |
| Urgency / timing | December 1 annual deadline; NAIC exam tool pilot in 2026; litigation driving board attention | ✅ Strong |
| Competitive moat | First mover in purpose-built per-system assessment for NAIC compliance at this price point | ✅ Strong if executed quickly |

| FINAL TAKE:  Insurance is the right first vertical. The regulatory environment is clear, the compliance need is active, and the market gap is real. The product requires a targeted data layer addition — approximately 2–4 weeks of engineering to add insurance regulatory mappings and use case vocabulary — before a credible pilot conversation. The consulting channel through Baker Tilly or equivalent is the fastest path to a credible first paid engagement. |
| :---- |

— End of Report —