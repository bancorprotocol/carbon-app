import {
  AdvancedChart,
  AdvancedChartWidgetProps,
} from 'react-tradingview-embed';

const Chart = (props: AdvancedChartWidgetProps) => {
  return (
    <div>
      <AdvancedChart widgetProps={{ theme: 'dark', ...props }} />
    </div>
  );
};

export default Chart;
