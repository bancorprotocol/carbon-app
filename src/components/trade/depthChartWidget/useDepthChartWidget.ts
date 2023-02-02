import { OrderRow, useGetOrderBook } from 'libs/queries/sdk/orderBook';

export const useDepthChartWidget = (base?: string, quote?: string) => {
  const { data } = useGetOrderBook(base, quote);

  const getOrders = (orders?: OrderRow[]) => {
    return orders?.map(({ rate, total }) => {
      return [+rate, +total];
    });
  };
  return {
    buyOrders: getOrders(data?.buyOrders),
    sellOrders: getOrders(data?.sellOrders),
  };
};
