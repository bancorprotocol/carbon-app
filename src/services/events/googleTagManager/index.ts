import { GTMData, SendEventFn } from './types';
import { convertCase } from 'utils/helpers';

declare global {
  interface Window {
    dataLayer: GTMData[];
    OneTrust: any;
  }
}

const sendGTM = (data: GTMData) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
  }
};

export const sendGTMEvent: SendEventFn = (type, event, data) => {
  const snakeCaseEvent = convertCase(event, true);
  const dataObj = data ? data : {};

  switch (type) {
    case 'general': {
      return sendGTM({
        event: 'PV',
        user_properties: {},
        event_properties: {},
        page: dataObj,
        wallet: {},
      });
    }
    case 'wallet': {
      return sendGTM({
        event: `CE ${snakeCaseEvent}`,
        user_properties: dataObj,
        event_properties: {},
        wallet: dataObj,
      });
    }
    default:
      return sendGTM({
        event: `CE ${snakeCaseEvent}`,
        event_properties: dataObj,
        user_properties: {},
        wallet: {},
      });
  }
};
