import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  desktopView: ReactNode;
  mobileView: ReactNode;
  pieChartElement: ReactNode;
}

export const PortfolioLayout: FC<Props> = ({
  desktopView,
  mobileView,
  pieChartElement,
}) => {
  const { belowBreakpoint } = useBreakpoints();

  return (
    <div className={cn('flex flex-col gap-20 md:flex-row')}>
      {pieChartElement}
      <div className={cn('w-full')}>
        {belowBreakpoint('lg') ? mobileView : desktopView}
      </div>
    </div>
  );
};
