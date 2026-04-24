---
reviewer: "internal-tooling"
reviewer_type: internal-tooling
review_date: 2026-04-23
agf_version_reviewed: 0.2.0
source: "bin/check-links.mjs + bin/lint-mdx.sh + bin/preflight.sh on commit 85d00af"
scorecard:
  clarity: null
  coherence: null
  defensibility: null
  differentiation: null
  actionability: null
  credibility: null
  public_readiness: null
  mechanical_integrity: 6
findings_extracted_to: docs/findings-ledger.md
finding_prefix: MI
---

# Mechanical Integrity Baseline — v0.2.0

Run of `bin/check-links.mjs`, `bin/lint-mdx.sh`, `bin/preflight.sh` to establish the Mechanical Integrity scorecard dimension and surface tooling-discoverable defects.

## Summary

**Mechanical Integrity: 6/10**

Build passes cleanly. One real broken internal link. Spell-check dictionary uninitialized (61 technical terms flag as unknown). Two markdownlint violations on recently-added content. Two script false-positives (needs refinement). One preflight UX friction (untracked-file handling).

## check-links.mjs output

```text
Checking 25 files...
  [BROKEN-ASSET] agf-docs/content/docs/overview/what-is-agf.mdx:109 → /docs
  [BROKEN-ASSET] agf-docs/app/page.tsx:103 → /
  [BROKEN-ASSET] agf-docs/app/page.tsx:378 → /llms.txt
Internal broken links: 3
=== Link Check FAILED ===
```

Analysis:

- `what-is-agf.mdx:109 → /docs` — real broken link target (no `/docs` index route exists). Relates to GPT-5.4 finding G5-F10 (broken primitive catalog link in same file).
- `page.tsx:103 → /` — false positive (homepage route; script doesn't recognize root)
- `page.tsx:378 → /llms.txt` — false positive (llms.txt route exists at `agf-docs/app/llms.txt/route.ts`)

## lint-mdx.sh output

- **markdownlint:** 2 line-length errors + 6 table-column-style errors in `content/docs/resources/vocabulary.mdx` lines 90, 98, 105 — all introduced by the Gate Vocabulary section added 2026-04-22
- **cspell:** 61 unknown words across 17 files. Dictionary uninitialized; all flagged words are legitimate technical terms (CISO, SIEM, GPAI, IMDA, SPIFFE, NGAC, HITL, Microsegmentation, Exfiltration, Checkpointing, Tomašev, Neur, Astrix, etc.)
- **MDX parse-landmine grep:** 1 warning on `governance-decision-record.mdx:202` — `<2%` inside a YAML fenced code block. False positive (not MDX-parsed content).

## preflight.sh output

Fails on untracked rings-model v2-v6 diagrams (user's in-flight iteration, explicitly not to be committed). UX friction — preflight should distinguish modified-tracked from untracked.

## Scoring rationale

- Build: passes ✓ (+3)
- Links: 1 real / 3 total ⚠ (-1 real, +0 false positives don't penalize content)
- markdownlint: 2 real issues ⚠ (-0.5)
- cspell: baseline-normal (uninitialized dictionary isn't content defect) (0)
- MDX parse: clean (1 false positive) ✓
- Script false positives themselves: -0.5 (tooling weakness)

Net: **6/10**. Fast to raise to 8–9 once cspell dictionary populated, vocabulary.mdx cleaned, `/docs` link fixed, and false positives handled.

## Findings extracted

6 findings extracted to ledger (MI-F01 through MI-F06). See `docs/findings-ledger.md`.
