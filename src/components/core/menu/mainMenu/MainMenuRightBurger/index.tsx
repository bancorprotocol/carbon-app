import { FC } from 'react';
import { ReactComponent as IconBurger } from 'assets/icons/burger.svg';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { useMenuContext } from './useMenuContext';
import { Menu, MenuType } from './useBurgerMenuItems';
import { MenuItem } from './MenuItem';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { cn } from 'utils/helpers';

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
      className="text-16 font-weight-400 rounded-[10px] p-8 text-white"
      button={(attr) => (
        <button
          {...attr}
          className={cn(buttonStyles({ variant: 'secondary' }), 'relative p-0')}
          onClick={(e) => {
            setIsOpen(true);
            attr.onClick(e);
          }}
        >
          <span className="flex size-36 items-center justify-center">
            <span className="relative inline-flex size-36 items-center justify-center rounded-full">
              <IconBurger className="h-14" />
            </span>
          </span>
        </button>
      )}
    >
      {currentMenuItems?.map((item, index) => {
        return (
          <div
            key={`${index}_${item.content}`}
            className={`border-background-700 ${
              menuContext.size() === 1 ? 'first:border-b-2 last:border-t-2' : ''
            }`}
          >
            <MenuItem
              item={{
                ...item,
                hasSubMenu: !!item?.subMenu,
                disableHoverEffect:
                  menuContext.size() === 1 &&
                  index === currentMenuItems.length - 1,
              }}
            />
          </div>
        );
      })}
    </DropdownMenu>
  );
};
