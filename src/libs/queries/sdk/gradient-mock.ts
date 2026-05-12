// @todo(gradient): remove this file when SDK is ready

export interface SDKGradientStrategy {
  id: string;
  baseToken: string;
  quoteToken: string;
  buyStartPrice: string;
  buyEndPrice: string;
  buyPriceMarginal: string;
  buyStartDate: string;
  buyEndDate: string;
  buyBudget: string;
  sellStartPrice: string;
  sellEndPrice: string;
  sellPriceMarginal: string;
  sellStartDate: string;
  sellEndDate: string;
  sellBudget: string;
  encoded?: any;
}
// Get current Unix timestamp in seconds
const nowUnixSeconds = Math.floor(Date.now() / 1000);
const ONE_DAY = 86400; // Seconds in a day

// Dynamic date strings
const pastStart = (nowUnixSeconds - 7 * ONE_DAY).toString();
const pastEnd = (nowUnixSeconds - 1 * ONE_DAY).toString();
const futureStart = (nowUnixSeconds + 1 * ONE_DAY).toString();
const futureEnd = (nowUnixSeconds + 7 * ONE_DAY).toString();

export const mockGradientStrategies: SDKGradientStrategy[] = [
  {
    // Strategy 1: Buy & Sell dates are AFTER today (Future Strategy)
    id: '1234',
    baseToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    quoteToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    buyStartPrice: '3000',
    buyEndPrice: '2000',
    buyPriceMarginal: '2500',
    buyStartDate: futureStart,
    buyEndDate: futureEnd,
    buyBudget: '50000',
    sellStartPrice: '3500',
    sellEndPrice: '4500',
    sellPriceMarginal: '4000',
    sellStartDate: futureStart,
    sellEndDate: futureEnd,
    sellBudget: '15.5',
  },
  {
    // Strategy 2: ONLY Buy dates are AFTER today (Buy Future, Sell Past)
    id: '1235',
    baseToken: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
    quoteToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    buyStartPrice: '0.005',
    buyEndPrice: '0.004',
    buyPriceMarginal: '0.0045',
    buyStartDate: futureStart,
    buyEndDate: futureEnd,
    buyBudget: '2.5',
    sellStartPrice: '0.006',
    sellEndPrice: '0.008',
    sellPriceMarginal: '0.007',
    sellStartDate: pastStart,
    sellEndDate: futureEnd,
    sellBudget: '1000.0',
  },
  {
    // Strategy 3: ONLY Sell dates are AFTER today (Buy Past, Sell Future)
    id: '1236',
    baseToken: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
    quoteToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    buyStartPrice: '8.50',
    buyEndPrice: '0',
    buyPriceMarginal: '7.25',
    buyStartDate: pastStart,
    buyEndDate: futureEnd,
    buyBudget: '15000.50',
    sellStartPrice: '10',
    sellEndPrice: '10',
    sellPriceMarginal: '12.50',
    sellStartDate: futureStart,
    sellEndDate: futureEnd,
    sellBudget: '2500.75',
  },
  {
    // Strategy 4: Buy & Sell dates are BEFORE today (Past Strategy)
    id: '1237',
    baseToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    quoteToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    buyStartPrice: '65000',
    buyEndPrice: '55000',
    buyPriceMarginal: '60000',
    buyStartDate: pastStart,
    buyEndDate: pastEnd,
    buyBudget: '200000',
    sellStartPrice: '70000',
    sellEndPrice: '80000',
    sellPriceMarginal: '75000',
    sellStartDate: pastStart,
    sellEndDate: pastEnd,
    sellBudget: '2.5',
  },
  {
    // Strategy : 5 buy is empty & sell is in the future
    id: '1238',
    baseToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    quoteToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    buyStartPrice: '0',
    buyEndPrice: '0',
    buyPriceMarginal: '60000',
    buyStartDate: futureStart,
    buyEndDate: futureEnd,
    buyBudget: '200000',
    sellStartPrice: '70000',
    sellEndPrice: '80000',
    sellPriceMarginal: '75000',
    sellStartDate: futureStart,
    sellEndDate: futureEnd,
    sellBudget: '2.5',
  },
  {
    // Strategy : 5 sell is empty & buy is in the future
    id: '1239',
    baseToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    quoteToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    buyStartPrice: '50000',
    buyEndPrice: '80000',
    buyPriceMarginal: '60000',
    buyStartDate: futureStart,
    buyEndDate: futureEnd,
    buyBudget: '200000',
    sellStartPrice: '0',
    sellEndPrice: '0',
    sellPriceMarginal: '75000',
    sellStartDate: futureStart,
    sellEndDate: futureEnd,
    sellBudget: '2.5',
  },
  {
    // Strategy : 5 sell is empty & buy is in the future
    id: '1240',
    baseToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    quoteToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    buyStartPrice: '65000',
    buyEndPrice: '55000',
    buyPriceMarginal: '60000',
    buyStartDate: pastStart,
    buyEndDate: futureEnd,
    buyBudget: '200000',
    sellStartPrice: '70000',
    sellEndPrice: '80000',
    sellPriceMarginal: '75000',
    sellStartDate: pastStart,
    sellEndDate: futureEnd,
    sellBudget: '2.5',
  },
];
