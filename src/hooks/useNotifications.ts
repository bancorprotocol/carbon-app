import { useWagmi } from 'libs/wagmi';
import { useStore } from 'store';
import {
  DispatchNotification,
  Notification,
  NotificationStatus,
} from 'libs/notifications/types';
import { setLSUserNotifications } from 'libs/notifications/utils';
import { useCallback } from 'react';
import { NOTIFICATIONS_MAP } from 'libs/notifications/data';
import { uuid } from 'utils/helpers';

export const useNotifications = () => {
  const { user, provider } = useWagmi();
  const {
    notifications: { notifications, setNotifications, alerts, hasPendingTx },
  } = useStore();

  const _updateNotificationStatus = (
    id: string,
    status: NotificationStatus,
  ) => {
    setNotifications((prev) => {
      const newNotifications = prev.map((n) =>
        n.id === id ? { ...n, status } : n,
      );
      setLSUserNotifications(user, newNotifications);
      return newNotifications;
    });
  };

  const checkStatus = async (n: Notification) => {
    if (n.type !== 'tx' || !n.txHash || !provider) return;
    try {
      const tx = await provider.getTransactionReceipt(n.txHash);
      if (tx && tx.status !== null) {
        const status: NotificationStatus = tx.status ? 'success' : 'failed';
        _updateNotificationStatus(n.id, status);
      }
    } catch (e: any) {
      console.log('Error checking tx status', e.message);
    }
  };

  const dispatchNotification: DispatchNotification = useCallback(
    (key, data) => {
      setNotifications((prev) => {
        const newNotifications = [
          ...prev,
          {
            ...NOTIFICATIONS_MAP[key](data),
            id: uuid(),
            timestamp: Date.now() / 1000,
          },
        ];
        if (newNotifications.length > 100) {
          newNotifications.splice(0, 1);
        }
        setLSUserNotifications(user, newNotifications);
        return newNotifications;
      });
    },
    [setNotifications, user],
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const newNotifications = prev.filter((n) => n.id !== id);
        setLSUserNotifications(user, newNotifications);
        return newNotifications;
      });
    },
    [setNotifications, user],
  );

  const dismissAlert = useCallback(
    async (id: string) => {
      const item = document.getElementById(id) as HTMLElement;
      const animate = item.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.6)', opacity: 0 },
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.36, 0, 0.66, -0.56)', // ease-in-back
          fill: 'forwards',
        },
      );
      await animate.finished;
      setNotifications((prev) => {
        const newNotifications = prev.map((n) =>
          n.id === id ? { ...n, showAlert: false } : n,
        );
        setLSUserNotifications(user, newNotifications);
        return newNotifications;
      });
    },
    [setNotifications, user],
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLSUserNotifications(user, []);
  }, [setNotifications, user]);

  return {
    notifications,
    setNotifications,
    dispatchNotification,
    removeNotification,
    clearNotifications,
    dismissAlert,
    hasPendingTx,
    alerts,
    checkStatus,
  };
};
