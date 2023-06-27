import { ModalFC } from 'libs/modals/modals.types';
import { ModalSheet } from 'libs/modals/ModalSheet';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';

export const ModalSheetTest: ModalFC<undefined> = ({ id }) => {
  const { openModal } = useModal();

  return (
    <ModalSheet id={id}>
      <h1>ModalSheetTest {id}</h1>

      <Button onClick={() => openModal('sheetTest', undefined)}>
        Open Sheet Modal
      </Button>
    </ModalSheet>
  );
};
