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

  return (
    <div className="flex rounded-8 border border-emphasis">
      <div className="w-1/2 p-12">
        <div className="text-secondary flex items-center gap-4">
          {'ROI'}
          <Tooltip element={<TooltipContent />}>
            <IconTooltip className="h-10 w-10" />
          </Tooltip>
        </div>
        <div
          className={`text-24 ${
            roiFormatted.negative ? 'text-red' : 'text-green'
          }`}
        >
          {roiFormatted.value}
        </div>
      </div>
    </div>
  );
};

const TooltipContent: FC<{}> = () => (
  <>
    <span className="align-middle">
      {'Total percentage returns of the strategy from its creation. '}
    </span>
    <Link to={externalLinks.roiLearnMore} className="text-green">
      <span className="align-middle">{`Learn how ROI is calculated.`} </span>
      <IconLink className="mb-1 inline-block h-14 w-14 align-middle" />
    </Link>
  </>
);
