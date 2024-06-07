import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IS_TENDERLY_FORK } from 'libs/wagmi/web3.constants';
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
import { getChainInfo } from './web3.utils';
import { clientToSigner } from './ethers';
import { getUncheckedSigner } from 'utils/tenderly';
import { carbonEvents } from 'services/events';

type Props = {
  imposterAccount: string;
  walletAccount?: string;
  handleImposterAccount: (account?: string) => void;
};

export const useWagmiUser = ({
  imposterAccount,
  walletAccount,
  handleImposterAccount,
}: Props) => {
  const { isCountryBlocked } = useStore();
  const [isUncheckedSigner, _setIsUncheckedSigner] = useState(
    lsService.getItem('isUncheckedSigner') || false
  );
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const setIsUncheckedSigner = useCallback(
    (value: boolean) => {
      _setIsUncheckedSigner(value);
      lsService.setItem('isUncheckedSigner', value);
    },
    [_setIsUncheckedSigner]
  );

  const user = useMemo(
    () => imposterAccount || walletAccount,
    [imposterAccount, walletAccount]
  );

  const isManualConnection = useRef(false);
  const oldUser = useRef(user);

  const isUserBlocked = useMemo(() => isAccountBlocked(user), [user]);

  const { connector: currentConnector } = useAccount();

  const { data: client } = useConnectorClient<Config>({
    chainId: getChainInfo().chainId,
  });

  const signer = useMemo(() => {
    if (!IS_TENDERLY_FORK || !isUncheckedSigner) {
      return clientToSigner(client);
    } else {
      if (user) return getUncheckedSigner(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, IS_TENDERLY_FORK, user, isUncheckedSigner]);

  useEffect(() => {
    if (user !== oldUser.current && !!user) {
      // User changed current address
      oldUser.current = user;
      carbonEvents.wallet.walletConnected({
        address: user,
        name: currentConnector?.name || '',
      });
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
    async (connector: Connector) => {
      if (isCountryBlocked || isCountryBlocked === null) {
        throw new Error('Your country is restricted from using this app.');
      }
      isManualConnection.current = true;
      await connectAsync(
        {
          connector,
          chainId: getChainInfo().chainId,
        },
        {
          onError: (error: ConnectErrorType) => {
            isManualConnection.current = false;
            console.error(`Error connecting ${connector.name}` + error.message);
          },
        }
      );
    },
    [isCountryBlocked, connectAsync]
  );

  const disconnect = useCallback(async () => {
    isManualConnection.current = true;
    await disconnectAsync(
      {},
      {
        onError: (error: DisconnectErrorType) => {
          isManualConnection.current = false;
          console.error(`Error disconnecting` + error.message);
        },
        onSettled: () => {
          handleImposterAccount();
        },
      }
    );
  }, [disconnectAsync, handleImposterAccount]);

  return {
    user,
    signer,
    currentConnector,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
  };
};
