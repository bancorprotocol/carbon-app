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
  '0x61D66bC21fED820938021B06e9b2291f3FB91945',
  '0xAf368c91793CB22739386DFCbBb2F1A9e4bCBeBf',
  '0x7048c9e4aBD0cf0219E95a17A8C6908dfC4f0Ee4',
  '0xD44F691aeD69fe43180B95b6F82f89c18Fb93094',
  '0x20512cF15E60242aB5237E0A76c873a338281397',
  '0x27e4Ade13d78Aad45bea31D448f5504031e4871E',
  '0xecAc9C5F704e954931349Da37F60E39f515c11c1',
  '0x51A30E647D33A044967FA3DBb04d6ED6F45455F6',
  '0x5Ced7F73B76A555CCB372cc0F0137bEc5665F81E',
  '0x9bB6983Ca454320BD8691409690B4FCCD489EE96',
  '0x1791BAff6a5e2F2A1340e8B7C1EA2B0c1E2DD1ea',
  '0xb1b385542B6E80F77B94393Ba8342c3Af699f15c',
  '0x35533f54740F1F1aA4179E57bA37039dfa16868B',
  '0x2a52B289bA68bBd02676640aA9F605700c9e5699',
  '0xe82dbD543FD729418613d68Cd1E8FC67b0f46E31',
];

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'TAC - Carbon DeFi',
  appUrl: 'https://tac.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/tac/',
  selectedConnectors: ['MetaMask', 'Safe'],
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
      logoURI:
        'https://res.cloudinary.com/dqz8o8js4/image/upload/v1752369223/Copy_of_TAC-logo-symbol-purple_xx17mf.png',
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
    {
      uri: 'https://raw.githubusercontent.com/TacBuild/tokenlist/refs/heads/main/src/tokens/tac.json',
    },
  ],
  tenderly: {
    faucetTokens: [],
  },
  ui: {
    showSimulator: true,
    priceChart: 'native',
    useGradientBranding: false,
    tradeCount: true,
    currencyMenu: false,
    showTerms: true,
    showPrivacy: true,
    showCart: true,
    rewards: {
      url: 'https://app.merkl.xyz/?chain=42220&protocol=carbon',
      logo: '/logos/merkl.webp',
    },
    // walkthroughId: 'vjbcftqceykr',
  },
};
