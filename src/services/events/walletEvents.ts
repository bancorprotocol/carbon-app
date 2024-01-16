import { sendGTMEvent } from './googleTagManager';
import { CarbonEvents, EventCategory } from './googleTagManager/types';

export interface EventWalletSchema extends EventCategory {
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
  walletConnected: {
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
  walletDisconnected: {
    input: undefined;
    gtmData: undefined;
  };
}

export const walletEvents: CarbonEvents['wallet'] = {
  walletConnect: ({ name, address }) => {
    sendGTMEvent('wallet', 'walletConnect', {
      wallet_name: name,
      wallet_id: address,
    });
  },
  walletConnected: ({ name, address }) => {
    sendGTMEvent('wallet', 'walletConnected', {
      wallet_name: name,
      wallet_id: address,
    });
  },
  walletConnectPopupView: () => {
    sendGTMEvent('wallet', 'walletConnectPopupView', undefined);
  },
  walletDisconnect: ({ address }) => {
    sendGTMEvent('wallet', 'walletDisconnect', {
      wallet_id: address,
    });
  },
  walletDisconnected: () => {
    sendGTMEvent('wallet', 'walletDisconnected', undefined);
  },
};
