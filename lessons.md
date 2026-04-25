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


## 2026-04-25

- **Strategic-meta closeout protocol works mechanically but does not guarantee score advancement when the meta measures qualitative consistency.** G5-M03 ran 4 Codex closeout passes with 4 distinct personas (security/GRC, standards-body, practicing-engineer, technical-lead). All 4 returned 7/10 / `pattern-persists` despite 11 children resolved across the passes (9 same-session, 2 deferred). Codex itself (pass 4): "M03 is behaving like a continuous quality dimension rather than something one more tight editorial pass can honestly close." Decision criterion: when 3+ consecutive passes return the same score AND new children are structural (require external evidence or completion of underlying multi-week work) rather than editorial (require copy/wording/anchor fixes), switch from "close this session" to "stage on Roadmap." Honest stopping point matters; grinding produces diminishing returns and false closure.
- **Tight-loop same-session resolution still works for editorial children.** F23–F31 all spawned + fixed within their respective closeout-pass cycles (file → fix → re-pass), totaling 9 successful tight loops in one session. Pattern is reusable for any meta where reviewer findings are file:line:symptom:fix-quality precise.
- **Catch-22 risk in honest disclosure.** Pass 2 F27 fix added "audit not yet uniform" caveat to fix the "Every claim carries" overclaim. Pass 4 F32 then flagged that same caveat as "transition-state leakage." Removing it would replace honesty with the original overclaim. Resolution requires completing the underlying audit, not editorial polish. Honest disclosure scores worse than no claim at all; only completing the work scores best.
- **Background bash with `cmd | tail -N` causes 0-byte output until exit.** Tail buffers stdout. Monitors waiting for partial-output progress signals never fire. Fix: direct redirect (`cmd > file 2>&1 &`) instead of pipe-to-tail. Cost first time was 12 min of false-stalled state before kill+restart.
- **Codex echoes the prompt template verbatim in its output, including verdict-format placeholders.** Monitors grepping for `Verdict:` or `Public Readiness: <N>/10` will false-match on the prompt itself. Use literal numeric pattern (`Public Readiness: [0-9]/10`) and require BOTH the heading AND `tokens used` footer to detect actual completion.

## 2026-04-24

- [failed] **Validate ring-primitive placement against `docs/agentic-primitives.md` § Rings Model, not against the existing diagram.** Source diagrams may carry bugs (duplicate #6 in Ring 2; #4 color/position mismatch). Canonical mapping: Ring 0 {#5, #7, #13, #14, #16-action}; Ring 1 {#1, #2, #4, #13}; Ring 2 {#6, #8, #9, #14, #16-gates, #17}; Ring 3 {#3, #11, #12}; Fabric {#5, #10, #13, #15, #17}; Outside pipeline {#18, #19}.

## 2026-04-23

- [failed] **Release infrastructure + `agf-architect` agent shipped.** Scripts in `bin/`, skill in dev-system, agent with 6 slash commands. See `docs/tooling-guide.md` for operational reference. First release candidate for using the new pipeline will be the GDR cross-doc integration passes already queued in BACKLOG.
- [failed] **Forge plugin builds need `plugin.json` manifest** — first Forge run created the agent plugin dir without the `.claude-plugin/plugin.json` manifest; plugin would not have loaded. Second Forge run caught + fixed. Add to the Forge agent-building checklist for future agent plugins.
- [failed] **License decision stays CC BY 4.0.** Adoption > protection for a credibility-building framework. Commercial value lives in tools/services/consulting around AGF, not in gating AGF itself. CC BY-SA revisitable if bad-faith forking appears later.
- [failed] **"Deferred cosmetic tooling" findings can become release blockers the moment the pre-push hook is activated.** MI-F04/F05/F06 were all filed as low-severity polish. Activating the hook turned three of them into hard gates within the same session. Lesson: when triaging tooling findings, test them against the ACTIVE gate, not the theoretical one.

## 2026-04-21

- [failed] **Concentric rings reclaim the Rings Model metaphor in diagrams.** TOGAF horizontal-band translation was accurate but lost the iconic AGF visual. Concentric is the right shape.
- [failed] **AGF-coined acronyms (OTAA) need spelling out at first use.** OTAA in the wild = LoRaWAN "Over-the-Air Activation" (unrelated). Macro visuals should show "Observable · Traceable · Auditable · Agent-operable" rather than the acronym.
- [failed] **"Invariant" is CS jargon.** At macro altitude, "Every AGF primitive must…" reads cleaner than "universal invariant."
- [failed] **BE / PRODUCE verb parallel visually reinforces the OTAA-vs-Dual-Form distinction.** OTAA = properties the primitive *has* (external visibility + invocability); Dual-Form = format of what it *emits*. Same-altitude peers under a shared "Every AGF primitive must:" header.
- [failed] **Save diagram prompts to DIAGRAM-SPECS.md, not diagram-forge templates.** Project-local spec files are lightweight reproducibility; template creation is Forge-scope overhead that only pays off with cross-project reuse.


