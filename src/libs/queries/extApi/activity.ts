import { AnyStrategy } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';

export interface ActivityStaticOrder {
  min: string;
  max: string;
  marginal: string;
  budget: string;
}
export interface ActivityGradientOrder {
  _sD_: string;
  _eD_: string;
  _sP_: string;
  _eP_: string;
  marginal: string;
  budget: string;
}

export type RawActivityOrder = ActivityStaticOrder | ActivityGradientOrder;

interface StrategyChanges {
  owner?: string;
  buy?: Partial<ActivityStaticOrder>;
  sell?: Partial<ActivityStaticOrder>;
}
interface BaseActivityStrategy<Order extends RawActivityOrder> {
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
interface RawServerActivity<Order extends RawActivityOrder>
  extends BaseRawActivity {
  strategy: BaseActivityStrategy<Order> & {
    base: string;
    quote: string;
  };
}
export interface Activity extends BaseRawActivity {
  date: Date;
  strategy: AnyStrategy & { owner: string };
}

export type ServerActivity =
  | RawServerActivity<ActivityStaticOrder>
  | RawServerActivity<ActivityGradientOrder>;

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
