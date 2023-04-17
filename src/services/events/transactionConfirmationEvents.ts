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
  StrategyEventType,
  TradeEventType,
  TransactionConfirmationType,
} from './types';

export interface EventTransactionConfirmationSchema extends EventCategory {
  txConfirmationRequestStrategyCreate: {
    input: StrategyEventType & TokenApprovalType & TransactionConfirmationType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  txConfirmationRequestDepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType & TransactionConfirmationType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  txConfirmationRequestTrade: {
    input: TradeEventType & TokenApprovalType & TransactionConfirmationType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
  txConfirmationStrategyCreate: {
    input: StrategyEventType & TokenApprovalType & TransactionConfirmationType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  txConfirmationDepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType & TransactionConfirmationType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  txConfirmationTrade: {
    input: TradeEventType & TokenApprovalType & TransactionConfirmationType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
}

export const transactionConfirmationEvents: CarbonEvents['transactionConfirmation'] =
  {
    txConfirmationRequestStrategyCreate: (data) => {
      const transactionConfirmData = prepareTxConfirmationStrategyGTMData(
        data,
        'strategy_create'
      );
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest' as 'txConfirmationRequestStrategyCreate',
        transactionConfirmData
      );
    },
    txConfirmationRequestDepositStrategyFunds: (data) => {
      const transactionConfirmData = prepareTxConfirmationStrategyGTMData(
        data,
        'strategy_deposit'
      );
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest' as 'txConfirmationRequestStrategyCreate',
        transactionConfirmData
      );
    },
    txConfirmationRequestTrade: (data) => {
      const transactionConfirmData = prepareTxConfirmationTradeGTMData(
        data,
        'trade'
      );
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest' as 'txConfirmationRequestTrade',
        transactionConfirmData
      );
    },
    txConfirmationStrategyCreate: (data) => {
      const transactionConfirmData = prepareTxConfirmationStrategyGTMData(
        data,
        'strategy_create'
      );
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmation' as 'txConfirmationStrategyCreate',
        transactionConfirmData
      );
    },
    txConfirmationDepositStrategyFunds: (data) => {
      const transactionConfirmData = prepareTxConfirmationStrategyGTMData(
        data,
        'strategy_deposit'
      );
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmation' as 'txConfirmationDepositStrategyFunds',
        transactionConfirmData
      );
    },
    txConfirmationTrade: (data) => {
      const transactionConfirmData = prepareTxConfirmationTradeGTMData(
        data,
        'trade'
      );
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmation' as 'txConfirmationTrade',
        transactionConfirmData
      );
    },
  };

export const prepareTxConfirmationStrategyGTMData = (
  data: StrategyEventType & TokenApprovalType & TransactionConfirmationType,
  context: 'strategy_create' | 'strategy_deposit' | 'trade'
): StrategyGTMEventType & ConfirmationGTMEventType => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens.map(({ symbol }) => symbol),
    blockchain_network: data?.blockchainNetwork,
    context,
  };
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
};

export const prepareTxConfirmationTradeGTMData = (
  data: TradeEventType & TokenApprovalType & TransactionConfirmationType,
  context: 'strategy_create' | 'strategy_deposit' | 'trade'
): TradeGTMEventType & ConfirmationGTMEventType => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens.map(({ symbol }) => symbol),
    blockchain_network: data?.blockchainNetwork,
    context,
  };

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
};
