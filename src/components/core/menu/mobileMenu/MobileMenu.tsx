import { FC } from 'react';
import { Link, useRouterState, useMatchRoute } from 'libs/routing';
import { handleOnItemClick } from '../utils';
import { ReactComponent as IconDots } from 'assets/icons/three-dots.svg';
import { useModal } from 'hooks/useModal';
import { getMenuItems } from 'components/core/menu/getMenuItems';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { endOfDay, getUnixTime, startOfDay, sub } from 'date-fns';
import config from 'config';

export const MobileMenu: FC = () => {
  const { pathname } = useRouterState().location;
  const match = useMatchRoute();
  const { openModal } = useModal();

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
    <footer className="mobile-menu">
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
            className={`px-3 py-3 ${
              isSamePage ? 'text-white' : 'hover:text-white'
            }`}
          >
            {label}
          </Link>
        );
      })}
      <div
        onClick={() => openModal('burgerMenu', undefined)}
        className="h-30 flex w-24 cursor-pointer items-center hover:text-white"
      >
        <IconDots />
      </div>
    </footer>
  );
};
