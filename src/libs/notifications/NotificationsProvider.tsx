import { dayjs } from 'libs/dayjs';
import { useWeb3 } from 'libs/web3';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { uuid } from 'utils/helpers';
import { NOTIFICATIONS_MAP } from 'libs/notifications/data';
import {
  DispatchNotification,
  NotificationsContext,
  Notification,
  NotificationStatus,
} from 'libs/notifications/types';
import { useInterval } from 'hooks/useInterval';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getLSUserNotifications,
  setLSUserNotifications,
} from 'libs/notifications/utils';

const defaultValue: NotificationsContext = {
  notifications: [],
  alerts: [],
  hasPendingTx: false,
  dispatchNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
  dismissAlert: () => {},
};

const NotificationCTX = createContext<NotificationsContext>(defaultValue);

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useWeb3();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const lsNotifications = getLSUserNotifications(user);
      if (lsNotifications) {
        setNotifications(lsNotifications);
      }
    }
  }, [user]);

  const { provider } = useWeb3();

  const hasPendingTx = useMemo(
    () => notifications.some((n) => n.status === 'pending'),
    [notifications]
  );

  const alerts = useMemo(
    () => notifications.filter((n) => !!n.showAlert),
    [notifications]
  );

  const _updateNotificationStatus = (
    id: string,
    status: NotificationStatus
  ) => {
    setNotifications((prev) => {
      const newNotifications = prev.map((n) =>
        n.id === id ? { ...n, status } : n
      );
      setLSUserNotifications(user, newNotifications);
      return newNotifications;
    });
  };

  const _checkStatus = async (n: Notification) => {
    if (!n.txHash || !provider) return;
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

  useInterval(async () => {
    notifications
      .filter((n) => n.status === 'pending')
      .forEach((n) => _checkStatus(n));
  }, 2000);

  const dispatchNotification: DispatchNotification = useCallback(
    (key, data) => {
      setNotifications((prev) => {
        const newNotifications = [
          ...prev,
          {
            ...NOTIFICATIONS_MAP[key](data),
            id: uuid(),
            timestamp: dayjs().unix(),
          },
        ];
        if (newNotifications.length > 100) {
          newNotifications.splice(0, 1);
        }
        setLSUserNotifications(user, newNotifications);
        return newNotifications;
      });
    },
    [setNotifications, user]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const newNotifications = prev.filter((n) => n.id !== id);
        setLSUserNotifications(user, newNotifications);
        return newNotifications;
      });
    },
    [setNotifications, user]
  );

  const dismissAlert = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const newNotifications = prev.map((n) =>
          n.id === id ? { ...n, showAlert: false } : n
        );
        setLSUserNotifications(user, newNotifications);
        return newNotifications;
      });
    },
    [setNotifications, user]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLSUserNotifications(user, []);
  }, [setNotifications, user]);

  return (
    <NotificationCTX.Provider
      value={{
        notifications,
        alerts,
        hasPendingTx,
        dispatchNotification,
        removeNotification,
        clearNotifications,
        dismissAlert,
      }}
    >
      <>{children}</>
      <div className={'fixed absolute top-10 right-10'}>
        <div className={'sticky z-40'}>
          <AnimatePresence mode={'popLayout'}>
            {alerts.map((n) => (
              <motion.div
                key={n.id}
                layout
                variants={notificationVariants}
                whileHover="hover"
                initial="initial"
                animate="animate"
                exit="exit"
                className={
                  'mb-20 block w-[350px] rounded-10 bg-silver px-20 py-10'
                }
              >
                <NotificationLine isAlert notification={n} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </NotificationCTX.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationCTX);
};

const notificationVariants = {
  initial: {
    opacity: 0,
    scale: 0.2,
    transition: { type: 'spring' },
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: { type: 'spring' },
  },
  hover: { scale: 1.05, transition: { type: 'spring' } },
};
