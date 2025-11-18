import { useBurgerMenuItems } from 'components/core/menu/mainMenu/MainMenuRightBurger/useBurgerMenuItems';
import { ModalFC } from 'libs/modals/modals.types';
import { Modal, ModalHeader } from '../Modal';

export const ModalBurgerMenu: ModalFC<undefined> = ({ id }) => {
  const menu = useBurgerMenuItems();
  return (
    <Modal id={id} placement="side" className="grid content-start">
      <ModalHeader id={id} />
      <div role="menu" className="grid">
        {menu}
      </div>
    </Modal>
  );
};
