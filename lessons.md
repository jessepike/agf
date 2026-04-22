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


## 2026-04-21

- **Concentric rings reclaim the Rings Model metaphor in diagrams.** TOGAF horizontal-band translation was accurate but lost the iconic AGF visual. Concentric is the right shape.
- **Cross-cutting capability layers render best as radial sectors/wedges in concentric-ring visuals.** Horizontal bands above rings convey "cuts across" weakly; radial sectors cutting from center through all rings convey it literally.
- **AGF-coined acronyms (OTAA) need spelling out at first use.** OTAA in the wild = LoRaWAN "Over-the-Air Activation" (unrelated). Macro visuals should show "Observable · Traceable · Auditable · Agent-operable" rather than the acronym.
- **"Invariant" is CS jargon.** At macro altitude, "Every AGF primitive must…" reads cleaner than "universal invariant."
- **BE / PRODUCE verb parallel visually reinforces the OTAA-vs-Dual-Form distinction.** OTAA = properties the primitive *has* (external visibility + invocability); Dual-Form = format of what it *emits*. Same-altitude peers under a shared "Every AGF primitive must:" header.
- **Save diagram prompts to DIAGRAM-SPECS.md, not diagram-forge templates.** Project-local spec files are lightweight reproducibility; template creation is Forge-scope overhead that only pays off with cross-project reuse.


