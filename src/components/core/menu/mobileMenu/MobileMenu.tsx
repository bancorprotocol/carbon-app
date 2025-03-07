import { FC } from 'react';
import { Link, useRouterState, useMatchRoute } from 'libs/routing';
import { ReactComponent as IconDots } from 'assets/icons/three-dots.svg';
import { useModal } from 'hooks/useModal';
import { menuItems } from 'components/core/menu';

export const MobileMenu: FC = () => {
  const { pathname } = useRouterState().location;
  const match = useMatchRoute();
  const { openModal } = useModal();

  const isSamePageLink = (to: string) => {
    if (pathname.startsWith('/strategies') && to === '/') return true;
    if (pathname.startsWith('/trade') && to.startsWith('/trade')) return true;
    return !!match({ to, search: {}, params: {}, fuzzy: true });
  };

  return (
    <footer className="mobile-menu">
      {menuItems.map(({ label, href }, index) => {
        const isSamePage = isSamePageLink(href);

        return (
          <Link
            key={index}
            to={href}
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
