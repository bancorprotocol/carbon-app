import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Highcharts, HighchartsReact, Options } from 'libs/charts';
import { ReactNode } from 'react';

interface Props {
  centerElement?: ReactNode;
  options?: Options;
  isLoading?: boolean;
}

export const PortfolioPieChart = ({
  centerElement,
  options,
  isLoading,
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

      {!isLoading && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};
