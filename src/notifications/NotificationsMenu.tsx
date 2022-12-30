import { Button } from 'components/Button';
import { DropdownMenu } from 'components/DropdownMenu';
import { NotificationLine } from './NotificationLine';
import { NotificationStatus, useNotifications } from './NotificationsProvider';

export const NotificationsMenu = () => {
  const { notifications, dispatchNotification } = useNotifications();

  return (
    <DropdownMenu button={() => 'Notifications'}>
      {notifications.map((notification) => (
        <NotificationLine key={notification.id} notification={notification} />
      ))}
      <Button
        onClick={() =>
          dispatchNotification({
            title: 'some title',
            description: 'some desc',
            status: NotificationStatus.Failed,
          })
        }
      >
        New
      </Button>
    </DropdownMenu>
  );
};
