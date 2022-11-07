import { FC } from 'react';
import { ReactComponent as IconHamburger } from 'assets/icons/hamburger.svg';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { MainMenuRightWallet } from 'elements/menu/mainMenu/MainMenuRightWallet';
import { Button } from 'components/Button';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <IconBell className={'w-[18px]'} />
      <IconHamburger className={'w-[17px]'} />
      <Button className="hidden md:block" variant={'tertiary'}>
        1000 BNT<span className={'px-3'}>|</span>Level 1
      </Button>
      <MainMenuRightWallet />
    </div>
  );
};
