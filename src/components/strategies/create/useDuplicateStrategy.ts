import { StrategyType, useNavigate } from 'libs/routing';
import { Strategy } from 'libs/queries';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import { isLimitOrder } from 'components/strategies/common/utils';
import { NATIVE_TOKEN_ADDRESS, isGasTokenToHide } from 'utils/tokens';

export const useDuplicate = (type: StrategyType) => {
  const navigate = useNavigate();
  return ({ base: rawBase, quote: rawQuote, order0, order1 }: Strategy) => {
    let baseAddress = rawBase.address;
    let quoteAddress = rawQuote.address;

    // Force native token address if gas token is different
    if (isGasTokenToHide(baseAddress)) baseAddress = NATIVE_TOKEN_ADDRESS;
    if (isGasTokenToHide(quoteAddress)) quoteAddress = NATIVE_TOKEN_ADDRESS;

    switch (type) {
      case 'disposable': {
        const isBuyEmpty = !+order0.endRate;
        const order = isBuyEmpty ? order1 : order0;
        return navigate({
          to: '/trade/overview/disposable',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            min: order.startRate,
            max: order.endRate,
            budget: order.balance,
            settings: isLimitOrder(order) ? 'limit' : 'range',
            direction: isBuyEmpty ? 'sell' : 'buy',
          },
        });
      }
      case 'overlapping': {
        return navigate({
          to: '/trade/overview/overlapping/price',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            min: order0.startRate,
            max: order1.endRate,
            spread: getRoundedSpread({ order0, order1 }).toString(),
          },
        });
      }
      case 'recurring': {
        return navigate({
          to: '/trade/overview/recurring/sell',
          search: {
            base: baseAddress,
            quote: quoteAddress,
            buyMin: order0.startRate,
            buyMax: order0.endRate,
            buyBudget: order0.balance,
            buySettings: isLimitOrder(order0) ? 'limit' : 'range',
            sellMin: order1.startRate,
            sellMax: order1.endRate,
            sellBudget: order1.balance,
            sellSettings: isLimitOrder(order1) ? 'limit' : 'range',
          },
        });
      }
    }
  };
};
