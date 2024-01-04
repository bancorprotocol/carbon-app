import { Page, TestInfo } from '@playwright/test';
import {
  CreateForkBody,
  createFork,
  forkRpcUrl,
  deleteFork,
} from './../utils/tenderly';
import { Wallet } from 'ethers';

const forkConfig: CreateForkBody = {
  network_id: '1',
  alias: 'E2E-CI',
  // Sep-12-2023
  block_number: 18120000,
};

export const setupFork = async (
  page: Page,
  testInfo: TestInfo,
  storageState: string
) => {
  await page.goto('/debug');
  const fork = await createFork(forkConfig);
  process.env[`TENDERLY_FORK_ID_TEST_${testInfo.testId}`] = fork.id;
  const rpcUrl = forkRpcUrl(fork.id);
  // SET RPC-URL
  await page.getByLabel('RPC URL').fill(rpcUrl);
  // await page.context().storageState({ path: storageState });
  await page.getByTestId('unchecked-signer').click();
  await page.getByTestId('save-rpc').click();
  await page.waitForURL(`/debug`);
};

export const removeFork = async (testInfo: TestInfo) => {
  const forkId = process.env[`TENDERLY_FORK_ID_TEST_${testInfo.testId}`];
  if (forkId) await deleteFork(forkId);
};

interface ImposterConfig {
  /** Provide a default address, if not provided, we'll create one at random */
  address?: string;
  /** Won't need  */
  noMoney?: boolean;
}
export const setupImposter = async (
  page: Page,
  config: ImposterConfig = {}
) => {
  await page.goto('/debug');
  const address = config.address ?? Wallet.createRandom().address;
  await page.getByLabel('Imposter Account').fill(address);
  await page.getByTestId('save-imposter').click();
  if (!config.noMoney) {
    await page.getByText('Get money').click();
    // Note: we are not waiting for fund to arrive to speed up test.
    // Wait for it at the beginning of the test if it relies on fund right away
    // Example: await waitFor(page, 'balance-DAI');
  }
};

export class DebugDriver {
  constructor(private page: Page) {}

  getBalance(token: string) {
    return this.page.getByTestId(`balance-${token}`);
  }
}
