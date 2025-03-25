import { AppConfig } from 'config/types';
import IconCotiLogo from 'assets/logos/cotilogo.svg';

const addresses = {
  COTI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Carbon DeFi (Coti)',
  appUrl: 'https://coti.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/coti/',
  selectedConnectors: ['MetaMask'],
  blockedConnectors: ['Tailwind', 'Compass Wallet', 'Seif'],
  walletConnectProjectId: '',
  policiesLastUpdated: '31 Jul, 2024',
  network: {
    name: 'Coti',
    logoUrl: IconCotiLogo,
    chainId: 2632500,
    blockExplorer: {
      name: 'CotiScan',
      url: 'https://mainnet.cotiscan.io',
    },
    rpc: {
      url: 'https://mainnet.coti.io/rpc',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'Coti',
      symbol: 'COTI',
      decimals: 18,
      address: addresses.COTI,
      logoURI:
        'https://assets.coingecko.com/coins/images/2962/standard/Coti.png',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.COTI, addresses.COTI],
  popularPairs: [[addresses.COTI, addresses.COTI]],
  popularTokens: {
    base: [addresses.COTI],
    quote: [addresses.COTI],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0x59f21012B2E9BA67ce6a7605E74F945D0D4C84EA',
      voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
      batcher: '0xe033Bed7cae4114Af84Be1e9F1CA7DEa07Dfe1Cf',
    },
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13112599,
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
    showTerms: false,
    showPrivacy: false,
    showCart: false,
  },
};
