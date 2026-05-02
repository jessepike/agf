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


## 2026-05-01

- [pending] **Multi-MODEL multi-lens variance is the ratchet, not multi-persona within one family.** Three-model pressure-test (Gemini 3.1 Pro Standards / GPT-5.5 Adversarial / Opus 4.7 Architectural) on AGF v0.2.0 surfaced 18 net-new findings + 3 cross-model meta-findings the prior 5-pass Codex chain (5 distinct personas, same family) missed. Family-internal convergence reflects shared blind spots; cross-family convergence triangulates around something real. Weight cross-model convergence higher than within-family convergence.
- [pending] **F33 was treated as the sole structural blocker. It is not.** GPT-5.5 surfaced runtime integration contract gaps (GDR/event atomicity, signal arbitration, DELEGATE handshake, ESCALATE/DEFER lifecycle) as co-equal structural blocker. Codex 5-pass converged on F33 because it was reading for evidence and tone, not for whether the architecture survives distributed-systems failure. Convergence inside one family is not proof the floor is structural — can be shared blind spot.
- [pending] **Standards-fidelity is harder than synthesis discipline.** Gemini scored Defensibility 5/10 (lowest of 3 models) citing severe ISO 42001 misalignment (GDR ↔ Clause 9.3 Management Review) and seven-layer stack inversion. AGF's own change log already flagged ISO clauses as "high-confidence but NOT independently verified" — but the candor itself wasn't sufficient. Confidence labels mitigate damage from unverified claims but don't replace verification. For standards crosswalks, label AND verify.
- [pending] **Sacred-file findings: automate what doesn't require architectural judgment; surface what does.** GEM-F03 (seven-layer stack inversion) — the reviewer correctly identified a comprehension hazard but the recommended fix would replace one wrong reading with another. Sacred-file boundaries forced human-in-loop. Drafting concrete proposals to `.private/drafts/` preserved the option to disagree while still moving the work forward.
- [pending] **3-model average composite ~6.6 was lower than the most-recent Codex projection ~7.5 — the prior Codex chain was generous.** Each model also revealed its own residual blind spots: Codex over-indexed on architectural framing; Gemini over-indexed on standards-text precision (scored Coherence 8/10 vs Opus's 6/10); Opus stayed in conceptual coherence and didn't push hard on adoption-grade implementation. Lesson for audit-loop stop-condition: a single model converging at a score floor is not "structurally bounded" — it's bounded by THAT model's lens.
- [pending] **Auto-resolution carve-outs proved themselves under pressure.** 3 of 18 findings auto-resolved this session via factual fixes (ISO 42001 Clause 9.3 → 8.1; EU AI Act Art. 12 → observability primary path; Composition Patterns vocabulary rename). 2 sacred-file findings (GEM-F03 stack inversion; GEM-F04 voice) correctly routed to human via `.private/drafts/` proposals. The carve-out boundary held — no architectural decisions slipped through; no purely factual fixes were needlessly stalled.
- [pending] **Agent-context primer pattern: separate "what it IS" from "what you WANT FROM IT".** Public synthesis of canon (primer) + private strategic intent (companion) = ~3-4K tokens of agent context replacing ~50K of canonical doc spelunking. Two-file pattern preserves the public/private wall: framework primer is reusable as one-pager for humans (Substack, partner pitch, conference handout); strategic intent stays gitignored. Operational tail for agents in primer keeps the file dual-purpose without leaking strategy. Cross-project pattern — applies anywhere an agent has to repeatedly load 5+ canonical docs to get oriented.

## 2026-04-25

- [pending] **Score floors are diagnostic — when an external reviewer plateaus at the same number across 5 passes despite real improvements, the remaining gap is structural, not editorial.** Codex pass 5 verbatim: "I would cite AGF for architecture framing… I would not yet cite it as externally validated evidence of what works in production." Adoption proof cannot be manufactured editorially. Stage on Roadmap; stop grinding editorial passes.

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


