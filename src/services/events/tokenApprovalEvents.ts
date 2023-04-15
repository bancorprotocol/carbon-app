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
  tokenConfirmationViewStrategyEdit: {
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
  tokenConfirmationUnlimitedSwitchChangeStrategyEdit: {
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
  tokenConfirmationUnlimitedApproveStrategyEdit: {
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
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(data);
    sendGTMEvent('tokenApproval', 'tokenConfirmationView', tokenApprovalData);
  },
  tokenConfirmationViewStrategyEdit: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(data);
    sendGTMEvent('tokenApproval', 'tokenConfirmationView', tokenApprovalData);
  },
  tokenConfirmationViewTrade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data);
    sendGTMEvent('tokenApproval', 'tokenConfirmationView', tokenApprovalData);
  },
  tokenConfirmationUnlimitedSwitchChangeStrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(data);
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChangeStrategyEdit: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(data);
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedSwitchChangeTrade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data);
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedSwitchChange',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApproveStrategyCreate: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(data);
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApproveStrategyEdit: (data) => {
    const tokenApprovalData = prepareTokenApprovalStrategyGTMData(data);
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove',
      tokenApprovalData
    );
  },
  tokenConfirmationUnlimitedApproveTrade: (data) => {
    const tokenApprovalData = prepareTokenApprovalTradeGTMData(data);
    sendGTMEvent(
      'tokenApproval',
      'tokenConfirmationUnlimitedApprove',
      tokenApprovalData
    );
  },
};

export const prepareTokenApprovalStrategyGTMData = (
  data: StrategyEventType & TokenApprovalType
) => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens?.map(({ symbol }) => symbol),
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
  data: TradeEventType & TokenApprovalType
) => {
  const gtmConfirmationData = {
    product_type: data?.productType,
    switch: data?.isLimited ? 'false' : 'true',
    token: data?.approvalTokens?.map(({ symbol }) => symbol),
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
