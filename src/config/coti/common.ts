import { AppConfig } from 'config/types';
import IconCotiLogo from 'assets/logos/cotilogo.svg';

const addresses = {
  COTI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  GCOTI: '0x7637C7838EC4Ec6b85080F28A678F8E234bB83D1',
  ZERO: '0x0000000000000000000000000000000000000000',
};

const popularTokens = [
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  '0x7637C7838EC4Ec6b85080F28A678F8E234bB83D1',
  '0xf1Feebc4376c68B7003450ae66343Ae59AB37D3C',
  '0x639aCc80569c5FC83c6FBf2319A6Cc38bBfe26d1',
  '0x8C39B1fD0e6260fdf20652Fc436d25026832bfEA',
];

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
      logoURI: '/tokens/coti/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.COTI, addresses.GCOTI],
  popularPairs: [[addresses.COTI, addresses.GCOTI]],
  popularTokens: {
    base: popularTokens,
    quote: popularTokens,
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
      address: '0x773B75CfB146bd5d1095fa9d6d45637f02B05119',
      blockCreated: 1742915034,
    },
  },
  tokenListOverride: [],
  tokenLists: [
    // Bancor
    {
      uri: '/tokens/coti/list.json',
    },
  ],
  tenderly: {
    faucetTokens: [],
  },
  ui: {
    showSimulator: true,
    priceChart: 'native',
    useGradientBranding: true,
    tradeCount: false,
    currencyMenu: false,
    showTerms: true,
    showPrivacy: true,
    showCart: true,
    walkthroughId: 'i2ok96zcpzqw',
  },
};
