import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { useNotifications } from 'hooks/useNotifications';
import { Button } from 'components/common/button';

export const MainMenuRightNotifications: FC = () => {
  const { openModal } = useModal();
  const { hasPendingTx } = useNotifications();

  return (
    <Button
      variant="secondary"
      className="relative p-0"
      onClick={() => openModal('notifications', undefined)}
    >
      <span className="flex size-36 items-center justify-center">
        {hasPendingTx && (
          <span className="bg-error/30 absolute inline-flex size-full animate-ping rounded-full opacity-75"></span>
        )}
        <span className="relative inline-flex size-36 items-center justify-center rounded-full">
          <IconBell />
        </span>
      </span>
    </Button>
  );
};
