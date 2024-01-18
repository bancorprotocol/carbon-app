import { useMatchRoute, useRouterState } from '@tanstack/react-router';
import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { handleOnItemClick } from '../utils';
import { menuItems } from 'components/core/menu';

export const MainMenuLeft: FC = () => {
  const { pathname } = useRouterState().location;
  const match = useMatchRoute();

  return (
    <nav
      className="flex items-center space-x-24"
      aria-label="Main"
      data-testid="main-nav"
    >
      <Link
        to={'/'}
        onClick={() => carbonEvents.navigation.navHomeClick(undefined)}
      >
        <LogoCarbon className={'w-34'} />
      </Link>

      <div className={'hidden space-x-24 md:block'}>
        {menuItems.map(({ label, href }, index) => {
          let isSamePage = match({
            to: href,
            search: {},
            params: {},
            fuzzy: true,
          });
          if (pathname.startsWith('/strategies') && href === '/') {
            isSamePage = true;
          }

          return (
            <Link
              key={index}
              onClick={() => handleOnItemClick(href)}
              to={href}
              // TODO: fix this
              params={{}}
              search={{}}
              aria-current={isSamePage ? 'page' : 'false'}
              className={`px-3 py-3 transition-colors duration-300 ${
                isSamePage !== false ? 'text-white' : 'hover:text-white'
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
