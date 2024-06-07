import { StrategySettings } from 'libs/routing';

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
