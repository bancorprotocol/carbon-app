import { Link, useLocation } from 'libs/routing';
import { menuItems } from 'components/core/menu/menuItems';
import { handleOnItemClick } from '../utils';

export const MobileMenu = () => {
  const location = useLocation();

  return (
    <div className={`mobile-menu`}>
      {menuItems.map(({ label, href }) => (
        <Link
          key={label}
          onClick={() => handleOnItemClick(href)}
          to={href}
          className={`px-3 py-3 ${
            href === location.current.pathname
              ? 'text-white'
              : 'hover:text-white'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};
