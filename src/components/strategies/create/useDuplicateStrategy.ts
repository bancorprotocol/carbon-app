import { useNavigate, useSearch, StrategyCreateSearch } from 'libs/routing';
import { Order, Strategy } from 'libs/queries';
import { isOverlappingStrategy } from '../overlapping/utils';
import { useTokens } from 'hooks/useTokens';

const isEmptyOrder = (order: Order) => {
  return !Number(order.startRate) && !Number(order.endRate);
};
const isLimitOrder = (order: Order) => {
  return order.startRate === order.endRate;
};
const toStrategyCreateSearch = (
  order0: Order,
  order1: Order
): StrategyCreateSearch => {
  if (isOverlappingStrategy({ order0, order1 })) {
    return { strategySettings: 'overlapping' };
  }
  const isRecurring = !isEmptyOrder(order0) && !isEmptyOrder(order1);
  const isLimit = isLimitOrder(order0) && isLimitOrder(order1);
  if (isRecurring) {
    return {
      strategyType: 'recurring',
      strategySettings: isLimit ? 'limit' : 'range',
    };
  } else {
    return {
      strategyType: 'disposable',
      strategySettings: isLimit ? 'limit' : 'range',
      strategyDirection: order1.endRate === '0' ? 'buy' : 'sell',
    };
  }
};

/** Remove unwanted balances from duplicate */
const prepareDuplicate = (strategy: Strategy) => {
  // Remove balance if overlapping strategy because market price changed
  if (isOverlappingStrategy(strategy)) {
    strategy.order0.balance = '0';
    strategy.order1.balance = '0';
  }
  if (isEmptyOrder(strategy.order0)) strategy.order0.balance = '0';
  if (isEmptyOrder(strategy.order1)) strategy.order1.balance = '0';
  return strategy;
};

type DuplicateStrategyParams = StrategyCreateSearch & {
  base: string;
  quote: string;
  buyMin: string;
  buyMax: string;
  buyMarginalPrice: string;
  buyBudget: string;
  sellMin: string;
  sellMax: string;
  sellMarginalPrice: string;
  sellBudget: string;
};

// TODO: test it and move it into number utils
const roundSearchParam = (param: string) => {
  if (param === '0') return '';
  const [radix, decimals] = param.split('.');
  if (!decimals) return param;
  let leadingZeros = '';
  for (const char of decimals) {
    if (char !== '0') break;
    leadingZeros += '0';
  }
  if (leadingZeros === decimals) return radix;
  const rest = decimals
    .slice(leadingZeros.length, leadingZeros.length + 6)
    .replace(/0+$/, '');
  return `${radix}.${leadingZeros}${rest}`;
};

export const useDuplicateStrategy = () => {
  const navigate = useNavigate();
  const { getTokenById } = useTokens();
  const search: DuplicateStrategyParams = useSearch({ strict: false });

  const duplicate = (strategy: Strategy) => {
    const { base, quote, order0, order1 } = prepareDuplicate(strategy);
    navigate({
      to: '/strategies/create',
      search: {
        base: base.address,
        quote: quote.address,
        ...toStrategyCreateSearch(order0, order1),
        buyMin: roundSearchParam(order0.startRate),
        buyMax: roundSearchParam(order0.endRate),
        buyBudget: roundSearchParam(order0.balance),
        sellMin: roundSearchParam(order1.startRate),
        sellMax: roundSearchParam(order1.endRate),
        sellBudget: roundSearchParam(order1.balance),
      },
    });
  };

  const decoded = {
    strategyType: search.strategyType,
    strategySettings: search.strategySettings,
    strategyDirection: search.strategyDirection,
    base: getTokenById(search.base),
    quote: getTokenById(search.quote),
    order0: {
      balance: search.buyBudget ?? '',
      startRate: search.buyMin ?? '',
      endRate: search.buyMax ?? '',
      marginalRate: '',
    },
    order1: {
      balance: search.sellBudget ?? '',
      startRate: search.sellMin ?? '',
      endRate: search.sellMax ?? '',
      marginalRate: '',
    },
  };

  return {
    duplicate,
    templateStrategy: decoded,
  };
};
