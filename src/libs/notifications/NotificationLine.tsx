import { FC } from 'react';
import { ActivityNotification } from 'components/activity/ActivityNotification';
import { TxNotification } from './TxNotification';
import { Notification } from './types';
import { useNotifications } from 'hooks/useNotifications';
import { useInterval } from 'hooks/useInterval';
import { FOUR_SECONDS_IN_MS } from 'utils/time';

interface NotificationLineProps {
  isAlert?: boolean;
  notification: Notification;
}
export const NotificationLine: FC<NotificationLineProps> = (props) => {
  const { notification, isAlert } = props;
  const { removeNotification, dismissAlert } = useNotifications();

  const close = () => {
    if (isAlert) {
      dismissAlert(notification.id);
    } else {
      removeNotification(notification.id);
    }
  };

  const status = 'status' in notification ? notification.status : null;

  useInterval(
    () => dismissAlert(notification.id),
    isAlert && status !== 'pending' ? FOUR_SECONDS_IN_MS : null,
    false
  );

  switch (notification.type) {
    case 'activity':
      return <ActivityNotification notification={notification} close={close} />;
    case 'tx':
      return <TxNotification notification={notification} close={close} />;
    default:
      return null;
  }
};
