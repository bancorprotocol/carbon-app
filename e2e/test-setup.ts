import { Page } from 'playwright';
import { baseURL } from '../playwright.config';
import { deleteFork, duplicateFork } from '../src/utils/tenderlyApi';

export const setupBeforeEach = async (page: Page) => {
  let forkId;

  await page.goto(`${baseURL}/debug`);

  try {
    forkId = await duplicateFork();
    console.log(forkId, '-=-=-=-=-=- Fork Created -=-=-=-=-=-');
    await page.waitForLoadState('load');
    await page
      .getByTestId('imposterAccount')
      .fill('0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88');
    await page.getByTestId('saveImposter').click();
    await page
      .getByTestId('rpcUrl')
      .fill(`https://rpc.tenderly.co/fork/${forkId}`);
    await page
      .getByTestId('controller')
      .fill('0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1');
    await page
      .getByTestId('voucher')
      .fill('0x3660F04B79751e31128f6378eAC70807e38f554E');
    await page.getByTestId('checkbox').first().click();
    await page.getByTestId('saveRpc').click();
  } catch (error) {
    console.log(error, `-=-=-=-=-=- Error - Delete Fork ${forkId} -=-=-=-=-=-`);
    await deleteFork(forkId);
  } finally {
    return forkId;
  }
};
