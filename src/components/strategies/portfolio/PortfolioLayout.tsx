import { useBreakpoints } from 'hooks/useBreakpoints';
import { FC, ReactNode } from 'react';

interface Props {
  desktopView: ReactNode;
  mobileView: ReactNode;
  pieChartElement: ReactNode;
  headerElement?: ReactNode;
}

export const PortfolioLayout: FC<Props> = ({
  desktopView,
  mobileView,
  pieChartElement,
  headerElement,
}) => {
  const { belowBreakpoint, currentBreakpoint } = useBreakpoints();

  return (
    <div className="flex flex-col gap-20 md:flex-row grid-area-[list]">
      {!!headerElement && belowBreakpoint('md') && headerElement}

      {pieChartElement}

      <div className="w-full">
        {belowBreakpoint('lg') ? (
          <>
            {!!headerElement && currentBreakpoint === 'md' && headerElement}
            {mobileView}
          </>
        ) : (
          <>
            {headerElement}
            {desktopView}
          </>
        )}
      </div>
    </div>
  );
};
