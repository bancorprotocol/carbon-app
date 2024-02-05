import { useNavigate, useSearch, StrategyCreateSearch } from 'libs/routing';
import { Strategy } from 'libs/queries';
import { isOverlappingStrategy } from '../overlapping/utils';
import { useTokens } from 'hooks/useTokens';

export const toStrategyCreateSearch = (
  strategy: Strategy
): StrategyCreateSearch => {
  const { order0, order1 } = strategy;
  const isRecurring = order0.endRate !== '0' && order1.endRate !== '0';
  const isBuyLimit = order0.startRate === order0.endRate;
  const isSellLimit = order1.startRate === order1.endRate;
  const isLimit = isBuyLimit && isSellLimit;
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

export const useDuplicateStrategy = () => {
  const navigate = useNavigate();
  const { getTokenByAddress } = useTokens();
  const search: DuplicateStrategyParams = useSearch({ strict: false });

  const duplicate = (strategy: Strategy) => {
    const { base, quote, order0: buy, order1: sell } = strategy;
    navigate({
      to: '/strategies/create',
      search: {
        ...search,
        base: base.address,
        quote: quote.address,
        buyMin: buy.startRate,
        buyMax: buy.endRate,
        buyMarginalPrice: buy.marginalRate,
        buyBudget: buy.balance,
        sellMin: sell.startRate,
        sellMax: sell.endRate,
        sellMarginalPrice: sell.marginalRate,
        sellBudget: sell.balance,
      },
    });
  };

  const decoded = {
    strategyType: search.strategyType,
    strategySettings: search.strategySettings,
    strategyDirection: search.strategyDirection,
    base: getTokenByAddress(search.base),
    quote: getTokenByAddress(search.quote),
    order0: {
      balance: search.buyBudget,
      startRate: search.buyMin,
      endRate: search.buyMax,
      marginalRate: search.buyMarginalPrice,
    },
    order1: {
      balance: search.buyBudget,
      startRate: search.sellMin,
      endRate: search.sellMax,
      marginalRate: search.sellMarginalPrice,
    },
  };
  // marginal price should be calculated based on prices
  if (decoded.order0.marginalRate) decoded.order0.marginalRate = '';
  if (decoded.order1.marginalRate) decoded.order1.marginalRate = '';

  // Remove balance if overlapping strategy because market price changed
  if (isOverlappingStrategy(decoded)) {
    decoded.order0.balance = '';
    decoded.order1.balance = '';
  }

  // Clear order balance for opposite direction in disposable
  if (decoded.strategyType === 'disposable') {
    if (decoded.strategyDirection === 'buy') decoded.order1.balance = '';
    if (decoded.strategyDirection === 'sell') decoded.order0.balance = '';
  }

  return {
    duplicate,
    templateStrategy: decoded,
  };
};
