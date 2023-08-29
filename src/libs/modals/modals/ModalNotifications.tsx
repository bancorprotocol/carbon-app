import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { useNotifications } from 'hooks/useNotifications';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  const { notifications, clearNotifications } = useNotifications();
  const reversedNotifications = notifications.slice().reverse();

  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex w-full items-center justify-between">
          Notifications
          <button onClick={() => clearNotifications()} className="mr-20">
            Clear All
          </button>
        </div>
      }
      size={'md'}
    >
      <div className={'mt-25 space-y-10'}>
        {reversedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={'bg-body rounded-10 px-20 py-10'}
          >
            <NotificationLine notification={notification} />
          </div>
        ))}
      </div>
    </ModalSlideOver>
  );
};
