import { Page, TestInfo } from '@playwright/test';
import { waitFor } from './../utils/operators';
import {
  createVirtualNetwork,
  deleteVirtualNetwork,
  CreateVirtualNetworkBody,
} from './../utils/tenderly';
import { Wallet } from 'ethers';
import { CreateStrategyTestCase, toDebugStrategy } from './strategy';
import { TokenApprovalDriver } from './TokenApprovalDriver';
import mockLocalStorage from '../mocks/localstorage.json' with { type: 'json' };

const vNetConfig: CreateVirtualNetworkBody = {
  slug: 'e2e-ci',
  display_name: 'E2E-CI',
  fork_config: {
    network_id: 1,
    block_number: '18120000',
  },
  virtual_network_config: {
    chain_config: {
      chain_id: 1,
    },
  },
  sync_state_config: {
    enabled: false,
  },
  explorer_page_config: {
    enabled: false,
    verification_visibility: 'bytecode',
  },
};

export const setupVirtualNetwork = async (testInfo: TestInfo) => {
  const vNet = await createVirtualNetwork(structuredClone(vNetConfig));
  process.env[`TENDERLY_FORK_ID_TEST_${testInfo.testId}`] = vNet.id;
  return vNet;
};

export const setupLocalStorage = async (page: Page, tenderlyRpc: string) => {
  // We need to be on a page to set localstorage so we create an empty page
  await page.route('empty', (route) => {
    return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
  });
  await page.goto('empty');
  const storage = { ...mockLocalStorage, tenderlyRpc };
  return page.evaluate((storage) => {
    // each value is stringified to match lsservice
    for (const [key, value] of Object.entries(storage)) {
      localStorage.setItem(
        `carbon-ethereum-v1.4-${key}`,
        JSON.stringify(value),
      );
    }
  }, storage);
};

export const removeFork = async (testInfo: TestInfo) => {
  const id = process.env[`TENDERLY_FORK_ID_TEST_${testInfo.testId}`];
  if (id) await deleteVirtualNetwork(id);
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

  async setupImposter(config: ImposterConfig = {}) {
    const address = config.address ?? Wallet.createRandom().address;
    await this.page.getByLabel('Imposter Account').fill(address);
    await this.page.getByTestId('save-imposter').click();
  }

  async waitForBalance(token: string) {
    return waitFor(this.page, `balance-${token}`, 5_000).catch(async () => {
      await this.page.getByTestId(`add-${token}`).click();
      return waitFor(this.page, `balance-${token}`, 10_000);
    });
  }

  balanceLocator(token: string) {
    return this.page.getByTestId(`balance-${token}`);
  }

  getBalance(token: string) {
    return this.balanceLocator(token).textContent();
  }

  async createStrategy(
    testCase: CreateStrategyTestCase,
    deps: CreateStrategyDependencies,
  ) {
    const { base, quote } = testCase;
    const { buy, sell, spread } = toDebugStrategy(testCase);
    await Promise.all([this.waitForBalance(base), this.waitForBalance(quote)]);
    const template = { base, quote, buy, sell, spread };
    await this.page
      .getByTestId('strategy-json-shortcut')
      .fill(JSON.stringify(template));
    await this.page.getByTestId('create-strategies').click();
    await deps.tokenApproval.checkApproval([base, quote]);
  }
}
