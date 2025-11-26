import { useWagmi } from 'libs/wagmi';
import { FC, useEffect, useState } from 'react';
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
      id="notification-list"
      className="fixed right-[34px] top-80 z-50 grid gap-16"
      data-testid="notification-list"
    >
      {alerts.map((n) => (
        <NotificationItem notification={n} key={n.id} />
      ))}
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
    <li
      id={id}
      onMouseEnter={() => setDelay(1_000_000)} // Infinity doesn't work with timeout
      onMouseLeave={() => setDelay(7 * 1000)}
      className="rounded-lg bg-main-800 glass-shadow block w-[400px] overflow-hidden px-16 py-12 hover:scale-105 transition-all animate-slide-up ease-out"
      data-testid={`notification-${notification.testid}`}
    >
      <NotificationLine
        notification={notification}
        close={() => dismissAlert(id)}
        onClick={() => dismissAlert(id)}
      />
    </li>
  );
};
