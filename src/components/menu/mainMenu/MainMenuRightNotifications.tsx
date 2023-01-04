import { FC } from 'react';
import { useModal } from 'libs/modals';

export const MainMenuRightNotifications: FC = () => {
  const { openModal } = useModal();

  return (
    <button onClick={() => openModal('notifications', undefined)}>
      bell icon
    </button>
  );
};
