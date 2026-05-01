# AGF Primer

A one-pass orientation to the Agentic Governance Framework for first-time readers and for agents loading project context. Updated with major releases. Canonical sources are named throughout (`code spans` for paths) — read those when depth is needed.

**Last updated:** 2026-05-01 · **Reflects:** v0.2.0 (shipped 2026-04-22) plus unreleased v0.3 content passes shipped through 2026-04-25. **F33** (first adopter case study) remains the sole open structural blocker on M03.

---

## In one sentence

AGF is a reference architecture and operating model for organizations developing **safe, secure, durable, auditable, and observable** agentic systems — synthesizing the best work from NIST, OWASP, CSA, ISO, IEEE, OpenTelemetry, the EU AI Act, Singapore IMDA, and academic research into a coherent, implementable playbook.

## What AGF is

**Synthesis, not invention.** The agentic governance landscape is fragmented across standards bodies, threat taxonomies, trust frameworks, management systems, observability standards, and vendor control planes. AGF pulls these together: it sorts the pieces, names what's missing, and proposes a coherent view of how organizations should govern agentic systems. Where AGF coins new constructs, it attributes clearly and labels confidence.

**Six positioning pillars** (DECISIONS.md #3):

1. **Category stake** — Agentic Governance, narrower than AI governance.
2. **Four verbs** — every primitive Synthesizes, Unifies, Prescribes, Operationalizes.
3. **OTAA invariant** — every primitive must be Observable, Traceable, Auditable, Agent-operable.
4. **Dual-form principle** — every primitive emits machine-consumable AND human-decidable artifacts simultaneously. Load-bearing at gate boundaries (D5).
5. **Tempo taxonomy** — wire-speed enforcement (<1ms), near-realtime supervision (sec–min), human-speed governance (hours–weeks).
6. **NIST CSF parallel** — AGF Rings are to agentic governance what CSF Functions are to cybersecurity.

**Core constructs:**

- **19 primitives** — runtime patterns (#1–#17), one lifecycle primitive (#18 Evaluation & Assurance), one substrate primitive (#19 Agent Environment Governance). Named patterns, not invented from scratch.
- **Rings Model** — Ring 0 Execution → Ring 1 Verification → Ring 2 Governance → Ring 3 Learning. Cross-cutting fabric. Not phases — concentric activation.
- **Three-level security architecture** — Fabric, Governance, Intelligence, with a Security Response Bus.
- **Three deployment modes** — wrapper, middleware/interrupt, graph-embedded.
- **Composability Interface** — six Ring Control Signals (`PASS / REVISE / HALT / GATE / DELEGATE / ERROR`) for primitive-to-primitive signaling across rings.
- **Gate vocabulary (D8)** — four distinct enums: Ring Control Signal · Gate Resolution (`APPROVE / REJECT / MODIFY / DEFER / ESCALATE`) · Domain Outcome (domain-defined) · Audit Artifact (GDR).
- **Governance Decision Record (GDR, D9)** — canonical machine-form artifact serializing every Gate Resolution and Domain Outcome. Schema at `docs/schemas/gdr.yaml`. Provides evidence in support of EU AI Act Art. 12, NIST AI RMF MANAGE 4.1, ISO 42001 documentation clauses.
- **Composition Patterns (D10)** — four progression patterns: Minimum Viable Control → Validation Pipeline → Governed Decision Flow → Full Governed Agentic System. "Hardened" is a posture modifier, not a fifth pattern.
- **Maturity model (D6)** — five program-level levels: L1 Non-existent → L2 Foundation → L3 Governed → L4 Adaptive → L5 Optimized. Complementary to (not substituted for) CSA ATF's per-deployment 4-tier autonomy scale.
- **Confidence gradient** — Established (broad evidence) / Informed (single-source synthesis) / Open (flagged speculative). Applied to load-bearing empirical and novel claims across the orientation path and flagship pages; not yet uniform across deeper docs (tracked under M03/F33).
- **Harness (D7)** — `Agent = Model + Harness`. Industry-standard term. Source artifacts + runtime enforcement adapters, inseparable.

**Seven-layer stack** (D4): AGF as architectural substrate at Layer 0, under threat baseline (OWASP Agentic), threat modeling (CSA MAESTRO + Microsoft Failure Mode Taxonomy), control catalogs (CSA AICM, ISO 42001/27001, NIST 800-53, EU AI Act Annexes, BSI AIC4), operating model (CSA ATF), and runtime references (Microsoft AGT, CAF, Agent 365). Risk quantification (FAIR, FAIR-CAM, ISO 31000) is orthogonal.

## What AGF is NOT

- **Not a tool, product, or SaaS.** It is documentation + reference architecture under CC BY 4.0.
- **Not a replacement** for NIST / OWASP / CSA / ISO / EU AI Act. AGF synthesizes them and fills agentic-specific gaps.
- **Not a control catalog.** AGF primitives crosswalk to AICM/ISO/NIST controls; AGF doesn't replicate catalog content.
- **Not a maturity certification.** AGF defines criteria; it doesn't credential adopters. No accreditation body.
- **Not GRC re-skinning.** Traditional GRC is content; AGF is method, primitives, and signals tuned to probabilistic/agentic behavior.
- **Not vendor-aligned.** Microsoft AGT/CAF/Agent 365 are AGF's current Layer 5 runtime references because they are public, ATF-conformant, and most mature today. AWS, Google, Salesforce, and open-source stacks are treated neutrally and not endorsed; profile docs will expand coverage as other runtimes reach production maturity.
- **Not opinionated on stack** — primitives are deployment-mode-agnostic.

## How it gets used

| Audience | Entry point | Primary value |
|---|---|---|
| First-time reader | `docs/agf-reference-architecture.md` | Tour of the whole framework |
| 30-day starter | `agf-docs/content/docs/overview/first-30-days.mdx` | Minimum Viable Control workplan |
| End-to-end walkthrough | `agf-docs/content/docs/overview/reference-walkthrough.mdx` | Refund scenario across Rings 0–3 with GDR examples |
| CISO / Security | `docs/profiles/security-profile.md` | Threat surface, primitive-to-control mapping, three-level security |
| GRC / Compliance | `docs/profiles/grc-profile.md` | Standards crosswalks, evidence artifacts (GDR), maturity criteria |
| Platform / SRE | `docs/profiles/platform-profile.md` | Deployment modes, observability profile, agent SRE |
| AI Engineering | `docs/profiles/ai-engineering-profile.md` | Composition patterns, Rings, primitive composition |
| Observability | `docs/profiles/observability-profile.md` | OTel-aligned event taxonomy, three-layer observability |

The framework's top-level operating model (`docs/agentic-governance-framework.md`) defines five governance functions — Discover, Assess, Govern, Monitor, Evolve — and provides agent lifecycle, risk classification, persona model, and enterprise integration points.

## Where AGF is being built (and not)

**Recently shipped (post-v0.2.0, on `main`):**
- Confidence-gradient discipline propagated across flagship pages (Path A, 2026-04-25).
- GDR cross-doc integration into profile docs + per-signal dual-form table on Composability Interface (2026-04-25).
- Composition Patterns canonicalized; "Phase 1–5" retired (2026-04-24).
- Site at agf.jessepike.dev — 33 routes including transparency surfaces (changelog, decisions, roadmap, contribute).

**Open structural blockers:**
- **F33** — first adopter case study. M03 (strategic-meta public-readiness) is accepted as a continuous quality dimension; M03 cannot reach `pattern-closed` until at least one written walkthrough from a real implementation lands. Cannot be manufactured editorially.

**Not building (deliberate scope):**
- No reference implementation code in this repo. Tooling lives in adjacent repos under Apache-2.0/MIT (e.g., agent-harness CLI).
- No certification scheme or accreditation body.
- No commercial product surface within AGF itself.
- No vendor-specific profile.

**Backlog candidates (Tier 2):** Agentic Compliance Blind Spots 10-gap analysis · GDR machine-form schema validators · Maturity-level conformance criteria · Primitive #14 Identity & Attribution upgrade · Primitive #15 → Agent SRE · MI-F07 lint hygiene.

## How AGF evolves

**Versioning:** SemVer-ish. v0.x = pre-1.0 stabilization. v1.0 ships when external attestation crosses an adoption-proof threshold.

**Change discipline:**

- Substantive change → `DECISIONS.md` entry with rationale and alternatives considered.
- Release → `CHANGELOG.md` (Keep-a-Changelog).
- Concept-level changes workshopped in `.private/` and promoted via `.private/change-queue.md`.
- External reviews ingested verbatim under `docs/reviews/` with findings extracted to `docs/findings-ledger.md` and tracked through resolved → validated lifecycle.
- Confidence markers (`<Confidence level="..." />`) required on novel or unverified claims.

**Living artifact, not monument.** When research emerges, technologies shift, or community feedback surfaces real gaps, AGF updates honestly. See `intent.md` for the full philosophy.

## Sacred + live files

- `intent.md` — north star. Sacred. Never auto-edit; surface proposed changes for human decision.
- `DECISIONS.md` — append-only architectural decision log.
- `CHANGELOG.md` — Keep-a-Changelog per release.
- `status.md` — current operational state, dated handoffs.
- `BACKLOG.md` — prioritized work queue.
- `lessons.md` — hot buffer of recent insights.
- `docs/findings-ledger.md` — review findings + lifecycle state.
- `docs/reviews/README.md` — review format spec, scoring rubric, Meta-Finding Closeout Protocol.

## For agents working in this repo

1. On session start, read this primer first, then `.private/agf-strategic-intent.md` (when work is strategy-adjacent), then `status.md`, then `BACKLOG.md`. Read `intent.md` and `lessons.md` next; load deeper canonical docs (`docs/*.md`) on demand. (`.claude/CLAUDE.md` lists the full context map.)
2. Treat `intent.md` as sacred — surface, don't edit.
3. Concept changes go through `.private/change-queue.md`, not direct commits.
4. New primitive, vocabulary change, or novel framing → `DECISIONS.md` entry required; release → `CHANGELOG.md` entry required.
5. Time-sensitive empirical claims need dated sources (G5-F20 pattern).
6. Use confidence markers for novel or unverified claims.
7. Canonical `docs/*.md` is source of truth; `agf-docs/content/docs/*.mdx` is derived. Edit canonical first, then sync.
8. Large file: `docs/agentic-primitives.md` (~150KB) — read by section, never whole.
9. License posture: CC BY 4.0 for framework docs; Apache-2.0/MIT for any reference implementations.
10. Strategic intent (commercial / portfolio / Year-1 trajectory) lives in `.private/agf-strategic-intent.md`. Read alongside this primer when making strategy-adjacent decisions.

For deeper agent operating rules (commit conventions, F-ID references, voice guide, change queue protocol), see `CLAUDE.md` and `.claude/CLAUDE.md`.
