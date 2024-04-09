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
        <header className="flex w-full items-center justify-between">
          Notifications
          <button onClick={() => clearNotifications()} className="mr-20">
            Clear All
          </button>
        </header>
      }
      size="md"
    >
      <ul className="mt-25 flex flex-col gap-10">
        {reversedNotifications.map((notification) => (
          <li key={notification.id} className="rounded-10 bg-black px-20 py-10">
            <NotificationLine notification={notification} />
          </li>
        ))}
      </ul>
    </ModalSlideOver>
  );
};
