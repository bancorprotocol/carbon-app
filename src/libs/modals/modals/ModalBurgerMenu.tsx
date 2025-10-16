import { useBurgerMenuItems } from 'components/core/menu/mainMenu/MainMenuRightBurger/useBurgerMenuItems';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';

export const ModalBurgerMenu: ModalFC<undefined> = ({ id }) => {
  const menu = useBurgerMenuItems();
  return (
    <ModalSlideOver id={id}>
      <div role="menu" className="grid">
        {menu}
      </div>
    </ModalSlideOver>
  );
};
