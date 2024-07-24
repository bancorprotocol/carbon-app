import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { useNotifications } from 'hooks/useNotifications';
import { useModal } from 'hooks/useModal';
import { NotificationPreferences } from 'libs/notifications/NotificationPreferences';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  const { notifications, clearNotifications, removeNotification } =
    useNotifications();
  const reversedNotifications = notifications.slice().reverse();
  const { closeModal } = useModal();

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
      <NotificationPreferences />
      <ul className="mt-24 flex flex-col gap-10">
        {reversedNotifications.map((n) => (
          <li
            key={n.id}
            className="rounded-10 overflow-hidden bg-black px-16 py-12"
          >
            <NotificationLine
              notification={n}
              close={() => removeNotification(n.id)}
              onClick={() => closeModal(id)}
            />
          </li>
        ))}
      </ul>
    </ModalSlideOver>
  );
};
