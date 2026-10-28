# AGF Current-State Baseline — 2026-10-28

This is the starting point for the October 2026 restart. It records what AGF is, what exists, how it is published, and what is unfinished, as of the day the project came out of five months of dormancy. The October research pass (`research/2026-10/`) and the future-state conversation build on it.

## Summary

AGF v0.2.0 is a published, internally coherent reference architecture with no known adopters. Its last content change was on 2026-05-02. The site, GitHub, and the local repo are in sync except for the commits made during this cleanup. In April and May 2026, three independent model reviews put its quality at about 6.6 out of 10. They found the architecture credible as framing but not yet as an implementable or evidenced standard. The main gaps are structural: there is no runtime integration contract, no reference implementation, and no adoption evidence. Editorial polish will not close them. The standards landscape it synthesizes has moved for six months without it.

## What AGF is

AGF (Agentic Governance Framework) is a reference architecture and operating model for governing agentic AI systems. It is authored and maintained by Jesse Pike and licensed CC BY 4.0. It positions itself as a synthesis layer. It invents little. It composes NIST AI RMF, OWASP's agentic threat work, CSA MAESTRO and ATF, ISO/IEC 42001, the EU AI Act, Singapore IMDA's agentic framework, and OpenTelemetry GenAI conventions into one model. Every claim carries a confidence label: Established, Informed, or Open.

Its core constructs:

- The **Rings Model**: four concurrent layers (Execution, Verification, Governance, Learning) plus a cross-cutting fabric for identity, events, provenance, errors, and security.
- **19 primitives** mapped to the rings, with named tensions between them, each resolved by an invariant.
- The **Governance Decision Record (GDR)**, a canonical audit artifact for gate decisions, with a YAML schema in `docs/schemas/gdr.yaml`. This is AGF's most original concrete contribution.
- **Trust Ladders**: adaptive gates relax with demonstrated performance, but mandatory gates never relax.
- **Composition patterns**, which double as maturity stages: Minimum Viable Control, Validation Pipeline, Governed Decision Flow, and Full Governed. A "First 30 Days" guide covers the first stage.
- **Three deployment modes** (wrapper, middleware, graph-embedded) and a **three-level security model** with a Security Response Bus.
- **Five role profiles**: security, platform, GRC, AI engineering, and observability.

## What exists

| Asset | State |
|---|---|
| Canonical docs (`docs/`) | 14 core docs, 5 profiles, 2 white papers, about 775 KB of markdown. `agentic-primitives.md` alone is about 215 KB. |
| Published site | 35 MDX pages across overview, profiles, reference, resources, and transparency sections, plus `llms.txt`. |
| Diagrams | 26 PNGs with specs in `diagrams/DIAGRAM-SPECS.md`. |
| Decision log | `DECISIONS.md`, public. |
| Reviews and findings | 5 reviews ingested into `docs/reviews/`. The findings ledger has 16 open, 23 resolved but not yet validated, 17 validated, 4 deferred, and 2 accepted findings. |
| Release tooling | Preflight, lint, link check, drift report, diagram sync, deployed-site smoke test (`bin/`), a pre-push hook, and a GitHub Actions smoke workflow. |
| Agent support | A dedicated `agf-architect` agent with review, audit, crosswalk, and drift modes, defined outside this repo. |
| Reference implementation | None. |
| Adopters or case studies | None known. |

## How it is published

The repo at `~/code/clients/risk/AGF` pushes to `github.com/jessepike/agf`, which is public. Vercel project `agf` builds `agf-docs/` on every push to `main` and serves it at https://agf.jessepike.dev. The full map, including related folders outside this repo, is in `docs/operations/estate-map.md`.

The production deployment on this date was built from commit `972eee0` (2026-05-02), which was then the head of `main` on GitHub.

## Quality as last measured

Three models reviewed v0.2.0 on 2026-05-01, each through a different lens. The composite was about 6.6 out of 10 (Gemini 3.1 Pro 6.6, GPT-5.5 6.5, Opus 4.7 6.75). An earlier single-family review chain had projected 7.5, and the cross-model pass showed that projection was generous. Full reviews are in `docs/reviews/`.

The consistent message was that AGF is citable as architecture framing but not yet as evidence of what works in production.

## What is unfinished

The structural blockers identified in May 2026:

1. **Runtime integration contract.** The current docs don't specify GDR and event atomicity, signal arbitration, the DELEGATE handshake, the ESCALATE and DEFER lifecycle, or REVISE chain bounds. A full proposal with ten decision points is drafted privately and awaiting decisions.
2. **Standards fidelity.** A May pass found and fixed mapping errors (ISO 42001 clause, EU AI Act Article 12). A deep audit of ISO 42001 Annex A and EU AI Act articles was never completed.
3. **Adoption evidence.** No case study or design partner. The reviewers agreed this cannot be manufactured editorially.
4. **Reference implementation.** No code exists. The strongest candidate is a hooks-based Minimum Viable Control in middleware mode, where agent lifecycle hooks map onto primitives #6, #7, #8, #10, and #14.

Also pending:

- Two proposals about how the seven-layer stack is described and about the framework's voice. Both are drafted and waiting on Jesse.
- A multi-axis conformance matrix (pattern by maturity by risk tier).
- Crosswalk files (`docs/crosswalks/`), planned but never created.
- An older backlog of profile, primitive, and site items, listed in `BACKLOG.md` with April and May dates.

## What has gone stale

- **The landscape.** Every external framework AGF composes has had six months of movement it hasn't absorbed. The October research pass covers this.
- **Agent context.** `docs/agf-primer.md` and the external context bundle that other agents load both describe the project as of May 2026.
- **Dates.** `intent.md` was last updated 2026-03-17. `docs/publication-map.md` was last updated 2026-04-21.

## Cleanup done on 2026-10-28

- Made this repo the single home for AGF and documented the full estate in `docs/operations/estate-map.md`.
- Moved the 713-line status log to `docs/archive/status-history-2026-03-to-05.md`, and replaced `status.md` with a short current-state file.
- Retired a second, older context system under `.private/` (its own status, backlog, handoffs, and a conflicting local CLAUDE.md). The root `CLAUDE.md` is now the only authority.
- Deleted `LICENSE-TODO.md`. The license decision was made in April and is recorded in `DECISIONS.md`.
- Brought related material from other folders into a private, gitignored index, so nothing AGF-related is orphaned.
- Added a restart queue to the top of `BACKLOG.md`.

## Open questions for the future-state conversation

- Who is AGF for now, and what is it meant to do for Jesse? The candidates are a public reputation asset, a method behind advisory work, and a standalone product.
- Given six months of landscape movement, is the synthesis position still open, or has another body claimed it?
- Is the next investment content (fidelity, crosswalks, primer), code (the hooks reference implementation, a GDR emitter), or evidence (a design partner)?
- Should the ten runtime contract decisions be made now, or wait until the future state is clear?
