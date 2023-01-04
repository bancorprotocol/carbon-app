import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { useNotifications } from 'libs/notifications/NotificationsProvider';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  const { notifications, clearNotification } = useNotifications();
  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex w-full items-center justify-between">
          Notifications
          <button onClick={() => clearNotification()} className="mr-20">
            Clear All
          </button>
        </div>
      }
      size={'md'}
    >
      <div className={'mt-25 flex flex-col gap-25'}>
        {notifications.map((notification) => (
          <NotificationLine key={notification.id} notification={notification} />
        ))}
      </div>
    </ModalSlideOver>
  );
};
