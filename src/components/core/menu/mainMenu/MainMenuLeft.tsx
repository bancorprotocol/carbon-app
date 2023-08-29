import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, PathNames, useLocation } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { isPathnameMatch } from 'utils/helpers';
import { handleOnItemClick } from '../utils';
import { menuItems } from 'components/core/menu';

export const MainMenuLeft: FC = () => {
  const location = useLocation();

  return (
    <div>
      <div className={'space-s-24 flex items-center'}>
        <Link
          to={PathNames.strategies}
          onClick={() => carbonEvents.navigation.navHomeClick(undefined)}
        >
          <LogoCarbon className={'w-34'} />
        </Link>

        <div className={'space-s-24 hidden md:block'}>
          {menuItems.map(({ label, href, hrefMatches }) => (
            <Link
              onClick={() => handleOnItemClick(href)}
              key={label}
              to={href}
              className={`px-3 py-3 transition-colors duration-300 ${
                isPathnameMatch(location.current.pathname, href, hrefMatches)
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
