import { Link, useLocation } from 'libs/routing';
import { menuItems } from 'components/core/menu/menuItems';
import { handleOnItemClick } from '../utils';
import { ReactComponent as IconDots } from 'assets/icons/three-dots.svg';
import { useModal } from 'hooks/useModal';

export const MobileMenu = () => {
  const location = useLocation();
  const { openModal } = useModal();

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
      <div
        onClick={() => openModal('burgerMenu', undefined)}
        className="flex h-30 cursor-pointer items-center hover:text-white"
      >
        <IconDots className="h-5 w-min" />
      </div>
    </div>
  );
};
