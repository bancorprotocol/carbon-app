import { FC } from 'react';
import { ActivityNotification } from 'components/activity/ActivityNotification';
import { TxNotification } from './TxNotification';
import { Notification } from './types';

interface NotificationLineProps {
  close: () => void;
  onClick?: () => void;
  notification: Notification;
}
export const NotificationLine: FC<NotificationLineProps> = (props) => {
  const { notification, close, onClick } = props;

  switch (notification.type) {
    case 'activity':
      return (
        <ActivityNotification
          notification={notification}
          onClick={onClick}
          close={close}
        />
      );
    case 'tx':
      return <TxNotification notification={notification} close={close} />;
    default:
      return null;
  }
};
