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

export const sendEvent = ({
  event,
  event_properties,
}: {
  event: string;
  event_properties?: {
    token?: string;
  };
}) => {
  sendGTM({
    event,
    event_properties: event_properties ? event_properties : {},
    page: {},
    wallet: {},
  });
};
