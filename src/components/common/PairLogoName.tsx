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
      <TokensOverlap className="h-30 w-30" tokens={[baseToken, quoteToken]} />
      <span className={'flex font-weight-500'}>
        {baseToken.symbol}
        {baseToken.isSuspicious && (
          <WarningWithTooltip
            className="ml-5"
            tooltipContent={suspiciousTokenTooltipMsg}
          />
        )}
        <span className="px-5 text-white/60">/</span>
        {quoteToken.symbol}
        {quoteToken.isSuspicious && (
          <WarningWithTooltip
            className="ml-5"
            tooltipContent={suspiciousTokenTooltipMsg}
          />
        )}
      </span>
    </>
  );
};
