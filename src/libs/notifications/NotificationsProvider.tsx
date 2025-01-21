import { useWagmi } from 'libs/wagmi';
import { FC, useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { getLSUserNotifications } from 'libs/notifications/utils';
import { useNotifications } from 'hooks/useNotifications';
import { useInterval } from 'hooks/useInterval';
import { NotificationLine } from './NotificationLine';
import { Notification } from './types';

export const NotificationAlerts: FC = () => {
  const { user } = useWagmi();
  const { alerts, notifications, checkStatus, setNotifications } =
    useNotifications();

  useInterval(async () => {
    notifications
      .filter((n) => n.type === 'tx' && n.status === 'pending')
      .forEach((n) => checkStatus(n));
  }, 2000);

  useEffect(() => {
    if (user) {
      const lsNotifications = getLSUserNotifications(user);
      if (lsNotifications) {
        setNotifications(lsNotifications);
      }
    }
  }, [user, setNotifications]);

  return (
    <ul
      className="fixed right-[34px] top-80 z-50"
      data-testid="notification-list"
    >
      <AnimatePresence mode="popLayout">
        {alerts.map((n) => (
          <NotificationItem notification={n} key={n.id} />
        ))}
      </AnimatePresence>
    </ul>
  );
};

const NotificationItem: FC<{ notification: Notification }> = (props) => {
  const { notification } = props;
  const id = notification.id;
  const [delay, setDelay] = useState(7 * 1000);
  const { dismissAlert } = useNotifications();

  useEffect(() => {
    const timeout = setTimeout(() => dismissAlert(id), delay);
    return () => clearTimeout(timeout);
  }, [delay, dismissAlert, id]);

  return (
    <m.li
      layout
      variants={notificationVariants}
      onMouseEnter={() => setDelay(1_000_000)} // Infinity doesn't work with timeout
      onMouseLeave={() => setDelay(7 * 1000)}
      whileHover="hover"
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-10 bg-background-900 mb-20 block w-[350px] overflow-hidden border border-white/40 px-16 py-12"
      data-testid={`notification-${notification.testid}`}
    >
      <NotificationLine
        notification={notification}
        close={() => dismissAlert(id)}
        onClick={() => dismissAlert(id)}
      />
    </m.li>
  );
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
