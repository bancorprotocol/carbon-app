import { useStore } from 'store';
import { Input, Label } from 'components/common/inputField';

export const DebugOrderBook = () => {
  const {
    orderBook: {
      settings: {
        steps,
        depthChartBuckets,
        orderBookBuckets,
        setSteps,
        setDepthChartBuckets,
        setOrderBookBuckets,
      },
    },
  } = useStore();

  return (
    <div
      className={
        'rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20'
      }
    >
      <h2>Reset to defaults</h2>
      <Label label="Steps">
        <Input
          type="number"
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value))}
          fullWidth
        />
      </Label>

      <Label label="Depth Chart Buckets">
        <Input
          type="number"
          value={depthChartBuckets}
          onChange={(e) => setDepthChartBuckets(parseInt(e.target.value))}
          fullWidth
        />
      </Label>

      <Label label="Order Book Buckets">
        <Input
          type="number"
          value={orderBookBuckets}
          onChange={(e) => setOrderBookBuckets(parseInt(e.target.value))}
          fullWidth
        />
      </Label>
    </div>
  );
};
