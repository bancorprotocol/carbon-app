import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { useNotifications } from 'hooks/useNotifications';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';
import { carbonEvents } from 'services/events';

export const MainMenuRightNotifications: FC = () => {
  const { user } = useWeb3();
  const { openModal } = useModal();
  const { hasPendingTx, notifications } = useNotifications();

  if (!user || notifications.length === 0) return null;

  return (
    <Button
      variant="secondary"
      className="relative p-0"
      onClick={() => {
        carbonEvents.navigation.navNotificationClick(undefined);
        openModal('notifications', undefined);
      }}
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
