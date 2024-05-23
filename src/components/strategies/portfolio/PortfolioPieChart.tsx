import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Highcharts, HighchartsReact, Options } from 'libs/charts';
import { ReactNode } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  centerElement?: ReactNode;
  options?: Options;
  isLoading?: boolean;
  hideChart?: boolean;
}

export const PortfolioPieChart = ({
  centerElement,
  options,
  isLoading,
  hideChart,
}: Props) => {
  return (
    <div className="rounded-10 bg-background-900 md:size-[400px] relative aspect-square w-full flex-shrink-0">
      <div className="size-full absolute flex items-center justify-center">
        {isLoading ? (
          <div className="h-[80px]">
            <CarbonLogoLoading />
          </div>
        ) : (
          centerElement
        )}
      </div>

      {hideChart && (
        <div
          className={cn(
            'flex',
            'justify-center',
            'items-center',
            'w-full',
            'h-full'
          )}
        >
          <div
            className={cn(
              'flex',
              'justify-center',
              'items-center',
              'w-4/5',
              'rounded-full',
              'h-4/5',
              'bg-background-800'
            )}
          >
            <div
              className={cn(
                'w-4/5',
                'rounded-full',
                'h-4/5',
                'bg-background-900'
              )}
            ></div>
          </div>
        </div>
      )}

      {!isLoading && !hideChart && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};
