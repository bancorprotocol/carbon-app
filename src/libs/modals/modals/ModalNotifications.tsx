import { ModalFC } from 'libs/modals/modals.types';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { useNotifications } from 'hooks/useNotifications';
import { useModal } from 'hooks/useModal';
import { NotificationPreferences } from 'libs/notifications/NotificationPreferences';
import { Modal } from '../Modal';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  const { notifications, clearNotifications, removeNotification } =
    useNotifications();
  const reversedNotifications = notifications.slice().reverse();
  const { closeModal } = useModal();

  return (
    <Modal id={id} placement="side" className="grid content-start gap-16">
      <header className="flex items-center justify-between gap-16">
        Notifications
        <button onClick={() => clearNotifications()} className="ms-auto">
          Clear All
        </button>
        <button onClick={() => closeModal(id)}>
          <IconClose className="size-16" />
        </button>
      </header>
      <NotificationPreferences />
      <ul className="grid gap-16">
        {reversedNotifications.map((n) => (
          <li
            key={n.id}
            className="surface rounded-lg overflow-hidden px-16 py-12"
          >
            <NotificationLine
              notification={n}
              close={() => removeNotification(n.id)}
              onClick={() => closeModal(id)}
            />
          </li>
        ))}
      </ul>
    </Modal>
  );
};
