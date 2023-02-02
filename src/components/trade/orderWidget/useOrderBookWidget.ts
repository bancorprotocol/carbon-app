import { useGetOrderBook } from 'libs/queries/sdk/orderBook';

export const useOrderBookWidget = (base?: string, quote?: string) => {
  const orderBookQuery = useGetOrderBook(base, quote);

  // MANIPULATE DATA HERE

  return orderBookQuery;
};
