import { Tooltip } from 'components/common/tooltip/Tooltip';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { formatNumberWithApproximation } from 'utils/helpers';
import { SafeDecimal } from 'libs/safedecimal';

interface Props {
  portfolioRoi?: number[];
}

export const SimulatorSummaryRoi = ({ portfolioRoi }: Props) => {
  const roi = new SafeDecimal(36.25);
  const roiFormatted = formatNumberWithApproximation(roi, {
    isPercentage: true,
    approximateBelow: 0.01,
  });
  const color = roi.gte(0) ? 'text-green' : 'text-red';

  return (
    <article className="flex flex-col rounded-8 border-emphasis">
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-secondary flex items-center gap-4 font-mono !text-12">
          ROI
          <IconTooltip className="h-10 w-10" />
        </h4>
      </Tooltip>
      <p className={`text-24 font-weight-500 ${color}`}>{roiFormatted.value}</p>
    </article>
  );
};

const TooltipContent = () => (
  <>
    <span className="align-middle">TBD.&nbsp;</span>
    <NewTabLink to={externalLinks.roiLearnMore} className="text-green">
      <span className="align-middle">Learn how ROI is calculated.</span>
      <IconLink className="mb-1 inline-block h-14 w-14 align-middle" />
    </NewTabLink>
  </>
);