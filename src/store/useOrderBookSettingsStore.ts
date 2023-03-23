import { useState } from 'react';

export interface OrderBookSettingsStore {
  steps: number;
  setSteps: (value: number) => void;
  orderBookBuckets: number;
  setOrderBookBuckets: (value: number) => void;
  depthChartBuckets: number;
  setDepthChartBuckets: (value: number) => void;
}

export const useOrderBookSettingsStore = (): OrderBookSettingsStore => {
  const [steps, setSteps] = useState(98);
  const [depthChartBuckets, setDepthChartBuckets] = useState(98);
  const [orderBookBuckets, setOrderBookBuckets] = useState(14);

  return {
    steps,
    setSteps,
    orderBookBuckets,
    setOrderBookBuckets,
    depthChartBuckets,
    setDepthChartBuckets,
  };
};

export const defaultOrderBookSettingsStore: OrderBookSettingsStore = {
  steps: 98,
  setSteps: () => {},
  depthChartBuckets: 98,
  setDepthChartBuckets: () => {},
  orderBookBuckets: 14,
  setOrderBookBuckets: () => {},
};
