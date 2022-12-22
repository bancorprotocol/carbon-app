import { Link } from 'routing';
import { menuItems } from '../menuItems';

export const MobileMenu = () => {
  return (
    <div className={`mobile-menu`}>
      {menuItems.map(({ label, href }) => (
        <Link key={label} to={href} className={'px-3 py-3'}>
          {label}
        </Link>
      ))}
    </div>
  );
};
