import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; // TODO: we can remove this with node@20.6.0

const isCI = !!process.env.CI && process.env.CI !== 'false';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/pages',
  testMatch: '**/*.spec.ts', // Relative to testDir
  outputDir: './e2e/results',
  globalSetup: './e2e/setup.ts',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. (As recommended in https://playwright.dev/docs/ci#workers) */
  workers: 4,
  /* See https://playwright.dev/docs/test-reporters */
  reporter: isCI ? 'html' : 'list',
  // Limit the number of failures on CI to save resources
  maxFailures: process.env.CI ? 10 : undefined,
  // Set each test's default timeout
  timeout: 120000,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    storageState: 'e2e/storage.json',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 10000,
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    command: isCI ? 'yarn build && yarn serve --port 3000' : 'yarn start',
  },
});
