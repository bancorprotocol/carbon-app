import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './googleTagManager/types';
import { TokenApprovalType, StrategyEventType, TradeEventType } from './types';

export interface EventTokenApprovalSchema extends EventCategory {
  tokenConfirmationView_StrategyCreate: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationView_DepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationView_Trade: {
    input: TradeEventType & TokenApprovalType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChange_StrategyCreate: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChange_DepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChange_Trade: {
    input: TradeEventType & TokenApprovalType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApprove_StrategyCreate: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApprove_DepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApprove_Trade: {
    input: TradeEventType & TokenApprovalType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
}

export const tokenApprovalEvents: CarbonEvents['tokenApproval'] = {
  tokenConfirmationView_StrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_create'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationView_StrategyCreate',
      tokenApprovalData
    );
  },
  tokenConfirmationView_DepositStrategyFunds: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_deposit'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationView_DepositStrategyFunds',
      tokenApprovalData
    );
  },
  tokenConfirmationView_Trade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data, 'trade');
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationView_Trade',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChange_StrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_create'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange_StrategyCreate',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChange_DepositStrategyFunds: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_deposit'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange_DepositStrategyFunds',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChange_Trade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data, 'trade');
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange_Trade',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApprove_StrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_create'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove_StrategyCreate',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApprove_DepositStrategyFunds: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_deposit'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove_DepositStrategyFunds',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApprove_Trade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data, 'trade');
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove_Trade',
      tokenApprovalData
    );
  },
};

export const prepareTokenApprovalStrategyGTMData = (
  data: StrategyEventType & TokenApprovalType,
  context: 'strategy_create' | 'strategy_deposit' | 'trade'
): StrategyGTMEventType & ConfirmationGTMEventType => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens?.map(({ symbol }) => symbol),
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
    ...gtmStrategyData,
    ...gtmConfirmationData,
  };
};

export const prepareTokenApprovalTradeGTMData = (
  data: TradeEventType & TokenApprovalType,
  context: 'strategy_create' | 'strategy_deposit' | 'trade'
): TradeGTMEventType & ConfirmationGTMEventType => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens?.map(({ symbol }) => symbol),
    context,
  };

  const { buy, buyToken, sellToken, valueUsd } = data as TradeEventType;
  const gtmTradeData = {
    trade_direction: buy ? 'buy' : 'sell',
    token_pair: `${buyToken.symbol}/${sellToken.symbol}`,
    buy_token: buyToken.symbol,
    sell_token: sellToken.symbol,
    value_usd: valueUsd,
  };
  return {
    ...gtmTradeData,
    ...gtmConfirmationData,
  };
};
