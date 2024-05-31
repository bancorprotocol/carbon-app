import { useFiatCurrency } from 'hooks/useFiatCurrency';
import useInitEffect from 'hooks/useInitEffect';
import { Token } from 'libs/tokens';
import { carbonEvents } from 'services/events';

import {
  StrategyBuyEventType,
  StrategyEventTypeBase,
  StrategySellEventType,
} from 'services/events/types';
import { sanitizeNumber } from 'utils/helpers';
import { OrderCreate } from '../useOrder';

export const useStrategyEvents = ({
  base,
  quote,
  order,
  insufficientBalance,
  buy = false,
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

  const getStrategyEventData = (): (
    | StrategySellEventType
    | StrategyBuyEventType
  ) &
    StrategyEventTypeBase => {
    if (buy) {
      return {
        baseToken: base,
        quoteToken: quote,
        buyOrderType: order.isRange ? 'range' : 'limit',
        buyBudget: order.budget,
        buyBudgetUsd: fiatValueUsd,
        buyTokenPrice: sanitizeNumber(order.price, 18),
        buyTokenPriceMin: sanitizeNumber(order.min, 18),
        buyTokenPriceMax: sanitizeNumber(order.max, 18),
        strategySettings: undefined,
        strategyType: undefined,
      };
    }
    return {
      baseToken: base,
      quoteToken: quote,
      sellOrderType: order.isRange ? 'range' : 'limit',
      sellBudget: order.budget,
      sellBudgetUsd: fiatValueUsd,
      sellTokenPrice: sanitizeNumber(order.price, 18),
      sellTokenPriceMin: sanitizeNumber(order.min, 18),
      sellTokenPriceMax: sanitizeNumber(order.max, 18),
      strategySettings: undefined,
      strategyType: undefined,
    };
  };

  useInitEffect(() => {
    carbonEvents.strategy.strategyErrorShow({
      buy,
      message: 'Insufficient balance',
    });
  }, [buy, insufficientBalance]);

  useInitEffect(() => {
    const strategy = getStrategyEventData();
    buy
      ? carbonEvents.strategy.strategyBuyLowOrderTypeChange(
          strategy as StrategyBuyEventType & StrategyEventTypeBase
        )
      : carbonEvents.strategy.strategySellHighOrderTypeChange(
          strategy as StrategySellEventType & StrategyEventTypeBase
        );
  }, [buy, order.isRange]);

  useInitEffect(() => {
    const strategy = getStrategyEventData();
    buy
      ? carbonEvents.strategy.strategyBuyLowPriceSet(
          strategy as StrategyBuyEventType & StrategyEventTypeBase
        )
      : carbonEvents.strategy.strategySellHighPriceSet(
          strategy as StrategySellEventType & StrategyEventTypeBase
        );
  }, [buy, order.min, order.max, order.price]);

  useInitEffect(() => {
    const strategy = getStrategyEventData();

    buy
      ? carbonEvents.strategy.strategyBuyLowBudgetSet(
          strategy as StrategyBuyEventType & StrategyEventTypeBase
        )
      : carbonEvents.strategy.strategySellHighBudgetSet(
          strategy as StrategySellEventType & StrategyEventTypeBase
        );
  }, [buy, order.budget]);
};
