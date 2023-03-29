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
