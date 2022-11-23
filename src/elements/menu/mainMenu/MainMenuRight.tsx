import { FC } from 'react';
import { Link, PathNames } from 'routing';
import { ReactComponent as IconHamburger } from 'assets/icons/hamburger.svg';
import { ReactComponent as IconBell } from 'assets/icons/bell.svg';
import { MainMenuRightWallet } from 'elements/menu/mainMenu/MainMenuRightWallet';
import { Button } from 'components/Button';
import { MainMenuRightModals } from 'elements/menu/mainMenu/MainMenuRightModals';

export const MainMenuRight: FC = () => {
  return (
    <div className={'flex items-center space-x-20'}>
      <MainMenuRightModals />
      <IconBell className={'w-[18px]'} />
      <IconHamburger className={'w-[17px]'} />
      <Link to={PathNames.bnt}>
        <Button className="hidden md:block" variant={'tertiary'}>
          1000 BNT<span className={'px-3'}>|</span>Level 1
        </Button>
      </Link>
      <MainMenuRightWallet />
    </div>
  );
};
