import { FC } from 'react';
import { ActivityNotification } from 'components/activity/ActivityNotification';
import { TxNotification } from './TxNotification';
import { Notification } from './types';

interface NotificationLineProps {
  isAlert?: boolean;
  notification: Notification;
}
export const NotificationLine: FC<NotificationLineProps> = (props) => {
  const { notification, isAlert } = props;
  switch (notification.type) {
    case 'activity':
      return (
        <ActivityNotification notification={notification} isAlert={isAlert} />
      );
    case 'tx':
      return <TxNotification notification={notification} isAlert={isAlert} />;
    default:
      return null;
  }
};
