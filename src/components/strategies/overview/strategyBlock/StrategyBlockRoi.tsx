import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { externalLinks } from 'libs/routing/routes';
import { Link } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { formatNumberWithApproximation } from 'utils/helpers';

interface Props {
  roi: BigNumber;
}

export const StrategyBlockRoi: FC<Props> = ({ roi }) => {
  const roiFormatted = formatNumberWithApproximation(roi, {
    isPercentage: true,
    approximateBelow: 0.01,
  });
  const color = roi.gte(0) ? 'text-green' : 'text-red';

  return (
    <article className="flex flex-col rounded-8 border-2 border-emphasis p-16">
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono">
          ROI
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      <p className={`text-18 font-weight-500 ${color}`}>{roiFormatted.value}</p>
    </article>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <span className="align-middle">
      Total percentage returns of the strategy from its creation.
    </span>
    <Link to={externalLinks.roiLearnMore} className="text-green">
      <span className="align-middle">Learn how ROI is calculated.</span>
      <IconLink className="mb-1 inline-block h-14 w-14 align-middle" />
    </Link>
  </>
);
