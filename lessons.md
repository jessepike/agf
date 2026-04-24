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

- **Parallel-session detection: if file state changes between reads without cause, assume a concurrent writer, not a linter or a revert.** Opposite-side lesson to "git-status-at-orient." When I saw "file was modified, this was intentional" system reminders landing during active edits, my first reading was "Jesse reverted my work" — the actual event was another Claude Opus session committing my uncommitted tree into its own commit. Detection: run `git log -n 5` + `git diff --stat HEAD` the moment an unexplained state shift appears, not the fifth time. Mitigations, cheapest first: (A) scope division up front when multiple sessions are active, (B) lockfile convention, (C) git worktrees for multi-hour parallel work.
- **Check `git status` at orient, not just `status.md` handoff.** Handoff claimed "Tree state: Clean" but 9 files were uncommitted from an unseen prior-today session. Almost destroyed hours of incumbent work with a careless `git checkout` before noticing. Discipline: git status is ground truth; status.md is narrative. Read both.
- **Incumbent work can be internally inconsistent — reconcile to the EXECUTED direction, not the DECLARED one.** Prior session drafted D10 + CHANGELOG saying "5 patterns" but then pivoted mid-flight to 4-pattern + hardening posture on the MDX files. The MDX was the actual executed position; the decision records were lagging. Codex independent review confirmed Path C (4 patterns) as the stronger framework judgment. When incumbent work contradicts itself, side with the more recent execution, not the earlier declaration — and update the lagging records to match.
- [pending] **Codex prompts recoverable from session transcripts.** When diagram-forge's usage.db doesn't store the prompt text (only metadata), the `mcp__*__generate_diagram` / `edit_diagram` tool calls are in `~/.claude/projects/<project>/*.jsonl` session files. Match by session-file mtime to diagram mtime, parse the jsonl for the tool-use input. Useful recovery pattern when DIAGRAM-SPECS.md wasn't updated live.
- [pending] **Validate ring-primitive placement against `docs/agentic-primitives.md` § Rings Model, not against the existing diagram.** Source diagrams may carry bugs (duplicate #6 in Ring 2; #4 color/position mismatch). Canonical mapping: Ring 0 {#5, #7, #13, #14, #16-action}; Ring 1 {#1, #2, #4, #13}; Ring 2 {#6, #8, #9, #14, #16-gates, #17}; Ring 3 {#3, #11, #12}; Fabric {#5, #10, #13, #15, #17}; Outside pipeline {#18, #19}.
- [pending] **Gemini edit is weak at positional moves.** When asked to move a box inward from one ring band to another, edit often no-ops while keeping the prompt claim. For positional changes, a targeted gpt-image-2 regen with explicit clock-position coordinates works better than an edit pass. Cost tradeoff: edit $0.039 vs regen $0.165.

## 2026-04-23

- [pending] **Release infrastructure + `agf-architect` agent shipped.** Scripts in `bin/`, skill in dev-system, agent with 6 slash commands. See `docs/tooling-guide.md` for operational reference. First release candidate for using the new pipeline will be the GDR cross-doc integration passes already queued in BACKLOG.
- [pending] **Forge plugin builds need `plugin.json` manifest** — first Forge run created the agent plugin dir without the `.claude-plugin/plugin.json` manifest; plugin would not have loaded. Second Forge run caught + fixed. Add to the Forge agent-building checklist for future agent plugins.
- [pending] **License decision stays CC BY 4.0.** Adoption > protection for a credibility-building framework. Commercial value lives in tools/services/consulting around AGF, not in gating AGF itself. CC BY-SA revisitable if bad-faith forking appears later.
- [pending] **Pre-push hook activation is per-clone, not auto.** `.githooks/pre-push` is committed, but `git config core.hooksPath .githooks` runs per working copy. Fresh clones bypass the gate silently until the command runs. Document in CLAUDE.md; include in any "new machine" setup flow.
- [pending] **"Deferred cosmetic tooling" findings can become release blockers the moment the pre-push hook is activated.** MI-F04/F05/F06 were all filed as low-severity polish. Activating the hook turned three of them into hard gates within the same session. Lesson: when triaging tooling findings, test them against the ACTIVE gate, not the theoretical one.
- [pending] **markdownlint-cli2 `--fix` resolves MD032 (blanks-around-lists) automatically.** Use it before hand-editing anything structural. Saves 30+ min on content hygiene passes. Does NOT fix MD040 (missing code-fence language) — those require deciding the language per fence.
- [pending] **Dogfooding a framework's own vocabulary is load-bearing for credibility.** Shipping `<Confidence level="informed">` on a novelty claim converts "trust me" into "here's the evidence posture I'm taking" — exactly the meta-pattern reviewers ask for. Building the component once then applying it is cheaper than auditing prose claim-by-claim.
- [pending] **Attribution tables are the highest-leverage defensibility move.** G5-F17 (19-row primitive → source mapping) did more for "AGF is synthesis not invention" than all the prose rewording combined. Every framework claiming synthesis should have one.

## 2026-04-21

- [pending] **Concentric rings reclaim the Rings Model metaphor in diagrams.** TOGAF horizontal-band translation was accurate but lost the iconic AGF visual. Concentric is the right shape.
- [pending] **Cross-cutting capability layers render best as radial sectors/wedges in concentric-ring visuals.** Horizontal bands above rings convey "cuts across" weakly; radial sectors cutting from center through all rings convey it literally.
- [pending] **AGF-coined acronyms (OTAA) need spelling out at first use.** OTAA in the wild = LoRaWAN "Over-the-Air Activation" (unrelated). Macro visuals should show "Observable · Traceable · Auditable · Agent-operable" rather than the acronym.
- [pending] **"Invariant" is CS jargon.** At macro altitude, "Every AGF primitive must…" reads cleaner than "universal invariant."
- [pending] **BE / PRODUCE verb parallel visually reinforces the OTAA-vs-Dual-Form distinction.** OTAA = properties the primitive *has* (external visibility + invocability); Dual-Form = format of what it *emits*. Same-altitude peers under a shared "Every AGF primitive must:" header.
- [pending] **Save diagram prompts to DIAGRAM-SPECS.md, not diagram-forge templates.** Project-local spec files are lightweight reproducibility; template creation is Forge-scope overhead that only pays off with cross-project reuse.


