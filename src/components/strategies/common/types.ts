import { StrategyDirection, StrategySettings } from 'libs/routing';

export interface BaseOrder {
  min: string;
  max: string;
  marginalPrice?: string;
  budget: string;
}

export interface OverlappingOrder extends BaseOrder {
  marginalPrice: string;
}

export interface OrderBlock extends BaseOrder {
  settings: StrategySettings;
}
export interface EditOrderBlock extends OrderBlock {
  action: 'deposit' | 'withdraw';
}

export interface StrategySearch {
  priceStart?: string;
  priceEnd?: string;
}

export interface OverlappingSearch extends StrategySearch {
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  anchor?: StrategyDirection;
  budget?: string;
  chartType?: 'history' | 'range';
}
