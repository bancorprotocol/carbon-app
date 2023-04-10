import { sendEvent } from '.';
import { CarbonEvents, EventCategory, TradeType } from './types';

export interface EventTradeSchemaNew extends EventCategory {
  tradeWarningShow: {
    input: { message: string };
    gtmData: { message: string };
  };
  tradeErrorShow: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradePairSwap: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradePairChangeClick: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradePairChange: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeSettingsClick: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeSettingsSlippageToleranceChange: {
    input: { tolerance: string };
    gtmData: { trade_settings_slippage_tolerance: string };
  };
  tradeSettingsTransactionExpirationTimeChange: {
    input: { expirationTime: string };
    gtmData: { trade_settings_transaction_expiration_time: string };
  };
  tradeSettingsMaximumOrdersChange: {
    input: { maxOrders: string };
    gtmData: { trade_settings_maximum_orders: string };
  };
  tradeSettingsResetAllClick: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeBuyPaySet: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeSellPaySet: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeBuyReceiveSet: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeSellReceiveSet: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeBuyClick: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeSellClick: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeBuy: {
    input: TradeType;
    gtmData: TradeType;
  };
  tradeSell: {
    input: TradeType;
    gtmData: TradeType;
  };
}

export const tradeEvents: CarbonEvents['trade'] = {
  tradeWarningShow: (data) => {
    sendEvent('trade', 'tradeWarningShow', data);
  },
  tradeErrorShow: (data) => {
    sendEvent('trade', 'tradeErrorShow', data);
  },
  tradePairSwap: (data) => {
    sendEvent('trade', 'tradePairSwap', data);
  },
  tradePairChangeClick: (data) => {
    sendEvent('trade', 'tradePairChangeClick', data);
  },
  tradePairChange: (data) => {
    sendEvent('trade', 'tradePairChange', data);
  },
  tradeSettingsClick: (data) => {
    sendEvent('trade', 'tradeSettingsClick', data);
  },
  tradeSettingsSlippageToleranceChange: ({ tolerance }) => {
    sendEvent('trade', 'tradeSettingsSlippageToleranceChange', {
      trade_settings_slippage_tolerance: tolerance,
    });
  },
  tradeSettingsTransactionExpirationTimeChange: ({ expirationTime }) => {
    sendEvent('trade', 'tradeSettingsTransactionExpirationTimeChange', {
      trade_settings_transaction_expiration_time: expirationTime,
    });
  },
  tradeSettingsMaximumOrdersChange: ({ maxOrders }) => {
    sendEvent('trade', 'tradeSettingsMaximumOrdersChange', {
      trade_settings_maximum_orders: maxOrders,
    });
  },
  tradeSettingsResetAllClick: (data) => {
    sendEvent('trade', 'tradeSettingsResetAllClick', data);
  },
  tradeBuyPaySet: (data) => {
    sendEvent('trade', 'tradeBuyPaySet', data);
  },
  tradeSellPaySet: (data) => {
    sendEvent('trade', 'tradeSellPaySet', data);
  },
  tradeBuyReceiveSet: (data) => {
    sendEvent('trade', 'tradeBuyReceiveSet', data);
  },
  tradeSellReceiveSet: (data) => {
    sendEvent('trade', 'tradeSellReceiveSet', data);
  },
  tradeBuyClick: (data) => {
    sendEvent('trade', 'tradeBuyClick', data);
  },
  tradeSellClick: (data) => {
    sendEvent('trade', 'tradeSellClick', data);
  },
  tradeBuy: (data) => {
    sendEvent('trade', 'tradeBuy', data);
  },
  tradeSell: (data) => {
    sendEvent('trade', 'tradeSell', data);
  },
};
