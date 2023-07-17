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
    <div
      className={
        'relative aspect-square w-full flex-shrink-0 rounded-10 bg-silver md:h-[400px] md:w-[400px]'
      }
    >
      <div
        className={'absolute flex h-full w-full items-center justify-center'}
      >
        {isLoading ? (
          <div className={'h-[80px]'}>
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
              'bg-emphasis'
            )}
          >
            <div
              className={cn('w-4/5', 'rounded-full', 'h-4/5', 'bg-silver')}
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
