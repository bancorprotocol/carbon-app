import { FC } from 'react';
import { Link, useRouterState } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { getMenuItems } from 'components/core/menu';
import { useWagmi } from 'libs/wagmi';

export const MainMenuLeft: FC = () => {
  const { user } = useWagmi();
  const { pathname } = useRouterState().location;
  const menuItems = getMenuItems(user);

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
      className="flex items-center gap-24"
      aria-label="Main"
      data-testid="main-nav"
    >
      <Link to="/">
        <LogoCarbon className="w-34" />
      </Link>

      <div className="hidden md:flex gap-8 tab-list rounded-md">
        {menuItems.map(({ label, href, testid }, index) => {
          const isSamePage = isSamePageLink(href);

          return (
            <Link
              key={index}
              to={href}
              aria-current={isSamePage ? 'page' : 'false'}
              data-testid={testid}
              className="font-title p-8 tab-anchor aria-page:tab-focus"
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
