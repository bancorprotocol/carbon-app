import { AppConfig } from 'config/types';
import IconETHLogo from 'assets/logos/ethlogo.svg';
import { ONE_HOUR_IN_MS } from 'utils/time';

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
  appName: 'Carbon DeFi',
  appUrl: 'https://app.carbondefi.xyz',
  carbonApi: 'https://api.carbondefi.xyz/v1/',
  externalLinks: {
    analytics: 'http://analytics.carbondefi.xyz',
    simulatorRepo: 'https://github.com/bancorprotocol/carbon-simulator',
    duneDashboard: 'https://dune.com/bancor/carbon-by-bancor',
  },
  selectedConnectors: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Safe'],
  blockedConnectors: ['Tailwind', 'Compass Wallet', 'Seif'],
  walletConnectProjectId: 'f9d8863ab6c03f2293d7d56d7c0c0853',
  policiesLastUpdated: '18 April, 2023',
  network: {
    name: 'Ethereum Network',
    logoUrl: IconETHLogo,
    chainId: 1,
    blockExplorer: { name: 'Etherscan', url: 'https://etherscan.io' },
    rpc: {
      url: 'https://ethereum-rpc.publicnode.com',
    },
    defaultLimitedApproval: false,
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
    cacheTTL: ONE_HOUR_IN_MS,
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
  },
  utils: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 14353601,
    },
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
      blockCreated: 16773775,
    },
  },
  tokenListOverride: [
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: addresses.WETH,
      logoURI:
        '/tokens/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.svg',
    },
  ],
  tokenLists: [
    // Bancor
    {
      uri: '/tokens/ethereum/list.json',
    },
    // CoinGecko
    {
      uri: 'https://tokens.coingecko.com/ethereum/all.json',
    },
  ],
  tenderly: {
    faucetTokens: [
      {
        donorAccount: '0x0a59649758aa4d66e25f08dd01271e891fe52199',
        tokenContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        symbol: 'USDC',
      },
      {
        donorAccount: '0x5777d92f208679db4b9778590fa3cab3ac9e2168',
        tokenContract: '0x6b175474e89094c44da98b954eedeac495271d0f',
        decimals: 18,
        symbol: 'DAI',
      },
      {
        donorAccount: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
        tokenContract: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
        decimals: 18,
        symbol: 'BNT',
      },
      {
        donorAccount: '0x4338545408d73b0e6135876f9ff691bb72f1c8d9',
        tokenContract: '0x15b0dD2c5Db529Ab870915ff498bEa6d20Fb6b96',
        decimals: 18,
        symbol: 'PARQ',
      },
      {
        donorAccount: '0xccF4429DB6322D5C611ee964527D42E5d685DD6a',
        tokenContract: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        decimals: 8,
        symbol: 'WBTC',
      },
      {
        donorAccount: '0x480234599362dC7a76cd99D09738A626F6d77e5F',
        tokenContract: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        decimals: 18,
        symbol: 'BNB',
      },
      {
        donorAccount: '0x5e3ef299fddf15eaa0432e6e66473ace8c13d908',
        tokenContract: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        decimals: 18,
        symbol: 'MATIC',
      },
      {
        donorAccount: '0x5a52e96bacdabb82fd05763e25335261b270efcb',
        tokenContract: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        decimals: 18,
        symbol: 'SHIB',
      },
      {
        donorAccount: '0x4b4e140d1f131fdad6fb59c13af796fd194e4135',
        tokenContract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
        symbol: 'UNI',
      },
      {
        donorAccount: '0x0162Cd2BA40E23378Bf0FD41f919E1be075f025F',
        tokenContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        symbol: 'USDT',
      },
    ],
  },
  ui: {
    showSimulator: true,
    priceChart: 'native',
    useGradientBranding: true,
    tradeCount: false,
    currencyMenu: true,
    showTerms: true,
    showPrivacy: true,
  },
};
