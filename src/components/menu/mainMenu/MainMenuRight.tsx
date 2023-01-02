import { FC } from 'react';
import { MainMenuRightWallet } from 'components/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightModals } from 'components/menu/mainMenu/MainMenuRightModals';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <MainMenuRightModals />
      <MainMenuRightWallet />
    </div>
  );
};
