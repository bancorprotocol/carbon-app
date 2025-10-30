import { FC } from 'react';
import { Link, useRouterState, useMatchRoute } from 'libs/routing';
import { ReactComponent as IconDots } from 'assets/icons/three-dots.svg';
import { useModal } from 'hooks/useModal';
import { getMenuItems } from 'components/core/menu';
import { useWagmi } from 'libs/wagmi';
import style from './MobileMenu.module.css';

export const MobileMenu: FC = () => {
  const { user } = useWagmi();
  const { pathname } = useRouterState().location;
  const menuItems = getMenuItems(user);
  const match = useMatchRoute();
  const { openModal } = useModal();

  const isSamePageLink = (to: string) => {
    if (pathname.startsWith('/strategies') && to === '/') return true;
    if (pathname.startsWith('/trade') && to.startsWith('/trade')) return true;
    return !!match({ to, search: {}, params: {}, fuzzy: true });
  };

  return (
    <footer className={style.mobileMenu}>
      <nav className="grid grid-flow-col tab-list gap-8 rounded-md w-full">
        {menuItems.map(({ label, href }, index) => {
          const isSamePage = isSamePageLink(href);

          return (
            <Link
              key={index}
              to={href}
              aria-current={isSamePage ? 'page' : 'false'}
              className="px-8 py-4 tab-anchor aria-page:tab-focus text-center"
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        aria-haspopup="true"
        onClick={() => openModal('burgerMenu', undefined)}
        className="h-30 flex w-24 cursor-pointer items-center hover:text-white"
      >
        <IconDots />
      </button>
    </footer>
  );
};
