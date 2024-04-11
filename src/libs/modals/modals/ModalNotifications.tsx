import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { useNotifications } from 'hooks/useNotifications';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  const { notifications, clearNotifications, removeNotification } =
    useNotifications();
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
        {reversedNotifications.map((n) => (
          <li
            key={n.id}
            className="overflow-hidden rounded-10 bg-black px-16 py-12"
          >
            <NotificationLine
              notification={n}
              close={() => removeNotification(n.id)}
            />
          </li>
        ))}
      </ul>
    </ModalSlideOver>
  );
};
