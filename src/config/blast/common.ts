import { AppConfig } from 'config/types';
import IconBlastLogo from 'assets/logos/blastlogo.svg';

const addresses = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  BLAST: '0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad',
  USDB: '0x4300000000000000000000000000000000000003',
  WETH: '0x4300000000000000000000000000000000000004',
  MIM: '0x76da31d7c9cbeae102aff34d3398bc450c8374c1',
  bLOOKS: '0x406F10d635be12ad33D6B133C6DA89180f5B999e',
  BAG: '0xb9dfCd4CF589bB8090569cb52FaC1b88Dbe4981F',
  ZERO: '0x357f93E17FdabEcd3fEFc488a2d27dff8065d00f',
  AI: '0x764933fbAd8f5D04Ccd088602096655c2ED9879F',
  JUICE: '0x818a92bc81Aad0053d72ba753fb5Bc3d0C5C0923',
  OMNI: '0x9e20461bc2c4c980f62f1B279D71734207a6A356',
  DACKIE: '0x47C337Bd5b9344a6F3D6f58C474D9D8cd419D8cA',
};

export const commonConfig: AppConfig = {
  hidden: true,
  mode: 'development',
  appName: 'Carbon DeFi',
  appUrl: 'https://app.carbondefi.xyz',
  carbonApi: 'https://blast-api.carbondefi.xyz/v1/',
  selectedConnectors: ['MetaMask', 'Coinbase Wallet', 'Safe'],
  blockedConnectors: ['Tailwind', 'Compass Wallet', 'Seif'],
  walletConnectProjectId: '',
  isSimulatorEnabled: false,
  policiesLastUpdated: '31 Jul, 2024',
  network: {
    name: 'Blast Network',
    logoUrl: IconBlastLogo,
    chainId: 81457,
    blockExplorer: {
      name: 'BlastScan',
      url: 'https://blastscan.io',
    },
    rpc: {
      url: import.meta.env.VITE_CHAIN_RPC_URL || 'https://rpc.blast.io',
    },
    defaultLimitedApproval: true,
    gasToken: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: addresses.ETH,
      logoURI:
        '/tokens/ethereum/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
    },
  },
  sdk: {
    cacheTTL: 0,
  },
  defaultTokenPair: [addresses.BLAST, addresses.USDB],
  popularPairs: [
    [addresses.BLAST, addresses.BAG],
    [addresses.BLAST, addresses.USDB],
    [addresses.BLAST, addresses.AI],
    [addresses.BLAST, addresses.MIM],
    [addresses.BLAST, addresses.DACKIE],
    [addresses.BLAST, addresses.JUICE],
    [addresses.BLAST, addresses.WETH],
    [addresses.BLAST, addresses.OMNI],
    [addresses.BLAST, addresses.ZERO],
    [addresses.BLAST, addresses.bLOOKS],
  ],
  popularTokens: {
    base: [
      addresses.BLAST,
      addresses.USDB,
      addresses.BAG,
      addresses.AI,
      addresses.MIM,
      addresses.OMNI,
      addresses.JUICE,
    ],
    quote: [
      addresses.BLAST,
      addresses.USDB,
      addresses.BAG,
      addresses.AI,
      addresses.MIM,
      addresses.OMNI,
      addresses.JUICE,
    ],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xfBF49e30Ed1b610E24148c23D32eD5f3F2fC5Dba',
      voucher: '0xfA76DcA90d334C8fD3Ae479f9B4c32a31A37eDB1',
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
      uri: 'https://tokens.coingecko.com/blast/all.json',
    },
  ],
  tenderly: {
    nativeTokenDonorAccount: '0xf89d7b9c864f589bbF53a82105107622B35EaA40',
    faucetAmount: 1000,
    faucetTokens: [
      {
        donorAccount: '0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972',
        tokenContract: addresses.USDB,
        decimals: 18,
        symbol: 'USDB',
      },
      {
        donorAccount: '0xf6436829Cf96EA0f8BC49d300c536FCC4f84C4ED',
        tokenContract: addresses.BAG,
        decimals: 6,
        symbol: 'BAG',
      },
      {
        donorAccount: '0x5754284f345afc66a98fbB0a0Afe71e0F007B949',
        tokenContract: addresses.MIM,
        decimals: 6,
        symbol: 'MIM',
      },
    ],
  },
  ui: {
    priceChart: 'tradingView',
    useGradientBranding: true,
    tradeCount: false,
    currencyMenu: false,
  },
};
