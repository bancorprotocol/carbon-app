import { sendGTMEvent } from '.';
import { CarbonEvents, EventCategory } from './types';

export interface EventNavigationSchemaNew extends EventCategory {
  navHomeClick: {
    input: undefined;
    gtmData: undefined;
  };
  navStrategyClick: {
    input: undefined;
    gtmData: undefined;
  };
  navTradeClick: {
    input: undefined;
    gtmData: undefined;
  };
  navNotificationClick: {
    input: undefined;
    gtmData: undefined;
  };
  navWalletConnectClick: {
    input: undefined;
    gtmData: undefined;
  };
  navWalletClick: {
    input: undefined;
    gtmData: undefined;
  };
}

export const navigationEvents: CarbonEvents['navigation'] = {
  navHomeClick: () => {
    sendGTMEvent('navigation', 'navHomeClick', undefined);
  },
  navStrategyClick: () => {
    sendGTMEvent('navigation', 'navStrategyClick', undefined);
  },
  navTradeClick: () => {
    sendGTMEvent('navigation', 'navTradeClick', undefined);
  },
  navNotificationClick: () => {
    sendGTMEvent('navigation', 'navNotificationClick', undefined);
  },
  navWalletConnectClick: () => {
    sendGTMEvent('navigation', 'navWalletConnectClick', undefined);
  },
  navWalletClick: () => {
    sendGTMEvent('navigation', 'navWalletClick', undefined);
  },
};
