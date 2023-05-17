import { chromium, FullConfig } from '@playwright/test';
import { duplicateFork } from './src/utils/tenderlyApi';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/debug`);
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  const forkId = await duplicateFork();
  console.log(forkId, '-=-=-=-=-=- Fork Created -=-=-=-=-=-');
  process.env.ForkId = forkId;

  await page
    .locator('#imposterAccount')
    .fill('0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88');
  await page.locator('#saveImposter').click();

  await page.locator('#rpcUrl').fill(`https://rpc.tenderly.co/fork/${forkId}`);
  await page
    .locator('#controller')
    .fill('0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1');
  await page
    .locator('#voucher')
    .fill('0x3660F04B79751e31128f6378eAC70807e38f554E');
  await page.locator('#saveRpc').click();

  await page.context().storageState({ path: storageState as string });
}

export default globalSetup;
