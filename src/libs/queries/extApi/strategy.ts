export interface StrategiesSearchParams {
  page?: number;
  pageSize?: number;
}

export interface StrategyOrderAPI {
  budget: string;
  min: string;
  max: string;
  marginal: string;
}

interface EncodedOrderStr {
  y: string;
  z: string;
  A: string;
  B: string;
}

export interface StrategyAPI {
  id: string;
  owner: string;
  base: string;
  quote: string;
  buy: StrategyOrderAPI;
  sell: StrategyOrderAPI;
  encoded: {
    order0: EncodedOrderStr;
    order1: EncodedOrderStr;
  };
}

export interface StrategyPagination {
  page: number;
  pageSize: number;
  totalStrategies: number;
  totalPages: number;
  hasMore: boolean;
}

export interface StrategyAPIResult {
  strategies: StrategyAPI[];
  pagination: StrategyPagination;
}
