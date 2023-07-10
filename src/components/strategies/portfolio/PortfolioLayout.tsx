import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  tableElement: ReactNode;
  pieChartElement: ReactNode;
  isLoading: boolean;
  isError?: boolean;
}

export const PortfolioLayout: FC<Props> = ({
  tableElement,
  pieChartElement,
  isError,
  isLoading,
}) => {
  return (
    <>
      {!isLoading && (
        <div className={cn('flex flex-col gap-20 md:flex-row')}>
          {pieChartElement}
          <div className={cn('w-full')}>{tableElement}</div>
        </div>
      )}
    </>
  );
};
