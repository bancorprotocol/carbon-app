import { useBurgerMenuItems } from 'components/core/menu/mainMenu/MainMenuRightBurger/useBurgerMenuItems';
import { ModalProps } from 'libs/modals/modals.types';
import { Modal, ModalHeader } from '../Modal';

export default function ModalBurgerMenu({ id }: ModalProps) {
  const menu = useBurgerMenuItems();
  return (
    <Modal id={id} placement="side" className="grid content-start">
      <ModalHeader id={id} />
      <div role="menu" className="grid">
        {menu}
      </div>
    </Modal>
  );
}
