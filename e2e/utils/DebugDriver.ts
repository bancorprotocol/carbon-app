import { Page, TestInfo } from '@playwright/test';
import { waitFor } from './../utils/operators';
import {
  CreateForkBody,
  createFork,
  forkRpcUrl,
  deleteFork,
} from './../utils/tenderly';
import { Wallet } from 'ethers';
import { CreateStrategyTestCase, toDebugStrategy } from './strategy';
import { TokenApprovalDriver } from './TokenApprovalDriver';

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

export interface CreateStrategyDependencies {
  tokenApproval: TokenApprovalDriver;
}

export class DebugDriver {
  constructor(private page: Page) {}

  visit() {
    return this.page.goto('/debug');
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

  async createStrategy(
    testCase: CreateStrategyTestCase,
    deps: CreateStrategyDependencies
  ) {
    const { base, quote } = testCase;
    const { buy, sell, spread } = toDebugStrategy(testCase);
    for (const token of [base, quote]) {
      await waitFor(this.page, `balance-${token}`, 30_000);
    }
    const template = { base, quote, buy, sell, spread };
    await this.page
      .getByTestId('strategy-json-shortcut')
      .fill(JSON.stringify(template));
    await this.page.getByTestId('create-strategies').click();
    await deps.tokenApproval.checkApproval([base, quote]);
    await this.page.getByTestId('creating-strategies').waitFor({
      state: 'detached',
    });
  }
}
