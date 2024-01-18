import { useMatchRoute } from '@tanstack/react-router';
import { Link, useRouterState } from 'libs/routing';
import { handleOnItemClick } from '../utils';
import { ReactComponent as IconDots } from 'assets/icons/three-dots.svg';
import { useModal } from 'hooks/useModal';
import { menuItems } from 'components/core/menu/menuItems';

export const MobileMenu = () => {
  const { pathname } = useRouterState().location;
  const match = useMatchRoute();
  const { openModal } = useModal();

  return (
    <footer className={`mobile-menu`}>
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
        className="flex h-30 w-24 cursor-pointer items-center hover:text-white"
      >
        <IconDots />
      </div>
    </footer>
  );
};
