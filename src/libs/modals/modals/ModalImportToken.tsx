import { ModalFC } from 'libs/modals/modals.types';
import { useGetTokenData } from 'libs/queries/chain/token';
import { Button } from 'components/common/button';
import { useTokens } from 'hooks/useTokens';
import { useModal } from 'hooks/useModal';
import { cn, shortenString } from 'utils/helpers';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { NewTabLink } from 'libs/routing';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalImportTokenData = {
  address: string;
};

export const ModalImportToken: ModalFC<ModalImportTokenData> = ({
  id,
  data: { address },
}) => {
  const { closeModal } = useModal();
  const { data, isPending, isError } = useGetTokenData(address);
  const { importTokens } = useTokens();

  const onClick = () => {
    if (!data) {
      return;
    }
    importTokens([data]);
    closeModal(id);
  };

  const blockClasses = 'my-20 h-80 rounded-8';

  return (
    <ModalOrMobileSheet id={id} title="Import Token">
      <div className="mt-40">
        <IconTitleText
          variant="warning"
          icon={<IconWarning />}
          title="Use at your own risk"
          text="This token doesn't appear on the active token list. Anyone can create a token, including fake versions of existing tokens that claim to represent projects."
        />
      </div>

      {isPending && (
        <div className={cn(blockClasses, 'animate-pulse bg-black')}></div>
      )}
      {isError && (
        <div
          className={cn(
            blockClasses,
            'bg-error/30 flex items-center justify-center',
          )}
        >
          Error: No token found for this address
        </div>
      )}
      {data && (
        <div className={cn(blockClasses, 'bg-background-900 p-16')}>
          <div className="flex items-center justify-between">
            <div className="font-weight-500">{data.symbol}</div>
            <NewTabLink
              to={getExplorerLink('token', data.address)}
              className="text-14 font-weight-500 text-warning flex items-center"
            >
              <span className="whitespace-nowrap">View on Explorer</span>
              <IconLink className="ml-4 inline-flex h-14" />
            </NewTabLink>
          </div>
          <div className="text-14 flex items-center justify-between">
            <div className="text-white/60">{data.name}</div>
            <div>{shortenString(data.address)}</div>
          </div>
        </div>
      )}
      <Button
        variant="white"
        fullWidth
        onClick={onClick}
        disabled={isPending || isError}
      >
        Import Token
      </Button>
      <Button variant="black" fullWidth onClick={() => closeModal(id)}>
        Cancel
      </Button>
    </ModalOrMobileSheet>
  );
};
