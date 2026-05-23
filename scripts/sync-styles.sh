#!/usr/bin/env bash
# sync-styles.sh
#
# Fetches the latest saboteur-base.css from saboteur-works/saboteur-styles and
# updates all local mirrors in this repo. Run this after any change to the
# styles repo so that agents and the example project stay current.
#
# Requires: gh (GitHub CLI, authenticated)
#
# Usage:
#   bash scripts/sync-styles.sh

set -euo pipefail

REPO="saboteur-works/saboteur-styles"
SOURCE_PATH="styles/saboteur-base.css"

MIRRORS=(
  "brand/inputs/saboteur-base.css"
  "sites/landing-page/examples/saboteur-dev/src/styles/saboteur-base.css"
)

STAMP_FILE="brand/inputs/STYLES_SYNCED"

# ── Resolve repo root ──────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# ── Check gh auth ──────────────────────────────────────────────────────────────
if ! gh auth status &>/dev/null; then
  echo "Error: gh is not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

# ── Fetch commit SHA ───────────────────────────────────────────────────────────
echo "Fetching latest commit from $REPO..."
SHA=$(gh api "repos/$REPO/commits/main" --jq '.sha' 2>/dev/null \
  || gh api "repos/$REPO/commits/HEAD" --jq '.sha')
SHORT_SHA="${SHA:0:8}"
DATE=$(date -u +"%Y-%m-%d")

# ── Fetch file content ─────────────────────────────────────────────────────────
echo "Fetching $SOURCE_PATH @ $SHORT_SHA..."
CONTENT=$(gh api "repos/$REPO/contents/$SOURCE_PATH?ref=$SHA" --jq '.content' \
  | python3 -c "import sys, base64; sys.stdout.write(base64.b64decode(sys.stdin.read().replace('\n','')).decode())")

# ── Update mirrors ─────────────────────────────────────────────────────────────
CHANGED=0
for TARGET in "${MIRRORS[@]}"; do
  if [ ! -f "$TARGET" ]; then
    echo "Skipping $TARGET (file does not exist)"
    continue
  fi

  EXISTING=$(cat "$TARGET")
  if [ "$CONTENT" = "$EXISTING" ]; then
    echo "  $TARGET — no change"
  else
    echo "$CONTENT" > "$TARGET"
    echo "  $TARGET — updated"
    CHANGED=$((CHANGED + 1))
  fi
done

# ── Update stamp ───────────────────────────────────────────────────────────────
cat > "$STAMP_FILE" <<EOF
source_repo: $REPO
source_path: $SOURCE_PATH
last_synced: $DATE
commit_sha: $SHORT_SHA
EOF
echo "  $STAMP_FILE — updated ($SHORT_SHA)"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
if [ "$CHANGED" -gt 0 ]; then
  echo "Synced $CHANGED file(s) from $REPO @ $SHORT_SHA."
  echo ""
  echo "If token names or semantics changed, also update brand/visual-tokens.md"
  echo "manually — the sync script only updates the CSS, not the prose docs."
else
  echo "All mirrors already up to date ($REPO @ $SHORT_SHA)."
fi
