import { useNavigate } from 'libs/routing';
import { Strategy } from 'libs/queries';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import {
  isOverlappingStrategy,
  isLimitOrder,
} from 'components/strategies/common/utils';

export const useDuplicate = () => {
  const navigate = useNavigate();
  return ({ base, quote, order0, order1 }: Strategy) => {
    const isBuyEmpty = !+order0.endRate;
    const isSellEmpty = !+order1.endRate;
    const isDisposable = isBuyEmpty || isSellEmpty;
    if (isDisposable) {
      const order = isBuyEmpty ? order1 : order0;
      navigate({
        to: '/strategies/create/disposable',
        search: {
          base: base.address,
          quote: quote.address,
          min: order.startRate,
          max: order.endRate,
          budget: order.balance,
          settings: isLimitOrder(order) ? 'limit' : 'range',
          direction: isBuyEmpty ? 'sell' : 'buy',
        },
      });
    } else if (isOverlappingStrategy({ order0, order1 })) {
      navigate({
        to: '/strategies/create/overlapping',
        search: {
          base: base.address,
          quote: quote.address,
          min: order0.startRate,
          max: order1.endRate,
          spread: getRoundedSpread({ order0, order1 }).toString(),
        },
      });
    } else {
      navigate({
        to: '/strategies/create/recurring',
        search: {
          base: base.address,
          quote: quote.address,
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
  };
};
