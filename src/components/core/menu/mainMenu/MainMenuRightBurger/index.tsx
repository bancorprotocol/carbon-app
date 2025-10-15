import { FC } from 'react';
import { ReactComponent as IconBurger } from 'assets/icons/burger.svg';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useMenuContext } from './useMenuContext';
import { Menu, MenuType } from './useBurgerMenuItems';
import { MenuItem } from './MenuItem';

export const MainMenuRightBurger: FC<{
  menuMapping: Map<MenuType, Menu>;
}> = ({ menuMapping }) => {
  const { isOpen, setIsOpen, menuContext } = useMenuContext<MenuType>({
    mainMenu: 'main',
    menuMapping,
  });

  const currentMenuItems = menuContext
    .top()
    ?.items.filter((item) => !!item.content);

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom"
      className="text-16 font-normal rounded-[10px] p-8 text-white"
      button={(attr) => (
        <button
          {...attr}
          className="btn-secondary-gradient relative p-0 grid size-40 place-items-center"
          onClick={(e) => {
            setIsOpen(true);
            attr.onClick(e);
          }}
        >
          <IconBurger className="size-14" />
        </button>
      )}
    >
      <div role="menu" className="grid">
        {currentMenuItems?.map((item, index) => {
          return (
            <MenuItem
              key={`${index}_${item.content}`}
              className="first:border-b last:border-t border-main-700"
              item={{
                ...item,
                hasSubMenu: !!item?.subMenu,
                disableHoverEffect:
                  menuContext.size() === 1 &&
                  index === currentMenuItems.length - 1,
              }}
            />
          );
        })}
      </div>
    </DropdownMenu>
  );
};
