import { Page, TestInfo } from '@playwright/test';
import { waitFor } from './../utils/operators';
import {
  CreateForkBody,
  createFork,
  forkRpcUrl,
  deleteFork,
} from './../utils/tenderly';
import { Wallet } from 'ethers';
import { checkApproval } from './modal';
import { CreateStrategyTestCase, toDebugStrategy } from './strategy';

const forkConfig: CreateForkBody = {
  network_id: '1',
  alias: 'E2E-CI',
  // Sep-12-2023
  block_number: 18120000,
};

export const setupFork = async (testInfo: TestInfo) => {
  const fork = await createFork(forkConfig);
  process.env[`TENDERLY_FORK_ID_TEST_${testInfo.testId}`] = fork.id;
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

export class DebugDriver {
  constructor(private page: Page) {}

  visit() {
    return this.page.goto('/debug');
  }

  setE2E() {
    return this.page.getByTestId('is-e2e-checkbox').click();
  }

  async setRpcUrl(testInfo: TestInfo) {
    const forkId = process.env[`TENDERLY_FORK_ID_TEST_${testInfo.testId}`];
    if (!forkId) {
      throw new Error('Fork should be created before setting theRC URL');
    }
    const rpcUrl = forkRpcUrl(forkId);
    await this.page.getByLabel('RPC URL').fill(rpcUrl);
    await this.page.getByTestId('unchecked-signer').click();
    await this.page.getByTestId('save-rpc').click();
    await this.page.waitForURL('/debug');
  }

  async setupImposter(config: ImposterConfig = {}) {
    const address = config.address ?? Wallet.createRandom().address;
    await this.page.getByLabel('Imposter Account').fill(address);
    await this.page.getByTestId('save-imposter').click();
    if (!config.noMoney) {
      await this.page.getByText('Get money').click();
      // Note: we are not waiting for fund to arrive to speed up test.
      // Wait for it at the beginning of the test if it relies on fund right away
      // Example: await waitFor(page, 'balance-DAI');
    }
  }

  getBalance(token: string) {
    return this.page.getByTestId(`balance-${token}`);
  }

  async createStrategy(testCase: CreateStrategyTestCase) {
    const { base, quote } = testCase;
    const { buy, sell, spread } = toDebugStrategy(testCase);
    // TODO: use textarea shortcut instead of filling each field.
    // Currently this revert with Dai/insufficient-allowance for some reason
    // await this.page.getByTestId('strategy-json-shortcut').fill(JSON.stringify(template));
    for (const token of [base, quote]) {
      await waitFor(this.page, `balance-${token}`, 30_000);
    }

    await this.page.getByTestId('spread').fill(spread ?? '');
    await this.page.getByTestId(`token-${base}`).click();
    await this.page.getByTestId(`token-${quote}`).click();
    await this.page.getByTestId('buyMin').fill(buy.min);
    await this.page.getByTestId('buyMax').fill(buy.max);
    await this.page.getByTestId('buyBudget').fill(buy.budget);
    await this.page.getByTestId('sellMin').fill(sell.min);
    await this.page.getByTestId('sellMax').fill(sell.max);
    await this.page.getByTestId('sellBudget').fill(sell.budget);
    await this.page.getByTestId('strategy-amount').fill('1');
    await this.page.getByTestId('create-strategies').click();
    await checkApproval(this.page, [base, quote]);
    await this.page.getByTestId('creating-strategies').waitFor({
      state: 'detached',
    });
  }
}
