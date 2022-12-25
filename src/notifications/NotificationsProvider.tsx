import dayjs from 'dayjs';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { uuid } from 'utils/helpers';

export enum NotificationStatus {
  Pending,
  Failed,
  Success,
}

export interface Notification {
  id: string;
  status: NotificationStatus;
  title: string;
  description: string;
  timestamp: number;
  txHash?: string;
}

interface NotificationsContext {
  notifications: Notification[];
  dispatchNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  rejectNotification: () => void;
}

const defaultValue: NotificationsContext = {
  notifications: [],
  dispatchNotification: () => {},
  removeNotification: () => {},
  rejectNotification: () => {},
};

const NotificationCTX = createContext<NotificationsContext>(defaultValue);

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dispatchNotification: NotificationsContext['dispatchNotification'] = (
    notification
  ) => {
    setNotifications((prevState) => [
      ...prevState,
      {
        id: uuid(),
        status: notification.status,
        title: notification.title,
        description: notification.description,
        timestamp: dayjs().unix(),
      },
    ]);
  };

  const rejectNotification = () => {
    dispatchNotification({
      status: NotificationStatus.Failed,
      title: 'Transaction Rejected',
      description:
        'You rejected the trade. If this was by mistake, please try again.',
    });
  };

  const removeNotification = (id: string) => {
    const newNot = notifications.filter((no) => no.id !== id);
    setNotifications(newNot);
  };

  return (
    <NotificationCTX.Provider
      value={{
        notifications,
        dispatchNotification,
        removeNotification,
        rejectNotification,
      }}
    >
      <>{children}</>
    </NotificationCTX.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationCTX);
};
