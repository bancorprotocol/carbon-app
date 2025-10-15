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

  const currentMenuItems = menuContext
    .top()
    ?.items.filter((item) => !!item.content);

  useEffect(() => {
    if (!isOpen) {
      closeModal(id);
    }
  }, [isOpen, closeModal, id]);

  return (
    <ModalSlideOver id={id}>
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
    </ModalSlideOver>
  );
};
