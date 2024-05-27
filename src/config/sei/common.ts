import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';
import { tokenListParser } from 'config/sei/utils';

const addresses = {
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  eSEI: '0xcba2aeEc821b0B119857a9aB39E09b034249681A',
  WSEI: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appUrl: 'https://sei.carbondefi.xyz',
  carbonApi: '',
  selectableConnectionTypes: ['injected', 'coinbaseWallet'],
  walletConnectProjectId: '',
  isSimulatorEnabled: false,
  policiesLastUpdated: '27 May, 2024',
  network: {
    name: 'Sei Network',
    logoUrl: IconSeiLogo,
    chainId: 1329,
    blockExplorer: { name: 'Seitrace', url: 'https://seitrace.com' },
    rpcUrl:
      import.meta.env.VITE_CHAIN_RPC_URL || 'https://evm-rpc.sei-apis.com',
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
    [addresses.SEI, addresses.eSEI],
  ],
  popularTokens: {
    base: [addresses.SEI, addresses.WSEI, addresses.eSEI],
    quote: [addresses.SEI, addresses.WSEI, addresses.eSEI],
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
      name: 'ESEI',
      symbol: 'eSEI',
      decimals: 18,
      address: addresses.eSEI,
      logoURI: '',
    },
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
      parser: tokenListParser('arctic-1'),
    },
  ],
};
