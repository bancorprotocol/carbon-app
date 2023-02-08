import { FC } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';
import { MainMenuTokens } from 'components/core/menu/mainMenu/MainMenuTokens';
import { useBreakpoints } from 'hooks/useBreakpoints';

export const MainMenu: FC = () => {
  const { aboveBreakpoint } = useBreakpoints();

  return (
    <div className={`sticky top-0 z-40`}>
      <div className={'main-menu'}>
        <MainMenuLeft />
        {aboveBreakpoint('md') && <MainMenuTokens />}
        <MainMenuRight />
      </div>
    </div>
  );
};
