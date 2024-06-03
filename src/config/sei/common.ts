import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';
import { tokenListParser } from 'config/sei/utils';

const addresses = {
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  WSEI: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
  S8N: '0xdD1358dF189aF9605dd9978e1c89eE4ec5B4E6Fe',
  SUPERSEIZ: '0x3140E3ead4943A1e603CCaC577B50E9889AB27f3',
  SENSEI: '0x34a8bB445004E47d1a65573A2c085cE6D134f815',
  USDC: '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
  USDT: '0xB75D0B03c06A926e488e2659DF1A861F860bD3d1',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appUrl: 'https://sei.carbondefi.xyz',
  carbonApi: 'https://sei-api.carbondefi.xyz/v1/',
  selectableConnectionTypes: ['injected', 'coinbaseWallet'],
  walletConnectProjectId: '',
  isSimulatorEnabled: false,
  policiesLastUpdated: '27 May, 2024',
  network: {
    name: 'Sei Network',
    logoUrl: IconSeiLogo,
    chainId: 1329,
    blockExplorer: { name: 'Seitrace', url: 'https://seitrace.com' },
    rpc: {
      url: import.meta.env.VITE_CHAIN_RPC_URL || 'https://evm-rpc.sei-apis.com',
      headers: {
        'x-apikey': import.meta.env.VITE_CHAIN_RPC_KEY || '',
      },
    },
    gasToken: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
      address: addresses.SEI,
      logoURI:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/seitestnet2/images/sei.png',
    },
  },
  defaultTokenPair: [addresses.SEI, addresses.WSEI],
  popularPairs: [
    [addresses.SEI, addresses.WSEI],
    [addresses.SEI, addresses.USDC],
    [addresses.SEI, addresses.USDT],
    [addresses.S8N, addresses.SEI],
    [addresses.SENSEI, addresses.SEI],
    [addresses.SUPERSEIZ, addresses.SEI],
    [addresses.S8N, addresses.SUPERSEIZ],
    [addresses.S8N, addresses.SENSEI],
    [addresses.SENSEI, addresses.SUPERSEIZ],
  ],
  popularTokens: {
    base: [
      addresses.SEI,
      addresses.WSEI,
      addresses.USDT,
      addresses.USDC,
      addresses.S8N,
      addresses.SUPERSEIZ,
      addresses.SENSEI,
    ],
    quote: [
      addresses.SEI,
      addresses.WSEI,
      addresses.USDT,
      addresses.USDC,
      addresses.S8N,
      addresses.SUPERSEIZ,
      addresses.SENSEI,
    ],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
      voucher: '0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5',
    },
    utils: {
      multicall: '0xe033Bed7cae4114Af84Be1e9F1CA7DEa07Dfe1Cf',
    },
  },
  tokenListOverride: [
    {
      name: 'WSEI',
      symbol: 'WSEI',
      decimals: 18,
      address: addresses.WSEI,
      logoURI:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/seitestnet2/images/sei.png',
    },
  ],
  tokenLists: [
    {
      uri: 'https://raw.githubusercontent.com/Sei-Public-Goods/sei-assetlist/main/assetlist.json',
      parser: tokenListParser('pacific-1-evm'),
    },
  ],
};
