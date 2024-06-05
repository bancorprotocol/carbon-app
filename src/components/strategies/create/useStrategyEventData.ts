import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { StrategyEventType } from 'services/events/types';
import { sanitizeNumber } from 'utils/helpers';
import { OrderCreate } from './useOrder';
import {
  useSearch,
  StrategyType,
  StrategyDirection,
  StrategySettings,
} from 'libs/routing';
import { BaseOrder } from '../common/types';

export const useStrategyEvent = (
  type: StrategyType,
  base: Token | undefined,
  quote: Token | undefined,
  order0: BaseOrder,
  order1: BaseOrder
) => {
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

// TODO: remove once migration is down
interface StrategyCreateSearch {
  base?: string;
  quote?: string;
  strategyType?: StrategyType;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
}
export const useStrategyEventData = ({
  base,
  quote,
  order0,
  order1,
}: {
  base: Token | undefined;
  quote: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
}): StrategyEventType => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);
  const lowBudgetUsd = getFiatValueQuote(order0?.budget, true).toString();
  const highBudgetUsd = getFiatValueBase(order1?.budget, true).toString();
  const search: StrategyCreateSearch = useSearch({ strict: false });

  return {
    buyOrderType: order0?.isRange ? 'range' : 'limit',
    baseToken: base,
    quoteToken: quote,
    buyBudget: order0.budget,
    buyBudgetUsd: lowBudgetUsd,
    buyTokenPrice: sanitizeNumber(order0.price, 18),
    buyTokenPriceMin: sanitizeNumber(order0.min, 18),
    buyTokenPriceMax: sanitizeNumber(order0.max, 18),
    sellOrderType: order1?.isRange ? 'range' : 'limit',
    sellBudget: order1.budget,
    sellBudgetUsd: highBudgetUsd,
    sellTokenPrice: sanitizeNumber(order1.price, 18),
    sellTokenPriceMin: sanitizeNumber(order1.min, 18),
    sellTokenPriceMax: sanitizeNumber(order1.max, 18),
    strategySettings: search?.strategySettings,
    strategyType: search?.strategyType,
  };
};
