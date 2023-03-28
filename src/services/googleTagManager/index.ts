import {
  GTMData,
  Navigation,
  routeMapping,
  Strategy,
  StrategyActions,
  WalletConnect,
} from './types';

declare global {
  interface Window {
    dataLayer: GTMData[];
  }
}

export const Events = {
  Navigation,
  WalletConnect,
  Strategy,
  StrategyActions,
};

const sendGTM = (data: GTMData) => {
  if (window.dataLayer) {
    window.dataLayer.push({ ...data });
  }
};

export const sendGTMPath = (to: string) => {
  sendGTM({
    event: `PV ${to}`,
    page: {
      page_spa_referral: to,
      page_group: routeMapping?.[to],
    },
    wallet: {},
  });
};

type EventStrategySchema = {
  new_strategy_create_click: undefined;
  new_strategy_base_token_select: { token: string };
};

type EventSchema = {
  strategy: EventStrategySchema;
};

type SendEventFn = (
  eventKey: `${keyof EventSchema}.${keyof EventSchema[keyof EventSchema]}`,
  eventProperties?: EventStrategySchema[keyof EventStrategySchema]
) => void;

export const sendEvent = (event: any, event_properties?: any) => {
  sendGTM({
    event,
    event_properties: event_properties ? event_properties : {},
    page: {},
    wallet: {},
  });
};
