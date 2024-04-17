import { TokensOverlap } from 'components/common/tokensOverlap';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { FC } from 'react';

const suspiciousTokenTooltipMsg =
  'This token is not part of any known token list. Always conduct your own research before trading.';

interface Props {
  pair: TradePair;
}

export const PairLogoName: FC<Props> = ({
  pair: { baseToken, quoteToken },
}) => {
  return (
    <>
      <TokensOverlap tokens={[baseToken, quoteToken]} size={30} />
      <p className="font-weight-500 flex items-center gap-4">
        {baseToken.symbol}
        {baseToken.isSuspicious && (
          <WarningWithTooltip tooltipContent={suspiciousTokenTooltipMsg} />
        )}
        <span className="text-white/60">/</span>
        {quoteToken.symbol}
        {quoteToken.isSuspicious && (
          <WarningWithTooltip tooltipContent={suspiciousTokenTooltipMsg} />
        )}
      </p>
    </>
  );
};
