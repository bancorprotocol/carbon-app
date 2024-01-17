import { useNavigate, useSearch } from 'libs/routing';
import { Strategy } from 'libs/queries';
import { isOverlappingStrategy } from '../overlapping/utils';
import { StrategyCreateSearch } from 'libs/routing/routes/strategyCreateEdit';

const isValid = (strategy: Strategy) => {
  return (
    (strategy.hasOwnProperty('base') && strategy.hasOwnProperty('quote')) ||
    (strategy.hasOwnProperty('order0') && strategy.hasOwnProperty('order1'))
  );
};

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

const decodeStrategyAndValidate = (
  urlStrategy?: string
): (Strategy & StrategyCreateSearch) | undefined => {
  if (!urlStrategy) return;

  try {
    const decodedStrategy = JSON.parse(atob(urlStrategy));
    if (!isValid(decodedStrategy)) return;
    return {
      ...decodedStrategy,
      ...toStrategyCreateSearch(decodedStrategy),
    };
  } catch (error) {
    console.log('Invalid value for search param `strategy`', error);
  }
};

export const useDuplicateStrategy = () => {
  const navigate = useNavigate();
  const search: StrategyCreateSearch = useSearch({ strict: false });
  const { strategy: urlStrategy } = search;

  const duplicate = (strategy: Partial<Strategy>) => {
    const encodedStrategy = btoa(JSON.stringify(strategy));

    navigate({
      to: '/strategies/create',
      search: {
        ...search,
        strategy: encodedStrategy,
      },
    });
  };

  const decoded = decodeStrategyAndValidate(urlStrategy);
  if (decoded) {
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
  }

  return {
    duplicate,
    templateStrategy: decoded,
  };
};
