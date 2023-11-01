import { useFiatCurrency } from 'hooks/useFiatCurrency';
import useInitEffect from 'hooks/useInitEffect';
import { Token } from 'libs/tokens';
import { carbonEvents } from 'services/events';

import {
  StrategyBuyEventType,
  StrategyEventTypeBase,
  StrategySellEventType,
} from 'services/events/types';
import { sanitizeNumberInput } from 'utils/helpers';
import { StrategyCreateSearch } from '../types';
import { OrderCreate } from '../useOrder';
import { useSearch } from 'libs/routing';

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
  const search: StrategyCreateSearch = useSearch({ strict: false });

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
        buyTokenPrice: sanitizeNumberInput(order.price, 18),
        buyTokenPriceMin: sanitizeNumberInput(order.min, 18),
        buyTokenPriceMax: sanitizeNumberInput(order.max, 18),
        strategyDirection: search?.strategyDirection,
        strategySettings: search?.strategySettings,
        strategyType: search?.strategyType,
      };
    }
    return {
      baseToken: base,
      quoteToken: quote,
      sellOrderType: order.isRange ? 'range' : 'limit',
      sellBudget: order.budget,
      sellBudgetUsd: fiatValueUsd,
      sellTokenPrice: sanitizeNumberInput(order.price, 18),
      sellTokenPriceMin: sanitizeNumberInput(order.min, 18),
      sellTokenPriceMax: sanitizeNumberInput(order.max, 18),
      strategyDirection: search?.strategyDirection,
      strategySettings: search?.strategySettings,
      strategyType: search?.strategyType,
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
