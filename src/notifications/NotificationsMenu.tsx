import { Button } from 'components/Button';
import { DropdownMenu } from 'components/DropdownMenu';
import { NotificationLine } from './NotificationLine';
import { useNotifications } from './NotificationsProvider';

export const NotificationsMenu = () => {
  const { notifications, createStrategyNtfc } = useNotifications();

  return (
    <DropdownMenu
      button={(onClick) => <Button onClick={onClick}>Notifications</Button>}
    >
      {notifications.map((notification) => (
        <NotificationLine key={notification.id} notification={notification} />
      ))}
      <Button onClick={() => createStrategyNtfc('')}>New</Button>
    </DropdownMenu>
  );
};
