import { FC } from 'react';
import { MainMenuRightWallet } from 'components/menu/mainMenu/MainMenuRightWallet';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <MainMenuRightWallet />
    </div>
  );
};
