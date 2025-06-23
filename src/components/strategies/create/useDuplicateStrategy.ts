import { useNavigate } from 'libs/routing';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import {
  getStrategyType,
  isLimitOrder,
} from 'components/strategies/common/utils';
import { NATIVE_TOKEN_ADDRESS, isGasTokenToHide } from 'utils/tokens';
import { BaseStrategy, CartStrategy } from '../common/types';

export const useDuplicate = () => {
  const navigate = useNavigate();
  return (strategy: BaseStrategy) => {
    const type = getStrategyType(strategy);
    const { base, quote, buy, sell } = strategy;
    let baseAddress = base.address;
    let quoteAddress = quote.address;

    // Force native token address if gas token is different
    if (isGasTokenToHide(baseAddress)) baseAddress = NATIVE_TOKEN_ADDRESS;
    if (isGasTokenToHide(quoteAddress)) quoteAddress = NATIVE_TOKEN_ADDRESS;

    switch (type) {
      case 'disposable': {
        const isBuyEmpty = !+buy.max;
        const order = isBuyEmpty ? sell : buy;
        return navigate({
          to: '/trade/disposable',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            min: order.min,
            max: order.max,
            budget: order.budget,
            settings: isLimitOrder(order) ? 'limit' : 'range',
            direction: isBuyEmpty ? 'sell' : 'buy',
          },
        });
      }
      case 'overlapping': {
        return navigate({
          to: '/trade/overlapping',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            min: buy.min,
            max: sell.max,
            spread: getRoundedSpread({ buy, sell }).toString(),
          },
        });
      }
      case 'recurring': {
        return navigate({
          to: '/trade/recurring',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            buyMin: buy.min,
            buyMax: buy.max,
            buyBudget: buy.budget,
            buySettings: isLimitOrder(buy) ? 'limit' : 'range',
            sellMin: sell.min,
            sellMax: sell.max,
            sellBudget: sell.budget,
            sellSettings: isLimitOrder(sell) ? 'limit' : 'range',
          },
        });
      }
    }
  };
};

export const useCartDuplicate = () => {
  const navigate = useNavigate();
  return (strategy: CartStrategy) => {
    const type = getStrategyType(strategy);
    const { base, quote, buy, sell } = strategy;
    let baseAddress = base.address;
    let quoteAddress = quote.address;

    // Force native token address if gas token is different
    if (isGasTokenToHide(baseAddress)) baseAddress = NATIVE_TOKEN_ADDRESS;
    if (isGasTokenToHide(quoteAddress)) quoteAddress = NATIVE_TOKEN_ADDRESS;

    switch (type) {
      case 'disposable': {
        const isBuyEmpty = !+buy.max;
        const order = isBuyEmpty ? sell : buy;
        return navigate({
          to: '/trade/disposable',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            min: order.min,
            max: order.max,
            budget: order.budget,
            settings: isLimitOrder(order) ? 'limit' : 'range',
            direction: isBuyEmpty ? 'sell' : 'buy',
          },
        });
      }
      case 'overlapping': {
        return navigate({
          to: '/trade/overlapping',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            min: buy.min,
            max: sell.max,
            spread: getRoundedSpread({ buy, sell }).toString(),
          },
        });
      }
      case 'recurring': {
        return navigate({
          to: '/trade/recurring',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            buyMin: buy.min,
            buyMax: buy.max,
            buyBudget: buy.budget,
            buySettings: isLimitOrder(buy) ? 'limit' : 'range',
            sellMin: sell.min,
            sellMax: sell.max,
            sellBudget: sell.budget,
            sellSettings: isLimitOrder(sell) ? 'limit' : 'range',
          },
        });
      }
    }
  };
};
