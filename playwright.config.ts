import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; // TODO: we can remove this with node@20.6.0

const isCI = !!process.env.CI && process.env.CI !== 'false';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/pages',
  testMatch: '**/*.spec.ts', // Realtive to testDir
  outputDir: './e2e/results',
  globalSetup: './e2e/setup.ts',
  globalTeardown: './e2e/teardown.ts',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* See https://playwright.dev/docs/test-reporters */
  reporter: isCI ? 'html' : 'list',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
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

  /* Run your local dev server before starting the tests */
  webServer: {
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    command: isCI ? 'yarn build && yarn serve --port 3000' : 'yarn start',
  },
});
