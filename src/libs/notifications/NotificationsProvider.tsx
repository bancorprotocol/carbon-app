import { dayjs } from 'libs/dayjs';
import { useWeb3 } from 'libs/web3';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { uuid } from 'utils/helpers';
import { NOTIFICATIONS_MAP } from 'libs/notifications/notifications';
import {
  DispatchNotification,
  NotificationsContext,
  Notification,
  NotificationStatus,
} from 'libs/notifications/types';
import { useInterval } from 'hooks/useInterval';
import { lsService } from 'services/localeStorage';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { AnimatePresence, motion } from 'framer-motion';

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

const defaultValue: NotificationsContext = {
  notifications: [],
  alerts: [],
  dispatchNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
  dismissAlert: () => {},
};

const NotificationCTX = createContext<NotificationsContext>(defaultValue);

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    lsService.getItem('notifications') || []
  );
  const { provider } = useWeb3();

  const alerts = useMemo(
    () => notifications.filter((n) => !!n.showAlert),
    [notifications]
  );

  const _applyChanges = useCallback((newNotifications: Notification[]) => {
    if (newNotifications.length > 100) {
      newNotifications.splice(0, 1);
    }
    setNotifications(newNotifications);
    const persisted = newNotifications.filter((n) => !n.nonPersistent);
    lsService.setItem('notifications', persisted);
  }, []);

  const _updateNotificationStatus = (
    id: string,
    status: NotificationStatus
  ) => {
    _applyChanges(
      notifications.map((n) => (n.id === id ? { ...n, status } : n))
    );
  };

  const _checkStatus = async (n: Notification) => {
    if (!n.txHash) return;
    try {
      if (!provider) {
        throw new Error('No provider');
      }
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
      const notificationNew = NOTIFICATIONS_MAP[key](data);
      _applyChanges([
        ...notifications,
        { ...notificationNew, id: uuid(), timestamp: dayjs().unix() },
      ]);
    },
    [notifications, _applyChanges]
  );

  const removeNotification = (id: string) => {
    const newNot = notifications.filter((no) => no.id !== id);
    _applyChanges(newNot);
  };

  const dismissAlert = (id: string) => {
    _applyChanges(
      notifications.map((n) => (n.id === id ? { ...n, showAlert: false } : n))
    );
  };

  const clearNotifications = () => {
    _applyChanges([]);
  };

  return (
    <NotificationCTX.Provider
      value={{
        notifications,
        alerts,
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
                variants={notificationVariants} // Defined animation states
                whileHover="hover" // Animation on hover gesture
                initial="initial" // Starting animation
                animate="animate" // Values to animate to
                exit="exit" // Target to animate to w
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
