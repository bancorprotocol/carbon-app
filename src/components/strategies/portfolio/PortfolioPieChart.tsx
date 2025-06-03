import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import {
  Highcharts,
  HighchartsReact,
  Options,
  loadHighchart,
} from 'libs/charts';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  centerElement?: ReactNode;
  options?: Options;
  isPending?: boolean;
  hideChart?: boolean;
}

export const PortfolioPieChart = ({
  centerElement,
  options,
  isPending,
  hideChart,
}: Props) => {
  return (
    <div className="rounded-10 bg-background-900 relative aspect-square w-full flex-shrink-0 md:size-[400px]">
      <div className="absolute flex size-full items-center justify-center">
        {isPending ? (
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
            'h-full',
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
              'bg-background-800',
            )}
          >
            <div
              className={cn(
                'w-4/5',
                'rounded-full',
                'h-4/5',
                'bg-background-900',
              )}
            ></div>
          </div>
        </div>
      )}

      {!isPending && !hideChart && <Chart options={options} />}
    </div>
  );
};

interface ChartProps {
  options?: Options;
}
const Chart: FC<ChartProps> = ({ options }) => {
  const [loading, setLoading] = useState(true);
  const highchart = useRef<typeof Highcharts>(null);
  useEffect(() => {
    loadHighchart().then((chart) => {
      highchart.current = chart;
      setLoading(false);
    });
  }, []);
  if (loading) return;
  return <HighchartsReact highcharts={highchart.current} options={options} />;
};
