import { FC } from 'react';
import { MainMenuRightWallet } from 'components/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/menu/mainMenu/MainMenuRightNotifications';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <MainMenuRightNotifications />
      <MainMenuRightWallet />
    </div>
  );
};
