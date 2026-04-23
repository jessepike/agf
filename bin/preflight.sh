#!/bin/sh
# bin/preflight.sh — AGF release preflight checks
# Exit 0 if all checks pass; non-zero with clear messages on failure.
#
# Usage: preflight.sh [--allow-dirty] [--branch <name>]

set -e

ALLOW_DIRTY=0
REQUIRED_BRANCH="main"
CUSTOM_BRANCH=0

# Parse flags
while [ $# -gt 0 ]; do
  case "$1" in
    --allow-dirty)
      ALLOW_DIRTY=1
      shift
      ;;
    --branch)
      REQUIRED_BRANCH="$2"
      CUSTOM_BRANCH=1
      shift 2
      ;;
    --help|-h)
      echo "Usage: preflight.sh [--allow-dirty] [--branch <name>]"
      echo ""
      echo "  --allow-dirty     Skip git clean-working-tree check"
      echo "  --branch <name>   Require a specific branch (default: main)"
      echo ""
      echo "Checks:"
      echo "  1. Git repo is clean (unless --allow-dirty)"
      echo "  2. On the required branch (unless --branch override)"
      echo "  3. pnpm and node are available"
      echo "  4. agf-docs/node_modules exists (installs if missing)"
      exit 0
      ;;
    *)
      echo "ERROR: Unknown flag: $1" >&2
      echo "Run with --help for usage." >&2
      exit 1
      ;;
  esac
done

# Resolve repo root relative to this script
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASS=1

echo "=== AGF Release Preflight ==="
echo ""

# --- Check 1: Git clean working tree ---
if [ "$ALLOW_DIRTY" = "1" ]; then
  echo "[SKIP] Git clean check (--allow-dirty)"
else
  if [ -n "$(git -C "$REPO_ROOT" status --porcelain)" ]; then
    echo "[FAIL] Working tree has uncommitted changes."
    echo "       Commit or stash changes before releasing, or run with --allow-dirty."
    git -C "$REPO_ROOT" status --short
    PASS=0
  else
    echo "[ OK ] Working tree is clean."
  fi
fi

# --- Check 2: On correct branch ---
CURRENT_BRANCH="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" = "$REQUIRED_BRANCH" ]; then
  echo "[ OK ] On branch: $CURRENT_BRANCH"
else
  echo "[FAIL] Expected branch '$REQUIRED_BRANCH', currently on '$CURRENT_BRANCH'."
  echo "       Switch to $REQUIRED_BRANCH or run with --branch <name> to override."
  PASS=0
fi

# --- Check 3: pnpm available ---
if command -v pnpm >/dev/null 2>&1; then
  PNPM_VERSION="$(pnpm --version 2>/dev/null)"
  echo "[ OK ] pnpm available (v$PNPM_VERSION)"
else
  echo "[FAIL] pnpm not found. Required for agf-docs build."
  echo "       Install: https://pnpm.io/installation"
  PASS=0
fi

# --- Check 4: node available ---
if command -v node >/dev/null 2>&1; then
  NODE_VERSION="$(node --version 2>/dev/null)"
  echo "[ OK ] node available ($NODE_VERSION)"
else
  echo "[FAIL] node not found. Required for agf-docs build."
  PASS=0
fi

# --- Check 5: agf-docs/node_modules ---
AGFDOCS="$REPO_ROOT/agf-docs"
if [ -d "$AGFDOCS/node_modules" ]; then
  echo "[ OK ] agf-docs/node_modules exists."
else
  echo "[WARN] agf-docs/node_modules missing. Running pnpm install..."
  if pnpm --dir "$AGFDOCS" install; then
    echo "[ OK ] agf-docs/node_modules installed."
  else
    echo "[FAIL] pnpm install failed in agf-docs/."
    PASS=0
  fi
fi

echo ""

if [ "$PASS" = "1" ]; then
  echo "=== Preflight PASSED ==="
  exit 0
else
  echo "=== Preflight FAILED — fix issues above before releasing ==="
  exit 1
fi
