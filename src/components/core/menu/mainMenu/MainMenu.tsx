import { FC } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';

export const MainMenu: FC = () => {
  return (
    <header
      className="main-menu sticky top-0 z-40 w-full"
      data-testid="main-menu"
    >
      <MainMenuLeft />
      <MainMenuRight />
    </header>
  );
};
