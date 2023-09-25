import { useWeb3React } from '@web3-react/core';
import {
  attemptToConnectWallet,
  getConnection,
  isNativeAppBrowser,
} from 'libs/web3/web3.utils';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'store';
import useAsyncEffect from 'use-async-effect';
import { getConnectionTypeFromLS } from './web3.constants';

export const useWeb3Network = () => {
  const { isCountryBlocked, setSelectedWallet } = useStore();

  const { connector } = useWeb3React();

  const network = getConnection('network');

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
      // Attempt to autologin to native app browser
      if (isNativeAppBrowser) {
        const { success } = await attemptToConnectWallet(
          isNativeAppBrowser.type,
          isNativeAppBrowser.activate
        );
        if (success) {
          setSelectedWallet(isNativeAppBrowser.type);
          return; // If successfully connected, stop further connection attempts
        }
      }

      // Attempt to autologin to normal previous session, if exists
      const storedConnection = getConnectionTypeFromLS();
      if (storedConnection !== undefined) {
        const { success } = await attemptToConnectWallet(storedConnection);
        if (success) {
          setSelectedWallet(storedConnection);
        }
      }
    }
  }, [isCountryBlocked]);

  return { provider, isNetworkActive, networkError, switchNetwork };
};
