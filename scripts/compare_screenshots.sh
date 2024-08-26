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

  echo "Comparing baseline $img1 and screenshot $img2"

  # Check if both files exist
  if [[ ! -f "$img1" ]]; then
    echo "Error: Baseline image $img1 does not exist."
    exit 1
  fi

  if [[ ! -f "$img2" ]]; then
    echo "Error: Current screenshot $img2 does not exist."
    exit 1
  fi

  # Use ImageMagick's compare tool to create a diff image and return the error count
  compare -metric AE "$img1" "$img2" "$diff_img" 2>compare_output.txt
  diff_value=$(cat compare_output.txt | grep -o '[0-9]\+' || echo "None")
  echo "Difference value for $img1 vs $img2: $diff_value"

  # Display any output from the compare command for debugging
  cat compare_output.txt

  # Check if the difference value is zero (images are identical)
  if [ "$diff_value" == "0" ]; then
    return 0  # Images are identical
  else
    return 1  # Images are different
  fi
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

  # Retrieve the original version of the file from the previous commit
  git show HEAD~1:"$screenshot" > original_screenshot.png
  baseline_screenshot="original_screenshot.png"

  # Verify that the baseline screenshot was retrieved successfully
  if [[ ! -s "$baseline_screenshot" ]]; then
    echo "Error: Failed to retrieve baseline image $baseline_screenshot."
    exit 1
  fi

  # Compare with the baseline version
  diff_file="${current_screenshot}.diff.png"
  compare_images "$baseline_screenshot" "$current_screenshot" "$diff_file"

  # Check if the image is identical to the baseline
  if [ $? -eq 0 ]; then
    echo "No visual difference for $screenshot. Reverting changes."
    git restore "$screenshot"
  else
    echo "Visual difference detected for $screenshot. Keeping changes."
  fi

  # Clean up temporary files
  rm -f "$diff_file" "$baseline_screenshot"
done
