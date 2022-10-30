import { FC } from 'react';
import { menuItems } from 'elements/menu';
import { Link } from 'routing';

export const MainMenuLeft: FC = () => {
  return (
    <div className={'flex items-center space-x-6'}>
      <div className={'h-[39px] w-[39px] rounded-full bg-purple-400'}></div>
      <div className={'space-x-6'}>
        {menuItems.map(({ label, href }) => (
          <Link key={label} to={href} className={'px-2 py-2'}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};
