import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { useGetTokenData } from 'queries/chain/token';
import { Button } from 'components/Button';
import { useTokens } from 'tokens';
import { useModal } from 'modals';
import { shortenString } from 'utils/helpers';
import { IconTitleText } from 'components/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { getExplorerLink } from 'utils/blockExplorer';

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

  const blockClasses = 'my-20 h-80 rounded-8';

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

      {isLoading && (
        <div className={`${blockClasses} animate-pulse dark:bg-silver`}></div>
      )}
      {isError && (
        <div
          className={`${blockClasses} flex items-center justify-center dark:bg-error-500/30`}
        >
          Error: No token found for this address
        </div>
      )}
      {data && (
        <div className={`${blockClasses} bg-silver p-16`}>
          <div className={'flex items-center justify-between'}>
            <div className={'font-weight-500'}>{data.symbol}</div>
            <a
              href={getExplorerLink('token', data.address)}
              target={'_blank'}
              className={
                'flex items-center text-14 font-weight-500 text-warning-500'
              }
              rel="noreferrer"
            >
              <span className={'whitespace-nowrap'}>View on Explorer</span>
              <IconLink className={'ml-4 inline-flex h-14'} />
            </a>
          </div>
          <div className={'flex items-center justify-between'}>
            <div className={'text-secondary text-14'}>{data.name}</div>
            <div className={'font-mono text-14'}>
              {shortenString(data.address)}
            </div>
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
