import { Token } from 'libs/tokens';

export interface ActivityStaticOrder {
  min: string;
  max: string;
  budget: string;
}
export interface ActivityGradientOrder {
  _sD_: string;
  _eD_: string;
  _sP_: string;
  _eP_: string;
  budget: string;
}

export type ActivityOrder = ActivityStaticOrder | ActivityGradientOrder;

interface StrategyChanges {
  owner?: string;
  buy?: Partial<ActivityStaticOrder>;
  sell?: Partial<ActivityStaticOrder>;
}
interface BaseActivityStrategy<Order extends ActivityOrder> {
  id: string;
  owner: string;
  buy: Order;
  sell: Order;
}
export type ActivityAction =
  | 'create'
  | 'deposit'
  | 'withdraw'
  | 'edit'
  | 'delete'
  | 'transfer'
  | 'buy'
  | 'sell'
  | 'pause';
export interface BaseRawActivity {
  action: ActivityAction;
  changes?: StrategyChanges;
  blockNumber: number;
  txHash: string;
  timestamp: number;
}
interface RawServerActivity<Order extends ActivityOrder>
  extends BaseRawActivity {
  strategy: BaseActivityStrategy<Order> & {
    base: string;
    quote: string;
  };
}
interface RawAppActivity<Order extends ActivityOrder> extends BaseRawActivity {
  date: Date;
  strategy: BaseActivityStrategy<Order> & {
    type: Order extends ActivityGradientOrder ? 'gradient' : 'static';
    base: Token;
    quote: Token;
  };
}

export type ServerActivity =
  | RawServerActivity<ActivityStaticOrder>
  | RawServerActivity<ActivityGradientOrder>;
export type Activity =
  | RawAppActivity<ActivityStaticOrder>
  | RawAppActivity<ActivityGradientOrder>;

export interface QueryActivityParams {
  ownerId?: string;
  token0?: string;
  token1?: string;
  strategyIds?: string;
  pairs?: string;
  actions?: string;
  limit?: number;
  offset?: number;
  start?: string | number;
  end?: string | number;
}

interface RawActivityMeta<T extends string | Token> {
  size: number;
  actions: ActivityAction[];
  strategies: Record<string, [T, T]>;
  pairs: [T, T][];
}
export type ServerActivityMeta = RawActivityMeta<string>;
export type ActivityMeta = RawActivityMeta<Token>;
