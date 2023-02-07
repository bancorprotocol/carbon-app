import { FC } from 'react';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <MainMenuRightNotifications />
      <MainMenuRightWallet />
    </div>
  );
};
