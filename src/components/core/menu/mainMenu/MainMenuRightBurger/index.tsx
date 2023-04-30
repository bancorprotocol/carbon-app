import { FC } from 'react';
import { ReactComponent as IconBurger } from 'assets/icons/burger.svg';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { MenuItem } from './MenuItem';
import { useMenuContext } from './useMenuContext';

export const MainMenuRightBurger: FC = () => {
  const { isOpen, setIsOpen, menuContext } = useMenuContext();
  const currentMenuItems = menuContext.top()?.items;

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="rounded-[10px] py-8 px-8 text-16 font-weight-400 text-white dark:bg-emphasis/100"
      button={(onClick) => (
        <Button
          variant={'secondary'}
          onClick={() => {
            setIsOpen(true);
            onClick();
          }}
          className={'relative !p-0'}
        >
          <span className="flex h-36 w-36 items-center justify-center">
            <span className="relative flex inline-flex h-36 w-36 items-center justify-center rounded-full">
              <IconBurger className="h-14" />
            </span>
          </span>
        </Button>
      )}
    >
      {currentMenuItems?.map((item, index) => {
        return (
          <div
            key={`${index}_${item.content}`}
            className={`border-grey5 ${
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
