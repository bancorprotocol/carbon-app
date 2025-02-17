#!/bin/bash
#
# This script compares modified screenshots to their baseline versions and reverts
# the file if the visual difference is negligible. We now ignore isolated single-pixel
# differences by using a morphological operation on the difference mask.

set -e
set -o pipefail

# Function to compare images while ignoring single-pixel isolated differences.
# Returns 0 (success) if differences are within acceptable threshold, 1 (failure) otherwise.
compare_images() {
  local img1="$1"
  local img2="$2"
  local diff_img="$3"

  # This file will be our initial black/white difference mask (white = difference).
  local diff_mask_raw="${diff_img%.png}.rawmask.png"

  # This file will be the mask after morphological "open" (which removes isolated pixels).
  local diff_mask_clean="${diff_img%.png}.cleanmask.png"

  echo "[DEBUG] Comparing '$img1' vs '$img2' and ignoring isolated diffs."

  # -----------------------------------------------------------
  # 1. Create a black/white difference mask:
  #    -highlight-color White => areas that differ become white
  #    -lowlight-color Black   => areas that match remain black
  # -----------------------------------------------------------
  echo "[DEBUG] Generating raw difference mask '$diff_mask_raw'..."
  compare -quiet \
          -fuzz 0% \
          -highlight-color White \
          -lowlight-color Black \
          "$img1" "$img2" \
          "$diff_mask_raw" || true
  # '|| true' so that 'compare' doesn't break the script if images differ.

  # -----------------------------------------------------------
  # 2. Remove single-pixel noise using morphological 'Open':
  #    This will eliminate any isolated white pixel (i.e., an
  #    isolated difference) in the mask.
  # -----------------------------------------------------------
  echo "[DEBUG] Applying morphological open to remove isolated white pixels..."
  convert "$diff_mask_raw" -morphology Open Diamond "$diff_mask_clean"

  # -----------------------------------------------------------
  # 3. Count the number of white pixels in the cleaned mask.
  #    - %[fx:mean] gives the average brightness of the image
  #      in the range [0..1].
  #    - Multiply by w*h to get total white pixels (float).
  #    - Convert that float to an integer.
  # -----------------------------------------------------------
  local pixel_diff_float
  pixel_diff_float=$(convert "$diff_mask_clean" -format "%[fx:mean*w*h]" info:)

  # Convert floating-point value to integer (rounded to nearest whole number).
  local pixel_diff_count
  pixel_diff_count=$(printf "%.0f" "$pixel_diff_float")

  echo "[DEBUG] Number of differing pixels after cleaning: $pixel_diff_count"

  # -----------------------------------------------------------
  # 4. Decide if the difference is acceptable.
  #    You can change the threshold (10) as needed.
  # -----------------------------------------------------------
  local threshold=10
  if [ "$pixel_diff_count" -lt "$threshold" ]; then
    echo "[DEBUG] Differences ($pixel_diff_count) are under threshold ($threshold)."
    # Save the final cleaned mask as the "diff image" for reference.
    mv "$diff_mask_clean" "$diff_img"
    # Remove intermediate file
    rm -f "$diff_mask_raw"
    return 0  # Images are considered "identical enough".
  else
    echo "[DEBUG] Differences ($pixel_diff_count) exceed threshold ($threshold)."
    # Keep the final cleaned mask as the "diff image".
    mv "$diff_mask_clean" "$diff_img"
    # Remove intermediate file
    rm -f "$diff_mask_raw"
    return 1  # Images are considered different.
  fi
}

# ------------------------------------------------------------------------------
# Main script
# ------------------------------------------------------------------------------

# Check if GITHUB_WORKSPACE is set
if [ -z "$GITHUB_WORKSPACE" ]; then
    echo "Error: GITHUB_WORKSPACE is not set."
    exit 1
fi

# Directory where screenshots are stored
SCREENSHOT_DIR="${GITHUB_WORKSPACE}/e2e/screenshots"

# Get a list of modified screenshots (relative to the last commit)
modified_files=$(git -C "${GITHUB_WORKSPACE}" diff --name-only | grep '.png$' || true)

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
  git show HEAD~1:"$screenshot" > original_screenshot.png 2>/dev/null || true
  baseline_screenshot="original_screenshot.png"

  # Check if the baseline screenshot exists (i.e., wasn't newly added)
  if [[ ! -s "$baseline_screenshot" ]]; then
    echo "No baseline image for $screenshot. Assuming this is a new screenshot."
    rm -f "$baseline_screenshot"  # Clean up
    continue  # Skip to the next iteration
  fi

  # Compare with the baseline version
  diff_file="${current_screenshot}.diff.png"

  echo ""
  echo "----------------------------------------------------------"
  echo "Comparing screenshot: $screenshot"
  echo "Baseline: $baseline_screenshot"
  echo "Current:  $current_screenshot"
  echo "----------------------------------------------------------"

  # Temporarily disable 'set -e' so we can capture the compare_images return code
  set +e
  compare_images "$baseline_screenshot" "$current_screenshot" "$diff_file"
  comparison_result=$?
  set -e

  # If images are "identical enough," revert the screenshot
  if [ $comparison_result -eq 0 ]; then
    echo "[INFO] $screenshot: No significant visual difference. Reverting changes."
    git restore "$screenshot"
  else
    echo "[INFO] $screenshot: Visual difference detected above threshold. Keeping changes."
  fi

  # Clean up temporary files
  rm -f "$baseline_screenshot" "$diff_file"
done
