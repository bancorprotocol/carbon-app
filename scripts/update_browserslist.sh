#!/bin/bash
set -e

# Check if GITHUB_WORKSPACE is set
if [ -z "$GITHUB_WORKSPACE" ]; then
    echo "Error: GITHUB_WORKSPACE is not set."
    exit 1
fi

# Run the update and store the output
OUTPUT=$(npx update-browserslist-db@latest)
CLEAN_OUTPUT=$(echo "$OUTPUT" | sed 's/\x1b\[[0-9;]*m//g')
{
  echo 'update_output<<EOF'
  echo "$CLEAN_OUTPUT"
  echo EOF
} >> "$GITHUB_OUTPUT"

# Extract and save version information
LATEST_VERSION=$(yarn info caniuse-lite version | sed -n '2p' | sed 's/\x1b\[[0-9;]*m//g')

echo "::group::Update result"
echo "$CLEAN_OUTPUT"
echo "Latest Version: $LATEST_VERSION"
echo "::endgroup::"
