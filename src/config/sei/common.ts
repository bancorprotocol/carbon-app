import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';

const addresses = {
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  WSEI: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
  USDC: '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
  USDT: '0xB75D0B03c06A926e488e2659DF1A861F860bD3d1',
};

const popularTokens = [
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',
  '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
  '0xb75d0b03c06a926e488e2659df1a861f860bd3d1',
  '0x9151434b16b9763660705744891fa906f660ecc5',
  '0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8',
  '0x5bff88ca1442c2496f7e475e9e7786383bc070c0',
  '0x83c82f0f959ad3eff528ee513b43808aa53f4b37',
  '0x805679729df385815c57c24b20f4161bd34b655f',
  '0x95597eb8d227a7c4b4f5e807a815c5178ee6dbe1',
  '0x5cf6826140c1c56ff49c808a1a75407cd1df9423',
  '0xd78BE621436e69C81E4d0e9f29bE14C5EC51E6Ae',
  '0x9C367a272f8E318D10118C6367fD69DEf30e430E',
  '0x5f0E07dFeE5832Faa00c63F2D33A0D79150E8598',
  '0x059a6b0ba116c63191182a0956cf697d0d2213ec',
];

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Sei - Carbon DeFi',
  appUrl: 'https://sei.carbondefi.xyz',
  carbonApi: 'https://sei-api.carbondefi.xyz/v1/',
  selectedConnectors: [
    'MetaMask',
    'Coinbase Wallet',
    'Safe',
    'Compass Wallet',
    'Seif',
  ],
  blockedConnectors: ['Tailwind'],
  walletConnectProjectId: '',
  policiesLastUpdated: '27 May, 2024',
  network: {
    name: 'Sei',
    logoUrl: IconSeiLogo,
    chainId: 1329,
    blockExplorer: { name: 'Seitrace', url: 'https://seitrace.com' },
    rpc: {
      url: 'https://evm-rpc.sei-apis.com',
      headers: {
        'x-apikey': 'a5063ab2',
      },
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
      address: addresses.SEI,
      logoURI: 'https://cdn.sei.io/assets/Sei_Symbol_Gradient.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.SEI, addresses.USDC],
  popularPairs: [
    [addresses.SEI, addresses.WSEI],
    [addresses.SEI, addresses.USDC],
    [addresses.SEI, addresses.USDT],
  ],
  popularTokens: {
    base: popularTokens,
    quote: popularTokens,
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
      voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
      batcher: '0x30dd96D6B693F78730C7C48b6849d9C44CAF39f0',
    },
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 14353601,
    },
  },
  tokenListOverride: [
    {
      name: 'WSEI',
      symbol: 'WSEI',
      decimals: 18,
      address: addresses.WSEI,
      logoURI: 'https://cdn.sei.io/assets/Sei_Symbol_Gradient.svg',
    },
  ],
  tokenLists: [
    // {
    //   uri: 'https://raw.githubusercontent.com/Seitrace/sei-assetlist/refs/heads/main/assetlist.json',
    //   parser: 'tokenSeiListParser',
    // },
    {
      uri: 'https://raw.githubusercontent.com/Sei-Public-Goods/sei-assetlist/main/assetlist.json',
      parser: 'tokenSeiListParser',
    },
    {
      uri: 'https://raw.githubusercontent.com/dragonswap-app/assets/main/tokenlist-sei-mainnet.json',
      parser: 'tokenDragonswapListParser',
    },
  ],
  tenderly: {
    faucetTokens: [
      {
        donorAccount: '0x06b49C508f278a9219a6e45A7bcEbBC0aA1E2e7b',
        tokenContract: addresses.WSEI,
        decimals: 18,
        symbol: 'WSEI',
      },
      {
        donorAccount: '0xE071600b2445Ba5aD609Cb282436663789b388F8',
        tokenContract: addresses.USDC,
        decimals: 6,
        symbol: 'USDC',
      },
      {
        donorAccount: '0x41eEa09c971294FcDE3B6E553902B04a47be7442',
        tokenContract: addresses.USDT,
        decimals: 6,
        symbol: 'USDT',
      },
    ],
  },
  ui: {
    showSimulator: true,
    priceChart: 'native',
    useGradientBranding: true,
    tradeCount: true,
    currencyMenu: false,
    showTerms: true,
    showPrivacy: true,
    showCart: true,
    walkthroughId: '51xep69sd3io',
  },
};
