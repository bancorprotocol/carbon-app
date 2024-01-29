import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn, prettifyNumber } from 'utils/helpers';
import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

interface Props {
  quoteToken: Token;
  portfolioGains: number;
}

export const SimulatorSummaryGains = ({
  portfolioGains,
  quoteToken,
}: Props) => {
  const quoteFiat = useFiatCurrency(quoteToken);
  const budgetFormatted = prettifyNumber(portfolioGains, {
    currentCurrency: quoteFiat.selectedFiatCurrency,
  });

  return (
    <article className={cn('flex flex-col rounded-8')}>
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono !text-12">
          Estimated Gains
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      <p className={`text-24 font-weight-500`}>{budgetFormatted}</p>
    </article>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <span className="align-middle">TBD.&nbsp;</span>
  </>
);
