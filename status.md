---
updated: 2026-04-23
stage: operate (v0.2.0 shipped; release infrastructure scaffolded 2026-04-23)
---

# Status — AGF

**Updated:** 2026-04-23
**Stage:** Operate — v0.2.0 released (2026-04-22); release infrastructure scaffolded (2026-04-23); site update + cross-doc passes queued

## Current State

Agentic Governance Framework v0.1 published. Documentation site live at agf.jessepike.dev. Core framework docs complete. 24 architecture diagrams (3 new macro positioning visuals added 2026-04-21 PM; additional pass in flight 2026-04-22). `DECISIONS.md` active with 9 entries.

**2026-04-23 — Release infrastructure + AGF domain agent scaffolded:**

Built the three buckets from the lifecycle/governance conversation:

**Bucket 1 — Governance scaffolding (this repo):**
- `GOVERNANCE.md` — BDFL model, versioning policy, decision process, evolution path
- `CHANGELOG.md` — Keep-a-Changelog format with retroactive v0.1.0 + v0.2.0 entries
- `VERSION` — `0.2.0`
- `LICENSE-TODO.md` — options flagged (CC-BY-4.0, CC-BY-SA-4.0, Apache-2.0); current LICENSE remains CC BY 4.0, confirmed intentional for adoption-first commercial posture
- `docs/release-playbook.md` — 5-stage pipeline, per-stage detail, rollback procedure
- `docs/tooling-guide.md` — operational reference + sanity tests + troubleshooting

**Bucket 2 — Release scripts (this repo `bin/` + `.githooks/`):**
- `bin/preflight.sh`, `bin/drift-report.mjs`, `bin/sync-to-site.sh`, `bin/lint-mdx.sh`, `bin/check-links.mjs`, `bin/smoke-deployed.mjs`
- `.githooks/pre-push` — 4-stage gate (preflight → lint → links → build)
- One-time setup: `git config core.hooksPath .githooks`
- Commit: `c39f412`

**Bucket 3 — `agf-architect` agent + `agf-release` skill (dev system, outside this repo):**
- Agent at `~/code/_shared/pike-agents/plugins/agf-architect/` — thought partner (80%) + release reviewer (20%); 6 slash commands (`/agf-think`, `/agf-review`, `/agf-crosswalk`, `/agf-primitive`, `/agf-surveil`, `/agf-release`)
- Skill at `~/code/tools/ai-dev/skills/agf-release/SKILL.md`
- Shell launcher: `claude-agf-architect` in `~/.zshrc`
- Registered in capabilities-registry
- Entry in `~/code/_shared/pike-agents/CHANGELOG.md`

**Backlog additions (deferred):** CMO-led public peer review program, primitive stability markers, deprecation policy, citation format standard, reference implementations, challenge ledger. See `BACKLOG.md` § "Community + credibility + adoption (NEW 2026-04-23)".

**Quality scoring / multi-agent review cycle (NEW 2026-04-23):** Discussed but deferred. Jesse has a GPT 5.4 review with scoring + findings to be incorporated when we resume this track. Intended shape: separate `agf-quality-review` skill, periodic multi-reviewer cycle (Architect + Standards + Editorial + Practitioner + Adversarial + External Model), scoring rubric across framework consistency / standards accuracy / evidence discipline / completeness / actionability / novelty defensibility / doc quality / mechanical integrity.

---

**2026-04-22 — GDR primitive promotion (CPO session):**

Promoted Q1 (Governance Decision Record) from change queue to public framework as DECISIONS.md #8 (D16 — Gate Vocabulary Disambiguation) + #9 (D17 — GDR as Canonical Audit Artifact). Three atomic commits:
- `962f2b2` — `feat(decisions): D16 gate vocabulary disambiguation + D17 GDR primitive` — DECISIONS.md rows #5 refined + #8 + #9 added
- `288ddee` — `feat(framework): add Governance Decision Record as canonical audit artifact` — new `docs/governance-decision-record.md` (~440 lines), new `docs/schemas/gdr.yaml` (JSON Schema draft-2020-12), edits to `docs/agentic-primitives.md` (Primitive #8 + Composability Interface inserts), new "Gate Vocabulary" section in `docs/shared-vocabulary.md`, registration in `docs/publication-map.md`
- `078abea` — `docs(consistency): align relationship-to-frameworks gate boundary language with D16/D17` — fixes the D12.4a wording bug propagation in relationship-to-frameworks.md:201

**Process:** Two rounds of Codex external review. Round 1 caught 9 findings (5 accepted unconditionally, 3 accepted with modification, 1 accepted in part). Round 2 caught 5 new defects in v2 (all accepted, biggest = HALT-on-timeout couldn't be modeled because HALT is a Ring Control Signal not a Gate Resolution). Final v3 added five-state lifecycle (`pending / resolved / expired / superseded / aborted`), Lifecycle Invariants table, Default Action on Timeout table, and "Sensitive Content Handling" subsection. EU AI Act Art. 12 + Art. 14 and NIST AI RMF MANAGE 4.1 citations independently verified against primary sources before commit. ISO 42001 clause numbers (7.5/9.3) used with high confidence based on Annex SL but NOT independently verified — logged as backlog item.

**Site update changelist drafted:** `.private/drafts/site-update-changelist.md` — covers all canonical-to-MDX sync needed since 2026-04-21 (v1.0 positioning batch + GDR work + macro diagrams + 3 broken-link fixes from external review + homepage positioning card recommendation). Ready for site manager execution. Estimated 2–4 hours focused effort.

**2026-04-17 — Major positioning work landed in workshop (not yet public):**
- Six-pillar positioning (D12): Category "Agentic Governance" + four verbs (Synthesize/Unify/Prescribe/Operationalize) + OTAA invariant + dual-form principle + tempo taxonomy + NIST CSF parallel
- Seven-layer stack with AGF as architectural substrate at Layer 0 (D13)
- Source extractions from Microsoft (AGT, CAF, Failure Mode Taxonomy, Responsible AI Report, Copilot Studio Gov WP) and CSA (ATF, AICM, MAESTRO, Agentic IAM, Identity Gaps, Securing Autonomous Agents) in `.private/research/extractions-2026-04-17/`

**2026-04-21 PM — Macro positioning visuals generated (CPO session):**

Three high-altitude diagrams produced via diagram-forge (gpt-image-2, quality medium, $0.369 total):

- `diagrams/seven-layer-landscape-stack.png` — AGF as encapsulating container around L1 OWASP → L5 MS AGT stack with Risk Quantification as orthogonal sidebar. Supports DECISIONS #4.
- `diagrams/four-verbs-invariants.png` — Four-verb causal flow (Synthesize → Unify → Prescribe → Operationalize) with shared navy header "EVERY AGF PRIMITIVE MUST:" + BE (OTAA) and PRODUCE (dual-form) peer bands. Supports DECISIONS #3 pillars #2/3/4 and #5.
- `diagrams/reference-architecture-macro.png` — Four concentric rings (Ring 0 center → Ring 3 outermost) with cross-cutting radial sectors (Agentic Observability + Decision Intelligence), 19-primitive legend, NIST CSF Parallel callout. Supports DECISIONS #3 pillar #6.

Canonical prompts saved to `diagrams/DIAGRAM-SPECS.md` for reproducibility.

**2026-04-21 AM — Positioning refinement + promotion complete:**

Workshop session refined positioning, then promoted to public repo in 4 atomic commits:
- `4244707` — `docs(decisions): promote D12-D15 positioning decisions to public DECISIONS.md`
- `bd1b665` — `docs(maturity): rename L1 Awareness to Non-existent; absorb inventory content into L2 Foundation`
- `a2adb27` — `docs(vocabulary): add positioning pillars, harness, maturity, and framework-synthesis terminology`
- `0e04172` — `feat(framework): add relationship-to-frameworks as AGF's canonical position in the governance landscape`

Public artifacts now live:
- `DECISIONS.md` — #3–#7 (positioning pillars, seven-layer stack, gate-boundary dual-form, maturity model, harness definition)
- `docs/relationship-to-frameworks.md` — NEW canonical doc with seven-layer stack, role-based entry points, TOGAF/SABSA context, Trust Ladders↔ATF relationship
- `docs/agentic-governance-framework.md` — maturity model rewritten (L1 Non-existent)
- `docs/shared-vocabulary.md` — 5 new sections (positioning, harness, maturity, identity & credentialing, governance program); standards abbreviations expanded
- `docs/agf-reference-architecture.md` — cross-link added
- `docs/publication-map.md` — Relationship to Frameworks registered
- MDX synced: `agf-docs/content/docs/reference/relationship-to-frameworks.mdx` (new), `governance-framework.mdx` (maturity), `resources/vocabulary.mdx` (vocab)
- `.private/change-queue.md` — Q5 moved to Completed

## Next Steps

1. **Site update execution** — site manager works through `.private/drafts/site-update-changelist.md`. Coordinate with Jesse's parallel diagram work before deploy.
2. **Cross-doc integration passes for GDR** (P1 backlog) — update `docs/profiles/grc-profile.md` Evidence Artifacts table to reference GDR as the format; add GDR `decision_id` reference to observability event payloads in `docs/profiles/observability-profile.md`; RDG → GDR export format spec in `docs/decision-intelligence.md` (P2). Closes the cross-doc coherence loop.
3. **Primitive #8 timeout-behavior prose cleanup** (P1 backlog, NEW from this session) — the canonical doc itself conflates HALT (Ring Control Signal) with ESCALATE (Gate Resolution) in default-action prose. Surfaced by Codex round 2 review while drafting GDR. Revise to describe the three valid default actions (ESCALATE, REJECT, HALT) per the Default Action on Timeout table now in `docs/governance-decision-record.md`.
4. **Original gate-boundary dual-form audit** (was P1) — partially superseded by D17/GDR. Remaining work: audit Composability Interface for dual-form emission per signal type; audit Primitive #11 (Trust Ladders) — promotions/demotions are Domain Outcomes that emit GDRs.
5. **Primitive #14 Identity & Attribution upgrade** — 10-point spec ready in `.private/research/extractions-2026-04-17/ms-docs-and-csa-identity.md` §11
6. **Primitive #15 rename to "Agent SRE"** + SLO/error-budget/chaos additions
7. **Profile doc upgrades:** security-profile MS Failure Mode Taxonomy section + AICM crosswalk; GRC-profile AGF↔ATF maturity crosswalk
8. **Intent.md review** — produce DIFF PROPOSAL (not edit) against new pillars (DECISIONS.md #3)
9. **Content production** via pike-acm (Campaign 03: AGF series C3-003+) — positioning now stable enough to resume; three macro visuals ready to anchor content
10. **Publishable content candidate:** "Agentic Compliance Blind Spots" 10-gap analysis (source: `.private/research/extractions-2026-04-17/aicm-and-ms-failure-modes.md` §14)
11. **Q3 (Tool Governance) promotion** — first GDR domain application; depends on this session's GDR primitive landing (now done). Source: `.private/inbox/AGF-Tool-Governance-v2.md`. Ready when prioritized.
12. **ISO 42001 clause verification** (LOW) — confirm Clauses 7.5 + 9.3 against official ISO text (paywalled); soften GDR doc Standards section if numbers are wrong.

## Blockers / Open Questions

None blocking. Positioning foundation is public and stable.

## Detail

Full session log at `.private/status.md` (2026-04-17 entry).
