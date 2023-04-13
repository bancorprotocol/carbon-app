import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './googleTagManager/types';
import {
  ConfirmationEventType,
  StrategyEventOrTradeEvent,
  StrategyEventType,
  TradeEventType,
} from './types';

export interface EventTransactionConfirmationSchema extends EventCategory {
  transactionConfirmationRequest: {
    input: StrategyEventOrTradeEvent & ConfirmationEventType;
    gtmData: ConfirmationGTMEventType;
  };
  transactionConfirm: {
    input: StrategyEventOrTradeEvent & ConfirmationEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
}

export const transactionConfirmationEvents: CarbonEvents['transactionConfirmation'] =
  {
    transactionConfirmationRequest: (data) => {
      const transactionConfirmData = prepareConfirmationData(data);
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest',
        transactionConfirmData
      );
    },
    transactionConfirm: (data) => {
      const transactionConfirmData = prepareConfirmationData(data);
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirm',
        transactionConfirmData
      );
    },
  };

export const prepareConfirmationData = (
  data: StrategyEventOrTradeEvent & ConfirmationEventType
) => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.token,
  };
  let gtmData = {};
  if (data.productType === 'strategy') {
    const {
      baseToken,
      quoteToken,
      buyTokenPrice,
      buyTokenPriceMin,
      buyTokenPriceMax,
      buyOrderType,
      buyBudget,
      buyBudgetUsd,
      sellTokenPrice,
      sellTokenPriceMin,
      sellTokenPriceMax,
      sellOrderType,
      sellBudget,
      sellBudgetUsd,
      strategyType,
      strategyDirection,
      strategySettings,
    } = data as StrategyEventType;

    gtmData = {
      token_pair: `${baseToken}/${quoteToken}`,
      strategy_base_token: baseToken,
      strategy_quote_token: quoteToken,
      strategy_buy_low_token_price: buyTokenPrice,
      strategy_buy_low_token_min_price: buyTokenPriceMin,
      strategy_buy_low_token_max_price: buyTokenPriceMax,
      strategy_buy_low_order_type: buyOrderType,
      strategy_buy_low_budget: buyBudget,
      strategy_buy_low_budget_usd: buyBudgetUsd,
      strategy_sell_high_token_price: sellTokenPrice,
      strategy_sell_high_token_min_price: sellTokenPriceMin,
      strategy_sell_high_token_max_price: sellTokenPriceMax,
      strategy_sell_high_order_type: sellOrderType,
      strategy_sell_high_budget: sellBudget,
      strategy_sell_high_budget_usd: sellBudgetUsd,
      strategy_type: strategyType,
      strategy_direction: strategyDirection,
      strategy_settings: strategySettings,
    };
  } else {
    const { tradeDirection, buyToken, sellToken, valueUsd, blockchainNetwork } =
      data as TradeEventType;
    gtmData = {
      trade_direction: tradeDirection,
      token_pair: `${buyToken}/${sellToken}`,
      buy_token: buyToken,
      sell_token: sellToken,
      value_usd: valueUsd,
      blockchain_network: blockchainNetwork,
    };
  }

  return {
    ...gtmData,
    ...gtmConfirmationData,
  };
};
