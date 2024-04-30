import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';

const addresses = {
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  ZERO: '0x0000000000000000000000000000000000000000',
  USDC: '0xace5f7Ea93439Af39b46d2748fA1aC19951c8d7C',
  WSEI: '0x027d2e627209f1ceba52adc8a5afe9318459b44b',
};

export const commonConfig: AppConfig = {
  appUrl: 'https://sei.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/', // TODO: add SEI api
  blockExplorer: 'https://seitrace.com',
  rpcUrl:
    import.meta.env.VITE_CHAIN_RPC_URL ||
    'https://evm-rpc-arctic-1.sei-apis.com',
  walletConnectProjectId: 'f9d8863ab6c03f2293d7d56d7c0c0853', // TODO: if no walletConnectProjectId, remove walletconnect
  mode: 'development',
  network: {
    name: 'SEI Network',
    logoUrl: IconSeiLogo,
    chainId: 713715,
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
      multicall: '0x1E05037b9c4fEFaF3c45CD6F4F2C3197e6A43cD8',
    },
  },
  tokenListOverride: [
    {
      name: 'WSEI',
      symbol: 'WSEI',
      decimals: 18,
      address: '0x027d2e627209f1ceba52adc8a5afe9318459b44b',
      logoURI: '',
    },
    {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xace5f7ea93439af39b46d2748fa1ac19951c8d7c',
      logoURI: '',
    },
  ],
  tokenLists: [
    // TODO: Add SEI token list
  ],
};
