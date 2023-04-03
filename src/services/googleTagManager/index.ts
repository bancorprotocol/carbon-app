import { GTMData, SendEventFn } from './types';

declare global {
  interface Window {
    dataLayer: GTMData[];
  }
}

const sendGTM = (data: GTMData) => {
  if (window.dataLayer) {
    window.dataLayer.push({ ...data });
  }
};

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
