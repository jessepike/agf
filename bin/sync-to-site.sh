#!/bin/sh
# bin/sync-to-site.sh — Mirror diagrams/*.png to agf-docs/public/diagrams/
# Writes a MANIFEST.json with file list, sizes, hashes, and sync date.
# Flags new diagrams not referenced in any MDX, and MDX refs pointing to missing diagrams.
#
# Usage: sync-to-site.sh [--dry-run]

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$REPO_ROOT/diagrams"
DST_DIR="$REPO_ROOT/agf-docs/public/diagrams"
MANIFEST="$DST_DIR/MANIFEST.json"
MDX_DIR="$REPO_ROOT/agf-docs/content"
DRY_RUN=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --help|-h)
      echo "Usage: sync-to-site.sh [--dry-run]"
      echo ""
      echo "  --dry-run    Show what would change without writing files"
      exit 0
      ;;
    *)
      echo "ERROR: Unknown flag: $1" >&2
      exit 1
      ;;
  esac
done

if [ "$DRY_RUN" = "1" ]; then
  echo "=== sync-to-site.sh [DRY RUN] ==="
else
  echo "=== sync-to-site.sh ==="
fi
echo ""

# Ensure destination exists
if [ "$DRY_RUN" = "0" ]; then
  mkdir -p "$DST_DIR"
fi

# --- Sync PNGs ---
SYNCED=0
SKIPPED=0
echo "Syncing diagrams/ → agf-docs/public/diagrams/ ..."
for src in "$SRC_DIR"/*.png; do
  [ -f "$src" ] || continue
  fname="$(basename "$src")"
  dst="$DST_DIR/$fname"
  # Skip untracked v2-v6 rings iteration files (do not overwrite if they exist there)
  if [ "$DRY_RUN" = "1" ]; then
    if [ -f "$dst" ]; then
      SRC_HASH="$(shasum -a 256 "$src" | cut -d' ' -f1)"
      DST_HASH="$(shasum -a 256 "$dst" | cut -d' ' -f1)"
      if [ "$SRC_HASH" = "$DST_HASH" ]; then
        echo "  [=] $fname (unchanged)"
        SKIPPED=$((SKIPPED+1))
      else
        echo "  [U] $fname (would update)"
        SYNCED=$((SYNCED+1))
      fi
    else
      echo "  [+] $fname (would copy)"
      SYNCED=$((SYNCED+1))
    fi
  else
    if [ -f "$dst" ]; then
      SRC_HASH="$(shasum -a 256 "$src" | cut -d' ' -f1)"
      DST_HASH="$(shasum -a 256 "$dst" | cut -d' ' -f1)"
      if [ "$SRC_HASH" = "$DST_HASH" ]; then
        SKIPPED=$((SKIPPED+1))
      else
        cp "$src" "$dst"
        echo "  [U] $fname (updated)"
        SYNCED=$((SYNCED+1))
      fi
    else
      cp "$src" "$dst"
      echo "  [+] $fname (added)"
      SYNCED=$((SYNCED+1))
    fi
  fi
done
echo ""
echo "  Synced: $SYNCED  Skipped (unchanged): $SKIPPED"
echo ""

# --- Write manifest ---
if [ "$DRY_RUN" = "0" ]; then
  echo "Writing $MANIFEST ..."
  SYNC_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '{\n  "synced": "%s",\n  "files": [\n' "$SYNC_DATE" > "$MANIFEST"
  FIRST=1
  for f in "$DST_DIR"/*.png; do
    [ -f "$f" ] || continue
    FNAME="$(basename "$f")"
    SIZE="$(wc -c < "$f" | tr -d ' ')"
    HASH="$(shasum -a 256 "$f" | cut -d' ' -f1)"
    if [ "$FIRST" = "1" ]; then
      FIRST=0
    else
      printf ',\n' >> "$MANIFEST"
    fi
    printf '    {"file": "%s", "size": %s, "sha256": "%s"}' "$FNAME" "$SIZE" "$HASH" >> "$MANIFEST"
  done
  printf '\n  ]\n}\n' >> "$MANIFEST"
  echo "  Manifest written."
  echo ""
fi

# --- Check: diagrams not referenced in any MDX ---
echo "Checking for unreferenced diagrams ..."
UNREFERENCED=0
for f in "$DST_DIR"/*.png; do
  [ -f "$f" ] || continue
  fname="$(basename "$f")"
  # Search for the filename in MDX content
  if ! grep -r "$fname" "$MDX_DIR" --include="*.mdx" -l >/dev/null 2>&1; then
    echo "  [WARN] No MDX reference found for: $fname"
    UNREFERENCED=$((UNREFERENCED+1))
  fi
done
if [ "$UNREFERENCED" = "0" ]; then
  echo "  All diagrams are referenced in at least one MDX file."
fi
echo ""

# --- Check: MDX references pointing to missing diagrams ---
echo "Checking for broken MDX diagram references ..."
BROKEN=0
# Find all /diagrams/*.png references in MDX files
grep -r '/diagrams/' "$MDX_DIR" --include="*.mdx" -oh | sort -u | while read -r ref; do
  fname="$(basename "$ref")"
  if [ ! -f "$DST_DIR/$fname" ]; then
    echo "  [FAIL] Missing diagram referenced in MDX: $ref"
    BROKEN=$((BROKEN+1))
  fi
done
if [ "$BROKEN" = "0" ]; then
  echo "  No broken MDX diagram references found."
fi
echo ""

echo "=== sync-to-site.sh complete ==="
