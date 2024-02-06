import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { prettifySignedNumber } from 'utils/helpers';
import { FC, useCallback } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { AnimatedNumber } from './AnimatedNumber';

interface Props {
  quoteToken: Token;
  portfolioGains: number;
}

export const SimulatorSummaryGains: FC<Props> = ({
  portfolioGains,
  quoteToken,
}) => {
  const { selectedFiatCurrency, getFiatValue } = useFiatCurrency(quoteToken);

  const portfolioGainsRounded = portfolioGains.toFixed(2);
  const portfolioGainsFiat = getFiatValue(portfolioGainsRounded);

  const portfolioGainsFormatter = useCallback(
    (portfolioGainsFiat: number) =>
      `${prettifySignedNumber(portfolioGainsFiat, {
        round: true,
      })} ${quoteToken.symbol}`,
    [quoteToken.symbol]
  );

  return (
    <article className="flex flex-col rounded-8">
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono !text-12">
          Estimated Gains
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      <AnimatedNumber
        className="text-24 font-weight-500"
        from={0.0}
        to={portfolioGains}
        formatFn={portfolioGainsFormatter}
        duration={2}
      />
    </article>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <span className="align-middle">TBD.&nbsp;</span>
  </>
);
