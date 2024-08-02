#!/bin/bash
set -e

# Check if GITHUB_WORKSPACE is set
if [ -z "$GITHUB_WORKSPACE" ]; then
    echo "Error: GITHUB_WORKSPACE is not set."
    exit 1
fi

# Directory where screenshots are stored
SCREENSHOT_DIR="${GITHUB_WORKSPACE}/e2e/screenshots"

# Get a list of modified screenshots
modified_files=$(git diff --name-only | grep '.png$' || true)

# Function to compare images
compare_images() {
  local img1="$1"
  local img2="$2"
  local diff_img="$3"

  # Use ImageMagick's compare tool to create a diff image
  compare -metric AE "$img1" "$img2" "$diff_img" 2>/dev/null || return 1
}

# Check if any modified files are found
if [[ -z "$modified_files" ]]; then
  echo "No modified PNG files found in $SCREENSHOT_DIR."
  exit 0
fi

# Process each modified screenshot
for screenshot in $modified_files; do
  # Full path to the modified screenshot
  current_screenshot="${GITHUB_WORKSPACE}/${screenshot}"

  # Check if the baseline screenshot exists
  if [ -f "$current_screenshot" ]; then
    # Create a temporary diff image file
    diff_file="${current_screenshot}.diff.png"

    # Compare with the baseline version
    compare_images "$current_screenshot" "$screenshot" "$diff_file"

    # Check if the image is identical to the baseline
    if [ $? -eq 0 ]; then
        echo "No visual difference for $screenshot. Reverting changes."
        git restore "$screenshot"
    else
        echo "Visual difference detected for $screenshot. Keeping changes."
    fi

    # Clean up diff file
    rm -f "$diff_file"
  else
    echo "Baseline image does not exist for $screenshot. Keeping new image."
  fi
done