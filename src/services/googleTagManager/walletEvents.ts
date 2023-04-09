import { sendEvent } from '.';
import { CarbonEvents, EventCategory } from './types';

export interface EventWalletSchemaNew extends EventCategory {
  walletConnectPopupView: {
    input: undefined;
    gtmData: undefined;
  };
  walletConnect: {
    input: { address: string | undefined; name: string; tos: boolean };
    gtmData: {
      wallet_id: string | undefined;
      wallet_name: string;
      tos_approve: boolean;
    };
  };
  walletDisconnect: {
    input: { address: string | undefined };
    gtmData: { wallet_id: string | undefined };
  };
}

export const walletEvents: CarbonEvents['wallet'] = {
  walletConnect: ({ name, tos, address }) => {
    sendEvent('wallet', 'walletConnect', {
      wallet_name: name,
      wallet_id: address,
      tos_approve: tos,
    });
  },
  walletConnectPopupView: () => {
    sendEvent('wallet', 'walletConnectPopupView', undefined);
  },
  walletDisconnect: ({ address }) => {
    sendEvent('wallet', 'walletDisconnect', {
      wallet_id: address,
    });
  },
};
