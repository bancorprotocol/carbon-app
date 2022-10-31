import { FC } from 'react';
import { ReactComponent as IconHamburger } from 'assets/icons/hamburger.svg';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { MainMenuRightWallet } from 'elements/menu/mainMenu/MainMenuRightWallet';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-5'}>
      <IconBell className={'w-[18px]'} />
      <IconHamburger className={'w-[17px]'} />
      <button className={'rounded-full border border-gray-600 px-6 py-2'}>
        1000 BNT<span className={'px-3'}>|</span>Level 1
      </button>
      <MainMenuRightWallet />
    </div>
  );
};
