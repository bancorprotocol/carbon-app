import { MenuItem } from 'components/core/menu/mainMenu/MainMenuRightBurger/MenuItem';
import {
  MenuType,
  useBurgerMenuItems,
} from 'components/core/menu/mainMenu/MainMenuRightBurger/useBurgerMenuItems';
import { useMenuContext } from 'components/core/menu/mainMenu/MainMenuRightBurger/useMenuContext';
import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { useEffect } from 'react';

export const ModalBurgerMenu: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { menuMapping } = useBurgerMenuItems();

  const { isOpen, menuContext } = useMenuContext<MenuType>({
    mainMenu: 'main',
    menuMapping,
    defaultState: true,
  });

  const currentMenuItems = menuContext.top()?.items;

  useEffect(() => {
    if (!isOpen) {
      closeModal(id);
    }
  }, [isOpen, closeModal, id]);

  return (
    <ModalSlideOver id={id} size={'md'}>
      <div className="mt-10">
        {currentMenuItems?.map((item, index) => {
          return (
            <div
              key={`${index}_${item.content}`}
              className={`border-grey5 py-4 ${
                menuContext.size() === 1
                  ? 'first:border-b-2 last:border-t-2'
                  : ''
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
      </div>
    </ModalSlideOver>
  );
};
