import { AppConfig } from 'config/types';
import IconTonLogo from 'assets/logos/tonlogo.svg';

const addresses = {
  TAC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  TON: '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140',
  USDT: '0xAF988C3f7CB2AceAbB15f96b19388a259b6C438f',
  ZERO: '0x0000000000000000000000000000000000000000',
};

const popularTokens = [addresses.TON, addresses.USDT];

export const commonConfig: AppConfig = {
  hidden: true,
  mode: 'development',
  appName: 'TON - Carbon DeFi Mini-App',
  appUrl: 'https://ton.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/tac/',
  tonApi: 'https://rp.mainnet.tac.build/api/v3',
  selectedConnectors: ['MetaMask'],
  blockedConnectors: [],
  walletConnectProjectId: '',
  policiesLastUpdated: '24 Feb, 2026',
  network: {
    name: 'TON',
    logoUrl: IconTonLogo,
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
      name: 'TON',
      symbol: 'TON',
      decimals: 9,
      address: addresses.TON,
      logoURI: IconTonLogo,
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.TON, addresses.USDT],
  popularPairs: [[addresses.TON, addresses.USDT]],
  popularTokens: popularTokens,
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
      voucher: '0xb0d39990E1C38B50D0b7f6911525535Fbacb4C26',
      batcher: '0x0f54099D787e26c90c487625B4dE819eC5A9BDAA',
      vault: '0xBBAFF3Bf6eC4C15992c0Fb37F12491Fd62C5B496',
    },
    tac: {
      proxy: '0x188F6e49FC62c0D73173b11e7BD39C36cD3d730f',
      smartAccountFactory: '0x070820Ed658860f77138d71f74EfbE173775895b',
    },
    openocean: '',
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
      uri: 'https://raw.githubusercontent.com/TacBuild/tokenlist/refs/heads/main/src/tokens/tac.json',
      parser: 'tokenTonToTacParser',
    },
  ],
  tenderly: {
    faucetTokens: [],
  },
  ui: {
    showSimulator: false,
    priceChart: 'native',
    useGradientBranding: true,
    tradeCount: true,
    currencyMenu: false,
    showTerms: true,
    showPrivacy: true,
    showCart: true,
  },
};
