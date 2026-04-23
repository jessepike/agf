#!/bin/sh
# bin/lint-mdx.sh — Lint all MDX files in agf-docs/
#
# Runs:
#   1. markdownlint-cli2 (MDX structure)
#   2. cspell (spelling, AGF-specific dictionary)
#   3. grep-based MDX parse-landmine detection
#
# Installs markdownlint-cli2 and cspell as devDependencies in agf-docs/ if missing.
# Usage: lint-mdx.sh [--help]

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AGFDOCS="$REPO_ROOT/agf-docs"
MDX_GLOB="content/docs/**/*.mdx"
PASS=1

while [ $# -gt 0 ]; do
  case "$1" in
    --help|-h)
      echo "Usage: lint-mdx.sh"
      echo ""
      echo "Runs markdownlint-cli2, cspell, and MDX parse-landmine checks against"
      echo "all MDX files in agf-docs/content/docs/."
      echo ""
      echo "Installs markdownlint-cli2 and cspell in agf-docs/ if missing."
      exit 0
      ;;
    *)
      echo "ERROR: Unknown flag: $1" >&2
      exit 1
      ;;
  esac
done

echo "=== AGF MDX Lint ==="
echo ""

# --- Ensure devDeps installed ---
PKG_JSON="$AGFDOCS/package.json"
NEED_INSTALL=0

if ! grep -q "markdownlint-cli2" "$PKG_JSON" 2>/dev/null; then
  echo "[INFO] markdownlint-cli2 not in agf-docs/package.json."
  echo "       Adding as devDependency..."
  pnpm --dir "$AGFDOCS" add -D markdownlint-cli2
  NEED_INSTALL=1
fi

if ! grep -q "cspell" "$PKG_JSON" 2>/dev/null; then
  echo "[INFO] cspell not in agf-docs/package.json."
  echo "       Adding as devDependency..."
  pnpm --dir "$AGFDOCS" add -D cspell
  NEED_INSTALL=1
fi

# Ensure node_modules are up to date if we added deps
if [ "$NEED_INSTALL" = "1" ]; then
  pnpm --dir "$AGFDOCS" install
fi

# --- Ensure cspell project dictionary exists ---
CSPELL_WORDS="$AGFDOCS/.cspell-agf.txt"
if [ ! -f "$CSPELL_WORDS" ]; then
  echo "[INFO] Creating AGF cspell dictionary at agf-docs/.cspell-agf.txt ..."
  cat > "$CSPELL_WORDS" << 'WORDS'
# AGF Project Dictionary — add domain-specific terms here
AGF
AICM
MAESTRO
NIST
OWASP
CSA
AGT
OTAA
GDR
RDG
ATF
BSI
FAIR
primitives
primitive
composability
COBIT
TOGAF
SABSA
SemVer
agentic
harness
observability
traceability
auditability
operationalize
operationalization
MDX
Fumadocs
governance
crosswalk
crosswalks
sandboxing
orchestrator
orchestration
invocations
telemetry
Invariants
reproducibility
gatekeeping
gating
annotating
annotations
WORDS
fi

# Ensure cspell config references the project dictionary
CSPELL_JSON="$AGFDOCS/cspell.json"
if [ ! -f "$CSPELL_JSON" ]; then
  echo "[INFO] Creating agf-docs/cspell.json ..."
  cat > "$CSPELL_JSON" << 'CSPELL'
{
  "version": "0.2",
  "language": "en",
  "words": [],
  "dictionaryDefinitions": [
    {
      "name": "agf-terms",
      "path": "./.cspell-agf.txt",
      "addWords": true
    }
  ],
  "dictionaries": ["agf-terms"],
  "ignorePaths": ["node_modules", ".next", "out", "public"],
  "ignoreRegExpList": [
    "/\\`[^\\`]*\\`/g",
    "/```[\\s\\S]*?```/g",
    "/^import .*/m",
    "/https?:\\/\\/[^\\s]+/g"
  ]
}
CSPELL
fi

# Ensure .markdownlint.jsonc or .markdownlint-cli2.jsonc exists
MDLINT_CONFIG="$AGFDOCS/.markdownlint-cli2.jsonc"
if [ ! -f "$MDLINT_CONFIG" ]; then
  echo "[INFO] Creating agf-docs/.markdownlint-cli2.jsonc ..."
  cat > "$MDLINT_CONFIG" << 'MDLINT'
{
  // markdownlint-cli2 config for AGF MDX files
  "config": {
    "default": true,
    // MDX uses JSX-style components — allow inline HTML
    "MD033": false,
    // Line length — AGF prose can be long
    "MD013": { "line_length": 160 },
    // First heading level — MDX often starts with frontmatter, not H1
    "MD041": false,
    // Allow bare URLs in MDX (referenced in many concept docs)
    "MD034": false
  },
  "globs": ["content/docs/**/*.mdx"],
  "ignorePatterns": []
}
MDLINT
fi

echo ""

# --- Step 1: markdownlint-cli2 ---
echo "--- markdownlint-cli2 ---"
cd "$AGFDOCS"
if pnpm exec markdownlint-cli2 "$MDX_GLOB" 2>&1; then
  echo "[ OK ] markdownlint-cli2 passed."
else
  echo "[FAIL] markdownlint-cli2 found issues."
  PASS=0
fi
echo ""

# --- Step 2: cspell ---
echo "--- cspell ---"
if pnpm exec cspell "content/docs/**/*.mdx" --no-progress 2>&1; then
  echo "[ OK ] cspell passed."
else
  echo "[FAIL] cspell found spelling issues."
  PASS=0
fi
echo ""

# --- Step 3: MDX parse-landmine grep ---
echo "--- MDX parse-landmine check ---"
cd "$REPO_ROOT"
LANDMINES=0

# Pattern 1: bare numeric HTML-like tags e.g. <10 or <0 in non-code context
# These can confuse MDX parser into thinking they're JSX elements
while IFS= read -r match; do
  if [ -n "$match" ]; then
    echo "  [WARN] Possible numeric tag: $match"
    LANDMINES=$((LANDMINES+1))
  fi
done << GREP
$(grep -rn '<[0-9]' "$AGFDOCS/content/docs" --include="*.mdx" 2>/dev/null | grep -v '```' | grep -v '^[^:]*:[0-9]*:[[:space:]]*>' || true)
GREP

# Pattern 2: unescaped < followed by a letter (outside code blocks) — potential JSX confusion
# Simple heuristic: lines with <[a-zA-Z] that aren't import/export/component lines
while IFS= read -r match; do
  if [ -n "$match" ]; then
    echo "  [WARN] Possible unescaped HTML/JSX: $match"
    LANDMINES=$((LANDMINES+1))
  fi
done << GREP2
$(grep -rn '<[a-z][a-z]' "$AGFDOCS/content/docs" --include="*.mdx" 2>/dev/null | grep -v '^\s*//' | grep -v 'import ' | grep -v 'export ' | grep -v '```' | grep -v '<a ' | grep -v '<br' | grep -v '<span' | grep -v '<div' | grep -v '<p>' | head -20 || true)
GREP2

if [ "$LANDMINES" = "0" ]; then
  echo "[ OK ] No MDX parse landmines detected."
else
  echo "[FAIL] $LANDMINES potential MDX parse issue(s) found — review above."
  PASS=0
fi
echo ""

if [ "$PASS" = "1" ]; then
  echo "=== MDX Lint PASSED ==="
  exit 0
else
  echo "=== MDX Lint FAILED ==="
  exit 1
fi
