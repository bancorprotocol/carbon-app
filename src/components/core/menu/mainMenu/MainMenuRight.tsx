import { FC } from 'react';
import { IS_TENDERLY_FORK } from 'libs/wagmi';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
import { Button } from 'components/common/button';
import { MainMenuRightBurger } from './MainMenuRightBurger';
import { useBurgerMenuItems } from './MainMenuRightBurger/useBurgerMenuItems';
import { MainMenuRightChainSelector } from './MainMenuRightChainSelector';
import { networks } from 'config';
import { MainMenuCart } from './MainMenuCart';

const TenderlyForkAlert = () => {
  return IS_TENDERLY_FORK ? (
    <Button variant="error" size="sm">
      Fork
    </Button>
  ) : null;
};

export const MainMenuRight: FC = () => {
  const { menuMapping } = useBurgerMenuItems();
  const { aboveBreakpoint } = useBreakpoints();

  return (
    <div className="flex items-center gap-10 sm:gap-20">
      <TenderlyForkAlert />
      <MainMenuCart />
      <MainMenuRightNotifications />
      <MainMenuRightChainSelector networks={networks} />
      {aboveBreakpoint('md') && (
        <MainMenuRightBurger menuMapping={menuMapping} />
      )}
      <MainMenuRightWallet />
    </div>
  );
};
