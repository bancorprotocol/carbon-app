import { Page, TestInfo } from '@playwright/test';
import {
  CreateForkBody,
  createFork,
  forkRpcUrl,
  deleteFork,
} from './../utils/tenderly';
import { Wallet } from 'ethers';
import { checkApproval } from './modal';
import { CreateStrategyTemplate } from './strategy/template';

const forkConfig: CreateForkBody = {
  network_id: '1',
  alias: 'E2E-CI',
  // Sep-12-2023
  block_number: 18120000,
};

export const setupFork = async (page: Page, testInfo: TestInfo) => {
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
  // await page.context().storageState({ path: storageState as string });
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

  async createStrategy(template: CreateStrategyTemplate) {
    const { base, quote, buy, sell, spread, amount } = template;
    // TODO: use textarea shortcut instead of filling each field.
    // Currently this revert with Dai/insufficient-allowance for some reason
    // await this.page.getByTestId('strategy-json-shortcut').fill(JSON.stringify(template));
    await this.page.getByTestId('spread').fill(spread ?? '');
    await this.page.getByTestId(`token-${base}`).click();
    await this.page.getByTestId(`token-${quote}`).click();
    await this.page.getByTestId('buyMin').fill(buy.min);
    await this.page.getByTestId('buyMax').fill(buy.max);
    await this.page.getByTestId('buyBudget').fill(buy.budget);
    await this.page.getByTestId('sellMin').fill(sell.min);
    await this.page.getByTestId('sellMax').fill(sell.max);
    await this.page.getByTestId('sellBudget').fill(sell.budget);
    await this.page.getByTestId('strategy-amount').fill(amount ?? '1');
    await this.page.getByTestId('create-strategies').click();
    await checkApproval(this.page, [base, quote]);
    await this.page.getByTestId('creating-strategies').waitFor({
      state: 'detached',
    });
  }
}
