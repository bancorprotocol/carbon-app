import { GTMData } from './types';

declare global {
  interface Window {
    dataLayer: GTMData[];
  }
}

const sendGTM = (data: GTMData) => {
  if (window.dataLayer) {
    window.dataLayer.push({ ...data });
  }
  console.log(window.dataLayer, '-=-=-=-=-=- window.dataLayer -=-=-=-=-=-');
};

type EventGeneralSchema = {
  change_page: {
    page_spa_referral: string | null;
  };
};

type EventStrategySchema = {
  new_strategy_create_click: undefined;
  new_strategy_base_token_select: { token: string };
  new_strategy_quote_token_select: { token: string };
  strategy_base_token_change: { token: string };
  strategy_quote_token_change: { token: string };
  strategy_token_swap: { tokenPair: string; tokenPairFrom: string };
  strategy_chart_open: undefined;
  strategy_chart_close: undefined;
  strategy_buy_low_order_type_change: StrategyType;
  strategy_buy_low_price_set: StrategyType;
  strategy_buy_low_budget_set: StrategyType;
  strategy_sell_high_order_type_change: StrategyType;
  strategy_sell_high_price_set: StrategyType;
  strategy_sell_high_budget_set: StrategyType;
  strategy_create_click: StrategyType;
  strategy_create: StrategyType;
};

export type StrategyType = {
  strategy_base_token?: string;
  strategy_quote_token?: string;

  strategy_buy_low_token?: string;
  strategy_buy_low_token_price?: string;
  strategy_buy_low_token_min_price?: string;
  strategy_buy_low_token_max_price?: string;
  strategy_buy_low_pay_token?: string;
  strategy_buy_low_order_type?: 'limit' | 'range';
  strategy_buy_low_budget?: string;
  strategy_buy_low_budget_usd?: string;
  strategy_sell_high_token?: string;
  strategy_sell_high_token_price?: string;
  strategy_sell_high_token_min_price?: string;
  strategy_sell_high_token_max_price?: string;
  strategy_sell_high_receive_token?: string;
  strategy_sell_high_order_type?: 'limit' | 'range';
  strategy_sell_high_budget?: string;
  strategy_sell_high_budget_usd?: string;
};

type EventNavigationSchema = {
  nav_home_click: undefined;
  nav_strategy_click: undefined;
  nav_trade_click: undefined;
  nav_notification_click: undefined;
  nav_wallet_connect_click: undefined;
  nav_wallet_click: undefined;
};

type EventWalletSchema = {
  wallet_connect_popup_view?: undefined;
  wallet_connect: { wallet_name: string; tos_approve: boolean };
  wallet_disconnect: { wallet_name: string };
};

type EventSchema = {
  general: EventGeneralSchema;
  strategy: EventStrategySchema;
  navigation: EventNavigationSchema;
  wallet: EventWalletSchema;
};

type SendEventFn = <
  T extends Extract<keyof EventSchema, string>,
  D extends Extract<keyof EventSchema[T], string>
>(
  type: T,
  event: D,
  data: EventSchema[T][D]
) => void;

export const sendEvent: SendEventFn = (type, event, data) => {
  switch (type) {
    case 'general': {
      return sendGTM({
        event: `PV`,
        event_properties: {},
        page: data ? data : {},
        wallet: {},
      });
    }
    case 'navigation': {
      return sendGTM({
        event: `CE ${event}`,
        event_properties: data ? data : {},
        wallet: {},
      });
    }
    case 'wallet': {
      return sendGTM({
        event: `CE ${event}`,
        event_properties: {},
        wallet: data ? data : {},
      });
    }
    default:
      return sendGTM({
        event: `CE ${event}`,
        event_properties: data ? data : {},
        wallet: {},
      });
  }
};
