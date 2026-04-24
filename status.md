---
updated: 2026-04-24
stage: operate (v0.2.0 shipped; Cohesion Pass v0.3 shipped 2026-04-24; Cluster D Actionability shipped 2026-04-24)
---

# Status — AGF

## Handoff — 2026-04-24 (M01 closeout pass + G5-F21 spawned/resolved)

**From:** CPO session (Opus) — orchestrated independent closeout via Codex
**To:** Next session (→ **Tier 2: G5-F18 + MI-F07 editorial pass**, Sonnet, 2h)
**Tree state:** clean post-commit; pending push.

**What shipped this session (single commit):**

- **M01 closeout pass executed** by Codex CLI (gpt-5.4) as Strong-tier independent reviewer. Verdict: **`pattern-persists`** with new child G5-F21 filed. Rationale: hot-spot improvements landed but framework-wide posture still uneven — bare current-state empirical claims remain on flagship overview pages despite homepage's "every claim grounded" promise.
- **G5-F21 filed and resolved same session.** Three claims fixed: `rings-model.mdx:8` ("most agentic systems in production today have no structural governance"), `rings-model.mdx:26` ("Most deployed agentic systems today are Ring-0-only"), `what-is-agf.mdx:14` ("Most deployments today are brittle"). All three now carry inline `<Confidence level="informed" />` matching the composition-patterns precedent.
- **Findings ledger:** F21 added + resolved; M01 detail block now contains full closeout-pass note with Codex verdict, scope read, rationale, and next-step recommendation. M01 stays `accepted` pending second independent reviewer per scaling rule (High-severity meta affecting public credibility requires multiple reviewers).

**Method note:** This is the first M01-class closeout pass executed under the protocol canonized in `docs/reviews/README.md` 2026-04-24. The protocol worked exactly as designed — independent reviewer caught real residual pattern that primary author would have missed, surfaced a concrete new child, and the verdict mapped cleanly to existing lifecycle states without requiring protocol changes.

**Scorecard impact (projected, pending re-rating):**

- Credibility 6 → projected **8** (Pass v0.3 + F21 batch — covers all known bare empirical claims on overview)
- No further dimension shifts from this commit (closeout is governance, not new content)

**Findings ledger state after this session:**

- **Validated:** 15 (unchanged)
- **Resolved (pending validation):** 8 → adds G5-F21
- **Open:** G5-F18 (editorial), MI-F07 (residual), G5-M02/M03 (meta)
- **Accepted (post-closeout-pass):** G5-M01 — awaits second independent reviewer

**Tier 1 next:** **G5-F18 + MI-F07 editorial pass** — Sonnet, 2h. Slogan density reduction across flagship MDX + remaining markdownlint hygiene. Unlocks G5-M02 closeout. Recommendation: bundle a second M01 reviewer pass (fresh Sonnet session, post-editorial) to convert M01 `accepted` → `validated` if pattern-closed converges with Codex.

**Tier 2 quick wins:** Transparency pages (1h) · ai-engineering profile rewrite (2h).

**Tier 3 deferred:** G5-M03 strategic-meta closeout (requires Public Readiness ≥8/10 by independent reviewer).

---

## Handoff — 2026-04-24 (Credibility Pass v0.3 shipped — G5-F03 + F20 resolved)

**From:** CPO session (Opus) — Credibility Pass v0.3 immediately following Cluster D
**To:** Next session (→ **G5-M01 closeout** as Tier 1 — see below)
**Tree state:** clean post-commit; pending push.

**What shipped this session (single commit):**

- `relationship-to-frameworks.mdx` — AICM 5/243 claim wrapped in `<Confidence level="established" />` with verification date 2026-04-24; Agent 365 reference rewritten to "announced; GA target May 2026 per Microsoft Ignite 2025; verify current status on Microsoft Learn" (closes G5-F20); "Organizations adopting AGF typically implement both" wrapped in `<Confidence level="open">` block flagging absence of adopter data.
- `composition-patterns.mdx` — empirical reference points (Microsoft AGT / Bifrost) now in `<Confidence level="established">` block with full source attribution + dates; "most organizations" / "most regulated deployments" claims now carry `<Confidence level="informed" />`.
- `rings-model.mdx` — "more governance than most organizations have today" carries `<Confidence level="informed" />`.
- `trust-ladders.mdx` — Empirical Evidence section now carries section-level `<Confidence level="established" />` qualifier; all four research citations now read "published Month YYYY" with verification guidance.
- `governance-framework.mdx` — overhead multiplier table now followed by `<Confidence level="informed">` block labeling them as design-target estimates not validated benchmarks.
- Findings ledger: F03 + F20 marked resolved; F14 narrowed to infra-shipped/content-gated; open count 4 → 2.

**Scorecard impact (projected, pending re-rating):**

- Credibility 6 → **8 likely** (was the lever this session targeted; dogfooded confidence markers on all flagged claims)
- Public Readiness 7 → **8 likely** (artifact unevenness reduces further)
- Composite ~6.75–7.0 (post-Cluster-D projection) → **~7.25–7.5** likely

**Findings ledger state after this session:**

- **Validated:** 15 (unchanged)
- **Resolved (pending validation):** 7 → G5-F09/F15/F16 (Cohesion) + G5-F12/F13 (Cluster D) + G5-F03/F20 (Credibility)
- **Open:** G5-F18 (editorial), MI-F07 (residual), G5-M01/M02/M03 (meta — now M01 triggerable)

**Tier 1 next:** **G5-M01 meta closeout.** Per `docs/reviews/README.md` Meta-Finding Closeout Protocol, M01 (umbrella for F03/F04/F05/F14) is now triggerable — F03/F04/F05 resolved, F14 infra-shipped/content-gated. Run a holistic re-read with an independent reviewer (Codex CLI or fresh Sonnet); verdict expected `pattern-shifted` toward `pattern-closed` (the dogfooded confidence-marker discipline directly addresses the meta-pattern of "promising rigor without showing it"). 1-2h Sonnet or Codex.

**Tier 2:** G5-F18 + MI-F07 editorial pass — Sonnet, 2h. Slogan density + remaining markdownlint hygiene. Unlocks G5-M02 closeout.

**Tier 3 quick wins:** Transparency pages (1h Sonnet) · ai-engineering profile rewrite (2h Sonnet).

**Tier 4 deferred:** G5-M03 closeout requires Public Readiness re-score ≥8/10 by independent reviewer per strategic-meta rule. Likely triggerable after F18 + ai-engineering rewrite.

---

## Handoff — 2026-04-24 (Cluster D Actionability shipped — G5-F12 + F13 resolved)

**From:** CPO session (Opus) — Cluster D content shaping
**To:** Next session (→ **Credibility Pass v0.3**, Sonnet, ~3-4h, see Tier 2 below)
**Tree state:** Clean after commit. Origin/main pending push.

**What shipped this session (single commit):**

- New page `agf-docs/content/docs/overview/first-30-days.mdx` — week-by-week MVC starter workplan: prerequisites, four week sections (Inventory & Scope / Identity & Attribution / Provenance & Observability / Scoped Environment & Review), exit criteria to Validation Pipeline + Governed Decision Flow, "What MVC is Not" boundary block. Closes **G5-F12**.
- New page `agf-docs/content/docs/overview/reference-walkthrough.mdx` — one threaded refund scenario ($450 with adaptive-gate override) traced through Rings 0–3 with two GDR YAML examples, six-row threaded view table mapping step → ring → primitive → artifact → observability event, and a candor section under `<Confidence level="informed">` flagging where the walkthrough simplifies. Closes **G5-F13**.
- Nav wiring: `overview/meta.json` extended; cross-links added from `core-concepts.mdx` "What to read next" and `composition-patterns.mdx` "Where to Start" callout.
- cspell dictionary extended (`workplan`, `unauditable`); markdownlint clean; link-check passes; `pnpm build` green (21 prerendered paths).

**Scorecard impact (projected, pending independent re-rating):**

- **Actionability 4 → 7+ likely** (the only stuck dimension; both G5-F12 and G5-F13 directly target it)
- Differentiation 7 → likely 8 (end-to-end walkthrough was the missing concrete differentiation move)
- Public Readiness 7 → likely 8 (artifact unevenness reduces — overview now has both onboarding ramp and reference walkthrough)
- Composite ~6.38 → projected ~6.75–7.0

**Findings ledger state after this session:**

- **Validated:** 15 (unchanged)
- **Resolved (pending validation):** 5 → G5-F09, F15, F16 (Cohesion Pass v0.3) + G5-F12, F13 (Cluster D)
- **Open:** G5-F18 (editorial), MI-F07 (residual), G5-M01/M02/M03 (meta)

**Tier 1 next (highest leverage):** **Credibility Pass v0.3** (G5-F03 + F14 + F20) — Sonnet, 3-4h. Now the only remaining content lever; runs against the freshly shipped Cluster D pages too. When complete, unlocks G5-M01 closeout per Meta-Finding Closeout Protocol.

**Tier 2:** G5-F18 + MI-F07 editorial pass — Sonnet, 2h. Slogan density reduction across flagship MDX + remaining markdownlint hygiene. Unlocks G5-M02 closeout.

**Tier 3 quick wins:** Transparency pages (`/changelog`, `/decisions`, `/roadmap`, `/contribute`) — 1h Sonnet. ai-engineering profile rewrite (retire Phase 1-5 H3) — 2h Sonnet, pairs cleanly with Cluster D pages on AI Engineer audience.

**Tier 4 meta closeouts:** G5-M01 after Credibility Pass · G5-M02 after F18/MI-F07 editorial · G5-M03 after Credibility + F18 + Public Readiness independent re-score ≥8/10.

---

## Handoff — 2026-04-24 (evening close — Cohesion Pass v0.3 shipped + ledger closeout)

**From:** agf-architect session — Sonnet 4.5 + Codex (gpt-5.4) independent review
**To:** Next session (→ **Cluster D Actionability, Opus**, see Tier 1 below)
**Tree state:** Clean. Origin/main at `bb56f93`. GitHub Actions smoke workflow fires on every push to `main`.

**What shipped this session (5 commits):**

| Commit | Summary |
|---|---|
| `eaef524` | Canonical Cohesion Pass — DECISIONS.md #10 (a/b/c): 4 composition patterns + "Secure Governed System" demoted to hardening-posture modifier; governance 5-sense qualifier table; observability 3-layer disambiguation. Closes G5-F09, F15, F16 |
| `23588d9` | F15 qualifier audit on `composition-patterns.mdx` (4 Ring-2 sense fixes + orphan `implementation-phases-roadmap.png` retired); `DIAGRAM-SPECS` entry 2 marked SUPERSEDED; BACKLOG entry for ai-engineering profile rewrite (still has "Phase 1-5" H3 headings) |
| `b1366cd` | MI-F07 partial — bulk MD032 auto-fix across 21 canonical docs + 10 flagship MD040 tags |
| `076393f` | Session wrap (initial) — status.md + lessons.md handoff text |
| `bb56f93` | Ledger closeout — DECISIONS.md #11 (LICENSE CC BY 4.0 canonized retroactively from 2026-04-23 operational confirmation) + BACKLOG P0 blocker cleared |

**Key session insight — discovered prior-session incumbent work in-progress.** Upon git status inspection, found 8 files + D10 draft left uncommitted from a prior (unseen) 2026-04-24 session that started the Cohesion Pass with **5-pattern canonicalization** but then pivoted mid-flight to **4-pattern + hardening posture** on the MDX edits without updating D10/CHANGELOG/shared-vocabulary. My independent Codex review converged on Path C (4 patterns + posture), matching the incumbent MDX. Reconciliation was: fix the lagging decision records to match what the MDX already said; restore lost shared-vocabulary disambiguation sections I accidentally destroyed via a `git checkout` before I realized the incumbent work existed. Lessons captured to `lessons.md` + agent state.

**Scorecard impact (projected, pending independent re-rating):**

- Coherence 6 → **7+ likely** (F09 + F15 + F16 all resolved; naming-density relieved by Secure Governed demotion; observability taxonomy made explicit)
- Mechanical 7 → unchanged (MI-F07 partial; canonical docs not on pre-push gate path)
- Actionability 4 → unchanged (Cluster D not touched)
- Other dimensions unchanged

**Findings ledger state after this session:**

- **Validated:** 15 (unchanged)
- **Resolved (pending validation):** 3 → G5-F09, F15, F16 (Cohesion Pass v0.3)
- **Partial:** MI-F07 (bulk format fixed; deeper MD040 remains non-blocking)
- **Open:** G5-F12, F13 (Cluster D), G5-F18 (editorial), G5-M01/M02/M03 (meta)

**P0 blockers:** none. LICENSE resolved via D11.

**M02 meta closeout — NOT yet runnable.** Protocol triggers when all children in stable non-open state. F09/F15/F16 resolved; F18 still deferred (editorial pass). Closeout runs AFTER F18 ships. Expected verdict when run: `pattern-shifted` toward `pattern-closed` (Secure Governed demotion was the highest-leverage density-relief move).

---

## Next Tranche — Prioritized

**Tier 1 — Highest strategic impact (do next):**

1. **Cluster D Actionability (G5-F12 + F13)** — **Opus · 3–4h · biggest single lever.** Actionability is the only stuck dimension (4/10). It caps further gains on Differentiation and Public Readiness. Shipping the 30-day MVC starter path + end-to-end reference walkthrough breaks the ceiling. Opus recommended for strategic content shaping. *Independent of everything else in this list — start here.*

**Tier 2 — Complementary, ship together as v0.3 content release:**

2. **Credibility Pass v0.3 (G5-F03 + F14 + F20)** — **Sonnet · 3–4h.** Audit flagship pages for numeric/empirical claims; apply `<Confidence>` markers at the claim level; add dated-source annotations on time-sensitive claims. Enables G5-M01 closeout when complete.
3. **G5-F18 + MI-F07 full editorial pass** — **Sonnet or fresh reader · 2h.** Slogan density reduction + remaining markdownlint hygiene on deeper docs. Subjective editorial; benefits from fresh eyes. Enables G5-M02 closeout when complete.

**Tier 3 — Quick wins, slottable anywhere:**

4. **Transparency pages** — **Sonnet · 1h.** Expose `/changelog`, `/decisions`, `/roadmap`, `/contribute` as MDX routes. Pure execution, no strategy decisions.
5. **ai-engineering profile rewrite** — **Sonnet · 2h.** Retire "Phase 1-5" H3 headings (per BACKLOG entry); pair with regenerated 4-pattern progression diagram. Fits naturally alongside Cluster D (both touch AI Engineer audience).

**Tier 4 — Meta closeouts (protocol-gated, run AFTER their trigger passes):**

6. **G5-M01 closeout** — runs after Credibility Pass v0.3 ships. Requires holistic re-read + reviewer independence per Meta-Finding Closeout Protocol.
7. **G5-M02 closeout** — runs after F18 editorial ships.
8. **G5-M03 closeout** — runs after Clusters D + Credibility + F18 all land. Requires Public Readiness dimension re-score ≥8/10 by independent reviewer per strategic-meta rule in `docs/reviews/README.md`.

**Validation queued for next Mode C pass:** G5-F09, F15, F16 — verify D10 claims hold by reading the canonical docs + cited artifacts.

---

## Previous Handoffs

## Handoff — 2026-04-24 (close — 5 commits pushed to origin) — SUPERSEDED

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
