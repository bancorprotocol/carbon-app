import { sendEvent } from '.';
import { CarbonEvents } from './types';

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
