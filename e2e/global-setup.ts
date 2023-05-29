import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  let forkId;
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/debug`);

  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    // forkId = await duplicateFork();
    const forkId = '5ac3ffc6-abcd-4fbd-8430-069d927cbff9';
    console.log(forkId, '-=-=-=-=-=- Fork Created -=-=-=-=-=-');
    // process.env.ForkId = forkId;

    await page
      .locator('#imposterAccount')
      .fill('0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88');
    await page.locator('#saveImposter').click();

    await page
      .locator('#rpcUrl')
      .fill(`https://rpc.tenderly.co/fork/${forkId}`);
    await page
      .locator('#controller')
      .fill('0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1');
    await page
      .locator('#voucher')
      .fill('0x3660F04B79751e31128f6378eAC70807e38f554E');
    await page.locator('#checkbox').first().click();

    await page.locator('#saveRpc').click();

    await page.context().storageState({ path: storageState as string });
    await context.tracing.stop({
      path: './test-results/setup-trace.zip',
    });
    await browser.close();
  } catch (error) {
    console.log(
      error,
      `-=-=-=-=-=- global setup error - delete fork ${forkId}-=-=-=-=-=-`
    );
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip',
    });
    await browser.close();
    // await deleteFork(forkId);
  }
}

export default globalSetup;
