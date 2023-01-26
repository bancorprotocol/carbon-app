import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Notification } from 'libs/notifications';

export interface NotificationsStore {
  notifications: Notification[];
  alerts: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  hasPendingTx?: boolean;
}

export const useNotificationsStore = (): NotificationsStore => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const hasPendingTx = useMemo(
    () => notifications.some((n) => n.status === 'pending'),
    [notifications]
  );

  const alerts = useMemo(
    () => notifications.filter((n) => !!n.showAlert),
    [notifications]
  );

  return {
    notifications,
    setNotifications,
    alerts,
    hasPendingTx,
  };
};

export const defaultNotificationsStore: NotificationsStore = {
  notifications: [],
  alerts: [],
  hasPendingTx: false,
  setNotifications: () => {},
};
