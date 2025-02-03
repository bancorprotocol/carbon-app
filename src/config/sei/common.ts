import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';

const addresses = {
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  WSEI: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
  USDC: '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
  USDT: '0xB75D0B03c06A926e488e2659DF1A861F860bD3d1',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Carbon DeFi',
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
  isSimulatorEnabled: true,
  policiesLastUpdated: '27 May, 2024',
  network: {
    name: 'Sei Network',
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
    base: [addresses.SEI, addresses.WSEI, addresses.USDT, addresses.USDC],
    quote: [addresses.SEI, addresses.WSEI, addresses.USDT, addresses.USDC],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
      voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
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
    nativeTokenDonorAccount: '0x3a7AB16485770c21B7543058De545E986284d0D3',
    faucetAmount: 1000,
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
    priceChart: 'native',
    useGradientBranding: true,
    tradeCount: true,
    currencyMenu: false,
    showTerms: true,
    showPrivacy: true,
  },
};
