import { StrategyDirection, StrategySettings } from 'libs/routing';
import { Token } from 'libs/tokens';
import { EncodedStrategyBNStr } from '@bancor/carbon-sdk';
import { SafeDecimal } from 'libs/safedecimal';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';

export interface StrategySearch {
  chartStart?: string;
  chartEnd?: string;
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

// ORDERS
export type Order = GradientOrder | StaticOrder;
export type FormOrder = FormGradientOrder | FormStaticOrder;

export interface StaticOrder {
  budget: string;
  min: string;
  max: string;
  marginalPrice: string;
}

export interface FormStaticOrder {
  budget: string;
  min: string;
  max: string;
  marginalPrice?: string | MarginalPriceOptions;
}

export interface EditOrders {
  buy: FormStaticOrder;
  sell: FormStaticOrder;
}

export interface OrderBlock extends FormStaticOrder {
  settings: StrategySettings;
  direction?: StrategyDirection;
}

export interface EditOrderBlock extends OrderBlock {
  action: 'deposit' | 'withdraw';
}

export interface CreateOverlappingOrder extends FormStaticOrder {
  marginalPrice: string;
}

export interface GradientOrder {
  _sP_: string;
  _eP_: string;
  _sD_: string;
  _eD_: string;
  budget: string;
  marginalPrice: string;
}

export interface FormGradientOrder {
  _sP_: string;
  _eP_: string;
  _sD_: string;
  _eD_: string;
  budget: string;
  marginalPrice?: string;
}

export interface GradientOrderBlock extends FormGradientOrder {
  direction: StrategyDirection;
}

export interface QuickGradientOrderBlock {
  _sP_: string;
  _eP_: string;
  deltaTime: string;
  budget: string;
  marginalPrice?: string;
  direction: StrategyDirection;
}

// STRATEGIES
export type StrategyStatus = 'active' | 'noBudget' | 'paused' | 'inactive';
export interface BuySellOrders<T extends FormOrder = StaticOrder> {
  buy: T;
  sell: T;
}

export interface BaseStrategy<T extends Order = StaticOrder>
  extends BuySellOrders<T> {
  base: Token;
  quote: Token;
}
export type StaticBaseStrategy = BaseStrategy<StaticOrder>;
export type GradientBaseStrategy = BaseStrategy<GradientOrder>;

export interface Strategy<T extends Order = StaticOrder>
  extends BaseStrategy<T> {
  type: T extends StaticOrder ? 'static' : 'gradient';
  id: string;
  idDisplay: string;
  status: StrategyStatus;
  encoded: EncodedStrategyBNStr;
}

export interface StrategyWithFiat<T extends Order = StaticOrder>
  extends Strategy<T> {
  fiatBudget: {
    total: SafeDecimal;
    quote: SafeDecimal;
    base: SafeDecimal;
  };
  tradeCount: number;
  tradeCount24h: number;
}

export interface CartStrategy<T extends Order = StaticOrder>
  extends BaseStrategy<T> {
  id: string;
  fiatBudget: {
    total: SafeDecimal;
    quote: SafeDecimal;
    base: SafeDecimal;
  };
}

export interface CartStrategyStorage<T extends Order> {
  id: string;
  base: string;
  quote: string;
  buy: T;
  sell: T;
}

/** Used to narrow down type in a if statement */
export type AnyBaseStrategy =
  | BaseStrategy<StaticOrder>
  | BaseStrategy<GradientOrder>;
export type AnyStrategy = Strategy<StaticOrder> | Strategy<GradientOrder>;
export type AnyStrategyWithFiat =
  | StrategyWithFiat<StaticOrder>
  | StrategyWithFiat<GradientOrder>;
export type AnyCartStrategy =
  | CartStrategy<StaticOrder>
  | CartStrategy<GradientOrder>;
export type AnyCartStrategyStorage =
  | CartStrategyStorage<StaticOrder>
  | CartStrategyStorage<GradientOrder>;
