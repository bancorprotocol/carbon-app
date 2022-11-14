import { Link } from 'routing';
import { menuItems } from '../menuItems';

export const MobileMenu = () => {
  return (
    <div
      className={`bg-body fixed bottom-0 z-40 flex h-80 w-full items-center justify-between border-t border-lightGrey px-10 dark:border-darkGrey md:hidden`}
    >
      {menuItems.map(({ label, href }) => (
        <Link key={label} to={href} className={'px-3 py-3'}>
          {label}
        </Link>
      ))}
    </div>
  );
};
