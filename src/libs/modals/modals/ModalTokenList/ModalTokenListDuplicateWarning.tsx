import { Tooltip } from 'components/common/tooltip/Tooltip';
import { NewTabLink } from 'libs/routing';
import { Token } from 'libs/tokens';
import { getExplorerLink } from 'utils/blockExplorer';
import { shortenString } from 'utils/helpers';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC } from 'react';

type Props = {
  token: Token;
};

export const ModalTokenListDuplicateWarning: FC<Props> = ({ token }) => {
  const isNativeToken = token.address === NATIVE_TOKEN_ADDRESS;

  const duplicatedTokenTooltipElement = (token: Token) => {
    if (isNativeToken) return 'This is the native token of the chain.';

    return (
      <>
        <p>
          It appears there might be multiple tokens with the same symbol. Please
          ensure you select the correct address.
          <br /> {token.symbol}:<br />
        </p>
        <div className="flex items-center">
          {token.address}
          <NewTabLink to={getExplorerLink('token', token.address)}>
            <IconLink className="ml-6 w-14 text-white/80" />
          </NewTabLink>
        </div>
      </>
    );
  };

  return (
    <div className="text-12 flex max-w-full truncate py-2 text-white/60">
      {isNativeToken ? 'Native Gas Token' : shortenString(token.address)}
      <Tooltip maxWidth={450} element={duplicatedTokenTooltipElement(token)}>
        <span>
          <IconWarning className="ml-5 size-14 text-white/60" />
        </span>
      </Tooltip>
    </div>
  );
};
