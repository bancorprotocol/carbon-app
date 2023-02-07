import {
  AdvancedRealTimeChart,
  AdvancedRealTimeChartProps,
} from 'react-ts-tradingview-widgets';

const Chart = (props: AdvancedRealTimeChartProps) => {
  return (
    <AdvancedRealTimeChart
      {...{
        autosize: true,
        style: '1',
        theme: 'dark',
        interval: 'D',
        ...props,
      }}
    />
  );
};

export default Chart;
