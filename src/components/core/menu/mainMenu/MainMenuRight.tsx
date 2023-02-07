import { FC } from 'react';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
import { IS_TENDERLY_FORK } from 'libs/web3';
import { Button } from 'components/common/button';

const TenderlyForkAlert = () => {
  return IS_TENDERLY_FORK ? (
    <Button variant={'error'} size={'sm'}>
      Tenderly Fork
    </Button>
  ) : null;
};

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <TenderlyForkAlert />
      <MainMenuRightNotifications />
      <MainMenuRightWallet />
    </div>
  );
};
