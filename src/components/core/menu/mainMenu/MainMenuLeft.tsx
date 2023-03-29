import { FC } from 'react';
import { menuItems } from 'components/core/menu/index';
import { Link, PathNames, useLocation } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';
import { sendEvent } from 'services/googleTagManager';

export const MainMenuLeft: FC = () => {
  const location = useLocation();

  const handleOnItemClick = (href: string) => {
    href === PathNames.strategies &&
      sendEvent('navigation', 'nav_strategy_click', undefined);
    href === PathNames.trade &&
      sendEvent('navigation', 'nav_trade_click', undefined);
  };

  return (
    <div>
      <div className={'flex items-center space-x-24'}>
        <Link
          to={PathNames.strategies}
          onClick={() => sendEvent('navigation', 'nav_home_click', undefined)}
        >
          <LogoCarbon className={'w-34'} />
        </Link>

        <div className={'hidden space-x-24 md:block'}>
          {menuItems.map(({ label, href }) => (
            <Link
              onClick={() => handleOnItemClick(href)}
              key={label}
              to={href}
              className={`px-3 py-3 transition-colors duration-300 ${
                href === location.current.pathname
                  ? 'text-white'
                  : 'hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
