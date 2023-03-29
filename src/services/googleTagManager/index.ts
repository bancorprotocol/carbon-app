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

export const sendGTMPath = (to: string, from: string) => {
  sendGTM({
    event: `PV ${to}`,
    event_properties: {
      page_spa_referral: from,
    },
    wallet: {},
  });
};

type EventGeneralSchema = {
  change_page: {
    from: string;
    to: string;
  };
};

type EventStrategySchema = {
  new_strategy_create_click: undefined;
  new_strategy_base_token_select: { token: string };
  new_strategy_quote_token_select: { token: string };
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

type EventSchema = {
  general: EventGeneralSchema;
  strategy: EventStrategySchema;
  navigation: EventNavigationSchema;
};

type SendEventFn = <
  T extends Extract<keyof EventSchema, string>,
  D extends Extract<keyof EventSchema[T], string>
>(
  type: T,
  event: D,
  data: EventSchema[T][D] | any
) => void;
// TODO: Fix any
export const sendEvent: SendEventFn = (type, event, data) => {
  switch (type) {
    case 'general': {
      return sendGTM({
        event: `PV ${data.to}`,
        event_properties: {
          page_spa_referral: data.from,
        },
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
    default:
      return sendGTM({
        event: `CE ${event}`,
        event_properties: data ? data : {},
        wallet: {},
      });
  }
};
