import { sendGTMEvent } from '.';
import { CarbonEvents, EventCategory, TradeGTMEventType } from './types';

export interface EventTradeSchemaNew extends EventCategory {
  tradeWarningShow: {
    input: { message: string };
    gtmData: { message: string };
  };
  tradeErrorShow: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradePairSwap: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradePairChangeClick: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradePairChange: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSettingsClick: {
    input: TradeGTMEventType;
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
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuyPaySet: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSellPaySet: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuyReceiveSet: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSellReceiveSet: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuyClick: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSellClick: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeBuy: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
  tradeSell: {
    input: TradeGTMEventType;
    gtmData: TradeGTMEventType;
  };
}

export const tradeEvents: CarbonEvents['trade'] = {
  tradeWarningShow: (data) => {
    sendGTMEvent('trade', 'tradeWarningShow', data);
  },
  tradeErrorShow: (data) => {
    sendGTMEvent('trade', 'tradeErrorShow', data);
  },
  tradePairSwap: (data) => {
    sendGTMEvent('trade', 'tradePairSwap', data);
  },
  tradePairChangeClick: (data) => {
    sendGTMEvent('trade', 'tradePairChangeClick', data);
  },
  tradePairChange: (data) => {
    sendGTMEvent('trade', 'tradePairChange', data);
  },
  tradeSettingsClick: (data) => {
    sendGTMEvent('trade', 'tradeSettingsClick', data);
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
  tradeSettingsResetAllClick: (data) => {
    sendGTMEvent('trade', 'tradeSettingsResetAllClick', data);
  },
  tradeBuyPaySet: (data) => {
    sendGTMEvent('trade', 'tradeBuyPaySet', data);
  },
  tradeSellPaySet: (data) => {
    sendGTMEvent('trade', 'tradeSellPaySet', data);
  },
  tradeBuyReceiveSet: (data) => {
    sendGTMEvent('trade', 'tradeBuyReceiveSet', data);
  },
  tradeSellReceiveSet: (data) => {
    sendGTMEvent('trade', 'tradeSellReceiveSet', data);
  },
  tradeBuyClick: (data) => {
    sendGTMEvent('trade', 'tradeBuyClick', data);
  },
  tradeSellClick: (data) => {
    sendGTMEvent('trade', 'tradeSellClick', data);
  },
  tradeBuy: (data) => {
    sendGTMEvent('trade', 'tradeBuy', data);
  },
  tradeSell: (data) => {
    sendGTMEvent('trade', 'tradeSell', data);
  },
};
