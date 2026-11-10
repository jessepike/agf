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

- Decision #12 was accepted on 2026-11-10 and is in `DECISIONS.md`. AGF is a practitioner's map across the agentic governance sources, with gap-fills. Scope stays agentic. The "Layer 0 substrate" wording of decision #4 is superseded.
- A "Start Here" page was added on 2026-11-10 and is the site's front door. Its outside facts were checked that day.
- Pages that still use Layer 0 wording and need revising: `docs/relationship-to-frameworks.md` and its site copy, `docs/agf-primer.md`, the home page hero text, the seven-layer diagram, and the D3 and D4 summaries.
- The October 2026 landscape research is in `research/2026-10/`, with dated correction notes from 2026-11-10. A landscape and revival review dated 2026-11-10 is in `.private/reviews/`.
- Three older proposals are still undecided: the runtime integration contract (ten forks), the seven-layer stack clarification, and the intent and voice position, all in `.private/drafts/`. Decision #12 overtakes most of the second.

## Next

1. Revise the pages listed above so they match decision #12.
2. Publish a worked example: Security Market Pulse scored against the primitives, patterns only, limits stated. A draft scorecard is in the private `agf-applied` catalog.
3. Publish a decision vocabulary crosswalk (AGF, OWASP ACS, CSA AARM, agent hooks).
4. Decide the three older drafts. The 2026-11-10 review recommends deciding four of the ten runtime contract forks and deferring six.
5. Review AGF against the four tests in `intent.md`, with at least one working security leader.
6. Refresh `docs/agf-primer.md` in full. It has had fact corrections only since May.

## Known housekeeping

- `.private/research/AAIF/` holds about 22 GB of MCP Dev Summit video (trimmed copies and session clips). It is gitignored and lives on this Mac only. The two untrimmed originals (about 12.5 GB) were deleted on 2026-11-10.
- Everything under `.private/` lives only on this Mac and has no backup through GitHub. See `docs/operations/estate-map.md` for what it holds.
- The repository is public. Never commit ePlus, client, or commercial strategy material outside `.private/`.
