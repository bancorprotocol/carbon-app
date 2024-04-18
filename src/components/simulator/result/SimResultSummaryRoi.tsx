import { Tooltip } from 'components/common/tooltip/Tooltip';
import { NewTabLink, externalLinks } from 'libs/routing';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { formatNumberWithApproximation } from 'utils/helpers';
import { SafeDecimal } from 'libs/safedecimal';
import { useCallback } from 'react';
import { AnimatedNumber } from 'components/common/AnimatedNumber';

interface Props {
  portfolioRoi: number;
}

export const SimResultSummaryRoi = ({ portfolioRoi }: Props) => {
  const portfolioRoiFormatter = useCallback((portfolioRoi: number) => {
    const roi = new SafeDecimal(portfolioRoi);
    const roiFormatted = formatNumberWithApproximation(roi, {
      isPercentage: true,
      approximateBelow: 0,
    });
    return roiFormatted.value;
  }, []);

  const color = portfolioRoi >= 0 ? 'text-success' : 'text-error';

  return (
    <article className="rounded-8 border-background-800 flex flex-col">
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-12 flex items-center gap-4 text-white/60">
          ROI
          <IconTooltip className="size-10" />
        </h4>
      </Tooltip>
      <AnimatedNumber
        className={`text-24 font-weight-500 ${color}`}
        from={0.0}
        to={portfolioRoi}
        formatFn={portfolioRoiFormatter}
        duration={2}
        data-testid="summary-roi"
      />
    </article>
  );
};

const TooltipContent = () => (
  <>
    <NewTabLink to={externalLinks.roiLearnMore} className="text-primary">
      <span className="align-middle">Learn how ROI is calculated.</span>
      <IconLink className="mb-1 inline-block size-14 align-middle" />
    </NewTabLink>
  </>
);
