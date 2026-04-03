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

export interface StrategyAPI {
  id: string;
  owner: string;
  base: string;
  quote: string;
  buy: StrategyOrderAPI;
  sell: StrategyOrderAPI;
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
