import { GradientEncodedOrderBNStr } from '@bancor/carbon-sdk';

export interface StrategiesSearchParams {
  page?: number;
  pageSize?: number;
}

export interface StaticOrderAPI {
  budget: string;
  min: string;
  max: string;
  marginal: string;
}
export interface GradientOrderAPI {
  budget: string;
  startDate: string;
  endDate: string;
  startPrice: string;
  endPrice: string;
  marginal: string;
}

interface EncodedOrderStr {
  y: string;
  z: string;
  A: string;
  B: string;
}

type EncodedOrder<Order extends GradientOrderAPI | StaticOrderAPI> =
  Order extends StaticOrderAPI ? EncodedOrderStr : GradientEncodedOrderBNStr;

export interface StrategyAPI<Order extends GradientOrderAPI | StaticOrderAPI> {
  id: string;
  owner: string;
  base: string;
  quote: string;
  buy: Order;
  sell: Order;
  encoded: {
    order0: EncodedOrder<Order>;
    order1: EncodedOrder<Order>;
  };
}

export type AnyStrategyAPI =
  | StrategyAPI<GradientOrderAPI>
  | StrategyAPI<StaticOrderAPI>;

export interface StrategyPagination {
  page: number;
  pageSize: number;
  totalStrategies: number;
  totalPages: number;
  hasMore: boolean;
}

export interface StrategyAPIResult {
  strategies: AnyStrategyAPI[];
  pagination: StrategyPagination;
}

export const isGradientStrategyAPI = (
  s: AnyStrategyAPI,
): s is StrategyAPI<GradientOrderAPI> => {
  return 'startDate' in s.buy;
};
