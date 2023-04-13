import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
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
}) => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);
  const lowBudgetUsd = getFiatValueQuote(order0?.budget, true).toString();
  const highBudgetUsd = getFiatValueBase(order1?.budget, true).toString();

  return {
    strategy_id: id,
    strategy_buy_low_order_type: order0?.isRange ? 'range' : 'limit',
    strategy_base_token: base?.symbol,
    strategy_quote_token: quote?.symbol,
    strategy_buy_low_budget: order0.budget,
    strategy_buy_low_budget_usd: lowBudgetUsd,
    strategy_buy_low_token_price: sanitizeNumberInput(order0.price, 18),
    strategy_buy_low_token_min_price: sanitizeNumberInput(order0.min, 18),
    strategy_buy_low_token_max_price: sanitizeNumberInput(order0.max, 18),
    strategy_sell_high_order_type: order1?.isRange ? 'range' : 'limit',
    strategy_sell_high_budget: order1.budget,
    strategy_sell_high_budget_usd: highBudgetUsd,
    strategy_sell_high_token_price: sanitizeNumberInput(order1.price, 18),
    strategy_sell_high_token_min_price: sanitizeNumberInput(order1.min, 18),
    strategy_sell_high_token_max_price: sanitizeNumberInput(order1.max, 18),
    strategy_type: strategyType,
    strategy_direction: strategyDirection,
    strategy_settings: strategySettings,
  };
};
