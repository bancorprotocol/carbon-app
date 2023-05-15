// auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

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
    .fill('https://rpc.tenderly.co/fork/400b08d9-04d7-4dfe-a874-dcd5f91ce9e9');
  await page
    .locator('#controller')
    .fill('0x6Db6EE351fc802833ed2f28A25BBBF971D8b12C1');
  await page
    .locator('#voucher')
    .fill('0x3660F04B79751e31128f6378eAC70807e38f554E');
  await page.locator('#saveRpc').click();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
