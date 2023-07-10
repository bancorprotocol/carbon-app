import { Highcharts, HighchartsReact, Options } from 'libs/charts';
import { ReactNode } from 'react';

export const PortfolioPieChart = ({
  centerElement,
  options,
}: {
  centerElement?: ReactNode;
  options?: Options;
}) => {
  return (
    <div
      className={
        'relative aspect-square w-full flex-shrink-0 rounded-10 bg-silver md:h-[400px] md:w-[400px]'
      }
    >
      <div
        className={'absolute flex h-full w-full items-center justify-center'}
      >
        {centerElement}
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
