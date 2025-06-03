import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAIN_ID, IS_TENDERLY_FORK } from 'libs/wagmi/wagmi.constants';
import {
  useConnect,
  useDisconnect,
  Config,
  useConnectorClient,
  useAccount,
  useAccountEffect,
  type Connector,
} from 'wagmi';
import { type ConnectErrorType, type DisconnectErrorType } from '@wagmi/core';
import { isAccountBlocked } from 'utils/restrictedAccounts';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { errorMessages } from './wagmi.utils';
import { clientToSigner } from './ethers';
import { getUncheckedSigner } from 'utils/tenderly';
import { carbonEvents } from 'services/events';
import { redirectSafeWallet } from './connectors';

type Props = {
  imposterAccount?: string;
  setImposterAccount: (account?: string) => void;
};

export const useWagmiUser = ({
  imposterAccount,
  setImposterAccount,
}: Props) => {
  const { address: walletAccount, chainId: accountChainId } = useAccount();

  const { isCountryBlocked } = useStore();
  const [isUncheckedSigner, _setIsUncheckedSigner] = useState(
    lsService.getItem('isUncheckedSigner') || false,
  );
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const setIsUncheckedSigner = (value: boolean) => {
    _setIsUncheckedSigner(value);
    lsService.setItem('isUncheckedSigner', value);
  };

  const user = imposterAccount || walletAccount;

  const chainId = CHAIN_ID;

  const isSupportedNetwork = !accountChainId || accountChainId === chainId;

  const isUserBlocked = isAccountBlocked(user);

  const { connector: currentConnector } = useAccount();

  const { data: client } = useConnectorClient<Config>({ chainId });

  const signer = useMemo(() => {
    if (!IS_TENDERLY_FORK || !isUncheckedSigner) {
      return clientToSigner(client);
    } else {
      if (user) return getUncheckedSigner(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, IS_TENDERLY_FORK, user, isUncheckedSigner]);

  const isManualConnection = useRef(false);
  const oldUser = useRef(user);
  useEffect(() => {
    if (user !== oldUser.current && !!user) {
      // User changed current address
      oldUser.current = user;
    }
  }, [user, currentConnector?.name]);
  useAccountEffect({
    onConnect(data) {
      if (isManualConnection.current) {
        isManualConnection.current = false;
        carbonEvents.wallet.walletConnect({
          address: data.address,
          name: data.connector.name,
        });
      } else {
        carbonEvents.wallet.walletConnected({
          address: data.address,
          name: data.connector.name,
        });
        redirectSafeWallet(chainId, accountChainId);
      }
      if (window?.OneTrust) {
        window?.OneTrust?.AllowAll();
        window?.OneTrust?.Close();
      }
      oldUser.current = data.address;
    },
    onDisconnect() {
      if (isManualConnection.current) {
        carbonEvents.wallet.walletDisconnect({
          address: user,
        });
        isManualConnection.current = false;
      } else {
        carbonEvents.wallet.walletDisconnected(undefined);
      }
      oldUser.current = undefined;
    },
  });

  const connect = useCallback(
    /**
     * Asynchronously connects to the connector in the input
     * @param {Connector} connector  Connector to connect to
     */
    async (connector: Connector) => {
      if (isCountryBlocked || isCountryBlocked === null) {
        throw new Error('Your country is restricted from using this app.');
      }
      isManualConnection.current = true;
      try {
        await connectAsync(
          { connector, chainId },
          {
            onError: (error: ConnectErrorType) => {
              isManualConnection.current = false;
              console.error(`Error connecting ${connector.name}` + error);
            },
          },
        );
      } catch (error: any) {
        // Attempt to disconnect
        await disconnectAsync({ connector });
        const codeErrorMessage = error?.code ? errorMessages[error?.code] : '';
        throw new Error(codeErrorMessage || error.message);
      }
    },
    [isCountryBlocked, connectAsync, chainId, disconnectAsync],
  );

  const disconnect = useCallback(
    /**
     * Asynchronously disconnects from the last connected connector
     */
    async () => {
      isManualConnection.current = true;
      try {
        await disconnectAsync(
          {},
          {
            onError: (error: DisconnectErrorType) => {
              isManualConnection.current = false;
              console.error(`Error disconnecting` + error);
            },
            onSettled: () => {
              setImposterAccount();
            },
          },
        );
      } catch (error: any) {
        const codeErrorMessage = error?.code ? errorMessages[error?.code] : '';
        throw new Error(codeErrorMessage || error.message);
      }
    },
    [disconnectAsync, setImposterAccount],
  );

  return {
    user,
    signer,
    currentConnector,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
    isSupportedNetwork,
    accountChainId,
  };
};
