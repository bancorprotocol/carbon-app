import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';

export const ModalBurgerMenu: ModalFC<undefined> = ({ id }) => {
  return (
    <ModalSlideOver id={id} size={'md'}>
      <div>check</div>
    </ModalSlideOver>
  );
};
