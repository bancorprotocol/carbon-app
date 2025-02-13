#!/bin/bash
set -e

# Function to compare images, ignoring isolated pixel differences
compare_images() {
  local img1="$1"
  local img2="$2"
  local diff_img="$3"
  local temp_mask="/tmp/diff_mask.png"
  local filtered_mask="/tmp/filtered_mask.png"

  # Create initial diff mask with white pixels where differences exist
  compare -metric AE "$img1" "$img2" -compose src -threshold 1 "$temp_mask" 2>/dev/null

  # Remove isolated pixels using morphological opening
  convert "$temp_mask" -morphology Open Diamond "$filtered_mask"

  # Count remaining differences after filtering
  local diff_pixels
  diff_pixels=$(identify -format "%[fx:mean*w*h]" "$filtered_mask")
  
  # Create visual diff for remaining differences
  convert "$temp_mask" "$filtered_mask" -alpha Off -compose CopyOpacity -composite "$diff_img"

  echo "Non-isolated diff pixels for $img1, $img2: $diff_pixels"

  # Clean up temporary files
  rm -f "$temp_mask" "$filtered_mask"

  # If there are any remaining differences after filtering
  if [ $(echo "$diff_pixels > 0" | bc -l) -eq 1 ]; then
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