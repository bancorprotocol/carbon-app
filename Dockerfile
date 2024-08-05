# Use the official Playwright Docker image as a base
FROM mcr.microsoft.com/playwright:v1.43.0-jammy

# Install ImageMagick
RUN apt-get update && apt-get install -y imagemagick

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Display installed versions
RUN identify -version