import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, PathNames, useRouterState } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { isPathnameMatch } from 'utils/helpers';
import { handleOnItemClick } from '../utils';
import { menuItems } from 'components/core/menu';

export const MainMenuLeft: FC = () => {
  const pathname = useRouterState().location.pathname;

  return (
    <nav
      className="flex items-center space-x-24"
      aria-label="Main"
      data-testid="main-nav"
    >
      <Link
        to={PathNames.strategies}
        onClick={() => carbonEvents.navigation.navHomeClick(undefined)}
      >
        <LogoCarbon className={'w-34'} />
      </Link>

      <div className={'hidden space-x-24 md:block'}>
        {menuItems.map(({ label, href, hrefMatches }, index) => {
          const isSamePage = isPathnameMatch(pathname, href, hrefMatches);
          return (
            <Link
              key={index}
              onClick={() => handleOnItemClick(href)}
              to={href}
              aria-current={isSamePage ? 'page' : 'false'}
              className={`px-3 py-3 transition-colors duration-300 ${
                isSamePage ? 'text-white' : 'hover:text-white'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
