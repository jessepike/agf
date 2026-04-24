# Lessons — AGF

Hot buffer of insights, patterns, and gotchas from recent sessions. One line per insight, dated. Keep last ~15. Promote cross-project patterns to KB at session wrap.

<!-- Instructions:
  - Add entries under a date heading: ## YYYY-MM-DD
  - One line per lesson — concise, actionable
  - Max ~15 total entries across all dates
  - At session wrap: promote cross-project patterns to KB, remove promoted entries
  - Project-specific items stay here until no longer relevant
-->

## 2026-04-17


## 2026-04-24

- **Mode C batch validation pattern works.** Single research subagent for commit-by-commit diff inspection, main agent synthesizes verdicts into a single Mode C report. Keeps main-agent context clean for N-finding batches. Confirmed on 15-finding batch today. Repeat this shape next time we validate a cluster.
- **Ledger summary counters drift silently from per-row state.** Twice now the top-of-doc counters ("Resolved: 13") have lagged behind actual table state (15 resolved). Fix at source: add a pre-commit check that counts table states vs. summary line, OR just promote counters to computed-from-table at render time. Until then: eyeball the counters on every ledger edit.
- **Meta-findings don't close when children do.** G5-M01 (rigor promise), G5-M02 (naming density), G5-M03 (artifact unevenness) are *patterns*, not line items. Children can all validate and the pattern still stand. Needs explicit "holistic re-read" protocol — not yet spec'd. Flag for Credibility Pass v0.3 closeout.
- **"Cohesion-first" sequencing thesis.** G5-F09/F15/F16 are dependencies for Cluster D actionability content. If Cluster D ships first, new prose introduces the same vocabulary conflations Cohesion Pass is supposed to fix, and Cohesion has to chase rewrites. General rule: coherence/vocabulary work precedes new-content work, not the reverse.

## 2026-04-23

- **Release infrastructure + `agf-architect` agent shipped.** Scripts in `bin/`, skill in dev-system, agent with 6 slash commands. See `docs/tooling-guide.md` for operational reference. First release candidate for using the new pipeline will be the GDR cross-doc integration passes already queued in BACKLOG.
- **Forge plugin builds need `plugin.json` manifest** — first Forge run created the agent plugin dir without the `.claude-plugin/plugin.json` manifest; plugin would not have loaded. Second Forge run caught + fixed. Add to the Forge agent-building checklist for future agent plugins.
- **License decision stays CC BY 4.0.** Adoption > protection for a credibility-building framework. Commercial value lives in tools/services/consulting around AGF, not in gating AGF itself. CC BY-SA revisitable if bad-faith forking appears later.
- **Pre-push hook activation is per-clone, not auto.** `.githooks/pre-push` is committed, but `git config core.hooksPath .githooks` runs per working copy. Fresh clones bypass the gate silently until the command runs. Document in CLAUDE.md; include in any "new machine" setup flow.
- **"Deferred cosmetic tooling" findings can become release blockers the moment the pre-push hook is activated.** MI-F04/F05/F06 were all filed as low-severity polish. Activating the hook turned three of them into hard gates within the same session. Lesson: when triaging tooling findings, test them against the ACTIVE gate, not the theoretical one.
- **markdownlint-cli2 `--fix` resolves MD032 (blanks-around-lists) automatically.** Use it before hand-editing anything structural. Saves 30+ min on content hygiene passes. Does NOT fix MD040 (missing code-fence language) — those require deciding the language per fence.
- **Dogfooding a framework's own vocabulary is load-bearing for credibility.** Shipping `<Confidence level="informed">` on a novelty claim converts "trust me" into "here's the evidence posture I'm taking" — exactly the meta-pattern reviewers ask for. Building the component once then applying it is cheaper than auditing prose claim-by-claim.
- **Attribution tables are the highest-leverage defensibility move.** G5-F17 (19-row primitive → source mapping) did more for "AGF is synthesis not invention" than all the prose rewording combined. Every framework claiming synthesis should have one.

## 2026-04-21

- **Concentric rings reclaim the Rings Model metaphor in diagrams.** TOGAF horizontal-band translation was accurate but lost the iconic AGF visual. Concentric is the right shape.
- **Cross-cutting capability layers render best as radial sectors/wedges in concentric-ring visuals.** Horizontal bands above rings convey "cuts across" weakly; radial sectors cutting from center through all rings convey it literally.
- **AGF-coined acronyms (OTAA) need spelling out at first use.** OTAA in the wild = LoRaWAN "Over-the-Air Activation" (unrelated). Macro visuals should show "Observable · Traceable · Auditable · Agent-operable" rather than the acronym.
- **"Invariant" is CS jargon.** At macro altitude, "Every AGF primitive must…" reads cleaner than "universal invariant."
- **BE / PRODUCE verb parallel visually reinforces the OTAA-vs-Dual-Form distinction.** OTAA = properties the primitive *has* (external visibility + invocability); Dual-Form = format of what it *emits*. Same-altitude peers under a shared "Every AGF primitive must:" header.
- **Save diagram prompts to DIAGRAM-SPECS.md, not diagram-forge templates.** Project-local spec files are lightweight reproducibility; template creation is Forge-scope overhead that only pays off with cross-project reuse.


