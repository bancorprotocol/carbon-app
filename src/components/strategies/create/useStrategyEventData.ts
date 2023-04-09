import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { OrderCreate } from './useOrder';

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
}) => {
  const { getFiatValue: getFiatValueBase } = useFiatCurrency(base);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(quote);
  const lowBudgetUsd = getFiatValueQuote(order0?.budget, true).toString();
  const highBudgetUsd = getFiatValueBase(order1?.budget, true).toString();

  return {
    strategy_buy_low_order_type: order0?.isRange ? 'range' : 'limit',
    strategy_base_token: base?.symbol,
    strategy_quote_token: quote?.symbol,
    strategy_buy_low_budget: order0.budget,
    strategy_buy_low_budget_usd: lowBudgetUsd,
    strategy_buy_low_token_price: order0.price,
    strategy_buy_low_token_min_price: order0.min,
    strategy_buy_low_token_max_price: order0.max,
    strategy_sell_high_order_type: order1?.isRange ? 'range' : 'limit',
    strategy_sell_high_budget: order1.budget,
    strategy_sell_high_budget_usd: highBudgetUsd,
    strategy_sell_high_token_price: order1.price,
    strategy_sell_high_token_min_price: order1.min,
    strategy_sell_high_token_max_price: order1.max,
  };
};
