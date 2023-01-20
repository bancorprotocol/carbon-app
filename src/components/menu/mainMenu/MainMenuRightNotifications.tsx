import { FC } from 'react';
import { useModal } from 'libs/modals';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { useNotifications } from 'libs/notifications';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';

export const MainMenuRightNotifications: FC = () => {
  const { user } = useWeb3();
  const { openModal } = useModal();
  const { hasPendingTx, notifications } = useNotifications();

  if (!user || notifications.length === 0) return null;

  return (
    <Button
      variant={'secondary'}
      className={'relative !p-0'}
      onClick={() => openModal('notifications', undefined)}
    >
      <span className="flex h-40 w-40 items-center justify-center">
        {hasPendingTx && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red/30 opacity-75"></span>
        )}
        <span className="relative flex inline-flex h-40 w-40 items-center justify-center rounded-full bg-emphasis">
          <IconBell />
        </span>
      </span>
    </Button>
  );
};
