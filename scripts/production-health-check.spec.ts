import { expect, test } from '@playwright/test';

/**
 * Production health check test
 * Verifies that the production site is live and accessible
 * by checking the explore page and wallet connection modal
 */

// Keep the longer timeout so it won't get killed prematurely
test.setTimeout(210000);

test('visit page and check wallet modal', async ({ page }) => {
  // Set action timeout for page operations
  page.setDefaultTimeout(10000);
  const response = await page.goto('https://app.carbondefi.xyz/explore/pairs');

  // Verify page loaded
  expect(
    response?.status(),
    'should respond with correct status code',
  ).toBeLessThan(400);

  // Assert that the "Connect Wallet" button is visible
  const connectButton = page.getByRole('button', { name: 'Connect Wallet' });
  await expect(connectButton).toBeVisible();

  // Click the "Connect Wallet" button
  await connectButton.click();

  // Assert that the modal with "I read and accept" button appears
  const acceptButton = page.getByRole('button', { name: 'I read and accept' });
  await expect(acceptButton).toBeVisible();
});
