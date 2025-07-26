import { AppConfig } from 'config/types';
import IconTonLogo from 'assets/logos/tonlogo.svg';

const addresses = {
  GEM: 'EQB8O0JJ-hqeDAqDC1OG6zPYBfpV-QzwPed0kpcbILXsmAxG',
  TON: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
  USDT: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
  ZERO: '000000000000000000000000000000000000000000000000',
};

const popularTokens = [addresses.GEM, addresses.TON, addresses.USDT];

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'TON - Carbon DeFi Mini-App',
  appUrl: 'https://ton.tg.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/ton/',
  selectedConnectors: ['MetaMask'],
  blockedConnectors: [],
  walletConnectProjectId: '',
  policiesLastUpdated: '26 June, 2025',
  network: {
    name: 'TON',
    logoUrl: IconTonLogo,
    chainId: 239,
    blockExplorer: {
      name: 'Tonscan',
      url: 'https://testnet.tonscan.org/',
    },
    rpc: {
      url: 'https://rpc.ankr.com/premium-http/ton_api_v2/',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'TON',
      symbol: 'TON',
      decimals: 9,
      address: addresses.TON,
      logoURI: 'https://ton.org/download/ton_symbol.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.TON, addresses.USDT],
  popularPairs: [
    [addresses.TON, addresses.USDT],
    [addresses.GEM, addresses.USDT],
    [addresses.TON, addresses.GEM],
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
  },
};
