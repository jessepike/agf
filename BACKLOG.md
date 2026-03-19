# Concepts Backlog

**Last updated:** 2026-03-18 (profiles backlog added)

---

## Priority 0: External Review Findings (Address Next)

Cross-review synthesis from Opus, Gemini, and GPT adversarial reviews. All three landscape research reports complete (Gemini standards, GPT industry, Claude academic). Strategic positioning documented.

### Structural Decisions (make before next rewrite)

- [x] **Security dimension** — Resolved: three-level security model (Security Fabric + Security Governance + Security Intelligence) with Security Response Bus for pre-authorized fast-path containment. Pressure-tested against OWASP Top 10 for Agentic Apps and CSA ATF. Four additions: objective attestation, semantic evaluation interface, introspection authority, cross-level coordination protocol. Written into `agentic-primitives.md`.
- [x] **Ring deployment modes** — Expanded all three modes (wrapper, middleware/interrupt, graph-embedded) with full architectural treatment: per-mode specs for verification, governance, Security Response Bus, and checkpointing. Added selection matrix, governance/latency tension analysis, hybrid deployment pattern, and dynamic mode escalation for high-stakes situations. Written into `agentic-primitives.md`.
- [x] **Framing** — Core Thesis rewritten as synthesis framework positioning. Four explicit contributions named (composition, Rings Model, tensions, security model). "What This Framework Is / Is Not" section added. Consistent language: "named, not coined," "the composition is the work." No overreach claims found elsewhere in doc.

### New Primitives to Add

- [x] **Transaction / Side-Effect Control** — Written as Primitive #16. Pre-commit/commit/post-commit, reversibility, compensation, idempotency, stale-approval invalidation, partial-execution state.
- [x] **Data Governance / Confidentiality** — Written as Primitive #17. Data classification at ingestion, PII detection/handling, consent/purpose binding, data lineage, memory privacy, retention/deletion, cross-boundary controls. Aligned to CSA ATF, GDPR, EU AI Act.
- [x] **Security / Adversarial Robustness** — Addressed in security architecture section. Three-level model with OWASP threat mapping, CSA domain mapping, Security Response Bus, objective attestation, and introspection authority. Primitive #15 updated with cross-reference.
- [x] **Evaluation & Assurance** — Written as Primitive #18. Pre-deployment evaluation, regression testing, adversarial red-teaming, policy test harnesses, simulation environments, configuration change approval tiers, continuous assurance. Aligned to NIST AI RMF Measure, EU AI Act, UK AISI Inspect, METR.

### Fixes to Existing Content

- [x] **Cross-ring iteration budget** — Added execution_budget to composability interface context (max_iterations, max_cost, max_wall_clock, budget_exhausted → HALT).
- [x] **REVISE(context) + transaction semantics** — Added to composability interface: no blind re-execution after side effects, idempotency keys carry across revisions, stale-approval invalidation, compensation for partial execution, approval expiration with material change detection.
- [x] **Fix attribution** — Garry's List → Anthropic agent autonomy research. DONE.

### Important — All Addressed

- [x] **Reframe git as reference implementation** — Already reframed in Composability Interface: "The enduring primitive is versioned, auditable, reviewable control-plane state — not any specific versioning tool." Git is reference implementation. "Where git is not enough" section covers alternative mechanisms.
- [x] **Real-time / streaming scenario** — Addressed in Ring Deployment Modes expansion. Graph-Embedded mode covers concurrent execution, speculative execution, release gates, latency-constrained activation.
- [x] **Governance collapse rule for fractal rings** — Added to Multi-Agent Coordination. Outermost Ring 2 authoritative on scope conflicts. Leaf-level Ring 2 final within scope. Max 3 nesting levels recommended.
- [x] **Cross-ring concern routing** — Added to Multi-Agent Coordination. Findings annotations (advisory) on any signal. Security events emitted to observability fabric. Annotations don't change the signal — they surface cross-ring concerns.
- [x] **DELEGATE / ESCALATE_TO_PEER signal** — DELEGATE(target, context, scope) added to composability interface signals. Ring 2 may return DELEGATE.
- [x] **Human interface requirements at gates** — Added to Composability Interface. Evidence presentation, counterfactual framing, rubber-stamping detection, timeout behavior (fail-closed default), cognitive load management, batch approval rules.
- [x] **Prior art mapping** — New section: Prior Art Mapping. NIST AI RMF (4 functions mapped), EU AI Act (Articles 9-15 mapped), OWASP/CSA (cross-referenced to Security Architecture), OTel GenAI (4 conventions mapped + governance extensions), MCP/A2A (protocol governance mapped).
- [x] **Novelty framing** — Addressed in Core Thesis rewrite.
- [x] **Cost section expansion** — Added Real Cost Drivers table (6 cost categories: human review bandwidth, policy authoring, eval maintenance, trace storage, incident response, governance debt).
- [x] **Minimum viable ring stack** — Added to Cost of Governance. Ring 0 + Ring 1 + thin Ring 2 + fabric + Ring 3 advisory only. Clear description of what it provides and what it doesn't.
- [x] **Cross-system trust** — Added to Multi-Agent Coordination. Federated trust, protocol-level identity (OAuth 2.1, OIDC, SPIFFE), capability discovery, policy translation.

### Suggestions — Consider for future iterations

- [ ] **Evaluate #4 (Adversarial Critique) status** — Opus and GPT both say it's a tactic, not a primitive. Consider reframing as a variation of #1 or merging.
- [ ] **Evaluate #3 (Self-Improving Cycles) durability** — All three rank bottom 3. May be subsumed by model-layer improvements. Needs stronger "why it endures" or honest limitation.
- [ ] **Add missing tensions** — Observability vs. Privacy (partially addressed in Open Questions), Multi-Agent Autonomy vs. Global Coherence, Speed of Learning vs. Stability, Explainability vs. Capability (Opus). Autonomy vs. Predictability, Tool Access vs. Attack Surface (Gemini).
- [ ] **Strengthen Tension 6 resolution** — Config/policy boundary blurs in practice. Quality thresholds that affect customers are arguably policy.
- [ ] **Determinism spectrum** — Partially addressed in Open Questions. LLM for understanding, deterministic execution for action.
- [ ] **Depth equalization** — #7 (Bounded Agency) treatment thin relative to its importance.

---

## Priority 0.5: Round 2 External Review Findings (2026-03-17)

Four independent reviews: Claude Opus (adversarial), GPT 5.4 (deep research), Gemini 3.1 Pro (deep research x2).

### Critical — Fixed

- [x] **SAGA venue wrong** — was "ACM CCS 2025", corrected to NDSS 2026. Verified via NDSS proceedings.
- [x] **Objective attestation overclaimed** — split into two tiers: configuration integrity attestation (implementable now) vs. semantic goal-state attestation (research horizon). OWASP mapping updated.
- [x] **DELEGATE cycle prevention** — added depth counter, max_delegation_depth (recommended: 3), chain tracking, cycle detection. Converts to HALT on limit.
- [x] **OTel compatibility overclaimed** — reframed: custom extensions within OTel data model, not native semantic compatibility. Development status acknowledged. Specific convention versions cited (v1.40.0).
- [x] **DeepMind citation verified** — "9-component, 11-axis" confirmed accurate against actual paper (5 pillars organize 9 components + 11 task axes). Gemini's claim of fabrication was itself wrong.

### Important — To Address in Next Iteration

- [x] **Missing prior art** — All 9 sources now integrated: IMDA (4-dimension mapping to primitives), NIST IR 8596 (3 focus areas mapped to security architecture), CSA MAESTRO (7-layer primitive mapping table), SagaLLM, AGNTCY/AAIF, IEEE P2863, UK AISI Inspect, OWASP MCP Top 10 (10 threats mapped to primitives) + Secure Dev Guide, "Mind the GAP". Prior art section substantially enriched.
- [x] **MCP integration** — Integrated into: (1) Middleware/Interrupt deployment mode as canonical implementation with 4 MCP-specific governance concerns (dynamic tool discovery, server trust chain, context-as-attack-surface, session isolation); (2) Security Architecture supply chain trust policy with MCP server trust enforcement; (3) Mode Selection Matrix protocol integration row; (4) Prior Art section updated to reference architecture-level coverage. Defers to OWASP MCP guides for implementation specifics.
- [x] **#18 taxonomy resolution** — Resolved with explicit taxonomy note at top of Primitives section: #1–#17 are runtime primitives, #18 is a lifecycle primitive (CI/CD gate for the ring architecture). Distinction is temporal, not hierarchical. Avoids two-taxonomy complexity while addressing the reviewer concern.
- [x] **Responsibility assignment matrix** — OWASP threat table restructured with explicit Owner (Level) and Owner (Primitive) columns + Supporting column for defense-in-depth. Each ASI threat now has exactly one accountable security level and one accountable primitive. #15/#17/Fabric/Ring 2 boundary clarification added: #15 = external threat surface, #17 = internal data lifecycle, Governance = policy authority, Fabric = enforcement mechanism.
- [x] **NIST NCCoE identity protocols** — SPIFFE/SPIRE (cryptographic workload identity with SVIDs), OAuth 2.1 (user-delegated agent authority), OIDC (federated identity), NGAC (attribute-based access control), and JWT integrated into Identity & Attribution (#14). Protocol-level gaps in MCP and A2A noted. Trust Ladders cross-reference added.
- [x] **Speculative execution formal bounds** — Added to Graph-Embedded Mode: depth limit (3-4, O(n²·⁵) beyond depth 4), entropy constraint (>20% rejection rate excludes action class from speculation), resource budget (compute/token/API ceiling with sequential fallback), side-effect fence (commit buffer for irreversible actions pending gate clearance).
- [x] **EU AI Act mapping corrections** — Art. 6 and Art. 50 already present. Art. 12 tightened with specific logging requirements (input data, output decisions, parameter changes, human intervention events). Art. 13 added anomaly detection requirement. Art. 14 expanded with full oversight capability list + 51.7% ceiling reference. Art. 15 expanded with specific attack-to-primitive mappings (data poisoning → #17, adversarial examples → Fabric, model manipulation → attestation, supply chain → trust policy).
- [x] **NIST AI RMF precision** — All four functions expanded with precise scope language. MAP: context framing + risk identification + categorization (not just classification). MANAGE: broader than trust calibration, includes organizational response planning. "Agentic specializations of" language applied throughout. Each function now explicitly notes what our framework covers vs. what sits above our runtime architecture.
- [x] **Intelligence integrity** — Added as Known Limitation #5 with four mitigations: cryptographic proof for Response Bus activation, pre-authorized response class blast radius limits, Governance dead-man's-switch override, and independent Ring 1 verification of Intelligence itself. Acknowledged as recursive trust problem with defense-in-depth strategy.
- [x] **AgentSpec/AgentGuard distinction** — Security Intelligence "Aligns with" rewritten to show the full spectrum: deterministic enforcement (AgentSpec → Fabric/Policy as Code) → probabilistic verification (AgentGuard → Intelligence behavioral analysis) → proactive prediction (Pro2Guard → Intelligence anticipatory detection). All three pinned with venues/dates.
- [x] **Cost model empirical grounding** — Added four empirical reference points to Cost of Governance: Microsoft AGT 0.43s/7K decisions (policy evaluation), Bifrost 11μs (security fabric), SHAP/LIME 2x compute (explainability), Reflexion 50x tokens (self-improvement). Framed as calibration evidence, not planning constants.
- [x] **SAGA split-plane topology** — Prior Art entry expanded with control/data plane separation: control plane = Ring 2 + Security Governance (token issuance, policy decisions), data plane = Ring 0 execution + Fabric enforcement (direct communication with locally-verified identity). Scalability rationale included.
- [x] **Human oversight 51.7% limit** — Elevated to Core Thesis as "A declared architectural constraint." Explicitly frames human oversight as necessary but insufficient, and positions the ring architecture as the structural guarantee that works *with* human oversight, not *only because of* it.
- [x] **Mode selection matrix gaps** — Four rows added: regulatory jurisdiction, rollback/compensation requirements, observability maturity, concurrent load. Each with per-mode guidance.
- [x] **SentinelAgent and AgentGuard ambiguous citations** — Already pinned in Prior Art (He et al., May 2025; Koohestani et al., ASE 2025; Pro2Guard late 2025). Security Intelligence "Aligns with" now includes full author/venue/date citations.
- [x] **Wrapper mode structural privilege** — Presentation note added to Wrapper Mode section: explicitly states this is a pedagogical choice (sequential structure is easiest to explain), not a recommendation. Most production systems use middleware or graph-embedded mode.

---

## Priority 1: Agentic Primitives (Foundation)

- [x] **Composability interfaces** — Standard ring interface contract (PASS/REVISE/HALT/GATE/ERROR). Five requirements for ring-compatible pipelines. Git as versioning reference implementation.
- [x] **Rings model** — Ring 0 (execution), Ring 1 (verification), Ring 2 (governance), Ring 3 (learning). Cross-cutting fabric (structured output + event observability + error recovery). Time horizons per ring.
- [x] **Primitive interaction tensions** — 7 tensions documented with resolutions and invariants (Tension 7: Environment Optimization vs. Governance Integrity added with #19).
- [x] **Multi-agent coordination** — Sequential, parallel, orchestrated composition patterns. Fractal rings. Cross-pipeline governance.
- [x] **New primitives: Error Handling (#13), Identity & Attribution (#14)** — Added with full patterns and ring integration.
- [x] **Cost of governance section** — Proportional activation, trust ladders as cost optimization, Ring 3 as investment.
- [x] **Internal review cycle (2 rounds)** — All critical/important issues resolved.
- [x] **External review prompts created** — For GPT, Gemini, Claude Opus.
- [x] **Opus external review complete** — Review captured at `review-prompts/opus-review-round1.md`
- [x] **Gemini external review complete** — Captured in session, synthesis in this backlog
- [x] **GPT external review complete** — Review at `review-prompts/agentic_primitives_adversarial_review.md`
- [x] **New primitive: Agent Environment Governance (#19)** — Substrate primitive governing the agent's operating environment: context composition, instruction architecture, capability provisioning, workspace scoping, session state management, and environment optimization loop. Full architectural companion section (Agent Environment Architecture) with 5-layer environment stack, 3 composition patterns, optimization loop diagram, context-as-attack-surface mapping, and recursive governance resolution. Tension 7 added. Prior art mapped (AgentOS, Anthropic context engineering, LangChain, Microsoft MAR, NVIDIA OpenShell, Google ADK). intent.md update pending human approval (18→19 primitives).
- [ ] **Personal vs. enterprise scoping** — Which primitives simplify for personal agent use?
- [ ] **Map current pipeline to primitives** — Which are implemented, partially, missing.
- [ ] **Ring activation patterns** — Which ring combinations are valid and when.

## Priority 1.5: Domain Profiles (2026-03-18)

Five domain profiles decompose the AGF reference architecture for different buyer personas. Three drafted, two planned.

### Meta Document (`docs/agf-reference-architecture.md`)

- [x] **Draft meta document** — Reference architecture overview, core concepts, composition patterns, "Who Uses What" routing, standards alignment, prior art. DONE.
- [x] **Reframe decomposition as market problem** — Different buyers need different entry points. DONE.
- [x] **Drop letter designations** — Profile A/B/C/D/E → named profiles. DONE.
- [x] **Propagate Critical risk tier** — 4-tier risk classification (Low/Medium/High/Critical) consistent across meta doc, platform profile, and GRC profile. DONE.

### Security Profile (`profiles/security-profile.md`)

- [x] **Draft profile** — Three-level security model, OWASP ASI + MCP threat analysis, Response Bus, zero trust, CSA ATF alignment, assessment checklist. DONE.
- [x] **Red team scenarios** — Three worked scenarios: (1) Multi-agent lateral movement (ASI07→ASI03→ASI08) with timeline, defense layers, and weakness analysis; (2) Slow memory poisoning (ASI06) showing temporal gap exploitation; (3) Trust ladder manipulation (ASI09+ASI02) showing gaming patterns. Each with "where AGF holds" and "where AGF is weakest" analysis + practical usage guide. DONE.
- [x] **Incident response playbook structure** — Standard playbook template (detect→contain→investigate→remediate→learn), 8 defined playbooks (PB-01 through PB-08) covering lateral movement, memory poisoning, trust manipulation, supply chain, cascading failure, oversight exploitation, rogue agent, data exfiltration. Escalation paths by severity. Post-incident requirements. DONE.
- [ ] **Verify IMDA date** — GRC profile says "January 2026" for IMDA MGF for Agentic AI. Verify vs. original MGF (Jan 2024). Correct if needed across all docs.
- [ ] **Crosswalk: #16 Transaction Control EU AI Act mapping** — Currently mapped to Art. 15 (Accuracy). Consider Art. 9 (Risk Management) as better fit. Decision needed.
- [ ] **Internal review** — Structured review for accuracy, completeness, threat coverage gaps.
- [ ] **External review** — After internal cycle. Focus on: threat model completeness, practical applicability, any overclaiming in defense posture.

### Platform Profile (`profiles/platform-profile.md`)

- [x] **Draft profile** — Deployment modes, Mode Selection Matrix, Agent Environment Stack, Composability Interface, MCP integration, multi-agent coordination, cost of governance. DONE.
- [ ] **Internal review** — Structured review for accuracy, deployment mode coverage, MCP integration completeness.
- [ ] **External review** — After internal cycle. Focus on: practical implementability, Mode Selection Matrix utility, gap between spec and real-world platform engineering.

### GRC Profile (`profiles/grc-profile.md`)

- [x] **Draft profile** — EU AI Act article mapping, NIST AI RMF alignment, IMDA alignment, CSA MAESTRO mapping, evidence generation guide, governance gates, risk classification. DONE.
- [x] **Fix naming** — Title → "AGF GRC Profile" (was "Compliance Profile"). Consistent with filename and meta doc. DONE.
- [x] **Control crosswalks** — AGF primitive → NIST 800-53 Rev. 5 → ISO 27001:2022 → EU AI Act crosswalk table with usage guidance. 15 rows covering all GRC-relevant primitives + Security Fabric + Response Bus. DONE.
- [x] **Governance maturity model** — 5 levels (Awareness → Foundation → Governed → Adaptive → Optimized) with per-level characteristics table, regulatory posture assessment, and realistic timeline guidance. Sourced from governance framework doc, adapted for GRC audience. DONE.
- [x] **Risk classification decision tree** — Decision tree flowchart with override rules, 5-dimension classification matrix, and documentation requirements. DONE.
- [ ] **Internal review** — Structured review for regulatory accuracy, mapping completeness, evidence sufficiency.
- [ ] **External review** — After internal cycle. Focus on: regulatory precision, auditor usability, any overclaiming in compliance coverage.

### AI Engineering Profile (`profiles/ai-engineering-profile.md`)

- [x] **Draft profile** — Full 19-primitive catalog (implementer-focused summaries with key decisions, ring assignments, distinctions), 5-phase implementation priority (Minimum Viable Control → Verification → Governance → Security & Assurance → Learning), composition patterns with application examples, 7 tensions with invariants, Trust Ladders mechanics, Environment Optimization Loop, prior art (standards, academic, implementation ecosystem), implementation checklist. DONE.
- [ ] **Internal review**
- [ ] **External review**

### Observability Profile (`profiles/observability-profile.md`)

- [x] **Draft profile** — SIEM-for-agents concept, three detection domains (quality/security/governance), canonical event envelope + taxonomy, correlation engine (15 rules across 3 domains), dual-speed detection (sentinels + analysis), operational playbooks with forensic investigation, zero trust monitoring with posture scoring, 5-level observability maturity model, "What This Is NOT" positioning, OTel integration guidance, operations checklist. DONE.
- [ ] **Internal review**
- [ ] **External review**

### Cross-Profile

- [x] **Fix broken cross-references** — Security and Platform profiles now link to AI Engineering Profile + primitives catalog. All observability links now resolve. DONE.
- [x] **Fix parent doc relative paths** — All profiles now correctly link to `../docs/agf-reference-architecture.md`. DONE.
- [x] **External review prompts created** — Three tailored prompts: Claude Opus (adversarial — positioning, cross-profile coherence, audience targeting), GPT 5.4 (deep research — regulatory accuracy, crosswalk verification, threat mapping, OTel alignment), Gemini 3.1 Pro (deep research — practitioner usability, "would I use this?" test, navigation, missing personas). DONE.
- [x] **Run external reviews** — Claude (adversarial), GPT (deep research — regulatory accuracy), Gemini (deep research — practitioner usability). All three complete. DONE.
- [x] **Process critical factual errors** — 10 errors fixed: Art. 62→73, CSA ATF 4 levels (not 5), AGT/Bifrost recharacterized, EU AI Act phased applicability added, Art. 50 expanded, MCP06 renamed, NCCoE softened, ISO control names fixed, MITRE ATLAS added, AGF-vs-EU risk tier mapping added. DONE.

### Remaining External Review Findings (To Address)

**Strategic (next iteration):**
- [ ] **Add "coverage boundary" annotations** to every regulatory mapping — state not just what's covered, but what's NOT (Claude finding)
- [ ] **Add EU AI Act GPAI chapter** (Art. 51-56) as a mapping domain in GRC profile — relevant for all agentic systems built on foundation models
- [ ] **Add competitive landscape references** — AWS Agentic AI Security Scoping Matrix (Nov 2025), Microsoft Azure AI agent governance guidance (Dec 2025), Google Cloud Vertex AI tool governance (Dec 2025), ServiceNow AI Control Tower/Gateway, Salesforce Agentforce governance
- [ ] **Missing personas** — Product Manager profile (UX for governance gates, latency budgets, guardrail design) and Procurement/Vendor Risk profile (third-party agent evaluation rubrics) identified as gaps by Gemini
- [ ] **Per-profile reference artifacts** — each profile needs one concrete implementation artifact: Security (red team payload repo), Platform (MCP OAuth federation reference), GRC (evidence exporter template), AI Engineering (trust calibration algorithms), Observability (OTel config snippets)
- [ ] **Trust Ladders mathematical formalization** — move from conceptual to algorithmic (time-series models, ARIMAX-style calibration, temporal decay)
- [ ] **NIST AI RMF coverage honesty** — add explicit "what AGF covers vs. what sits outside" for each of the 4 NIST functions (GOVERN has 23 subcategories; Ring 2 addresses a subset)
- [ ] **Deployment mode ecosystem nuance** — middleware/interrupt is one of several coequal patterns, not dominant; MCP is connectivity, not governance; LangGraph uses graph-embedded, not middleware
- [ ] **OTel semantic convention proposal** — pursue standardization of AGF governance extensions as OTel semantic conventions for reusable pieces
- [ ] **Primitives doc: fix AGT/Bifrost/Reflexion characterizations** — Bifrost is AI gateway (not security fabric), AGT 0.43s is cumulative (not per-decision), Reflexion 50x needs direct source citation

---

## Priority 2: Agentic Observability (Updated — Needs Diagrams + Review)

- [x] **Update doc to reference Agentic Primitives** — Three roles (quality, security, governance), full primitive mapping, event architecture, correlation engine (18 rules), playbooks, zero trust monitoring, maturity model. DONE.
- [x] **Expand SIEM analogy with security events** — Event taxonomy covers all rings + security cross-cutting. DONE.
- [x] **Correlation rule patterns** — 18 rules across quality, security, and governance domains. DONE.
- [x] **"What this is NOT" sharpening** — Differentiated from LLM observability, APM, GRC, AND traditional SIEM. DONE.
- [ ] **Diagrams** — 9 existing PNG diagrams cover core concepts (Rings, Deployment Modes, Composition, Multi-Agent, Environment Stack, Security Model, OWASP, Zero Trust, Governance-Latency). 6 missing diagrams need Diagram Forge (light theme, match existing): Ring Interface/Composability, Implementation Phases, Event Flow/Observability Architecture, Security Response Bus, Belief Revision Cascade, DI Multi-Agent Pipeline.
- [x] **Internal review** — Added missing primitives (#17, #18, #19) to monitoring mapping. Resolved OTel open question (OTel-compatible base + extensions). Resolved privacy tension (redacted content pattern). DONE.
- [ ] **External review** — After internal cycle. Create review prompt tailored to observability (focus on SIEM analogy viability, correlation rule completeness, market positioning).
- [ ] **Reference architecture** — How does an org deploy this? OTel integration. Connection to DI event streams.
- [ ] **Market landscape deep dive** — ServiceNow AI Control Tower, Fiddler AI, Arize, Galileo, Arthur AI, OTel GenAI. Detailed gap analysis.

## Priority 3: Decision Intelligence (Updated — Needs Diagrams + Review)

- [x] **Update to reference Agentic Primitives** — Mapped all 16 primitives, ring architecture, zero trust overlay, deployment modes, composition patterns. DONE.
- [ ] **Diagrams** — Decision Intelligence architecture, ring mapping, belief revision cascade, multi-agent decision pipeline. Run through Diagram Forge.
- [x] **Internal review** — Added missing primitives (#17, #18, #19) to mapping tables. Fixed Belief Layer overclaim (reframed with prior art: IBIS, Toulmin, Bayesian networks). Added "What This Is Not" section (not chatbot, not GRC, not BI, not human replacement). DONE.
- [x] **External review** — Three independent reviews (Claude adversarial, GPT deep research, Gemini practitioner). All three validated Belief Layer novelty. Critical fixes resolved: RDG reduced from 15 to 9 core types + PROV-O alignment + Agent node added; Claim/Counterclaim merged; Belief Manager moved to Ring 1 as deterministic state machine; cascade protection added (cycles, depth, hysteresis, budget); `suspended` state added; "not a decision automation engine" positioning; prior art citations added (Carneades, AGM, TMS, GSN, PROV-O). Reviews archived. DONE.
- [ ] **Positioning vision section** — Strengthen category positioning narrative for buyers/investors.
- [ ] **Revenue gate per phase** — Each build phase needs a funding answer.
- [ ] **Belief layer complexity vs. adoption** — Buyer language for belief revision.

## Priority 4: Cross-Concept

- [x] **Relationship model** — Cross-concept relationship model documenting: AGF primitives as shared foundation, DI↔AO symbiotic relationship (DI produces events, AO consumes them), product strategy implications (one framework, separate products, cross-sell), shared elements vs. different buyers/problems/moats, relationship to governance framework operating model. At `docs/cross-concept-relationship.md`. DONE.
- [x] **Cross-doc navigation links** — Meta doc links to all 5 profiles with relative paths + updated descriptions. Meta doc links to all 3 concept docs in Deep-Dive Topics. Concept docs (observability, DI) link back to meta doc, primitives, profiles, and each other. DONE.
- [x] **Shared vocabulary doc** — Canonical terminology reference at `docs/shared-vocabulary.md`. Covers: architecture terms (rings, deployment modes, composability interface signals), all 19 primitives with ring assignments, security model terms, governance terms (adaptive/mandatory gates, policy vs configuration, trust levels), risk classification tiers, environment stack terms, observability terms, DI terms (RDG, beliefs, revision cascade), composition patterns, confidence levels, standards abbreviations. DONE.
- [ ] **Bridge to assessment pipeline** — How concepts feed back into risk tools roadmap.
- [ ] **Next primitive to implement** — Select and spec for the pipeline.
- [ ] **Observatory as first Agentic Observability implementation** — Scope the pipeline observatory as proof of the broader concept.

## Content & Publication

- [x] **White paper: Trust Ladders** — "How Agentic Systems Earn Autonomy." AGF White Paper No. 1. Covers: the binary trust problem, the graduated pattern (6 mechanics), empirical evidence (Anthropic data, DeepMind delegation framework, CSA ATF, Engels et al. oversight scaling), AGF integration (governance, learning, security, economics), implementation guidance (metrics, promotion criteria, demotion triggers), the broader principle. At `docs/white-papers/trust-ladders.md`. DONE.
- [x] **Architecture post: The Rings Model** — "A Concentric Architecture for Governed Agentic Systems." AGF White Paper No. 2. Covers: the governance gap, the 4-ring architecture (with fabric + substrate), why concentric rings, logical vs physical (3 deployment modes), signal protocol, progressive composition (5 phases), cost model, honest constraints (oversight limits), prior art. At `docs/white-papers/rings-model.md`. DONE.
- [ ] **Post: Validation Loops with Convergence Gates** — Self-improving pipeline pattern. Engineering audience.
- [ ] **Post: Adversarial Critique as Structural Pattern** — Producer/verifier separation for AI.
- [ ] **Post: "The box can get smarter but cannot grow itself"** — Bounded AI autonomy framing.
- [ ] **Architectural diagrams** — Rings diagram, composition patterns, ring interface flow. Visual assets.

## Project Identity

- [x] **Project name decision** — **AGF: Agentic Governance Framework** — "A Reference Architecture for Governed Agentic Systems." Clear, descriptive, standards-body-friendly, aligns with synthesis positioning. DECIDED.

## Captured / Parking Lot

- [ ] Trust ladder portability — Transfers within context boundary but not across (Anthropic data)
- [ ] Memory routing at scale — Namespace + semantic search (partial answer in primitives doc)
- [ ] Graph storage timing — When does Postgres-first hit its limits for Decision Intelligence?
- [ ] Agentic Observability pricing model — Per event volume? Per agent? Per audit package?
- [ ] Event schema standardization — OpenTelemetry GenAI conventions as baseline
- [ ] Multi-agent trust inheritance — Does Pipeline B inherit Pipeline A's trust level?
- [ ] Testing ring configurations — Proactive testing before deployment, not just rollback
- [ ] Determinism spectrum — When to use LLM vs. deterministic execution for actions
