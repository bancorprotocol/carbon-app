import { FC } from 'react';
import { menuItems } from 'components/core/menu/index';
import { Link, PathNames, useLocation } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { carbonEvents } from 'services/googleTagManager';
import { handleOnItemClick } from '../utils';

export const MainMenuLeft: FC = () => {
  const location = useLocation();

  return (
    <div>
      <div className={'flex items-center space-x-24'}>
        <Link
          to={PathNames.strategies}
          onClick={() => carbonEvents.navigation.navHomeClick(undefined)}
        >
          <LogoCarbon className={'w-34'} />
        </Link>

        <div className={'hidden space-x-24 md:block'}>
          {menuItems.map(({ label, href }) => (
            <Link
              onClick={() => handleOnItemClick(href)}
              key={label}
              to={href}
              className={`px-3 py-3 transition-colors duration-300 ${
                href === location.current.pathname
                  ? 'text-white'
                  : 'hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
