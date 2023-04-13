import { useFiatCurrency } from 'hooks/useFiatCurrency';
import useInitEffect from 'hooks/useInitEffect';
import { Token } from 'libs/tokens';
import { carbonEvents } from 'services/events';

import { StrategyEventType } from 'services/events/types';
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

  const getStrategyEventData = (): StrategyEventType => {
    if (buy) {
      return {
        baseToken: base.symbol,
        quoteToken: quote.symbol,
        buyOrderType: order.isRange ? 'range' : 'limit',
        buyBudget: order.budget,
        buyBudgetUsd: fiatValueUsd,
        buyTokenPrice: sanitizeNumberInput(order.price, 18),
        buyTokenPriceMin: sanitizeNumberInput(order.min, 18),
        buyTokenPriceMax: sanitizeNumberInput(order.max, 18),
      };
    }
    return {
      baseToken: base.symbol,
      quoteToken: quote.symbol,
      sellOrderType: order.isRange ? 'range' : 'limit',
      sellBudget: order.budget,
      sellBudgetUsd: fiatValueUsd,
      sellTokenPrice: sanitizeNumberInput(order.price, 18),
      sellTokenPriceMin: sanitizeNumberInput(order.min, 18),
      sellTokenPriceMax: sanitizeNumberInput(order.max, 18),
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
