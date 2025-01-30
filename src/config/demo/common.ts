import { AppConfig } from 'config/types';

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: '',
  appUrl: '',
  carbonApi: '',
  selectedConnectors: ['MetaMask'],
  blockedConnectors: [],
  walletConnectProjectId: '',
  policiesLastUpdated: '',
  network: {
    name: 'Demo Network',
    logoUrl: '',
    chainId: 0,
    blockExplorer: {
      name: '',
      url: '',
    },
    rpc: {
      url: import.meta.env.VITE_CHAIN_RPC_URL ?? '',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: '',
      symbol: '',
      decimals: 18,
      address: '',
      logoURI: '',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: ['', ''],
  popularPairs: [],
  popularTokens: {
    base: [],
    quote: [],
  },
  addresses: {
    tokens: {
      ZERO: '0x0000000000000000000000000000000000000000',
    },
    carbon: {
      carbonController: '',
      voucher: '',
    },
  },
  utils: {
    multicall3: {
      address: '0x...',
      blockCreated: 0,
    },
  },
  tokenListOverride: [],
  tokenLists: [],
  tenderly: {
    faucetTokens: [],
  },
  ui: {
    showSimulator: false,
    priceChart: 'tradingView',
    useGradientBranding: false,
    tradeCount: false,
    currencyMenu: false,
    /* ⚠️ If you set it to true, you need to change the content of the page 'src/pages/terms/index.tsx' ⚠️ */
    showTerms: false,
    /* ⚠️ If you set it to true, you need to change the content of the page 'src/pages/privacy/index.tsx' ⚠️ */
    showPrivacy: false,
  },
};
