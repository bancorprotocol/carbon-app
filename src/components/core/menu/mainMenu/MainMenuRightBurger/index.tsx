import IconBurger from 'assets/icons/burger.svg?react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useBurgerMenuItems } from './useBurgerMenuItems';

export const MainMenuRightBurger = () => {
  const menu = useBurgerMenuItems();
  return (
    <DropdownMenu
      placement="bottom"
      className="text-16 font-normal rounded-xl p-8 text-main-0"
      button={(attr) => (
        <button
          {...attr}
          className="btn-on-background relative p-0 grid size-40 place-items-center"
        >
          <IconBurger className="size-14" />
        </button>
      )}
    >
      <div role="menu" className="grid">
        {menu}
      </div>
    </DropdownMenu>
  );
};
