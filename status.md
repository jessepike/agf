---
updated: 2026-11-10
stage: operate (v0.2.0 published; dormant May–October 2026; restart in progress)
---

# Status — AGF

Current state only. Keep this file under about 80 lines. Dated history from March to May 2026 is in `docs/archive/status-history-2026-03-to-05.md`. The full current-state baseline is `docs/baseline/2026-10-28-current-state.md`.

## Where things stand (2026-10-28)

AGF v0.2.0 is live at https://agf.jessepike.dev. The site matches `main` on GitHub. No content work has happened since 2026-05-02. Jesse started the ePlus role in late May and the project went dormant.

On 2026-10-28 the project restarted with three steps. The first is a cleanup and baseline, which is this session. The second is an October 2026 landscape research pass, which goes in `research/2026-10/`. The third is a future-state and roadmap conversation once the research is in.

Nobody outside Jesse is known to be using AGF. It has never been marketed. Treat it as a working reference architecture, not a production system.

On 2026-11-10 the future-state conversation was held. Jesse restated the purpose: AGF is a practitioner's map that stitches the leading sources together, bridges them, and fills or names gaps, for a security or risk leader who is early in building the program. `intent.md` has said this since March and now also names the reader and four tests for judging AGF. AGF is not parked.

## In flight

- The October 2026 landscape research landed on `main` on 2026-11-10 in `research/2026-10/` (13 files, researched 2026-10-28). It is a dated snapshot, so record corrections as dated notes and do not edit findings in place. Start with `research/2026-10/12-delta-vs-agf-baseline.md`.
- The ten runtime integration contract forks are still undecided. The draft is in `.private/drafts/runtime-integration-contract-2026-05-02.md`. These forks have blocked the Tier A structural work since May.
- A proposed positioning decision (#12) awaits Jesse's acceptance. It brings positioning back in line with `intent.md` and replaces the "Layer 0 substrate" wording of decision #4. The draft is `.private/drafts/purpose-and-positioning-2026-11-10.md`. Scope was settled on 2026-11-10: AGF stays agentic.
- A landscape and revival review dated 2026-11-10 is in `.private/reviews/`. It lists about 20 wrong or stale facts in the canonical docs.
- Two older proposals are still undecided: `.private/drafts/seven-layer-stack-clarification-2026-05-01.md` and `.private/drafts/intent-voice-position-2026-05-01.md`.

## Next

1. Finish the fact fixes. A first pass of source-checked corrections landed on 2026-11-10 (see `CHANGELOG.md`). Still open and not yet verified: NIST program naming, MITRE ATLAS counts, the OpenTelemetry version reference, the OWASP MCP Top 10 date, and the dated "state of play" section in `docs/agentic-observability.md`.
2. Accept or amend proposed decision #12.
3. Build a "start here" map for the early-stage reader and make it the site's front door.
4. Publish a worked example: Security Market Pulse scored against the primitives, patterns only, limits stated. A draft scorecard is in the private `agf-applied` catalog.
5. Publish a decision vocabulary crosswalk (AGF, OWASP ACS, CSA AARM, agent hooks).
6. Decide the three older drafts. The review recommends deciding four of the ten runtime contract forks and deferring six.
7. Review AGF against the four tests in `intent.md`, with at least one working security leader.

## Known housekeeping

- `.private/research/AAIF/` holds about 22 GB of MCP Dev Summit video (trimmed copies and session clips). It is gitignored and lives on this Mac only. The two untrimmed originals (about 12.5 GB) were deleted on 2026-11-10.
- Everything under `.private/` lives only on this Mac and has no backup through GitHub. See `docs/operations/estate-map.md` for what it holds.
- The repository is public. Never commit ePlus, client, or commercial strategy material outside `.private/`.
