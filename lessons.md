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

- Industry convergence (MS AGT formally ATF-conformant) strengthens "architectural substrate" positioning rather than threatening it
- AICM's agentic surface is thin (~5 of 243 controls are agent-native) — substantial open territory for AGF
- Intent.md sacred — correctly deferred to post-pillar-confidence review

## 2026-04-21

- **Precise language on relationships matters.** "Primitive X is underneath Y" overclaims when X and Y are parallel expressions of a shared pattern at different scopes/cadences. Trust Ladders and ATF tiers both express earned autonomy but operate per-agent-runtime vs per-deployment-program. Correct framing: "parallel expressions," not "underneath."
- **Industry converged on "harness" = full governance envelope, not design-time scaffold.** Anthropic, Parallel, Jiun Kim SSRN paper, Philschmid all treat harness as source + runtime adapters combined. Agent = Model + Harness is the dominant formula. Earlier AGF-internal framing that drew a hard line between design-time and runtime was wrong; Source → Build → Runtime is the pattern *within* the harness.
- **TOGAF/SABSA/COBIT are meta-frameworks above content frameworks.** They don't sit as peers to AICM/ATF/OWASP in a layer stack — they're enterprise-architecture methods that wrap any architecture artifact. Correct treatment: acknowledge as "What Sits Above This Stack," defer crosswalks until demand emerges.
- **Calibration > rewrite for positioning drafts.** External review (user voice) flagged 8 credibility issues (canonical overclaims, vendor-weight imbalance, future-dated claims, implementation-ahead language). Tightening claims preserved architecture while making the doc defensible. Promotion after calibration, not structural rewrite, was the right call.
- **"Non-existent" beats "Awareness" as L1 for honest maturity assessment.** Most orgs with agents in production have zero formal governance. "Non-existent" names that state accurately; "Awareness" implies prior investment that usually doesn't exist. L1 → L2 becomes the headline governance investment story.
- **Dual-form has teeth at gate boundaries, not just at primitive level.** D12 §4 refinement: gate decisions (PASS/REVISE/HALT/GATE/ERROR) MUST emit human-readable rationale AND machine-readable artifact simultaneously. A gate that emits only one form forces manual translation and breaks both auditability and agent-operability.

