import { FC } from 'react';
import { menuItems } from 'elements/menu';
import { Link } from 'routing';
import { DropdownMenu } from 'components/DropdownMenu';
import { ReactComponent as LogoCarbon } from 'assets/logos/carbon.svg';

export const MainMenuLeft: FC = () => {
  return (
    <div className={'flex items-center space-x-24'}>
      <LogoCarbon className={'w-34'} />
      <div className={'space-x-24'}>
        {menuItems.map(({ label, href }) => (
          <Link key={label} to={href} className={'px-3 py-3'}>
            {label}
          </Link>
        ))}
      </div>
      <DropdownMenu button={'Menu'}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </DropdownMenu>
    </div>
  );
};
