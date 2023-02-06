import { OrderRow, useGetOrderBook } from 'libs/queries/sdk/orderBook';

export const useDepthChartWidget = (base?: string, quote?: string) => {
  const { data } = useGetOrderBook(base, quote);

  const getOrders = (orders?: OrderRow[]) => {
    return [...(orders || [])].splice(0, 50).map(({ rate, total }) => {
      return [+rate, +total];
    });
  };

  return {
    buyOrders: getOrders(data?.buy),
    sellOrders: getOrders(data?.sell),
  };
};
