import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, useMatchRoute, useRouterState } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { handleOnItemClick } from 'components/core/menu/utils';
import { menuItems } from 'components/core/menu';

export const MainMenuLeft: FC = () => {
  const { pathname } = useRouterState().location;
  const match = useMatchRoute();

  const isSamePageLink = (to: string) => {
    if (pathname.startsWith('/strategies') && to === '/') return true;
    if (pathname.startsWith('/trade') && to.startsWith('/trade')) return true;
    return !!match({ to, search: {}, params: {}, fuzzy: true });
  };

  return (
    <nav
      className="flex items-center space-x-24"
      aria-label="Main"
      data-testid="main-nav"
    >
      <Link
        to="/"
        onClick={() => carbonEvents.navigation.navHomeClick(undefined)}
      >
        <LogoCarbon className="w-34" />
      </Link>

      <div className="hidden space-x-24 md:block">
        {menuItems.map(({ label, href, testid }, index) => {
          const isSamePage = isSamePageLink(href);

          return (
            <Link
              key={index}
              onClick={() => handleOnItemClick(href)}
              to={href}
              aria-current={isSamePage ? 'page' : 'false'}
              data-testid={testid}
              className={`font-title px-3 py-3 transition-colors duration-300 ${
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
