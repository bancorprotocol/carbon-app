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

const popularTokens = [
  addresses.ETH,
  addresses.USDC,
  addresses.USDT,
  addresses.WBTC,
  addresses.BNT,
];

export const commonConfig: AppConfig = {
  mode: 'development',
  appName: 'Ethereum - Carbon DeFi',
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
  policiesLastUpdated: '24 Feb, 2026',
  network: {
    name: 'Ethereum',
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
  popularTokens: popularTokens,
  stableTokens: [addresses.USDT, addresses.USDC, addresses.DAI],
  addresses: {
    tokens: addresses,
    carbon: {
      carbonController: '0xC537e898CD774e2dCBa3B14Ea6f34C93d5eA45e1',
      voucher: '0x3660F04B79751e31128f6378eAC70807e38f554E',
      batcher: '0x0199f3A6C4B192B9f9C3eBE31FBC535CdD4B7D4e',
      vault: '0x60917e542aDdd13bfd1a7f81cD654758052dAdC4',
      // @todo(gradient): reset these addresses
      // gradientController: '0x5BDdF8EdeEaE66Cc8477c9282b8c0462CD7132aa',
      // gradientVoucher: '0x4973fa43c4c4b0Bbe4071eB3e7c900810Df143E8',
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
      address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
      blockCreated: 19_258_213,
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
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        symbol: 'USDC',
      },
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        decimals: 18,
        symbol: 'DAI',
      },
      {
        address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
        decimals: 18,
        symbol: 'BNT',
      },
      {
        address: '0x15b0dD2c5Db529Ab870915ff498bEa6d20Fb6b96',
        decimals: 18,
        symbol: 'PARQ',
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        decimals: 8,
        symbol: 'WBTC',
      },
      {
        address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        decimals: 18,
        symbol: 'BNB',
      },
      {
        address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        decimals: 18,
        symbol: 'MATIC',
      },
      {
        address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        decimals: 18,
        symbol: 'SHIB',
      },
      {
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
        symbol: 'UNI',
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        symbol: 'USDT',
      },
      {
        address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
        decimals: 18,
        symbol: 'PEPE',
        amount: '10000000000',
      },
    ],
  },
  ui: {
    showSimulator: true,
    priceChart: 'native',
    useGradientBranding: true,
    tradeCount: true,
    currencyMenu: true,
    showTerms: true,
    showPrivacy: true,
    showCart: true,
    // rewardUrl: 'https://app.merkl.xyz/?chain=1&protocol=carbon',
    // walkthroughId: 'i2ok96zcpzqw',
    useDexAggregator: false, // !navigator.webdriver, // use sdk in E2E
    useEIP7702: true,
    useSeedData: true,
  },
};
