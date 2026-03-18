# Concepts Backlog

**Last updated:** 2026-03-18

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
- [x] **Primitive interaction tensions** — 6 tensions documented with resolutions and invariants.
- [x] **Multi-agent coordination** — Sequential, parallel, orchestrated composition patterns. Fractal rings. Cross-pipeline governance.
- [x] **New primitives: Error Handling (#13), Identity & Attribution (#14)** — Added with full patterns and ring integration.
- [x] **Cost of governance section** — Proportional activation, trust ladders as cost optimization, Ring 3 as investment.
- [x] **Internal review cycle (2 rounds)** — All critical/important issues resolved.
- [x] **External review prompts created** — For GPT, Gemini, Claude Opus.
- [x] **Opus external review complete** — Review captured at `review-prompts/opus-review-round1.md`
- [x] **Gemini external review complete** — Captured in session, synthesis in this backlog
- [x] **GPT external review complete** — Review at `review-prompts/agentic_primitives_adversarial_review.md`
- [ ] **Personal vs. enterprise scoping** — Which primitives simplify for personal agent use?
- [ ] **Map current pipeline to primitives** — Which are implemented, partially, missing.
- [ ] **Ring activation patterns** — Which ring combinations are valid and when.

## Priority 2: Agentic Observability (Updated — Needs Diagrams + Review)

- [x] **Update doc to reference Agentic Primitives** — Three roles (quality, security, governance), full primitive mapping, event architecture, correlation engine (18 rules), playbooks, zero trust monitoring, maturity model. DONE.
- [x] **Expand SIEM analogy with security events** — Event taxonomy covers all rings + security cross-cutting. DONE.
- [x] **Correlation rule patterns** — 18 rules across quality, security, and governance domains. DONE.
- [x] **"What this is NOT" sharpening** — Differentiated from LLM observability, APM, GRC, AND traditional SIEM. DONE.
- [ ] **Diagrams** — Observability architecture (three roles), event flow through rings, correlation engine, security detection layer, maturity model visualization. Run through Diagram Forge.
- [ ] **Internal review** — Same process as primitives.
- [ ] **External review** — After internal cycle. Create review prompt tailored to observability (focus on SIEM analogy viability, correlation rule completeness, market positioning).
- [ ] **Reference architecture** — How does an org deploy this? OTel integration. Connection to DI event streams.
- [ ] **Market landscape deep dive** — ServiceNow AI Control Tower, Fiddler AI, Arize, Galileo, Arthur AI, OTel GenAI. Detailed gap analysis.

## Priority 3: Decision Intelligence (Updated — Needs Diagrams + Review)

- [x] **Update to reference Agentic Primitives** — Mapped all 16 primitives, ring architecture, zero trust overlay, deployment modes, composition patterns. DONE.
- [ ] **Diagrams** — Decision Intelligence architecture, ring mapping, belief revision cascade, multi-agent decision pipeline. Run through Diagram Forge.
- [ ] **Internal review** — Same process as primitives: structured review, fix issues, iterate.
- [ ] **External review** — After internal cycle. Create review prompt tailored to decision intelligence (focus on belief layer novelty, RDG viability, market positioning).
- [ ] **Positioning vision section** — Strengthen category positioning narrative for buyers/investors.
- [ ] **Revenue gate per phase** — Each build phase needs a funding answer.
- [ ] **Belief layer complexity vs. adoption** — Buyer language for belief revision.

## Priority 4: Cross-Concept

- [ ] **Relationship model** — Two products? One platform? Adjacent? Document the architectural relationship.
- [ ] **Shared vocabulary doc** — Consistent terminology across all three concept docs.
- [ ] **Bridge to assessment pipeline** — How concepts feed back into risk tools roadmap.
- [ ] **Next primitive to implement** — Select and spec for the pipeline.
- [ ] **Observatory as first Agentic Observability implementation** — Scope the pipeline observatory as proof of the broader concept.

## Content & Publication

- [ ] **White paper: Trust Ladders** — How agentic systems earn autonomy. Strongest standalone piece. Source: Anthropic agent autonomy research + DeepMind delegation paper.
- [ ] **Architecture post: The Rings Model** — Concentric architecture for governed agentic systems. Diagram + write-up.
- [ ] **Post: Validation Loops with Convergence Gates** — Self-improving pipeline pattern. Engineering audience.
- [ ] **Post: Adversarial Critique as Structural Pattern** — Producer/verifier separation for AI.
- [ ] **Post: "The box can get smarter but cannot grow itself"** — Bounded AI autonomy framing.
- [ ] **Architectural diagrams** — Rings diagram, composition patterns, ring interface flow. Visual assets.

## Project Identity

- [ ] **Project name decision** — Candidates: Agentic Governance Framework (AGF), Agentic Governance Playbook, Agentic Safety Compass, Meridian. Considerations: community adoption (memorable single word vs. clear descriptive acronym), alignment with humility/service philosophy, standards-body-friendly, reflects synthesis-not-invention positioning. Decision needed before publication.

## Captured / Parking Lot

- [ ] Trust ladder portability — Transfers within context boundary but not across (Anthropic data)
- [ ] Memory routing at scale — Namespace + semantic search (partial answer in primitives doc)
- [ ] Graph storage timing — When does Postgres-first hit its limits for Decision Intelligence?
- [ ] Agentic Observability pricing model — Per event volume? Per agent? Per audit package?
- [ ] Event schema standardization — OpenTelemetry GenAI conventions as baseline
- [ ] Multi-agent trust inheritance — Does Pipeline B inherit Pipeline A's trust level?
- [ ] Testing ring configurations — Proactive testing before deployment, not just rollback
- [ ] Determinism spectrum — When to use LLM vs. deterministic execution for actions
