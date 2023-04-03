import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Token } from 'libs/tokens';
import { useEffect, useRef } from 'react';
import { sendEvent } from 'services/googleTagManager';
import { StrategyType } from 'services/googleTagManager/types';
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
  const firstTimeRender = useRef({ price: true, budget: true, type: true });
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
        strategy_buy_low_token_price: order.price,
        strategy_buy_low_token_min_price: order.min,
        strategy_buy_low_token_max_price: order.max,
      };
    }
    return {
      strategy_base_token: base.symbol,
      strategy_quote_token: quote.symbol,
      strategy_sell_high_order_type: order.isRange ? 'range' : 'limit',
      strategy_sell_high_budget: order.budget,
      strategy_sell_high_budget_usd: fiatValueUsd,
      strategy_sell_high_token_price: order.price,
      strategy_sell_high_token_min_price: order.min,
      strategy_sell_high_token_max_price: order.max,
    };
  };

  useEffect(() => {
    sendEvent('strategy', 'strategy_error_show', {
      section: buy ? 'Buy Low' : 'Sell High',
      message: 'Insufficient balance',
    });
  }, [buy, insufficientBalance]);

  useEffect(() => {
    if (!firstTimeRender.current.type) {
      const strategy = getStrategyEventData();
      buy
        ? sendEvent('strategy', 'strategy_buy_low_order_type_change', strategy)
        : sendEvent(
            'strategy',
            'strategy_sell_high_order_type_change',
            strategy
          );
    }
    firstTimeRender.current.type = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy, order.isRange]);

  useEffect(() => {
    if (!firstTimeRender.current.price) {
      const strategy = getStrategyEventData();
      buy
        ? sendEvent('strategy', 'strategy_buy_low_price_set', strategy)
        : sendEvent('strategy', 'strategy_sell_high_price_set', strategy);
    }
    firstTimeRender.current.price = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy, order.min, order.max, order.price]);

  useEffect(() => {
    if (!firstTimeRender.current.budget) {
      const strategy = getStrategyEventData();
      buy
        ? sendEvent('strategy', 'strategy_buy_low_budget_set', strategy)
        : sendEvent('strategy', 'strategy_sell_high_budget_set', strategy);
    }
    firstTimeRender.current.budget = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy, order.budget]);
};
