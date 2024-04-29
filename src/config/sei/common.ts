import { AppConfig } from 'config/types';
import IconSeiLogo from 'assets/logos/seilogo.svg';

const addresses = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  SEI: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  BNT: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  ZERO: '0x0000000000000000000000000000000000000000',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xace5f7Ea93439Af39b46d2748fA1aC19951c8d7C',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  WSEI: '0x027d2e627209f1ceba52adc8a5afe9318459b44b',
  SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  ENJ: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  LDO: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  APE: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  GRT: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
  AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
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
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
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
