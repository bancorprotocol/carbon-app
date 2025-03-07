import { sendGTMEvent } from './googleTagManager';
import { CarbonEventsInput } from './googleTagManager/types';

interface Props {
  walletConnect: { address: string | undefined; name: string };
}

export const walletEvents: CarbonEventsInput<Props> = {
  walletConnect: ({ name, address }) => {
    sendGTMEvent('wallet', 'walletConnect', {
      wallet_name: name,
      wallet_id: address,
    });
  },
};
