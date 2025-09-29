import { FC } from 'react';
import { Link, useRouterState } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { getMenuItems } from 'components/core/menu';

export const MainMenuLeft: FC = () => {
  const menuItems = getMenuItems();
  const { pathname } = useRouterState().location;

  const isSamePageLink = (to: string) => {
    if (to === '/') {
      return pathname.startsWith('/strategies') || pathname === '/';
    }
    if (to.startsWith('/trade')) {
      return pathname.startsWith('/trade');
    }
    return pathname.startsWith(to);
  };

  return (
    <nav
      className="flex items-center space-x-24"
      aria-label="Main"
      data-testid="main-nav"
    >
      <Link to="/">
        <LogoCarbon className="w-34" />
      </Link>

      <div className="hidden md:flex gap-8">
        {menuItems.map(({ label, href, testid }, index) => {
          const isSamePage = isSamePageLink(href);

          return (
            <Link
              key={index}
              to={href}
              aria-current={isSamePage ? 'page' : 'false'}
              data-testid={testid}
              className="font-title aria-page:text-white hover:text-white p-8"
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
