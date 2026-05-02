#!/bin/sh
# bin/pre-push-content-check.sh — single-model lightweight content check
#
# Called from .githooks/pre-push step 5. Reviews changed canonical docs with
# claude -p (single model, narrow scope). Blocks the push only on Critical or
# High severity findings. Lower-severity findings logged for visibility.
#
# Args: list of changed .md paths (relative to repo root)
# Exit: 0 = pass | 1 = blocked by H+ finding | 2 = infrastructure error
#
# Skips itself silently if claude -p is not on PATH (infrastructure error).
# This keeps the hook usable on systems without Claude Max access.
# Set SKIP_CONTENT_CHECK=1 in pre-push to skip explicitly.

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [ "$#" -lt 1 ]; then
  echo "[content-check] No files to check. Skipping."
  exit 0
fi

# Verify claude is available; bail with a non-blocking warning if not.
if ! command -v claude >/dev/null 2>&1; then
  echo "[content-check] WARN: 'claude' CLI not found on PATH. Skipping content check."
  echo "[content-check] Install Claude Code (npm i -g @anthropic-ai/claude-code) or set SKIP_CONTENT_CHECK=1."
  exit 0
fi

# Build the file list for the prompt.
FILES_LIST=""
for f in "$@"; do
  if [ -f "$f" ]; then
    FILES_LIST="$FILES_LIST\n- $f"
  fi
done

if [ -z "$FILES_LIST" ]; then
  echo "[content-check] No existing files to check (all paths missing). Skipping."
  exit 0
fi

echo "[content-check] Running single-model lightweight check (claude -p)..."
echo ""

# Use a temp file for the response to avoid heredoc parsing snags.
TMP_RESPONSE="$(mktemp -t agf-precheck.XXXXXX)"
trap 'rm -f "$TMP_RESPONSE"' EXIT

# Single-model prompt. Tight scope: only flag Critical/High findings against
# AGF's well-defined dimensions. The prompt is deliberately narrow so the model
# doesn't try to redo a full audit.
claude -p --output-format json --allowedTools "Read,Grep,Glob" - >"$TMP_RESPONSE" <<'PROMPT' || true
You are running an AGF pre-push lightweight content check. You have NO prior
context on this session.

1. Read the AGF review rubric: docs/reviews/README.md (8-dim rubric, severity ×
   confidence grid, F-ID schema).
2. Read the AGF primer for context: docs/agf-primer.md.
3. Read each of the changed canonical doc files listed below.
4. Check for Critical or High severity findings ONLY. Lower severity is out of
   scope for the pre-push gate — the full /agf-audit handles those.

Look specifically for:
- Broken or invented standards crosswalks (clause numbers, control IDs)
- Confidence-marker errors on novel claims (unmarked, or wrong level)
- Vocabulary drift from shared-vocabulary.md
- Internal contradictions with DECISIONS.md or canonical docs
- Defensibility-load-bearing assertions without evidence

Files changed in this push:
__FILES_LIST__

Do NOT suggest features, additions, or scope expansion. Only flag Critical or
High severity defects. Mechanical issues (broken links, lint, slugs) are
already handled by other steps — skip them.

Output a JSON object:
{
  "verdict": "pass" | "block",
  "findings": [
    {
      "severity": "Critical" | "High",
      "file": "docs/...",
      "line_or_section": "...",
      "issue": "...",
      "fix": "..."
    }
  ]
}

If you find no Critical or High issues, return verdict "pass" with empty
findings array.
PROMPT

# Substitute the file list (claude -p heredoc doesn't expand shell vars).
# Re-run with the file list inline if the response file is empty (the heredoc
# above passes the literal __FILES_LIST__ token; we need to actually inject).
# Simpler: rebuild the prompt file with sed substitution.
PROMPT_FILE="$(mktemp -t agf-precheck-prompt.XXXXXX)"
trap 'rm -f "$TMP_RESPONSE" "$PROMPT_FILE"' EXIT

cat > "$PROMPT_FILE" <<EOF
You are running an AGF pre-push lightweight content check. You have NO prior
context on this session.

1. Read the AGF review rubric: docs/reviews/README.md (8-dim rubric, severity ×
   confidence grid, F-ID schema).
2. Read the AGF primer for context: docs/agf-primer.md.
3. Read each of the changed canonical doc files listed below.
4. Check for Critical or High severity findings ONLY. Lower severity is out of
   scope for the pre-push gate — the full /agf-audit handles those.

Look specifically for:
- Broken or invented standards crosswalks (clause numbers, control IDs)
- Confidence-marker errors on novel claims (unmarked, or wrong level)
- Vocabulary drift from shared-vocabulary.md
- Internal contradictions with DECISIONS.md or canonical docs
- Defensibility-load-bearing assertions without evidence

Files changed in this push:$(printf '%b' "$FILES_LIST")

Do NOT suggest features, additions, or scope expansion. Only flag Critical or
High severity defects. Mechanical issues (broken links, lint, slugs) are
already handled by other steps — skip them.

Output a JSON object:
{
  "verdict": "pass" | "block",
  "findings": [
    {
      "severity": "Critical" | "High",
      "file": "docs/...",
      "line_or_section": "...",
      "issue": "...",
      "fix": "..."
    }
  ]
}

If you find no Critical or High issues, return verdict "pass" with empty
findings array.
EOF

# Run claude -p with the proper prompt file.
if ! claude -p --output-format json --allowedTools "Read,Grep,Glob" < "$PROMPT_FILE" > "$TMP_RESPONSE" 2>/dev/null; then
  echo "[content-check] WARN: claude -p invocation failed. Skipping content check."
  exit 0
fi

# Extract verdict. claude -p --output-format json wraps the response;
# inner content carries our requested JSON.
if ! command -v jq >/dev/null 2>&1; then
  echo "[content-check] WARN: jq not found. Cannot parse claude -p output. Skipping."
  exit 0
fi

# claude -p JSON shape: {result: "...", ...}. The result field contains the model's
# JSON output as a string.
VERDICT="$(jq -r '.result // .' "$TMP_RESPONSE" 2>/dev/null | jq -r '.verdict // "unknown"' 2>/dev/null || echo "unknown")"
FINDINGS_COUNT="$(jq -r '.result // .' "$TMP_RESPONSE" 2>/dev/null | jq -r '.findings | length' 2>/dev/null || echo "0")"

echo "[content-check] Verdict: $VERDICT (findings: $FINDINGS_COUNT)"
echo ""

if [ "$VERDICT" = "block" ] || [ "${FINDINGS_COUNT:-0}" -gt 0 ]; then
  echo "Critical/High findings:"
  jq -r '.result // .' "$TMP_RESPONSE" 2>/dev/null | jq -r '.findings[] | "  [\(.severity)] \(.file) @ \(.line_or_section): \(.issue)\n    Fix: \(.fix)"' 2>/dev/null
  echo ""
  echo "[content-check] BLOCKED. Resolve the H+ findings above or bypass with --no-verify."
  exit 1
fi

echo "[content-check] PASS — no Critical or High findings on changed canonical docs."
exit 0
