import { sendEvent } from '.';
import { CarbonEvents, EventCategory } from './types';

export interface EventWalletSchemaNew extends EventCategory {
  walletConnectPopupView: {
    input: undefined;
    gtmData: undefined;
  };
  walletConnect: {
    input: { address: string | undefined; name: string };
    gtmData: {
      wallet_id: string | undefined;
      wallet_name: string;
    };
  };
  walletDisconnect: {
    input: { address: string | undefined };
    gtmData: { wallet_id: string | undefined };
  };
}

export const walletEvents: CarbonEvents['wallet'] = {
  walletConnect: ({ name, address }) => {
    sendEvent('wallet', 'walletConnect', {
      wallet_name: name,
      wallet_id: address,
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
