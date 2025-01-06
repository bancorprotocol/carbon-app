import { TokensOverlap } from 'components/common/tokensOverlap';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { Token } from 'libs/tokens';
import { FC, memo } from 'react';
import { TokenLogo } from './imager/Imager';
import { Tooltip } from './tooltip/Tooltip';
import { shortenString } from 'utils/helpers';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { useStore } from 'store';

interface TokenProps {
  token: Token;
}
export const _TokenLogoName: FC<TokenProps> = ({ token }) => {
  return (
    <>
      <TokenLogo token={token} size={30} />
      {token.isSuspicious && <SuspiciousToken />}
      {token.symbol}
    </>
  );
};
export const TokenLogoName = memo(_TokenLogoName, (a, b) => {
  return a.token.address === b.token.address;
});

interface PairProps {
  pair: TradePair;
}

const _PairLogoName: FC<PairProps> = ({ pair: { baseToken, quoteToken } }) => {
  return (
    <>
      <TokensOverlap tokens={[baseToken, quoteToken]} size={30} />
      <PairName baseToken={baseToken} quoteToken={quoteToken} />
    </>
  );
};
export const PairLogoName = memo(_PairLogoName, (a, b) => {
  return (
    a.pair.baseToken.address === b.pair.baseToken.address &&
    a.pair.quoteToken.address === b.pair.quoteToken.address
  );
});

export const PairName: FC<TradePair> = ({ baseToken, quoteToken }) => (
  <>
    <span className="font-weight-500 inline-flex items-center gap-4">
      {baseToken.isSuspicious && <SuspiciousToken />}
      <Tooltip element={<TokenTooltip token={baseToken} />}>
        <span>{baseToken.symbol}</span>
      </Tooltip>
      <span className="text-white/60">/</span>
      {quoteToken.isSuspicious && <SuspiciousToken />}
      <Tooltip element={<TokenTooltip token={quoteToken} />}>
        <span>{quoteToken.symbol}</span>
      </Tooltip>
    </span>
  </>
);

export const SuspiciousToken = () => (
  <WarningWithTooltip tooltipContent="This token is not part of any known token list. Always conduct your own research before trading." />
);

const TokenTooltip: FC<{ token: Token }> = ({ token }) => {
  const { toaster } = useStore();
  const copy = () => {
    navigator.clipboard.writeText(token.address);
    toaster.addToast('Address copied in Clipboard 👍');
  };
  return (
    <div className="flex flex-col gap-4">
      <p>{token.symbol}</p>
      <button
        onClick={copy}
        className="text-14 inline-flex gap-8 text-white/60"
      >
        {shortenString(token.address)}
        <CopyIcon className="size-14" />
      </button>
    </div>
  );
};
