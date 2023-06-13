import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, PathNames, useLocation } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { handleOnItemClick } from '../utils';
import { useMenuItems } from '../useMenuItems';

export const MainMenuLeft: FC = () => {
  const location = useLocation();
  const { menuItems } = useMenuItems();

  return (
    <div>
      <div className={'flex items-center space-s-24'}>
        <Link
          to={PathNames.strategies}
          onClick={() => carbonEvents.navigation.navHomeClick(undefined)}
        >
          <LogoCarbon className={'w-34'} />
        </Link>

        <div className={'hidden space-s-24 md:block'}>
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
