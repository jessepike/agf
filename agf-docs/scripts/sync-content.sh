#!/bin/bash
# sync-content.sh — Syncs canonical docs/*.md to agf-docs/content/docs/*.mdx
#
# Convention:
#   docs/*.md                    → agf-docs/content/docs/ (with MDX frontmatter added)
#   docs/profiles/*.md           → agf-docs/content/docs/profiles/
#   docs/white-papers/*.md       → agf-docs/content/docs/overview/ (trust-ladders, rings-model)
#
# This script generates MDX files from canonical markdown sources.
# MDX-specific additions (Image imports, custom components) must be added manually
# after sync. The script preserves existing MDX frontmatter if present.
#
# Usage: ./scripts/sync-content.sh [--dry-run]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
MDX_DIR="$REPO_ROOT/agf-docs/content/docs"
DRY_RUN="${1:-}"

# Mapping: source file → target MDX path and frontmatter
declare -A CONTENT_MAP=(
  # Overview section (from docs/ and white-papers/)
  ["$DOCS_DIR/agf-reference-architecture.md"]="$MDX_DIR/overview/what-is-agf.mdx"
  ["$DOCS_DIR/white-papers/trust-ladders.md"]="$MDX_DIR/overview/trust-ladders.mdx"
  ["$DOCS_DIR/white-papers/rings-model.md"]="$MDX_DIR/overview/rings-model.mdx"

  # Profiles
  ["$DOCS_DIR/profiles/security-profile.md"]="$MDX_DIR/profiles/security.mdx"
  ["$DOCS_DIR/profiles/platform-profile.md"]="$MDX_DIR/profiles/platform.mdx"
  ["$DOCS_DIR/profiles/grc-profile.md"]="$MDX_DIR/profiles/grc.mdx"
  ["$DOCS_DIR/profiles/ai-engineering-profile.md"]="$MDX_DIR/profiles/ai-engineering.mdx"
  ["$DOCS_DIR/profiles/observability-profile.md"]="$MDX_DIR/profiles/observability.mdx"

  # Deep reference
  ["$DOCS_DIR/agentic-primitives.md"]="$MDX_DIR/reference/primitives.mdx"
  ["$DOCS_DIR/decision-intelligence.md"]="$MDX_DIR/reference/decision-intelligence.mdx"
  ["$DOCS_DIR/agentic-observability.md"]="$MDX_DIR/reference/observability-concept.mdx"
  ["$DOCS_DIR/agentic-governance-framework.md"]="$MDX_DIR/reference/governance-framework.mdx"

  # Resources
  ["$DOCS_DIR/shared-vocabulary.md"]="$MDX_DIR/resources/vocabulary.mdx"
  ["$DOCS_DIR/cross-concept-relationship.md"]="$MDX_DIR/resources/relationship-model.mdx"
)

echo "AGF Content Sync"
echo "================"
echo "Source: $DOCS_DIR"
echo "Target: $MDX_DIR"
[ "$DRY_RUN" = "--dry-run" ] && echo "MODE: DRY RUN"
echo ""

synced=0
skipped=0

for src in "${!CONTENT_MAP[@]}"; do
  target="${CONTENT_MAP[$src]}"
  rel_src="${src#$REPO_ROOT/}"
  rel_target="${target#$REPO_ROOT/}"

  if [ ! -f "$src" ]; then
    echo "  SKIP  $rel_src (source not found)"
    ((skipped++))
    continue
  fi

  # Check if target is newer than source (manual MDX edits)
  if [ -f "$target" ] && [ "$target" -nt "$src" ]; then
    echo "  WARN  $rel_target is newer than $rel_src — manual edits may exist"
  fi

  if [ "$DRY_RUN" = "--dry-run" ]; then
    echo "  SYNC  $rel_src → $rel_target"
  else
    # Ensure target directory exists
    mkdir -p "$(dirname "$target")"

    # Extract title from first H1 in source
    title=$(grep -m1 '^# ' "$src" | sed 's/^# //')

    # Extract description from first paragraph after frontmatter/title
    desc=$(awk '/^# /{found=1; next} found && /^[A-Z]/{print; exit}' "$src" | head -c 200)

    # Write MDX with frontmatter
    {
      echo "---"
      echo "title: \"$title\""
      [ -n "$desc" ] && echo "description: \"$desc\""
      echo "---"
      echo ""
      # Skip the source H1 (title is in frontmatter now) and any frontmatter
      awk '
        BEGIN { skip_front=0; skipped_title=0 }
        /^---$/ && NR<=3 { skip_front=!skip_front; next }
        skip_front { next }
        /^# / && !skipped_title { skipped_title=1; next }
        { print }
      ' "$src"
    } > "$target"

    echo "  SYNC  $rel_src → $rel_target"
  fi
  ((synced++))
done

echo ""
echo "Done: $synced synced, $skipped skipped"
