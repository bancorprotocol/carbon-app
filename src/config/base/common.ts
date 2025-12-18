import { AppConfig } from 'config/types';

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Base - Velocimeter',
  appUrl: 'https://graphene.velocimeter.xyz/',
  carbonApi: 'https://api.carbondefi.xyz/v1/base-graphene/',
  selectedConnectors: ['MetaMask'],
  blockedConnectors: [],
  walletConnectProjectId: '',
  policiesLastUpdated: '',
  network: {
    name: 'Base',
    logoUrl:
      'https://basescan.org/assets/base/images/svg/logos/chain-light.svg?v=25.1.4.0',
    chainId: 8453,
    blockExplorer: {
      name: 'BaseScan',
      url: 'https://basescan.org/',
    },
    rpc: {
      url: 'https://base.llamarpc.com',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '',
      logoURI: 'https://basescan.org/token/images/eth-token.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [
    '0x4200000000000000000000000000000000000006',
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  ],
  popularPairs: [],
  popularTokens: [],
  addresses: {
    tokens: {
      ZERO: '0x0000000000000000000000000000000000000000',
    },
    carbon: {
      carbonController: '0xfbF069Dbbf453C1ab23042083CFa980B3a672BbA',
      voucher: '0x907f03ae649581ebff369a21c587cb8f154a0b84',
      vault: '',
    },
    openocean: '',
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5022,
    },
  },
  tokenListOverride: [],
  tokenLists: [
    {
      uri: 'https://tokens.coingecko.com/base/all.json',
    },
    {
      uri: 'https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/base/tokenlist.json',
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
  },
};
