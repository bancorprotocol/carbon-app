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

# Function to check images with identify
check_image() {
  local img="$1"
  echo "Running identify on $img"
  identify "$img"
  if [[ $? -ne 0 ]]; then
    echo "Error: Image $img failed to be identified. It may be corrupted."
    exit 1
  fi
}

# Function to compare images
compare_images() {
  local img1="$1"
  local img2="$2"
  local diff_img="$3"

  echo "Preparing to compare baseline $img1 and screenshot $img2"

  # Check if both files exist and are non-empty
  if [[ ! -f "$img1" ]]; then
    echo "Error: Baseline image $img1 does not exist."
    exit 1
  elif [[ ! -s "$img1" ]]; then
    echo "Error: Baseline image $img1 is empty."
    exit 1
  fi

  if [[ ! -f "$img2" ]]; then
    echo "Error: Current screenshot $img2 does not exist."
    exit 1
  elif [[ ! -s "$img2" ]]; then
    echo "Error: Current screenshot $img2 is empty."
    exit 1
  fi

  # Use identify to check images
  check_image "$img1"
  check_image "$img2"

  # Optional: Use convert to reprocess images to a standard format
  echo "Converting images to standard format"
  convert "$img1" "${img1}.standard.png"
  convert "$img2" "${img2}.standard.png"
  img1="${img1}.standard.png"
  img2="${img2}.standard.png"

  # Proceed with image comparison
  echo "Running ImageMagick compare on $img1 and $img2"
  compare -metric AE "$img1" "$img2" "$diff_img" 2>compare_output.txt || true

  # Capture the exit status
  compare_exit_status=$?

  echo "ImageMagick compare command exit status: $compare_exit_status"

  # Display any output from the compare command for debugging
  echo "Contents of compare_output.txt:"
  cat compare_output.txt

  if [[ $compare_exit_status -ne 0 ]]; then
    echo "ImageMagick compare command failed or images are different."
    exit $compare_exit_status
  fi

  diff_value=$(cat compare_output.txt | grep -o '[0-9]\+' || echo "None")
  echo "Difference value for $img1 vs $img2: $diff_value"

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
  rm -f "$diff_file" "$baseline_screenshot" "${baseline_screenshot}.standard.png" "${current_screenshot}.standard.png"
done