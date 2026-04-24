---
updated: 2026-04-24
stage: operate (v0.2.0 shipped; validation pass complete 2026-04-24; v0.3 content release queued)
---

# Status — AGF

## Handoff — 2026-04-24 (close — 5 commits pushed to origin)

**From:** agf-architect session — Sonnet 4.6 + Codex (gpt-5.4) collaboration
**To:** Next session (model tier depends on path chosen — see sequencing below)
**Tree state:** Clean. Origin/main at `9af96c5`. GitHub Actions smoke workflow will fire post-deploy automatically.

**What shipped this session (5 commits):**

| Commit | Summary |
|---|---|
| `532aa91` | Ledger Mode C validation pass — 15 findings validated, counter drift fixed, MI-F04/F05 detail-state reconciled |
| `cf807cc` | Session wrap — validation outcome captured in status/lessons |
| `bd7d32c` | Codex handoff — meta-finding closeout protocol draft at `.private/drafts/` |
| `ed07ba7` | Rings-model v6 canonical — supersedes v1, prompt archived in DIAGRAM-SPECS, site copy synced, BACKLOG rings-model + MI-F03/F04/F05 closed |
| `9af96c5` | Meta-finding closeout protocol canonized to `docs/reviews/README.md` with cross-ref from `docs/findings-ledger.md` |

**New AGF canon:** Meta-finding closeout protocol. Lives at `docs/reviews/README.md § Meta-Finding Closeout Protocol`. Three verdicts (`pattern-closed` / `pattern-persists` / `pattern-shifted`) map onto existing lifecycle. Tiered reviewer independence (Strong/Acceptable/Weak) with scaling rule — higher-stakes metas require multiple reviewers with different models. Strategic-meta rule: G5-M03 and any dimension-tied meta require BOTH re-read AND scorecard re-score at ≥8/10 by independent reviewer. `pattern-persists` requires at least one new concrete child filed (no rationale-only hold-open).

**Scorecard (unchanged from 6.38/10 — this session was validation + governance, not content):**
Clarity 7 · Coherence 6 · Defensibility 7 · Differentiation 7 · **Actionability 4 (stuck)** · Credibility 6 · Public Readiness 7 · Mechanical 7

**Next session sequence (agf-architect recommendation — unchanged from earlier in session; Jesse deferred on pick):**

1. **Cohesion Pass v0.3** (G5-F09, F15, F16, F18 + M02) — 3–4h · Opus for vocabulary decisions then Sonnet for editorial execution
2. **Transparency pages** (`/changelog`, `/decisions`, `/roadmap`, `/contribute`) — 1h · Sonnet · independent
3. **Cluster D — Actionability** (G5-F12, F13) — 3–4h · Opus · reference walkthrough + 30-day MVC path
4. **Credibility Pass v0.3** (G5-F03, F14, F20 + M01) — 3–4h · Sonnet · runs last

**Rationale for Cohesion-first:** vocabulary decisions in F09/F15/F16 are prerequisites for clean Cluster D prose. Cohesion-before-content is the general principle.

**Meta-finding closeout triggers (none ready yet):**
- G5-M01 (rigor promise) — triggerable after Credibility Pass v0.3 ships
- G5-M02 (naming density) — triggerable after Cohesion Pass v0.3 ships
- G5-M03 (public readiness) — triggerable after both + Cluster D; also requires Public Readiness re-score at ≥8/10 by independent reviewer

**No open blockers. No residual housekeeping.**

---

## Handoff — 2026-04-24 (Codex meta-finding closeout protocol draft) — SUPERSEDED

Meta-finding closeout protocol draft landed in `.private/drafts/meta-finding-closeout-protocol-codex.md` during session; canonized via Jesse's decisions to `docs/reviews/README.md` in commit `9af96c5`. Open decisions (fresh-eyes tier, ledger field, scorecard threshold) all resolved — see top-of-file handoff for applied answers.

---

## Handoff — 2026-04-24 (agf-architect Mode C validation + sequence recommendation)

**From:** agf-architect (Sonnet 4.6) — short session following 2026-04-23 evening handoff
**To:** Next session (model depends on path — see sequence recommendation below)
**Context:** Executed handoff path 1 (Mode C batch validation) against the 15 findings resolved 2026-04-23 evening. All 15 validated, no regressions. Ledger bookkeeping cleaned up (stale counters, MI-F04/F05 detail-state contradictions). Commit `532aa91` on main, not pushed.

**What shipped:**
- `docs(ledger): validate 15 resolved findings + fix stale counters` (532aa91) — Mode C verdicts, counter corrections, MI-F04/F05 detail state lines, Cluster A trajectory annotation, top-of-doc Validation passes register

**Proposed v0.3 sequence (agf-architect recommendation — Jesse pending decision):**

1. **Cohesion Pass v0.3** (G5-F09, F15, F16, F18 + M02) — 3–4h · Opus for 30-min vocabulary decisions (F09 canonical-model pick, F15 governance-sense audit, F16 observability three-layer spec), then Sonnet for editorial execution
2. **Transparency pages** (`/changelog`, `/decisions`, `/roadmap`, `/contribute`) — 1h · Sonnet · independent, slot anywhere
3. **Cluster D — Actionability** (G5-F12, F13) — 3–4h · Opus · reference walkthrough + 30-day MVC path; biggest differentiation move
4. **Credibility Pass v0.3** (G5-F03, F14, F20 + M01) — 3–4h · Sonnet · runs last; audits whatever's final across all shipped content

**Rationale for Cohesion-first:** G5-F09 (4 patterns vs 5 phases), G5-F15 (governance overload), G5-F16 (observability taxonomy) are dependencies for Cluster D. If Cluster D ships first, Cohesion has to chase rewrites across freshly-shipped content. Cohesion-first gives Cluster D a clean vocabulary substrate.

**If Jesse disagrees** — Cluster D first is defensible (Actionability 4/10 is the most visible gap). Credibility Pass first is defensible (infra shipped; pure execution).

**Meta-findings still open:** G5-M01 (rigor/evidence promise), G5-M02 (naming density), G5-M03 (public-readiness unevenness) — these are holistic patterns, NOT closeable by child validation alone. Need separate holistic re-read pass when v0.3 content passes land.

**Scorecard after this session:** 6.38/10 composite (unchanged — validation doesn't move scores). Clarity 7 · Coherence 6 · Defensibility 7 · Differentiation 7 · **Actionability 4 (stuck)** · Credibility 6 · Public Readiness 7 · Mechanical 7.

**Branch state:** main is 1 commit ahead of origin/main (532aa91). Push at Jesse's discretion.

---

## Handoff — 2026-04-23 21:45

**From:** Sonnet 4.6 deep working session (Opus-planned, Sonnet-executed)
**To:** Fresh session (next day or later) — model tier depends on task chosen below
**Context:** Four review clusters shipped, composite scorecard 5.25 → 6.38, three-layer release automation live. All commits deployed to agf.jessepike.dev (10b2829 latest). Session exited mid-triage — Clusters D (Actionability) and two v0.3 content passes remain.

**Next actions (pick one path):**

1. **Validate what shipped** — run `claude-agf-architect` and use `/agf-review --validate <F-ID>` against the 13 resolved findings. Catches anything this session's author graded wrong. Best first move if any doubt on the work. ~45 min. Sonnet is fine.
2. **Cluster D — Actionability** (G5-F12, F13, plus BACKLOG items) — real 3-4h workstream: end-to-end reference walkthrough, 30-day Minimum Viable Control starter path, adopter archetypes. Biggest remaining quality lift. **Opus recommended** (strategic content shaping).
3. **v0.3 content release prep** — Credibility Pass + Content Cohesion Pass are both queued in BACKLOG as P1. Each is ~3-4h. Ship together as v0.3. **Sonnet** for both (execution-heavy, strategy already set in ledger).
4. **Transparency pages** (`/changelog`, `/decisions`, `/roadmap`, `/contribute`) — currently Backlogged; recommended promotion to P1. ~1h. **Sonnet**.

**Key files the next session must read:**

- `docs/findings-ledger.md` — full finding state, scorecard trajectory, cluster notes
- `BACKLOG.md` — Credibility Pass v0.3 + Content Cohesion Pass v0.3 + Tooling refinement sections
- `docs/reviews/README.md` — review format spec, rubric, lifecycle
- `docs/release-playbook.md` — three-layer automation now documented here
- `CLAUDE.md` — one-time per-clone: `git config core.hooksPath .githooks` if working in a fresh checkout

**Known gotcha:** Pre-push hook activation in THIS clone only. A fresh clone won't have it active. One command fixes it; documented in CLAUDE.md.

**Not shipped this session but worth eyeballing on live site:**
- Homepage hero definition + "What AGF is / is not" grid + Confidence badges
- `/docs/reference/confidence-levels` (now position 2 in Reference nav)
- `/docs/reference/primitives` Primitive Attribution section
- `/docs/overview/core-concepts` new orientation page

**Model recommendation:** **Sonnet 4.6** for paths 1, 3, 4 (execution-heavy; strategic framing already set in `docs/findings-ledger.md` and `BACKLOG.md` — this is content shipping + validation, not strategy). **Opus 4.7** for path 2 (Cluster D Actionability) — reference walkthrough, adopter archetypes, and 30-day starter require strategic content shaping and structural decisions that benefit from Opus depth. Default to **Sonnet** unless going straight to path 2.

---

**Updated:** 2026-04-23 (evening session)
**Stage:** Operate — v0.2.0 released (2026-04-22); release infrastructure + review process shipped (2026-04-23); 4 deploys live on agf.jessepike.dev; v0.3 content passes queued

## 2026-04-23 (evening session) — Review ingestion, 4 clusters shipped, 3-layer release automation

**What landed (7 commits, all deployed to agf.jessepike.dev):**

- **Review process established** — GPT-5.4 external review ingested verbatim at `docs/reviews/2026-04-23-gpt-5-4.md`; internal mechanical-baseline review at `docs/reviews/2026-04-23-mechanical-baseline.md`; `docs/findings-ledger.md` with F-ID schema, severity × confidence grid, lifecycle states, and trajectory tracking
- **v0.2.0 baseline scorecard:** 5.25/10 composite across 8 dimensions. Current: **6.38/10** (+1.13)
- **Cluster A — Mechanical** (commit `3be6350`): cspell dict populated, markdownlint config fixed (666 → 108 → ~0 errors)
- **Cluster B — Credibility infra** (commit `90964c5` + `f8c7bb1`): `<Confidence>` + `<Status>` MDX components built + registered globally; `/docs/reference/confidence-levels` reference page shipped; homepage Philosophy card dogfoods the gradient; G5-F05 "operationalize at machine speed" wrapped in `<Confidence level="open">` block
- **Cluster C — Defensibility** (commit `1556459`): Primitive Attribution table (19-row lineage) on `/docs/reference/primitives`; Belief Layer novelty claim bounded + confidence-marked; OTAA expanded at first use
- **Cluster E — Clarity quick wins** (commit `54e808d`): homepage CTA anchor fix, canonical one-sentence definition on hero + what-is-agf, "What AGF is / is not" homepage grid, `/docs/overview/core-concepts` orientation page, primitive catalog link fix, observability slug rename
- **Release automation shipped** (commit `3037a6e`): `.github/workflows/smoke.yml` post-deploy smoke on every push to main; pre-push hook activated (`git config core.hooksPath .githooks`); three-layer pipeline documented in CLAUDE.md + AGENTS.md + release-playbook.md
- **Tooling blockers resolved** (commit `3afefb4`): pre-push hook activation forced MI-F04 (check-links route resolution) and MI-F05 (lint-mdx fence-awareness) out of "deferred" into "resolved" — both were real release blockers disguised as cosmetic polish. Plus MD032 auto-fixes across 7 files, MD040 fence-language tags, cspell dict extended.
- **Nav discoverability** (commit `10b2829`): confidence-levels promoted to position 2 in Reference sidebar (was buried at 7/7)

**Findings ledger state:**
- 13 resolved (MI-F01, MI-F02, MI-F04, MI-F05, G5-F01, F02, F04, F05, F06, F07, F08, F10, F11, F17, F19)
- 4 accepted / queued → Credibility Pass v0.3 (G5-F03, F14 infra only, F20)
- 4 deferred → Content Cohesion Pass v0.3 (G5-F09, F15, F16, F18)
- Remaining open: G5-F12, F13 (Cluster D actionability lift); G5-M02, M03 (meta, resolve via other findings); MI-F07 (near-zero residual)

**Scorecard progression (v0.2.0 baseline → now):**
- Clarity 5 → 7
- Coherence 6 → 6
- Defensibility 5 → 7
- Differentiation 6 → 7
- Actionability 4 → 4 (unchanged — Cluster D not yet run)
- Credibility 5 → 6
- Public Readiness 5 → 7
- Mechanical 6 → 7

**Original 2026-04-23 infrastructure session (morning):**

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
