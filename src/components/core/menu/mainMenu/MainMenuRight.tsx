import { FC } from 'react';
import { IS_TENDERLY_FORK } from 'libs/web3';
import { useTranslation } from 'libs/translations';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
import { Button } from 'components/common/button';
import { MainMenuRightBurger } from './MainMenuRightBurger';
import { useBurgerMenuItems } from './MainMenuRightBurger/useBurgerMenuItems';

const TenderlyForkAlert = () => {
  const { t } = useTranslation();

  return IS_TENDERLY_FORK ? (
    <Button variant={'error'} size={'sm'} className={'px-8'}>
      {t('navBar.actionButton')}
    </Button>
  ) : null;
};

export const MainMenuRight: FC = () => {
  const { menuMapping } = useBurgerMenuItems();
  const { aboveBreakpoint } = useBreakpoints();

  return (
    <div className={'space-s-20 flex items-center'}>
      <TenderlyForkAlert />
      <MainMenuRightNotifications />
      {aboveBreakpoint('md') && (
        <MainMenuRightBurger menuMapping={menuMapping} />
      )}
      <MainMenuRightWallet />
    </div>
  );
};
