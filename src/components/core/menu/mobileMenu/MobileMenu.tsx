import { Link, useLocation } from 'libs/routing';
import { isPathnameMatch } from 'utils/helpers';
import { handleOnItemClick } from '../utils';
import { ReactComponent as IconDots } from 'assets/icons/three-dots.svg';
import { useModal } from 'hooks/useModal';
import { menuItems } from 'components/core/menu/menuItems';

export const MobileMenu = () => {
  const location = useLocation();
  const { openModal } = useModal();

  return (
    <footer className={`mobile-menu`}>
      {menuItems.map(({ label, href, hrefMatches }) => (
        <Link
          key={label}
          onClick={() => handleOnItemClick(href)}
          to={href}
          className={`px-3 py-3 ${
            isPathnameMatch(location.current.pathname, href, hrefMatches)
              ? 'text-white'
              : 'hover:text-white'
          }`}
        >
          {label}
        </Link>
      ))}
      <div
        onClick={() => openModal('burgerMenu', undefined)}
        className="flex h-30 w-24 cursor-pointer items-center hover:text-white"
      >
        <IconDots />
      </div>
    </footer>
  );
};
