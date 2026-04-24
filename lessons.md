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

- **Codex prompts recoverable from session transcripts.** When diagram-forge's usage.db doesn't store the prompt text (only metadata), the `mcp__*__generate_diagram` / `edit_diagram` tool calls are in `~/.claude/projects/<project>/*.jsonl` session files. Match by session-file mtime to diagram mtime, parse the jsonl for the tool-use input. Useful recovery pattern when DIAGRAM-SPECS.md wasn't updated live.

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


