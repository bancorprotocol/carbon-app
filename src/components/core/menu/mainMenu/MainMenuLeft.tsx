import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, useMatchRoute, useRouterState } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { handleOnItemClick } from 'components/core/menu/utils';
import { getMenuItems } from 'components/core/menu';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { endOfDay, getUnixTime, startOfDay, sub } from 'date-fns';
import config from 'config';

export const MainMenuLeft: FC = () => {
  const { pathname } = useRouterState().location;
  const match = useMatchRoute();

  const start = getUnixTime(
    startOfDay(sub(new Date(), { days: 364 }))
  ).toString();
  const end = getUnixTime(endOfDay(new Date())).toString();
  const { isLoading, isError } = useGetTokenPriceHistory({
    baseToken: config.defaultTokenPair[0],
    quoteToken: config.defaultTokenPair[1],
    start,
    end,
  });
  const noPriceHistory = isLoading || isError;
  const menuItems = getMenuItems(noPriceHistory);

  const isSamePageLink = (to: string) => {
    if (pathname.startsWith('/strategies') && to === '/') return true;
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
        {menuItems.map(({ label, href }, index) => {
          const isSamePage = isSamePageLink(href);

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
