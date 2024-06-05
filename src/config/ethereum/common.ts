import { AppConfig } from 'config/types';
import IconETHLogo from 'assets/logos/ethlogo.svg';

const addresses = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  BNT: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  ZERO: '0x0000000000000000000000000000000000000000',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
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
  mode: 'development',
  appUrl: 'https://app.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/',
  selectedConnections: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'safe'],
  walletConnectProjectId: 'f9d8863ab6c03f2293d7d56d7c0c0853',
  isSimulatorEnabled: true,
  policiesLastUpdated: '18 April, 2023',
  network: {
    name: 'Ethereum Network',
    logoUrl: IconETHLogo,
    chainId: 1,
    blockExplorer: { name: 'Etherscan', url: 'https://etherscan.io' },
    rpc: {
      url:
        import.meta.env.VITE_CHAIN_RPC_URL ||
        'https://eth-mainnet.g.alchemy.com/v2/demo',
    },
    gasToken: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      address: addresses.ETH,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
    },
  },
  defaultTokenPair: [addresses.ETH, addresses.USDC],
  popularPairs: [
    [addresses.ETH, addresses.USDC],
    [addresses.ETH, addresses.USDT],
    [addresses.ETH, addresses.DAI],
    [addresses.ETH, addresses.WBTC],
    [addresses.BNT, addresses.USDC],
    [addresses.BNT, addresses.USDT],
    [addresses.BNT, addresses.DAI],
    [addresses.BNT, addresses.ETH],
    [addresses.BNT, addresses.WBTC],
    [addresses.WBTC, addresses.USDC],
    [addresses.WBTC, addresses.USDT],
    [addresses.WBTC, addresses.DAI],
    [addresses.WBTC, addresses.ETH],
    [addresses.USDT, addresses.USDC],
    [addresses.USDC, addresses.USDT],
    [addresses.USDT, addresses.DAI],
    [addresses.USDC, addresses.DAI],
    [addresses.DAI, addresses.USDC],
    [addresses.DAI, addresses.USDT],
    [addresses.SHIB, addresses.USDT],
    [addresses.SHIB, addresses.USDC],
    [addresses.SHIB, addresses.DAI],
    [addresses.SHIB, addresses.ETH],
  ],
  popularTokens: {
    base: [
      addresses.ETH,
      addresses.WBTC,
      addresses.BNT,
      addresses.SHIB,
      addresses.ENJ,
      addresses.UNI,
      addresses.LINK,
      addresses.LDO,
      addresses.APE,
      addresses.GRT,
      addresses.AAVE,
      addresses.CRV,
    ],
    quote: [
      addresses.DAI,
      addresses.USDC,
      addresses.USDT,
      addresses.ETH,
      addresses.WBTC,
    ],
  },
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1',
      voucher: '0x3660F04B79751e31128f6378eAC70807e38f554E',
    },
    utils: {
      multicall: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    },
  },
  tokenListOverride: [
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: addresses.WETH,
      logoURI:
        'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.svg',
    },
  ],
  tokenLists: [
    // Bancor
    {
      uri: 'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens.json',
    },
    // CoinGecko
    {
      uri: 'https://tokens.coingecko.com/ethereum/all.json',
    },
  ],
};
