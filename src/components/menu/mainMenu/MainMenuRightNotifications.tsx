import { FC } from 'react';
import { useModal } from 'libs/modals';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';

export const MainMenuRightNotifications: FC = () => {
  const { openModal } = useModal();

  return (
    <button
      className="rounded-full bg-emphasis p-12"
      onClick={() => openModal('notifications', undefined)}
    >
      <IconBell />
    </button>
  );
};
