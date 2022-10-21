import { FC } from 'react';
import { MainMenuLeft } from 'elements/mainMenu/MainMenuLeft';
import { MainMenuRight } from 'elements/mainMenu/MainMenuRight';

export const MainMenu: FC = () => {
  return (
    <div
      className={
        'bg-body px-content sticky top-0 flex h-[79px] items-center justify-between'
      }
    >
      <MainMenuLeft />
      <MainMenuRight />
    </div>
  );
};
