import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn } from 'utils/helpers';
import { FC } from 'react';
import { Token } from 'libs/tokens';

interface Props {
  portfolioGains?: number[];
  quoteToken?: Token;
}

export const SimulatorSummaryGains = ({
  portfolioGains,
  quoteToken,
}: Props) => {
  // const quoteFiat = useFiatCurrency(quoteToken);
  // const budgetFormatted = prettifyNumber(
  //   portfolioGains[portfolioGains.length - 1],
  //   {
  //     currentCurrency: quoteFiat.selectedFiatCurrency,
  //   }
  // );

  return (
    <article className={cn('flex flex-col rounded-8')}>
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono !text-12">
          Estimated Gains
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      <p className={`text-24 font-weight-500`}>$235.34</p>
    </article>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <span className="align-middle">
      Total returns of the strategy from its creation.&nbsp;
    </span>
  </>
);
