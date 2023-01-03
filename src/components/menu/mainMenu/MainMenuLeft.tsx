import { FC } from 'react';
import { menuItems } from 'components/menu';
import { Link, PathNames, useLocation } from 'libs/routing';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';

export const MainMenuLeft: FC = () => {
  const location = useLocation();

  return (
    <div>
      <div className={'flex items-center space-x-24'}>
        <Link to={PathNames.strategies}>
          <LogoCarbon className={'w-34'} />
        </Link>

        <div className={'hidden space-x-24 md:block'}>
          {menuItems.map(({ label, href }) => (
            <Link
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
