import '@testing-library/jest-dom/vitest'; // to add vitest jsdom matcher support
import { afterEach, vitest } from 'vitest';
import { cleanup } from '@testing-library/react';
import { tokenList } from './utils/mock';

afterEach(() => {
  // Set up clean-up after each test. See issue https://github.com/vitest-dev/vitest/issues/1430
  window.history.replaceState(null, 'root', '/');
  cleanup();
});

vitest.stubGlobal(
  'ResizeObserver',
  vitest.fn(() => ({
    observe: vitest.fn(),
    unobserve: vitest.fn(),
    disconnect: vitest.fn(),
  })),
);

// MOCK STORE PROVIDER CONTEXTS
vitest.mock('store/useTokensStore.ts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('store/useTokensStore.ts')>();
  const tokens = Object.values(tokenList);
  const tokensMap = new Map(
    tokens.map((token) => [token.address.toLowerCase(), token]),
  );
  return {
    ...mod,
    useTokensStore: () => {
      return {
        tokens,
        importedTokens: [],
        tokensMap,
        isPending: false,
        isError: false,
        error: null,
        setImportedTokens: () => {},
      };
    },
  };
});

// MOCK CARBON SDK
vitest.mock('libs/sdk/index.ts', () => {
  return {
    carbonSDK: {
      createBuySellStrategy: () => ({ to: '', from: '', nonce: 1 }),
      updateStrategy: () => ({ to: '', from: '', nonce: 1 }),
    },
  };
});

// MOCK WAGMI WALLET
const mockedWallet = await vitest.hoisted(async () => {
  const { mock } = await import('wagmi/connectors');
  const { Wallet } = await import('ethers');
  const randomWalletAddress = Wallet.createRandom().address as `0x${string}`;
  return mock({
    accounts: [randomWalletAddress],
  });
});
vitest.mock('libs/wagmi/connectors', async (importOriginal) => {
  const mod = await importOriginal<typeof import('libs/wagmi/connectors')>();

  return {
    ...mod,
    configConnectors: [mockedWallet],
  };
});
