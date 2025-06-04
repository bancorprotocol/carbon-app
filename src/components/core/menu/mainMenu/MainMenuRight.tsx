import { FC, useEffect, useState } from 'react';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
import { MainMenuRightBurger } from './MainMenuRightBurger';
import { useBurgerMenuItems } from './MainMenuRightBurger/useBurgerMenuItems';
import { MainMenuRightChainSelector } from './MainMenuRightChainSelector';
import { networks } from 'config';
import { MainMenuCart } from './MainMenuCart';
import { lsService } from 'services/localeStorage';
import { Link } from '@tanstack/react-router';
import config from 'config';

const TenderlyForkAlert = () => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  useEffect(() => {
    const checkDebugMode = () => {
      if (lsService.getItem('imposterAccount')) return setIsDebugMode(true);
      if (lsService.getItem('tenderlyRpc')) return setIsDebugMode(true);
      if (lsService.getItem('configOverride')) return setIsDebugMode(true);
      const api = lsService.getItem('carbonApi');
      if (api && api !== config.carbonApi) return setIsDebugMode(true);
      setIsDebugMode(false);
    };
    checkDebugMode();
    window.addEventListener('storage', checkDebugMode);
    return () => window.removeEventListener('storage', checkDebugMode);
  }, []);

  if (!isDebugMode) return;

  return (
    <Link
      to="/debug"
      className="bg-warning text-14 rounded-full px-16 py-8 text-black"
    >
      Debug Mode
    </Link>
  );
};

export const MainMenuRight: FC = () => {
  const { menuMapping } = useBurgerMenuItems();
  const { aboveBreakpoint } = useBreakpoints();

  return (
    <div className="flex items-center gap-10 sm:gap-20">
      <TenderlyForkAlert />
      {config.ui.showCart && <MainMenuCart />}
      <MainMenuRightNotifications />
      <MainMenuRightChainSelector networks={networks} />
      {aboveBreakpoint('md') && (
        <MainMenuRightBurger menuMapping={menuMapping} />
      )}
      <MainMenuRightWallet />
    </div>
  );
};
