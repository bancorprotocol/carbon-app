import { getConnection } from 'web3/web3.utils';
import { ConnectionType } from 'web3/web3.constants';
import { useCallback, useEffect, useState } from 'react';
import {
  NotificationType,
  useNotifications,
} from 'notifications/NotificationsProvider';
import { useWeb3React } from '@web3-react/core';
import { lsService } from 'services/localeStorage';

export const useWeb3Network = () => {
  const { dispatchNotification } = useNotifications();

  const { connector } = useWeb3React();

  const network = getConnection(ConnectionType.NETWORK);
  const provider = network.hooks.useProvider();

  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const [networkError, setNetworkError] = useState<string>();

  const activateNetwork = useCallback(async () => {
    if (networkError || isNetworkActive) {
      return;
    }

    try {
      await network.connector.activate();
      setIsNetworkActive(true);
      const connectionType = lsService.getItem('connectionType');
      if (connectionType !== undefined) {
        const c = getConnection(connectionType);
        await c.connector.connectEagerly?.();
      } else {
        await connector.connectEagerly?.();
      }
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
      dispatchNotification({
        title: 'Network Error',
        description: msg,
        type: NotificationType.Failed,
      });
    }
  }, [
    connector,
    dispatchNotification,
    isNetworkActive,
    network.connector,
    networkError,
  ]);

  useEffect(() => {
    void activateNetwork();
  }, [activateNetwork]);

  return { provider, isNetworkActive, networkError };
};
