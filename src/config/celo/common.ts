import { AppConfig } from 'config/types';
import IconCeloLogo from 'assets/logos/celologo.svg';

const addresses = {
  CELO: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  CUSD: '0x765de816845861e75a25fca122bb6898b8b1282a',
  USDC: '0xceba9300f2b948710d2653dd7b07f33a8b32118c',
  USDT: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Carbon DeFi',
  appUrl: 'https://celo.carbondefi.xyz',
  carbonApi: 'https://celo-api.carbondefi.xyz/v1/',
  selectedConnectors: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Safe'],
  blockedConnectors: ['Tailwind', 'Compass Wallet', 'Seif'],
  walletConnectProjectId: '',
  isSimulatorEnabled: false,
  policiesLastUpdated: '27 May, 2024',
  network: {
    name: 'Celo Network',
    logoUrl: IconCeloLogo,
    chainId: 42220,
    blockExplorer: {
      name: 'CeloScan',
      url: 'https://celoscan.io',
    },
    rpc: {
      url: import.meta.env.VITE_CHAIN_RPC_URL || 'https://rpc.ankr.com/celo',
    },
    defaultLimitedApproval: true, // TODO
    gasToken: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
      address: addresses.CELO,
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
  ],
  popularTokens: {
    base: [addresses.CELO, addresses.CUSD, addresses.USDT, addresses.USDC],
    quote: [addresses.CELO, addresses.CUSD, addresses.USDT, addresses.USDC],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087', // TODO
      voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5', // TODO
    },
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13112599,
    },
  },
  tokenListOverride: [],
  tokenLists: [
    {
      uri: 'https://raw.githubusercontent.com/celo-org/celo-token-list/main/celo.tokenlist.json',
    },
  ],
  tenderly: {
    nativeTokenDonorAccount: '0xf89d7b9c864f589bbF53a82105107622B35EaA40',
    faucetAmount: 1000,
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
};
