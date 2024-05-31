import { useSearch, StrategyCreateSearch } from 'libs/routing';
import { Order, Strategy } from 'libs/queries';
import { isOverlappingStrategy } from 'components/strategies/overlapping/utils';
import { useTokens } from 'hooks/useTokens';
import { roundSearchParam } from 'utils/helpers';

const isEmptyOrder = (order: Order) => {
  return !Number(order.startRate) && !Number(order.endRate);
};
const isLimitOrder = (order: Order) => {
  return !isEmptyOrder(order) && order.startRate === order.endRate;
};

/** Transform a strategy into query params required for the create page */
export const getDuplicateStrategyParams = (strategy: Strategy) => {
  // Remove balances if needed
  if (isOverlappingStrategy(strategy)) {
    strategy.order0.balance = '0';
    strategy.order1.balance = '0';
  }
  if (isEmptyOrder(strategy.order0)) strategy.order0.balance = '0';
  if (isEmptyOrder(strategy.order1)) strategy.order1.balance = '0';

  // initialize params
  const { order0, order1, base, quote } = strategy;
  const searchParams: StrategyCreateSearch = {
    base: base.address,
    quote: quote.address,
    buyMin: roundSearchParam(order0.startRate),
    buyMax: roundSearchParam(order0.endRate),
    buyBudget: roundSearchParam(order0.balance),
    sellMin: roundSearchParam(order1.startRate),
    sellMax: roundSearchParam(order1.endRate),
    sellBudget: roundSearchParam(order1.balance),
  };
  for (const key in searchParams) {
    const keyString = key as keyof StrategyCreateSearch;
    if (!searchParams[keyString]) delete searchParams[keyString];
  }

  const isRecurring = !isEmptyOrder(order0) && !isEmptyOrder(order1);
  const isOverlapping = isOverlappingStrategy({ order0, order1 });
  if (isOverlapping) {
    searchParams.strategyType = 'recurring';
    searchParams.strategySettings = 'overlapping';
  } else if (isRecurring) {
    const isLimit = isLimitOrder(order0) && isLimitOrder(order1);
    searchParams.strategyType = 'recurring';
    searchParams.strategySettings = isLimit ? 'limit' : 'range';
  } else {
    const isLimit = isLimitOrder(order0) || isLimitOrder(order1);
    searchParams.strategyType = 'disposable';
    searchParams.strategySettings = isLimit ? 'limit' : 'range';
    searchParams.strategyDirection = order1.endRate === '0' ? 'buy' : 'sell';
  }
  return searchParams;
};

export const useDuplicateStrategy = () => {
  const { getTokenById } = useTokens();
  const search: StrategyCreateSearch = useSearch({ strict: false });

  return {
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
};
