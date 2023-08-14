#!/usr/bin/env bash

set -eo pipefail

# Find and change to repo root directory
OS=$(uname)
if [[ "$OS" == "Darwin" ]]; then
	# OSX uses BSD readlink
	BASEDIR="$(dirname "$0")"
else
	BASEDIR=$(readlink -e "$(dirname "$0")")
fi
cd "${BASEDIR}/.." || exit 1

cd tools/
yarn
yarn run generate-types

cd ../reports
yarn
yarn run build

ref="${GITHUB_REF_NAME:-local}"
# Remove / characters
ref="${ref//\//\-}"
zip_name="app-${ref}.zip"

cd dist/
zip -r zip_name .
echo "Output: dist/$zip_name"