import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { StrategyEventType } from 'services/events/types';
import { sanitizeNumberInput } from 'utils/helpers';
import { StrategyDirection, StrategySettings, StrategyType } from './types';
import { OrderCreate } from './useOrder';

export const useStrategyEventData = ({
  id,
  base,
  quote,
  order0,
  order1,
  strategyType,
  strategyDirection,
  strategySettings,
}: {
  id?: string;
  base: Token | undefined;
  quote: Token | undefined;
  order0: OrderCreate;
  order1: OrderCreate;
  strategyType?: StrategyType;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
}): StrategyEventType => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);
  const lowBudgetUsd = getFiatValueQuote(order0?.budget, true).toString();
  const highBudgetUsd = getFiatValueBase(order1?.budget, true).toString();

  return {
    strategyId: id,
    buyOrderType: order0?.isRange ? 'range' : 'limit',
    baseToken: base?.symbol ? base?.symbol : '',
    quoteToken: quote?.symbol ? quote?.symbol : '',
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
    strategyType: strategyType,
    strategyDirection: strategyDirection,
    strategySettings: strategySettings,
  };
};
