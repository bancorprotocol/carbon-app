# Use the official Playwright Docker image as a base
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Install extra packages
RUN apt-get update && apt-get install -y \
    imagemagick \
    build-essential \
    # Add more if you need them
  && rm -rf /var/lib/apt/lists/*

# (Optional) Install Node 20 if needed
# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
#     && apt-get install -y nodejs

# Debug: confirm versions
RUN node --version && npx playwright --version && identify -version