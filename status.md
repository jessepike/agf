---
updated: 2026-10-28
stage: operate (v0.2.0 published; dormant May–October 2026; restart in progress)
---

# Status — AGF

Current state only. Keep this file under about 80 lines. Dated history from March to May 2026 is in `docs/archive/status-history-2026-03-to-05.md`. The full current-state baseline is `docs/baseline/2026-10-28-current-state.md`.

## Where things stand (2026-10-28)

AGF v0.2.0 is live at https://agf.jessepike.dev. The site matches `main` on GitHub. No content work has happened since 2026-05-02. Jesse started the ePlus role in late May and the project went dormant.

On 2026-10-28 the project restarted with three steps. The first is a cleanup and baseline, which is this session. The second is an October 2026 landscape research pass, which goes in `research/2026-10/`. The third is a future-state and roadmap conversation once the research is in.

Nobody outside Jesse is known to be using AGF. It has never been marketed. Treat it as a working reference architecture, not a production system.

## In flight

- The October 2026 research pass is being written into `research/2026-10/` by a separate session. Don't edit that folder from other sessions until it lands.
- The ten runtime integration contract forks are still undecided. The draft is in `.private/drafts/runtime-integration-contract-2026-05-02.md`. These forks have blocked the Tier A structural work since May.
- Two older proposals are still undecided: `.private/drafts/seven-layer-stack-clarification-2026-05-01.md` and `.private/drafts/intent-voice-position-2026-05-01.md`.

## Next

1. Finish the October research and fold its results into the baseline's gap list.
2. Hold the future-state conversation. What is AGF for now, who is it for, and is it worth continued investment?
3. Then decide the runtime contract forks, or retire them if the future state changes direction.
4. Bring in the agent hooks article (deterministic lifecycle hooks) as input for a hooks-based MVC reference implementation. Nothing from it is in the repo yet.

## Known housekeeping

- `.private/research/AAIF/` holds about 33 GB of MCP Dev Summit video, both trimmed and untrimmed copies. It is gitignored and lives on this Mac only. The untrimmed copies (about 12 GB) are candidates for deletion or offloading.
- Everything under `.private/` lives only on this Mac and has no backup through GitHub. See `docs/operations/estate-map.md` for what it holds.
- The repository is public. Never commit ePlus, client, or commercial strategy material outside `.private/`.
