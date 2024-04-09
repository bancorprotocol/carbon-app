import { AppConfig } from 'config/types';

export const commonConfig: AppConfig = {
  mode: 'development',
  appUrl: 'https://app.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/',
  blockExplorer: 'https://etherscan.io',
  rpcUrl:
    import.meta.env.VITE_CHAIN_RPC_URL ||
    'https://eth-mainnet.g.alchemy.com/v2/demo',
  walletConnectProjectId: 'f9d8863ab6c03f2293d7d56d7c0c0853',
  addresses: {
    tokens: {
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
    },
    carbon: {
      carbonController: '0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1',
      voucher: '0x3660F04B79751e31128f6378eAC70807e38f554E',
    },
    utils: {
      multicall: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    },
  },
  tokenLists: [
    // Bancor
    'https://d1wmp5nysbq9xl.cloudfront.net/ethereum/tokens.json',
    // CoinGecko
    'https://tokens.coingecko.com/ethereum/all.json',
  ],
};
