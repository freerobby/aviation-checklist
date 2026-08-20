#!/usr/bin/env sh

# abort on errors
set -e

yarn build

# Keep the /staging GitHub Pages preview when publishing production.
if git fetch origin gh-pages && git ls-tree -d --name-only origin/gh-pages | grep -qx staging; then
  git archive origin/gh-pages staging | tar -x -C dist
fi

cd dist
echo "checklist.robbygrossman.com" > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:freerobby/aviation-checklist.git main:gh-pages

cd -
