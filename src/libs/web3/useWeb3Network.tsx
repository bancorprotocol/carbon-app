import { useWeb3React } from '@web3-react/core';
import { ConnectionType } from 'libs/web3/web3.constants';
import {
  attemptToConnectWallet,
  getConnection,
  IS_COINBASE_BROWSER,
  IS_IN_IFRAME,
  IS_METAMASK_BROWSER,
} from 'libs/web3/web3.utils';
import { useCallback, useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import useAsyncEffect from 'use-async-effect';

export const useWeb3Network = () => {
  const { isCountryBlocked } = useStore();

  const { connector } = useWeb3React();

  const network = getConnection(ConnectionType.NETWORK);

  const provider = network.hooks.useProvider();

  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const [networkError, setNetworkError] = useState<string>();

  const switchNetwork = useCallback(async () => {
    await connector.activate(1);
  }, [connector]);

  const activateNetwork = useCallback(async () => {
    if (networkError || isNetworkActive) {
      return;
    }

    try {
      await network.connector.activate();
      setIsNetworkActive(true);
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
    }
  }, [isNetworkActive, network.connector, networkError]);

  useEffect(() => {
    void activateNetwork();
  }, [activateNetwork]);

  useAsyncEffect(async () => {
    if (isCountryBlocked === false) {
      // Attempt to connect to wallet eagerly
      try {
        if (IS_IN_IFRAME) {
          await attemptToConnectWallet(ConnectionType.GNOSIS_SAFE, true);
        }
        if (IS_COINBASE_BROWSER) {
          await attemptToConnectWallet(ConnectionType.COINBASE_WALLET, true);
        }
        if (IS_METAMASK_BROWSER) {
          await attemptToConnectWallet(ConnectionType.INJECTED, true);
        }
      } catch (e: any) {
        // throws if successfully connected to stop further attempts
        console.log(e.message);
        return;
      }

      // Attempt to connect previous session
      const storedConnection = lsService.getItem('connectionType');
      if (storedConnection !== undefined) {
        try {
          await attemptToConnectWallet(
            storedConnection,
            storedConnection === ConnectionType.COINBASE_WALLET
          );
        } catch (e: any) {
          // throws if successfully connected to stop further attempts
          console.log(e.message);
          return;
        }
      }
    }
  }, [isCountryBlocked]);

  return { provider, isNetworkActive, networkError, switchNetwork };
};
