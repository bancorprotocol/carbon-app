import { FC } from 'react';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
import { IS_TENDERLY_FORK } from 'libs/web3';
import { Button } from 'components/common/button';
import { MainMenuRightBurger } from './MainMenuRightBurger';
import { useBurgerMenuItems } from './MainMenuRightBurger/useBurgerMenuItems';

const TenderlyForkAlert = () => {
  return IS_TENDERLY_FORK ? (
    <Button variant={'error'} size={'sm'} className={'px-8'}>
      Fork
    </Button>
  ) : null;
};

export const MainMenuRight: FC = () => {
  const { menuMapping } = useBurgerMenuItems();

  return (
    <div className={'flex items-center space-x-20'}>
      <TenderlyForkAlert />
      <MainMenuRightNotifications />
      <MainMenuRightBurger menuMapping={menuMapping} />
      <MainMenuRightWallet />
    </div>
  );
};
