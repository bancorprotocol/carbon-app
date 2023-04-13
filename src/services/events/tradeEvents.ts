import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  EventCategory,
  TradeGTMEventType,
} from './googleTagManager/types';
import { TradeEventType } from './types';

export interface EventTradeSchema extends EventCategory {
  tradeWarningShow: {
    input: { message: string };
    gtmData: { message: string };
  };
  tradeErrorShow: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradePairSwap: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradePairChangeClick: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradePairChange: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSettingsClick: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSettingsSlippageToleranceChange: {
    input: { tolerance: string; base: string; quote: string };
    gtmData: { trade_settings_slippage_tolerance: string } & TradeGTMEventType;
  };
  tradeSettingsTransactionExpirationTimeChange: {
    input: { expirationTime: string; base: string; quote: string };
    gtmData: {
      trade_settings_transaction_expiration_time: string;
    } & TradeGTMEventType;
  };
  tradeSettingsMaximumOrdersChange: {
    input: { maxOrders: string; base: string; quote: string };
    gtmData: { trade_settings_maximum_orders: string } & TradeGTMEventType;
  };
  tradeSettingsResetAllClick: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuyPaySet: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSellPaySet: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuyReceiveSet: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSellReceiveSet: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuyClick: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSellClick: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuy: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSell: {
    input: TradeEventType;
    gtmData: TradeGTMEventType;
  };
}

export const tradeEvents: CarbonEvents['trade'] = {
  tradeWarningShow: (data) => {
    sendGTMEvent('trade', 'tradeWarningShow', data);
  },
  tradeErrorShow: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeErrorShow', {
      ...tradeData,
      message: data.message,
    });
  },
  tradePairSwap: ({ buyToken, sellToken }) => {
    sendGTMEvent('trade', 'tradePairSwap', {
      token_pair: `${buyToken}/${sellToken}`,
      buy_token: buyToken,
      sell_token: sellToken,
    });
  },
  tradePairChangeClick: ({ buyToken, sellToken }) => {
    sendGTMEvent('trade', 'tradePairChangeClick', {
      token_pair: `${buyToken}/${sellToken}`,
      buy_token: buyToken,
      sell_token: sellToken,
    });
  },
  tradePairChange: ({ buyToken, sellToken }) => {
    sendGTMEvent('trade', 'tradePairChange', {
      token_pair: `${buyToken}/${sellToken}`,
      buy_token: buyToken,
      sell_token: sellToken,
    });
  },
  tradeSettingsClick: ({ buyToken, sellToken }) => {
    sendGTMEvent('trade', 'tradeSettingsClick', {
      token_pair: `${buyToken}/${sellToken}`,
      buy_token: buyToken,
      sell_token: sellToken,
    });
  },
  tradeSettingsSlippageToleranceChange: ({ tolerance, base, quote }) => {
    sendGTMEvent('trade', 'tradeSettingsSlippageToleranceChange', {
      trade_settings_slippage_tolerance: tolerance,
      token_pair: `${base}/${quote}`,
      buy_token: base,
      sell_token: quote,
    });
  },
  tradeSettingsTransactionExpirationTimeChange: ({
    expirationTime,
    base,
    quote,
  }) => {
    sendGTMEvent('trade', 'tradeSettingsTransactionExpirationTimeChange', {
      trade_settings_transaction_expiration_time: expirationTime,
      token_pair: `${base}/${quote}`,
      buy_token: base,
      sell_token: quote,
    });
  },
  tradeSettingsMaximumOrdersChange: ({ maxOrders, base, quote }) => {
    sendGTMEvent('trade', 'tradeSettingsMaximumOrdersChange', {
      trade_settings_maximum_orders: maxOrders,
      token_pair: `${base}/${quote}`,
      buy_token: base,
      sell_token: quote,
    });
  },
  tradeSettingsResetAllClick: ({ buyToken, sellToken }) => {
    sendGTMEvent('trade', 'tradeSettingsResetAllClick', {
      token_pair: `${buyToken}/${sellToken}`,
      buy_token: buyToken,
      sell_token: sellToken,
    });
  },
  tradeBuyPaySet: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeBuyPaySet', tradeData);
  },
  tradeSellPaySet: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeSellPaySet', tradeData);
  },
  tradeBuyReceiveSet: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeBuyReceiveSet', tradeData);
  },
  tradeSellReceiveSet: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeSellReceiveSet', tradeData);
  },
  tradeBuyClick: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeBuyClick', tradeData);
  },
  tradeSellClick: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeSellClick', tradeData);
  },
  tradeBuy: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeBuy', {
      ...tradeData,
      transaction_hash: data.transactionHash,
      blockchain_network: data.blockchainNetwork,
    });
  },
  tradeSell: (data) => {
    const tradeData = prepareTradeEventData(data);
    sendGTMEvent('trade', 'tradeSell', {
      ...tradeData,
      transaction_hash: data.transactionHash,
      blockchain_network: data.blockchainNetwork,
    });
  },
};

const prepareTradeEventData = (data: TradeEventType): TradeGTMEventType => {
  const { tradeDirection, buyToken, sellToken, valueUsd } = data;
  return {
    trade_direction: tradeDirection,
    token_pair: `${buyToken}/${sellToken}`,
    buy_token: buyToken,
    sell_token: sellToken,
    value_usd: valueUsd,
  };
};
