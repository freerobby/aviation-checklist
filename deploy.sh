#!/usr/bin/env sh

# abort on errors
set -e

yarn build
cd dist
echo "checklist.robbygrossman.com" > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:freerobby/aviation-checklist.git master:gh-pages

cd -
