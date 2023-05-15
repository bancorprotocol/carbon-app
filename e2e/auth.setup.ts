// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'e2e/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:3000/debug');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();

  await page
    .locator('#imposterAccount')
    .fill('0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88');
  await page.locator('#saveImposter').click();

  await page
    .locator('#rpcUrl')
    .fill('https://rpc.tenderly.co/fork/5ac3ffc6-abcd-4fbd-8430-069d927cbff9');
  await page
    .locator('#controller')
    .fill('0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1');
  await page
    .locator('#voucher')
    .fill('0x3660F04B79751e31128f6378eAC70807e38f554E');
  await page.locator('#saveRpc').click();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
