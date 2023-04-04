import { sendEvent } from '.';
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
    sendEvent('navigation', 'navHomeClick', undefined);
  },
  navStrategyClick: () => {
    sendEvent('navigation', 'navStrategyClick', undefined);
  },
  navTradeClick: () => {
    sendEvent('navigation', 'navTradeClick', undefined);
  },
  navNotificationClick: () => {
    sendEvent('navigation', 'navNotificationClick', undefined);
  },
  navWalletConnectClick: () => {
    sendEvent('navigation', 'navWalletConnectClick', undefined);
  },
  navWalletClick: () => {
    sendEvent('navigation', 'navWalletClick', undefined);
  },
};
