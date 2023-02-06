import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

const Chart = (props: any) => {
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
