import { FC } from 'react';
import { MainMenuRightWallet } from 'elements/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightModals } from 'elements/menu/mainMenu/MainMenuRightModals';
import { NotificationsMenu } from 'notifications/NotificationsMenu';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <MainMenuRightModals />
      <NotificationsMenu />
      <MainMenuRightWallet />
    </div>
  );
};
