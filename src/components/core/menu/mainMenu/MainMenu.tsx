import { FC } from 'react';
import { MainMenuLeft } from 'components/core/menu/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'components/core/menu/mainMenu/MainMenuRight';
import style from './MainMenu.module.css';

export const MainMenu: FC = () => {
  return (
    <header className={style.mainMenu} data-testid="main-menu">
      <MainMenuLeft />
      <MainMenuRight />
    </header>
  );
};
