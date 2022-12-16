import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { useGetTokenData } from 'queries/chain/token';
import { Button } from 'components/Button';
import { useTokens } from 'tokens';
import { useModal } from 'modals';

export type ModalImportTokenData = {
  address: string;
};

export const ModalImportToken: ModalFC<ModalImportTokenData> = ({
  id,
  data: { address },
}) => {
  const { closeModal } = useModal();
  const { data, isLoading, isError } = useGetTokenData(address);
  const { importToken } = useTokens();

  const onClick = () => {
    if (!data) {
      return;
    }
    importToken(data);
    closeModal(id);
  };

  return (
    <Modal id={id} title={'Import Token'}>
      <div>{address}</div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <Button fullWidth onClick={onClick}>
        Import Token
      </Button>
    </Modal>
  );
};
