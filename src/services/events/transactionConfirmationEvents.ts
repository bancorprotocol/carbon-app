import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './googleTagManager/types';
import {
  TokenApprovalType,
  StrategyEventOrTradeEvent,
  StrategyEventType,
  TradeEventType,
  TransactionConfirmationType,
} from './types';

export interface EventTransactionConfirmationSchema extends EventCategory {
  transactionConfirmationRequest: {
    input: StrategyEventOrTradeEvent &
      TokenApprovalType &
      TransactionConfirmationType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
  transactionConfirm: {
    input: StrategyEventOrTradeEvent &
      TokenApprovalType &
      TransactionConfirmationType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
}

export const transactionConfirmationEvents: CarbonEvents['transactionConfirmation'] =
  {
    transactionConfirmationRequest: (data) => {
      const transactionConfirmData = prepareTransactionConfirmationData(data);
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest',
        transactionConfirmData
      );
    },
    transactionConfirm: (data) => {
      const transactionConfirmData = prepareTransactionConfirmationData(data);
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirm',
        transactionConfirmData
      );
    },
  };

export const prepareTransactionConfirmationData = (
  data: StrategyEventOrTradeEvent &
    TokenApprovalType &
    TransactionConfirmationType
): (TradeGTMEventType | StrategyGTMEventType) & ConfirmationGTMEventType => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens.map(({ symbol }) => symbol),
    blockchain_network: data?.blockchainNetwork,
  };
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
    } = data as StrategyEventType;

    const gtmStrategyData = {
      token_pair: `${baseToken?.symbol}/${quoteToken?.symbol}`,
      strategy_base_token: baseToken?.symbol,
      strategy_quote_token: quoteToken?.symbol,
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
    } as StrategyGTMEventType;

    return {
      ...gtmConfirmationData,
      ...gtmStrategyData,
    };
  } else {
    const { buy, buyToken, sellToken, valueUsd } = data as TradeEventType;
    const gtmTradeData = {
      trade_direction: buy ? 'buy' : 'sell',
      token_pair: `${buyToken.symbol}/${sellToken.symbol}`,
      buy_token: buyToken.symbol,
      sell_token: sellToken.symbol,
      value_usd: valueUsd,
    } as TradeGTMEventType;

    return {
      ...gtmConfirmationData,
      ...gtmTradeData,
    };
  }
};
