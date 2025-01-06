import { TokensOverlap } from 'components/common/tokensOverlap';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { Token } from 'libs/tokens';
import { FC, memo } from 'react';
import { TokenLogo } from './imager/Imager';

interface TokenProps {
  token: Token;
}
export const _TokenLogoName: FC<TokenProps> = ({ token }) => {
  return (
    <>
      <TokenLogo token={token} size={30} />
      {token.symbol}
      {token.isSuspicious && <SuspiciousToken />}
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
      {baseToken.symbol}
      {baseToken.isSuspicious && <SuspiciousToken />}
      <span className="text-white/60">/</span>
      {quoteToken.symbol}
      {quoteToken.isSuspicious && <SuspiciousToken />}
    </span>
  </>
);

export const SuspiciousToken = () => (
  <WarningWithTooltip tooltipContent="This token is not part of any known token list. Always conduct your own research before trading." />
);
