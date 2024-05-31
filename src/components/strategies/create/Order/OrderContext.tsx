import { StrategySettings } from 'libs/routing';

export interface Order {
  min: string;
  max: string;
  budget: string;
  marginalPrice?: string;
  settings: StrategySettings;
}
export interface OverlappingOrder {
  min: string;
  max: string;
  budget: string;
  marginalPrice: string;
}
