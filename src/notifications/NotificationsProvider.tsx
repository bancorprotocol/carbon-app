import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { uuid } from 'utils/helpers';
import { AnimatePresence, m } from 'motion';

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
  dispatchNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const defaultValue: NotificationsContext = {
  notifications: [],
  dispatchNotification: () => {},
  removeNotification: () => {},
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

        <div className={'fixed bottom-0 w-full p-6'}>
          <ul className={'space-y-4'}>
            <AnimatePresence mode={'sync'}>
              {notifications.map((notification) => {
                return (
                  <m.li
                    key={notification.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring' }}
                    className={
                      'rounded-2xl w-full bg-red-600 px-4 py-2 text-white'
                    }
                  >
                    <h3>{notification.title}</h3>
                    <p>{notification.description}</p>
                    <button onClick={() => removeNotification(notification.id)}>
                      close
                    </button>
                  </m.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </>
    </NotificationCTX.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationCTX);
};
