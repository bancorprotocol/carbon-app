// @todo(gradient): remove this file when SDK is ready

import { GradientOrderAPI, StrategyAPI } from '../extApi/strategy';

const emptyEncodedOrder = {
  liquidity: '',
  initialPrice: '',
  tradingStartTime: '',
  expiry: '',
  multiFactor: '',
  gradientType: '',
};
const emptyEncoded = {
  order0: { ...emptyEncodedOrder },
  order1: { ...emptyEncodedOrder },
};

const defaultAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
export const getGradientMocks = (
  user: string = defaultAddress,
): StrategyAPI<GradientOrderAPI>[] => {
  // Get current Unix timestamp in seconds
  const nowUnixSeconds = Math.floor(Date.now() / 1000);
  const ONE_DAY = 86400; // Seconds in a day

  // Dynamic date strings
  const pastStart = (nowUnixSeconds - 7 * ONE_DAY).toString();
  const pastEnd = (nowUnixSeconds - 1 * ONE_DAY).toString();
  const futureStart = (nowUnixSeconds + 1 * ONE_DAY).toString();
  const futureEnd = (nowUnixSeconds + 7 * ONE_DAY).toString();

  return [
    {
      // Strategy 1234: Buy & Sell dates are AFTER today (Future Strategy)
      id: '1234',
      owner: user,
      base: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      quote: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      buy: {
        startPrice: '3000.00',
        endPrice: '2000.00',
        marginal: '2500.00',
        startDate: futureStart,
        endDate: futureEnd,
        budget: '50000.00', // 50,000 USDC
      },
      sell: {
        startPrice: '3500.00',
        endPrice: '4500.00',
        marginal: '4000.00',
        startDate: futureStart,
        endDate: futureEnd,
        budget: '15.5', // 15.5 WETH
      },
      encoded: emptyEncoded,
    },
    {
      // Strategy 1235: ONLY Buy dates are AFTER today (Buy Future, Sell Past)
      id: '1235',
      owner: user,
      base: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
      quote: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      buy: {
        startPrice: '0.005',
        endPrice: '0.004',
        marginal: '0.0045',
        startDate: futureStart,
        endDate: futureEnd,
        budget: '2.5',
      },
      sell: {
        startPrice: '0.006',
        endPrice: '0.008',
        marginal: '0.007',
        startDate: pastStart,
        endDate: pastEnd,
        budget: '1000.0',
      },
      encoded: emptyEncoded,
    },
    {
      // Strategy 1236: ONLY Sell dates are AFTER today (Buy Past, Sell Future)
      id: '1236',
      owner: user,
      base: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
      quote: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      buy: {
        startPrice: '8.50',
        endPrice: '6.00',
        marginal: '7.25',
        startDate: pastStart,
        endDate: pastEnd,
        budget: '15000.50',
      },
      sell: {
        startPrice: '10.00',
        endPrice: '15.00',
        marginal: '12.50',
        startDate: futureStart,
        endDate: futureEnd,
        budget: '2500.75',
      },
      encoded: emptyEncoded,
    },
    {
      // Strategy 1237: Buy & Sell dates are BEFORE today (Past Strategy)
      id: '1237',
      owner: user,
      base: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      quote: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      buy: {
        startPrice: '65000.00',
        endPrice: '55000.00',
        marginal: '60000.00',
        startDate: pastStart,
        endDate: pastEnd,
        budget: '200000.00',
      },
      sell: {
        startPrice: '70000.00',
        endPrice: '80000.00',
        marginal: '75000.00',
        startDate: pastStart,
        endDate: pastEnd,
        budget: '2.5',
      },
      encoded: emptyEncoded,
    },
    {
      // Strategy 1238: ONLY Buy is Active (Buy is currently running, Sell starts in the future)
      id: '1238',
      owner: user,
      base: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      quote: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      buy: {
        startPrice: '3200.00',
        endPrice: '2800.00',
        marginal: '3000.00',
        startDate: pastStart, // Past
        endDate: futureEnd, // Future
        budget: '10000.00',
      },
      sell: {
        startPrice: '3500.00',
        endPrice: '4000.00',
        marginal: '3800.00',
        startDate: futureStart, // Future
        endDate: futureEnd, // Future
        budget: '5.0',
      },
      encoded: emptyEncoded,
    },
    {
      // Strategy 1239: ONLY Sell is Active (Buy already ended, Sell is currently running)
      id: '1239',
      owner: user,
      base: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
      quote: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      buy: {
        startPrice: '0.005',
        endPrice: '0.004',
        marginal: '0.0045',
        startDate: pastStart, // Past
        endDate: pastEnd, // Past (Before today)
        budget: '1.5',
      },
      sell: {
        startPrice: '0.006',
        endPrice: '0.008',
        marginal: '0.007',
        startDate: pastStart, // Past
        endDate: futureEnd, // Future
        budget: '500.0',
      },
      encoded: emptyEncoded,
    },
    {
      // Strategy 1240: BOTH are Active (Both Buy and Sell are currently running)
      id: '1240',
      owner: user,
      base: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
      quote: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      buy: {
        startPrice: '9.00',
        endPrice: '7.00',
        marginal: '8.00',
        startDate: pastStart, // Past
        endDate: futureEnd, // Future
        budget: '5000.00',
      },
      sell: {
        startPrice: '10.00',
        endPrice: '12.00',
        marginal: '11.00',
        startDate: pastStart, // Past
        endDate: futureEnd, // Future
        budget: '1000.00',
      },
      encoded: emptyEncoded,
    },
  ];
};
