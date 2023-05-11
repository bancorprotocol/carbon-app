import {
  getConnection,
  IS_COINBASE_WALLET,
  IS_IN_IFRAME,
  IS_METAMASK_WALLET,
} from 'libs/web3/web3.utils';
import { ConnectionType } from 'libs/web3/web3.constants';
import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useStore } from 'store';

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
      if (isCountryBlocked || isCountryBlocked === null) {
        return;
      }
      if (IS_IN_IFRAME) {
        const c = getConnection(ConnectionType.GNOSIS_SAFE);
        return await c.connector.connectEagerly?.();
      }
      if (IS_METAMASK_WALLET) {
        const c = getConnection(ConnectionType.INJECTED);
        return await c.connector.connectEagerly?.();
      }
      if (IS_COINBASE_WALLET) {
        const c = getConnection(ConnectionType.COINBASE_WALLET);
        return await c.connector.connectEagerly?.();
      }
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
    }
  }, [isCountryBlocked, isNetworkActive, network.connector, networkError]);

  useEffect(() => {
    void activateNetwork();
  }, [activateNetwork, isCountryBlocked]);

  return { provider, isNetworkActive, networkError, switchNetwork };
};
