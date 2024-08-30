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
INSTALLED_VERSION=$(echo "$CLEAN_OUTPUT" | grep 'Installed version:' | awk '{print $3}' | sed 's/\x1b\[[0-9;]*m//g')
echo "latest_version=$LATEST_VERSION" >> "$GITHUB_OUTPUT"
echo "installed_version=$INSTALLED_VERSION" >> "$GITHUB_OUTPUT"

echo "::group::Update result"
echo "$CLEAN_OUTPUT"
echo "Parsed installed Version: $INSTALLED_VERSION"
echo "Parsed latest Version: $LATEST_VERSION"
echo "::endgroup::"

# Determine if an update should be performed
if [[ "$LATEST_VERSION" == "$INSTALLED_VERSION" ]] || [[ ! "$CLEAN_OUTPUT" == *"caniuse-lite has been successfully updated"* ]]; then
    echo "No updates were made to Browserslist DB."
    SHOULD_UPDATE=false
else
    SHOULD_UPDATE=true
fi

echo "should_update=$SHOULD_UPDATE" >> "$GITHUB_OUTPUT"