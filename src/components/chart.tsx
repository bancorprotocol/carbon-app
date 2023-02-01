import { AdvancedChart } from 'react-tradingview-embed';

const Chart = ({ symbol }: { symbol: string }) => {
  return (
    <div>
      <AdvancedChart widgetProps={{ theme: 'dark', symbol }} />
    </div>
  );
};

export default Chart;
