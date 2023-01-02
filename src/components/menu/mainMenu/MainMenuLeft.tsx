import { FC } from 'react';
import { menuItems } from 'components/menu';
import { Link } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';

export const MainMenuLeft: FC = () => {
  return (
    <div className={'flex items-center space-x-24'}>
      <LogoCarbon className={'w-34'} />
      <div className={'hidden space-x-24 md:block'}>
        {menuItems.map(({ label, href }) => (
          <Link key={label} to={href} className={'px-3 py-3'}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};
