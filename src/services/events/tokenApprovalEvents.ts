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
  tokenConfirmationViewStrategyCreate: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationViewDepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationViewTrade: {
    input: TradeEventType & TokenApprovalType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChangeStrategyCreate: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChangeDepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChangeTrade: {
    input: TradeEventType & TokenApprovalType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApproveStrategyCreate: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApproveDepositStrategyFunds: {
    input: StrategyEventType & TokenApprovalType;
    gtmData: StrategyGTMEventType & ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApproveTrade: {
    input: TradeEventType & TokenApprovalType;
    gtmData: TradeGTMEventType & ConfirmationGTMEventType;
  };
}

export const tokenApprovalEvents: CarbonEvents['tokenApproval'] = {
  tokenConfirmationViewStrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_create'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationView' as 'tokenConfirmationViewStrategyCreate',
      tokenApprovalData
    );
  },
  tokenConfirmationViewDepositStrategyFunds: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_deposit'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationView' as 'tokenConfirmationViewDepositStrategyFunds',
      tokenApprovalData
    );
  },
  tokenConfirmationViewTrade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data, 'trade');
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationView' as 'tokenConfirmationViewTrade',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChangeStrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_create'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange' as 'tokenConfirmationUnlimitedSwitchChangeStrategyCreate',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChangeDepositStrategyFunds: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_deposit'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange' as 'tokenConfirmationUnlimitedSwitchChangeDepositStrategyFunds',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChangeTrade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data, 'trade');
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange' as 'tokenConfirmationUnlimitedSwitchChangeTrade',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApproveStrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_create'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove' as 'tokenConfirmationUnlimitedApproveStrategyCreate',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApproveDepositStrategyFunds: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(
      data,
      'strategy_deposit'
    );
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove' as 'tokenConfirmationUnlimitedApproveDepositStrategyFunds',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApproveTrade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data, 'trade');
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove' as 'tokenConfirmationUnlimitedApproveTrade',
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
