import '@testing-library/jest-dom/vitest'; // to add vitest jsdom matcher support
import { vitest } from 'vitest';
import { tokens } from './utils';

// MOCK STORE PROVIDER CONTEXTS

vitest.mock('store/useTokensStore.ts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('store/useTokensStore.ts')>();
  const tokensMap = new Map(
    tokens.map((token) => [token.address.toLowerCase(), token])
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
enum MarginalPriceOptions {
  /** Indicates that the marginal price should be reset to its default value. */
  reset = 'RESET',
  /** Indicates that the marginal price should be maintained at its current value. */
  maintain = 'MAINTAIN',
}

vitest.mock('libs/sdk/index.ts', () => {
  return {
    carbonSDK: {
      createBuySellStrategy: () => {
        return {
          to: '',
          from: '',
          nonce: 1,
        };
      },
    },
  };
});

vitest.mock('@bancor/carbon-sdk/strategy-management', () => ({
  MarginalPriceOptions: {
    reset: MarginalPriceOptions.reset,
    maintain: MarginalPriceOptions.maintain,
  },
}));

// MOCK WAGMI WALLET
const mockedWallet = await vitest.hoisted(async () => {
  const { mock } = await import('wagmi/connectors');
  return mock({
    accounts: ['0x5f7a009664B771E889751f4FD721aDc439033ECD'],
  });
});
vitest.mock('libs/wagmi/connectors', async (importOriginal) => {
  const mod = await importOriginal<typeof import('libs/wagmi/connectors')>();

  return {
    ...mod,
    configConnectors: [mockedWallet],
  };
});
