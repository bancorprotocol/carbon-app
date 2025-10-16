import { ReactComponent as IconBurger } from 'assets/icons/burger.svg';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useBurgerMenuItems } from './useBurgerMenuItems';

export const MainMenuRightBurger = () => {
  const menu = useBurgerMenuItems();
  return (
    <DropdownMenu
      placement="bottom"
      className="text-16 font-normal rounded-xl p-8 text-white"
      button={(attr) => (
        <button
          {...attr}
          className="btn-secondary-gradient relative p-0 grid size-40 place-items-center"
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
