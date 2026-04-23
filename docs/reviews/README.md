# AGF Reviews — Format, Rubric, Process

**Purpose:** Canonical location for all reviews of AGF — external, internal multi-agent, peer. Every review stored raw, findings extracted to the ledger, tracked through triage → implementation → validation.

---

## What goes here

- `README.md` — this file (format spec, rubric, confidence gradient)
- `YYYY-MM-DD-<reviewer-slug>.md` — one file per review, verbatim, with metadata frontmatter
- See `/docs/findings-ledger.md` (repo root) for the cross-review findings ledger

Reviews are stored verbatim, dated, sourced. Nothing is summarized or interpreted in this directory — that happens in the ledger.

---

## Raw-review file format

Each review file uses this frontmatter:

```yaml
---
reviewer: "GPT-5.4"                         # or "agf-architect", "Codex", "@handle/name", etc.
reviewer_type: external-model               # external-model | internal-agent | human-peer | internal-self
review_date: 2026-04-23
agf_version_reviewed: 0.2.0
source: "<url or artifact reference>"       # e.g. commit SHA, conversation ID, PR number
scorecard:                                  # optional; present if reviewer scored
  clarity: 5
  coherence: 6
  defensibility: 5
  differentiation: 6
  actionability: 4
  credibility: 5
  public_readiness: 5
  mechanical_integrity: null                # use null if not scored
findings_extracted_to: docs/findings-ledger.md
---
```

Body: the review verbatim. Do not edit, trim, or paraphrase. Add section anchors for findings reference if the reviewer didn't.

---

## Findings ledger (`docs/findings-ledger.md`)

Every finding extracted from a review gets a unique F-ID and a row in the ledger. One row per finding. Never two reviews share an F-ID.

**F-ID convention:** `<reviewer-prefix>-F##` — e.g., `G5-F01` for GPT-5.4 finding 1. Keeps the source visible in every commit message.

Each finding record captures:

| Field | Required | Notes |
|---|---|---|
| F-ID | Yes | Unique across all reviews |
| Review | Yes | Filename in `docs/reviews/` |
| Date | Yes | Source review date |
| Summary | Yes | One-line distillation |
| Severity | Yes | Critical / High / Medium / Low |
| Confidence | Yes | Established / Informed / Open (see gradient below) |
| Dimension | Yes | Which scorecard dimension it affects |
| State | Yes | open / accepted / deferred / rejected / resolved / validated / regressed |
| Decision | If not `open` | 1–2 lines of rationale for accept/defer/reject |
| Owner | If not `open` | Jesse / CMO / CPO / agf-architect / deferred |
| Backlog link | If accepted | Anchor in `BACKLOG.md` or issue number |
| Commits | If resolved | SHAs that addressed it |
| Validation | If resolved | `pending / validated / regressed` + date |

---

## Confidence gradient (AGF-native)

Applied to every finding. Mirrors AGF's own epistemic discipline from `docs/shared-vocabulary.md`. Dogfooding our own vocabulary on our own review process.

| Level | Meaning |
|---|---|
| **Established** | Clear evidence in the reviewed artifact; likely multiple reviewers would agree independently. Directly quotable. |
| **Informed** | Reviewer's synthesis; plausible but single-source; worth verifying before acting. |
| **Open** | Flagged but speculative; needs investigation before it becomes an action. Do not move to `accepted` until escalated to Informed or Established. |

**Why two axes** (severity × confidence): prevents acting on low-confidence opinion as if it were defect; prevents deferring defects with high confidence just because severity is low.

Priority rule of thumb:
- High severity + Established confidence → fix soon
- High severity + Open confidence → investigate first
- Low severity + Established confidence → easy win, batch with other work
- Low severity + Open confidence → likely noise, archive

---

## Scorecard rubric

Eight dimensions, each scored 0–10. Baseline established from GPT-5.4 review 2026-04-23 (v0.2.0). Recalibrate per review; trajectory matters more than absolute.

| Dimension | What it measures |
|---|---|
| **Clarity** | Language precision, structure, scannability, navigability |
| **Coherence** | Vocabulary alignment, concept hierarchy, internal consistency |
| **Defensibility** | Claims survive challenge; evidence supports assertions |
| **Differentiation** | Unique value demonstrated (not just asserted); comparison proofs |
| **Actionability** | Practitioners can implement from what's on the page |
| **Credibility** | Inline citations, confidence-level discipline visible, tone calibrated to proof |
| **Public Readiness** | Safe to share widely; does not mislead or overclaim |
| **Mechanical Integrity** | Links resolve, build passes, images load, no typos, routing correct |

Composite: simple average for now (weights calibrate as we collect more reviews).

**v0.2.0 baseline:** 5.1/10 average (7 dimensions from GPT-5.4). Mechanical Integrity not assessed by GPT-5.4 — machine-verifiable via `bin/check-links.mjs`, `bin/lint-mdx.sh`, `pnpm build`.

---

## Lifecycle of a finding

```
1. INGEST     Review arrives → stored verbatim in docs/reviews/YYYY-MM-DD-*.md
2. EXTRACT    Each discrete finding → row in docs/findings-ledger.md with F-ID
3. TRIAGE     Per finding: accept / defer / reject, with rationale
4. IMPLEMENT  Accepted findings → BACKLOG entry with F-ID cross-ref;
              commits reference F-ID ("Closes G5-F01")
5. VALIDATE   Post-release, reviewer (usually agf-architect) checks fix
              actually addresses finding; mark `validated` or `regressed`
6. PUBLISH    Ledger remains public in repo; aggregate eventually exposed
              on site as /reviews for credibility visibility
```

**Never** delete a finding. Resolved, rejected, invalidated — all preserved. The record is the value.

---

## Commit message convention

When a commit addresses findings, reference F-IDs in the commit body:

```
fix(site): add inline citations to Trust Ladders empirical claims

Closes G5-F03.
Related: G5-F04 (partial — confidence markers still pending).
```

The `Closes`/`Related` keywords let future readers trace every change back to the finding that motivated it.

---

## External reviews vs internal reviews

**External:** GPT-5.4, Codex, peer reviewers, named community readers. Treated as authoritative input; findings extracted as-is.

**Internal (future):** multi-agent panel run periodically (agf-architect + standards + editorial + practitioner + adversarial reviewers). Same format, same ledger. Convergent findings across multiple internal reviewers can escalate from Informed to Established.

Cross-reviewer convergence is a credibility multiplier — if GPT-5.4 and an internal adversarial review both flag the same issue, that's stronger signal than either alone. Ledger tracks cross-references via `Related` field.
