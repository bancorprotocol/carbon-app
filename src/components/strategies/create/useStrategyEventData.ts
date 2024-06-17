import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { sanitizeNumber } from 'utils/helpers';
import { StrategyType } from 'libs/routing';
import { BaseOrder } from '../common/types';
import { Strategy } from 'libs/queries';
import { getStrategyType, toBaseOrder } from '../common/utils';

interface Params {
  type: StrategyType;
  base: Token | undefined;
  quote: Token | undefined;
  order0: BaseOrder;
  order1: BaseOrder;
}

export const toStrategyEventParams = (
  strategy: Strategy,
  type?: StrategyType
) => {
  return {
    type: type ?? getStrategyType(strategy),
    base: strategy.base,
    quote: strategy.quote,
    order0: toBaseOrder(strategy.order0),
    order1: toBaseOrder(strategy.order1),
  };
};

export const useStrategyEvent = (params: Params) => {
  const { type, base, quote, order0, order1 } = params;
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);
  const lowBudgetUsd = getFiatValueQuote(order0?.budget, true).toString();
  const highBudgetUsd = getFiatValueBase(order1?.budget, true).toString();
  const buyIsLimit = order0.min === order0.max;
  const sellIsLimit = order1.min === order1.max;

  return {
    buyOrderType: buyIsLimit ? 'limit' : 'range',
    baseToken: base,
    quoteToken: quote,
    buyBudget: order0.budget,
    buyBudgetUsd: lowBudgetUsd,
    buyTokenPrice: buyIsLimit ? sanitizeNumber(order0.min, 18) : '',
    buyTokenPriceMin: buyIsLimit ? '' : sanitizeNumber(order0.min, 18),
    buyTokenPriceMax: buyIsLimit ? '' : sanitizeNumber(order0.max, 18),
    sellOrderType: sellIsLimit ? 'limit' : 'range',
    sellBudget: order1.budget,
    sellBudgetUsd: highBudgetUsd,
    sellTokenPrice: sellIsLimit ? sanitizeNumber(order1.min, 18) : '',
    sellTokenPriceMin: sellIsLimit ? '' : sanitizeNumber(order1.min, 18),
    sellTokenPriceMax: sellIsLimit ? '' : sanitizeNumber(order1.max, 18),
    strategySettings: undefined,
    strategyType: type,
  };
};
