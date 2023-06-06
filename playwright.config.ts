import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const port = 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // globalTeardown: require.resolve('./e2e/global-teardown'),
  use: {
    baseURL,
    // storageState: 'e2e/user.json',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  expect: {
    timeout: 2 * 60 * 1000,
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    //   dependencies: ['setup'],
    // },
  ],
  webServer: {
    port,
    command: `yarn build && yarn vite preview --port ${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
