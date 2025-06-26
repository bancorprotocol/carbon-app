import { AppConfig } from 'config/types';
import IconTacLogo from 'assets/logos/taclogo.svg';

const addresses = {
  TAC: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  wTAC: '0xB63B9f0eb4A6E6f191529D71d4D88cc8900Df2C9',
  ZERO: '0x0000000000000000000000000000000000000000',
  TON: '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140',
  USDT: '0xAF988C3f7CB2AceAbB15f96b19388a259b6C438f',
};

const popularTokens = [
  addresses.TAC,
  addresses.wTAC,
  addresses.TON,
  addresses.USDT,
];

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'TAC - Carbon DeFi',
  appUrl: 'https://tac.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/tac/',
  selectedConnectors: ['MetaMask'],
  blockedConnectors: [],
  walletConnectProjectId: '',
  policiesLastUpdated: '26 June, 2025',
  network: {
    name: 'TAC',
    logoUrl: IconTacLogo,
    chainId: 239,
    blockExplorer: {
      name: 'TAC Explorer',
      url: 'https://explorer.tac.build/',
    },
    rpc: {
      url: 'https://rpc.tac.build',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'TAC',
      symbol: 'TAC',
      decimals: 18,
      address: addresses.TAC,
      logoURI: '/tokens/tac/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.TAC, addresses.USDT],
  popularPairs: [
    [addresses.TAC, addresses.USDT],
    [addresses.TAC, addresses.TON],
    [addresses.TON, addresses.USDT],
  ],
  popularTokens: {
    base: popularTokens,
    quote: popularTokens,
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
      voucher: '0xb0d39990E1C38B50D0b7f6911525535Fbacb4C26',
      batcher: '0x0f54099D787e26c90c487625B4dE819eC5A9BDAA',
    },
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
  tokenListOverride: [],
  tokenLists: [
    // Bancor
    {
      uri: '/tokens/tac/list.json',
    },
  ],
  tenderly: {
    faucetTokens: [],
  },
  ui: {
    showSimulator: false,
    priceChart: 'tradingView',
    useGradientBranding: false,
    tradeCount: false,
    currencyMenu: false,
    showTerms: false,
    showPrivacy: false,
    showCart: false,
    walkthroughId: 'd2a5isof88vg',
  },
};
