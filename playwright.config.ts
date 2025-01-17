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
  /* Use 100% of available cores on CI for workers. (See https://playwright.dev/docs/api/class-testconfig#test-config-workers) */
  workers: isCI ? '100%' : undefined,
  /* See https://playwright.dev/docs/test-reporters */
  reporter: isCI ? 'html' : 'list',
  // Limit the number of failures on CI to save resources
  maxFailures: process.env.CI ? 10 : undefined,
  // Set each test's default timeout
  timeout: 150_000,

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
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1270, // Prevent Date picker to go below scrollbar
          height: 720,
        },
      },
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
    timeout: 10_000,
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    command: isCI ? 'yarn build && yarn serve --port 3000' : 'yarn start',
  },
});
