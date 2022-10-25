import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { uuid } from 'utils/helpers';
import { NotificationLine } from './NotificationLine';

export enum NotificationType {
  Pending,
  Failed,
  Success,
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
}

interface NotificationsContext {
  notifications: Notification[];
  dispatchNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const defaultValue: NotificationsContext = {
  notifications: [],
  dispatchNotification: (data) => {},
  removeNotification: (id) => {},
};

const NotificationCTX = createContext<NotificationsContext>(defaultValue);

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dispatchNotification = (notification: Notification) => {
    setNotifications((prevState) => [
      ...prevState,
      {
        id: uuid(),
        type: notification.type,
        title: notification.title,
        description: notification.description,
      },
    ]);
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
      }}
    >
      <>
        {children}

        {notifications.map((notification) => {
          return (
            <NotificationLine
              key={notification.id}
              notification={notification}
            ></NotificationLine>
          );
        })}
      </>
    </NotificationCTX.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationCTX);
};
