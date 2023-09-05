import { FC } from 'react';
import { IS_TENDERLY_FORK } from 'libs/web3';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
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
  const { aboveBreakpoint } = useBreakpoints();

  return (
    <div className={'flex items-center space-x-20'}>
      <TenderlyForkAlert />
      <MainMenuRightNotifications />
      {aboveBreakpoint('md') && (
        <MainMenuRightBurger menuMapping={menuMapping} />
      )}
      <MainMenuRightWallet />
    </div>
  );
};
