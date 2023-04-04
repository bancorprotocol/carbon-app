import { GTMData, SendEventFn } from './types';

declare global {
  interface Window {
    dataLayer: GTMData[];
  }
}

const sendGTM = (data: GTMData) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
  }
};

export const sendEvent: SendEventFn = (type, event, data) => {
  const newData = data ? data : {};

  switch (type) {
    case 'general': {
      return sendGTM({
        event: `PV`,
        event_properties: {},
        page: newData,
        wallet: {},
      });
    }
    case 'wallet': {
      return sendGTM({
        event: `CE ${event}`,
        event_properties: {},
        wallet: newData,
      });
    }
    default:
      return sendGTM({
        event: `CE ${event}`,
        event_properties: newData,
        wallet: {},
      });
  }
};
