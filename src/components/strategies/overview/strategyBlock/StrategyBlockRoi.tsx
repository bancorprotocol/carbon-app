import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn, formatNumberWithApproximation } from 'utils/helpers';
import { Strategy } from 'libs/queries';

interface Props {
  strategy: Strategy;
}

export const StrategyBlockRoi: FC<Props> = ({ strategy }) => {
  const roi = strategy.roi;
  const roiFormatted = formatNumberWithApproximation(roi, {
    isPercentage: true,
    approximateBelow: 0.01,
  });
  const color = roi.gte(0) ? 'text-success' : 'text-error';

  return (
    <article
      className={cn(
        'rounded-8 border-background-800 flex flex-col border-2 p-16',
        strategy.status === 'active' ? '' : 'opacity-50'
      )}
    >
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-12 flex items-center gap-4 font-mono text-white/60">
          ROI
          <IconTooltip className="size-10" />
        </h4>
      </Tooltip>
      <p className={`text-18 font-weight-500 ${color}`}>{roiFormatted.value}</p>
    </article>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <span className="align-middle">
      Total percentage returns of the strategy from its creation as compared to
      HODL.&nbsp;
    </span>
    <NewTabLink to={externalLinks.roiLearnMore} className="text-primary">
      <span className="align-middle">Learn how ROI is calculated.</span>
      <IconLink className="size-14 mb-1 inline-block align-middle" />
    </NewTabLink>
  </>
);
