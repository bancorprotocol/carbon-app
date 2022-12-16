import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { useGetTokenData } from 'queries/chain/token';
import { Button } from 'components/Button';
import { useTokens } from 'tokens';
import { useModal } from 'modals';
import { shortenString } from 'utils/helpers';

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
      <div className={'mt-40 space-y-20 text-center'}>
        <h2>Trade at your own risk</h2>
        <p className={'text-14'}>
          This token doesn't appear on the active token list. Anyone can create
          a token, including fake versions of existing tokens that claim to
          represent projects.
        </p>
      </div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && (
        <div className={'my-20 space-y-6 rounded-8 bg-silver p-16'}>
          <div className={'flex justify-between'}>
            <div>{data.symbol}</div>
            <div>View on Explorer</div>
          </div>
          <div className={'flex justify-between'}>
            <div className={'text-secondary'}>{data.name}</div>
            <div>{shortenString(data.address)}</div>
          </div>
        </div>
      )}
      <Button
        variant={'secondary'}
        fullWidth
        onClick={onClick}
        disabled={isLoading || isError}
      >
        Import Token
      </Button>
    </Modal>
  );
};
