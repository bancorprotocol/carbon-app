import { useFiatCurrency } from 'hooks/useFiatCurrency';
import useInitEffect from 'hooks/useInitEffect';
import { Token } from 'libs/tokens';
import { carbonEvents } from 'services/googleTagManager';
import { StrategyType } from 'services/googleTagManager/types';
import { sanitizeNumberInput } from 'utils/helpers';
import { OrderCreate } from '../useOrder';

export const useStrategyEvents = ({
  base,
  quote,
  order,
  buy,
  insufficientBalance,
}: {
  base: Token;
  quote: Token;
  order: OrderCreate;
  buy?: boolean;
  insufficientBalance?: boolean;
}) => {
  const budgetToken = buy ? quote : base;
  const { getFiatValue } = useFiatCurrency(budgetToken);
  const fiatValueUsd = getFiatValue(order.budget, true).toString();

  const getStrategyEventData = (): StrategyType => {
    if (buy) {
      return {
        strategy_base_token: base.symbol,
        strategy_quote_token: quote.symbol,
        strategy_buy_low_order_type: order.isRange ? 'range' : 'limit',
        strategy_buy_low_budget: order.budget,
        strategy_buy_low_budget_usd: fiatValueUsd,
        strategy_buy_low_token_price: sanitizeNumberInput(order.price, 18),
        strategy_buy_low_token_min_price: sanitizeNumberInput(order.min, 18),
        strategy_buy_low_token_max_price: sanitizeNumberInput(order.max, 18),
      };
    }
    return {
      strategy_base_token: base.symbol,
      strategy_quote_token: quote.symbol,
      strategy_sell_high_order_type: order.isRange ? 'range' : 'limit',
      strategy_sell_high_budget: order.budget,
      strategy_sell_high_budget_usd: fiatValueUsd,
      strategy_sell_high_token_price: sanitizeNumberInput(order.price, 18),
      strategy_sell_high_token_min_price: sanitizeNumberInput(order.min, 18),
      strategy_sell_high_token_max_price: sanitizeNumberInput(order.max, 18),
    };
  };

  useInitEffect(() => {
    carbonEvents.strategy.strategyErrorShow({
      section: buy ? 'Buy Low' : 'Sell High',
      message: 'Insufficient balance',
    });
  }, [buy, insufficientBalance]);

  useInitEffect(() => {
    const strategy = getStrategyEventData();
    buy
      ? carbonEvents.strategy.strategyBuyLowOrderTypeChange(strategy)
      : carbonEvents.strategy.strategySellHighOrderTypeChange(strategy);
  }, [buy, order.isRange]);

  useInitEffect(() => {
    const strategy = getStrategyEventData();
    buy
      ? carbonEvents.strategy.strategyBuyLowPriceSet(strategy)
      : carbonEvents.strategy.strategySellHighPriceSet(strategy);
  }, [buy, order.min, order.max, order.price]);

  useInitEffect(() => {
    const strategy = getStrategyEventData();

    buy
      ? carbonEvents.strategy.strategyBuyLowBudgetSet(strategy)
      : carbonEvents.strategy.strategySellHighBudgetSet(strategy);
  }, [buy, order.budget]);
};
