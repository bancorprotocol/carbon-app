import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import IconBell from 'assets/icons/bell.svg?react';
import { useNotifications } from 'hooks/useNotifications';

export const MainMenuRightNotifications: FC = () => {
  const { openModal } = useModal();
  const { hasPendingTx } = useNotifications();

  return (
    <button
      className="btn-on-background relative p-0"
      onClick={() => openModal('notifications')}
    >
      <span className="grid size-40 place-items-center">
        {hasPendingTx && (
          <span className="bg-error/30 absolute inline-flex size-full animate-ping rounded-full opacity-75"></span>
        )}
        <IconBell />
      </span>
    </button>
  );
};
