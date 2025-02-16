#!/bin/bash
set -e

# Function to compare images, ignoring isolated pixel differences
compare_images() {
  local img1="$1"
  local img2="$2"
  local diff_img="$3"
  local temp_diff="/tmp/temp_diff.png"

  # First comparison to get initial differences
  local diff_pixels
  diff_pixels=$(compare -metric AE "$img1" "$img2" "$temp_diff" 2>&1 >/dev/null)

  # Second comparison with more tolerance to remove isolated pixels
  # The fuzz factor and area density parameters help ignore isolated pixels
  local filtered_diff
  filtered_diff=$(compare -fuzz "1%" -metric AE -density 300 -define compare:similar-threshold=1 "$img1" "$img2" "$diff_img" 2>&1 >/dev/null)

  echo "Non-isolated diff pixels for $img1, $img2: $filtered_diff"

  # Clean up temporary file
  rm -f "$temp_diff"

  # If there are any remaining differences after filtering
  if [ "$filtered_diff" -gt 0 ]; then
    return 1  # Images are different
  else
    return 0  # Images are considered identical
  fi
}

# Check if GITHUB_WORKSPACE is set
if [ -z "$GITHUB_WORKSPACE" ]; then
    echo "Error: GITHUB_WORKSPACE is not set."
    exit 1
fi

# Directory where screenshots are stored
SCREENSHOT_DIR="${GITHUB_WORKSPACE}/e2e/screenshots"

# Get a list of modified screenshots
modified_files=$(git diff --name-only | grep '.png$' || true)

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

  # Check if the baseline screenshot exists
  if [[ ! -s "$baseline_screenshot" ]]; then
    echo "No baseline image for $screenshot. Assuming this is a new screenshot."
    rm -f "$baseline_screenshot"  # Clean up the non-existent baseline file
    continue  # Skip to the next iteration
  fi

  # Compare with the baseline version
  diff_file="${current_screenshot}.diff.png"
  # Temporarily disable 'set -e' to handle non-zero exit status
  set +e
  compare_images "$baseline_screenshot" "$current_screenshot" "$diff_file"
  comparison_result=$?
  set -e

  # If images are identical, revert the screenshot
  if [ $comparison_result -eq 0 ]; then
    echo "No visual difference for $screenshot. Reverting changes."
    git restore "$screenshot"
  else
    echo "Visual difference detected for $screenshot. Keeping changes."
  fi

  # Clean up temporary files
  rm -f "$diff_file" "$baseline_screenshot"
done