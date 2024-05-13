import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';
import { tokenListParser } from 'config/sei/utils';

const addresses = {
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  USDC: '0xace5f7Ea93439Af39b46d2748fA1aC19951c8d7C',
  WSEI: '0x027D2E627209f1cebA52ADc8A5aFE9318459b44B',
  JLY: '0x9e7A8e558Ce582511f4104465a886b7bEfBC146b',
};

export const commonConfig: AppConfig = {
  mode: 'development',
  appUrl: 'https://sei.carbondefi.xyz',
  carbonApi: 'https://sei-api.carbondefi.xyz/v1/',
  selectableConnectionTypes: ['injected', 'coinbaseWallet'],
  walletConnectProjectId: '',
  isSimulatorEnabled: false,
  network: {
    name: 'Sei Devnet',
    logoUrl: IconSeiLogo,
    chainId: 713715,
    blockExplorer: { name: 'Seitrace', url: 'https://seitrace.com' },
    rpcUrl:
      import.meta.env.VITE_CHAIN_RPC_URL ||
      'https://evm-rpc-arctic-1.sei-apis.com',
    gasToken: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
      address: addresses.SEI,
      logoURI:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/seitestnet2/images/sei.png',
    },
  },
  defaultTokenPair: [addresses.SEI, addresses.USDC],
  popularPairs: [
    [addresses.SEI, addresses.USDC],
    [addresses.SEI, addresses.WSEI],
    [addresses.WSEI, addresses.USDC],
  ],
  popularTokens: {
    base: [addresses.SEI, addresses.USDC, addresses.WSEI],
    quote: [addresses.SEI, addresses.USDC, addresses.WSEI],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0x59f21012B2E9BA67ce6a7605E74F945D0D4C84EA',
      voucher: '0xe4816658ad10bF215053C533cceAe3f59e1f1087',
    },
    utils: {
      multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  tokenListOverride: [
    {
      name: 'WSEI',
      symbol: 'WSEI',
      decimals: 18,
      address: addresses.WSEI,
      logoURI: '',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: addresses.USDC,
      logoURI: '',
    },
    {
      name: 'JLY',
      symbol: 'JLY',
      decimals: 18,
      address: addresses.JLY,
      logoURI: '',
    },
  ],
  tokenLists: [
    {
      uri: 'https://raw.githubusercontent.com/Sei-Public-Goods/sei-assetlist/main/assetlist.json',
      parser: tokenListParser('arctic-1'),
    },
  ],
};
