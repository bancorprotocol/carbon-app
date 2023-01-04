import { FC } from 'react';
import { MainMenuRightWallet } from 'components/menu/mainMenu/MainMenuRightWallet';
import { NotificationsMenu } from 'libs/notifications/NotificationsMenu';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <NotificationsMenu />
      <MainMenuRightWallet />
    </div>
  );
};
