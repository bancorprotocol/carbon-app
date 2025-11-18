import { ModalFC } from 'libs/modals/modals.types';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { useNotifications } from 'hooks/useNotifications';
import { useModal } from 'hooks/useModal';
import { NotificationPreferences } from 'libs/notifications/NotificationPreferences';
import { Modal, ModalHeader } from '../Modal';

export const ModalNotifications: ModalFC<undefined> = ({ id }) => {
  const { notifications, clearNotifications, removeNotification } =
    useNotifications();
  const reversedNotifications = notifications.slice().reverse();
  const { closeModal } = useModal();

  return (
    <Modal id={id} placement="side" className="grid content-start gap-16">
      <ModalHeader id={id} className="grid-cols-[auto_1fr_auto]">
        <h2>Notifications</h2>
        <button
          onClick={() => clearNotifications()}
          className="justify-self-end"
        >
          Clear All
        </button>
      </ModalHeader>
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
