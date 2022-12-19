import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { useGetTokenData } from 'queries/chain/token';
import { Button } from 'components/Button';
import { useTokens } from 'tokens';
import { useModal } from 'modals';
import { shortenString } from 'utils/helpers';
import { IconTitleText } from 'components/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { getExplorerLink } from '../../utils/blockExplorer';

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
      <div className={'mt-40'}>
        <IconTitleText
          variant={'warning'}
          icon={<IconWarning />}
          title={'Use at your own risk'}
          text={
            "This token doesn't appear on the active token list. Anyone can create a token, including fake versions of existing tokens that claim to represent projects."
          }
        />
      </div>

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      {data && (
        <div className={'my-20 rounded-8 bg-silver p-16'}>
          <div className={'flex items-end justify-between'}>
            <div>{data.symbol}</div>
            <a
              href={getExplorerLink('token', data.address)}
              target={'_blank'}
              className={'font-weight-500 text-warning-500'}
              rel="noreferrer"
            >
              View on Explorer
            </a>
          </div>
          <div className={'flex items-center justify-between'}>
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
      <Button
        variant={'tertiary'}
        fullWidth
        onClick={() => closeModal(id)}
        className={'mt-16'}
      >
        Cancel
      </Button>
    </Modal>
  );
};
