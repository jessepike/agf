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

```text
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

```text
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

---

## Meta-Finding Closeout Protocol

Meta-findings (F-IDs prefixed `M`, e.g., `G5-M01`) record reader-level patterns across multiple artifacts or passages. They do not close automatically when their known child findings close. Closing children validates concrete defects; the meta captures a felt pattern that may persist beyond the listed examples.

Closeout answers one question:

> Does the original pattern still describe the current artifact when read cold?

That question is broader than "were the listed examples fixed?"

### Core rule

Child findings are an evidence set, not an exhaustive set. Therefore:

- Validating all children does **not** auto-validate the meta.
- A meta-finding closes only through an explicit **meta closeout pass**.
- The closeout pass validates the pattern at artifact level, not at diff level.

### Trigger

Run a meta closeout pass only when all three conditions hold:

| Condition | Requirement | Why |
|---|---|---|
| Child stability | Every current child is in a stable non-open state: `validated`, `deferred`, or `rejected` | `accepted` and `resolved` are still in motion; closing the meta before its children stabilize certifies a pattern before the work has landed |
| Scope clarity | The affected pages or sections are named in the ledger note or inferable from the source review | Prevents hand-wavy re-reads |
| Review intent | The related content pass is complete, or Jesse explicitly calls the closeout | Keeps this from firing mechanically mid-stream |

If any child is still `open`, `accepted`, or `resolved`, the meta is not ready for closeout.

### Reviewer independence (tiered)

Reviewer independence materially lowers false-closure risk. Use the strongest tier available:

| Tier | Counts as "fresh eyes" | Use |
|---|---|---|
| **Strong** | External reviewer, or internal agent that did not author the fixes and did not validate the children | Default for any High-severity meta |
| **Acceptable** | Different internal reviewer who may know the workstream but did not write the closing edits | Normal fallback |
| **Weak** | Same author after an explicit time delay, marked as self-review in the closeout note | Only when no better option exists — must be labeled |

**Minimum rule:** the reviewer for the closeout pass must not be the primary author of most child-finding fixes.

**Scaling rule:** higher-stakes decisions demand more reviewers. A Low-severity meta in a peripheral area can close on one Strong-tier reviewer. A High-severity meta affecting public-facing credibility or core vocabulary (e.g., `G5-M01`, `G5-M02`, `G5-M03`) should be validated by **multiple independent reviewers using different models or different review personas**. When in doubt, add a reviewer. Confidence in the closeout scales with the number and diversity of fresh eyes, not with the reviewer's confidence in their own judgment.

### Method

The reviewer performs one holistic pass:

1. Re-read the source review sections that produced the meta-finding.
2. Re-read the current state of the affected pages as a cold reader.
3. Test the original pattern statement directly, not just the child checklist.
4. Note any new concrete examples that still support the pattern.
5. Record one verdict and a brief rationale in the ledger.

### Closeout note schema

Add a `### Closeout pass YYYY-MM-DD` subheading under the meta-finding's detail block with these fields:

| Field | Content |
|---|---|
| Pass date | YYYY-MM-DD |
| Reviewer | Name or agent; tier (Strong / Acceptable / Weak); reviewer identity for multi-reviewer passes |
| Scope read | Specific pages or sections checked |
| Verdict | One of the three below |
| Rationale | 3–6 sentences, artifact-level (not diff-level) |
| New children | F-IDs of any new concrete findings filed during the pass |
| Scorecard delta | Required for `G5-M03` and any public-readiness meta — see Strategic-meta rule |

### Verdicts and lifecycle mapping

Verdicts are validation outcomes, not replacement states. Each maps back to the existing lifecycle:

| Verdict | Meaning | Ledger state outcome | Required additional action |
|---|---|---|---|
| `pattern-closed` | The original pattern no longer materially describes the current artifact | Meta state becomes `validated` | — |
| `pattern-persists` | The original pattern still holds, even after known examples were fixed | Meta state stays `accepted` | **At least one new child finding must be filed** naming a specific remaining instance. A rationale-only hold-open is not allowed — if the re-read found nothing new, the verdict should be `pattern-shifted` instead |
| `pattern-shifted` | The original pattern is no longer the right description, but a different pattern now dominates | Original meta becomes `validated` | New meta-finding must be filed capturing the replacement pattern |

Why `validated` for `pattern-shifted`: the original claim has been tested and found no longer accurate. The replacement concern is tracked as a new finding, not smuggled into the old one.

### Strategic-meta rule (scorecard threshold)

Metas tied to scorecard dimensions — currently `G5-M03` (Public Readiness) and any future meta targeting a specific dimension — require **both** a qualitative re-read **and** a quantitative re-score before `pattern-closed` is valid.

| Requirement | G5-M03 threshold |
|---|---|
| Re-read | Cold reader confirms the pattern no longer holds (Strong-tier reviewer required) |
| Scorecard | The target dimension (Public Readiness for M03) is re-scored at ≥8/10 by an independent reviewer who did not author the fixes |

Both signals must point the same direction. If the re-read says `pattern-closed` but the scorecard remains below threshold, verdict is `pattern-persists` (not closed) and additional children should be filed. Quantitative evidence beats qualitative intuition when they disagree for strategic metas.

### Edge cases

- **Deferred children:** Do not block closeout if the defer rationale is explicit. The pass asks whether the pattern still holds despite that deferral.
- **Rejected children:** Do not block closeout. Rejection means the example was misframed, not that the umbrella pattern vanished.
- **New evidence found during re-read:** File new child findings immediately. Do not mark the meta `validated`.
- **Scope changed since original review:** Still test the original pattern against the new artifact. Meta-findings are artifact-facing, not line-facing.
- **Meta with no children:** Do not close. Add at least one concrete evidence item or explicitly record why the meta remains strategic-only.
- **Previously validated meta returns:** Move to `regressed` only if the same validated pattern is demonstrably back. If the concern is materially different, file a new meta.

### Worked example — `G5-M01`

`G5-M01` says AGF "promises rigor, evidence, and confidence without showing enough." Its children include citation gaps, confidence-marker delivery, overclaiming, and visible status signaling.

Suppose all children reach `validated` or `deferred`. The closeout pass re-reads the homepage, `what-is-agf`, `relationship-to-frameworks`, `primitives`, and other flagship pages and asks:

> Does a cold reader still feel that AGF claims rigor more strongly than it demonstrates it?

Possible outcomes:

- `pattern-closed` — citations and confidence posture are now visible enough that the complaint no longer fits. `G5-M01` → `validated`.
- `pattern-persists` — listed examples were fixed, but new uncited empirical claims or unlabeled synthesis claims dominate. `G5-M01` stays `accepted`; at least one new child finding is filed naming the specific new instance(s).
- `pattern-shifted` — rigor is now visible, but a stronger remaining concern is uneven public readiness rather than evidence posture. `G5-M01` → `validated`; new meta or existing `G5-M03` carries the forward concern.

### Integration with the lifecycle

This protocol extends the existing finding lifecycle without adding new states:

```text
OPEN → (triage) → ACCEPTED | DEFERRED | REJECTED
                → RESOLVED (work shipped) → VALIDATED (reviewer confirmed, including meta closeout pass)
                                         → REGRESSED (previously validated, now failing)
```

Meta closeout is a specialized validation method. All three verdicts map back to lifecycle states the ledger already supports.
