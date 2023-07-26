import { FC } from 'react';
import { useRoi } from 'hooks/useRoi';
import BigNumber from 'bignumber.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { externalLinks } from 'libs/routing/routes';
import { Link } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';

export const StrategyBlockRoi: FC<{
  strategyId: string;
}> = ({ strategyId }) => {
  const { strategyRoi } = useRoi(strategyId);
  const roi = strategyRoi?.roi ?? new BigNumber(0);
  const apr = strategyRoi?.apr ?? new BigNumber(0);
  const roiFormatted = formatNumber(roi);
  const aprFormatted = formatNumber(apr);

  return (
    <div className={'flex rounded-8 border border-emphasis'}>
      <div className={'w-1/2 border-r border-emphasis p-12'}>
        <div className={'text-secondary flex items-center gap-4'}>
          {'ROI'}
          <Tooltip element={getTooltipElement(true)}>
            <IconTooltip className={'h-10 w-10'} />
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
      <div className={'w-1/2 p-12'}>
        <div className={'text-secondary flex items-center gap-4'}>
          {`Est. APR`}
          <Tooltip element={getTooltipElement(false)}>
            <IconTooltip className={'h-10 w-10'} />
          </Tooltip>{' '}
        </div>
        <div
          className={`text-24 ${
            aprFormatted.negative ? 'text-red' : 'text-green'
          }`}
        >
          {aprFormatted.value}
        </div>
      </div>
    </div>
  );
};

const getTooltipElement = (roi: boolean) => {
  return (
    <div className={'text-14'}>
      <span className={'align-middle '}>
        {roi
          ? 'Total returns of the strategy from the creation. '
          : 'Using the daily average ROI to estimate yearly returns. '}
      </span>
      <Link to={externalLinks.roiLearnMore} className={'text-green'}>
        <span className={'align-middle'}>
          {`Learn how ${roi ? 'ROI' : 'APR'} is calculated.`}{' '}
        </span>
        <IconLink className={'mb-1 inline-block h-14 w-14 align-middle'} />
      </Link>
    </div>
  );
};

const formatNumber = (num: BigNumber): { value: string; negative: boolean } => {
  if (num.isZero()) {
    return { value: '0%', negative: false };
  } else if (num.gt(0) && num.lt(0.01)) {
    return { value: '< 0.01%', negative: false };
  } else if (num.gte(0.01)) {
    return { value: num.toFormat(2) + '%', negative: false };
  } else if (num.gt(-0.01)) {
    return { value: '> -0.01%', negative: true };
  } else {
    return { value: num.toFormat(1) + '%', negative: true };
  }
};
