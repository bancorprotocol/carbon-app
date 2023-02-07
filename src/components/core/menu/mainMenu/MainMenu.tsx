import { FC } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';
import { MainMenuTokens } from 'components/core/menu/mainMenu/MainMenuTokens';
import { MainMenuSettings } from 'components/core/menu/mainMenu/MainMenuSettings';
import { useTrade } from 'components/trade/useTrade';

export const MainMenu: FC = () => {
  const { baseToken, quoteToken, isTradePage } = useTrade();

  const showTradeMenu = !(!isTradePage || !baseToken || !quoteToken);

  return (
    <div className={`sticky top-0 z-40`}>
      <div className={'main-menu'}>
        <MainMenuLeft />
        {showTradeMenu && (
          <div className={'flex space-x-5'}>
            <MainMenuTokens />
            <MainMenuSettings />
          </div>
        )}

        <MainMenuRight />
      </div>
    </div>
  );
};
