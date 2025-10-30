import { AppConfig } from 'config/types';
import IconCeloLogo from 'assets/logos/celologo.svg';

const addresses = {
  CELO: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  CELO_ERC20: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  CELO_ALFAJORES: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
  ZERO: '0x0000000000000000000000000000000000000000',
  CUSD: '0x765de816845861e75a25fca122bb6898b8b1282a',
  CEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  CETH: '0x2DEf4285787d58a2f811AF24755A8150622f4361',
  USDC: '0xceba9300f2b948710d2653dd7b07f33a8b32118c',
  USDT: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
  WETH: '0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207',
};

const popularTokens = [
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  '0x765de816845861e75a25fca122bb6898b8b1282a',
  '0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73',
  '0x2DEf4285787d58a2f811AF24755A8150622f4361',
  '0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e',
  '0xceba9300f2b948710d2653dd7b07f33a8b32118c',
  '0x66803fb87abd4aac3cbb3fad7c3aa01f6f3fb207',
  '0x62b8b11039fcfe5ab0c56e502b1c372a3d2a9c7a',
  '0x1d18d0386f51ab03e7e84e71bda1681eba865f1f',
  '0xd629eb00deced2a080b7ec630ef6ac117e614f1b',
  '0x27cd006548df7c8c8e9fdc4a67fa05c2e3ca5cf9',
  '0x17700282592d6917f6a73d0bf8accf4d578c131e',
  '0xe8537a3d056da446677b9e9d6c5db704eaab4787',
  '0x6e512bfc33be36f2666754e996ff103ad1680cc9',
  '0xef4229c8c3250c675f21bcefa42f58efbff6002a',
  '0x37f750b7cc259a2f741af45294f6a16572cf5cad',
  '0x29dfce9c22003a4999930382fd00f9fd6133acd1',
];

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Celo - Carbon DeFi',
  appUrl: 'https://celo.carbondefi.xyz',
  carbonApi: 'https://celo-api.carbondefi.xyz/v1/',
  selectedConnectors: ['MetaMask', 'Coinbase Wallet', 'Safe', 'WalletConnect'],
  blockedConnectors: ['Tailwind', 'Compass Wallet', 'Seif'],
  walletConnectProjectId: 'f9d8863ab6c03f2293d7d56d7c0c0853',
  policiesLastUpdated: '31 Jul, 2024',
  network: {
    name: 'Celo',
    logoUrl: IconCeloLogo,
    chainId: 42220,
    blockExplorer: {
      name: 'CeloScan',
      url: 'https://celoscan.io',
    },
    rpc: {
      url: 'https://forno.celo.org',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'CELO (erc20)',
      symbol: 'CELO (erc20)',
      decimals: 18,
      address: addresses.CELO_ERC20,
      logoURI:
        'https://raw.githubusercontent.com/celo-org/celo-token-list/main/assets/celo_logo.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.CELO, addresses.USDC],
  popularPairs: [
    [addresses.CELO, addresses.CUSD],
    [addresses.CELO, addresses.USDC],
    [addresses.CELO, addresses.USDT],
    [addresses.CELO, addresses.CUSD],
    [addresses.CELO, addresses.CEUR],
    [addresses.CELO, addresses.CETH],
    [addresses.CELO, addresses.WETH],
  ],
  popularTokens: {
    base: popularTokens,
    quote: popularTokens,
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0x6619871118D144c1c28eC3b23036FC1f0829ed3a',
      voucher: '0x5E994Ac7d65d81f51a76e0bB5a236C6fDA8dBF9A',
      batcher: '0xa977879684eece2015ae879dc120c8a1c00718f7',
    },
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13112599,
    },
  },
  tokenListOverride: [
    {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
      address: addresses.CELO,
      logoURI:
        'https://raw.githubusercontent.com/celo-org/celo-token-list/main/assets/celo_logo.svg',
    },
    {
      name: 'CELO (Alfajores Testnet)',
      symbol: 'CELO (Alfajores)',
      decimals: 18,
      address: addresses.CELO_ALFAJORES,
      logoURI:
        'https://raw.githubusercontent.com/celo-org/celo-token-list/main/assets/celo_logo.svg',
    },
  ],
  tokenLists: [
    {
      uri: 'https://raw.githubusercontent.com/celo-org/celo-token-list/main/celo.tokenlist.json',
    },
    {
      uri: '/tokens/celo/list.json',
    },
  ],
  tenderly: {
    faucetTokens: [
      {
        donorAccount: '0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972',
        tokenContract: addresses.CUSD,
        decimals: 18,
        symbol: 'CUSD',
      },
      {
        donorAccount: '0xf6436829Cf96EA0f8BC49d300c536FCC4f84C4ED',
        tokenContract: addresses.USDC,
        decimals: 6,
        symbol: 'USDC',
      },
      {
        donorAccount: '0x5754284f345afc66a98fbB0a0Afe71e0F007B949',
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
    rewardUrl: 'https://app.merkl.xyz/?chain=42220&protocol=carbon',
    // walkthroughId: 'uouygtywoj3c',
  },
};
