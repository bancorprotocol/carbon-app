import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { StrategyEventType } from 'services/events/types';
import { sanitizeNumberInput } from 'utils/helpers';
import { OrderCreate } from './useOrder';
import { useSearch } from 'libs/routing';
import { StrategyCreateSearch } from './types';

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
    buyTokenPrice: sanitizeNumberInput(order0.price, 18),
    buyTokenPriceMin: sanitizeNumberInput(order0.min, 18),
    buyTokenPriceMax: sanitizeNumberInput(order0.max, 18),
    sellOrderType: order1?.isRange ? 'range' : 'limit',
    sellBudget: order1.budget,
    sellBudgetUsd: highBudgetUsd,
    sellTokenPrice: sanitizeNumberInput(order1.price, 18),
    sellTokenPriceMin: sanitizeNumberInput(order1.min, 18),
    sellTokenPriceMax: sanitizeNumberInput(order1.max, 18),
    strategyDirection: search?.strategyDirection,
    strategySettings: search?.strategySettings,
    strategyType: search?.strategyType,
  };
};
