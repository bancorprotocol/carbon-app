import { carbonEvents } from '..';
import { GTMData } from './types';
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

type CarbonEvents = typeof carbonEvents;

export const sendGTMEvent = <
  T extends Extract<keyof CarbonEvents, string>,
  D extends Extract<keyof CarbonEvents[T], string>,
>(
  type: T,
  event: D,
  data: any,
) => {
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
      if (
        ['wallet_connected', 'wallet_disconnected'].includes(snakeCaseEvent)
      ) {
        return sendGTM({
          event: `${snakeCaseEvent}`,
          user_properties: dataObj,
          event_properties: {},
          wallet: dataObj,
        });
      } else {
        return sendGTM({
          event: `CE ${snakeCaseEvent}`,
          user_properties: dataObj,
          event_properties: {},
          wallet: dataObj,
        });
      }
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
