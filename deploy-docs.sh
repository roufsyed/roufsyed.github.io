#!/usr/bin/env bash
set -euo pipefail

COMMIT_MSG="${1:-Deploy latest build to docs}"

npm run build
rm -rf docs
cp -R dist docs
touch docs/.nojekyll
git add docs
git commit -m "$COMMIT_MSG"
git push origin main
