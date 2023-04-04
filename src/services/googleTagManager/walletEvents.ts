import { sendEvent } from '.';
import { CarbonEvents, EventCategory } from './types';

export interface EventWalletSchemaNew extends EventCategory {
  walletConnectPopupView: {
    input: undefined;
    gtmData: undefined;
  };
  walletConnect: {
    input: { name: string; tos: boolean };
    gtmData: { wallet_name: string; tos_approve: boolean };
  };
  walletDisconnect: {
    input: { name: string };
    gtmData: { wallet_name: string };
  };
}

export const walletEvents: CarbonEvents['wallet'] = {
  walletConnect: ({ name, tos }) => {
    sendEvent('wallet', 'walletConnect', {
      wallet_name: name,
      tos_approve: tos,
    });
  },
  walletConnectPopupView: () => {
    sendEvent('wallet', 'walletConnectPopupView', undefined);
  },
  walletDisconnect: ({ name }) => {
    sendEvent('wallet', 'walletDisconnect', { wallet_name: name });
  },
};
